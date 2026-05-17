import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { cn } from '../utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastProps) {
  return (
    <div className="fixed bottom-24 right-4 sm:right-8 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-[calc(100%-2rem)] sm:max-w-md">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [onClose, toast.duration]);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-rose-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
  };

  const backgrounds = {
    success: 'bg-emerald-50 border-emerald-100',
    error: 'bg-rose-50 border-rose-100',
    info: 'bg-blue-50 border-blue-100',
    warning: 'bg-amber-50 border-amber-100',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className={cn(
        "pointer-events-auto w-full p-4 rounded-2xl border shadow-xl flex items-start gap-4 backdrop-blur-md bg-white/90",
        backgrounds[toast.type]
      )}
    >
      <div className="shrink-0 mt-0.5">
        {icons[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
          {toast.title}
        </h4>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          {toast.message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
