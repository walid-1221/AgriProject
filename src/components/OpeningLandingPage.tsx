import React, { useState, useEffect } from "react";
import { 
  Sprout, 
  CloudRain, 
  Newspaper, 
  Quote, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Stethoscope, 
  Truck, 
  Lock, 
  Sparkles, 
  ExternalLink, 
  Calendar, 
  Award, 
  ChevronRight, 
  Layers,
  Wheat,
  BarChart3,
  ShoppingCart,
  MessageSquare,
  Info,
  AlertTriangle,
  Globe,
  Sun,
  Moon,
  Leaf
} from "lucide-react";
import { User, LanguageMode, ThemeMode } from "../types";
import farmerSowingRainImg from "../assets/images/farmer_sowing_rain_1786221231480.jpg";
import { AnimatedAgriNewsTeller } from "./AnimatedAgriNewsTeller";

interface OpeningLandingPageProps {
  lang: LanguageMode;
  theme?: ThemeMode;
  users: User[];
  onSelectUser: (user: User) => void;
  onNavigateTab: (tab: "AGRI_DATA" | "STORE" | "COMMUNITY" | "ABOUT_US" | "DASHBOARD") => void;
  onOpenLoginModal: (role?: string) => void;
  onToggleLang?: () => void;
  onToggleTheme?: () => void;
}

export const OpeningLandingPage: React.FC<OpeningLandingPageProps> = ({
  lang,
  theme = "LIGHT",
  users,
  onSelectUser,
  onNavigateTab,
  onOpenLoginModal,
  onToggleLang,
  onToggleTheme
}) => {
  const isBn = lang === "BN";
  const [activeNewsCategory, setActiveNewsCategory] = useState<"ALL" | "MILESTONES" | "TECH" | "POLICY">("ALL");
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);

  // Selected persona for inline PIN entry
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | null>(null);
  const [inlinePin, setInlinePin] = useState("");
  const [pinError, setPinError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Featured 4 Primary Agricultural Personnel
  const featuredPeople = [
    {
      id: 101,
      name: "Abul Hasan Miah",
      nameBn: "আবুল হাসান মিয়া",
      role: "FARMER" as const,
      roleDisplay: "PRODUCER",
      roleLabel: isBn ? "ক্ষুদ্র প্রান্তিক চাষী (প্রডিউসার)" : "Smallholder Farmer / Producer",
      district: "Gabtali, Bogura",
      badge: "🌾 3.2 Acre Paddy & Mustard",
      avatar: "👨‍🌾",
      pin: "1234",
      skills: [
        isBn ? "বোরো ও আমন ধান আবাদ" : "Boro & Aman Rice Cultivation",
        isBn ? "AI রোগ নির্ণয় ও লজিস্টিকস" : "AI Pathology & Collective Freight",
        isBn ? "এসক্রো পেমেন্টে শস্য বিক্রয়" : "Direct Escrow Fair-Price Selling"
      ],
      bgGradient: "from-emerald-950/60 to-emerald-900/30",
      accentColor: "emerald"
    },
    {
      id: 201,
      name: "Sabbir Ahmed",
      nameBn: "সাব্বির আহমেদ",
      role: "BUYER" as const,
      roleDisplay: "BUYER",
      roleLabel: isBn ? "পাইকারি সুপারস্টোর বায়িং অফিসার" : "Wholesale Superstore Procurement Buyer",
      district: "Agora Superstores HQ, Dhaka",
      badge: "🏢 Institutional Buyer",
      avatar: "👔",
      pin: "2345",
      skills: [
        isBn ? "বাল্ক শস্য ক্রয় চুক্তি" : "Bulk Crop Procurement Contracts",
        isBn ? "স্মার্ট এসক্রো ফান্ড ডিপোজিট" : "Digital Escrow Vault Deposits",
        isBn ? "গ্রেড 'এ' সার্টিফাইড শস্য রসিদ" : "DAE Grade-A Verified Intake"
      ],
      bgGradient: "from-amber-950/60 to-orange-900/30",
      accentColor: "amber"
    },
    {
      id: 301,
      name: "Dr. Rafiqul Rahman",
      nameBn: "ড. রফিকুল রহমান",
      role: "AGRI_OFFICER" as const,
      roleDisplay: "OFFICER",
      roleLabel: isBn ? "কৃষি সম্প্রসারণ কর্মকর্তা ও উদ্ভিদ বিশেষজ্ঞ" : "DAE Agronomist & Crop Doctor",
      district: "DAE Rajshahi Regional Division",
      badge: "🔬 Gov-Certified Plant Pathologist",
      avatar: "👨‍⚕️",
      pin: "3456",
      skills: [
        isBn ? "শস্যমান গ্রেডিং ও ডিজিটাল সিল" : "Official Crop Quality Grading & Seal",
        isBn ? "টেলি-মেডিসিন ও প্রেসক্রিপশন" : "Crop Tele-Prescriptions & Diagnosis",
        isBn ? "পোকা ও রোগবালাই প্রতিরোধ" : "Regional Pest Outbreak Alerts"
      ],
      bgGradient: "from-blue-950/60 to-sky-900/30",
      accentColor: "sky"
    },
    {
      id: 401,
      name: "Agent Khorshed Alam",
      nameBn: "এজেন্ট খোরশেদ আলম",
      role: "AGENT" as const,
      roleDisplay: "AGENT",
      roleLabel: isBn ? "উপজেলা ফ্রেইট ও সংগ্রাহক এজেন্ট" : "Upazila Aggregation Hub Agent",
      district: "Bogura Regional Grain Terminal",
      badge: "📦 Logistics Coordinator",
      avatar: "🚚",
      pin: "4567",
      skills: [
        isBn ? "সম্মিলিত ট্রাক পুলিং" : "Collective Truck Pooling & Route Mgmt",
        isBn ? "ওয়েব্রিজ ডিজিটাল ওজন যাচাই" : "Certified Digital Weighment Gate",
        isBn ? "কোল্ড-স্টোরেজ লট ট্র্যাকিং" : "Cold-Storage Lot Allocation"
      ],
      bgGradient: "from-purple-950/60 to-violet-900/30",
      accentColor: "purple"
    }
  ];

  // News Statements from Leading Publications & Official Government Statements
  const newsStatements = [
    {
      id: 1,
      category: "MILESTONES",
      source: "The Daily Star",
      sourceBn: "দ্য ডেইলি স্টার",
      sourceTag: "National Agricultural Milestone",
      date: "August 2024",
      headline: "Bangladesh Achieves Historic 40.2M Metric Tons Foodgrain Milestone, Ranking 3rd Globally in Rice Output",
      headlineBn: "খাদ্যশস্যে রেকর্ড ৪০.২ মিলিয়ন টন উৎপাদন: বিশ্বে ধান উৎপাদনে ৩য় স্থানে বাংলাদেশ",
      statement: "According to recent official data from the Ministry of Agriculture and DAE, Bangladesh has achieved sustainable self-sufficiency in staple foodgrain production despite climate vulnerability, driven by widespread adoption of high-yielding Boro and submergence-tolerant Aman varieties.",
      statementBn: "কৃষি মন্ত্রণালয় ও ডিএই-এর তথ্য অনুযায়ী, জলবায়ু পরিবর্তন সত্ত্বেও বাংলাদেশ রেকর্ড খাদ্যশস্য উৎপাদনে স্বয়ংসম্পূর্ণতা ধরে রেখেছে এবং উন্নত বোরো ও আমন জাত উদ্ভাবনে বিশ্বমঞ্চে অগ্রণী ভূমিকা পালন করছে।",
      impactMetric: "40.2M MT Annual Yield",
      badge: "Global #3 Rice Producer",
      verified: true
    },
    {
      id: 2,
      category: "TECH",
      source: "Prothom Alo",
      sourceBn: "প্রথম আলো",
      sourceTag: "AgriTech & AI Pathology Special",
      date: "July 2024",
      headline: "AI-Powered Plant Pathology and Digital Escrow Exchange Shield Smallholder Farm Incomes in Northern Bangladesh",
      headlineBn: "‘স্মার্ট কৃষিতে বিপ্লব’: এআই রোগ নির্ণয় ও ডিজিটাল এসক্রো সরাসরি ন্যায্যমূল্য নিশ্চিত করছে",
      statement: "Field studies across Bogura, Dinajpur, and Rajshahi highlight how decentralized smartphone diagnostics and collective logistics aggregation have compressed intermediary markups, boosting net farmer income by 22% while cutting post-harvest transit losses.",
      statementBn: "বগুড়া, দিনাজপুর ও রাজশাহী অঞ্চলের মাঠপর্যায়ের প্রতিবেদনে দেখা গেছে—মোবাইলভিত্তিক রোগবালাই শনাক্তকরণ ও সমবায়ী মালবাহী পরিবহন ব্যবস্থা কৃষকের মধ্যস্বত্বভোগী নির্ভরতা কমিয়ে নিট আয় ২২% বৃদ্ধি করেছে।",
      impactMetric: "+22% Farmer Profit Margin",
      badge: "Smart Krishi 2030",
      verified: true
    },
    {
      id: 3,
      category: "POLICY",
      source: "The Financial Express",
      sourceBn: "দ্য ফাইন্যান্সিয়াল এক্সপ্রেস",
      sourceTag: "Macroeconomic & Trade Bulletin",
      date: "August 2024",
      headline: "Agriculture Sector Anchors 11.6% of National GDP and 40.6% Employment; Digital Modernization Key to Food Security",
      headlineBn: "জাতীয় জিডিপিতে কৃষির অবদান ১১.৬% ও কর্মসংস্থানে ৪০.৬%: টেকসই নিরাপত্তার কেন্দ্রবিন্দু",
      statement: "With an annual gross economic valuation surpassing $50 Billion, the agricultural sector remains the bedrock of Bangladesh's macro-resilience. Modern cold-chain networks and digital commodity grading are opening unprecedented export channels to 45+ international markets.",
      statementBn: "বার্ষিক ৫০ বিলিয়ন ডলারেরও বেশি অর্থনীতির এই খাত দেশের অর্থনীতির মূল চালিকাশক্তি। আধুনিক কোল্ড চেইন ও ডিজিটাল সার্টিফিকেশনের মাধ্যমে দেশীয় শাকসবজি ও ফলমূল এখন ৪৫টিরও বেশি দেশে রপ্তানি হচ্ছে।",
      impactMetric: "11.6% GDP Contribution",
      badge: "$50B+ Ag-Economy",
      verified: true
    },
    {
      id: 4,
      category: "MILESTONES",
      source: "Dhaka Tribune",
      sourceBn: "ঢাকা ট্রিবিউন",
      sourceTag: "Global Commodity Standing",
      date: "June 2024",
      headline: "FAO Report: Bangladesh Ranks in Global Top 10 for 22 Agricultural Products; #1 in Hilsa and #2 in Jute",
      headlineBn: "এফএও প্রতিবেদন: ২২টি কৃষি পণ্যে বিশ্বে শীর্ষ দশে বাংলাদেশ; ইলিশে ১ম ও পাটে ২য়",
      statement: "Food and Agriculture Organization (FAO) statistics confirm Bangladesh's exceptional agro-ecological productivity. The country produces over 65% of the world's Hilsa shad and stands 2nd in raw jute, 7th in potato harvest, and 3rd in tropical vegetables.",
      statementBn: "জাতিসংঘের খাদ্য ও কৃষি সংস্থা (FAO)-এর তথ্যমতে, বিশ্বের মোট ইলিশের ৬৫% উৎপাদনে শীর্ষস্থান এবং পাট উৎপাদনে ২য়, আলুতে ৭ম ও সবজিতে ৩য় অবস্থানে রয়েছে বাংলাদেশ।",
      impactMetric: "Top 10 in 22 Commodities",
      badge: "World Leader in Hilsa",
      verified: true
    },
    {
      id: 5,
      category: "TECH",
      source: "BSS (Bangladesh Sangbad Sangstha)",
      sourceBn: "বাংলাদেশ সংবাদ সংস্থা (বাসস)",
      sourceTag: "Govt Press Bulletin",
      date: "August 2024",
      headline: "Ministry of Agriculture Accelerates 'Smart Krishi' with Unified Digital Land Health & Upazila Logistics Network",
      headlineBn: "কৃষি মন্ত্রণালয়: সারাদেশে 'স্মার্ট কৃষি' উদ্যোগ সম্প্রসারণ ও সমবায়ী ফ্রেইট নেটওয়ার্ক চালুর ঘোষণা",
      statement: "The government has rolled out priority incentives for solar-powered micro-irrigation, geo-tagged grain quality seals, and digital marketplace linkages connecting 16.5 million registered farmers to direct industrial institutional buyers.",
      statementBn: "সরকার দেশের ১ কোটি ৬৫ লাখ নিবন্ধিত কৃষকের জন্য সৌরচালিত সেচ, কিউআর কোডযুক্ত শস্যমান প্রত্যয়ন এবং সরাসরি করপোরেট ক্রেতাদের সাথে সংযুক্ত সমবায়ী ডিজিটাল মার্কেট হাব সম্প্রসারণ করছে।",
      impactMetric: "16.5M Farmer Households",
      badge: "DAE National Mandate",
      verified: true
    }
  ];

  // Auto rotate top ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTickerIndex(prev => (prev + 1) % newsStatements.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [newsStatements.length]);

  const filteredNews = activeNewsCategory === "ALL" 
    ? newsStatements 
    : newsStatements.filter(n => n.category === activeNewsCategory);

  const handleQuickLogin = (person: typeof featuredPeople[0]) => {
    const dbUser = users.find(u => u.user_id === person.id) || {
      user_id: person.id,
      name: person.name,
      role: person.role,
      upazila_district: person.district,
      phone_number: "+8801999888777",
      joined_date: "2024-01-10T10:00:00Z"
    };
    onSelectUser(dbUser as User);
  };

  const handleInlinePinSubmit = (person: typeof featuredPeople[0]) => {
    if (inlinePin === person.pin) {
      setIsVerifying(true);
      setPinError("");
      setTimeout(() => {
        setIsVerifying(false);
        handleQuickLogin(person);
      }, 400);
    } else {
      setPinError(isBn ? `ভুল পিন! সঠিক পিন: ${person.pin}` : `Incorrect PIN! Correct PIN is: ${person.pin}`);
    }
  };

  return (
    <div 
      id="opening-landing-page"
      className="min-h-screen text-white font-sans selection:bg-[#F97316]/30 bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(8, 18, 10, 0.82), rgba(10, 22, 12, 0.93)), url(${farmerSowingRainImg})`,
        backgroundAttachment: "fixed"
      }}
    >
      {/* Subtle Glow Overlay */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F97316]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* --- LIVE BREAKING NEWS TICKER HEADER --- */}
      <div className="bg-black/60 backdrop-blur-md border-b border-white/10 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
            <span className="flex items-center gap-1 bg-red-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 animate-pulse">
              <Newspaper className="w-3 h-3" />
              {isBn ? "কৃষি সংবাদ ও বার্তা" : "BD Agri News Wire"}
            </span>
            <div className="text-emerald-200 font-medium truncate flex items-center gap-1.5">
              <span className="text-amber-400 font-bold">[{isBn ? newsStatements[currentTickerIndex].sourceBn : newsStatements[currentTickerIndex].source}]:</span>
              <span>{isBn ? newsStatements[currentTickerIndex].headlineBn : newsStatements[currentTickerIndex].headline}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] text-gray-300 font-medium">
            <span className="flex items-center gap-1 text-sky-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
              <CloudRain className="w-3.5 h-3.5 text-sky-400" />
              <span>{isBn ? "বর্ষা ও আমন বীজ বপন মৌসুম" : "Monsoon Rice Sowing Active"}</span>
            </span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span className="text-amber-400 font-bold hidden md:inline">🌾 {isBn ? "বিশ্বে ৩য় শীর্ষ ধান উৎপাদক" : "World #3 Rice Harvest"}</span>
            
            {onToggleLang && (
              <button
                onClick={onToggleLang}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-xl text-[11px] font-black cursor-pointer transition-all ml-1"
                title="Toggle Language"
              >
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>{lang === "EN" ? "বাংলা (BN)" : "English (EN)"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12 relative z-10">

        {/* --- HERO BANNER & WELCOME STATEMENT --- */}
        <section className="text-center space-y-4 max-w-4xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-black border border-emerald-500/30 backdrop-blur-md shadow-sm">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>SmartFarmer OS v4.2.0 • Digital Agriculture & Collective Market Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {isBn ? "স্মার্টফার্মার বাংলাদেশ" : "Empowering Bangladesh Agriculture"}
            <span className="block text-xl sm:text-2xl font-bold text-amber-400 mt-2">
              {isBn 
                ? "কৃষক, করপোরেট ক্রেতা, কৃষিবিদ ও ফ্রেইট এজেন্টের সমন্বিত ডিজিটাল প্ল্যাটফর্ম"
                : "Integrated E-Governance, Real-Time AI Pathology & Escrow Market Exchange"}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-200/90 max-w-2xl mx-auto font-medium leading-relaxed">
            {isBn
              ? "বাংলাদেশের ১ কোটি ৬৫ লাখ কৃষক পরিবারের শ্রম এবং ফসলের ন্যায্যমূল্য নিশ্চিত করতে এআই উদ্ভিদ রোগ নির্ণয়, সরকারি ডিএই প্রত্যয়ন ও সমবায়ী লজিস্টিকসের ডিজিটাল সংযোগ।"
              : "Connecting 16.5M+ agrarian households with AI leaf pathology, DAE digital certification, bulk corporate escrow trade, and collective upazila freight pooling."}
          </p>

          {/* QUICK PUBLIC EXPLORATION BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab("AGRI_DATA")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-emerald-700 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 cursor-pointer transition-all border border-emerald-400/30 hover:scale-105"
            >
              <BarChart3 className="w-4 h-4 text-emerald-300" />
              <span>{isBn ? "🇧🇩 বাংলাদেশ কৃষি তথ্য ও পরিসংখ্যান" : "🇧🇩 Explore BD Agri Statistics"}</span>
            </button>

            <button
              onClick={() => onNavigateTab("STORE")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950/50 cursor-pointer transition-all border border-amber-300/30 hover:scale-105"
            >
              <ShoppingCart className="w-4 h-4 text-amber-200" />
              <span>{isBn ? "🌾 পাবলিক ই-কমার্স শস্য বাজার" : "🌾 Public E-Commerce Market"}</span>
            </button>

            <button
              onClick={() => onNavigateTab("COMMUNITY")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-white/10 hover:bg-white/20 text-white backdrop-blur-md cursor-pointer transition-all border border-white/15 hover:scale-105"
            >
              <MessageSquare className="w-4 h-4 text-sky-300" />
              <span>{isBn ? "💬 কৃষক ফোরাম ও সতর্কতা" : "💬 Community Pest Alerts"}</span>
            </button>

            <button
              onClick={() => onOpenLoginModal()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-[#F97316] text-white shadow-xl cursor-pointer transition-all border border-amber-300/30 hover:scale-105"
            >
              <span>🔑</span>
              <span>{isBn ? "লগইন / ৪ ভূমিকা পোর্টাল" : "Login / 4 Roles Modal"}</span>
            </button>
          </div>
        </section>

        {/* --- 4 PERSONA CARDS (PRODUCER, BUYER, OFFICER, AGENT) --- */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="p-1.5 bg-[#F97316]/20 text-[#F97316] rounded-lg border border-[#F97316]/30 text-xs font-black">
                  PORTAL ACCESS
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {isBn ? "🔑 ৪টি মূল কৃষি ভূমিকায় সরাসরি সেশন লগইন" : "🔑 4 Primary Agricultural Workstation Roles"}
                </h2>
              </div>
              <p className="text-xs text-gray-300 font-medium">
                {isBn 
                  ? "যে কোনো একটি ভূমিকায় '⚡ সরাসরি লগইন' চাপুন অথবা পাসকোড পিন ব্যবহার করে সেশন শুরু করুন:"
                  : "Click '⚡ Direct Log In' on any personnel card or enter designated PIN to enter the dashboard session:"}
              </p>
            </div>

            <span className="text-[11px] text-emerald-300 bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-500/30 font-mono font-bold">
              ✓ All 4 Workstation Roles Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPeople.map((person) => {
              const isSelected = selectedPersonaId === person.id;

              return (
                <div
                  key={person.id}
                  className={`bg-black/50 backdrop-blur-xl border-2 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between gap-5 relative overflow-hidden shadow-2xl group ${
                    isSelected 
                      ? "border-amber-400 ring-2 ring-amber-400/40 scale-[1.02]" 
                      : "border-white/15 hover:border-emerald-400/50 hover:scale-[1.01]"
                  }`}
                >
                  {/* Subtle Top Glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${person.bgGradient} rounded-full blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl p-2 bg-white/10 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {person.avatar}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border bg-white/10 text-gray-200 border-white/15">
                        {person.roleDisplay}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                        {isBn ? person.nameBn : person.name}
                      </h3>
                      <p className="text-[11px] font-bold text-amber-300/90">{person.roleLabel}</p>
                      <p className="text-[11px] text-gray-300 flex items-center gap-1 font-medium pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>{person.district}</span>
                      </p>
                    </div>

                    <div className="inline-block bg-white/5 border border-white/10 text-[10px] text-gray-200 px-2.5 py-1 rounded-xl font-medium">
                      {person.badge}
                    </div>

                    <ul className="space-y-1.5 border-t border-white/10 pt-3">
                      {person.skills.map((skill, idx) => (
                        <li key={idx} className="text-[11px] text-gray-200 flex items-start gap-1.5 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ACTION CONTROLS */}
                  <div className="space-y-3 relative z-10 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between text-[11px] font-mono px-1">
                      <span className="text-gray-400 font-semibold">{isBn ? "নির্ধারিত পাসকোড:" : "Login PIN Key:"}</span>
                      <span className="text-amber-400 font-black bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                        PIN {person.pin}
                      </span>
                    </div>

                    {!isSelected ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleQuickLogin(person)}
                          className="py-2.5 bg-white/10 hover:bg-emerald-600 text-white font-black text-xs rounded-xl cursor-pointer transition-all text-center border border-white/15 hover:border-emerald-400 shadow-sm"
                          title="Instant 1-Click Login"
                        >
                          ⚡ {isBn ? "সরাসরি প্রবেশ" : "Direct Log In"}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPersonaId(person.id);
                            setInlinePin("");
                            setPinError("");
                          }}
                          className="py-2.5 bg-[#2D4F1E] hover:bg-[#3d6b28] text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all text-center border border-emerald-500/40"
                        >
                          🔑 {isBn ? "পিন দিন" : "Enter PIN"}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 bg-black/60 p-3 rounded-2xl border border-amber-500/30 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="PIN"
                            value={inlinePin}
                            onChange={(e) => setInlinePin(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleInlinePinSubmit(person);
                            }}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-center text-sm font-mono font-bold tracking-widest text-amber-300 placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                            autoFocus
                          />
                          <button
                            onClick={() => handleInlinePinSubmit(person)}
                            disabled={isVerifying}
                            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs rounded-xl cursor-pointer transition-all shrink-0 font-sans"
                          >
                            {isVerifying ? "..." : (isBn ? "যাচাই" : "Submit")}
                          </button>
                        </div>

                        {pinError && (
                          <p className="text-[10px] text-red-400 font-bold text-center">
                            {pinError}
                          </p>
                        )}

                        <div className="flex justify-between items-center text-[10px] text-gray-400 px-1">
                          <button
                            onClick={() => setSelectedPersonaId(null)}
                            className="hover:text-white underline cursor-pointer"
                          >
                            {isBn ? "বাতিল" : "Cancel"}
                          </button>
                          <button
                            onClick={() => setInlinePin(person.pin)}
                            className="text-amber-400 hover:underline cursor-pointer font-mono font-bold"
                          >
                            {isBn ? "স্বয়ংক্রিয় পিন পূরণ" : `Auto-fill ${person.pin}`}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- ANIMATED AGRI NEWS TELLER & NEWSPAPER PRESS (OS NEWSPAPER) --- */}
        <section className="space-y-6">
          <AnimatedAgriNewsTeller
            lang={lang}
            onOpenRoleModal={onOpenLoginModal}
          />
        </section>

        {/* --- BANGLADESH AGRI AT A GLANCE (KEY NUMBERS STRIP) --- */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-1 text-center">
            <span className="text-3xl font-black text-emerald-400 font-mono">40.2M MT</span>
            <p className="text-xs font-bold text-gray-300 uppercase tracking-wide">
              {isBn ? "বার্ষিক মোট খাদ্যশস্য" : "Foodgrain Output"}
            </p>
            <span className="text-[10px] text-emerald-300/80 block">{isBn ? "খাদ্যে স্বয়ংসম্পূর্ণতা অর্জিত" : "Self-Sufficiency in Rice"}</span>
          </div>

          <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-1 text-center">
            <span className="text-3xl font-black text-amber-400 font-mono">#3 in World</span>
            <p className="text-xs font-bold text-gray-300 uppercase tracking-wide">
              {isBn ? "বিশ্বে ধান উৎপাদনে ৩য়" : "Global Rice Standing"}
            </p>
            <span className="text-[10px] text-amber-300/80 block">{isBn ? "চিন ও ভারতের পরেই" : "Behind China & India"}</span>
          </div>

          <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-1 text-center">
            <span className="text-3xl font-black text-sky-400 font-mono">11.6% GDP</span>
            <p className="text-xs font-bold text-gray-300 uppercase tracking-wide">
              {isBn ? "জাতীয় জিডিপিতে অবদান" : "Share of National GDP"}
            </p>
            <span className="text-[10px] text-sky-300/80 block">{isBn ? "৪০.৬% প্রত্যক্ষ কর্মসংস্থান" : "40.6% Workforce Employed"}</span>
          </div>

          <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-1 text-center">
            <span className="text-3xl font-black text-purple-400 font-mono">16.5M</span>
            <p className="text-xs font-bold text-gray-300 uppercase tracking-wide">
              {isBn ? "কৃষক পরিবার" : "Farmer Households"}
            </p>
            <span className="text-[10px] text-purple-300/80 block">{isBn ? "ডিজিটাল কৃষি নেটওয়ার্কে যুক্ত" : "DAE Registered Agrarians"}</span>
          </div>
        </section>

      </div>

      {/* --- BOTTOM FOOTER NOTE --- */}
      <footer className="max-w-7xl mx-auto px-4 py-6 border-t border-white/10 text-center text-xs text-gray-400 font-medium">
        <p>
          SmartFarmer OS Bangladesh • Co-operative E-Governance, AI Plant Pathology & Logistics Terminal
        </p>
      </footer>
    </div>
  );
};
