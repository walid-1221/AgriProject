import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { FarmerProfile, LanguageMode } from '../types';

interface FarmerYieldHistoryChartProps {
  farmerId: number;
  farmerName: string;
  farmerProfile?: FarmerProfile;
  lang: LanguageMode;
}

interface MonthlyYieldPoint {
  monthKey: string;
  monthLabel: string;
  cropName: string;
  actualYieldKg: number;
  targetYieldKg: number;
  successRate: number;
}

const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BN_MONTHS = ['জানু', 'ফেব', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];

// Farmer-specific seasonal crop & performance multipliers across 12 calendar months (0 = Jan .. 11 = Dec)
const FARMER_SEASONAL_PATTERNS: Record<
  number,
  {
    baseScale: number;
    cropsByMonth: string[];
    cropsByMonthBn: string[];
    actualFactors: number[];
    targetFactors: number[];
  }
> = {
  101: {
    baseScale: 2400,
    cropsByMonth: [
      'Winter Potato', 'Winter Potato', 'Onion', 'Boro Rice',
      'Boro Rice', 'Boro Rice', 'Aus Rice', 'Aus Rice',
      'Aman Paddy', 'Aman Paddy', 'Aman Paddy', 'Early Potato'
    ],
    cropsByMonthBn: [
      'শীতকালীন আলু', 'শীতকালীন আলু', 'পেঁয়াজ', 'বোরো ধান',
      'বোরো ধান', 'বোরো ধান', 'আউশ ধান', 'আউশ ধান',
      'আমন ধান', 'আমন ধান', 'আমন ধান', 'আগাম আলু'
    ],
    actualFactors: [0.92, 1.12, 0.85, 1.05, 1.38, 1.24, 0.72, 0.78, 0.94, 1.16, 1.28, 1.04],
    targetFactors: [0.90, 1.05, 0.88, 1.00, 1.25, 1.18, 0.75, 0.80, 0.92, 1.10, 1.20, 0.98]
  },
  102: {
    baseScale: 950,
    cropsByMonth: [
      'Mustard', 'Boro Rice', 'Boro Rice', 'Boro Rice',
      'Tossa Jute', 'Tossa Jute', 'Tossa Jute', 'Aus Rice',
      'Aman Rice', 'Aman Rice', 'Vegetables', 'Mustard'
    ],
    cropsByMonthBn: [
      'সরিষা', 'বোরো ধান', 'বোরো ধান', 'বোরো ধান',
      'তোষা পাট', 'তোষা পাট', 'তোষা পাট', 'আউশ ধান',
      'আমন ধান', 'আমন ধান', 'শাকসবজি', 'সরিষা'
    ],
    actualFactors: [0.78, 0.88, 0.95, 1.08, 1.15, 1.22, 1.04, 0.74, 0.86, 0.98, 1.06, 0.84],
    targetFactors: [0.82, 0.90, 0.94, 1.05, 1.10, 1.18, 1.08, 0.80, 0.90, 1.00, 1.02, 0.88]
  },
  103: {
    baseScale: 1950,
    cropsByMonth: [
      'Bell Pepper', 'Bell Pepper', 'Capsicum', 'Early Mango',
      'Amrapali Mango', 'Amrapali Mango', 'Dragon Fruit', 'Dragon Fruit',
      'Dragon Fruit', 'Organic Capsicum', 'Bell Pepper', 'Bell Pepper'
    ],
    cropsByMonthBn: [
      'বেল পেপার', 'বেল পেপার', 'ক্যাপসিকাম', 'আগাম আম',
      'আম্রপালি আম', 'আম্রপালি আম', 'ড্রাগন ফল', 'ড্রাগন ফল',
      'ড্রাগন ফল', 'অর্গানিক ক্যাপসিকাম', 'বেল পেপার', 'বেল পেপার'
    ],
    actualFactors: [1.08, 1.14, 1.05, 1.18, 1.42, 1.48, 1.26, 1.32, 1.22, 1.12, 1.19, 1.15],
    targetFactors: [1.00, 1.05, 1.00, 1.10, 1.30, 1.35, 1.18, 1.20, 1.15, 1.05, 1.10, 1.06]
  }
};

export const FarmerYieldHistoryChart: React.FC<FarmerYieldHistoryChartProps> = ({
  farmerId,
  farmerName,
  farmerProfile,
  lang
}) => {
  const [metricView, setMetricView] = useState<'VOLUME' | 'SUCCESS_RATE'>('VOLUME');
  const isBn = lang === 'BN';

  const data: MonthlyYieldPoint[] = useMemo(() => {
    const now = new Date();
    const pattern = FARMER_SEASONAL_PATTERNS[farmerId];
    const fallbackScale = farmerProfile ? Math.max(700, Math.round(farmerProfile.farm_size_acres * 520)) : 1200;
    const primaryCrop = farmerProfile?.primary_crops?.[0] || (isBn ? 'মিশ্র শস্য' : 'Mixed Crops');

    const points: MonthlyYieldPoint[] = [];

    for (let offset = 11; offset >= 0; offset--) {
      const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const monthIdx = d.getMonth();
      const shortYear = String(d.getFullYear()).slice(-2);
      const monthName = isBn ? BN_MONTHS[monthIdx] : EN_MONTHS[monthIdx];
      const monthLabel = `${monthName} '${shortYear}`;

      let actualYieldKg: number;
      let targetYieldKg: number;
      let cropName: string;

      if (pattern) {
        targetYieldKg = Math.round(pattern.baseScale * pattern.targetFactors[monthIdx]);
        actualYieldKg = Math.round(pattern.baseScale * pattern.actualFactors[monthIdx]);
        cropName = isBn ? pattern.cropsByMonthBn[monthIdx] : pattern.cropsByMonth[monthIdx];
      } else {
        const seasonalWave = 0.85 + 0.25 * Math.sin((monthIdx / 12) * Math.PI * 2);
        const trustBoost = farmerProfile ? 0.9 + (farmerProfile.global_trust_score / 100) * 0.2 : 1.0;
        targetYieldKg = Math.round(fallbackScale * seasonalWave);
        actualYieldKg = Math.round(targetYieldKg * trustBoost);
        cropName = primaryCrop;
      }

      const successRate = Math.round((actualYieldKg / Math.max(1, targetYieldKg)) * 1000) / 10;

      points.push({
        monthKey: `${d.getFullYear()}-${String(monthIdx + 1).padStart(2, '0')}`,
        monthLabel,
        cropName,
        actualYieldKg,
        targetYieldKg,
        successRate
      });
    }

    return points;
  }, [farmerId, farmerProfile, isBn]);

  const summary = useMemo(() => {
    const totalActual = data.reduce((acc, p) => acc + p.actualYieldKg, 0);
    const totalTarget = data.reduce((acc, p) => acc + p.targetYieldKg, 0);
    const avgSuccessRate = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 1000) / 10 : 0;
    const peakMonth = data.reduce((best, cur) => (cur.actualYieldKg > best.actualYieldKg ? cur : best), data[0]);
    const monthsAboveTarget = data.filter((p) => p.actualYieldKg >= p.targetYieldKg).length;

    return {
      totalActual,
      avgSuccessRate,
      peakMonth,
      monthsAboveTarget
    };
  }, [data]);

  const renderTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const point: MonthlyYieldPoint = payload[0].payload;
    const beatTarget = point.actualYieldKg >= point.targetYieldKg;

    return (
      <div className="bg-[#1A2A1A] text-white px-3.5 py-2.5 rounded-xl shadow-lg border border-white/15 text-xs space-y-1.5 min-w-[190px]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1">
          <span className="font-bold text-white">{point.monthLabel}</span>
          <span className="text-[11px] text-emerald-300 font-semibold">{point.cropName}</span>
        </div>
        <div className="flex justify-between gap-4 font-mono tabular-nums">
          <span className="text-white/70">{isBn ? 'অর্জিত ফলন:' : 'Actual Yield:'}</span>
          <span className="font-bold text-emerald-300">{point.actualYieldKg.toLocaleString()} kg</span>
        </div>
        <div className="flex justify-between gap-4 font-mono tabular-nums">
          <span className="text-white/70">{isBn ? 'লক্ষ্যমাত্রা:' : 'Target Baseline:'}</span>
          <span className="font-medium text-white/90">{point.targetYieldKg.toLocaleString()} kg</span>
        </div>
        <div className="flex justify-between gap-4 font-mono tabular-nums pt-1 border-t border-white/10">
          <span className="text-white/70">{isBn ? 'সাফল্যের হার:' : 'Yield Success:'}</span>
          <span className={`font-extrabold ${beatTarget ? 'text-emerald-400' : 'text-amber-300'}`}>
            {point.successRate.toFixed(1)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div id="farmer-12m-yield-chart" className="pt-6 border-t border-[#1A2A1A]/10 space-y-4">
      {/* Section Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm md:text-base font-extrabold text-[#1A2A1A] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#2D4F1E]" />
            <span>
              {isBn
                ? 'গত ১২ মাসের ফসল উৎপাদনের সাফল্য'
                : '12-Month Historical Crop Yield Success'}
            </span>
          </h3>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-gray-500 font-medium tabular-nums">
            <span>
              {isBn ? 'মোট উৎপাদন:' : '12M Output:'}{' '}
              <strong className="text-[#1A2A1A] font-mono">
                {summary.totalActual.toLocaleString()} kg
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {isBn ? 'গড় সাফল্য:' : 'Avg Success:'}{' '}
              <strong
                className={`font-mono ${
                  summary.avgSuccessRate >= 100 ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {summary.avgSuccessRate.toFixed(1)}%
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {isBn ? 'সর্বোচ্চ মাস:' : 'Peak:'}{' '}
              <strong className="text-[#1A2A1A] font-mono">
                {summary.peakMonth?.monthLabel} ({summary.peakMonth?.actualYieldKg.toLocaleString()} kg)
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {isBn
                ? `লক্ষ্য অর্জন: ${summary.monthsAboveTarget}/১২ মাস`
                : `Target Met: ${summary.monthsAboveTarget}/12 mos`}
            </span>
          </div>
        </div>

        {/* Segmented Metric Filter */}
        <div
          role="group"
          aria-label={isBn ? 'চার্ট মেট্রিক নির্বাচন' : 'Chart metric view'}
          className="inline-flex items-center gap-1 p-1 bg-[#F4F1EA] rounded-xl border border-[#1A2A1A]/10 self-start md:self-auto shrink-0"
        >
          <button
            type="button"
            id="yield-chart-mode-volume"
            onClick={() => setMetricView('VOLUME')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              metricView === 'VOLUME'
                ? 'bg-[#2D4F1E] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#1A2A1A]'
            }`}
          >
            {isBn ? 'উৎপাদন (কেজি)' : 'Yield Volume (kg)'}
          </button>
          <button
            type="button"
            id="yield-chart-mode-rate"
            onClick={() => setMetricView('SUCCESS_RATE')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              metricView === 'SUCCESS_RATE'
                ? 'bg-[#2D4F1E] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#1A2A1A]'
            }`}
          >
            {isBn ? 'সাফল্যের হার (%)' : 'Success Rate (%)'}
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-64 sm:h-72 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          {metricView === 'VOLUME' ? (
            <ComposedChart data={data} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id={`yieldFill-${farmerId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D4F1E" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#2D4F1E" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="monthLabel"
                tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val: number) => `${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
              />
              <Tooltip content={renderTooltip} />
              <Bar
                dataKey="targetYieldKg"
                name={isBn ? 'লক্ষ্যমাত্রা (কেজি)' : 'Target Baseline (kg)'}
                fill="#E5E0D5"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
              <Area
                type="monotone"
                dataKey="actualYieldKg"
                name={isBn ? 'অর্জিত ফলন (কেজি)' : 'Actual Yield (kg)'}
                stroke="#2D4F1E"
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#yieldFill-${farmerId})`}
                activeDot={{ r: 5, fill: '#F97316', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </ComposedChart>
          ) : (
            <ComposedChart data={data} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id={`rateFill-${farmerId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="monthLabel"
                tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                domain={[70, 125]}
                tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val: number) => `${val}%`}
              />
              <Tooltip content={renderTooltip} />
              <ReferenceLine
                y={100}
                stroke="#2D4F1E"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: isBn ? '১০০% লক্ষ্য' : '100% Target',
                  position: 'insideTopRight',
                  fill: '#2D4F1E',
                  fontSize: 10,
                  fontWeight: 700
                }}
              />
              <Area
                type="monotone"
                dataKey="successRate"
                fill={`url(#rateFill-${farmerId})`}
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="successRate"
                name={isBn ? 'সাফল্যের হার (%)' : 'Yield Success (%)'}
                stroke="#F97316"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#F97316', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                activeDot={{ r: 5.5, fill: '#2D4F1E', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Compact Chart Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500">
        <div className="flex items-center gap-4">
          {metricView === 'VOLUME' ? (
            <>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#1A2A1A]">
                <span className="w-3 h-0.5 bg-[#2D4F1E] inline-block rounded-full" />
                {isBn ? 'অর্জিত ফলন (কেজি)' : 'Actual Harvested Yield (kg)'}
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-gray-600">
                <span className="w-2.5 h-2.5 bg-[#E5E0D5] inline-block rounded-xs" />
                {isBn ? 'মাসিক লক্ষ্যমাত্রা' : 'Monthly Target Baseline'}
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#1A2A1A]">
                <span className="w-3 h-0.5 bg-[#F97316] inline-block rounded-full" />
                {isBn ? 'লক্ষ্যের তুলনায় সাফল্য (%)' : 'Target Attainment Rate (%)'}
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-[#2D4F1E]">
                <span className="w-3 border-t border-dashed border-[#2D4F1E] inline-block" />
                {isBn ? '১০০% বেঞ্চমার্ক' : '100% Benchmark'}
              </span>
            </>
          )}
        </div>
        <span className="font-mono text-gray-400">
          {farmerName.split(' ')[0]} · {isBn ? 'বার্ষিক ফসল রেকর্ড' : 'Trailing 12 Months'}
        </span>
      </div>
    </div>
  );
};
