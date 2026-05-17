import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Database, Activity } from 'lucide-react';
import { cn } from '../utils';

export default function SystemStatus() {
  const statuses = [
    { label: 'AI Engine', status: 'Active', icon: <Zap size={14} />, color: 'emerald' },
    { label: 'Database', status: 'Synced', icon: <Database size={14} />, color: 'emerald' },
    { label: 'Security', status: 'Encrypted', icon: <ShieldCheck size={14} />, color: 'emerald' },
    { label: 'WHO/NHS', status: 'Verified', icon: <Activity size={14} />, color: 'emerald' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {statuses.map((s, i) => (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={s.label}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm"
        >
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center",
            s.color === 'emerald' ? "bg-emerald-50 text-emerald-600" : "bg-brand-50 text-brand-600"
          )}>
            {s.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">{s.label}</span>
            <span className="text-[10px] font-bold text-slate-700 leading-tight">{s.status}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
