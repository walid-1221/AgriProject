import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sprout, 
  TrendingUp, 
  Award, 
  MapPin, 
  Layers, 
  Calendar, 
  BarChart3, 
  Wheat, 
  Fish, 
  Sun, 
  Droplets, 
  ShieldCheck, 
  PieChart, 
  Activity,
  ArrowUpRight,
  Sparkles,
  Info
} from "lucide-react";
import { LanguageMode } from "../types";

interface BangladeshAgriDataProps {
  lang: LanguageMode;
  onOpenLoginModal?: (role?: string) => void;
}

export const BangladeshAgriDataSection: React.FC<BangladeshAgriDataProps> = ({ lang, onOpenLoginModal }) => {
  const [selectedSeason, setSelectedSeason] = useState<"BORO" | "AMAN" | "AUS" | "RABI">("BORO");
  const [selectedZone, setSelectedZone] = useState<number>(0);

  const isBn = lang === "BN";

  // National Key Indicators (Source: BBS / BARC / DAE / Ministry of Agriculture)
  const nationalKPIs = [
    {
      title: isBn ? "বার্ষিক মোট খাদ্যশস্য উৎপাদন" : "Total Annual Foodgrain Production",
      value: "40.2M",
      unit: isBn ? "মেট্রিক টন" : "Metric Tons",
      change: "+3.4% YoY",
      subtext: isBn ? "ধান ও গমে খাদ্যে স্বয়ংসম্পূর্ণতা অর্জিত" : "Food self-sufficiency in rice staples",
      icon: <Wheat className="w-6 h-6 text-amber-500" />,
      badge: isBn ? "জাতীয় লক্ষ্যমাত্রা অর্জিত" : "Target Achieved",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300"
    },
    {
      title: isBn ? "জাতীয় জিডিপিতে কৃষির অবদান" : "Agriculture Share in GDP",
      value: "11.6%",
      unit: isBn ? "$৫০+ বিলিয়ন বাজার" : "$50B+ Agrisector",
      change: "+2.8% Growth",
      subtext: isBn ? "জাতীয় কর্মসংস্থানের ৪০.৬% যুক্ত" : "Employs 40.6% of national workforce",
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      badge: isBn ? "অর্থনীতির মূল চালিকা" : "Core Economic Engine",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300"
    },
    {
      title: isBn ? "মোট আবাদযোগ্য কৃষিজমি" : "Total Net Cultivable Land",
      value: "8.52M",
      unit: isBn ? "হেক্টর জমি" : "Hectares",
      change: "198% Intensity",
      subtext: isBn ? "গড় ফসল বহুমুখীকরণ ও শস্য তীব্রতা" : "High multiple-cropping intensity",
      icon: <Layers className="w-6 h-6 text-blue-600" />,
      badge: isBn ? "উচ্চ শস্য তীব্রতা" : "Triple Cropping",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300"
    },
    {
      title: isBn ? "মৎস্য ও ইলিশ উৎপাদনে বৈশ্বিক অবস্থান" : "Global Inland Fish & Hilsa Rank",
      value: "#3 / #1",
      unit: isBn ? "বিশ্বে ৩য় / ইলিশে ১ম" : "World #3 / #1 Hilsa",
      change: "4.8M MT",
      subtext: isBn ? "বিশ্বের মোট ইলিশের ৬৫%+ উৎপাদন" : "65%+ global Hilsa production share",
      icon: <Fish className="w-6 h-6 text-cyan-600" />,
      badge: isBn ? "বিশ্বে শীর্ষস্থান" : "Global Leader",
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300"
    }
  ];

  // Global Rankings of Bangladesh Agriculture
  const globalRanks = [
    { item: isBn ? "ধান উৎপাদন" : "Rice Production", rank: "#3", value: "38.5M MT", globalShare: "7.2% of global supply" },
    { item: isBn ? "পাট উৎপাদন ও রপ্তানি" : "Jute Production & Export", rank: "#2 / #1", value: "1.4M MT", globalShare: "Largest raw jute exporter" },
    { item: isBn ? "আলু উৎপাদন" : "Potato Production", rank: "#7", value: "11.2M MT", globalShare: "South Asia's leading surplus exporter" },
    { item: isBn ? "গ্রীষ্মমন্ডলীয় শাকসবজি" : "Vegetables & Tropical Crops", rank: "#3", value: "17.4M MT", globalShare: "60+ vegetable varieties year-round" },
    { item: isBn ? "মিঠাপানির মাছ" : "Inland Inland Fisheries", rank: "#3", value: "4.75M MT", globalShare: "Fastest growing aquaculture sector" },
    { item: isBn ? "আম ও কাঁঠাল উৎপাদন" : "Mango & Jackfruit Output", rank: "#2 / #7", value: "2.5M MT", globalShare: "GI tagged Fazli, Himsagar, Amrapali" }
  ];

  // Cropping Seasons Breakdown (Aus, Aman, Boro, Rabi)
  const seasonsData = {
    BORO: {
      name: isBn ? "বোরো মৌসুম (শীত ও বসন্ত)" : "Boro Season (Winter to Spring)",
      timing: isBn ? "ডিসেম্বর — মে (পৌষ থেকে বৈশাখ)" : "December — May (Winter/Dry)",
      share: "53.8%",
      production: "20.8 Million MT",
      irrigation: isBn ? "সেচ নির্ভর (গভীর নলকূপ / এলএলপি)" : "100% Irrigation Dependent (STW/DTW)",
      topCrops: isBn ? ["ব্রি ধান-২৮", "ব্রি ধান-২৯", "ব্রি ধান-৮৯", "বঙ্গবন্ধু ধান-১০০ (জিঙ্ক সমৃদ্ধ)", "হীরা হাইব্রিড"] : ["BRRI dhan-28", "BRRI dhan-29", "BRRI dhan-89", "Bangabandhu dhan-100 (Zinc)", "Heera Hybrid"],
      description: isBn 
        ? "বাংলাদেশের সবচেয়ে উৎপাদনশীল ধান মৌসুম। দেশের বার্ষিক ধান সরবরাহের অর্ধেকেরও বেশি বোরো থেকে আসে।"
        : "The cornerstone of Bangladesh food security, contributing over 53% of annual rice grain harvest via intensive irrigated cropping."
    },
    AMAN: {
      name: isBn ? "আমন মৌসুম (বর্ষা ও শরৎ)" : "Aman Season (Monsoon & Autumn)",
      timing: isBn ? "জুন — নভেম্বর (আষাঢ় থেকে কার্তিক)" : "June — November (Monsoon/Rainfed)",
      share: "38.5%",
      production: "14.9 Million MT",
      irrigation: isBn ? "বৃষ্টি নির্ভর ও সম্পূরক সেচ" : "Rainfed Monsoon Agro-Ecology",
      topCrops: isBn ? ["ব্রি ধান-৪৯", "ব্রি ধান-৫১ (বন্যা সহনশীল)", "ব্রি ধান-৮৭", "নাজিরশাইল", "কালিজিরা সুগন্ধি"] : ["BRRI dhan-49", "BRRI dhan-51 (Submergence)", "BRRI dhan-87", "Nazirshail", "Kalijira Aromatic"],
      description: isBn 
        ? "ঐতিহ্যবাহী নবান্ন উৎসবের প্রধান মৌসুম। জলবায়ু সহনশীল জাত উদ্ভাবনে বন্যা ও খরা সহনশীল আমন ফলন বৃদ্ধি পেয়েছে।"
        : "Traditional monsoon-fed season honoring Nabanna harvest. Modern submergence-tolerant (Sub1) varieties have boosted resilience."
    },
    AUS: {
      name: isBn ? "আউশ মৌসুম (গ্রীষ্ম ও প্রাক-বর্ষা)" : "Aus Season (Summer/Pre-Monsoon)",
      timing: isBn ? "মার্চ — জুলাই (চৈত্র থেকে আষাঢ়)" : "March — July (Pre-Monsoon)",
      share: "7.7%",
      production: "3.2 Million MT",
      irrigation: isBn ? "স্বল্প সেচ ও বৃষ্টিপাত ভিত্তিক" : "Low Water Footprint / Early Rain",
      topCrops: isBn ? ["ব্রি ধান-৪৮", "ব্রি ধান-৯৮", "নারিকা-১ (উচ্চফলনশীল খরাসহনশীল)"] : ["BRRI dhan-48", "BRRI dhan-98", "NERICA-1 (Drought tolerant)"],
      description: isBn 
        ? "কম খরচে ও কম পানিতে উৎপাদিত দ্রুতবর্ধনশীল প্রাক-বর্ষার স্বল্পকালীন ফসল।"
        : "Short-duration crop cycle that utilizes pre-monsoon showers with minimal fertilizer and irrigation footprints."
    },
    RABI: {
      name: isBn ? "রবি মৌসুম (শীতকালীন তেলবীজ, ডাল ও সবজি)" : "Rabi Season (Winter Veg, Pulses & Spices)",
      timing: isBn ? "নভেম্বর — মার্চ (অগ্রহায়ণ থেকে ফাল্গুন)" : "November — March (Winter)",
      share: "100%",
      production: "18.5M MT Vegetables & Spices",
      irrigation: isBn ? "পরিমিত সেচ ও শিশির নির্ভর" : "Moisture Regulated",
      topCrops: isBn ? ["আলু (ডায়মন্ড/কার্ডিনাল)", "সরিষা (বারি সরিষা-১৪)", "টমেটো", "পেঁয়াজ (তাহেরপুরী)", "মসুর ডাল"] : ["Potato (Diamant)", "Mustard (BARI-14)", "Tomato", "Onion (Taherpuri)", "Lentils"],
      description: isBn 
        ? "বাংলাদেশের সবজি ও ডালের স্বর্ণযুগ। আলু ও সরিষা উৎপাদনে বিপ্লব ঘটিয়ে রবি মৌসুম সর্বোচ্চ পুষ্টি যোগায়।"
        : "Golden window for high-value horticulture, winter vegetables, yellow mustard fields, and nutrient-dense pulses."
    }
  };

  // Major Regional Agricultural Hubs of Bangladesh
  const regionalHubs = [
    {
      region: isBn ? "বগুড়া ও রাজশাহী অঞ্চল (উত্তরবঙ্গ)" : "Bogura & Rajshahi (Northern Granary)",
      specialty: isBn ? "শাকসবজি, আলু, আম ও বীজ ভাণ্ডার" : "Vegetables, Potato, Mango & Seed Production Hub",
      yieldMetric: "24.5 MT/Ha Veg Yield",
      highlights: isBn ? "মহাস্থানগড় কাঁচাবাজার দেশের বৃহত্তম সবজির পাইকারি মোকাম। মসলা গবেষণা কেন্দ্র ও বিএডিসি বীজ জোন।" : "Mahasthangarh wholesale market, Spice Research Institute, BADC seed multiplication clusters.",
      activeFarmers: "480,000+ Enrolled",
      leadCrops: ["Potato", "Onion", "Chili", "Cabbage", "Fazli Mango"]
    },
    {
      region: isBn ? "গাজীপুর ও ময়মনসিংহ অঞ্চল" : "Gazipur & Mymensingh (Agri-Science Belt)",
      specialty: isBn ? "কৃষি গবেষণা, ধান বিজ্ঞান ও পোল্ট্রি হাব" : "BARC, BRRI, BARI, BAU Research & Agro-Tech",
      yieldMetric: "4.8 MT/Ha Rice Yield",
      highlights: isBn ? "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI) এবং কৃষি গবেষণা কাউন্সিল (BARC) প্রযুক্তি বিস্তারের প্রধান কেন্দ্র।" : "Home to BRRI, BARI, and Bangladesh Agricultural University (BAU) genomic centers.",
      activeFarmers: "320,000+ Enrolled",
      leadCrops: ["BRRI Rice", "Layer Poultry", "Fisheries", "Jackfruit", "Pineapple"]
    },
    {
      region: isBn ? "দিনাজপুর ও রংপুর অঞ্চল" : "Dinajpur & Rangpur (Grain & Fruit Valley)",
      specialty: isBn ? "কাটারিভোগ সুগন্ধি চাল, গম ও ভুট্টা" : "Kataribhog Aromatic Rice, Maize & Lychee",
      yieldMetric: "8.2 MT/Ha Maize Yield",
      highlights: isBn ? "দেশের শীর্ষ ভুট্টা ও সুগন্ধি চালের প্রধান সরবরাহকারী। দিনাজপুরী বেদানা ও বোম্বাই লিচু বিশ্বখ্যাত।" : "Leading national corn/maize supplier, prime aromatic paddy belt, world-renowned Bedana lychee.",
      activeFarmers: "410,000+ Enrolled",
      leadCrops: ["Aromatic Rice", "Maize", "Lychee", "Wheat", "Tobacco alternative"]
    },
    {
      region: isBn ? "বরিশাল ও খুলনা অঞ্চল (উপকূলীয় বেল্ট)" : "Barishal & Khulna (Southern Waterways & Fisheries)",
      specialty: isBn ? "ভাসমান বেডে সবজি, নারিকেল, ইলিশ ও গলদা চিংড়ি" : "Floating Hydroponic Agriculture & Brackish Shrimp",
      yieldMetric: "$1.2B Aquaculture Export",
      highlights: isBn ? "ইউনেস্কো স্বীকৃত ঐতিহ্যবাহী ভাসমান বেড চাষাবাদ পদ্ধতি। লবণাক্ততাসহিষ্ণু ব্রি ধান-৬৭ উদ্ভাবন কেন্দ্র।" : "UNESCO recognized Floating Bed farming, saline-tolerant rice BRRI-67 innovation zones.",
      activeFarmers: "295,000+ Enrolled",
      leadCrops: ["Galda/Bagda Shrimp", "Coconut", "Guava", "Betel Leaf", "Saline Rice"]
    },
    {
      region: isBn ? "সিলেট ও মৌলভীবাজার অঞ্চল" : "Sylhet & Moulvibazar (Tea & Agro-Forestry)",
      specialty: isBn ? "চা বাগান, সাতকড়া, আনারস ও আগর কাঠ" : "Tea Estates, Citrus Shatkora & Organic Agro-Forestry",
      yieldMetric: "96M Kg Tea Output",
      highlights: isBn ? "শ্রীমঙ্গল শ্রীভূমি ১৬০+ চা বাগানের হৃদয়। পাহাড়ি জৈব আনারস ও ঐতিহ্যবাহী সাতকড়া লেবু।" : "Sreemangal tea estates producing 96M kg orthodox black & green teas, prized Shatkora citrus.",
      activeFarmers: "185,000+ Enrolled",
      leadCrops: ["Black Tea", "Green Tea", "Shatkora", "Nagaland Chili", "Agarwood"]
    }
  ];

  // Daily Live Price Index (DAM - Department of Agricultural Marketing real baseline)
  const marketTickers = [
    { crop: isBn ? "মিনিকেট চাল (৫০ কেজি)" : "Miniket Rice (50kg)", price: "৳ 3,450", change: "+0.8%", trend: "up", mkt: "Dhaka Karwan Bazar" },
    { crop: isBn ? "ব্রি ধান-২৮ (ধান)" : "BRRI-28 Paddy (Maund)", price: "৳ 1,180", change: "+1.2%", trend: "up", mkt: "Bogura Mahasthan" },
    { crop: isBn ? "ডায়মন্ড গোল আলু" : "Diamant Potato (Kg)", price: "৳ 28.50", change: "-2.1%", trend: "down", mkt: "Munshiganj Cold Storage" },
    { crop: isBn ? "দেশি পেঁয়াজ (কেজি)" : "Deshi Onion (Kg)", price: "৳ 72.00", change: "+3.5%", trend: "up", mkt: "Faridpur Mokam" },
    { crop: isBn ? "সরিষা বীজ (মণ)" : "Mustard Seed (Maund)", price: "৳ 3,600", change: "0.0%", trend: "stable", mkt: "Sirajganj Mandi" },
    { crop: isBn ? "কাঁচা মরিচ (কেজি)" : "Green Chili (Kg)", price: "৳ 110.00", change: "-5.4%", trend: "down", mkt: "Jessore Chourasta" }
  ];

  return (
    <section id="bangladesh-agri-data-hub" className="space-y-8 animate-fadeIn font-sans">
      
      {/* --- HERO BANNER: BANGLADESH AGRICULTURE INTELLIGENCE --- */}
      <div className="bg-gradient-to-br from-[#1A2A1A] via-[#233A20] to-[#122013] text-white rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-xl border border-emerald-500/20">
        
        {/* Subtle decorative visual elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{isBn ? "বাংলাদেশ কৃষি সম্প্রসারণ ও গবেষণা তথ্য ভাণ্ডার (BARC / DAE / BBS)" : "Official Bangladesh Agri-Intelligence Hub (BARC / DAE / BBS Grounded)"}</span>
            </div>

            {/* Direct Quick Login Button Trigger */}
            {onOpenLoginModal && (
              <button
                onClick={() => onOpenLoginModal()}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-[#F97316] hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs px-5 py-2.5 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer border border-amber-300/30"
              >
                <span>🔑</span>
                <span>{isBn ? "৪-ভূমিকা লগইন পোর্টাল খুলুন" : "Open 4-Role Login Portal"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {isBn 
                ? "বাংলাদেশের কৃষি পরিসংখ্যান, শস্য পূর্বাভাস ও বাজার সংযোগ" 
                : "Empowering Bangladesh Agriculture with Data & Sovereign Exchange"}
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-medium">
              {isBn
                ? "খাদ্য উৎপাদনে স্বয়ংসম্পূর্ণতা, শস্য ক্যালেন্ডার, ৪ কোটি মেট্রিক টন খাদ্যশস্য ও ৬৪ জেলার কৃষিজীবীদের ডিজিটাল এগ্রো-ইকোসিস্টেম।"
                : "Real-time agro-economic indicators, crop seasonal calendars, soil diagnostics, and verified market links across all 64 districts of Bangladesh."}
            </p>
          </div>

          {/* Quick Role Gateway Cards */}
          <div className="pt-2">
            <p className="text-xs text-amber-300 font-extrabold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? "সরাসরি ভূমিকা অনুযায়ী কাজ শুরু করুন:" : "Quick Role Access Portal:"}</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onOpenLoginModal?.("PRODUCER")}
                className="bg-white/10 hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-400/50 p-3 rounded-2xl text-left transition-all group cursor-pointer"
              >
                <span className="text-xl mb-1 block group-hover:scale-110 transition-transform">🌾</span>
                <p className="text-xs font-black text-white">{isBn ? "১. উৎপাদক / কৃষক" : "1. Producer (Farmer)"}</p>
                <p className="text-[10px] text-gray-300">{isBn ? "ফসল তালিকা ও রোগ নির্ণয়" : "List crops & AI scan"}</p>
              </button>

              <button
                onClick={() => onOpenLoginModal?.("BUYER")}
                className="bg-white/10 hover:bg-amber-600/30 border border-white/10 hover:border-amber-400/50 p-3 rounded-2xl text-left transition-all group cursor-pointer"
              >
                <span className="text-xl mb-1 block group-hover:scale-110 transition-transform">🏢</span>
                <p className="text-xs font-black text-white">{isBn ? "২. ক্রেতা / ব্যবসায়ী" : "2. Buyer (Wholesale)"}</p>
                <p className="text-[10px] text-gray-300">{isBn ? "এস্ক্রো ডিপোজিট ও বায়না" : "Escrow deposit & buy"}</p>
              </button>

              <button
                onClick={() => onOpenLoginModal?.("OFFICER")}
                className="bg-white/10 hover:bg-sky-600/30 border border-white/10 hover:border-sky-400/50 p-3 rounded-2xl text-left transition-all group cursor-pointer"
              >
                <span className="text-xl mb-1 block group-hover:scale-110 transition-transform">🔬</span>
                <p className="text-xs font-black text-white">{isBn ? "৩. কৃষি কর্মকর্তা" : "3. Agri Officer / Doctor"}</p>
                <p className="text-[10px] text-gray-300">{isBn ? "মান যাচাই ও প্রেসক্রিপশন" : "Inspect & certify"}</p>
              </button>

              <button
                onClick={() => onOpenLoginModal?.("AGENT")}
                className="bg-white/10 hover:bg-purple-600/30 border border-white/10 hover:border-purple-400/50 p-3 rounded-2xl text-left transition-all group cursor-pointer"
              >
                <span className="text-xl mb-1 block group-hover:scale-110 transition-transform">📦</span>
                <p className="text-xs font-black text-white">{isBn ? "৪. জেলা এজেন্ট" : "4. District Agent"}</p>
                <p className="text-[10px] text-gray-300">{isBn ? "পরিবহন ও হাব সমন্বয়" : "Logistics & pooling"}</p>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* --- LIVE COMMODITY TICKER BAR (DAM Real Baseline) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm overflow-hidden"
      >
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
          <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">
            {isBn ? "দৈনিক পাইকারি বাজার দর (কৃষি বিপণন অধিদপ্তর - DAM)" : "Daily Wholesale Commodity Indices (DAM Bangladesh)"}
          </span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full ml-auto">
            {isBn ? "সরাসরি হালনাগাদ" : "Live Feed"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {marketTickers.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: idx * 0.05, ease: "easeOut" }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className="bg-gray-50/80 hover:bg-gray-100/80 p-2.5 rounded-xl border border-gray-100 transition-colors"
            >
              <p className="text-[11px] font-bold text-gray-700 truncate">{item.crop}</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-sm font-black text-gray-900 font-mono">{item.price}</span>
                <span className={`text-[10px] font-extrabold ${item.trend === 'up' ? 'text-emerald-600' : item.trend === 'down' ? 'text-rose-500' : 'text-gray-500'}`}>
                  {item.change}
                </span>
              </div>
              <p className="text-[9px] text-gray-400 truncate mt-0.5">{item.mkt}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* --- 4 KEY NATIONAL AGRI INDICATOR CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {nationalKPIs.map((kpi, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: idx * 0.1, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            whileHover={{ 
              y: -5, 
              boxShadow: "0 12px 28px -6px rgba(45, 79, 30, 0.12)",
              borderColor: "rgba(45, 79, 30, 0.25)"
            }}
            className="bg-white rounded-3xl p-6 border-2 border-gray-100 hover:border-emerald-500/30 transition-all shadow-sm flex flex-col justify-between gap-4 cursor-default"
          >
            <div className="flex items-center justify-between">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-3 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner"
              >
                {kpi.icon}
              </motion.div>
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${kpi.badgeColor}`}>
                {kpi.badge}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-500">{kpi.title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900 tracking-tight font-mono">{kpi.value}</span>
                <span className="text-xs font-extrabold text-emerald-600">{kpi.change}</span>
              </div>
              <p className="text-xs text-gray-700 font-medium">{kpi.unit}</p>
            </div>

            <p className="text-[11px] text-gray-500 border-t border-gray-100 pt-3 leading-relaxed">
              {kpi.subtext}
            </p>
          </motion.div>
        ))}
      </div>

      {/* --- GLOBAL RANKINGS & SEASONAL HARVEST CALENDAR GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT (5 cols): Global Agriculture Standings of Bangladesh */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 bg-white rounded-3xl border-2 border-gray-100 p-6 md:p-8 space-y-6 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2.5">
              <Award className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-base font-black text-gray-900">
                  {isBn ? "কৃষিতে বিশ্বমঞ্চে বাংলাদেশের অবস্থান" : "Global Agri Standings of Bangladesh"}
                </h3>
                <p className="text-xs text-gray-500">{isBn ? "FAO ও আন্তর্জাতিক কৃষি সংস্থা ডাটা" : "FAO & International Commodity Data"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {globalRanks.map((r, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + idx * 0.07, ease: "easeOut" }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(254, 243, 199, 0.6)" }}
                className="flex items-center justify-between p-3 bg-gray-50/80 hover:bg-amber-50/50 rounded-2xl border border-gray-100 transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-gray-900">{r.item}</span>
                  <p className="text-[10px] text-gray-500">{r.globalShare}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-amber-500 text-white font-black text-xs rounded-xl shadow-xs">
                    {r.rank}
                  </span>
                  <p className="text-[10px] font-bold text-gray-600 mt-0.5 font-mono">{r.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs leading-relaxed space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{isBn ? "গবেষণা ও জলবায়ু সহনশীল উদ্ভাবন" : "Climate-Resilient Agri Science"}</span>
            </p>
            <p className="text-[11px] text-emerald-800">
              {isBn
                ? "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI) এখন পর্যন্ত ১১৫+ উন্নত ধানের জাত উদ্ভাবন করেছে, যার মধ্যে জিঙ্কসমৃদ্ধ, লবণাক্ততাসহিষ্ণু ও বন্যা সহনশীল জাত রয়েছে।"
                : "BRRI has released 115+ specialized rice varieties including Zinc-biofortified, flood-submergence tolerant (Sub1), and saline-resistant (BRRI 67/73)."}
            </p>
          </div>
        </motion.div>

        {/* RIGHT (7 cols): Cropping Seasons of Bangladesh (Boro, Aman, Aus, Rabi) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 bg-white rounded-3xl border-2 border-gray-100 p-6 md:p-8 space-y-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    {isBn ? "বাংলাদেশের শস্য মৌসুম ও উৎপাদন বিভাজন" : "National Cropping Seasons & Production Share"}
                  </h3>
                  <p className="text-xs text-gray-500">{isBn ? "বোরো, আমন, আউশ ও রবি ক্যালেন্ডার" : "Boro, Aman, Aus & Rabi Crop Cycles"}</p>
                </div>
              </div>

              {/* Season Selection Pills */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl">
                {(["BORO", "AMAN", "AUS", "RABI"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeason(s)}
                    className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                      selectedSeason === s
                        ? "bg-[#2D4F1E] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Season Detail View */}
            <div className="mt-6 space-y-5">
              <div className="p-5 bg-gradient-to-br from-emerald-50/80 to-amber-50/50 rounded-2xl border border-emerald-200/60 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-base font-black text-[#1A2A1A]">
                    {seasonsData[selectedSeason].name}
                  </h4>
                  <span className="px-3 py-1 bg-[#2D4F1E] text-white text-xs font-black rounded-full font-mono">
                    {seasonsData[selectedSeason].share} {isBn ? "জাতীয় হিস্যা" : "National Share"}
                  </span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {seasonsData[selectedSeason].description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-emerald-100">
                    <span className="text-gray-500 font-bold block text-[10px] uppercase">{isBn ? "সময়কাল" : "Timing"}</span>
                    <span className="font-extrabold text-gray-900">{seasonsData[selectedSeason].timing}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-100">
                    <span className="text-gray-500 font-bold block text-[10px] uppercase">{isBn ? "উৎপাদন পরিমাণ" : "Annual Output"}</span>
                    <span className="font-extrabold text-emerald-800 font-mono">{seasonsData[selectedSeason].production}</span>
                  </div>
                </div>
              </div>

              {/* Lead Varieties Chips */}
              <div className="space-y-2">
                <p className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">
                  {isBn ? "প্রধান প্রধান শস্য ও অনুমোদিত জাতসমূহ:" : "Top Recommended Varieties & Cultivars:"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {seasonsData[selectedSeason].topCrops.map((crop, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-100 text-gray-800 hover:text-emerald-900 rounded-xl text-xs font-bold border border-gray-200 transition-colors">
                      🌱 {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500">
            <span>{isBn ? "তথ্যসূত্র: কৃষি সম্প্রসারণ অধিদপ্তর (DAE) ও বার্ক (BARC)" : "Source: DAE Annual Crop Bulletin & BARC Agricultural Statistics"}</span>
            <span className="font-mono text-emerald-700 font-bold">2024-2026 Baseline</span>
          </div>
        </motion.div>

      </div>

      {/* --- 5 REGIONAL AGRI HUBS ACCORDION / TABS --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-3xl border-2 border-gray-100 p-6 md:p-8 space-y-6 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="text-base font-black text-gray-900">
                {isBn ? "বাংলাদেশের প্রধান ৫টি আঞ্চলিক কৃষি হাব ও শস্য অঞ্চল" : "Major 5 Regional Agricultural Production Hubs"}
              </h3>
              <p className="text-xs text-gray-500">{isBn ? "জেলা ভিত্তিক বিশেষায়িত ফসল ও লজিস্টিক সমন্বয়" : "District-wise specialty clusters and logistical centers"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {regionalHubs.map((hub, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.4 + idx * 0.06 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedZone(idx)}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                selectedZone === idx
                  ? "bg-[#2D4F1E] text-white border-[#2D4F1E] shadow-md scale-[1.02]"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200"
              }`}
            >
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md inline-block mb-1.5 ${
                selectedZone === idx ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
              }`}>
                {isBn ? `অঞ্চল #${idx + 1}` : `Zone #${idx + 1}`}
              </span>
              <h4 className="text-xs font-black leading-tight line-clamp-2">{hub.region}</h4>
              <p className={`text-[11px] mt-2 font-mono font-bold ${
                selectedZone === idx ? "text-amber-300" : "text-emerald-700"
              }`}>
                {hub.yieldMetric}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Selected Hub Detailed Card */}
        <motion.div 
          key={selectedZone}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
            <div>
              <h4 className="text-base font-black text-gray-900">{regionalHubs[selectedZone].region}</h4>
              <p className="text-xs text-emerald-800 font-bold">{regionalHubs[selectedZone].specialty}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                👥 {regionalHubs[selectedZone].activeFarmers}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed font-medium">
            {regionalHubs[selectedZone].highlights}
          </p>

          <div>
            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wide block mb-2">
              {isBn ? "অনুমোদিত শীর্ষ ফসলসমূহ:" : "Dominant Produce & Cash Crops:"}
            </span>
            <div className="flex flex-wrap gap-2">
              {regionalHubs[selectedZone].leadCrops.map((crop, cIdx) => (
                <span key={cIdx} className="px-3 py-1 bg-white text-gray-800 border border-gray-300 rounded-xl text-xs font-bold shadow-xs">
                  🌾 {crop}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

      </motion.div>

    </section>
  );
};
