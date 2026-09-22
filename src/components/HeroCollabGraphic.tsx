import React from 'react';
import { CREATORS_COLLAB_HERO_IMAGE } from '../data/assets';
import { ShieldCheck, Sparkles, Video } from 'lucide-react';

interface HeroCollabGraphicProps {
  isDarkMode?: boolean;
}

export const HeroCollabGraphic: React.FC<HeroCollabGraphicProps> = ({ isDarkMode = true }) => {
  return (
    <div
      id="hero-collab-graphic-container"
      className="relative w-full max-w-[580px] mx-auto select-none py-2 sm:py-4"
    >
      {/* 1. Subtle Dark Navy & Purple Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[500px] h-[360px] sm:h-[460px] bg-gradient-to-tr from-indigo-950/70 via-purple-900/35 to-[#00D2FF]/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-6 -right-6 w-48 h-48 bg-[#FF2E93]/20 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute -bottom-6 -left-6 w-52 h-52 bg-[#0080FF]/25 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Main Image Graphic Frame (Without any buttons) */}
      <div
        id="hero-collab-showcase-frame"
        className={`relative rounded-3xl overflow-hidden border shadow-2xl transition-all duration-300 ${
          isDarkMode
            ? 'bg-[#0A0E29]/80 border-white/15 shadow-indigo-950/60 ring-1 ring-white/10'
            : 'bg-white border-slate-200 shadow-slate-200/90'
        }`}
      >
        {/* Top Status Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span>Live Creative Studio</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-[10px] font-medium">
            <Video size={12} className="text-[#00D2FF]" />
            <span>Co-Filming</span>
          </div>
        </div>

        {/* High-quality Real Creators Collaborating Photograph */}
        <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden group">
          <img
            src={CREATORS_COLLAB_HERO_IMAGE}
            alt="Real content creators collaborating energetically in a studio with microphones and camera"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-103"
          />

          {/* Gentle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B1E] via-transparent to-black/20 pointer-events-none" />

          {/* Clean Info Overlay - No clickable buttons */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-2 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-[#FF2E93] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Creator in session"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-[#00D2FF] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Creator in session"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-purple-400 object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Creator in session"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1">
                  <span>Creative Energy</span>
                  <ShieldCheck size={13} className="text-[#00D2FF]" />
                </p>
                <p className="text-[10px] text-slate-300">
                  Real Creator Co-Productions & Collaborations
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-[#00D2FF] flex items-center gap-1">
              <Sparkles size={12} />
              <span>Verified Hub</span>
            </span>
          </div>
        </div>

        {/* Dynamic Graphic Sub-Bar */}
        <div
          className={`px-4 py-3 flex items-center justify-between border-t text-xs ${
            isDarkMode
              ? 'bg-[#070C22] border-white/10 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">10,240+ Active Creators</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1 text-[#00D2FF]">
              <Sparkles size={12} />
              <span>Real Collaboration</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
