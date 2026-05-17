import React from 'react';
import { Brain, Heart, Moon, Utensils, Activity, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import InfiniteCarousel from './InfiniteCarousel';

const TOPICS = [
  {
    title: 'Nutrition & Diet',
    icon: <Utensils className="text-orange-500" />,
    desc: 'Balanced eating habits for long-term health.',
    color: 'bg-orange-50'
  },
  {
    title: 'Mental Wellness',
    icon: <Brain className="text-purple-500" />,
    desc: 'Strategies for stress management and focus.',
    color: 'bg-purple-50'
  },
  {
    title: 'Physical Activity',
    icon: <Activity className="text-blue-500" />,
    desc: 'Exercise routines for all fitness levels.',
    color: 'bg-blue-50'
  },
  {
    title: 'Sleep Science',
    icon: <Moon className="text-indigo-500" />,
    desc: 'Optimizing your rest for peak performance.',
    color: 'bg-indigo-50'
  }
];

const AFFIRMATIONS = [
  "My health is my greatest priority.",
  "I nourish my body with wholesome food.",
  "Every step I take brings me closer to wellness.",
  "I am grateful for my body's strength.",
  "I choose to be calm and centered.",
  "Consistency is the key to my health journey.",
  "I listen to my body's needs.",
  "Rest is a vital part of my productivity."
];

export default function GeneralHealth() {
  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-xl shadow-brand-500/5 border border-brand-100/50 overflow-hidden">
      <div className="px-8 py-6 border-b border-brand-50 bg-brand-50/30">
        <h2 className="font-display font-bold text-2xl text-slate-800 flex items-center gap-3">
          <Sparkles className="text-brand-600" />
          General Health
        </h2>
        <p className="text-sm text-slate-500 mt-1">Foundational wellness pillars aligned with WHO & NHS standards.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        {/* Affirmations Carousel */}
        <div className="py-2 border-y border-slate-50">
          <InfiniteCarousel 
            speed={50}
            items={AFFIRMATIONS.map((text, i) => (
              <div key={`affirmation-${i}`} className="flex items-center gap-2 px-4 py-1">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{text}</span>
              </div>
            ))}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {TOPICS.map((topic) => (
            <div key={topic.title} className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/5 transition-all group cursor-pointer hover-lift">
              <div className={`w-14 h-14 rounded-2xl ${topic.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
                {React.isValidElement(topic.icon) ? React.cloneElement(topic.icon as React.ReactElement<any>, { size: 28 }) : topic.icon}
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800">{topic.title}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">{topic.desc}</p>
            </div>
          ))}
        </div>

        <section className="space-y-6">
          <h3 className="font-display font-bold text-xl text-slate-800 flex items-center gap-2">
            <Heart size={20} className="text-rose-500" />
            Preventive Care
          </h3>
          <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h4 className="text-xl font-bold">Annual Check-ups</h4>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                Regular screenings can detect issues early when they are most treatable. Schedule your yearly physical today.
              </p>
              <button className="px-6 py-3 bg-brand-600 hover:bg-brand-700 rounded-xl text-sm font-bold transition-colors">
                View Screening Checklist
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
          </div>
        </section>

        <section className="p-8 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 flex items-start gap-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-emerald-900">Evidence-Based Standards</h4>
            <p className="text-sm text-emerald-700 leading-relaxed">
              Our health recommendations are derived from globally recognized medical authorities including the **World Health Organization (WHO)**, **National Health Service (NHS)**, and the **Ministry of Health and Family Welfare (MoHFW, India)**.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 text-center hover:bg-white transition-colors group">
            <div className="text-3xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">8h</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ideal Sleep</div>
          </div>
          <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 text-center hover:bg-white transition-colors group">
            <div className="text-3xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">2.5L</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Water Intake</div>
          </div>
          <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 text-center hover:bg-white transition-colors group">
            <div className="text-3xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">150m</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Weekly Exercise</div>
          </div>
        </div>
      </div>
    </div>
  );
}
