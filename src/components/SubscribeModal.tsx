import React, { useState } from 'react';
import { X, Check, Users, Crown, ShieldCheck, Heart, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorProfile: any | null;
  monthlyPrice?: number;
  isDarkMode: boolean;
  onSubscribed?: () => void;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  creatorProfile,
  monthlyPrice = 9.99,
  isDarkMode,
  onSubscribed,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!isOpen) return null;

  const creatorName = creatorProfile?.fullName || creatorProfile?.name || 'Alex Rivera';
  const creatorUsername = (creatorProfile?.username || 'alexcreator').replace(/^@/, '');
  const avatar = creatorProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

  const handleSubscribe = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsProcessing(false);
    setIsSubscribed(true);
    if (onSubscribed) onSubscribed();

    // Increment subscriber count in localStorage
    try {
      const data = localStorage.getItem('creatormeet_monetization_settings');
      if (data) {
        const parsed = JSON.parse(data);
        parsed.subscriberCount = (parsed.subscriberCount || 118) + 1;
        localStorage.setItem('creatormeet_monetization_settings', JSON.stringify(parsed));
      }
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-md rounded-3xl border p-6 shadow-2xl transition-all ${
          isDarkMode ? 'bg-[#080D26] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {isSubscribed ? (
          <div className="text-center py-6 space-y-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
              <Crown size={32} className="text-amber-400 animate-bounce" />
            </div>
            <h3 className="text-xl font-black">You are now Subscribed!</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              You've unlocked exclusive supporter perks, subscriber badge, and private reels for @{creatorUsername}.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full gradient-btn-primary text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Start Enjoying Perks
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header with Creator Info */}
            <div className="text-center space-y-2">
              <div className="relative inline-block mx-auto">
                <img
                  src={avatar}
                  alt={creatorName}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[#FF2E93] mx-auto"
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-slate-950 rounded-full shadow-sm">
                  <Crown size={12} />
                </div>
              </div>
              <h3 className="text-lg font-black tracking-tight">Subscribe to {creatorName}</h3>
              <p className="text-xs text-slate-400">
                Support @{creatorUsername} with a monthly subscription and unlock exclusive perks.
              </p>
            </div>

            {/* Price Box */}
            <div
              className={`p-4 rounded-2xl border text-center ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-3xl font-black text-[#FF2E93]">
                ${monthlyPrice.toFixed(2)}
                <span className="text-xs font-bold text-slate-400 font-normal"> / month</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                Cancel anytime with 1-click in account settings.
              </span>
            </div>

            {/* Perks List */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-400 block">Subscriber Benefits:</span>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center gap-2">
                  <Crown size={14} className="text-amber-400 shrink-0" />
                  <span>Exclusive Supporter Crown Badge next to comments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-[#00D2FF] shrink-0" />
                  <span>Access to Subscriber-Only Reels & Behind-the-Scenes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-rose-400 shrink-0" />
                  <span>Direct replies in Creator Fan Lounge</span>
                </div>
              </div>
            </div>

            {/* Subscribe Action Button */}
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-2xl gradient-btn-primary text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#FF1E82]/30 flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Subscribing...</span>
                </div>
              ) : (
                <>
                  <Crown size={16} />
                  <span>Subscribe for ${monthlyPrice.toFixed(2)}/mo</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
