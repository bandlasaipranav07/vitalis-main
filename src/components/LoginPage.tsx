import React from 'react';
import { Heart, AlertCircle } from 'lucide-react';
import VitalisLogo from './VitalisLogo';
import { motion } from 'motion/react';
import AuthForm from './AuthForm';
import { Language } from '../types';
import { translations } from '../translations';

interface LoginPageProps {
  onLogin: () => Promise<void>;
  onGuestAccess: () => void;
  isLoggingIn: boolean;
  authError: string | null;
  authMode: 'google' | 'email';
  setAuthMode: (mode: 'google' | 'email') => void;
  language: Language;
}

export default function LoginPage({ 
  onLogin, 
  onGuestAccess, 
  isLoggingIn, 
  authError, 
  authMode, 
  setAuthMode,
  language
}: LoginPageProps) {
  const t = { ...translations.en, ...(translations[language] || {}) };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-brand-500/10 border border-brand-100 p-10 text-center space-y-8"
      >
        <div className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-brand-500/30 mx-auto">
          <VitalisLogo size={44} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-slate-900">Vitalis</h1>
          <p className="text-slate-500">{t.aiHealthCompanion}</p>
        </div>

        <div className="space-y-6">
          {authMode === 'google' ? (
            <div className="space-y-6">
              {authError && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm text-left">
                  <AlertCircle size={18} className="shrink-0" />
                  <div className="space-y-1">
                    <p className="font-bold">Sign-in Issue</p>
                    <p className="opacity-90">{authError}</p>
                  </div>
                </div>
              )}

              <button 
                id="login-google-btn"
                onClick={onLogin}
                disabled={isLoggingIn}
                className={`w-full py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 transition-all flex items-center justify-center gap-3 shadow-sm ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : 'hover:border-brand-500 hover:bg-brand-50'}`}
              >
                {isLoggingIn ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-brand-600"></div>
                ) : (
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
                )}
                {isLoggingIn ? '...' : (t.signIn + " with Google")}
              </button>

              <button 
                id="login-email-switch-btn"
                onClick={() => setAuthMode('email')}
                className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all font-sans"
              >
                {t.signIn} with Email
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <AuthForm onSuccess={() => {}} />
              
              <button 
                onClick={() => setAuthMode('google')}
                className="w-full py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:border-brand-500 hover:bg-brand-50 transition-all flex items-center justify-center gap-3"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
                {t.signIn} with Google
              </button>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Or</span></div>
          </div>

          <button 
            id="login-guest-btn"
            onClick={onGuestAccess}
            className="w-full py-4 bg-white border-2 border-brand-100 text-brand-600 rounded-2xl font-bold hover:bg-brand-50 transition-all"
          >
            {t.continueAsGuest}
          </button>
        </div>

        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
          By continuing, you agree to our terms of service and privacy policy.
        </p>
      </motion.div>
    </div>
  );
}
