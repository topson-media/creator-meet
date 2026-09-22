import React, { useState } from 'react';
import { Logo } from './Logo';
import { AuthForm } from './AuthForm';
import { CREATORS_COLLAB_HERO_IMAGE } from '../data/assets';
import { Sun, Moon } from 'lucide-react';

interface WelcomeAuthScreenProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onAuthSuccess: () => void;
  initialMode?: 'login' | 'signup';
}

export const WelcomeAuthScreen: React.FC<WelcomeAuthScreenProps> = ({
  isDarkMode,
  onToggleTheme,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);

  return (
    <div
      id="welcome-auth-screen"
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? 'bg-[#060919] text-white' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top Header Bar */}
      <header
        className={`w-full px-6 py-4 flex items-center justify-between border-b ${
          isDarkMode ? 'border-white/10 bg-[#070B19]/70' : 'border-slate-200/80 bg-white/80'
        } backdrop-blur-md sticky top-0 z-30`}
      >
        <Logo isDark={isDarkMode} size="md" />

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            id="welcome-theme-toggle"
            onClick={onToggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main 2-Column Split: Small Happy Creators Image on the LEFT (no words), Auth Form on the RIGHT */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
        {/* Left Column: Small Clean Happy Creators Image (No words, small, placed on the left) */}
        <div className="w-full sm:w-auto max-w-[280px] sm:max-w-[320px] lg:max-w-[350px] flex-shrink-0 flex justify-center">
          <div
            className={`w-full rounded-2xl sm:rounded-3xl overflow-hidden border shadow-xl transition-all ${
              isDarkMode
                ? 'border-white/10 bg-slate-900/60 shadow-black/40'
                : 'border-slate-200 bg-white shadow-slate-200/80'
            }`}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
              <img
                src={CREATORS_COLLAB_HERO_IMAGE}
                alt="Creators collaborating happily"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Login / Create Account Form */}
        <div className="w-full max-w-md lg:max-w-lg">
          <div
            className={`rounded-3xl p-5 sm:p-7 border shadow-xl transition-all ${
              isDarkMode
                ? 'bg-[#090E26]/90 border-white/10 shadow-black/40'
                : 'bg-white border-slate-200/90 shadow-slate-200/60'
            }`}
          >
            <AuthForm
              mode={authMode}
              onSwitchMode={(mode) => setAuthMode(mode)}
              onSuccess={onAuthSuccess}
              isDarkMode={isDarkMode}
              isModal={false}
            />
          </div>
        </div>
      </div>

      {/* Clean Footer */}
      <footer
        className={`w-full py-4 text-center text-xs border-t ${
          isDarkMode ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-500'
        }`}
      >
        © {new Date().getFullYear()} Creator Meet. All rights reserved.
      </footer>
    </div>
  );
};
