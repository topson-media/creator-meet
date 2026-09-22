import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Sparkles,
  Zap,
  TrendingUp,
  MessageSquare,
  Lock,
  BarChart3,
  Video,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Eye,
  Check,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../types';
import { AccountBadge } from './AccountBadge';

interface VerifiedBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onVerifiedSuccess: () => void;
  onViewProfile?: () => void;
  isDarkMode: boolean;
}

export const VerifiedBadgeModal: React.FC<VerifiedBadgeModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onVerifiedSuccess,
  onViewProfile,
  isDarkMode,
}) => {
  const [previewWithBadge, setPreviewWithBadge] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gpay' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState(userProfile?.fullName || 'Alex Rivera');

  if (!isOpen) return null;

  const isAlreadyVerified = Boolean(
    userProfile?.isVerified || userProfile?.verified || userProfile?.blueTick
  );

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    // Simulate realistic payment gateway call (Stripe / Google Pay)
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setIsProcessing(false);
    setPaymentSuccess(true);
    onVerifiedSuccess();
  };

  const handleQuickActivate = () => {
    setPaymentSuccess(true);
    onVerifiedSuccess();
  };

  const displayName = userProfile?.fullName || 'Alex Rivera';
  const username = userProfile?.username || 'alexcreator';
  const avatar =
    userProfile?.avatar ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
  const coverImage =
    userProfile?.coverImage ||
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80';
  const bio =
    userProfile?.bio ||
    'Digital creator exploring cinema, audio design, and creative storytelling on Creator Meet.';

  const functionsList = [
    {
      icon: ShieldCheck,
      color: 'text-[#00D2FF]',
      bg: 'bg-[#00D2FF]/10',
      title: 'Official Blue Tick Verification',
      desc: 'High-trust blue checkmark badge proudly displayed across posts, reels, comments, direct messages, and global search.',
    },
    {
      icon: TrendingUp,
      color: 'text-[#FF2E93]',
      bg: 'bg-[#FF2E93]/10',
      title: '3x Priority Algorithmic Reach',
      desc: 'Your creative uploads get priority placement on the Home Feed, Trending Reels carousel, and Creator Matchmaking directory.',
    },
    {
      icon: MessageSquare,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      title: 'VIP Direct Messaging & Collab Lounge',
      desc: 'Bypass standard message request queues and pitch co-productions directly to top verified creators, agencies, and sponsors.',
    },
    {
      icon: Lock,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      title: 'Zero Escrow Platform Fees (0%)',
      desc: 'Keep 100% of your earnings on brand collaborations, sponsored partnerships, and paid creative milestones.',
    },
    {
      icon: BarChart3,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      title: 'Pro Creator Analytics & Audience Insights',
      desc: 'Real-time viewer retention graphs, regional demographic heatmaps, and follower conversion tracking.',
    },
    {
      icon: Video,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      title: '4K Ultra-HD Video & Lossless Audio',
      desc: 'Publish uncompressed video reels up to 4K 60fps and lossless studio audio tracks without platform compression.',
    },
  ];

  return (
    <div
      id="verified-badge-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="verified-badge-modal-dialog"
        className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all my-auto ${
          isDarkMode
            ? 'bg-[#080D26] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          id="verified-modal-close-btn"
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition cursor-pointer"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Hero Header with Cyan Radiance */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-[#00D2FF]/20 via-purple-600/15 to-transparent border-b border-inherit overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2FF]/20 border border-[#00D2FF]/40 text-[#00D2FF] text-xs font-bold mb-3 shadow-xs">
              <ShieldCheck size={15} />
              <span>Creator Meet Verified</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 flex-wrap">
              <span>Get Your Official Blue Tick</span>
              <ShieldCheck size={28} className="text-[#00D2FF] fill-[#00D2FF]/20 animate-pulse" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
              Verify your authenticity, protect your identity, boost your feed reach by 3x, and display the official blue tick across Creator Meet.
            </p>
          </div>
        </div>

        {/* SUCCESS VIEW (If payment just completed or already verified) */}
        {paymentSuccess || isAlreadyVerified ? (
          <div className="p-6 sm:p-8 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#00D2FF]/15 border-2 border-[#00D2FF] flex items-center justify-center text-[#00D2FF] shadow-lg shadow-[#00D2FF]/30">
              <ShieldCheck size={44} className="fill-[#00D2FF]/20" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
                ✓ BLUE TICK ACTIVATED
              </span>
              <h3 className="text-2xl font-black">You are Officially Verified!</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                The official blue checkmark badge is now active across your profile, posts, reels, comments, and direct messages.
              </p>
            </div>

            {/* Live Profile Card with Verified Badge */}
            <div
              className={`max-w-md mx-auto p-4 rounded-2xl border text-left ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={avatar}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#00D2FF]"
                  />
                  <div className="absolute -bottom-1 -right-1 p-0.5 bg-[#00D2FF] text-white rounded-full">
                    <Check size={12} strokeWidth={3} />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm sm:text-base truncate">{displayName}</h4>
                    <ShieldCheck size={18} className="text-[#00D2FF] fill-[#00D2FF]/20 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-400">@{username}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00D2FF]/15 text-[#00D2FF] border border-[#00D2FF]/30">
                      Creator Meet Verified
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Zap size={10} /> 3x Boost Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onViewProfile && (
                <button
                  onClick={() => {
                    onClose();
                    onViewProfile();
                  }}
                  id="view-verified-profile-btn"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full gradient-btn-primary text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Eye size={15} />
                  <span>View My Verified Profile</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-slate-300 dark:border-white/20 hover:bg-white/10 text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                Close & Return to Feed
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-7 space-y-7">
            {/* SECTION 1: LIVE PROFILE PREVIEW WITH / WITHOUT BLUE TICK */}
            <div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-[#00D2FF]" />
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                    How Your Profile Will Appear
                  </h3>
                </div>

                {/* Interactive Toggle Switch */}
                <div className="flex items-center p-1 rounded-full bg-black/20 dark:bg-white/10 border border-white/10 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPreviewWithBadge(true)}
                    className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                      previewWithBadge
                        ? 'bg-[#00D2FF] text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck size={13} />
                    <span>With Blue Tick ✨</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewWithBadge(false)}
                    className={`px-3 py-1 rounded-full transition cursor-pointer ${
                      !previewWithBadge
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Without Blue Tick
                  </button>
                </div>
              </div>

              {/* Realistic Profile Card Preview */}
              <div
                className={`rounded-3xl border overflow-hidden transition-all duration-300 ${
                  previewWithBadge
                    ? 'border-[#00D2FF]/40 shadow-xl shadow-[#00D2FF]/10 ring-1 ring-[#00D2FF]/30'
                    : isDarkMode
                    ? 'border-white/10 bg-white/5'
                    : 'border-slate-200 bg-slate-50'
                } ${isDarkMode ? 'bg-[#060A1D]' : 'bg-white'}`}
              >
                {/* Cover Banner */}
                <div className="relative h-24 sm:h-28 bg-slate-900 overflow-hidden">
                  <img
                    src={coverImage}
                    alt="Cover"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  {previewWithBadge && (
                    <div className="absolute top-2.5 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#00D2FF]/40 text-[#00D2FF] text-[10px] font-bold flex items-center gap-1">
                      <Sparkles size={11} />
                      <span>Verified Creator Authenticated</span>
                    </div>
                  )}
                </div>

                {/* Profile Avatar & Info */}
                <div className="px-5 pb-5 relative -mt-8">
                  <div className="flex items-end justify-between gap-3">
                    <div className="relative">
                      <img
                        src={avatar}
                        alt={displayName}
                        referrerPolicy="no-referrer"
                        className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 transition-all ${
                          previewWithBadge
                            ? 'ring-4 ring-[#00D2FF]/50 border-white'
                            : 'ring-2 ring-white/20 border-slate-800'
                        }`}
                      />
                      {previewWithBadge && (
                        <div className="absolute bottom-0 right-0 p-1 bg-[#00D2FF] text-slate-950 rounded-full shadow-md">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <AccountBadge role={userProfile?.role || 'creator'} size="sm" />
                      {previewWithBadge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00D2FF]/15 text-[#00D2FF] border border-[#00D2FF]/30 flex items-center gap-1">
                          <ShieldCheck size={11} /> Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-lg font-black tracking-tight">{displayName}</h4>
                      {previewWithBadge ? (
                        <span className="inline-flex items-center gap-1">
                          <ShieldCheck
                            size={19}
                            className="text-[#00D2FF] fill-[#00D2FF]/20 animate-pulse shrink-0"
                          />
                          <span className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-wider hidden sm:inline">
                            Verified
                          </span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">(Standard account)</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">@{username}</p>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">{bio}</p>
                  </div>

                  {/* Sample Feed Post Card showing Blue Tick in Posts */}
                  <div
                    className={`mt-3.5 p-3 rounded-2xl border text-xs ${
                      isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={avatar}
                        alt={displayName}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20"
                      />
                      <span className="font-bold truncate">{displayName}</span>
                      {previewWithBadge && (
                        <ShieldCheck size={13} className="text-[#00D2FF] fill-[#00D2FF]/20 shrink-0" />
                      )}
                      <span className="text-[10px] text-slate-400">· 2m ago</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Excited to announce our new 4K master reel co-production! Filmed with Creator Meet collaborators. 🎬
                    </p>
                    {previewWithBadge && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#00D2FF] font-semibold">
                        <Zap size={11} />
                        <span>Reaching 3x more creators and followers via verified feed boost</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: FUNCTIONS & BENEFITS OF VERIFIED SUBSCRIPTION */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-[#FF2E93]" />
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                  Functions & Subscription Benefits
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {functionsList.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isDarkMode
                          ? 'bg-white/5 border-white/10 hover:border-white/20'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 mt-0.5`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold leading-snug">{item.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 3: SUBSCRIPTION PLAN & PAYMENT FLOW */}
            <div
              className={`p-5 rounded-3xl border ${
                isDarkMode
                  ? 'bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black/40 border-[#00D2FF]/30'
                  : 'bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white border-indigo-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-black flex items-center gap-1.5">
                    <span>Activate Your Subscription</span>
                    <ShieldCheck size={18} className="text-[#00D2FF]" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cancel anytime with one click in your settings.
                  </p>
                </div>

                {/* Plan Selection Buttons */}
                <div className="flex items-center p-1 rounded-2xl bg-black/30 dark:bg-white/10 border border-white/10 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('monthly')}
                    className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                      selectedPlan === 'monthly'
                        ? 'bg-[#FF2E93] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly ($9.99/mo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('annual')}
                    className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                      selectedPlan === 'annual'
                        ? 'bg-[#00D2FF] text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Annual ($7.99/mo)</span>
                    <span className="text-[9px] px-1 py-0.2 bg-black/40 text-emerald-300 rounded-md">Save 20%</span>
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'border-[#00D2FF] bg-[#00D2FF]/15 text-[#00D2FF]'
                        : 'border-white/10 bg-white/5 text-slate-400'
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gpay')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'gpay'
                        ? 'border-[#00D2FF] bg-[#00D2FF]/15 text-[#00D2FF]'
                        : 'border-white/10 bg-white/5 text-slate-400'
                    }`}
                  >
                    <Zap size={14} />
                    <span>Google / Apple Pay</span>
                  </button>
                </div>

                {/* Simulated Payment Card Form */}
                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                        isDarkMode
                          ? 'bg-black/40 border-white/15 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                          isDarkMode
                            ? 'bg-black/40 border-white/15 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                          isDarkMode
                            ? 'bg-black/40 border-white/15 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border ${
                        isDarkMode
                          ? 'bg-black/40 border-white/15 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Primary Payment Button */}
                <div className="pt-3 space-y-2">
                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    id="submit-verified-payment-btn"
                    className="w-full py-3 px-4 rounded-2xl gradient-btn-primary text-white font-extrabold text-sm shadow-lg shadow-[#FF1E82]/30 flex items-center justify-center gap-2 cursor-pointer transition hover:opacity-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Authorizing & Adding Blue Tick to Profile...</span>
                      </div>
                    ) : (
                      <>
                        <ShieldCheck size={18} className="text-[#00D2FF]" />
                        <span>
                          Pay {selectedPlan === 'monthly' ? '$9.99' : '$95.88'} & Add Blue Tick to Profile
                        </span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  {/* Fast Instant Demo Test Button */}
                  <button
                    type="button"
                    onClick={handleQuickActivate}
                    id="quick-instant-verify-btn"
                    className="w-full py-2 px-3 rounded-xl border border-white/15 hover:bg-white/10 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Zap size={13} className="text-amber-400" />
                    <span>Instant Verification (One-Click Demo Activation)</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-1">
                    <Lock size={10} className="text-emerald-400" />
                    <span>Encrypted 256-bit payment. Blue Tick activates immediately on your account.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
