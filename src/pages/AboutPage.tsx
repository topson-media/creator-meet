import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { Sparkles, Shield, Heart, Target, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { PageRoute } from '../types';

interface AboutPageProps {
  isDarkMode: boolean;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ isDarkMode, onOpenAuth, onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is Creator Meet free to join for creators and fans?',
      a: 'Yes! Core features including profile creation, browsing creators, pitching collaborations, and participating in fan discussions are 100% free.',
    },
    {
      q: 'How does verification work on Creator Meet?',
      a: 'Creators can link their YouTube, Instagram, TikTok, or Facebook accounts. Once ownership is confirmed, the verified badge is automatically awarded.',
    },
    {
      q: 'How do collaborations work between creators and freelancers?',
      a: 'Creators post what they need on the Collaboration Board (e.g. video editor, podcast guest, 3D artist). Interested members submit pitches directly without middleman fees.',
    },
    {
      q: 'Can fans support creators directly?',
      a: 'Yes, fans can follow, chat, comment, send cheers, and unlock exclusive behind-the-scenes content drops.',
    },
  ];

  return (
    <div id="about-page" className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-2 ${
            isDarkMode
              ? 'bg-[#181A42] text-indigo-300 border border-indigo-500/30'
              : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
          }`}
        >
          <Sparkles size={11} className="text-[#00D2FF]" />
          <span>Our Mission</span>
        </div>
        <h1
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          Connecting Creators & Fans
        </h1>
        <p
          className={`mt-2 text-xs sm:text-sm leading-relaxed ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Creating alone is tough. We believe human connections, genuine feedback, and creative collaboration beat algorithmic isolation every time.
        </p>
      </div>

      {/* Origin Story (Clean presentation without bulky box cards) */}
      <div className="py-6 border-y border-white/10 space-y-3 mb-8">
        <div className="flex items-center gap-3">
          <Logo isDark={isDarkMode} size="sm" />
          <span className="text-xs text-[#00D2FF] font-semibold">
            Meet. Connect. Share. Grow.
          </span>
        </div>
        <p
          className={`text-xs sm:text-sm leading-relaxed ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Traditional social platforms are built to trap audience attention in endless algorithmic feeds, prioritizing ad revenue over genuine relationships. Creator Meet provides a dedicated space where creators discover peers, cross-promote channels, and welcome true fans into their creative circles.
        </p>
      </div>

      {/* Core Principles (Clear 3-column rows) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-[#00D2FF]" />
            <h3 className={`text-xs sm:text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Cross-Platform Unity
            </h3>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            We celebrate every platform. Creators shouldn't have to choose between their YouTube channel and TikTok followers.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-[#FF2E93]" />
            <h3 className={`text-xs sm:text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Zero Gatekeeping
            </h3>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Your content reaches people who actually care. Direct, respectful, and focused on real value.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-purple-400" />
            <h3 className={`text-xs sm:text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Verified & Safe
            </h3>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Anti-bot policies, authentic identity verification, and respectful community rules for all members.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="mb-10">
        <h2
          className={`text-lg sm:text-xl font-bold tracking-tight mb-4 text-center ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          Frequently Asked Questions
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`rounded-xl border transition-all ${
                  isDarkMode ? 'bg-[#0B1130]/60 border-white/10' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 font-semibold text-xs sm:text-sm cursor-pointer"
                >
                  <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{faq.q}</span>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-3 text-xs text-slate-400 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA - Small and Attractive */}
      <div className="text-center py-6 border-t border-white/10">
        <h3 className={`text-sm sm:text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Join Creator Meet today and grow your network.
        </h3>
        <button
          onClick={() => onOpenAuth('signup')}
          className="gradient-btn-primary mt-3 px-4 py-2 text-xs font-semibold text-white rounded-full inline-flex items-center gap-1.5 shadow-xs cursor-pointer min-h-[34px]"
        >
          <span>Get Started Free</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
