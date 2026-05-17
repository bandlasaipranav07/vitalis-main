import React from 'react';
import { motion } from 'motion/react';
import { 
  Droplets, 
  Moon, 
  Activity, 
  Heart, 
  ChevronRight, 
  Lightbulb,
  Clock,
  ShieldCheck,
  Zap,
  Scale,
  Utensils,
  Brain,
  Sun,
  Target,
  TrendingUp,
  Sparkles,
  Crown,
  Users,
  ArrowRight
} from 'lucide-react';
import { View, UserTier, Language } from '../types';
import { cn } from '../utils';
import InfiniteCarousel from './InfiniteCarousel';
import { translations } from '../translations';

interface DashboardProps {
  user: any;
  userTier: UserTier;
  onNavigate: (view: View) => void;
  language: Language;
}

export default function Dashboard({ user, userTier, onNavigate, language }: DashboardProps) {
  const t = translations[language] || translations.en;
  const firstName = user?.uid === 'guest-user' ? t.guestUser : (user?.displayName?.split(' ')[0] || 'User');

  const HEALTH_TIPS = [
    { icon: <Droplets className="text-blue-500" />, text: language === 'hi' ? "दिन में कम से कम 8 गिलास पानी पिएं।" : language === 'te' ? "రోజుకు కనీసం 8 గ్లాసుల నీరు త్రాగాలి." : "Drink at least 8 glasses of water daily." },
    { icon: <Moon className="text-indigo-500" />, text: language === 'hi' ? "7-9 घंटे की गुणवत्तापूर्ण नींद का लक्ष्य रखें।" : language === 'te' ? "7-9 గంటల నాణ్యమైన నిద్రను లక్ష్యంగా పెట్టుకోండి." : "Aim for 7-9 hours of quality sleep." },
    { icon: <Activity className="text-emerald-500" />, text: language === 'hi' ? "दोपहर के भोजन के बाद 10 मिनट टहलें।" : language === 'te' ? "మధ్యాహ్న భోజనం తర్వాత 10 నిమిషాలు నడవండి." : "Take a 10-minute walk after lunch." },
    { icon: <Utensils className="text-orange-500" />, text: language === 'hi' ? "नाश्ते में अधिक फाइबर शामिल करें।" : language === 'te' ? "మీ అల్పాహారంలో ఎక్కువ ఫైబర్‌ని చేర్చుకోండి." : "Include more fiber in your breakfast." },
    { icon: <Brain className="text-purple-500" />, text: language === 'hi' ? "5 मिनट ध्यानपूर्वक सांस लेने का अभ्यास करें।" : language === 'te' ? "5 నిమిషాల మైండ్‌ఫుల్ బ్రీతింగ్ ప్రాక్టీస్ చేయండి." : "Practice 5 minutes of mindful breathing." },
    { icon: <Sun className="text-yellow-500" />, text: language === 'hi' ? "15 मिनट की सुबह की धूप लें।" : language === 'te' ? "15 నిమిషాల ఉదయపు సూర్యకాంతి పొందుండి." : "Get 15 minutes of morning sunlight." },
    { icon: <Heart className="text-rose-500" />, text: language === 'hi' ? "स्वस्थ हृदय के लिए नमक का सेवन कम करें।" : language === 'te' ? "మెరుగైన గుండె ఆరోగ్యం కోసం ఉప్పు వినియోగాన్ని తగ్గించండి." : "Reduce salt intake for better heart health." },
  ];

  const AFFIRMATIONS = language === 'hi' ? [
    "आपका शरीर अद्भुत चीजें करने में सक्षम है।",
    "छोटे कदम बड़े बदलाव की ओर ले जाते हैं।",
    "आप एक स्वस्थ जीवन के योग्य हैं।",
    "हर दिन बेहतर महसूस करने का एक नया मौका है।",
    "अपने शरीर की सुनें, वह जानता है कि उसे क्या चाहिए।"
  ] : language === 'te' ? [
    "మీ శరీరం అద్భుతమైన పనులను చేయగలదు.",
    "చిన్న అడుగులు పెద్ద మార్పులకు దారితీస్తాయి.",
    "మీరు ఆరోగ్యకరమైన జీవితానికి అర్హులు.",
    "మెరుగ్గా అనిపించడానికి ప్రతి రోజు ఒక కొత్త అవకాశం.",
    "మీ శరీరం చెప్పేది వినండి, దానికి ఏమి కావాలో దానికి తెలుసు."
  ] : [
    "Your body is capable of amazing things.",
    "Small steps lead to big changes.",
    "You are worthy of a healthy life.",
    "Every day is a new chance to feel better.",
    "Listen to your body, it knows what it needs."
  ];

  const dailyAffirmation = AFFIRMATIONS[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % AFFIRMATIONS.length];

  return (
    <div className="flex flex-col h-full space-y-6 sm:space-y-8 overflow-y-auto pb-8 pr-2 custom-scrollbar no-scrollbar">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1"
      >
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            {language === 'hi' ? 'नमस्ते' : language === 'te' ? 'నమస్కారం' : 'Hello'}, <span className="text-brand-600">{firstName}</span> 👋
          </h1>
          <p className="text-slate-500 text-base sm:text-lg font-medium tracking-tight">Your health journey is looking great today.</p>
        </div>
        <div className="flex items-center gap-4">
          {userTier === 'free' && (
            <button 
              onClick={() => onNavigate('premium-upgrade')}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-100 hover:bg-amber-100 transition-all"
            >
              <Crown size={14} fill="currentColor" />
              Upgrade to Premium
            </button>
          )}
        </div>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Health Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-12 bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-brand-100 shadow-sm flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <Heart size={200} fill="currentColor" className="text-brand-600" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-inner shrink-0">
                <Activity size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-800 tracking-tight">Health Assistant</h3>
            </div>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl font-medium">
              Welcome to your personal health companion. Use the tools below to check symptoms, manage medications, or consult our AI assistant for wellness advice. 
            </p>
          </div>

          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 animate-pulse shrink-0">
                <Sparkles size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Daily Affirmation</p>
                <p className="text-xs sm:text-sm font-bold text-slate-700 italic truncate sm:whitespace-normal">"{dailyAffirmation}"</p>
              </div>
            </div>
            <button 
              id="dashboard-consultation-btn"
              onClick={() => onNavigate('assistant')}
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-brand-600 text-white rounded-2xl text-sm sm:text-base font-bold flex items-center justify-center gap-3 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95 whitespace-nowrap"
            >
              Start Consultation <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Quick Tools */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-12 bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-brand-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                <Zap size={20} />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800 tracking-tight">Quick Tools</h3>
            </div>
            <span className="hidden xs:inline text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Tools</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4">
            <ToolButton 
              id="tool-symptom-checker"
              icon={<ShieldCheck className="text-brand-600" />}
              title="Symptom Checker"
              description="AI Analysis"
              onClick={() => onNavigate('symptom-checker')}
            />
            <ToolButton 
              id="tool-medication"
              icon={<Clock className="text-indigo-600" />}
              title="Medication"
              description="Track Prescriptions"
              onClick={() => onNavigate('medication')}
            />
            <ToolButton 
              id="tool-emergency"
              icon={<Heart className="text-rose-600" />}
              title="Emergency"
              description="First Aid SOS"
              onClick={() => onNavigate('emergency')}
            />
            <ToolButton 
              id="tool-wellness"
              icon={<Activity className="text-emerald-600" />}
              title="Wellness"
              description="Health Pillars"
              onClick={() => onNavigate('general-health')}
            />
            <ToolButton 
              id="tool-family"
              icon={<Users className={cn(userTier === 'premium' ? "text-indigo-600" : "text-slate-300")} />}
              title="Family Profiles"
              description={userTier === 'premium' ? "Manage Family" : "Premium Only"}
              onClick={() => userTier === 'premium' ? {} : onNavigate('premium-upgrade')}
              isLocked={userTier === 'free'}
            />
          </div>
        </motion.div>
      </div>

      {/* Health Tips Infinite Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white py-6 rounded-[2rem] sm:rounded-[2.5rem] border border-brand-100 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
            <Lightbulb size={16} />
          </div>
          <h3 className="font-display font-bold text-base sm:text-lg text-slate-800 tracking-tight">Wellness Pulse</h3>
        </div>
        <InfiniteCarousel 
          speed={35}
          items={HEALTH_TIPS.map((tip, i) => (
            <div key={`health-tip-${i}`} className="flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                {tip.icon}
              </div>
              <span className="text-sm font-bold text-slate-700 whitespace-nowrap">{tip.text}</span>
            </div>
          ))}
        />
      </motion.div>
    </div>
  );
}

function ToolButton({ id, icon, title, description, onClick, isLocked }: any) {
  return (
    <button 
      id={id}
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group",
        isLocked ? "bg-slate-50/50 border-slate-100 opacity-80" : "border-slate-100 hover:border-brand-200 hover:bg-brand-50/30"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-xl border flex items-center justify-center shadow-sm transition-transform",
          isLocked ? "bg-slate-100 border-slate-200" : "bg-white border-slate-100 group-hover:scale-110"
        )}>
          {icon}
        </div>
        <div className="text-left">
          <h4 className={cn("text-sm font-bold", isLocked ? "text-slate-400" : "text-slate-800")}>{title}</h4>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{description}</p>
        </div>
      </div>
      {isLocked ? (
        <Crown size={14} className="text-amber-400" fill="currentColor" />
      ) : (
        <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-500 transition-colors" />
      )}
    </button>
  );
}
