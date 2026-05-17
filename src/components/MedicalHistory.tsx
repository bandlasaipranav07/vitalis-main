import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, History, FileText, Calendar, Plus, Search } from 'lucide-react';

export default function MedicalHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vitalis_medical_history');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse medical history");
      }
    }
  }, []);

  const handleNewRecord = () => {
    const newRecord = { 
      title: 'New AI Consultation', 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
      type: 'AI Triage', 
      status: 'Recorded' 
    };
    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem('vitalis_medical_history', JSON.stringify(updated));
  };

  const filteredRecords = records.filter(record => 
    record.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    record.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-5xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Medical History</h1>
          <p className="text-slate-500">Keep track of your health journey, records, and past consultations.</p>
        </div>
        <button 
          onClick={handleNewRecord}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95"
        >
          <Plus size={18} />
          New Record
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-brand-100/50 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-bold text-slate-800 flex items-center gap-3">
                <History className="text-brand-500" size={24} />
                Recent Records
              </h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search records..." 
                  className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 w-64"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredRecords.length > 0 ? filteredRecords.map((record, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-brand-100 hover:bg-brand-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{record.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {record.date}</span>
                        <span>•</span>
                        <span className="font-medium text-brand-500">{record.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-full italic">
                      {record.status}
                    </span>
                    <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                </motion.div>
              )) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No records found matching "{searchQuery}"
                </div>
              )}
            </div>
            
            <button className="w-full mt-8 py-3 text-sm font-bold text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
              View All History
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-brand-500/20">
            <ClipboardList className="mb-4 opacity-50" size={32} />
            <h3 className="text-xl font-display font-bold mb-2">Secure Cloud Sync</h3>
            <p className="text-brand-100 text-sm leading-relaxed mb-6">
              Your medical history is encrypted and synced across your devices. Only you can access your private data.
            </p>
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-all">
              Manage Access
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-brand-100/50 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-800 mb-4">Health Timeline</h3>
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
              {records.length > 0 ? records.slice(0, 5).map((item, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="w-[23px] h-[23px] rounded-full bg-white border-2 border-brand-500 flex items-center justify-center z-10 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-brand-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">{item.date}</span>
                    <p className="text-sm text-slate-600 font-medium mt-0.5">{item.title}</p>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-slate-400 pl-8">No recent timeline events.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
