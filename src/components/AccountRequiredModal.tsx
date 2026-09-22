import React from 'react';
import { CREATORS_COLLAB_HERO_IMAGE } from '../data/assets';
import { X, Sparkles, UserPlus, LogIn, Heart, MessageSquare, Flame } from 'lucide-react';

interface AccountRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  isDarkMode: boolean;
  actionType?: 'follow' | 'comment' | 'chat' | 'general';
  targetName?: string;
}

export const AccountRequiredModal: React.FC<AccountRequiredModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  isDarkMode,
  actionType = 'general',
  targetName,
}) => {
  if (!isOpen) return null;

  const actionTitle = {
    follow: targetName ? `Follow ${targetName}` : 'Follow Creators & Fans',
    comment: 'Join the Discussion',
    chat: targetName ? `Chat with ${targetName}` : 'Live Chat with Creators & Fans',
    general: 'Join Creator Meet Community',
  }[actionType];

  const actionDescription = {
    follow: 'Create an account to follow inspiring creators and fans, receive real-time updates, and build your collaboration network.',
    comment: 'Have something to say? Create an account to leave comments, provide creative feedback, and participate in community threads.',
    chat: 'Want to collaborate? Sign up to send direct messages, discuss co-hosting ideas, and plan real creative projects together.',
    general: 'Connect, chat, follow, and collaborate with verified creators and active fans worldwide.',
  }[actionType];

  return (
    <div
      id="account-required-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="account-required-modal-card"
        className={`relative w-full max-w-lg rounded-3xl overflow-hidden border shadow-2xl transition-all my-auto ${
          isDarkMode
            ? 'bg-[#0A0F29] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          id="close-account-required-modal"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition cursor-pointer z-30"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Top Visual Image: The Creators Collaborating Graphic */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={CREATORS_COLLAB_HERO_IMAGE}
            alt="Real creators collaborating together"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F29] via-transparent to-black/30 pointer-events-none" />

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
              <Sparkles size={12} className="text-[#00D2FF]" />
              <span>Members-Only Feature</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/80 backdrop-blur-md text-white text-[11px] font-bold">
              <Flame size={12} />
              <span>10K+ Creators</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 text-center">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2">
            {actionTitle}
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
            {actionDescription}
          </p>

          {/* Interactive Feature Perks */}
          <div className="grid grid-cols-3 gap-2 py-3 px-2 mb-6 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <div className="flex flex-col items-center gap-1">
              <Heart size={16} className="text-[#FF2E93]" />
              <span className="font-semibold text-[11px]">Follow</span>
              <span className="text-[10px] text-slate-400">Creators & Fans</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <MessageSquare size={16} className="text-[#00D2FF]" />
              <span className="font-semibold text-[11px]">Comment</span>
              <span className="text-[10px] text-slate-400">Share Feedback</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Sparkles size={16} className="text-amber-400" />
              <span className="font-semibold text-[11px]">Direct Chat</span>
              <span className="text-[10px] text-slate-400">Co-Productions</span>
            </div>
          </div>

          {/* Small, attractive CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              id="account-required-signup-btn"
              onClick={() => {
                onClose();
                onOpenAuth('signup');
              }}
              className="gradient-btn-primary px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF1E82]/30 cursor-pointer min-h-[36px]"
            >
              <UserPlus size={14} />
              <span>Create Free Account</span>
            </button>

            <button
              id="account-required-login-btn"
              onClick={() => {
                onClose();
                onOpenAuth('login');
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all cursor-pointer min-h-[36px] flex items-center gap-1.5 ${
                isDarkMode
                  ? 'border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 hover:bg-white/5'
                  : 'border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LogIn size={14} />
              <span>Log In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
