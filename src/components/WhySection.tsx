import React from 'react';
import { Users, Heart, Link2, ArrowRight, Video, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';

interface WhySectionProps {
  isDarkMode: boolean;
  onNavigate: (page: PageRoute) => void;
}

export const WhySection: React.FC<WhySectionProps> = ({ isDarkMode, onNavigate }) => {
  return (
    <section
      id="why-creator-meet-section"
      className={`py-12 lg:py-16 border-t transition-colors ${
        isDarkMode ? 'bg-[#060919] border-white/10' : 'bg-slate-50 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div
            id="why-pill-badge"
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3 ${
              isDarkMode
                ? 'bg-[#151D4A] text-indigo-300 border border-indigo-500/30'
                : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}
          >
            <Sparkles size={11} className="text-[#00D2FF]" />
            <span>Why Creator Meet?</span>
          </div>

          <h2
            id="why-main-heading"
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            More Than a Social Network
          </h2>

          <p
            id="why-subtext"
            className={`mt-2.5 text-xs sm:text-sm leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            A dedicated ecosystem where creators find creative partners, fans discover inspiring
            talent, and everyone connects without algorithmic clutter.
          </p>
        </div>

        {/* Clear, Uncluttered 3-Pillar Row without heavy box cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-y border-white/10">
          {/* Pillar 1: Creators */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-[#00D2FF]">
                <Users size={16} />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Growing Community
                </h3>
                <span className="text-[11px] font-semibold text-[#00D2FF]">Creators</span>
              </div>
            </div>
            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Over 25,000+ verified creators collaborating on podcasts, videos, and multi-platform growth.
            </p>
          </div>

          {/* Pillar 2: Fans */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-[#FF2E93]">
                <Heart size={16} />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Creators & Fans
                </h3>
                <span className="text-[11px] font-semibold text-[#FF2E93]">Fans</span>
              </div>
            </div>
            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Direct creator access, project screenings, and exclusive fan club community interaction.
            </p>
          </div>

          {/* Pillar 3: Connections */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[#FFAE33]">
                <Link2 size={16} />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Real Connections
                </h3>
                <span className="text-[11px] font-semibold text-[#FFAE33]">Collaborations</span>
              </div>
            </div>
            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Direct messaging, verified collaboration listings, and real creative partnerships worldwide.
            </p>
          </div>
        </div>

        {/* Clear 2-Column Split: For Creators & For Fans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
          {/* Column 1: For Creators */}
          <div className="flex flex-col justify-between">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80"
                alt="Creator smiling in neon studio"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7928CA] text-white text-[11px] font-bold">
                <Video size={12} />
                <span>CONTENT CREATOR</span>
              </div>
            </div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              For Creators
            </h3>
            <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Find video editors, co-hosts, music producers, and sponsorship partners in one unified space.
            </p>
            <div className="mt-3">
              <button
                id="creators-learn-more-btn"
                onClick={() => onNavigate('creators')}
                className="gradient-btn-primary px-4 py-1.5 text-xs font-semibold text-white rounded-full inline-flex items-center gap-1.5 shadow-sm cursor-pointer min-h-[32px]"
              >
                <span>Explore Creators</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Column 2: For Fans */}
          <div className="flex flex-col justify-between">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                alt="Fan happy with smartphone"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF2E93] text-white text-[11px] font-bold">
                <Heart size={12} fill="currentColor" />
                <span>FAN</span>
              </div>
            </div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              For Fans
            </h3>
            <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Discover creators, follow your favorites, participate in Q&As, and unlock behind-the-scenes content.
            </p>
            <div className="mt-3">
              <button
                id="fans-learn-more-btn"
                onClick={() => onNavigate('fans')}
                className="gradient-btn-primary px-4 py-1.5 text-xs font-semibold text-white rounded-full inline-flex items-center gap-1.5 shadow-sm cursor-pointer min-h-[32px]"
              >
                <span>Join Community</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
