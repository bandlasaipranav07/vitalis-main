import React from 'react';
import { motion } from 'motion/react';
import { Info, ShieldCheck, Key, Zap, AlertTriangle, Cpu, Globe, MessageSquare } from 'lucide-react';
import { cn } from '../utils';

export default function HelpSection() {
  return (
    <div className="flex flex-col h-full bg-white lg:rounded-[2rem] shadow-xl overflow-y-auto">
      <header className="px-8 py-10 bg-brand-50/50 border-b border-brand-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Info size={120} />
        </div>
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm mb-4">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Help & Technical Information</h1>
          <p className="text-slate-500 mt-2 max-w-xl">Learn how Vitalis operates and troubleshoot common connectivity or functional issues.</p>
        </div>
      </header>

      <div className="p-8 space-y-12 mb-12">
        {/* API Key Instructions */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-amber-500" size={20} />
            <h2 className="text-xl font-bold text-slate-800">Troubleshooting Voice & Pictures</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">Voice Chat Errors</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                If the microphone doesn't start, please ensure you've granted browser permissions. We use <b>audio/webm</b> or <b>audio/mp4</b> depending on your device. On iOS, voice chat requires a manual tap for playback initialization.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">Picture Upload Errors</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Max file size is 5MB. Ensure images are clear and in JPG or PNG format. If the AI doesn't see the image, try adding a short text description alongside the upload.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="p-8 bg-rose-50 rounded-3xl border border-rose-100">
          <div className="flex items-center gap-3 mb-4 text-rose-600">
            <AlertTriangle size={20} />
            <h2 className="font-bold uppercase tracking-widest text-xs">Clinical Disclaimer</h2>
          </div>
          <p className="text-sm text-rose-700 leading-relaxed">
            Vitalis is an assistive tool and not a substitute for professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment. In case of emergency, contact your local emergency services (e.g., 108 or 911) immediately.
          </p>
        </section>
      </div>
    </div>
  );
}
