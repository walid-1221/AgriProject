import React, { useState } from "react";
import { 
  X, 
  Sprout, 
  Building2, 
  Microscope, 
  Package, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  CloudRain,
  KeyRound,
  Zap,
  Phone,
  AlertCircle
} from "lucide-react";
import { User, LanguageMode } from "../types";
import farmerSowingRainImg from "../assets/images/farmer_sowing_rain_1786221231480.jpg";

export interface UnifiedLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  users: User[];
  lang: LanguageMode;
  defaultRole?: "PRODUCER" | "BUYER" | "OFFICER" | "AGENT";
}

type RoleType = "PRODUCER" | "BUYER" | "OFFICER" | "AGENT";

interface PersonaConfig {
  roleType: RoleType;
  titleEn: string;
  titleBn: string;
  subEn: string;
  subBn: string;
  icon: React.ReactNode;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  userId: number;
  name: string;
  district: string;
  phone: string;
  pin: string;
  dutiesEn: string[];
  dutiesBn: string[];
}

export const UnifiedLoginModal: React.FC<UnifiedLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  users,
  lang,
  defaultRole = "PRODUCER"
}) => {
  const [selectedRole, setSelectedRole] = useState<RoleType>(defaultRole);
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const isBn = lang === "BN";

  const personas: Record<RoleType, PersonaConfig> = {
    PRODUCER: {
      roleType: "PRODUCER",
      titleEn: "Producer (Farmer)",
      titleBn: "উৎপাদক / কৃষক",
      subEn: "Crop Producer & Harvest Owner",
      subBn: "শস্য উৎপাদক ও খামার মালিক",
      icon: <Sprout className="w-5 h-5" />,
      accentColor: "#2D4F1E",
      badgeBg: "bg-emerald-500/20 text-emerald-300",
      badgeBorder: "border-emerald-500/40",
      userId: 101,
      name: "Abul Hasan Miah",
      district: "Kaliakair, Gazipur",
      phone: "+880 1712-345678",
      pin: "1234",
      dutiesEn: [
        "Upload crop harvest batches & get instant barcode",
        "AI leaf pathology diagnostic scan with disease cure",
        "Receive direct escrow payouts upon buyer delivery"
      ],
      dutiesBn: [
        "নতুন ফসলের বিবরণ যোগ ও ডিজিটাল কিউআর কোড তৈরি",
        "এআই পাতার রোগ নির্ণয় ও তাৎক্ষণিক প্রেসক্রিপশন গ্রহণ",
        "ক্রেতার ডেলিভারি গ্রহণের পর সরাসরি এস্ক্রো পেমেন্ট লাভ"
      ]
    },
    BUYER: {
      roleType: "BUYER",
      titleEn: "Enterprise Buyer",
      titleBn: "ক্রেতা / ব্যবসায়ী",
      subEn: "Superstore & Wholesale Trader",
      subBn: "সুপারশপ ও পাইকারি বাণিজ্যিক ক্রেতা",
      icon: <Building2 className="w-5 h-5" />,
      accentColor: "#F97316",
      badgeBg: "bg-amber-500/20 text-amber-300",
      badgeBorder: "border-amber-500/40",
      userId: 201,
      name: "Sabbir Ahmed (Agora Superstores)",
      district: "Gulshan, Dhaka",
      phone: "+880 1911-223344",
      pin: "2345",
      dutiesEn: [
        "Deposit escrow funds into sovereign smart contract",
        "Reserve verified harvest lots with quality guarantees",
        "Release milestone payments upon physical gate check"
      ],
      dutiesBn: [
        "স্মার্ট কন্ট্রাক্টে নিরাপদ এস্ক্রো আমানত জমা রাখা",
        "মানসম্পন্ন ফসলের লট অগ্রিম বুকিং ও বায়না প্রদান",
        "পণ্য বুঝে পাওয়ার পর সরাসরি ফান্ড রিলিজ অনুমোদন"
      ]
    },
    OFFICER: {
      roleType: "OFFICER",
      titleEn: "Agri Officer / Doctor",
      titleBn: "কৃষি কর্মকর্তা / চিকিৎসক",
      subEn: "Plant Pathologist & Quality Inspector",
      subBn: "উদ্ভিদ রোগতত্ত্ববিদ ও কৃষি সম্প্রসারণ বিশেষজ্ঞ",
      icon: <Microscope className="w-5 h-5" />,
      accentColor: "#0EA5E9",
      badgeBg: "bg-sky-500/20 text-sky-300",
      badgeBorder: "border-sky-500/40",
      userId: 301,
      name: "Dr. Rafiqul Rahman (DAE Specialist)",
      district: "Kaliakair, Gazipur",
      phone: "+880 1755-667788",
      pin: "3456",
      dutiesEn: [
        "Certify crop grading (Grade A/B/Export Standard)",
        "Diagnose plant ailments & issue formal prescriptions",
        "Approve bio-safety tickets & lab quality seals"
      ],
      dutiesBn: [
        "ফসলের মান গ্রেডিং (গ্রেড-এ, রপ্তানিযোগ্য মান) সনদ প্রদান",
        "কৃষকের আপলোড করা রোগের ক্লিনিকাল প্রেসক্রিপশন প্রদান",
        "বায়ো-সিকিউরিটি ও মান নিয়ন্ত্রণ সনদ অনুমোদন"
      ]
    },
    AGENT: {
      roleType: "AGENT",
      titleEn: "District Agent",
      titleBn: "জেলা লজিস্টিক এজেন্ট",
      subEn: "Supply Chain & Hub Coordinator",
      subBn: "সাপ্লাই চেইন ও জেলা পরিবহন সমন্বয়ক",
      icon: <Package className="w-5 h-5" />,
      accentColor: "#A855F7",
      badgeBg: "bg-purple-500/20 text-purple-300",
      badgeBorder: "border-purple-500/40",
      userId: 401,
      name: "Agent Khorshed Alam",
      district: "Bogura District Hub",
      phone: "+880 1999-888777",
      pin: "4567",
      dutiesEn: [
        "Organize pooled cold storage & freight trucks",
        "Verify physical delivery milestones at district gates",
        "Onboard local rural farmers into exchange registry"
      ],
      dutiesBn: [
        "যৌথ পরিবহন ও কোল্ড স্টোরেজ লজিস্টিক পরিচালনা",
        "জেলা গেটে পণ্যের ওজন ও গুণমান নিশ্চিতকরণ",
        "নতুন কৃষক নিবন্ধন ও মার্কেটপ্লেসে যুক্তকরণ"
      ]
    }
  };

  const currentPersona = personas[selectedRole];

  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    setPin("");
    setErrorMsg("");
  };

  const executeLogin = (enteredPin: string) => {
    const expectedPin = currentPersona.pin;

    if (enteredPin === expectedPin) {
      setIsLoading(true);
      setErrorMsg("");

      setTimeout(() => {
        // Find user from database or construct from persona
        const matched = users.find(u => u.user_id === currentPersona.userId) || {
          user_id: currentPersona.userId,
          name: currentPersona.name,
          role: selectedRole === "PRODUCER" ? "FARMER" : selectedRole === "BUYER" ? "BUYER" : selectedRole === "OFFICER" ? "DOCTOR" : "AGENT",
          phone_number: currentPersona.phone,
          upazila_district: currentPersona.district,
          joined_date: "2024-01-10T10:00:00Z"
        } as User;

        setIsLoading(false);
        onLoginSuccess(matched);
        onClose();
      }, 300);
    } else {
      setErrorMsg(isBn ? "ভুল পিন কোড! অনুগ্রহ করে আবার চেষ্টা করুন।" : `Invalid PIN. Use default PIN ${expectedPin}`);
    }
  };

  const handleDirectOneClickLogin = () => {
    executeLogin(currentPersona.pin);
  };

  const handleKeypad = (num: string) => {
    setErrorMsg("");
    if (num === "CLEAR") {
      setPin("");
    } else if (num === "BACK") {
      setPin(prev => prev.slice(0, -1));
    } else {
      if (pin.length < 4) {
        const next = pin + num;
        setPin(next);
        if (next.length === 4) {
          executeLogin(next);
        }
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-white/15 text-white font-sans my-auto transition-all"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(12, 22, 12, 0.88), rgba(8, 16, 8, 0.94)), url(${farmerSowingRainImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* TOP MODAL HEADER BAR */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between relative z-10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-[#F97316] rounded-2xl text-white shadow-md">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {isBn ? "স্মার্টফার্মার ওএস • কেন্দ্রীভূত প্রবেশদ্বার" : "SmartFarmer OS • Unified Access Terminal"}
                </h2>
                <span className="text-[9px] bg-white/10 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-white/10">
                  4 ROLES
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 font-medium">
                {isBn ? "একক ইন্টারফেসে ৪টি প্রধান ভূমিকার যেকোনোটিতে লগইন করুন" : "Select any of the 4 agricultural roles to authenticate"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Close login modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 UNIFIED ROLE SELECTOR TABS */}
        <div className="p-4 sm:p-6 pb-2 relative z-10">
          <p className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isBn ? "আপনার নির্দিষ্ট ভূমিকা নির্বাচন করুন:" : "Step 1: Choose Your Role Option:"}</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["PRODUCER", "BUYER", "OFFICER", "AGENT"] as RoleType[]).map((r) => {
              const p = personas[r];
              const isSelected = selectedRole === r;
              return (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`p-3 rounded-2xl flex flex-col items-center sm:items-start text-left border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white/20 border-amber-400/80 shadow-lg scale-[1.02] text-white"
                      : "bg-black/30 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {r === "PRODUCER" ? "🌾" : r === "BUYER" ? "🏢" : r === "OFFICER" ? "🔬" : "📦"}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isSelected ? "bg-amber-400 text-gray-900" : "bg-white/10 text-gray-300"}`}>
                      {r}
                    </span>
                  </div>
                  <h3 className="text-xs font-black truncate w-full">{isBn ? p.titleBn : p.titleEn}</h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* UNIFIED ROLE AUTHENTICATION BODY */}
        <div className="p-4 sm:p-6 pt-2 grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10">
          
          {/* LEFT: Persona Profile & Capabilities Card (7 cols) */}
          <div className="md:col-span-7 bg-black/40 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between gap-4">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${currentPersona.badgeBg} ${currentPersona.badgeBorder}`}>
                  {isBn ? currentPersona.subBn : currentPersona.subEn}
                </span>
                <span className="text-xs text-sky-200 flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> {currentPersona.district}
                </span>
              </div>

              <div>
                <h4 className="text-xl font-black text-white flex items-center gap-2">
                  <span>{currentPersona.name}</span>
                </h4>
                <p className="text-xs text-gray-300 flex items-center gap-1.5 mt-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> {currentPersona.phone}
                </p>
              </div>

              <div className="space-y-2 border-t border-white/10 pt-3">
                <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">
                  {isBn ? "প্রধান কার্যাবলী ও অধিকার:" : "Authorized Capabilities:"}
                </span>
                <ul className="space-y-1.5 text-xs text-gray-200">
                  {(isBn ? currentPersona.dutiesBn : currentPersona.dutiesEn).map((duty, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{duty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick 1-Click Fast Pass Button */}
            <div className="border-t border-white/10 pt-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{isBn ? "পূর্বনির্ধারিত পাসকোড:" : "Pre-assigned Security Key:"}</span>
                <span className="font-mono text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  PIN: {currentPersona.pin}
                </span>
              </div>

              <button
                onClick={handleDirectOneClickLogin}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>{isLoading ? (isBn ? "প্রবেশ করা হচ্ছে..." : "Authenticating...") : (isBn ? `⚡ এক ক্লিকে সরাসরি প্রবেশ (${currentPersona.titleBn})` : `⚡ 1-Click Direct Login as ${currentPersona.titleEn}`)}</span>
              </button>
            </div>

          </div>

          {/* RIGHT: Passcode Keypad Authentication Terminal (5 cols) */}
          <div className="md:col-span-5 bg-black/50 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between gap-4">
            
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-300 font-bold">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{isBn ? "৪-সংখ্যার পিন প্রবেশ করান" : "Enter 4-Digit Security PIN"}</span>
              </div>

              {/* PIN circles indicator */}
              <div className="flex items-center justify-center gap-3 py-1">
                {[0, 1, 2, 3].map(i => (
                  <div 
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      pin.length > i 
                        ? "bg-amber-400 border-amber-300 shadow-md scale-110" 
                        : "border-white/30 bg-white/5"
                    }`}
                  />
                ))}
              </div>

              {errorMsg && (
                <p className="text-[11px] text-rose-400 font-bold flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </p>
              )}
            </div>

            {/* Numeric Keypad Grid */}
            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLEAR", "0", "BACK"].map(key => (
                <button
                  key={key}
                  onClick={() => handleKeypad(key)}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-90 ${
                    key === "CLEAR" 
                      ? "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30" 
                      : key === "BACK" 
                      ? "bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-white/10" 
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  }`}
                >
                  {key === "BACK" ? "⌫" : key === "CLEAR" ? "C" : key}
                </button>
              ))}
            </div>

            <button
              onClick={() => executeLogin(pin)}
              disabled={pin.length !== 4 || isLoading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-gray-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
            >
              <span>{isBn ? "যাচাই ও প্রবেশ" : "Verify & Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* BOTTOM FOOTER INFO */}
        <div className="p-4 bg-black/60 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
          <span className="flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            <span>{isBn ? "বাংলাদেশ মনসুন কৃষি ও ফসল সুরক্ষা নেটওয়ার্ক" : "Bangladesh Monsoon Agro & Crop Network"}</span>
          </span>
          <span className="font-mono text-emerald-300">
            TLS 1.3 • AES-256 Encrypted Session
          </span>
        </div>

      </div>
    </div>
  );
};
