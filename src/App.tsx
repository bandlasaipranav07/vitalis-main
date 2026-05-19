import React, { useState, useEffect, useRef } from 'react';
import { Heart, Menu, Bell, Search, User, Activity, Brain, ShieldAlert, Pill, Stethoscope, Info, LogOut, AlertCircle, LayoutDashboard, Scale, Languages, Crown, ChevronRight } from 'lucide-react';
import VitalisLogo from './components/VitalisLogo';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import EmergencyGuides from './components/EmergencyGuides';
import SymptomChecker from './components/SymptomChecker';
import MedicationSection from './components/MedicationSection';
import GeneralHealth from './components/GeneralHealth';
import Dashboard from './components/Dashboard';
import LegalResources from './components/LegalResources';
import TrustPrivacyDashboard from './components/TrustPrivacyDashboard';
import PremiumUpgrade from './components/PremiumUpgrade';
import HelpSection from './components/HelpSection';
import MedicalHistory from './components/MedicalHistory';
import LoginPage from './components/LoginPage';
import { translations } from './translations';
import { View, Language, SUPPORTED_LANGUAGES, UserTier } from './types';
import { auth, signInWithGoogle, logout, onAuthStateChanged, User as FirebaseUser, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './utils/firestore-errors';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider, useToast } from './contexts/ToastContext';

function AppContent() {
  const { showError, showToast } = useToast();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [userTier, setUserTier] = useState<UserTier>(() => {
    const saved = localStorage.getItem('vitalis_tier');
    return (saved as UserTier) || 'free';
  });
  const [prefilledMessage, setPrefilledMessage] = useState<string | undefined>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('vitalis_lang');
    return (saved as Language) || 'en';
  });
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const t = { ...translations.en, ...(translations[selectedLanguage] || {}) };

  useEffect(() => {
    localStorage.setItem('vitalis_lang', selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    localStorage.setItem('vitalis_tier', userTier);
  }, [userTier]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'google' | 'email'>('google');
  const [isGuest, setIsGuest] = useState(false);

  const GUEST_USER: FirebaseUser = {
    uid: 'guest-user',
    displayName: 'Guest User',
    email: 'guest@vitalis.ai',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vitalis',
    emailVerified: true,
    isAnonymous: true,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => '',
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    providerId: 'firebase'
  } as any;

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    
    // Safety timeout for loading state
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn("Auth initialization taking longer than expected...");
        setLoading(false);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? `User ${user.uid}` : "No user");
      setUser(user);
      clearTimeout(loadingTimeout);
      
      // Cleanup previous profile listener if it exists
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = undefined;
      }

      if (user) {
        // Listen to user profile for Health ID
        const userRef = doc(db, 'users', user.uid);
        unsubProfile = onSnapshot(
          userRef, 
          (doc) => {
            if (doc.exists()) {
              setUserProfile(doc.data());
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'users/' + (user?.uid || 'unknown'));
          }
        );
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Global error handlers to catch stray issues
    const handleError = (event: ErrorEvent) => {
      console.error("Global Error:", event.error);
      showError("App Error", "An unexpected error occurred. We're looking into it.");
    };
    const handleRejection = (event: PromiseRejectionEvent) => {
      // Prevent the browser from logging the rejection to the console again
      event.preventDefault();
      
      const error = event.reason;
      console.error("Caught Unhandled Rejection:", error);
      
      // Known ignorable rejections
      const errorMsg = error?.message || (typeof error === 'string' ? error : "");
      if (!errorMsg || errorMsg.includes("user-cancelled") || errorMsg.includes("request-cancelled")) {
        return;
      }
      
      let reason = "A background process encountered an issue. Your session is safe.";
      let title = "System Update";
      
      if (error) {
        if (typeof error === 'string') {
          reason = error;
        } else if (error instanceof Error) {
          reason = error.message;
        } else if (typeof error === 'object' && error.message) {
          reason = error.message;
        } else if (typeof error === 'object') {
          try { 
            const str = JSON.stringify(error);
            if (str !== '{}') reason = str;
          } catch (e) {}
        }
      }

      // Special handling for our custom Firestore error JSON
      if (reason.startsWith('{') && reason.includes('operationType')) {
        try {
          const parsed = JSON.parse(reason);
          title = "Data Access Alert";
          reason = `Privacy restriction: Unable to perform ${parsed.operationType} on ${parsed.path}.`;
        } catch (e) {}
      }
      
      // Categorize and show toast only if meaningful
      if (reason.includes("Failed to fetch") || reason.includes("NetworkError") || reason.includes("aborted")) {
        showError("Connectivity", "Vitalis has intermittent connection issues. Check your signal.");
      } else if (reason.includes("Gemini") || reason.includes("AI") || reason.includes("Model")) {
        showError("AI System Busy", "The clinical AI core is momentarily under heavy load. Please retry your last request.");
      } else if (reason.includes("permission-denied") || reason.includes("insufficient permissions")) {
        showError("Policy Alert", "A request was blocked by privacy protocols. Please re-authenticate if this persists.");
      } else {
        // If it's a generic internal thing, maybe just log it instead of annoying the user with a toast
        // unless it's clearly an Error object from our code
        if (error instanceof Error || reason.length > 20) {
          showError(title, reason);
        }
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const currentUser = user || (isGuest ? GUEST_USER : null);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    
    setAuthError(null);
    setIsLoggingIn(true);
    
    try {
      await signInWithGoogle();
      showToast("Signed In", "Welcome to Vitalis!", "success", 3000);
    } catch (error: any) {
      console.error("Login error code:", error.code);
      console.error("Login error message:", error.message);
      
      if (error.code === 'auth/popup-blocked') {
        setAuthError("Pop-up blocked! Please allow pop-ups for this site in your browser settings to sign in.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        setAuthError("A sign-in request is already in progress. Please wait or refresh the page.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        setAuthError("Sign-in window was closed before completion. Please try again.");
      } else if (error.code === 'auth/unauthorized-domain') {
        setAuthError("This domain is not authorized for sign-in. Please add '" + window.location.hostname + "' to the authorized domains in your Firebase Console.");
      } else {
        setAuthError(error.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleNavigate = (view: View, message?: string) => {
    setCurrentView(view);
    setPrefilledMessage(message);
  };

  const handleLogout = async () => {
    try {
      if (isGuest) {
        setIsGuest(false);
      } else {
        await logout();
      }
      setCurrentView('assistant');
    } catch (error: any) {
      console.error("Logout failed:", error);
      showError("Logout Error", "Something went wrong while signing you out. Please try again.");
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={currentUser} userTier={userTier} onNavigate={handleNavigate} language={selectedLanguage} />;
      case 'assistant':
        return <ChatWindow initialMessage={prefilledMessage} language={selectedLanguage} />;
      case 'symptom-checker':
        return <SymptomChecker userTier={userTier} onConsultAI={(msg) => handleNavigate('assistant', msg)} onNavigate={handleNavigate} language={selectedLanguage} />;
      case 'medication':
        return <MedicationSection userTier={userTier} onConsultAI={(msg) => handleNavigate('assistant', msg)} onNavigate={handleNavigate} />;
      case 'emergency':
        return <EmergencyGuides />;
      case 'general-health':
        return <GeneralHealth />;
      case 'legal-resources':
        return <LegalResources />;
      case 'trust-privacy':
        return <TrustPrivacyDashboard />;
      case 'help':
        return <HelpSection />;
      case 'medical-history':
        return <MedicalHistory />;
      case 'premium-upgrade':
        return (
          <PremiumUpgrade 
            currentTier={userTier} 
            onUpgrade={() => setUserTier('premium')} 
            onDowngrade={() => setUserTier('free')} 
          />
        );
      default:
        return <ChatWindow initialMessage={prefilledMessage} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginPage 
        onLogin={handleLogin}
        onGuestAccess={() => setIsGuest(true)}
        isLoggingIn={isLoggingIn}
        authError={authError}
        authMode={authMode}
        setAuthMode={setAuthMode}
        language={selectedLanguage}
      />
    );
  }

  // Authenticated/Guest View
  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      {/* Navigation */}
      <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-brand-100 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4 sm:gap-10">
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-brand-600 transition-colors"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavigate('dashboard')}>
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <VitalisLogo size={22} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 hidden sm:inline">Vitalis</span>
          </div>
          
          <div className="hidden xl:flex items-center gap-8">
            <button 
              onClick={() => handleNavigate('dashboard')}
              className={`text-sm font-semibold transition-colors ${currentView === 'dashboard' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {t.dashboard}
            </button>
            <button 
              onClick={() => handleNavigate('assistant')}
              className={`text-sm font-semibold transition-colors ${currentView === 'assistant' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {t.assistant}
            </button>
            <button 
              onClick={() => handleNavigate('symptom-checker')}
              className={`text-sm font-semibold transition-colors ${currentView === 'symptom-checker' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {t.symptomChecker}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-5">
          <button 
            onClick={() => handleNavigate('emergency')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border ${currentView === 'emergency' ? 'bg-rose-600 text-white border-rose-600' : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'}`}
          >
            <ShieldAlert size={14} />
            <span className="hidden xs:inline">Emergency</span>
            <span className="xs:hidden">SOS</span>
          </button>

          <div className="hidden sm:block h-4 w-px bg-slate-200 mx-1" />

          {/* Global Language Selector */}
          <div className="relative" ref={languageMenuRef}>
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className={cn(
                "p-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border",
                showLanguageMenu 
                  ? "bg-brand-600 text-white border-brand-600" 
                  : "bg-white text-slate-400 border-slate-100 hover:border-brand-200 hover:text-brand-600"
              )}
            >
              <Languages size={16} />
              <span className="hidden md:inline">
                {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.native}
              </span>
            </button>

            <AnimatePresence>
              {showLanguageMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-brand-100 overflow-hidden z-[100]"
                >
                  <div className="p-2 grid grid-cols-1 gap-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          setShowLanguageMenu(false);
                        }}
                        className={cn(
                          "px-4 py-2 text-left rounded-xl transition-all flex flex-col",
                          selectedLanguage === lang.code 
                            ? "bg-brand-600 text-white" 
                            : "text-slate-600 hover:bg-brand-50"
                        )}
                      >
                        <span className="text-xs font-bold">{lang.native}</span>
                        <span className={cn(
                          "text-[8px] uppercase tracking-wider",
                          selectedLanguage === lang.code ? "text-brand-100" : "text-slate-400"
                        )}>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-200 mx-1" />
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden xs:flex items-center gap-3 p-1 pl-3 rounded-full bg-white border border-brand-100 shadow-sm">
              <div className="hidden md:flex flex-col items-end mr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-700 leading-tight">
                    {currentUser.uid === 'guest-user' ? t.guestUser : currentUser.displayName}
                  </span>
                  {userTier === 'premium' && <Crown size={10} className="text-amber-500" fill="currentColor" />}
                </div>
                {userProfile?.healthId && (
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-brand-500" />
                    <span className="text-[8px] font-mono font-bold text-brand-600 leading-tight tracking-tighter">{userProfile.healthId}</span>
                  </div>
                )}
              </div>
              <img src={currentUser.photoURL || ''} alt={currentUser.displayName || ''} className="w-8 h-8 rounded-full border border-white shadow-sm" referrerPolicy="no-referrer" />
            </div>
            
            <button 
              onClick={() => handleNavigate('premium-upgrade')}
              className={cn(
                "p-2 rounded-xl transition-all border shadow-sm",
                userTier === 'premium' 
                  ? "bg-amber-50 border-amber-100 text-amber-600" 
                  : "bg-white border-slate-100 text-slate-400 hover:text-brand-600"
              )}
              title="Upgrade to Premium"
            >
              <Crown size={18} fill={userTier === 'premium' ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors bg-white border border-slate-100 rounded-xl shadow-sm"
              title={t.logout}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-[70] shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                    <VitalisLogo size={18} />
                  </div>
                  <span className="font-display font-bold text-lg tracking-tight text-slate-900">Vitalis</span>
                </div>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <ChevronRight className="rotate-180" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <Sidebar 
                  onNavigate={(view, msg) => {
                    handleNavigate(view, msg);
                    setShowMobileMenu(false);
                  }} 
                  currentView={currentView} 
                  language={selectedLanguage} 
                />
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <img src={currentUser.photoURL || ''} alt="" className="w-10 h-10 rounded-full border border-slate-100" referrerPolicy="no-referrer" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{currentUser.displayName || 'User'}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{userTier} Tier</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-rose-100 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 gap-8 overflow-hidden">
        {/* Left Sidebar - Desktop only */}
        <div className="hidden lg:block shrink-0">
          <Sidebar onNavigate={handleNavigate} currentView={currentView} language={selectedLanguage} />
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {renderView()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden h-20 bg-white border-t border-slate-200 flex items-center justify-around px-2 pb-safe">
        <button onClick={() => handleNavigate('dashboard')} className={`flex flex-col items-center gap-1.5 p-2 transition-all ${currentView === 'dashboard' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <div className={cn("p-2 rounded-xl transition-all", currentView === 'dashboard' && "bg-brand-50")}>
            <LayoutDashboard size={22} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">{t.dashboard}</span>
        </button>
        <button onClick={() => handleNavigate('assistant')} className={`flex flex-col items-center gap-1.5 p-2 transition-all ${currentView === 'assistant' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <div className={cn("p-2 rounded-xl transition-all", currentView === 'assistant' && "bg-brand-50")}>
            <Heart size={22} strokeWidth={currentView === 'assistant' ? 2.5 : 2} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">{t.assistant}</span>
        </button>
        <button onClick={() => handleNavigate('symptom-checker')} className={`flex flex-col items-center gap-1.5 p-2 transition-all ${currentView === 'symptom-checker' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <div className={cn("p-2 rounded-xl transition-all", currentView === 'symptom-checker' && "bg-brand-50")}>
            <Stethoscope size={22} strokeWidth={currentView === 'symptom-checker' ? 2.5 : 2} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Check</span>
        </button>
        <button onClick={() => handleNavigate('medication')} className={`flex flex-col items-center gap-1.5 p-2 transition-all ${currentView === 'medication' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <div className={cn("p-2 rounded-xl transition-all", currentView === 'medication' && "bg-brand-50")}>
            <Pill size={22} strokeWidth={currentView === 'medication' ? 2.5 : 2} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Meds</span>
        </button>
        <button onClick={() => setShowMobileMenu(true)} className="flex flex-col items-center gap-1.5 p-2 text-slate-400 hover:text-slate-600">
          <div className="p-2 rounded-xl">
            <Menu size={22} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Menu</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}
