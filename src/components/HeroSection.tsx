import React from 'react';
import { HeroCollabGraphic } from './HeroCollabGraphic';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { PageRoute } from '../types';

interface HeroSectionProps {
  isDarkMode: boolean;
  onNavigate: (page: PageRoute) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenCollabModal?: () => void;
  onOpenCreatorProfile?: (handle: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isDarkMode,
  onNavigate,
  onOpenAuth,
}) => {
  return (
    <section
      id="hero-section"
      className="relative overflow-hidden pt-4 sm:pt-8 pb-12 lg:pb-16 transition-colors"
    >
      {/* Dynamic Cosmic Background Gradients */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[450px] h-[450px] bg-gradient-to-br from-indigo-900/25 via-purple-900/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-0 w-[420px] h-[420px] bg-gradient-to-bl from-[#FF1E82]/15 via-rose-900/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Hero Text Content */}
          <div className="lg:col-span-6 xl:col-span-6 text-left z-10">
            {/* Pill Tag: THE SOCIAL NETWORK FOR CREATORS */}
            <div
              id="hero-pill-badge"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-4 ${
                isDarkMode
                  ? 'bg-[#12193E] text-indigo-300 border border-indigo-500/30 shadow-xs shadow-indigo-900/50'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}
            >
              <Sparkles size={12} className="text-[#00D2FF]" />
              <span>The Social Network for Creators</span>
            </div>

            {/* Display Heading matching refined proportions */}
            <h1
              id="hero-main-heading"
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.18] ${
                isDarkMode ? 'text-white' : 'text-slate-950'
              }`}
            >
              Meet Creators.
              <br />
              Build Connections.
              <br />
              <span className="text-[#00C2FF]">Grow </span>
              <span className="text-[#FFAE33]">Together.</span>
            </h1>

            {/* Subtitle description */}
            <p
              id="hero-subtext"
              className={`mt-3.5 text-xs sm:text-sm leading-relaxed max-w-lg font-normal ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Creator Meet helps creators and fans discover each other, share content, start
              conversations, and build meaningful collaborations across platforms.
            </p>

            {/* CTA Buttons Row - Attractive and Small */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {/* Primary "Join Creator Meet ->" button */}
              <button
                id="hero-cta-join-creator-meet"
                onClick={() => onOpenAuth('signup')}
                className="gradient-btn-primary px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white rounded-full flex items-center gap-2 shadow-md shadow-[#FF1E82]/30 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer min-h-[38px]"
              >
                <span>Join Creator Meet</span>
                <ArrowRight size={15} />
              </button>

              {/* Secondary "Discover Creators" button */}
              <button
                id="hero-cta-discover-creators"
                onClick={() => onNavigate('discover')}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full border transition-all duration-200 flex items-center gap-1.5 cursor-pointer min-h-[38px] ${
                  isDarkMode
                    ? 'border-slate-700 text-white bg-[#0A0F2B]/70 hover:bg-[#121A47] hover:border-slate-500'
                    : 'border-slate-300 text-slate-800 bg-white hover:bg-slate-100 hover:border-slate-400 shadow-xs'
                }`}
              >
                <Compass size={15} className="text-[#00C2FF]" />
                <span>Discover Creators</span>
              </button>
            </div>

            {/* Feature bullets matching mockup */}
            <div
              id="hero-feature-bullets"
              className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium text-slate-400"
            >
              <span className="hover:text-white transition cursor-default">Connect</span>
              <span className="text-slate-600">•</span>
              <span className="hover:text-white transition cursor-default">Share</span>
              <span className="text-slate-600">•</span>
              <span className="hover:text-white transition cursor-default">Collaborate</span>
              <span className="text-slate-600">•</span>
              <span className="hover:text-white transition cursor-default">Discover</span>
            </div>
          </div>

          {/* Right Column: Dynamic Visual Showcase of Diverse Creators Collaborating */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center items-center">
            <HeroCollabGraphic isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </section>
  );
};
