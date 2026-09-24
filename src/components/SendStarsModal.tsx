import React, { useState } from 'react';
import { X, Star, Sparkles, Check, Heart, ShieldCheck, Zap } from 'lucide-react';
import { UserProfile } from '../types';

interface SendStarsModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorProfile: any | null;
  isDarkMode: boolean;
  onStarsSent?: (amount: number) => void;
}

export const SendStarsModal: React.FC<SendStarsModalProps> = ({
  isOpen,
  onClose,
  creatorProfile,
  isDarkMode,
  onStarsSent,
}) => {
  const [selectedStars, setSelectedStars] = useState<number>(500);
  const [customCheer, setCustomCheer] = useState('Loved your content! Keep shining! ⭐');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const starPackages = [
    { stars: 50, price: '$0.50', label: 'Quick Cheer' },
    { stars: 100, price: '$1.00', label: 'Thumbs Up' },
    { stars: 500, price: '$5.00', label: 'Super Fan', popular: true },
    { stars: 1000, price: '$10.00', label: 'Hero Supporter' },
    { stars: 5000, price: '$50.00', label: 'Legendary Producer' },
  ];

  const handleSendStars = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsProcessing(false);
    setIsSuccess(true);
    if (onStarsSent) onStarsSent(selectedStars);

    // Also update localStorage so creator balance increases
    try {
      const data = localStorage.getItem('creatormeet_monetization_settings');
      if (data) {
        const parsed = JSON.parse(data);
        parsed.starsBalance = (parsed.starsBalance || 28500) + selectedStars;
        localStorage.setItem('creatormeet_monetization_settings', JSON.stringify(parsed));
      }
    } catch {}
  };

  const creatorName = creatorProfile?.fullName || creatorProfile?.name || 'Creator';
  const creatorUsername = (creatorProfile?.username || 'creator').replace(/^@/, '');

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

        {isSuccess ? (
          <div className="text-center py-6 space-y-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400">
              <Star size={32} className="fill-amber-400 animate-bounce" />
            </div>
            <h3 className="text-xl font-black">Stars Sent Successfully!</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              You just gifted <strong className="text-amber-400">{selectedStars} Stars</strong> to @{creatorUsername}. They will receive your cheer immediately!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full gradient-btn-primary text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Awesome!
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                <Star size={24} className="fill-amber-400/30" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">Gift Stars to {creatorName}</h3>
                <p className="text-xs text-slate-400">
                  Stars directly financially support this creator (1 Star = $0.01 USD).
                </p>
              </div>
            </div>

            {/* Packages */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">Select Star Package:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {starPackages.map((pkg) => (
                  <button
                    key={pkg.stars}
                    type="button"
                    onClick={() => setSelectedStars(pkg.stars)}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer relative ${
                      selectedStars === pkg.stars
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400'
                        : isDarkMode
                        ? 'border-white/10 hover:border-white/20 bg-white/5'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-slate-950 uppercase">
                        Popular
                      </span>
                    )}
                    <div className="flex items-center justify-center gap-1 font-black text-sm">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span>{pkg.stars}</span>
                    </div>
                    <span className="text-[11px] font-bold block mt-0.5">{pkg.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom cheer note */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">Attach a Cheer Message:</label>
              <input
                type="text"
                value={customCheer}
                onChange={(e) => setCustomCheer(e.target.value)}
                placeholder="Write a cheer..."
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-hidden ${
                  isDarkMode ? 'bg-slate-900 border-white/15 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            {/* Send button */}
            <button
              type="button"
              onClick={handleSendStars}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending Stars...</span>
                </div>
              ) : (
                <>
                  <Star size={16} className="fill-white" />
                  <span>Send {selectedStars} Stars (${(selectedStars * 0.01).toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
