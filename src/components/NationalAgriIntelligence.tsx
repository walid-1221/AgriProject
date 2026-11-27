import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Compass,
  Filter,
  Layers,
  MapPin,
  PackageCheck,
  Search,
  ShoppingBag,
  Sparkles,
  Sprout,
  TrendingUp,
  Warehouse,
  Wheat
} from 'lucide-react';
import { LanguageMode, ThemeMode } from '../types';
import {
  AgroHubRegion,
  CropDemandMetric,
  ForecastCategory,
  SixMonthForecastItem,
  formatAgriQuantity,
  nationalCropDemandData,
  regionalAgroHubs,
  sixMonthForecastItems,
  sixMonthForecastTimeline,
  toBengaliDigits
} from '../data/agriIntelligenceData';

interface NationalAgriIntelligenceProps {
  lang: LanguageMode;
  theme: ThemeMode;
  onListProduceFromForecast: (item: SixMonthForecastItem) => void;
  onPreBookSupplyFromForecast: (item: SixMonthForecastItem) => void;
}

type StatusFilter = 'ALL' | 'SURPLUS_SELF' | 'DEFICIT_IMPORT' | 'BALANCED_B2B';
type ForecastFilter = 'ALL' | ForecastCategory;

export const NationalAgriIntelligence: React.FC<NationalAgriIntelligenceProps> = ({
  lang,
  theme,
  onListProduceFromForecast,
  onPreBookSupplyFromForecast
}) => {
  const isBn = lang === 'BN';
  const isDark = theme === 'DARK' || theme === 'EARTH';

  // Section A state
  const [unit, setUnit] = useState<'KG' | 'MT'>('MT');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  // Section B state
  const [selectedHubId, setSelectedHubId] = useState<string>(regionalAgroHubs[0].id);
  const [hubCropFilter, setHubCropFilter] = useState<string>('ALL');

  // Section C state
  const [forecastTab, setForecastTab] = useState<ForecastFilter>('ALL');

  // Theme-adaptive design tokens
  const surface =
    theme === 'DARK'
      ? {
          card: 'bg-[#162016]/90 border-emerald-500/20 text-gray-100',
          subCard: 'bg-[#1E2B1E]/85 border-emerald-500/15 text-gray-100',
          mutedText: 'text-gray-300',
          dimText: 'text-gray-400',
          input: 'bg-[#0F160F] border-emerald-500/25 text-gray-100 placeholder-gray-500',
          chipInactive: 'bg-[#1E2B1E] text-gray-300 border-emerald-500/20 hover:bg-[#263626]',
          tableHead: 'border-emerald-500/20 text-gray-400',
          tableRow: 'border-emerald-500/10 hover:bg-[#1E2B1E]/60',
          gridStroke: '#263626',
          axisColor: '#9CA3AF'
        }
      : theme === 'EARTH'
      ? {
          card: 'bg-[#213320]/90 border-emerald-400/20 text-[#E8F0E8]',
          subCard: 'bg-[#283E26]/85 border-emerald-400/15 text-[#E8F0E8]',
          mutedText: 'text-emerald-100/80',
          dimText: 'text-emerald-200/60',
          input: 'bg-[#162415] border-emerald-400/25 text-[#E8F0E8] placeholder-emerald-200/40',
          chipInactive: 'bg-[#283E26] text-emerald-100/80 border-emerald-400/20 hover:bg-[#314A2F]',
          tableHead: 'border-emerald-400/20 text-emerald-200/70',
          tableRow: 'border-emerald-400/10 hover:bg-[#283E26]/60',
          gridStroke: '#2E462C',
          axisColor: '#A7C4A7'
        }
      : {
          card: 'bg-white/95 border-[#1A2A1A]/10 text-[#1A2A1A]',
          subCard: 'bg-[#F4F1EA]/60 border-[#1A2A1A]/10 text-[#1A2A1A]',
          mutedText: 'text-gray-600',
          dimText: 'text-gray-500',
          input: 'bg-[#F4F1EA]/60 border-[#1A2A1A]/10 text-[#1A2A1A] placeholder-gray-400',
          chipInactive: 'bg-[#F4F1EA]/70 text-gray-700 border-[#1A2A1A]/10 hover:bg-[#EAE4D7]',
          tableHead: 'border-gray-200 text-gray-500',
          tableRow: 'border-gray-100 hover:bg-[#F4F1EA]/40',
          gridStroke: '#E5E7EB',
          axisColor: '#6B7280'
        };

  const formatNum = (val: string | number) => (isBn ? toBengaliDigits(val) : String(val));

  // Section A computations
  const kpiTotals = useMemo(() => {
    const totalDemandMT = nationalCropDemandData.reduce((acc, c) => acc + c.demandMillionMT, 0);
    const totalProdMT = nationalCropDemandData.reduce((acc, c) => acc + c.productionMillionMT, 0);
    const selfSufficientCount = nationalCropDemandData.filter(
      (c) => c.status === 'SELF_SUFFICIENT' || c.status === 'SURPLUS' || c.status === 'NEAR_SELF_SUFFICIENT' || c.status === 'BALANCED'
    ).length;
    const importDependentCount = nationalCropDemandData.filter(
      (c) => c.status === 'IMPORT_DEPENDENT' || c.status === 'DEFICIT' || c.status === 'SEASONAL_DEFICIT'
    ).length;
    const coveragePct = Math.round((totalProdMT / totalDemandMT) * 1000) / 10;
    return { totalDemandMT, totalProdMT, selfSufficientCount, importDependentCount, coveragePct };
  }, []);

  const filteredCrops = useMemo(() => {
    return nationalCropDemandData.filter((crop) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        crop.nameEn.toLowerCase().includes(q) ||
        crop.nameBn.toLowerCase().includes(q) ||
        crop.keyDistrictsEn.some((d) => d.toLowerCase().includes(q)) ||
        crop.keyDistrictsBn.some((d) => d.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (statusFilter === 'SURPLUS_SELF') {
        return crop.status === 'SELF_SUFFICIENT' || crop.status === 'SURPLUS' || crop.status === 'NEAR_SELF_SUFFICIENT';
      }
      if (statusFilter === 'DEFICIT_IMPORT') {
        return crop.status === 'IMPORT_DEPENDENT' || crop.status === 'DEFICIT' || crop.status === 'SEASONAL_DEFICIT';
      }
      if (statusFilter === 'BALANCED_B2B') {
        return crop.status === 'BALANCED' || crop.status === 'HIGH_B2B_DEMAND';
      }
      return true;
    });
  }, [searchQuery, statusFilter]);

  const barChartData = useMemo(() => {
    return filteredCrops.map((crop) => ({
      id: crop.id,
      name: isBn ? crop.nameBn : crop.nameEn,
      demand: unit === 'MT' ? crop.demandMillionMT : crop.demandMillionMT,
      production: unit === 'MT' ? crop.productionMillionMT : crop.productionMillionMT,
      raw: crop
    }));
  }, [filteredCrops, isBn, unit]);

  const getStatusBadgeClasses = (status: CropDemandMetric['status']) => {
    switch (status) {
      case 'SELF_SUFFICIENT':
      case 'SURPLUS':
      case 'NEAR_SELF_SUFFICIENT':
        return isDark
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'BALANCED':
      case 'HIGH_B2B_DEMAND':
        return isDark
          ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
          : 'bg-amber-50 text-amber-800 border-amber-200';
      case 'SEASONAL_DEFICIT':
      case 'DEFICIT':
      case 'IMPORT_DEPENDENT':
      default:
        return isDark
          ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
          : 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  // Section B computations
  const hubCropFilterOptions = [
    { key: 'ALL', labelEn: 'All Zones', labelBn: 'সব অঞ্চল' },
    { key: 'rice', labelEn: 'Rice / Boro', labelBn: 'ধান / বোরো' },
    { key: 'potato', labelEn: 'Potato', labelBn: 'আলু' },
    { key: 'onion', labelEn: 'Onion / Garlic', labelBn: 'পেঁয়াজ / রসুন' },
    { key: 'maize', labelEn: 'Maize', labelBn: 'ভুট্টা' },
    { key: 'vegetable', labelEn: 'Vegetables', labelBn: 'শাকসবজি' },
    { key: 'fruit', labelEn: 'Fruits & Melons', labelBn: 'ফল ও তরমুজ' },
    { key: 'spice', labelEn: 'Hill Spices', labelBn: 'পাহাড়ি মসলা' }
  ];

  const matchingHubIds = useMemo(() => {
    if (hubCropFilter === 'ALL') return new Set(regionalAgroHubs.map((h) => h.id));
    const matches = regionalAgroHubs.filter((hub) => {
      const cropIds = hub.primaryCrops.map((c) => c.id);
      if (hubCropFilter === 'rice') return cropIds.includes('rice') || cropIds.includes('boro') || cropIds.includes('aman');
      if (hubCropFilter === 'potato') return cropIds.includes('potato');
      if (hubCropFilter === 'onion') return cropIds.includes('onion') || cropIds.includes('garlic');
      if (hubCropFilter === 'maize') return cropIds.includes('maize');
      if (hubCropFilter === 'vegetable') return cropIds.includes('tomato') || cropIds.includes('brinjal') || cropIds.includes('cauliflower') || cropIds.includes('pepper');
      if (hubCropFilter === 'fruit') return cropIds.includes('mango') || cropIds.includes('watermelon') || cropIds.includes('muskmelon') || cropIds.includes('banana') || cropIds.includes('pineapple') || cropIds.includes('lemon');
      if (hubCropFilter === 'spice') return cropIds.includes('ginger') || cropIds.includes('turmeric') || cropIds.includes('spices') || cropIds.includes('onion');
      return true;
    });
    return new Set(matches.map((h) => h.id));
  }, [hubCropFilter]);

  const activeHub: AgroHubRegion = useMemo(() => {
    const current = regionalAgroHubs.find((h) => h.id === selectedHubId);
    if (current && matchingHubIds.has(current.id)) return current;
    const firstMatch = regionalAgroHubs.find((h) => matchingHubIds.has(h.id));
    return firstMatch || regionalAgroHubs[0];
  }, [selectedHubId, matchingHubIds]);

  const handleSelectCropFilter = (filterKey: string) => {
    setHubCropFilter(filterKey);
    if (filterKey !== 'ALL') {
      const firstMatch = regionalAgroHubs.find((hub) => {
        const ids = hub.primaryCrops.map((c) => c.id);
        if (filterKey === 'rice') return ids.includes('rice') || ids.includes('boro') || ids.includes('aman');
        if (filterKey === 'potato') return ids.includes('potato');
        if (filterKey === 'onion') return ids.includes('onion') || ids.includes('garlic');
        if (filterKey === 'maize') return ids.includes('maize');
        if (filterKey === 'vegetable') return ids.includes('tomato') || ids.includes('brinjal') || ids.includes('pepper');
        if (filterKey === 'fruit') return ids.includes('mango') || ids.includes('watermelon') || ids.includes('pineapple');
        if (filterKey === 'spice') return ids.includes('ginger') || ids.includes('turmeric') || ids.includes('spices');
        return true;
      });
      if (firstMatch) setSelectedHubId(firstMatch.id);
    }
  };

  // Section C computations
  const filteredForecasts = useMemo(() => {
    if (forecastTab === 'ALL') return sixMonthForecastItems;
    return sixMonthForecastItems.filter((item) => item.category === forecastTab);
  }, [forecastTab]);

  const timelineChartData = useMemo(() => {
    return sixMonthForecastTimeline.map((pt) => ({
      ...pt,
      label: isBn ? pt.monthBn : pt.monthEn
    }));
  }, [isBn]);

  const formatColdStorage = (mt: number) => {
    if (isBn) {
      const lakh = (mt / 100000).toFixed(1).replace(/\.0$/, '');
      return `${toBengaliDigits(lakh)} লক্ষ মে.টন`;
    }
    return mt >= 1000000
      ? `${(mt / 1000000).toFixed(2).replace(/\.00$/, '')}M MT`
      : `${Math.round(mt / 1000).toLocaleString()}K MT`;
  };

  return (
    <div id="national-agri-intelligence" className="space-y-10 pb-8 font-sans">
      {/* --- HERO HEADER --- */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B3A18] via-[#2D4F1E] to-[#172814] text-white p-6 md:p-10 shadow-xl border border-emerald-400/20"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-200">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {isBn ? 'ডিএএম · বিবিএস · ডিএই সমন্বিত ড্যাশবোর্ড' : 'DAM · BBS · DAE Unified Market Intelligence'}
              </span>
              <span className="text-emerald-200/70">·</span>
              <span className="text-amber-300 font-mono">
                {isBn ? 'নভেম্বর ২০২৬ – মে ২০২৭ পূর্বাভাস' : 'Nov 2026 – May 2027 Outlook'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {isBn
                ? 'জাতীয় কৃষি তথ্য ও চাহিদার পূর্বাভাস'
                : 'National Agricultural Intelligence & Demand Forecast'}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed max-w-2xl font-medium">
              {isBn
                ? 'বাংলাদেশের শীর্ষ ১০টি ফসলের বাৎসরিক চাহিদা ও উৎপাদন ভারসাম্য, ৬টি আঞ্চলিক কৃষি হাব এবং আগামী ৬ মাসের রমজান ও প্রাতিষ্ঠানিক বি-টু-বি চাহিদার রিয়েল-টাইম বিশ্লেষণ।'
                : 'Live supply-demand balance for Bangladesh’s top 10 staple and high-value crops, interactive regional agro-hub intelligence, and a 6-month Ramadan & institutional B2B demand surge forecast.'}
            </p>
          </div>

          {/* Quick Anchor Pills */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            <a
              href="#section-a-demand-balance"
              className="inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all backdrop-blur-sm whitespace-nowrap"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-300" />
                {isBn ? 'বাৎসরিক চাহিদা ও উৎপাদন' : 'Annual Demand & Supply'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </a>
            <a
              href="#section-b-agro-hubs"
              className="inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all backdrop-blur-sm whitespace-nowrap"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-300" />
                {isBn ? 'আঞ্চলিক হাব মানচিত্র' : 'Regional Agro-Hubs'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </a>
            <a
              href="#section-c-six-month-forecast"
              className="inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-[#1A2A1A] text-xs font-black transition-all shadow-md whitespace-nowrap"
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {isBn ? '৬ মাসের চাহিদা পূর্বাভাস' : '6-Month Surge Forecast'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </motion.section>

      {/* ========================================================================
          SECTION A: NATIONAL ANNUAL CROP DEMAND & SUPPLY BALANCE
          ======================================================================== */}
      <section id="section-a-demand-balance" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {isBn ? 'সেকশন ক · জাতীয় সরবরাহ ভারসাম্য' : 'Section A · National Supply Balance'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {isBn
                ? 'দেশব্যাপী বাৎসরিক চাহিদা ও উৎপাদন'
                : 'National Annual Crop Demand & Supply Balance'}
            </h3>
          </div>

          {/* KG / MT Unit Toggle */}
          <div
            role="group"
            aria-label={isBn ? 'পরিমাপের একক' : 'Quantity unit'}
            className={`inline-flex items-center gap-1 p-1 rounded-2xl border self-start md:self-auto ${surface.card}`}
          >
            <button
              type="button"
              id="unit-toggle-mt"
              onClick={() => setUnit('MT')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                unit === 'MT'
                  ? 'bg-[#2D4F1E] text-white shadow-sm'
                  : `${surface.mutedText} hover:opacity-80`
              }`}
            >
              {isBn ? 'মেট্রিক টন (MT)' : 'Metric Tons (MT)'}
            </button>
            <button
              type="button"
              id="unit-toggle-kg"
              onClick={() => setUnit('KG')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                unit === 'KG'
                  ? 'bg-[#2D4F1E] text-white shadow-sm'
                  : `${surface.mutedText} hover:opacity-80`
              }`}
            >
              {isBn ? 'কিলোগ্রাম (কেজি)' : 'Kilograms (KG)'}
            </button>
          </div>
        </div>

        {/* KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04 }}
            className={`rounded-3xl border p-5 backdrop-blur-md shadow-sm space-y-2 ${surface.card}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${surface.dimText}`}>
                {isBn ? 'বাৎসরিক মোট চাহিদা (শীর্ষ ১০)' : 'Annual Total Demand (Top 10)'}
              </span>
              <Layers className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black font-mono tabular-nums">
              {formatAgriQuantity(kpiTotals.totalDemandMT, unit, lang)}
            </p>
            <p className={`text-[11px] font-medium ${surface.dimText}`}>
              {isBn ? 'জাতীয় খাদ্য, মসলা ও বি-টু-বি ফিড চাহিদা' : 'Combined foodgrain, spice & B2B feed demand'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className={`rounded-3xl border p-5 backdrop-blur-md shadow-sm space-y-2 ${surface.card}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${surface.dimText}`}>
                {isBn ? 'মোট দেশীয় উৎপাদন' : 'Total Domestic Production'}
              </span>
              <Wheat className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {formatAgriQuantity(kpiTotals.totalProdMT, unit, lang)}
            </p>
            <p className={`text-[11px] font-medium ${surface.dimText}`}>
              {isBn
                ? `গড় অভ্যন্তরীণ যোগান ${formatNum(kpiTotals.coveragePct)}%`
                : `${kpiTotals.coveragePct}% aggregate domestic coverage`}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className={`rounded-3xl border p-5 backdrop-blur-md shadow-sm space-y-2 ${surface.card}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${surface.dimText}`}>
                {isBn ? 'স্বয়ংসম্পূর্ণ ও উদ্বৃত্ত ফসল' : 'Self-Sufficient & Balanced'}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black font-mono tabular-nums">
              {formatNum(kpiTotals.selfSufficientCount)} / {formatNum(10)}
            </p>
            <p className={`text-[11px] font-medium ${surface.dimText}`}>
              {isBn ? 'চাল ও আলুতে উদ্বৃত্ত; রসুন ও মরিচ স্থিতিশীল' : 'Surplus in Rice & Potato; steady Garlic & Chili'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16 }}
            className={`rounded-3xl border p-5 backdrop-blur-md shadow-sm space-y-2 ${surface.card}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${surface.dimText}`}>
                {isBn ? 'আমদানি ও ঘাটতি ঝুঁকি' : 'Import / Deficit Watch'}
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-black font-mono tabular-nums text-amber-600 dark:text-amber-400">
              {formatNum(kpiTotals.importDependentCount)} {isBn ? 'টি ফসল' : 'Crops'}
            </p>
            <p className={`text-[11px] font-medium ${surface.dimText}`}>
              {isBn ? 'গম, ভোজ্যতেল, ডাল ও আদায় আমদানি নির্ভরতা' : 'Wheat, Edible Oil, Lentil & Ginger supply gaps'}
            </p>
          </motion.div>
        </div>

        {/* Search, Filter & Bar Chart + Data Table Container */}
        <div className={`rounded-3xl border p-5 md:p-7 shadow-sm space-y-6 backdrop-blur-md ${surface.card}`}>
          {/* Search & Status Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative w-full lg:max-w-sm">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${surface.dimText}`} />
              <input
                type="text"
                id="agri-demand-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'ফসল বা জেলার নাম খুঁজুন...' : 'Search crop or district (e.g., Onion, Pabna)...'}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${surface.input}`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold inline-flex items-center gap-1 mr-1 ${surface.dimText}`}>
                <Filter className="w-3.5 h-3.5" />
                {isBn ? 'অবস্থা:' : 'Status:'}
              </span>
              {[
                { key: 'ALL' as StatusFilter, en: 'All 10 Crops', bn: 'সব ১০টি ফসল' },
                { key: 'SURPLUS_SELF' as StatusFilter, en: 'Self-Sufficient / Surplus', bn: 'স্বয়ংসম্পূর্ণ / উদ্বৃত্ত' },
                { key: 'DEFICIT_IMPORT' as StatusFilter, en: 'Deficit / Import', bn: 'ঘাটতি / আমদানি নির্ভর' },
                { key: 'BALANCED_B2B' as StatusFilter, en: 'Balanced / B2B Feed', bn: 'ভারসাম্যপূর্ণ / বি-টু-বি' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === tab.key
                      ? 'bg-[#2D4F1E] text-white border-[#2D4F1E] shadow-xs'
                      : surface.chipInactive
                  }`}
                >
                  {isBn ? tab.bn : tab.en}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts BarChart: Demand vs Production */}
          <div className={`rounded-2xl border p-4 md:p-5 ${surface.subCard}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="text-sm font-extrabold">
                  {isBn
                    ? `জাতীয় চাহিদা বনাম দেশীয় উৎপাদন (${unit === 'MT' ? 'মিলিয়ন মে.টন' : 'কোটি কেজি'})`
                    : `Annual Demand vs. Domestic Production (${unit === 'MT' ? 'Million MT' : 'Billion KG / Scale'})`}
                </h4>
                <p className={`text-[11px] ${surface.dimText}`}>
                  {isBn
                    ? 'প্রতিটি বারে মাউস রাখলে সঠিক কেজি/মে.টন ও আমদানি ঘাটতি দেখতে পাবেন'
                    : 'Hover any bar to inspect exact KG/MT totals, production coverage, and post-harvest loss notes'}
                </p>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-bold">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
                  {isBn ? 'জাতীয় চাহিদা' : 'National Demand'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" />
                  {isBn ? 'দেশীয় উৎপাদন' : 'Domestic Production'}
                </span>
              </div>
            </div>

            {barChartData.length > 0 ? (
              <div className="w-full h-72 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 12, left: -6, bottom: 18 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={surface.gridStroke} vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: surface.axisColor, fontWeight: 600 }}
                      axisLine={{ stroke: surface.gridStroke }}
                      tickLine={false}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={46}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: surface.axisColor, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val: number) =>
                        isBn
                          ? unit === 'MT'
                            ? `${toBengaliDigits(val)}M`
                            : `${toBengaliDigits(val * 100)}`
                          : unit === 'MT'
                          ? `${val}M`
                          : `${val}B`
                      }
                    />
                    <Tooltip
                      cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(45,79,30,0.05)' }}
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const item: CropDemandMetric = payload[0].payload.raw;
                        return (
                          <div className="bg-[#1A2A1A] text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-400/25 text-xs space-y-1.5 max-w-xs">
                            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5">
                              <span className="font-extrabold text-white">
                                {isBn ? item.nameBn : item.nameEn}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-amber-300 font-bold">
                                {isBn ? item.statusLabelBn : item.statusLabelEn}
                              </span>
                            </div>
                            <div className="flex justify-between gap-4 font-mono tabular-nums">
                              <span className="text-white/70">{isBn ? 'চাহিদা:' : 'Demand:'}</span>
                              <span className="font-bold text-amber-300">
                                {formatAgriQuantity(item.demandMillionMT, unit, lang)}
                              </span>
                            </div>
                            <div className="flex justify-between gap-4 font-mono tabular-nums">
                              <span className="text-white/70">{isBn ? 'উৎপাদন:' : 'Production:'}</span>
                              <span className="font-bold text-emerald-300">
                                {formatAgriQuantity(item.productionMillionMT, unit, lang)}
                              </span>
                            </div>
                            {item.postHarvestLossPct && (
                              <p className="text-[10px] text-amber-200 pt-0.5">
                                {isBn
                                  ? `সংরক্ষণ ক্ষতি: ~${toBengaliDigits(item.postHarvestLossPct)}%`
                                  : `Post-harvest storage loss: ~${item.postHarvestLossPct}%`}
                              </p>
                            )}
                            <p className="text-[10px] text-white/75 leading-relaxed pt-1 border-t border-white/10">
                              {isBn ? item.noteBn : item.noteEn}
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Bar
                      dataKey="demand"
                      name={isBn ? 'চাহিদা' : 'Demand'}
                      fill="#F59E0B"
                      radius={[6, 6, 0, 0]}
                      barSize={18}
                    />
                    <Bar
                      dataKey="production"
                      name={isBn ? 'উৎপাদন' : 'Production'}
                      fill="#10B981"
                      radius={[6, 6, 0, 0]}
                      barSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-12 text-center text-xs font-semibold opacity-75">
                {isBn ? 'আপনার অনুসন্ধানের সাথে কোনো ফসল মেলেনি।' : 'No crops match your current search or filter.'}
              </div>
            )}
          </div>

          {/* Searchable/Filterable Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[780px]">
              <thead>
                <tr className={`border-b text-[11px] uppercase tracking-wider font-extrabold ${surface.tableHead}`}>
                  <th className="py-3 pr-3">{isBn ? 'ফসলের নাম' : 'Crop'}</th>
                  <th className="py-3 px-3 text-right">{isBn ? 'বাৎসরিক চাহিদা' : 'Annual Demand'}</th>
                  <th className="py-3 px-3 text-right">{isBn ? 'দেশীয় উৎপাদন' : 'Domestic Production'}</th>
                  <th className="py-3 px-3 min-w-[220px]">
                    {isBn ? 'দেশীয় যোগান % বনাম আমদানি ঘাটতি %' : 'Domestic Production % vs Import Gap %'}
                  </th>
                  <th className="py-3 pl-3">{isBn ? 'সরবরাহ অবস্থা ও মন্তব্য' : 'Supply Status & Insight'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCrops.map((crop) => (
                  <tr key={crop.id} className={`border-b transition-colors ${surface.tableRow}`}>
                    <td className="py-3.5 pr-3 align-top">
                      <div className="font-extrabold text-sm">{isBn ? crop.nameBn : crop.nameEn}</div>
                      <div className={`text-[11px] font-medium mt-0.5 ${surface.dimText}`}>
                        {isBn ? crop.categoryBn : crop.categoryEn} ·{' '}
                        {(isBn ? crop.keyDistrictsBn : crop.keyDistrictsEn).slice(0, 2).join(', ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums align-top whitespace-nowrap">
                      <div>{formatAgriQuantity(crop.demandMillionMT, unit, lang)}</div>
                      <div className={`text-[10px] font-normal ${surface.dimText}`}>
                        {formatAgriQuantity(crop.demandMillionMT, unit === 'MT' ? 'KG' : 'MT', lang)}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400 align-top whitespace-nowrap">
                      <div>{formatAgriQuantity(crop.productionMillionMT, unit, lang)}</div>
                      {crop.postHarvestLossPct ? (
                        <div className="text-[10px] text-amber-600 dark:text-amber-300 font-semibold">
                          {isBn
                            ? `~${toBengaliDigits(crop.postHarvestLossPct)}% ক্ষতি`
                            : `~${crop.postHarvestLossPct}% loss`}
                        </div>
                      ) : (
                        <div className={`text-[10px] font-normal ${surface.dimText}`}>
                          {formatAgriQuantity(crop.productionMillionMT, unit === 'MT' ? 'KG' : 'MT', lang)}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 align-top">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-mono font-bold tabular-nums">
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {isBn ? 'দেশীয়:' : 'Domestic:'} {formatNum(crop.domesticSharePct)}%
                          </span>
                          <span className={crop.importGapPct > 0 ? 'text-rose-600 dark:text-rose-400' : surface.dimText}>
                            {isBn ? 'ঘাটতি:' : 'Gap:'} {formatNum(crop.importGapPct)}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden bg-rose-500/20 flex">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${crop.domesticSharePct}%` }}
                          />
                          {crop.importGapPct > 0 && (
                            <div
                              className="h-full bg-rose-500 transition-all duration-500"
                              style={{ width: `${crop.importGapPct}%` }}
                            />
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 pl-3 align-top space-y-1">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadgeClasses(
                          crop.status
                        )}`}
                      >
                        {isBn ? crop.statusLabelBn : crop.statusLabelEn}
                      </span>
                      <p className={`text-[11px] leading-relaxed max-w-xs ${surface.mutedText}`}>
                        {isBn ? crop.noteBn : crop.noteEn}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION B: REGIONAL AGRO-HUB & PRODUCTION ZONE EXPLORER
          ======================================================================== */}
      <section id="section-b-agro-hubs" className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {isBn ? 'সেকশন খ · আঞ্চলিক উৎপাদন বলয়' : 'Section B · Spatial Production Intelligence'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {isBn
                ? 'অঞ্চলভিত্তিক উৎপাদন মানচিত্র ও হাব'
                : 'Regional Agro-Hub & Production Zone Explorer'}
            </h3>
          </div>

          {/* Crop-to-Zone Quick Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {hubCropFilterOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelectCropFilter(opt.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                  hubCropFilter === opt.key
                    ? 'bg-amber-500 text-[#1A2A1A] border-amber-400 shadow-xs'
                    : surface.chipInactive
                }`}
              >
                {isBn ? opt.labelBn : opt.labelEn}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT (5 cols): Interactive SVG Bangladesh Regional Hub Map + Hub Buttons */}
          <div className={`lg:col-span-5 rounded-3xl border p-5 md:p-6 shadow-sm flex flex-col justify-between gap-4 backdrop-blur-md ${surface.card}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-500" />
                <h4 className="text-sm font-extrabold">
                  {isBn ? 'বাংলাদেশ কৃষি হাব মানচিত্র' : 'Interactive Bangladesh Hub Map'}
                </h4>
              </div>
              <span className={`text-[11px] font-semibold ${surface.dimText}`}>
                {isBn ? 'অঞ্চল নির্বাচন করুন' : 'Click any zone node'}
              </span>
            </div>

            {/* Stylized Geographic SVG Map of Bangladesh Agro-Zones */}
            <div className={`relative rounded-2xl border p-3 overflow-hidden ${surface.subCard}`}>
              <svg
                viewBox="0 0 400 470"
                className="w-full h-72 sm:h-80 select-none"
                role="img"
                aria-label={isBn ? 'বাংলাদেশের ৬টি কৃষি হাব মানচিত্র' : 'Bangladesh 6 Regional Agro-Hubs Map'}
              >
                {/* Stylized Bangladesh Landmass Outline */}
                <path
                  d="M95,42 L150,35 L182,78 L225,85 L278,108 L345,128 L355,175 L312,215 L292,258 L315,288 L352,292 L372,355 L350,430 L324,422 L305,365 L268,325 L252,378 L215,412 L162,418 L128,395 L118,328 L92,292 L78,242 L95,185 L68,145 L72,88 Z"
                  fill={isDark ? '#1D331C' : '#E3ECE0'}
                  stroke={isDark ? '#34D399' : '#2D4F1E'}
                  strokeWidth="2.5"
                  strokeOpacity={isDark ? 0.45 : 0.35}
                />

                {/* River Lines (Padma / Jamuna / Meghna stylized contours) */}
                <path
                  d="M158,65 Q168,165 162,225 T215,315 T230,405"
                  fill="none"
                  stroke={isDark ? '#38BDF8' : '#0284C7'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeOpacity={0.45}
                />
                <path
                  d="M78,198 Q135,222 185,260"
                  fill="none"
                  stroke={isDark ? '#38BDF8' : '#0284C7'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeOpacity={0.45}
                />

                {/* Hub Nodes */}
                {regionalAgroHubs.map((hub) => {
                  const isSelected = activeHub.id === hub.id;
                  const isMatched = matchingHubIds.has(hub.id);
                  const shortLabel = (isBn ? hub.nameBn : hub.nameEn).split('(')[0].trim();

                  return (
                    <g
                      key={hub.id}
                      onClick={() => setSelectedHubId(hub.id)}
                      className="cursor-pointer"
                      style={{ opacity: isMatched ? 1 : 0.3 }}
                    >
                      {isSelected && (
                        <circle
                          cx={hub.mapCoords.x}
                          cy={hub.mapCoords.y}
                          r={hub.mapCoords.radius + 7}
                          fill="#F59E0B"
                          fillOpacity={0.22}
                          stroke="#F59E0B"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      )}
                      <circle
                        cx={hub.mapCoords.x}
                        cy={hub.mapCoords.y}
                        r={isSelected ? 14 : 11}
                        fill={isSelected ? '#F59E0B' : '#10B981'}
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                      />
                      <text
                        x={hub.mapCoords.x}
                        y={hub.mapCoords.y + 26}
                        textAnchor="middle"
                        fill={isDark ? '#F3F4F6' : '#1A2A1A'}
                        fontSize="10.5"
                        fontWeight="800"
                      >
                        {shortLabel.length > 18 ? `${shortLabel.slice(0, 16)}…` : shortLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hub Selector List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {regionalAgroHubs.map((hub) => {
                const isSelected = activeHub.id === hub.id;
                const isMatched = matchingHubIds.has(hub.id);
                return (
                  <button
                    key={hub.id}
                    type="button"
                    id={`agro-hub-btn-${hub.id}`}
                    onClick={() => setSelectedHubId(hub.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2D4F1E] text-white border-[#2D4F1E] shadow-sm'
                        : isMatched
                        ? surface.chipInactive
                        : `${surface.chipInactive} opacity-45`
                    }`}
                  >
                    <p className="text-xs font-extrabold truncate">
                      {isBn ? hub.nameBn : hub.nameEn}
                    </p>
                    <p className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-emerald-200' : surface.dimText}`}>
                      {isBn ? hub.zoneTagBn : hub.zoneTagEn}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT (7 cols): Active Agro-Hub Metrics Card */}
          <motion.div
            key={activeHub.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`lg:col-span-7 rounded-3xl border p-6 md:p-8 shadow-sm flex flex-col justify-between gap-6 backdrop-blur-md ${surface.card}`}
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-current/10 pb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <MapPin className="w-4 h-4" />
                    <span>{isBn ? activeHub.zoneTagBn : activeHub.zoneTagEn}</span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-black tracking-tight">
                    {isBn ? activeHub.nameBn : activeHub.nameEn}
                  </h4>
                  <p className={`text-xs font-medium leading-relaxed ${surface.mutedText}`}>
                    {isBn ? activeHub.highlightBn : activeHub.highlightEn}
                  </p>
                </div>

                <div className={`px-3.5 py-2 rounded-2xl border text-right shrink-0 ${surface.subCard}`}>
                  <span className={`text-[10px] font-bold uppercase block ${surface.dimText}`}>
                    {isBn ? 'মাসিক চাহিদা' : 'Monthly Hub Volume'}
                  </span>
                  <strong className="text-base font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                    {isBn
                      ? `${toBengaliDigits(Math.round(activeHub.monthlyDemandVolumeMT / 1000).toLocaleString())}K মে.টন`
                      : `${Math.round(activeHub.monthlyDemandVolumeMT / 1000).toLocaleString()}K MT`}
                  </strong>
                </div>
              </div>

              {/* Key Districts */}
              <div className="space-y-2">
                <span className={`text-[11px] font-extrabold uppercase tracking-wider block ${surface.dimText}`}>
                  {isBn ? 'প্রধান উৎপাদন জেলাসমূহ' : 'Core Production Districts'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {(isBn ? activeHub.districtsBn : activeHub.districtsEn).map((dist) => (
                    <span
                      key={dist}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border ${surface.subCard}`}
                    >
                      {dist}
                    </span>
                  ))}
                </div>
              </div>

              {/* Primary Crops Grid */}
              <div className="space-y-2.5">
                <span className={`text-[11px] font-extrabold uppercase tracking-wider block ${surface.dimText}`}>
                  {isBn ? 'প্রধান ফসল ও সরবরাহ বিবরণ' : 'Primary Crops & Supply Profile'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeHub.primaryCrops.map((crop) => (
                    <div key={crop.id} className={`p-3.5 rounded-2xl border space-y-1 ${surface.subCard}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-extrabold flex items-center gap-1.5">
                          <Sprout className="w-4 h-4 text-emerald-500 shrink-0" />
                          {isBn ? crop.nameBn : crop.nameEn}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${surface.mutedText}`}>
                        {isBn ? crop.detailBn : crop.detailEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3-Card Hub Operations Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-current/10">
              <div className={`p-3.5 rounded-2xl border space-y-1 ${surface.subCard}`}>
                <span className={`text-[10px] font-bold uppercase flex items-center gap-1 ${surface.dimText}`}>
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  {isBn ? 'সর্বোচ্চ সংগ্রহের সময়' : 'Peak Harvest Window'}
                </span>
                <p className="text-xs font-extrabold leading-snug">
                  {isBn ? activeHub.peakHarvestWindowBn : activeHub.peakHarvestWindowEn}
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl border space-y-1 ${surface.subCard}`}>
                <span className={`text-[10px] font-bold uppercase flex items-center gap-1 ${surface.dimText}`}>
                  <Warehouse className="w-3.5 h-3.5 text-emerald-500" />
                  {isBn ? 'হিমাগার ও হাব সক্ষমতা' : 'Cold Storage & Hub Capacity'}
                </span>
                <p className="text-sm font-black font-mono tabular-nums">
                  {formatColdStorage(activeHub.coldStorageCapacityMT)}
                </p>
                <p className={`text-[10px] font-medium ${surface.dimText}`}>
                  {formatNum(activeHub.coldStorageHubsCount)}{' '}
                  {isBn ? 'টি সক্রিয় হিমাগার ও এগ্রো-হাব' : 'Active Cold Storages / Hubs'}
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl border space-y-1 ${surface.subCard}`}>
                <span className={`text-[10px] font-bold uppercase flex items-center gap-1 ${surface.dimText}`}>
                  <Building2 className="w-3.5 h-3.5 text-sky-500" />
                  {isBn ? 'সক্রিয় বি-টু-বি ক্রেতা চাহিদা' : 'Active B2B Buyer Demand'}
                </span>
                <p className="text-xs font-extrabold leading-snug">
                  {isBn ? activeHub.activeB2BBuyerDemandBn : activeHub.activeB2BBuyerDemandEn}
                </p>
                <p className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatNum(activeHub.activeBuyersCount)}{' '}
                  {isBn ? 'জন নিবন্ধিত প্রাতিষ্ঠানিক ক্রেতা' : 'Verified Institutional Buyers'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================
          SECTION C: NEXT 6 MONTHS HIGH-DEMAND FORECAST (NOV 2026 – MAY 2027)
          ======================================================================== */}
      <section id="section-c-six-month-forecast" className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {isBn ? 'সেকশন গ · আগামী ৬ মাসের পূর্বাভাস (নভে ২০২৬ – মে ২০২৭)' : 'Section C · 6-Month Surge Outlook (Nov 2026 – May 2027)'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {isBn
                ? 'আগামী ৬ মাসের উচ্চ-চাহিদাসম্পন্ন ফসলের পূর্বাভাস'
                : 'Next 6 Months High-Demand Forecast'}
            </h3>
          </div>

          {/* Filterable Tabs */}
          <div className={`inline-flex flex-wrap items-center gap-1 p-1 rounded-2xl border self-start lg:self-auto ${surface.card}`}>
            {[
              { key: 'ALL' as ForecastFilter, en: 'All High-Demand', bn: 'সব উচ্চ চাহিদা' },
              { key: 'RAMADAN_SURGE' as ForecastFilter, en: 'Ramadan Surge (Feb–Mar 2027)', bn: 'রমজান চাহিদা (ফেব–মার্চ ২০২৭)' },
              { key: 'INSTITUTIONAL_B2B' as ForecastFilter, en: 'Institutional B2B & Storage', bn: 'প্রাতিষ্ঠানিক বি-টু-বি ও সংরক্ষণ' }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                id={`forecast-tab-${tab.key}`}
                onClick={() => setForecastTab(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  forecastTab === tab.key
                    ? 'bg-[#2D4F1E] text-white shadow-sm'
                    : `${surface.mutedText} hover:opacity-80`
                }`}
              >
                {isBn ? tab.bn : tab.en}
              </button>
            ))}
          </div>
        </div>

        {/* Peak Surge Alert Banner (Ramadan 2027: Feb – Mar 2027) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border-2 border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/10 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-sm shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white tracking-wider">
                  {isBn ? 'সর্বোচ্চ চাহিদা সতর্কতা' : 'Peak Surge Alert'}
                </span>
                <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 font-mono">
                  {isBn ? 'রমজান ২০২৭ (ফেব্রুয়ারি – মার্চ ২০২৭)' : 'Ramadan 2027 (Feb – Mar 2027)'}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black">
                {isBn
                  ? 'রমজান উপলক্ষ্যে মসলা ও ইফতার সামগ্রীর চাহিদা +৩০% থেকে +৪৫% পর্যন্ত বৃদ্ধি পাবে'
                  : 'Demand projected to spike +30% to +45% across Spices & Iftar Essentials'}
              </h4>
              <p className={`text-xs font-medium leading-relaxed ${surface.mutedText}`}>
                {isBn
                  ? 'মসলা: পেঁয়াজ, রসুন, আদা, কাঁচা মরিচ · ইফতার সামগ্রী: ছোলা, মসুর ডাল, শসা, বেগুন, টমেটো ও লেবু — প্রাক-বুকিং ও আগাম সরবরাহ প্রস্তুতির সেরা সময়।'
                  : 'Spices: Onion, Garlic, Ginger, Green Chili · Iftar Essentials: Chickpeas (ছোলা), Lentils (মসুর ডাল), Cucumber (শসা), Brinjal (বেগুন), Tomato & Lemon (লেবু).'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setForecastTab('RAMADAN_SURGE')}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-[#1A2A1A] text-xs font-black transition-all shadow-sm cursor-pointer shrink-0 whitespace-nowrap"
          >
            {isBn ? 'রমজানের ফসল দেখুন' : 'Filter Ramadan Surge'}
          </button>
        </motion.div>

        {/* 6-Month Demand Surge Timeline Chart (Recharts) */}
        <div className={`rounded-3xl border p-5 md:p-7 shadow-sm space-y-4 backdrop-blur-md ${surface.card}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-extrabold">
                {isBn
                  ? '৬ মাসের চাহিদা সূচক টাইমলাইন (নভেম্বর ২০২৬ – মে ২০২৭, ভিত্তি = ১০০)'
                  : '6-Month Demand Surge Timeline (Nov 2026 – May 2027 · Baseline = 100)'}
              </h4>
              <p className={`text-[11px] ${surface.dimText}`}>
                {isBn
                  ? 'ফেব্রুয়ারি–মার্চে রমজানের মসলা/ইফতার এবং এপ্রিল–মে মাসে বোরো ধান, রবি ভুট্টা ও তরমুজের চাহিদা সর্বোচ্চ'
                  : 'Tracks Ramadan spices/Iftar peak (Feb–Mar) and Spring/Summer B2B Maize, Boro & Melon procurement (Mar–May)'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                {isBn ? 'মসলা ও ইফতার' : 'Spices & Iftar'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                {isBn ? 'বি-টু-বি ও হিমাগার' : 'B2B & Storage'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                {isBn ? 'মৌসুমি ফল' : 'Summer Fruits'}
              </span>
            </div>
          </div>

          <div className="w-full h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineChartData} margin={{ top: 14, right: 16, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="spicesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="b2bGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fruitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={surface.gridStroke} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: surface.axisColor, fontWeight: 600 }}
                  axisLine={{ stroke: surface.gridStroke }}
                  tickLine={false}
                />
                <YAxis
                  domain={[70, 155]}
                  tick={{ fontSize: 11, fill: surface.axisColor, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val: number) => `${formatNum(val)}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const pt = payload[0].payload;
                    return (
                      <div className="bg-[#1A2A1A] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/15 text-xs space-y-1.5 min-w-[200px]">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1">
                          <span className="font-extrabold">{isBn ? pt.monthBn : pt.monthEn}</span>
                          {(pt.eventTagEn || pt.eventTagBn) && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-300 font-bold">
                              {isBn ? pt.eventTagBn : pt.eventTagEn}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between font-mono tabular-nums">
                          <span className="text-white/75">{isBn ? 'মসলা ও ইফতার:' : 'Spices & Iftar:'}</span>
                          <span className="font-bold text-amber-300">
                            {formatNum(pt.spicesAndIftarIndex)} (+{formatNum(Math.max(0, pt.spicesAndIftarIndex - 100))}%)
                          </span>
                        </div>
                        <div className="flex justify-between font-mono tabular-nums">
                          <span className="text-white/75">{isBn ? 'বি-টু-বি ও মজুদ:' : 'B2B & Storage:'}</span>
                          <span className="font-bold text-emerald-300">
                            {formatNum(pt.institutionalB2BIndex)} (+{formatNum(Math.max(0, pt.institutionalB2BIndex - 100))}%)
                          </span>
                        </div>
                        <div className="flex justify-between font-mono tabular-nums">
                          <span className="text-white/75">{isBn ? 'মৌসুমি ফল:' : 'Summer Fruits:'}</span>
                          <span className="font-bold text-sky-300">{formatNum(pt.seasonalFruitsIndex)}</span>
                        </div>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  y={100}
                  stroke={surface.axisColor}
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="spicesAndIftarIndex"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  fill="url(#spicesGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="institutionalB2BIndex"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fill="url(#b2bGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="seasonalFruitsIndex"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  fill="url(#fruitGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High-Demand Forecast Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredForecasts.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className={`rounded-3xl border p-6 shadow-sm flex flex-col justify-between gap-5 backdrop-blur-md transition-all hover:shadow-md ${surface.card}`}
            >
              <div className="space-y-3.5">
                {/* Top Meta Strip */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                      item.category === 'RAMADAN_SURGE'
                        ? isDark
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                        : isDark
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {isBn ? item.categoryLabelBn : item.categoryLabelEn}
                  </span>

                  <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl tabular-nums">
                    +{formatNum(item.growthMinPct)}%–{formatNum(item.growthMaxPct)}%
                  </span>
                </div>

                {/* Crop Name & Sub-items */}
                <div className="space-y-1">
                  <h4 className="text-base font-black leading-snug">
                    {isBn ? item.cropNameBn : item.cropNameEn}
                  </h4>
                  {(item.subItemsEn || item.subItemsBn) && (
                    <p className={`text-[11px] font-semibold ${surface.dimText}`}>
                      {isBn ? item.subItemsBn : item.subItemsEn}
                    </p>
                  )}
                </div>

                <p className={`text-xs leading-relaxed font-medium ${surface.mutedText}`}>
                  {isBn ? item.driverBn : item.driverEn}
                </p>

                {/* Peak Months, Volume & Districts */}
                <div className={`rounded-2xl border p-3.5 space-y-2 text-xs ${surface.subCard}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-semibold flex items-center gap-1.5 ${surface.dimText}`}>
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      {isBn ? 'সর্বোচ্চ চাহিদা:' : 'Peak Demand:'}
                    </span>
                    <strong className="font-extrabold font-mono">
                      {isBn ? item.peakMonthsBn : item.peakMonthsEn}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-semibold flex items-center gap-1.5 ${surface.dimText}`}>
                      <PackageCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {isBn ? 'প্রত্যাশিত পরিমাণ:' : 'Projected Volume:'}
                    </span>
                    <strong className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {isBn ? item.projectedVolumeBn : item.projectedVolumeMT}
                    </strong>
                  </div>

                  <div className="pt-1.5 border-t border-current/10">
                    <span className={`text-[10px] font-bold uppercase block mb-1 ${surface.dimText}`}>
                      {isBn ? 'প্রধান সরবরাহকারী জেলা:' : 'Primary Sourcing Districts:'}
                    </span>
                    <p className="text-[11px] font-bold">
                      {(isBn ? item.sourcingDistrictsBn : item.sourcingDistrictsEn).join(' · ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  id={`forecast-list-btn-${item.id}`}
                  onClick={() => onListProduceFromForecast(item)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#2D4F1E] hover:bg-[#233F17] text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer whitespace-nowrap"
                >
                  <Sprout className="w-3.5 h-3.5 shrink-0" />
                  <span>{isBn ? 'ফসল তালিকা' : 'List Produce'}</span>
                </button>
                <button
                  type="button"
                  id={`forecast-prebook-btn-${item.id}`}
                  onClick={() => onPreBookSupplyFromForecast(item)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#1A2A1A] text-xs font-extrabold transition-all shadow-xs cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span>{isBn ? 'প্রি-বুক সরবরাহ' : 'Pre-Book Supply'}</span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
};
