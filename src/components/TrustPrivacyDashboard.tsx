import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2, Info, Scale, HeartPulse, Database, UserCheck, AlertCircle, Clock, Globe, Bot } from 'lucide-react';
import InfiniteCarousel from './InfiniteCarousel';
import { cn } from '../utils';

export default function TrustPrivacyDashboard() {
  const [loginHistory, setLoginHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vitalis_login_history');
    if (saved) {
      try {
        setLoginHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load login history");
      }
    }
  }, []);
  const TRUST_PILLARS = [
    {
      title: 'Data Sovereignty',
      description: 'Your health data belongs to you. We do not sell or share your personal information with third parties or advertisers.',
      icon: <Lock className="text-brand-600" />,
      points: ['End-to-end encryption', 'No third-party tracking', 'Anonymized AI processing']
    },
    {
      title: 'Regulatory Alignment',
      description: 'We strictly adhere to Indian and international health data standards.',
      icon: <Scale className="text-indigo-600" />,
      points: ['DPDP Act (India) compliant', 'CDSCO Guideline adherence', 'WHO Data Privacy standards']
    },
    {
      title: 'Medical Integrity',
      description: 'Our AI is grounded in verified medical literature and strictly controlled safety protocols.',
      icon: <HeartPulse className="text-rose-600" />,
      points: ['Evidence-based grounding', 'Real-time banned drug checks', 'Mandatory triage warnings']
    }
  ];

  const GUIDELINES = [
    { name: 'WHO', fullName: 'World Health Organization', role: 'Global health standards and disease classification.' },
    { name: 'CDSCO', fullName: 'Central Drugs Standard Control Organisation', role: 'Indian regulatory body for pharmaceuticals and medical devices.' },
    { name: 'NHS', fullName: 'National Health Service (UK)', role: 'Clinical evidence and patient-facing health guidance.' },
    { name: 'NMC', fullName: 'National Medical Commission (India)', role: 'Medical ethics and professional standards in India.' },
    { name: 'FDA', fullName: 'Food and Drug Administration', role: 'International standards for drug and device safety.' },
    { name: 'PubMed', fullName: 'National Library of Medicine', role: 'Peer-reviewed clinical research and medical journals.' }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] shadow-xl shadow-brand-500/5 border border-brand-100/50 overflow-hidden">
      <div className="px-8 py-6 border-b border-brand-50 bg-brand-50/30 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-800 flex items-center gap-3">
            <ShieldCheck className="text-brand-600" />
            Trust & Privacy Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-1">Transparency in how we protect you and your data.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
          <CheckCircle2 size={14} />
          Verified Secure
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-600">
              <Database size={24} />
            </div>
            <h4 className="font-bold text-slate-800">Zero Data Selling</h4>
            <p className="text-xs text-slate-500">Your data is never monetized or shared with advertisers.</p>
          </div>
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
              <UserCheck size={24} />
            </div>
            <h4 className="font-bold text-slate-800">User Control</h4>
            <p className="text-xs text-slate-500">Full access to your data with the right to delete anytime.</p>
          </div>
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rose-600">
              <EyeOff size={24} />
            </div>
            <h4 className="font-bold text-slate-800">Private AI</h4>
            <p className="text-xs text-slate-500">AI analysis happens in a secure, isolated environment.</p>
          </div>
        </div>

        {/* Trust Pillars */}
        <div className="space-y-6">
          <h3 className="font-display font-bold text-xl text-slate-800 px-2">Our Privacy Pillars</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TRUST_PILLARS.map((pillar, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:border-brand-100 hover:shadow-xl hover:shadow-brand-500/5 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h4 className="font-bold text-lg text-slate-800 mb-3">{pillar.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">{pillar.description}</p>
                <ul className="space-y-3">
                  {pillar.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-medium text-slate-600">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Medical Guidelines - Infinite Carousel */}
        <div className="bg-slate-900 rounded-[3rem] py-12 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-10">
            <div className="px-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Medical Grounding Sources</h3>
                <p className="text-slate-400 text-sm">The authorities that inform our AI's medical knowledge.</p>
              </div>
            </div>

            <InfiniteCarousel 
              speed={40}
              items={GUIDELINES.map((guide, i) => (
                <div key={i} className="w-80 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-brand-500 text-[10px] font-bold rounded-md uppercase tracking-wider">{guide.name}</span>
                    <h5 className="font-bold text-sm">{guide.fullName}</h5>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{guide.role}</p>
                </div>
              ))}
            />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        </div>

        {/* Compliance Notice */}
        <div className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 flex gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
            <Scale size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-indigo-900">DPDP Act Compliance (India)</h4>
            <p className="text-sm text-indigo-700 leading-relaxed">
              Vitalis is designed to be fully compliant with the Digital Personal Data Protection Act of India. 
              We implement strict data minimization, purpose limitation, and storage limitation principles to ensure your health information remains private and secure.
            </p>
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                <CheckCircle2 size={12} />
                Data Minimization
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                <CheckCircle2 size={12} />
                Consent-Based
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                <CheckCircle2 size={12} />
                Right to Erasure
              </div>
            </div>
          </div>
        </div>

        {/* Login History Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-display font-bold text-xl text-slate-800">Security & Login History</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              <ShieldCheck size={12} />
              Session Secure
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            {loginHistory.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {loginHistory.map((login, idx) => (
                  <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{login.timestamp}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Globe size={10} className="text-slate-400" />
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            {login.method || 'Google Auth'} • {login.device || 'Web Browser'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Successful
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <Clock size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-600">No login history found</p>
                  <p className="text-xs text-slate-400">Your recent login activity will appear here.</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400 px-6 font-medium italic">
            * We only store the last 10 login events locally on your device for security auditing.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4 items-start">
          <AlertCircle className="text-slate-400 shrink-0 mt-0.5" size={20} />
          <p className="text-xs text-slate-500 leading-relaxed italic">
            Disclaimer: While we implement industry-leading security and grounding, Vitalis is an AI-assisted tool. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </div>
  );
}
