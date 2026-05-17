import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let details = "";

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error) {
            errorMessage = "Database Access Denied";
            details = `Operation: ${parsed.operationType} on ${parsed.path}. Please check your permissions.`;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-50 p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-brand-500/10 border border-brand-100 p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-display font-bold text-slate-900">{errorMessage}</h1>
              <p className="text-sm text-slate-500">{details || "The application encountered a problem and cannot continue."}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
            >
              <RefreshCw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
