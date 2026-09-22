import React from 'react';
import { UserPlus, Search, MessageCircle, Rocket, ArrowRight } from 'lucide-react';
import { PageRoute } from '../types';

interface HowItWorksSectionProps {
  isDarkMode: boolean;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onNavigate: (page: PageRoute) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  isDarkMode,
  onOpenAuth,
  onNavigate,
}) => {
  const steps = [
    {
      stepNumber: '01',
      icon: UserPlus,
      color: 'text-[#00D2FF]',
      title: 'Create Your Profile',
      description: 'Choose your role as a Content Creator or Fan and configure your avatar and cover image.',
      action: () => onOpenAuth('signup'),
      actionLabel: 'Sign up',
    },
    {
      stepNumber: '02',
      icon: Search,
      color: 'text-[#A855F7]',
      title: 'Discover People',
      description: 'Find creators and fans by category, audience size, niche, and preferred collaboration type.',
      action: () => onNavigate('discover'),
      actionLabel: 'Explore',
    },
    {
      stepNumber: '03',
      icon: MessageCircle,
      color: 'text-[#FF2E93]',
      title: 'Connect & Chat',
      description: 'Follow accounts, comment on featured content, and exchange direct messages with creators.',
      action: () => onNavigate('fans'),
      actionLabel: 'Community',
    },
    {
      stepNumber: '04',
      icon: Rocket,
      color: 'text-[#FFAE33]',
      title: 'Collaborate & Grow',
      description: 'Co-produce podcasts, videos, and multi-channel creative ventures together.',
      action: () => onNavigate('creators'),
      actionLabel: 'Collabs',
    },
  ];

  return (
    <section
      id="how-it-works-section"
      className={`py-12 lg:py-16 border-t transition-colors ${
        isDarkMode ? 'bg-[#070B19] border-white/10' : 'bg-white border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div
            id="steps-pill-badge"
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3 ${
              isDarkMode
                ? 'bg-[#191538] text-purple-300 border border-purple-500/30'
                : 'bg-purple-100 text-purple-700 border border-purple-200'
            }`}
          >
            <span>Simple Steps</span>
          </div>

          <h2
            id="steps-main-heading"
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            How Creator Meet Works
          </h2>

          <p
            id="steps-subtext"
            className={`mt-2 text-xs sm:text-sm leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Get started in minutes and connect with creators and fans across the world.
          </p>
        </div>

        {/* Clear Step Columns (No heavy nested box cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.stepNumber}
                id={`step-item-${item.stepNumber}`}
                className={`pt-4 sm:pt-0 ${index > 0 ? 'sm:pl-6' : ''} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon size={16} className={item.color} />
                    </div>
                    <span className={`font-mono text-xs font-bold ${item.color}`}>
                      {item.stepNumber}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`mt-1.5 text-xs leading-relaxed ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-2">
                  <button
                    onClick={item.action}
                    className="gradient-btn-primary px-3 py-1 text-[11px] font-semibold text-white rounded-full inline-flex items-center gap-1 shadow-xs cursor-pointer min-h-[28px]"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
