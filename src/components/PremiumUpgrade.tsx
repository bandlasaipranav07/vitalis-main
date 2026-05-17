import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Crown, Zap, FileText, Users, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { UserTier } from '../types';
import InfiniteCarousel from './InfiniteCarousel';

interface PremiumUpgradeProps {
  currentTier: UserTier;
  onUpgrade: () => void;
  onDowngrade: () => void;
}

export default function PremiumUpgrade({ currentTier, onUpgrade, onDowngrade }: PremiumUpgradeProps) {
  const BENEFITS = [
    {
      title: 'Clinical Summaries',
      description: 'Generate professional, doctor-ready PDF reports of your symptom assessments.',
      icon: <FileText className="text-brand-600" />,
      premiumOnly: true
    },
    {
      title: 'Advanced Med-Check',
      description: 'Deep interaction analysis between multiple medications and chronic conditions.',
      icon: <Zap className="text-amber-500" />,
      premiumOnly: true
    },
    {
      title: 'Family Profiles',
      description: 'Manage health safety checks for up to 5 family members in one secure place.',
      icon: <Users className="text-indigo-600" />,
      premiumOnly: true
    },
    {
      title: 'Priority AI Engine',
      description: 'Faster response times and more detailed clinical reasoning in "Thinking" mode.',
      icon: <Star className="text-rose-500" />,
      premiumOnly: true
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] shadow-xl shadow-brand-500/5 border border-brand-100/50 overflow-hidden">
      <div className="px-8 py-12 bg-gradient-to-br from-brand-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="relative z-10 text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6"
          >
            <Crown size={40} className="text-white" fill="currentColor" />
          </motion.div>
          <h2 className="text-4xl font-display font-bold">Vitalis Premium</h2>
          <p className="text-brand-100 max-w-md mx-auto">
            Unlock advanced clinical tools and family safety features to take total control of your wellness journey.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-400/20 rounded-full blur-3xl -ml-32 -mb-32" />
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BENEFITS.map((benefit, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 flex gap-5 items-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                {benefit.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  {benefit.title}
                  <span className="px-1.5 py-0.5 bg-brand-100 text-brand-700 text-[8px] font-bold uppercase rounded tracking-widest">Premium</span>
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-8 rounded-[2.5rem] bg-brand-50 border border-brand-100 flex flex-col items-center text-center space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-brand-900">Select Your Plan</h3>
            <p className="text-sm text-brand-700">Choose the plan that fits your health needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            {/* Monthly Plan */}
            <div className="p-6 rounded-3xl bg-white border border-brand-100 shadow-sm flex flex-col items-center space-y-4 overflow-hidden relative w-full">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-slate-800">₹199</span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>
              </div>
              <button 
                onClick={onUpgrade}
                className={`w-full py-3 rounded-xl font-bold transition-all ${currentTier === 'premium' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600 hover:bg-brand-100'}`}
              >
                {currentTier === 'premium' ? 'Current Plan' : 'Select Monthly'}
              </button>
              
              <div className="w-[120%] pt-2 mt-2 border-t border-slate-50">
                <InfiniteCarousel 
                  speed={30}
                  items={[1, 2, 3].map((i) => (
                    <div key={`monthly-msg-${i}`} className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full">
                      <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">Your health & wellness cost less than 1 Biryani! 🍲</span>
                    </div>
                  ))}
                />
              </div>
            </div>

            {/* Yearly Plan */}
            <div className="p-6 rounded-3xl bg-white border-2 border-brand-500 shadow-lg shadow-brand-500/10 flex flex-col items-center space-y-4 relative overflow-hidden w-full">
              <div className="absolute -top-3 px-3 py-1 bg-brand-600 text-white text-[8px] font-bold uppercase rounded-full tracking-widest">
                Best Value
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yearly</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-slate-800">₹1,499</span>
                  <span className="text-xs text-slate-400">/yr</span>
                </div>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">Save 37% annually</p>
              </div>
              <button 
                onClick={onUpgrade}
                className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20"
              >
                {currentTier === 'premium' ? 'Current Plan' : 'Select Yearly'}
              </button>

              <div className="w-[120%] pt-2 mt-2 border-t border-slate-50">
                <InfiniteCarousel 
                  speed={40}
                  items={[1, 2].map((i) => (
                    <div key={`yearly-msg-${i}`} className="flex items-center gap-2 px-4 py-1.5 bg-brand-50 rounded-full">
                      <span className="text-xs font-bold text-brand-700 whitespace-nowrap">What's the use of an Amazon yearly subscription if you don't have good health? 🏥</span>
                    </div>
                  ))}
                />
              </div>
            </div>
          </div>

          {/* Medico Discount Section */}
          <div className="w-full max-w-2xl p-6 rounded-3xl bg-indigo-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Star size={80} fill="currentColor" />
            </div>
            <div className="text-left space-y-1 relative z-10">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-lg">Medico Special Discount</h4>
                <span className="px-2 py-0.5 bg-white/20 rounded text-[8px] font-bold uppercase tracking-widest">Verified Students</span>
              </div>
              <p className="text-xs text-indigo-200">Are you a medical student or professional? Get 50% off Premium.</p>
            </div>
            <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all whitespace-nowrap relative z-10">
              Verify & Pay ₹99/mo
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <ShieldCheck size={12} />
            Secure Payment • Cancel Anytime • 7-Day Money Back
          </div>
        </div>
      </div>
    </div>
  );
}
