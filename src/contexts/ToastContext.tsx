import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastMessage, ToastType, ToastContainer } from '../components/Toast';

interface ToastContextType {
  showToast: (title: string, message: string, type?: ToastType, duration?: number) => void;
  showError: (title: string, message: string) => void;
  showSuccess: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message: string, type: ToastType = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
    
    // Auto-remove handled by individual ToastItem, but we could also do it here if needed
  }, []);

  const showError = useCallback((title: string, message: string) => {
    showToast(title, message, 'error', 7000);
    // Robust logging
    console.error(`[CRITICAL ERROR] ${title}: ${message}`);
  }, [showToast]);

  const showSuccess = useCallback((title: string, message: string) => {
    showToast(title, message, 'success', 4000);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showError, showSuccess }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
