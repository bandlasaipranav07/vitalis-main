import React, { useState } from 'react';
import { Search, AlertTriangle, ShieldCheck, Info, ChevronRight, Pill, Ban, HeartPulse, Baby, X, Scale, Loader2, Thermometer, Droplets, Clock, Zap, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { gemini } from '../services/gemini';
import InfiniteCarousel from './InfiniteCarousel';
import { UserTier } from '../types';
import { useToast } from '../contexts/ToastContext';



interface MedicationSectionProps {
  userTier: UserTier;
  onConsultAI?: (message: string) => void;
  onNavigate?: (view: any) => void;
}

export default function MedicationSection({ userTier, onConsultAI, onNavigate }: MedicationSectionProps) {
  const { showError, showSuccess } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('recent_med_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load recent searches");
      }
    }
  }, []);

  const saveToRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_med_searches', JSON.stringify(updated));
  };

  const SAFETY_TIPS = [
    { icon: <Clock size={14} />, text: "Take meds at the same time daily." },
    { icon: <Droplets size={14} />, text: "Drink water with oral medications." },
    { icon: <AlertTriangle size={14} />, text: "Check expiry dates before use." },
    { icon: <ShieldCheck size={14} />, text: "Keep prescriptions handy." },
    { icon: <Thermometer size={14} />, text: "Store in a cool, dry place." },
    { icon: <Baby size={14} />, text: "Keep away from children." },
    { icon: <Ban size={14} />, text: "Never share your prescriptions." },
  ];

  const handleSearch = async () => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return;

    saveToRecent(searchTerm);

    // Dynamic check using AI
    setSearchResult({ name: searchTerm, type: 'analyzing', info: 'Analyzing safety data...' });
      try {
        const aiResult = await gemini.checkMedicationSafety(searchTerm);
        if (aiResult && (aiResult.info || aiResult.reason)) {
          setSearchResult({ ...aiResult, name: searchTerm });
          showSuccess("AI Analysis Ready", `Safety report generated for ${searchTerm}.`);
        } else {
          throw new Error("Invalid AI response");
        }
      } catch (error: any) {
        console.error("Medication AI Error:", error);
        showError("Search Error", `Failed to retrieve safety data for ${searchTerm}.`);
        setSearchResult({ 
          name: searchTerm, 
          type: 'unknown', 
          info: 'Unable to retrieve specific safety data at this moment. Please consult a healthcare professional or try the AI Chat for a general report.' 
        });
      }
  };

  const handleConsultAI = (medName: string) => {
    if (onConsultAI) {
      onConsultAI(`I want to know about the safety and side effects of ${medName}. Is it safe to use in India?`);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Safety Tips Carousel */}
      <div className="py-2.5 sm:py-4 bg-white border-y border-slate-100 -mx-4 sm:-mx-8 px-4 sm:px-8">
        <InfiniteCarousel 
          speed={45}
          items={SAFETY_TIPS.map((tip, i) => (
            <div key={`safety-tip-${i}`} className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-1.5 sm:py-2 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl">
              <div className="text-brand-600">{tip.icon}</div>
              <span className="text-[9px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest whitespace-nowrap">{tip.text}</span>
            </div>
          ))}
        />
      </div>

      {/* Header Section */}
      <div className="relative p-6 sm:p-8 lg:p-12 rounded-[2rem] sm:rounded-[3rem] bg-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-400 text-[9px] sm:text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={14} />
            CDSCO Compliance Verified
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
            Medication Safety & <span className="text-brand-400">Compliance</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-lg leading-relaxed">
            Search for medications to check their safety status and banned lists in India.
          </p>
          
          <div className="relative pt-2">
            <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={20} className="sm:w-[24px] sm:h-[24px]" />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Medication name..." 
              className="w-full pl-12 sm:pl-16 pr-32 sm:pr-40 py-4 sm:py-6 bg-white/5 border border-white/10 rounded-2xl sm:rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-white text-base sm:text-lg font-medium placeholder:text-slate-500"
            />
            <button 
              onClick={handleSearch}
              disabled={!searchTerm}
              className="absolute right-2 sm:right-3 top-2 sm:top-3 bottom-2 sm:bottom-3 px-4 sm:px-8 bg-brand-600 text-white rounded-xl sm:rounded-[1.5rem] text-xs sm:text-base font-bold hover:bg-brand-700 disabled:opacity-30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 shadow-sm"
            >
              Check
              <ChevronRight size={18} className="sm:w-[20px] sm:h-[20px]" />
            </button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchResult && (
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest self-center mr-2">Recent:</span>
              {recentSearches.map((s, i) => (
                <button
                  key={`recent-med-${i}`}
                  onClick={() => {
                    setSearchTerm(s);
                    handleSearch();
                  }}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold text-white hover:bg-white/20 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Search Result Overlay */}
          <AnimatePresence>
            {searchResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-white border border-slate-100 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      searchResult.type === 'banned' ? "bg-rose-50 text-rose-500" : 
                      searchResult.type === 'restricted' ? "bg-orange-50 text-orange-500" :
                      searchResult.type === 'unknown' ? "bg-amber-50 text-amber-500" : "bg-brand-50 text-brand-500"
                    )}>
                      {searchResult.type === 'banned' ? <Ban size={20} /> : 
                       searchResult.type === 'restricted' || searchResult.type === 'unknown' ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                    </div>
                    <h4 className="font-display font-bold text-lg sm:text-xl text-slate-800 truncate">{searchResult.name}</h4>
                  </div>
                  <button onClick={() => setSearchResult(null)} className="text-slate-400 hover:text-slate-600 shrink-0">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
                  {searchResult.type === 'analyzing' ? (
                    <div className="flex items-center gap-3 text-brand-600">
                      <Loader2 className="animate-spin" size={16} />
                      <span className="text-[10px] sm:text-sm font-bold animate-pulse uppercase tracking-widest">AI analysis in progress...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {searchResult.type === 'banned' ? (
                          <span className="text-rose-600 font-bold uppercase tracking-tight">BANNED IN INDIA</span>
                        ) : searchResult.type === 'restricted' ? (
                          <span className="text-orange-600 font-bold uppercase tracking-tight">RESTRICTED MEDICATION</span>
                        ) : searchResult.type === 'unknown' ? (
                          <span className="text-amber-600 font-bold uppercase tracking-tight">UNVERIFIED DATA</span>
                        ) : null}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {searchResult.type === 'banned' || searchResult.type === 'restricted' ? searchResult.reason : searchResult.info}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => handleConsultAI(searchResult.name)}
                    className="flex-1 py-3.5 sm:py-4 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    Deep AI Report
                    <ChevronRight size={16} />
                  </button>
                  <button 
                    onClick={() => userTier === 'premium' ? {} : onNavigate?.('premium-upgrade')}
                    className={cn(
                      "flex-1 py-3.5 sm:py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border-2",
                      userTier === 'premium' 
                        ? "bg-white border-brand-100 text-brand-600 hover:bg-brand-50" 
                        : "bg-slate-50 border-slate-100 text-slate-400"
                    )}
                  >
                    <Zap size={16} className={userTier === 'premium' ? "text-amber-500" : "text-slate-300"} />
                    Interactions Check
                    {userTier === 'free' && <Crown size={12} className="text-amber-400" fill="currentColor" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-[2rem] bg-brand-50 border border-brand-100 flex items-start gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shrink-0 shadow-sm">
              <Search size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-brand-900">Dynamic AI Verification</h4>
              <p className="text-sm text-brand-700 leading-relaxed">
                Enter any medication in the search bar above. Vitalis AI will instantly cross-reference it against the latest medical guidelines, compliance standards, and regulatory alerts to generate a customized safety report for you.
              </p>
            </div>
          </div>
        </div>

        {/* Guidelines Sidebar */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
              <Info size={20} />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-800">Usage Guidelines</h3>
          </div>

          <div className="space-y-4">
            <div className="p-8 rounded-[2.5rem] bg-brand-600 text-white space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <HeartPulse size={80} />
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={24} />
                <h4 className="font-bold text-lg">Adult Safety</h4>
              </div>
              <ul className="space-y-3">
                {['Follow prescribed dosage', 'Check for drug interactions', 'Avoid alcohol with meds'].map(item => (
                  <li key={`adult-safety-${item}`} className="flex items-center gap-3 text-sm font-medium text-brand-50">
                    <div className="w-1.5 h-1.5 bg-brand-200 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-slate-100 text-slate-800 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Baby size={80} />
              </div>
              <div className="flex items-center gap-3 text-brand-600">
                <AlertTriangle size={24} />
                <h4 className="font-bold text-lg">Pediatric Care</h4>
              </div>
              <ul className="space-y-3">
                {['Use weight-based dosing', 'Use provided measuring tools', 'Keep out of reach'].map(item => (
                  <li key={`pediatric-care-${item}`} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-start gap-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-amber-900">Medical Disclaimer</h4>
            <p className="text-sm text-amber-700 leading-relaxed">
              The information provided here is for educational purposes only. **Vitalis** does not provide medical prescriptions. Always consult a qualified healthcare professional.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-brand-50 border border-brand-100 flex items-start gap-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shrink-0 shadow-sm">
            <Scale size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-brand-900">CDSCO Regulatory Notice</h4>
            <p className="text-sm text-brand-700 leading-relaxed">
              All medication data is referenced against the **Central Drugs Standard Control Organisation (CDSCO)** guidelines. Selling or distributing banned Fixed Dose Combinations (FDCs) is a punishable offense under the Drugs and Cosmetics Act.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
