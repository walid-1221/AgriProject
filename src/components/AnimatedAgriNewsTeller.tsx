import React, { useState, useEffect, useRef } from "react";
import { 
  Newspaper, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Radio, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Calendar, 
  Globe, 
  ChevronRight, 
  ChevronLeft, 
  Quote, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  Maximize2, 
  Minimize2,
  Mic,
  Waves,
  Zap
} from "lucide-react";
import { LanguageMode } from "../types";

export interface NewsStory {
  id: number;
  category: "MILESTONES" | "TECH" | "POLICY" | "CLIMATE";
  categoryLabelEn: string;
  categoryLabelBn: string;
  source: string;
  sourceBn: string;
  sourceTag: string;
  date: string;
  volume: string;
  headline: string;
  headlineBn: string;
  subheading: string;
  subheadingBn: string;
  statement: string;
  statementBn: string;
  fullEditorial: string;
  fullEditorialBn: string;
  impactMetric: string;
  impactLabel: string;
  impactLabelBn: string;
  badge: string;
  reporter: string;
  reporterBn: string;
  location: string;
  locationBn: string;
}

interface AnimatedAgriNewsTellerProps {
  lang: LanguageMode;
  onOpenRoleModal?: (role?: string) => void;
}

export const AnimatedAgriNewsTeller: React.FC<AnimatedAgriNewsTellerProps> = ({
  lang,
  onOpenRoleModal
}) => {
  const isBn = lang === "BN";

  // News dataset with rich journalism stories
  const stories: NewsStory[] = [
    {
      id: 1,
      category: "MILESTONES",
      categoryLabelEn: "National Milestone",
      categoryLabelBn: "জাতীয় মাইলফলক",
      source: "The Daily Star",
      sourceBn: "দ্য ডেইলি স্টার",
      sourceTag: "Agricultural Special Report",
      date: "August 2024",
      volume: "Vol. 42 • No. 108",
      headline: "Bangladesh Achieves Record 40.2 Million Metric Tons Foodgrain Output, Ranking 3rd Globally in Rice Production",
      headlineBn: "খাদ্যশস্যে রেকর্ড ৪০.২ মিলিয়ন মেট্রিক টন উৎপাদন: বিশ্বে ধান উৎপাদনে ৩য় স্থানে বাংলাদেশ",
      subheading: "Climate-resilient Boro seeds and rapid mechanization power historic self-sufficiency.",
      subheadingBn: "জলবায়ু সহনশীল বোরো জাত ও আধুনিক কৃষি যান্ত্রিকীকরণে খাদ্যে ঐতিহাসিক স্বয়ংসম্পূর্ণতা।",
      statement: "According to recent official reports from the Ministry of Agriculture and DAE, Bangladesh has secured sustainable foodgrain self-sufficiency, surpassing major international agrarian benchmarks.",
      statementBn: "কৃষি মন্ত্রণালয় ও ডিএই-এর সাম্প্রতিক তথ্যানুযায়ী, দুর্যোগপূর্ণ আবহাওয়া সত্ত্বেও বাংলাদেশ খাদ্যশস্যে স্বয়ংসম্পূর্ণতা অর্জন করে বিশ্বমঞ্চে তৃতীয় শীর্ষ ধান উৎপাদনকারী দেশে পরিণত হয়েছে।",
      fullEditorial: "Decades of dedicated agronomical innovation by BRRI and BARI have transformed Bangladesh's floodplains into a food basket. Through submergence-tolerant Aman lines and hyper-yielding winter Boro varieties (BRRI dhan-28, 29, 89, 92), domestic yields have surged 350% since 1971. Despite holding less than 1% of the world's arable land, the nation feeds over 170 million citizens with sovereign grain reserves.",
      fullEditorialBn: "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI) ও বারি (BARI)-র বিজ্ঞানীদের উদ্ভাবিত উন্নত জাতের ধান দেশের খাদ্য নিরাপত্তায় বৈপ্লবিক রূপান্তর ঘটিয়েছে। ব্রি ধান-৮৯ ও ৯২ জাতের মতো উচ্চফলনশীল উদ্ভাবন হেক্টরপ্রতি ফলন বহুগুণ বৃদ্ধি করেছে। পৃথিবীর মোট আবাদযোগ্য জমির মাত্র ১ শতাংশেরও কম থাকা সত্ত্বেও ১৭ কোটিরও বেশি মানুষের অন্ন যোগাচ্ছে বাংলাদেশের উর্বর পললভূমি।",
      impactMetric: "40.2M MT",
      impactLabel: "Annual Grain Output",
      impactLabelBn: "বার্ষিক মোট খাদ্যশস্য",
      badge: "Global #3 Rice Producer",
      reporter: "Kabir Hossain, Senior Agri Editor",
      reporterBn: "কবীর হোসেন, সিনিয়র কৃষি প্রতিবেদক",
      location: "Dhaka Secretariat",
      locationBn: "ঢাকা সচিবালয়"
    },
    {
      id: 2,
      category: "TECH",
      categoryLabelEn: "Smart AgriTech & AI",
      categoryLabelBn: "স্মার্ট প্রযুক্তি ও এআই",
      source: "Prothom Alo",
      sourceBn: "প্রথম আলো",
      sourceTag: "Digital Farming & AI Special",
      date: "July 2024",
      volume: "Vol. 27 • No. 214",
      headline: "AI-Powered Plant Pathology and Digital Escrow Boost Northern Farmer Profit Margins by 22%",
      headlineBn: "‘স্মার্ট কৃষিতে বিপ্লব’: মোবাইল এআই রোগ নির্ণয় ও ডিজিটাল এসক্রো কৃষকের মুনাফা ২২% বাড়িয়েছে",
      subheading: "Decentralized vision models diagnose crop blight instantly while direct buyer contracts bypass middlemen.",
      subheadingBn: "স্মার্টফোনে ছবি তুলেই ব্লাস্ট ও মাজরা পোকা শনাক্তকরণ; মধ্যস্বত্বভোগী ছাড়াই ন্যায্যমূল্যে সরাসরি পাইকারি বিক্রি।",
      statement: "Empirical surveys in Bogura and Dinajpur show smallholders leveraging real-time image diagnosis cut agrochemical waste by 34% while securing guaranteed escrow payments from institutional buyers.",
      statementBn: "বগুড়া ও দিনাজপুরের মাঠপর্যায়ের গবেষণায় দেখা গেছে—এআই ভিত্তিক ফসলের রোগ নির্ণয়ে কীটনাশকের অপচয় ৩৪% হ্রাস পেয়েছে এবং সরাসরি ডিজিটাল এসক্রো চুক্তিতে কৃষক রেকর্ড ন্যায্যমূল্য পাচ্ছেন।",
      fullEditorial: "Smallholder farmers who previously relied on guess-work and aggressive chemical applications now capture leaf photographs via smartphone. The Gemini-powered neural classifier identifies Rice Blast, Sheath Blight, and Bacterial Leaf Streak within 1.4 seconds, issuing tailored bio-organic countermeasures. Concurrently, cooperative truck pooling slashes transit costs from ৳৪.৫০/কেজি to ৳১.২০/কেজি.",
      fullEditorialBn: "পূর্বে যেসকল কৃষক অনুমানের ওপর ভিত্তি করে অতিরিক্ত সার ও বিষ প্রয়োগ করতেন, তারা এখন স্মার্টফোনে পাতার ছবি তুলেই নিমেষেই সঠিক রোগ ও প্রতিকার জেনে নিচ্ছেন। এতে একদিকে ফসলের ক্ষয়ক্ষতি রোধ হচ্ছে, অন্যদিকে সমবায়ী ফ্রেইট ট্র্যাকিংয়ের মাধ্যমে পরিবহন খরচ হেক্টরপ্রতি অর্ধেকেরও নিচে নেমে এসেছে।",
      impactMetric: "+22%",
      impactLabel: "Farmer Net Income Gain",
      impactLabelBn: "কৃষকের নিট মুনাফা বৃদ্ধি",
      badge: "Smart Krishi 2030",
      reporter: "Nasreen Sultana, Tech & Economy",
      reporterBn: "নাসরীন সুলতানা, বিজ্ঞান ও প্রযুক্তি ডেস্ক",
      location: "Bogura Grain Terminal",
      locationBn: "বগুড়া শস্য টার্মিনাল"
    },
    {
      id: 3,
      category: "POLICY",
      categoryLabelEn: "Macroeconomic & Export",
      categoryLabelBn: "সামষ্টিক অর্থনীতি ও রপ্তানি",
      source: "The Financial Express",
      sourceBn: "দ্য ফাইন্যান্সিয়াল এক্সপ্রেস",
      sourceTag: "National Economic Bulletin",
      date: "August 2024",
      volume: "Vol. 32 • No. 89",
      headline: "Agriculture Generates 11.6% of National GDP & 40.6% Employment; Value Crosses $50 Billion",
      headlineBn: "জাতীয় জিডিপিতে কৃষির অবদান ১১.৬% ও কর্মসংস্থানে ৪০.৬%: ৫০ বিলিয়ন ডলার ছাড়িয়েছে কৃষি অর্থনীতি",
      subheading: "High-value horticulture, mango corridors, and cold storage lots drive export shipments to 45 nations.",
      subheadingBn: "আম, পেয়ারা ও শাকসবজির আধুনিক কোল্ড-চেইন প্যাকেজিংয়ে ইউরোপ ও মধ্যপ্রাচ্যের ৪৫টি দেশে রপ্তানি সম্প্রসারণ।",
      statement: "The macroeconomic stability of Bangladesh is anchored by its agrarian heartland, with modern processing hubs unlocking non-traditional agro-commodity export markets worldwide.",
      statementBn: "বাংলাদেশের সামষ্টিক অর্থনৈতিক ভিত্তির প্রধান খুঁটি দেশের কৃষি খাত। আধুনিক প্যাকিং ও কিউআর কোড গ্রেডিংয়ের মাধ্যমে বিশ্ববাজারে দেশীয় কৃষিপণ্যের চাহিদা বৃদ্ধি পাচ্ছে।",
      fullEditorial: "Agricultural commerce in Bangladesh is rapidly expanding beyond raw paddy into processed agro-food exports. High-density commercial orchards in Chapainawabganj, Chuadanga, and Satkhira are certified under Global GAP standards. With the government subsidizing 50% of cold chain storage infrastructure, post-harvest losses are trending downward from historic highs of 28% to under 12%.",
      fullEditorialBn: "প্রথাগত কৃষিকে অতিক্রম করে বাংলাদেশ এখন বাণিজ্যিক কৃষির দিকে দ্রুত এগিয়ে চলেছে। চাঁপাইনবাবগঞ্জের আম ও দক্ষিণাঞ্চলের পেয়ারা আন্তর্জাতিক মানসনদ (Global GAP) অর্জন করে বিশ্বমানের বাজারে প্রবেশ করছে। কোল্ড স্টোরেজ সুবিধা ও সৌরবিদ্যুৎচালিত সেচব্যবস্থা খাদ্য অপচয় নাটকীয়ভাবে কমিয়ে এনেছে।",
      impactMetric: "11.6% GDP",
      impactLabel: "Economic Contribution",
      impactLabelBn: "জিডিপিতে সরাসরি অবদান",
      badge: "$50B+ Agri-Economy",
      reporter: "Tanvir Anam, Macro Strategist",
      reporterBn: "তানভীর আনাম, অর্থনৈতিক বিশ্লেষক",
      location: "Motijheel Financial District",
      locationBn: "মতিঝিল বাণিজ্যিক এলাকা"
    },
    {
      id: 4,
      category: "MILESTONES",
      categoryLabelEn: "Global Commodity Standing",
      categoryLabelBn: "বিশ্বমঞ্চে শীর্ষ অবস্থান",
      source: "Dhaka Tribune",
      sourceBn: "ঢাকা ট্রিবিউন",
      sourceTag: "Global FAO Benchmark Report",
      date: "June 2024",
      volume: "Vol. 18 • No. 165",
      headline: "FAO Benchmark: Bangladesh Ranks in Global Top 10 for 22 Agricultural Products; #1 in Hilsa, #2 in Jute",
      headlineBn: "এফএও বিশ্ব প্রতিবেদন: ২২টি কৃষিপণ্যে শীর্ষ ১০-এ বাংলাদেশ; ইলিশে ১ম ও পাটে বিশ্বে ২য়",
      subheading: "Remarkable deltaic agro-biodiversity positions Bangladesh as an agro-powerhouse in fish, potato & jackfruit.",
      subheadingBn: "বিশ্বের মোট ইলিশের ৬৫% ও সোনালী আঁশ পাটের আন্তর্জাতিক বাজারে বাংলাদেশের একচ্ছত্র আধিপত্য।",
      statement: "United Nations Food and Agriculture Organization statistics confirm that Bangladesh holds world-leading ranks across freshwater fisheries, jute fibre, tropical vegetables, and seed potato harvests.",
      statementBn: "জাতিসংঘের খাদ্য ও কৃষি সংস্থা (FAO)-এর তথ্যমতে, ইলিশ, পাট, কাঁঠাল, আলু ও গ্রীষ্মকালীন শাকসবজি উৎপাদনে বিশ্বে অন্যতম শীর্ষস্থানে অবস্থান করছে বাংলাদেশ।",
      fullEditorial: "The world's largest riverine delta delivers unmatched silt fertility. In freshwater aquaculture, Bangladesh stands 5th globally. In potato production, the country harvests 11 million MT annually (ranking 7th globally), exporting premium granola varieties to Southeast Asia. Jute, the golden fiber, has witnessed a high-tech resurgence through biodegradable polymer innovations and geo-textiles.",
      fullEditorialBn: "পলিমাটিসমৃদ্ধ নদীমাতৃক ভূমির কারণে বাংলাদেশের ফসল উৎপাদন ক্ষমতা অসাধারণ। মিঠা পানির মাছ উৎপাদনে ৫ম, আলু উৎপাদনে ৭ম এবং কাঁঠাল উৎপাদনে বিশ্বের শীর্ষ দেশগুলোর অন্যতম বাংলাদেশ। পরিবেশবান্ধব সোনালী আঁশ পাটের জিওটেক্সটাইল ও বায়োপ্লাস্টিক উদ্ভাবন আন্তর্জাতিক বাজারে বাংলাদেশের সুনাম বৃদ্ধি করেছে।",
      impactMetric: "Top 10 in 22",
      impactLabel: "Agricultural Commodities",
      impactLabelBn: "কৃষিপণ্যে বিশ্বসেরা ১০",
      badge: "World Leader in Hilsa",
      reporter: "Farhana Yasmin, UN Affairs",
      reporterBn: "ফারহানা ইয়াসমিন, আন্তর্জাতিক ডেস্ক",
      location: "FAO Regional Bureau",
      locationBn: "এফএও আঞ্চলিক কেন্দ্র"
    },
    {
      id: 5,
      category: "CLIMATE",
      categoryLabelEn: "Climate Resilience",
      categoryLabelBn: "জলবায়ু সহনশীলতা",
      source: "BSS (Bangladesh Sangbad Sangstha)",
      sourceBn: "বাংলাদেশ সংবাদ সংস্থা (বাসস)",
      sourceTag: "Government Bulletin",
      date: "August 2024",
      volume: "Govt Dispatch #194",
      headline: "Floating Hydroponic Baira and Solar Irrigation Drive Sustainable Farming in Coastal Saline Belts",
      headlineBn: "উপকূলীয় অঞ্চলে ভাসমান ধাপ চাষ (বাইরা) ও সৌর সেচে বিপ্লব: লবণাক্ত জমিতেও সোনালী ফসল",
      subheading: "UNESCO-recognized indigenous floating agriculture pairs with saline-tolerant rice varieties.",
      subheadingBn: "ইউনেস্কো স্বীকৃত ঐতিহ্যবাহী ভাসমান শাকসবজি চাষ ও লবণসহনশীল ব্রি ধান-৬৭ উপকূলকে শস্যভাণ্ডারে রূপান্তর করছে।",
      statement: "The Ministry of Agriculture has allocated new climate adaptation incentives across Barishal, Khulna, and Satkhira to expand hydroponic bio-farms and solar deep-tube-well micro-grids.",
      statementBn: "কৃষি মন্ত্রণালয় দক্ষিণাঞ্চলের বরিশাল, খুলনা ও সাতক্ষীরায় লবণাক্ততা সহনশীল জাত সম্প্রসারণ এবং কৃষক পর্যায়ে সৌর সেচ নেটওয়ার্ক স্থাপনে বিশেষ প্রণোদনা ঘোষণা করেছে।",
      fullEditorial: "In southern coastal wetlands prone to tidal surges and salinity, Bangladeshi farmers have scaled indigenous floating bamboo-water-hyacinth rafts ('Baira'). During monsoon inundation, high-yield gourds, red amaranth, and tomatoes thrive without soil or chemical pesticides. Complementing this, saline-tolerant rice strains (BRRI dhan-47, 67, 97) yield rich harvests where conventional seeds previously failed.",
      fullEditorialBn: "দক্ষিণাঞ্চলের লবণাক্ততা কবলিত নিম্নাঞ্চলে কচুরিপানা দিয়ে তৈরি ঐতিহ্যবাহী 'ধাপ' বা ভাসমান বেডে বিষমুক্ত সবজি আবাদ আজ বিশ্বজুড়ে প্রশংসিত। পাশাপাশি লবণাক্ততা সহনশীল ব্রি ধান-৪৭ ও ৬৭ জাত উদ্ভাবনের ফলে উপকূলের হাজার হাজার হেক্টর অনাবাদি জমি সোনালী ফসলে ভরে উঠছে।",
      impactMetric: "16.5M",
      impactLabel: "Farmer Climate Network",
      impactLabelBn: "জলবায়ু সহনশীল কৃষক",
      badge: "UNESCO Heritage Agro-System",
      reporter: "Mahfuzur Rahman, BSS Senior Correspondent",
      reporterBn: "মাহফুজুর রহমান, বাসস জ্যেষ্ঠ সংবাদদাতা",
      location: "Barishal Hydro-Agri Hub",
      locationBn: "বরিশাল ভাসমান কৃষি অঞ্চল"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [expandedStory, setExpandedStory] = useState<NewsStory | null>(null);
  const [typewriterText, setTypewriterText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "MILESTONES" | "TECH" | "POLICY" | "CLIMATE">("ALL");
  const [audioVolume, setAudioVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [tellerState, setTellerState] = useState<"IDLE" | "SPEAKING" | "PAUSED">("IDLE");

  const currentStory = stories[currentIndex];
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect for current story headline & statement
  useEffect(() => {
    const fullText = isBn 
      ? `[${currentStory.sourceBn}] ${currentStory.headlineBn}`
      : `[${currentStory.source}] ${currentStory.headline}`;
    
    let charIndex = 0;
    setTypewriterText("");
    
    if (typewriterRef.current) clearInterval(typewriterRef.current);

    typewriterRef.current = setInterval(() => {
      if (charIndex <= fullText.length) {
        setTypewriterText(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        if (typewriterRef.current) clearInterval(typewriterRef.current);
      }
    }, 22);

    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, [currentIndex, isBn, currentStory]);

  // Speech Synthesis for Live News Teller Narration
  const speakCurrentNews = () => {
    if (!("speechSynthesis" in window)) {
      alert(isBn ? "আপনার ব্রাউজারে ভয়েস সিন্থেসিস সমর্থিত নয়।" : "Speech synthesis is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const headlineText = isBn ? currentStory.headlineBn : currentStory.headline;
    const bodyText = isBn ? currentStory.statementBn : currentStory.statement;
    const sourceText = isBn ? currentStory.sourceBn : currentStory.source;
    
    const narrationText = isBn 
      ? `বাংলাদেশ কৃষি সংবাদের বিশেষ বুলেটিন। ${sourceText} থেকে প্রাপ্ত প্রতিবেদন: ${headlineText}। বিস্তারিত: ${bodyText}`
      : `Special Bangladesh Agricultural News Bulletin from ${sourceText}. Headline: ${headlineText}. Details: ${bodyText}`;

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = speechRate;
    utterance.volume = isMuted ? 0 : audioVolume;

    // Detect Bengali voice if available
    const voices = window.speechSynthesis.getVoices();
    if (isBn) {
      const bnVoice = voices.find(v => v.lang.includes("bn") || v.name.toLowerCase().includes("bengali") || v.name.toLowerCase().includes("bangla"));
      if (bnVoice) utterance.voice = bnVoice;
      utterance.lang = "bn-BD";
    } else {
      const enVoice = voices.find(v => v.lang.includes("en-US") || v.lang.includes("en-GB") || v.name.includes("Google") || v.name.includes("Natural"));
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = "en-US";
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setTellerState("SPEAKING");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setTellerState("IDLE");
      if (isPlaying) {
        // Proceed to next story automatically in autoplay mode
        setTimeout(() => {
          handleNextStory();
        }, 1200);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setTellerState("IDLE");
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setTellerState("IDLE");
  };

  // Auto-play newspaper rotation
  useEffect(() => {
    if (isPlaying && !isSpeaking) {
      autoPlayRef.current = setInterval(() => {
        handleNextStory();
      }, 7000);
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPlaying, isSpeaking, currentIndex]);

  const handleNextStory = () => {
    stopSpeaking();
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrevStory = () => {
    stopSpeaking();
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const toggleSpeechNarration = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakCurrentNews();
    }
  };

  const toggleAutoPlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeaking();
    } else {
      setIsPlaying(true);
      speakCurrentNews();
    }
  };

  // Filtered stories list
  const filteredStories = selectedCategory === "ALL" 
    ? stories 
    : stories.filter(s => s.category === selectedCategory);

  return (
    <div id="animated-agri-newspaper" className="space-y-6 animate-fadeIn">
      
      {/* =========================================================================
          📰 ANIMATED BROADCAST TELLER & VINTAGE NEWSPAPER FRONT-PAGE WRAPPER
          ========================================================================= */}
      <div className="bg-[#FAF7F0] text-[#1E251E] rounded-3xl border-4 border-[#2D4F1E]/30 shadow-2xl overflow-hidden relative font-serif">
        
        {/* Top Paper Header Bar with Weather, Volume, and Issue Date */}
        <div className="bg-[#2D4F1E] text-white px-4 py-2 border-b-2 border-[#1E251E] flex flex-wrap items-center justify-between gap-3 text-[11px] font-sans">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 bg-red-600 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px] animate-pulse">
              <Radio className="w-3 h-3 animate-spin" />
              {isBn ? "লাইভ সংবাদ টেলর" : "LIVE NEWS TELLER"}
            </span>
            <span className="font-mono text-emerald-200">
              {currentStory.volume} • {isBn ? "সংস্করণ: ঢাকা" : "Dhaka Edition"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-100 font-medium">
            <span>🌧️ {isBn ? "মৌসুম: আমন বর্ষা" : "Season: Aman Monsoon"}</span>
            <span>🌡️ {isBn ? "তাপমাত্রা: ৩২° সে." : "Temp: 32°C"}</span>
            <span>🌾 {isBn ? "ধান সূচক: ঊর্ধ্বমুখী" : "Paddy Index: Strong"}</span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentStory.date}</span>
          </div>
        </div>

        {/* =========================================================================
            📰 AUTHENTIC NEWSPAPER MASTHEAD (SMART KRISHI PATRIKA)
            ========================================================================= */}
        <div className="px-6 sm:px-10 pt-6 pb-4 border-b-2 border-[#1E251E]/20 text-center relative bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:16px_16px]">
          
          {/* Left & Right Ear Panels */}
          <div className="hidden lg:flex items-center justify-between absolute inset-x-8 top-6 pointer-events-none">
            <div className="w-36 text-left border border-[#1E251E]/30 p-2 bg-[#F4EFE6] rounded-xl text-[10px] font-sans shadow-sm">
              <strong className="block text-[#2D4F1E] font-black uppercase border-b border-[#1E251E]/20 pb-0.5 mb-1">
                {isBn ? "🌾 উৎপাদন রিপোর্ট" : "🌾 Crop Monitor"}
              </strong>
              <p className="text-gray-700 leading-tight">
                {isBn ? "খাদ্যশস্যে রেকর্ড ৪০.২ মিলিয়ন টন অর্জন।" : "Record 40.2M MT Foodgrain harvested."}
              </p>
            </div>

            <div className="w-36 text-right border border-[#1E251E]/30 p-2 bg-[#F4EFE6] rounded-xl text-[10px] font-sans shadow-sm">
              <strong className="block text-[#2D4F1E] font-black uppercase border-b border-[#1E251E]/20 pb-0.5 mb-1">
                {isBn ? "🤖 এআই ডায়াগনস্টিক" : "🤖 AI Krishi"}
              </strong>
              <p className="text-gray-700 leading-tight">
                {isBn ? "১.৪ সেকেন্ডে পাতার রোগবালাই নির্ণয়।" : "1.4s leaf pathology diagnosis active."}
              </p>
            </div>
          </div>

          {/* Central Newspaper Logo */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-[#2D4F1E] text-xs font-black tracking-widest uppercase font-sans">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{isBn ? "বাংলাদেশ জাতীয় কৃষি ও খাদ্যনিরাপত্তা বুলেটিন" : "The National Agrarian & Food Security Chronicle"}</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1E251E] tracking-tight font-serif uppercase border-y-2 border-[#1E251E] py-2 my-2 select-none shadow-sm">
              {isBn ? "দৈনিক স্মার্ট কৃষি বার্তা" : "THE AGRI CHRONICLE"}
            </h1>

            <p className="text-xs sm:text-sm font-sans font-bold text-gray-700 max-w-2xl mx-auto italic">
              {isBn
                ? "“বাংলাদেশের ১ কোটি ৬৫ লাখ কৃষকের উদ্ভাবন, খাদ্যে স্বয়ংসম্পূর্ণতা ও ডিজিটাল বাজার ব্যবস্থার সত্যনিষ্ঠ দর্পণ”"
                : "“The Resilient Voice of 16.5M Smallholder Agrarians, Food Sovereignty & Digital Market Exchange”"}
            </p>
          </div>

          {/* Sub-masthead decorative rule */}
          <div className="flex items-center justify-center gap-4 text-[10px] font-sans font-bold text-gray-600 uppercase tracking-widest pt-2">
            <span>{isBn ? "মূল্য: ডিজিটাল সংস্করণ (বিনামূল্যে)" : "Price: Digital Open Access"}</span>
            <span>•</span>
            <span>{isBn ? "স্বীকৃতি: কৃষি মন্ত্রণালয় ও ডিএই" : "Verified by Ministry of Agriculture & DAE"}</span>
            <span>•</span>
            <span>{isBn ? "রেজিস্ট্রেশন নং: BD-AGRI-2026" : "Reg No: BD-AGRI-2026"}</span>
          </div>
        </div>

        {/* =========================================================================
            🎙️ ANIMATED VIRTUAL AI NEWS TELLER / AUDIO BROADCAST CONSOLE
            ========================================================================= */}
        <div className="bg-[#1A2E19] text-white p-4 sm:p-5 border-b-4 border-[#2D4F1E] flex flex-col lg:flex-row items-center justify-between gap-4 font-sans relative overflow-hidden">
          
          {/* Animated Background Audio Waves */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-[#1A2E19] to-emerald-900/80 pointer-events-none" />

          {/* News Teller Avatar & Audio Status */}
          <div className="flex items-center gap-4 relative z-10 w-full lg:w-auto">
            {/* Animated Avatar Box */}
            <div className="relative shrink-0">
              <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl shadow-xl transition-all ${
                isSpeaking 
                  ? "bg-gradient-to-br from-amber-500 to-[#F97316] border-white scale-105 ring-4 ring-amber-400/40" 
                  : "bg-emerald-800 border-emerald-500/50"
              }`}>
                {isSpeaking ? "🎙️" : "👨‍💼"}
              </div>

              {isSpeaking && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border border-white text-[8px] text-white font-bold items-center justify-center">ON</span>
                </span>
              )}
            </div>

            {/* Teller Info & Dynamic Waveform */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-black font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {isBn ? "এআই সংবাদ পাঠক" : "AI NEWS TELLER"}
                </span>
                <span className="text-xs font-bold text-emerald-200">
                  {isSpeaking 
                    ? (isBn ? "🔴 পাঠ করছেন: " : "🔴 Narrating: ") + (isBn ? currentStory.sourceBn : currentStory.source)
                    : (isBn ? "⚪ প্রস্তুত (শুনতে প্লে বাটন চাপুন)" : "⚪ Ready to Broadcast")}
                </span>
              </div>

              {/* Real-time Animated Audio Wave Bars */}
              <div className="flex items-center gap-1 h-5 pt-0.5">
                {[4, 8, 14, 6, 12, 18, 10, 16, 7, 13, 9, 15, 6, 11, 17, 8, 5, 12, 16, 7].map((height, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isSpeaking
                        ? "bg-amber-400 animate-pulse"
                        : "bg-emerald-600/40"
                    }`}
                    style={{
                      height: isSpeaking ? `${Math.max(4, (height * (1 + (i % 3) * 0.3)))}px` : "4px",
                      animationDuration: `${0.3 + (i % 4) * 0.15}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Typewriter Teletype Flash */}
          <div className="relative z-10 w-full lg:max-w-md bg-black/40 border border-emerald-500/30 rounded-2xl px-3.5 py-2 font-mono text-xs text-emerald-300 truncate">
            <span className="text-amber-400 font-bold mr-1.5 animate-pulse">▶ [TELETYPE]:</span>
            <span className="font-medium text-white">{typewriterText || "Broadcasting Bangladesh Agri News..."}</span>
          </div>

          {/* Interactive Voice Controls */}
          <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0 w-full lg:w-auto justify-end">
            
            {/* Listen / Pause Voice Narration Button */}
            <button
              id="voice-narrator-toggle-btn"
              onClick={toggleSpeechNarration}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all shadow-md border ${
                isSpeaking 
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-400 animate-pulse" 
                  : "bg-amber-500 hover:bg-amber-400 text-black border-amber-300"
              }`}
              title={isSpeaking ? "Pause Narration" : "Listen to News Reader"}
            >
              {isSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeaking ? (isBn ? "থামুন" : "Pause") : (isBn ? "🔊 সংবাদ শুনুন" : "🔊 Listen News")}</span>
            </button>

            {/* Auto Play / Story Tour Carousel */}
            <button
              id="autoplay-news-carousel-btn"
              onClick={toggleAutoPlay}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-all border ${
                isPlaying 
                  ? "bg-emerald-600 text-white border-emerald-400" 
                  : "bg-white/10 hover:bg-white/20 text-white border-white/20"
              }`}
              title="Continuous News Broadcast Mode"
            >
              <Radio className={`w-3.5 h-3.5 ${isPlaying ? "text-amber-400 animate-spin" : "text-gray-300"}`} />
              <span>{isPlaying ? (isBn ? "অটোপ্লে চালু" : "Auto Broadcast ON") : (isBn ? "অটোপ্লে" : "Auto Tour")}</span>
            </button>

            {/* Speed Selector (1x, 1.25x) */}
            <button
              onClick={() => {
                const nextRate = speechRate === 1.0 ? 1.25 : speechRate === 1.25 ? 0.9 : 1.0;
                setSpeechRate(nextRate);
                if (isSpeaking) {
                  stopSpeaking();
                  setTimeout(() => speakCurrentNews(), 200);
                }
              }}
              className="px-2.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[11px] font-mono font-bold border border-white/15 cursor-pointer transition-all"
              title="Speech Speed"
            >
              {speechRate}x
            </button>

            {/* Prev Story */}
            <button
              onClick={handlePrevStory}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 cursor-pointer transition-all"
              title="Previous News Item"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Story */}
            <button
              onClick={handleNextStory}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 cursor-pointer transition-all"
              title="Next News Item"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            📑 NEWSPAPER BODY: 3-COLUMN EDITORIAL & HERO STORY LAYOUT
            ========================================================================= */}
        <div className="p-6 sm:p-10 space-y-8 bg-[#FAF7F0]">
          
          {/* TOP STORY BANNER (LEAD EDITORIAL) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b-2 border-[#1E251E]/20 pb-8">
            
            {/* MAIN HEADLINE & LEAD REPORT (8 COLS) */}
            <div className="lg:col-span-8 space-y-4 pr-0 lg:pr-6 border-r-0 lg:border-r-2 border-[#1E251E]/20">
              
              {/* Category & Verified Source Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#2D4F1E] text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider font-sans">
                    {isBn ? currentStory.categoryLabelBn : currentStory.categoryLabelEn}
                  </span>
                  <span className="text-[#1E251E] font-bold text-xs bg-[#EFE9DC] px-2.5 py-1 rounded-lg border border-[#1E251E]/20 font-sans flex items-center gap-1">
                    <Newspaper className="w-3.5 h-3.5 text-[#2D4F1E]" />
                    <span>{isBn ? currentStory.sourceBn : currentStory.source}</span>
                  </span>
                </div>

                <div className="text-[11px] font-sans text-gray-600 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>{currentStory.badge}</span>
                </div>
              </div>

              {/* Primary Massive Newspaper Headline */}
              <h2 className="text-2xl sm:text-4xl lg:text-4xl font-black text-[#1E251E] leading-tight font-serif tracking-tight">
                “{isBn ? currentStory.headlineBn : currentStory.headline}”
              </h2>

              {/* Subheading in Italics */}
              <p className="text-base sm:text-lg font-bold text-gray-700 font-serif italic leading-snug border-l-4 border-[#2D4F1E] pl-4">
                {isBn ? currentStory.subheadingBn : currentStory.subheading}
              </p>

              {/* Lead Paragraph with drop cap */}
              <div className="text-sm sm:text-base text-gray-800 leading-relaxed font-serif space-y-3 pt-2">
                <p className="first-letter:text-4xl first-letter:font-black first-letter:text-[#2D4F1E] first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                  {isBn ? currentStory.statementBn : currentStory.statement}
                </p>

                <p className="text-sm text-gray-700 leading-relaxed pt-1">
                  {isBn ? currentStory.fullEditorialBn : currentStory.fullEditorial}
                </p>
              </div>

              {/* Journalist Byline & Location */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1E251E]/20 text-xs font-sans text-gray-600">
                <div>
                  <span className="font-bold text-[#1E251E]">{isBn ? "প্রতিবেদক: " : "By: "}</span>
                  <span>{isBn ? currentStory.reporterBn : currentStory.reporter}</span>
                  <span className="mx-2">•</span>
                  <span className="italic">{isBn ? currentStory.locationBn : currentStory.location}</span>
                </div>

                {/* Read Full Column Modal Trigger */}
                <button
                  onClick={() => setExpandedStory(currentStory)}
                  className="flex items-center gap-1 font-black text-[#2D4F1E] hover:text-emerald-700 underline cursor-pointer"
                >
                  <span>{isBn ? "সম্পূর্ণ কলাম ও পরিসংখ্যান দেখুন" : "Read Full Editorial Column"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* SIDE COLUMN: INFOGRAPHIC & SECTOR METRIC (4 COLS) */}
            <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
              
              {/* Highlight Metric Stamp */}
              <div className="bg-[#EFE9DC] p-6 rounded-2xl border-2 border-[#1E251E]/20 text-center space-y-2 shadow-inner">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 font-sans block">
                  {isBn ? "📊 প্রধান খাতভিত্তিক অর্জন" : "📊 Primary Sector Metric"}
                </span>
                <strong className="text-4xl sm:text-5xl font-black text-[#2D4F1E] font-mono block">
                  {currentStory.impactMetric}
                </strong>
                <p className="text-xs font-bold text-[#1E251E] font-sans">
                  {isBn ? currentStory.impactLabelBn : currentStory.impactLabel}
                </p>
                <div className="text-[10px] text-gray-600 pt-1 font-sans border-t border-[#1E251E]/10">
                  {isBn ? "সূত্র: ডিএই ও বাংলাদেশ পরিসংখ্যান ব্যুরো (BBS)" : "Source: DAE & Bangladesh Bureau of Statistics"}
                </div>
              </div>

              {/* Featured Quote Box */}
              <div className="bg-white p-5 rounded-2xl border-2 border-[#1E251E]/15 shadow-sm space-y-2 font-serif relative">
                <Quote className="w-6 h-6 text-[#2D4F1E]/20 absolute top-3 right-3" />
                <p className="text-xs sm:text-sm italic text-gray-800 leading-relaxed">
                  {isBn
                    ? "“কৃষকের হাতে আধুনিক ডিজিটাল সংযোগ ও ন্যায়সঙ্গত শস্যমূল্যই বাংলাদেশের অর্থনৈতিক স্বাবলম্বিতার মূল শক্তি।”"
                    : "“Equipping smallholder farmers with AI precision diagnostics and direct market access is the bedrock of sovereign prosperity.”"}
                </p>
                <span className="block text-[11px] font-sans font-bold text-[#2D4F1E]">
                  — {isBn ? "জাতীয় কৃষি গবেষণা কাউন্সিল" : "National Agricultural Research Council"}
                </span>
              </div>

              {/* Quick Persona Action */}
              <div className="bg-[#2D4F1E]/10 p-4 rounded-2xl border border-[#2D4F1E]/30 space-y-2 font-sans">
                <strong className="text-xs font-black text-[#2D4F1E] block">
                  {isBn ? "⚡ স্মার্টফার্মার ওএস পোর্টাল এক্সেস" : "⚡ SmartFarmer OS Fast Portal"}
                </strong>
                <p className="text-[11px] text-gray-700 leading-tight">
                  {isBn 
                    ? "কৃষক, ক্রেতা ও কর্মকর্তাদের জন্য ৪-ভূমিকা সমৃদ্ধ ড্যাশবোর্ডে লগইন করুন:"
                    : "Enter the multi-role agricultural command center with live escrow and diagnostics:"}
                </p>
                {onOpenRoleModal && (
                  <button
                    onClick={() => onOpenRoleModal()}
                    className="w-full py-2 bg-[#2D4F1E] hover:bg-[#1E3614] text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow text-center"
                  >
                    🔑 {isBn ? "৪-ভূমিকা লগইন পোর্টাল খুলুন" : "Open 4-Role Login Terminal"}
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* =========================================================================
              🗞️ BOTTOM STRIP: OTHER RECENT DISPATCHES & HEADLINE ARCHIVE
              ========================================================================= */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#1E251E]/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📰</span>
                <h3 className="text-lg font-black text-[#1E251E] font-serif uppercase">
                  {isBn ? "অন্যান্য শীর্ষ কৃষি সংবাদ ও কলাম" : "Other Top Agricultural Dispatches"}
                </h3>
              </div>

              {/* Story selector pills */}
              <div className="flex flex-wrap items-center gap-1 font-sans text-xs">
                {stories.map((story, idx) => (
                  <button
                    key={story.id}
                    onClick={() => {
                      stopSpeaking();
                      setCurrentIndex(idx);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all border ${
                      currentIndex === idx
                        ? "bg-[#2D4F1E] text-white border-[#2D4F1E] shadow-sm"
                        : "bg-white text-gray-700 hover:bg-[#EFE9DC] border-[#1E251E]/20"
                    }`}
                  >
                    {idx + 1}. {isBn ? story.sourceBn : story.source}
                  </button>
                ))}
              </div>
            </div>

            {/* 3-Column Mini Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
              {stories.slice(0, 3).map((s, i) => (
                <div
                  key={s.id}
                  onClick={() => {
                    stopSpeaking();
                    setCurrentIndex(i);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    currentIndex === i
                      ? "bg-white border-[#2D4F1E] ring-2 ring-[#2D4F1E]/30 shadow-md"
                      : "bg-[#F5EFE4] hover:bg-white border-[#1E251E]/15"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-gray-600 font-bold">
                      <span className="text-[#2D4F1E] font-black">{isBn ? s.sourceBn : s.source}</span>
                      <span>{s.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#1E251E] font-serif line-clamp-2 leading-snug">
                      "{isBn ? s.headlineBn : s.headline}"
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#1E251E]/10">
                    <span className="font-mono font-bold text-[#2D4F1E]">{s.impactMetric}</span>
                    <span className="text-gray-500 font-semibold">{isBn ? "বিস্তারিত পড়ুন →" : "Read →"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Paper Footer Bar */}
        <div className="bg-[#EFE9DC] px-6 py-3 border-t-2 border-[#1E251E]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-sans text-gray-700 font-medium">
          <div>
            <span>© 2026 SmartFarmer Bangladesh • Press Wire & Agronomy Ledger</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{isBn ? "প্রিন্ট ও ডিজিটাল সংস্করণ" : "Print & Digital Edition"}</span>
            <span>•</span>
            <span>{isBn ? "এআই ভয়েস সিন্থেসিস" : "AI Voice Synthesizer Active"}</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          📖 FULL EDITORIAL COLUMN EXPANDABLE MODAL
          ========================================================================= */}
      {expandedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF7F0] text-[#1E251E] w-full max-w-3xl rounded-3xl border-4 border-[#2D4F1E] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto font-serif relative">
            
            <button
              onClick={() => setExpandedStory(null)}
              className="absolute top-4 right-4 p-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full cursor-pointer transition-all font-sans font-black text-sm"
              title="Close"
            >
              ✕
            </button>

            <div className="space-y-2 border-b-2 border-[#1E251E]/20 pb-4">
              <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#2D4F1E]">
                <span>{isBn ? expandedStory.sourceBn : expandedStory.source}</span>
                <span>•</span>
                <span>{expandedStory.date}</span>
                <span>•</span>
                <span className="bg-[#2D4F1E] text-white px-2 py-0.5 rounded-full text-[10px]">
                  {isBn ? expandedStory.categoryLabelBn : expandedStory.categoryLabelEn}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#1E251E] leading-snug">
                “{isBn ? expandedStory.headlineBn : expandedStory.headline}”
              </h2>
            </div>

            <div className="text-sm sm:text-base text-gray-800 leading-relaxed space-y-4">
              <p className="font-bold italic border-l-4 border-[#2D4F1E] pl-3 text-[#1E251E]">
                {isBn ? expandedStory.subheadingBn : expandedStory.subheading}
              </p>

              <p>{isBn ? expandedStory.statementBn : expandedStory.statement}</p>
              
              <p>{isBn ? expandedStory.fullEditorialBn : expandedStory.fullEditorial}</p>
            </div>

            <div className="bg-[#EFE9DC] p-4 rounded-2xl border border-[#1E251E]/20 flex items-center justify-between font-sans">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-600 block">
                  {isBn ? "প্রভাব ও পরিমাপ:" : "Sector Impact Metric:"}
                </span>
                <strong className="text-xl font-black text-[#2D4F1E]">{expandedStory.impactMetric}</strong>
                <span className="text-xs text-gray-700 ml-2">
                  ({isBn ? expandedStory.impactLabelBn : expandedStory.impactLabel})
                </span>
              </div>

              <button
                onClick={() => {
                  setExpandedStory(null);
                  speakCurrentNews();
                }}
                className="px-4 py-2 bg-[#2D4F1E] hover:bg-[#1E3614] text-white text-xs font-black rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isBn ? "সংবাদটি শুনুন" : "Listen Narration"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
