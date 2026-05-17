import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { loginWithEmail, registerWithEmail, resetPassword } from '../firebase';
import { useToast } from '../contexts/ToastContext';

interface AuthFormProps {
  onSuccess: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const { showError, showSuccess } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (isReset) {
        await resetPassword(email);
        setMessage("Password reset email sent! Please check your inbox.");
        showSuccess("Email Sent", "Check your inbox for a password reset link.");
        setIsReset(false);
      } else if (isLogin) {
        await loginWithEmail(email, password);
        showSuccess("Welcome Back", "Signed in successfully.");
        onSuccess();
      } else {
        if (!name.trim()) throw new Error("Please enter your name.");
        await registerWithEmail(email, password, name);
        showSuccess("Registration Successful", "Welcome to Vitalis!");
        onSuccess();
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let errorMsg = err.message || "An unexpected error occurred.";
      
      if (err.code === 'auth/user-not-found') errorMsg = "No account found with this email.";
      else if (err.code === 'auth/wrong-password') errorMsg = "Incorrect password.";
      else if (err.code === 'auth/email-already-in-use') errorMsg = "An account already exists with this email.";
      else if (err.code === 'auth/weak-password') errorMsg = "Password should be at least 6 characters.";
      else if (err.code === 'auth/invalid-email') errorMsg = "Invalid email address.";
      else if (err.code === 'auth/operation-not-allowed') errorMsg = "Email/Password sign-in is currently disabled. Please click 'Continue as Guest' below.";
      
      setError(errorMsg);
      showError("Authentication Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (isReset) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </div>
        )}
        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <button 
          type="button"
          onClick={() => setIsReset(false)}
          className="w-full text-center text-xs font-bold text-slate-400 hover:text-brand-600 transition-colors"
        >
          Back to Login
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {!isLogin && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
          {isLogin && (
            <button 
              type="button"
              onClick={() => setIsReset(true)}
              className="text-[10px] font-bold text-brand-600 hover:underline"
            >
              Forgot?
            </button>
          )}
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs flex items-center gap-2">
          <ArrowRight size={14} className="shrink-0" />
          {message}
        </div>
      )}

      <button 
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
      </button>

      <div className="pt-2 text-center">
        <button 
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
        </button>
      </div>
    </form>
  );
}
