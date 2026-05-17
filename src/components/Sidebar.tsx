import React from 'react';
import { LayoutDashboard, Heart, Activity, Moon, Utensils, Brain, Zap, Info, ShieldAlert, ChevronRight, Scale, ShieldCheck, ClipboardList } from 'lucide-react';
import { HealthTip, View, Language } from '../types';
import { translations } from '../translations';

const TIPS: Record<string, HealthTip[]> = {
  en: [
    { id: '1', title: 'Hydration Goal', content: 'Try to drink at least 8 glasses of water today to maintain energy levels.', category: 'nutrition' },
    { id: '2', title: 'Mindful Minute', content: 'Take 60 seconds to focus solely on your breath. It reduces cortisol.', category: 'mental-health' },
    { id: '3', title: 'Sleep Hygiene', content: 'Avoid screens 30 minutes before bed for better melatonin production.', category: 'sleep' }
  ],
  hi: [
    { id: '1', title: 'जलयोजन लक्ष्य', content: 'ऊर्जा के स्तर को बनाए रखने के लिए आज कम से कम 8 गिलास पानी पीने की कोशिश करें।', category: 'nutrition' },
    { id: '2', title: 'माइंडफुल मिनट', content: 'केवल अपनी सांस पर ध्यान केंद्रित करने के लिए 60 सेकंड का समय निकालें। यह कोर्टिसोल को कम करता है।', category: 'mental-health' },
    { id: '3', title: 'नींद की स्वच्छता', content: 'बेहतर मेलाटोनिन उत्पादन के लिए सोने से 30 मिनट पहले स्क्रीन से बचें।', category: 'sleep' }
  ],
  te: [
    { id: '1', title: 'హైడ్రేషన్ లక్ష్యం', content: 'శక్తి స్థాయిలను నిర్వహించడానికి ఈరోజు కనీసం 8 గ్లాసుల నీరు త్రాగడానికి ప్రయత్నించండి.', category: 'nutrition' },
    { id: '2', title: 'మైండ్‌ఫుల్ మినిట్', content: 'మీ శ్వాసపై మాత్రమే దృష్టి పెట్టడానికి 60 సెకన్ల సమయం కేటాయించండి. ఇది కార్టిసాల్‌ను తగ్గిస్తుంది.', category: 'mental-health' },
    { id: '3', title: 'నిద్ర పరిశుభ్రత', content: 'మెరుగైన మెలటోనిన్ ఉత్పత్తి కోసం పడుకోవడానికి 30 నిమిషాల ముందు స్క్రీన్‌లకు దూరంగా ఉండండి.', category: 'sleep' }
  ]
};

interface SidebarProps {
  onNavigate: (view: View, message?: string) => void;
  currentView: View;
  language: Language;
}

export default function Sidebar({ onNavigate, currentView, language }: SidebarProps) {
  const t = { ...translations.en, ...(translations[language] || {}) };
  const currentTips = TIPS[language] || TIPS.en;
  return (
    <div className="w-72 flex flex-col gap-8 h-full overflow-y-auto pr-2">
      {/* Quick Navigation */}
      <div className="space-y-2">
        <h3 className="font-display font-bold text-slate-800 mb-4 px-2 text-xs uppercase tracking-widest opacity-50">{t.quickAccess || 'Quick Access'}</h3>
        <button 
          id="nav-assistant"
          onClick={() => onNavigate('assistant')}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group mb-2 ${currentView === 'assistant' ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-brand-100/50 text-slate-600 hover:border-brand-200'}`}
        >
          <div className="flex items-center gap-3">
            <Brain size={18} className={currentView === 'assistant' ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500'} />
            <span className="text-sm font-bold">{t.assistant}</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <button 
          id="nav-dashboard"
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group mb-2 ${currentView === 'dashboard' ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-brand-100/50 text-slate-600 hover:border-brand-200'}`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard size={18} className={currentView === 'dashboard' ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500'} />
            <span className="text-sm font-bold">{t.dashboard}</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <button 
          id="nav-emergency"
          onClick={() => onNavigate('emergency')}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${currentView === 'emergency' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-brand-100/50 text-slate-600 hover:border-rose-200'}`}
        >
          <div className="flex items-center gap-3">
            <ShieldAlert size={18} className={currentView === 'emergency' ? 'text-rose-600' : 'text-slate-400 group-hover:text-rose-500'} />
            <span className="text-sm font-bold">{t.sos || 'SOS'}</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <button 
          id="nav-wellness"
          onClick={() => onNavigate('general-health')}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${currentView === 'general-health' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-brand-100/50 text-slate-600 hover:border-emerald-200'}`}
        >
          <div className="flex items-center gap-3">
            <Activity size={18} className={currentView === 'general-health' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'} />
            <span className="text-sm font-bold">{t.wellness || 'Wellness'}</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <button 
          id="nav-medical-history"
          onClick={() => onNavigate('medical-history')}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group mb-2 ${currentView === 'medical-history' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-brand-100/50 text-slate-600 hover:border-blue-200'}`}
        >
          <div className="flex items-center gap-3">
            <ClipboardList size={18} className={currentView === 'medical-history' ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'} />
            <span className="text-sm font-bold">{t.medicalHistory}</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <button 
          onClick={() => onNavigate('legal-resources')}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${currentView === 'legal-resources' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-brand-100/50 text-slate-600 hover:border-indigo-200'}`}
        >
          <div className="flex items-center gap-3">
            <Scale size={18} className={currentView === 'legal-resources' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'} />
            <span className="text-sm font-bold">{t.legal || 'Legal'}</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <button 
          id="nav-privacy"
          onClick={() => onNavigate('trust-privacy')}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${currentView === 'trust-privacy' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-brand-100/50 text-slate-600 hover:border-emerald-200'}`}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className={currentView === 'trust-privacy' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'} />
            <span className="text-sm font-bold">{t.privacyHub || 'Privacy Hub'}</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <button 
          id="nav-help"
          onClick={() => onNavigate('help')}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${currentView === 'help' ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-brand-100/50 text-slate-600 hover:border-brand-200'}`}
        >
          <div className="flex items-center gap-3">
            <Info size={18} className={currentView === 'help' ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500'} />
            <span className="text-sm font-bold">{t.technicalHelp || 'Technical Help'}</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="bg-white p-7 rounded-[2rem] border border-brand-100/50 shadow-sm">
        <h3 className="font-display font-bold text-slate-800 mb-5 flex items-center gap-2.5">
          <Activity size={18} className="text-brand-500" />
          {t.vitalStatus || 'Vital Status'}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.heartRate || 'Heart Rate'}</span>
            <span className="text-sm font-bold text-slate-900">72 BPM</span>
          </div>
          <div className="w-full h-1.5 bg-brand-50 rounded-full overflow-hidden">
            <div className="w-[72%] h-full bg-brand-500 rounded-full" />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.dailySteps || 'Daily Steps'}</span>
            <span className="text-sm font-bold text-slate-900">8,432</span>
          </div>
          <div className="w-full h-1.5 bg-brand-50 rounded-full overflow-hidden">
            <div className="w-[84%] h-full bg-brand-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Daily Tips */}
      <div className="flex-1">
        <h3 className="font-display font-bold text-slate-800 mb-5 px-2">{t.wellnessTips || 'Wellness Tips'}</h3>
        <div className="space-y-5">
          {currentTips.map((tip) => (
            <div key={tip.id} className="group cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white border border-brand-100 flex items-center justify-center text-brand-400 group-hover:text-brand-600 group-hover:border-brand-200 transition-all shadow-sm">
                  {tip.category === 'nutrition' && <Utensils size={18} />}
                  {tip.category === 'mental-health' && <Brain size={18} />}
                  {tip.category === 'sleep' && <Moon size={18} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{tip.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{tip.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Info */}
      <div className="bg-white p-6 rounded-[2rem] border border-brand-100/50">
        <div className="flex items-center gap-2 text-brand-600 mb-3">
          <Info size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{t.medicalNotice || 'Medical Notice'}</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {t.medicalNoticeText || 'Vitalis strictly adheres to safety guidelines and does not suggest banned medications in India.'}
        </p>
      </div>

    </div>
  );
}
