import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Heart, Activity, Info, ChevronRight, PhoneCall, Scale, Flame, Droplets, Wind, CheckCircle2, AlertCircle, MapPin, Loader2, ExternalLink, Siren, Zap } from 'lucide-react';
import { gemini } from '../services/gemini';
import Markdown from 'react-markdown';
import InfiniteCarousel from './InfiniteCarousel';

export default function EmergencyGuides() {
  const [hospitals, setHospitals] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const EMERGENCY_TIPS = [
    { icon: <Siren size={14} />, text: "Ambulance: 108" },
    { icon: <PhoneCall size={14} />, text: "Police: 100" },
    { icon: <Flame size={14} />, text: "Fire: 101" },
    { icon: <Zap size={14} />, text: "Stay calm and speak clearly." },
    { icon: <MapPin size={14} />, text: "Provide your exact location." },
    { icon: <Activity size={14} />, text: "Check for pulse and breathing." },
    { icon: <ShieldAlert size={14} />, text: "Do not move victims unless necessary." },
  ];

  const handleEmergencyCall = () => {
    window.location.href = 'tel:108';
  };

  const findHospitals = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await gemini.findNearbyHospitals(
            position.coords.latitude,
            position.coords.longitude
          );
          setHospitals(result);
        } catch (err) {
          setError("Failed to find nearby hospitals. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Location access denied. Please enable location to find nearby hospitals.");
        setLoading(false);
      }
    );
  };

  const EMERGENCY_STEPS = [
    {
      id: 'cpr',
      title: 'Cardiac Arrest (CPR)',
      icon: <Heart className="text-rose-600" />,
      color: 'rose',
      steps: [
        'Check Response: Tap and shout "Are you okay?"',
        'Call 108: If no response, call for help immediately.',
        'Check Breathing: Look for chest movement for 10 seconds.',
        'Start Compressions: Push HARD and FAST in the center of the chest.',
        'Rate: 100-120 compressions per minute (to the beat of "Stayin Alive").'
      ],
      donts: ['Do not stop until help arrives or the person wakes up.', 'Do not worry about breaking ribs; saving a life is the priority.']
    },
    {
      id: 'choking',
      title: 'Choking (Heimlich)',
      icon: <Wind className="text-amber-600" />,
      color: 'amber',
      steps: [
        'Stand Behind: Wrap your arms around their waist.',
        'Make a Fist: Place it just above their navel (belly button).',
        'Thrust: Pull inward and upward sharply (like an "J" shape).',
        'Repeat: Continue until the object is forced out or they pass out.',
        'If Unconscious: Start CPR immediately.'
      ],
      donts: ['Do not try to reach for the object unless you can clearly see it.', 'Do not give them water while they are choking.']
    },
    {
      id: 'bleeding',
      title: 'Severe Bleeding',
      icon: <Droplets className="text-rose-700" />,
      color: 'rose',
      steps: [
        'Apply Pressure: Use a clean cloth or your hands to press hard on the wound.',
        'Maintain Pressure: Do not lift the cloth to check if it stopped.',
        'Add Layers: If blood soaks through, add more cloth on top.',
        'Elevate: Keep the wounded area above the level of the heart if possible.',
        'Tourniquet: Only use as a last resort for life-threatening limb bleeding.'
      ],
      donts: ['Do not remove the original cloth; it helps clotting.', 'Do not wash a severely bleeding wound with water.']
    },
    {
      id: 'burns',
      title: 'Burns & Scalds',
      icon: <Flame className="text-orange-600" />,
      color: 'orange',
      steps: [
        'Cool Down: Run cool (not cold) tap water over the burn for 20 minutes.',
        'Remove Jewelry: Take off rings or watches before the area swells.',
        'Cover Loosely: Use plastic wrap or a clean, non-stick bandage.',
        'Pain Relief: Take paracetamol if needed (follow dosage).',
        'Seek Help: If the burn is larger than your hand or on the face.'
      ],
      donts: ['Do not use ice, butter, or toothpaste on the burn.', 'Do not pop any blisters that form.']
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white lg:rounded-[2.5rem] shadow-xl shadow-brand-500/5 border border-brand-100/50 overflow-hidden relative">
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-brand-50 bg-rose-50/30 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="min-w-0 pr-4">
          <h2 className="font-display font-bold text-lg sm:text-2xl text-slate-800 flex items-center gap-2 sm:gap-3">
            <ShieldAlert className="text-rose-600 shrink-0" size={20} />
            <span className="truncate">Emergency Action</span>
          </h2>
          <p className="text-[10px] sm:text-sm text-slate-500 mt-0.5 sm:mt-1 truncate">Stay calm. Save a life.</p>
        </div>
        <button 
          onClick={handleEmergencyCall}
          className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-rose-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/30 animate-pulse shrink-0"
        >
          <PhoneCall size={16} className="sm:w-[18px] sm:h-[18px]" />
          Call 108
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 sm:space-y-12 custom-scrollbar no-scrollbar">
        {/* Emergency Tips Carousel */}
        <div className="py-2.5 sm:py-3 bg-rose-50/50 border-y border-rose-100 -mx-4 sm:-mx-8 px-4 sm:px-8">
          <InfiniteCarousel 
            speed={40}
            items={EMERGENCY_TIPS.map((tip, i) => (
              <div key={`emergency-tip-${i}`} className="flex items-center gap-2 px-4 py-1 bg-white border border-rose-100 rounded-full shadow-sm">
                <div className="text-rose-600">{tip.icon}</div>
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest whitespace-nowrap">{tip.text}</span>
              </div>
            ))}
          />
        </div>

        {/* Emergency Contact Card */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-rose-600 text-white relative overflow-hidden shadow-2xl shadow-rose-500/20"
        >
          <div className="relative z-10 space-y-6 sm:space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0">
                <PhoneCall size={24} className="sm:w-[32px] sm:h-[32px]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-3xl font-bold tracking-tight">Emergency: 108</h3>
                <p className="text-rose-100 text-xs sm:text-base font-medium">Ambulance • Medical • Accident</p>
              </div>
            </div>
            <p className="text-rose-50 text-sm sm:text-lg leading-relaxed max-w-xl">
              Call immediately for any life-threatening situation. Provide your location clearly and stay on the line.
            </p>
            <button 
              onClick={handleEmergencyCall}
              className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-white text-rose-600 rounded-xl sm:rounded-[1.5rem] text-sm sm:text-lg font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
            >
              <PhoneCall size={20} className="sm:w-[24px] sm:h-[24px]" />
              Dial 108 Now
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32" />
        </motion.section>

        {/* Nearby Hospitals Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] bg-white border border-slate-100 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-brand-600 shrink-0">
                <MapPin size={20} className="sm:w-[24px] sm:h-[24px]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800 tracking-tight">Nearby Hospitals</h3>
                <p className="text-[10px] sm:text-xs text-slate-500">Find the closest emergency care centers</p>
              </div>
            </div>
            <button 
              onClick={findHospitals}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />}
              {loading ? 'Locating...' : 'Find Near Me'}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm flex items-center gap-3"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            {hospitals && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="prose prose-sm max-w-none text-slate-600 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <Markdown>{hospitals.text}</Markdown>
                </div>

                {hospitals.mapsLinks.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hospitals.mapsLinks.map((link: any, i: number) => (
                      <a 
                        key={`hospital-link-${i}`}
                        href={link.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-brand-500 hover:bg-brand-50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center">
                            <MapPin size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-brand-700">{link.title}</span>
                        </div>
                        <ExternalLink size={16} className="text-slate-400 group-hover:text-brand-500" />
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Dynamic Emergency Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {EMERGENCY_STEPS.map((emergency, idx) => (
            <motion.section 
              key={emergency.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-6 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 bg-white hover:border-brand-100 hover:shadow-xl hover:shadow-brand-500/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0 ${
                  emergency.color === 'rose' ? "bg-rose-50 text-rose-600" : 
                  emergency.color === 'amber' ? "bg-amber-50 text-amber-600" : "bg-orange-50 text-orange-600"
                }`}>
                  {emergency.icon}
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-800 tracking-tight">{emergency.title}</h3>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action Steps</h4>
                <div className="space-y-3">
                  {emergency.steps.map((step, i) => (
                    <div key={`step-${idx}-${i}`} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 space-y-4">
                <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Critical: What NOT to do</h4>
                <div className="space-y-2">
                  {emergency.donts.map((dont, i) => (
                    <div key={`dont-${idx}-${i}`} className="flex gap-3 items-start text-rose-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <p className="text-xs font-medium leading-relaxed">{dont}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Fits/Seizures Section - Simplified */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity size={28} />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-800">Seizures (Fits)</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100">
              <h4 className="font-bold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 size={18} />
                DO THIS
              </h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3"><span>•</span> <span>Ease them to the floor gently.</span></li>
                <li className="flex gap-3"><span>•</span> <span>Turn them onto their side to help breathing.</span></li>
                <li className="flex gap-3"><span>•</span> <span>Clear away hard or sharp objects.</span></li>
                <li className="flex gap-3"><span>•</span> <span>Put something soft under their head.</span></li>
              </ul>
            </div>

            <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100">
              <h4 className="font-bold text-rose-600 flex items-center gap-2">
                <AlertCircle size={18} />
                NEVER DO THIS
              </h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3"><span>•</span> <span>Do NOT hold them down or stop movements.</span></li>
                <li className="flex gap-3"><span>•</span> <span>Do NOT put anything in their mouth.</span></li>
                <li className="flex gap-3"><span>•</span> <span>Do NOT give water until they are fully alert.</span></li>
              </ul>
            </div>
          </div>
        </motion.section>
        
        {/* Good Samaritan Law */}
        <section className="p-8 rounded-[2.5rem] bg-indigo-900 text-white space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Scale size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Scale size={20} />
              </div>
              <h3 className="text-xl font-bold">The Good Samaritan Law (India)</h3>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              The Supreme Court of India has established guidelines to protect bystanders who help road accident victims.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'You cannot be forced to reveal your identity or contact details.',
                'You are not liable for any civil or criminal action for helping.',
                'Hospitals cannot demand payment before starting treatment.',
                'You can leave the hospital immediately after admitting the victim.'
              ].map((point, i) => (
                <div key={`samaritan-${i}`} className="flex items-start gap-3 bg-white/10 p-4 rounded-2xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <p className="text-xs font-medium text-indigo-50">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100 flex gap-4 items-start">
          <Info className="text-brand-600 shrink-0 mt-0.5" size={20} />
          <p className="text-xs text-brand-800 leading-relaxed">
            This guide is for educational purposes. In any real emergency, prioritize contacting professional medical services immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
