import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { WhySection } from '../components/WhySection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { PageRoute } from '../types';
import { Sparkles, Users, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

interface HomePageProps {
  isDarkMode: boolean;
  onNavigate: (page: PageRoute) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenCollabModal?: () => void;
  onOpenCreatorProfile?: (handle: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  isDarkMode,
  onNavigate,
  onOpenAuth,
  onOpenCollabModal,
  onOpenCreatorProfile,
}) => {
  return (
    <main id="home-page-container" className="flex flex-col">
      {/* 1. Hero Section matching mockup with interactive phone & floating cards */}
      <HeroSection
        isDarkMode={isDarkMode}
        onNavigate={onNavigate}
        onOpenAuth={onOpenAuth}
        onOpenCollabModal={onOpenCollabModal}
        onOpenCreatorProfile={onOpenCreatorProfile}
      />

      {/* 2. Why Creator Meet ("More Than a Social Network") matching mockup */}
      <WhySection isDarkMode={isDarkMode} onNavigate={onNavigate} />

      {/* 3. Simple Steps ("How Creator Meet Works") matching mockup */}
      <HowItWorksSection
        isDarkMode={isDarkMode}
        onOpenAuth={onOpenAuth}
        onNavigate={onNavigate}
      />

      {/* 4. Creator Callout Banner */}
      <section
        id="community-banner"
        className={`py-10 border-t transition-colors ${
          isDarkMode ? 'bg-[#050817] border-white/10' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/15 to-purple-500/15 border border-pink-500/30 text-pink-400 text-[11px] font-bold mb-3">
            <Sparkles size={12} />
            <span>The Collaboration Network for Creators & Fans</span>
          </div>
          <h3
            className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Ready to find your next creative partner?
          </h3>
          <p
            className={`mt-1.5 text-xs sm:text-sm max-w-lg mx-auto ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Whether you need a video editor, co-host, music producer, or want to connect with
            passionate fans, Creator Meet is your home.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <button
              onClick={() => onOpenAuth('signup')}
              className="gradient-btn-primary px-4 py-2 text-xs font-semibold text-white rounded-full flex items-center gap-1.5 shadow-xs cursor-pointer min-h-[34px]"
            >
              <span>Get Started Free</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => onNavigate('discover')}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition cursor-pointer min-h-[34px] ${
                isDarkMode
                  ? 'border-slate-700 text-slate-200 hover:text-white hover:bg-white/5'
                  : 'border-slate-300 text-slate-700 hover:bg-white shadow-xs'
              }`}
            >
              Browse Directory
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
