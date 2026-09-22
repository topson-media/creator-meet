import React from 'react';
import { AuthForm } from '../components/AuthForm';
import { PageRoute } from '../types';
import { ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onSwitchMode: (mode: 'login' | 'signup') => void;
  onNavigate: (page: PageRoute) => void;
  isDarkMode: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  mode,
  onSwitchMode,
  onNavigate,
  isDarkMode,
}) => {
  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-br from-indigo-900/25 via-pink-900/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Back button */}
      <div className="w-full max-w-md mb-4 flex justify-start">
        <button
          id="auth-back-to-home"
          onClick={() => onNavigate('home')}
          className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
            isDarkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Card container */}
      <div
        id="auth-page-card"
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl backdrop-blur-xl transition-all ${
          isDarkMode
            ? 'bg-[#0A0F29]/95 border-white/15 text-white shadow-indigo-950/40'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-200/80'
        }`}
      >
        <AuthForm
          mode={mode}
          onSwitchMode={onSwitchMode}
          onSuccess={() => onNavigate('home')}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};
