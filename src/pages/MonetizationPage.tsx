import React, { useState, useEffect } from 'react';
import {
  Coins,
  CheckCircle2,
  Clock,
  Film,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Sparkles,
  Lock,
  Unlock,
  ShieldCheck,
  CreditCard,
  Settings,
  ArrowRight,
  Eye,
  Sliders,
  Check,
  Gift,
  HelpCircle,
  AlertCircle,
  Zap,
  Heart,
} from 'lucide-react';
import { UserProfile, PageRoute } from '../types';
import { saveMonetizationSettingsToFirestore } from '../lib/firestoreService';
import { useAuth } from '../context/AuthContext';

interface MonetizationPageProps {
  userProfile: UserProfile | null;
  isDarkMode: boolean;
  onNavigate: (page: PageRoute) => void;
  onOpenVerifiedModal?: () => void;
  onUpgradeToCreator?: () => Promise<void> | void;
}

export const MonetizationPage: React.FC<MonetizationPageProps> = ({
  userProfile,
  isDarkMode,
  onNavigate,
  onOpenVerifiedModal,
  onUpgradeToCreator,
}) => {
  const { updateProfile } = useAuth();

  // Load saved monetization state from Firestore userProfile or localStorage
  const savedState = (() => {
    if (userProfile?.monetization) {
      return {
        followersCount: userProfile.monetization.followersCount,
        watchTimeHours: userProfile.monetization.watchTimeHours,
        reelViews90Days: userProfile.monetization.reelViews90Days,
        contentMonetizationActive: userProfile.monetization.contentMonetizationEnabled,
        starsEnabled: userProfile.monetization.starsEnabled,
        starsBalance: userProfile.monetization.totalStarsReceived,
        subscriptionEnabled: userProfile.monetization.subscriptionEnabled,
        monthlyPrice: userProfile.monetization.subscriptionMonthlyPrice,
        subscriberCount: userProfile.monetization.subscriberCount,
        payoutMethod: userProfile.monetization.payoutMethod,
      };
    }
    try {
      const data = localStorage.getItem('creatormeet_monetization_settings');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  })();

  // 1. Content Monetization Criteria
  // Requirements: 10k followers, 4k watchtime hours, 300k reel views in 90 days
  const [followersCount, setFollowersCount] = useState<number>(
    savedState?.followersCount ?? 8450
  );
  const [watchTimeHours, setWatchTimeHours] = useState<number>(
    savedState?.watchTimeHours ?? 3240
  );
  const [reelViews90Days, setReelViews90Days] = useState<number>(
    savedState?.reelViews90Days ?? 245000
  );

  // Criteria thresholds
  const TARGET_FOLLOWERS = 10000;
  const TARGET_WATCH_HOURS = 4000;
  const TARGET_REEL_VIEWS = 300000;

  // Are all 3 criteria naturally met?
  const isFollowersMet = followersCount >= TARGET_FOLLOWERS;
  const isWatchTimeMet = watchTimeHours >= TARGET_WATCH_HOURS;
  const isReelViewsMet = reelViews90Days >= TARGET_REEL_VIEWS;
  const isEligible = isFollowersMet && isWatchTimeMet && isReelViewsMet;

  // Content Monetization Enabled
  const [contentMonetizationActive, setContentMonetizationActive] = useState<boolean>(
    savedState?.contentMonetizationActive ?? isEligible
  );

  // 2. Stars & Virtual Gifts State
  // User can open stars to receive gifts from followers
  const [starsEnabled, setStarsEnabled] = useState<boolean>(
    savedState?.starsEnabled ?? true
  );
  const [starsBalance, setStarsBalance] = useState<number>(
    savedState?.starsBalance ?? 28500
  ); // 28,500 stars = $285.00
  const [thankYouMessage, setThankYouMessage] = useState<string>(
    savedState?.thankYouMessage ??
      'Thank you so much for the Stars! Your support keeps my creative work going! 🌟'
  );
  const [showStarCelebration, setShowStarCelebration] = useState(false);

  // 3. Monthly Fan Subscription State
  // User can enable subscriptions and set how much money to be paid per month
  const [subscriptionEnabled, setSubscriptionEnabled] = useState<boolean>(
    savedState?.subscriptionEnabled ?? true
  );
  const [monthlyPrice, setMonthlyPrice] = useState<number>(
    savedState?.monthlyPrice ?? 9.99
  );
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [subscriberCount, setSubscriberCount] = useState<number>(
    savedState?.subscriberCount ?? 118
  );
  const [subscriberPerks, setSubscriberPerks] = useState<string[]>([
    'Exclusive Supporter Crown Badge next to name',
    'Subscriber-Only private Reels & Posts',
    'Priority direct replies in VIP Lounge',
    'Monthly Live Q&A invitation',
  ]);

  // Payout Method State
  const [payoutMethod, setPayoutMethod] = useState<string>(
    savedState?.payoutMethod ?? 'PayPal (alex.creator@example.com)'
  );
  const [isEditingPayout, setIsEditingPayout] = useState(false);
  const [newPayoutInput, setNewPayoutInput] = useState(payoutMethod);

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Save changes to Firestore `(default)` and localStorage
  const saveAllSettings = async () => {
    try {
      const data = {
        followersCount,
        watchTimeHours,
        reelViews90Days,
        contentMonetizationActive,
        starsEnabled,
        starsBalance,
        thankYouMessage,
        subscriptionEnabled,
        monthlyPrice,
        subscriberCount,
        payoutMethod,
      };
      localStorage.setItem('creatormeet_monetization_settings', JSON.stringify(data));

      if (userProfile?.id) {
        const monetizationPayload = {
          contentMonetizationEnabled: contentMonetizationActive,
          watchTimeHours,
          reelViews90Days,
          followersCount,
          starsEnabled,
          totalStarsReceived: starsBalance,
          starBalanceUsd: starsBalance * 0.01,
          subscriptionEnabled,
          subscriptionMonthlyPrice: monthlyPrice,
          subscriberCount,
          totalEarningsUsd: totalMonthlyEarningsUsd,
          payoutMethod,
        };
        await saveMonetizationSettingsToFirestore(userProfile.id, monetizationPayload);
        await updateProfile({ monetization: monetizationPayload });
      }

      showToast('✓ Monetization settings saved to Firestore!');
    } catch (e) {
      console.error(e);
      showToast('✓ Settings updated locally.');
    }
  };

  // Simulation Toggle: Meet all criteria immediately for demo
  const handleToggleSimulatedEligibility = () => {
    if (isEligible) {
      // Revert to in-progress
      setFollowersCount(8450);
      setWatchTimeHours(3240);
      setReelViews90Days(245000);
      setContentMonetizationActive(false);
      showToast('Demo: Reset criteria to in-progress state.');
    } else {
      // Set to all met
      setFollowersCount(12400);
      setWatchTimeHours(4850);
      setReelViews90Days(385000);
      setContentMonetizationActive(true);
      showToast('🎉 Demo: Criteria unlocked! 10k Followers, 4k Watch Hours & 300k Reel views met!');
    }
  };

  // Simulate receiving a gift of stars from a follower
  const handleSimulateGift = (amount: number) => {
    setStarsBalance((prev) => prev + amount);
    setShowStarCelebration(true);
    showToast(`⭐ Received ${amount} Stars ($${(amount * 0.01).toFixed(2)}) from fan @sarah_films!`);
    setTimeout(() => setShowStarCelebration(false), 3000);
  };

  // Calculations
  const starEarningsUsd = starsBalance * 0.01;
  const subscriptionMonthlyUsd = subscriptionEnabled ? subscriberCount * monthlyPrice : 0;
  const adRevenueUsd = contentMonetizationActive ? 1420.5 : 0;
  const totalMonthlyEarningsUsd = adRevenueUsd + subscriptionMonthlyUsd + starEarningsUsd;

  // FAN ACCOUNT CHECK: Fan accounts cannot get monetization methods
  const isFan = userProfile?.role === 'fan';
  if (isFan) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#00D2FF] text-slate-950 font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm animate-bounce">
            <Check size={16} strokeWidth={3} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div
          className={`rounded-3xl border p-6 sm:p-10 relative overflow-hidden transition-all ${
            isDarkMode
              ? 'bg-[#080D26] border-white/10 text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          {/* Fan Account Monetization Restriction Header */}
          <div className="flex flex-col items-center text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/25">
              <Lock size={32} />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Heart size={12} className="fill-pink-400" />
                <span>Fan Account Detected</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Monetization Methods Unavailable for Fan Accounts
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Your account is currently registered as a <strong>Fan Account</strong> (@{userProfile?.username || 'user'}).
                Under Creator Meet platform rules, Fan Accounts cannot access or configure monetization methods (such as content watch-time ad pools, monthly fan subscriptions, or receiving Stars gifts).
              </p>
            </div>

            {/* Comparison of Fan vs Creator Accounts */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-3">
              <div
                className={`p-4 rounded-2xl border ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-xs font-black uppercase tracking-wider text-pink-400 mb-2 flex items-center gap-1.5">
                  <Heart size={14} className="fill-pink-400" />
                  <span>Fan Accounts Can:</span>
                </div>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-pink-400 shrink-0 mt-0.5" />
                    <span>Watch high-definition creator videos and reels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-pink-400 shrink-0 mt-0.5" />
                    <span>Send Stars gifts to cheer on favorite creators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-pink-400 shrink-0 mt-0.5" />
                    <span>Subscribe to creators for exclusive subscriber-only content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-pink-400 shrink-0 mt-0.5" />
                    <span>Chat in the Fan Lounge and comment on releases</span>
                  </li>
                </ul>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  isDarkMode ? 'bg-amber-500/10 border-amber-500/25' : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="text-xs font-black uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                  <Coins size={14} />
                  <span>Creator-Only Monetization Tools:</span>
                </div>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <Lock size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>Video Ad Revenue (10k followers, 4k watch hours, 300k views)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>Custom Monthly Fan Subscriptions ($1.99–$49.99/mo)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>Receive and cash out Stars gifts from followers ($0.01/star)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>Direct PayPal & IBAN creator payout deposits</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action buttons to upgrade or return */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              {onUpgradeToCreator && (
                <button
                  type="button"
                  id="fan-upgrade-to-creator-btn"
                  onClick={async () => {
                    await onUpgradeToCreator();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl gradient-btn-primary text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#FF1E82]/30 flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 transition"
                >
                  <Sparkles size={16} />
                  <span>Upgrade to Creator Account (Unlock Monetization)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-inherit hover:bg-black/5 dark:hover:bg-white/10 text-xs sm:text-sm font-bold transition cursor-pointer"
              >
                Back to Home Feed
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 pb-20 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00D2FF] text-slate-950 font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm animate-bounce">
          <Check size={16} strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Star Animation on Gift */}
      {showStarCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-center animate-ping">
            <Star size={96} className="text-amber-400 fill-amber-400 mx-auto drop-shadow-lg" />
            <span className="text-2xl font-black text-amber-300 block mt-2">+500 Stars Received!</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-inherit">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
              <Coins size={22} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span>Creator Monetization Hub</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  Active
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Turn your creativity into reliable income through Content Monetization, Fan Subscriptions, and Stars.
              </p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleToggleSimulatedEligibility}
            className="px-3 py-1.5 rounded-full text-xs font-bold border border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition cursor-pointer flex items-center gap-1.5"
            title="Toggle between in-progress and all 3 requirements met"
          >
            <Zap size={13} />
            <span>{isEligible ? 'Reset Criteria (Demo)' : 'Simulate 10k/4k/300k Met'}</span>
          </button>

          <button
            type="button"
            onClick={saveAllSettings}
            className="gradient-btn-primary px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md hover:opacity-95 transition cursor-pointer flex items-center gap-1.5"
          >
            <Check size={14} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Overview Cards: Total Earnings, Subscriptions, Stars, Ad Revenue */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Estimated Earnings */}
        <div
          className={`p-4 rounded-3xl border transition-all ${
            isDarkMode
              ? 'bg-gradient-to-br from-purple-950/40 via-[#080D26] to-[#00D2FF]/10 border-white/10'
              : 'bg-gradient-to-br from-purple-50 via-white to-cyan-50 border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Est. Monthly Earnings</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            ${totalMonthlyEarningsUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Includes Ads, Subs & Stars
          </span>
        </div>

        {/* Content Ad Revenue */}
        <div
          className={`p-4 rounded-3xl border transition-all ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Content Ad Pool</span>
            <Film size={16} className="text-[#00D2FF]" />
          </div>
          <div className="text-xl sm:text-2xl font-black">
            ${contentMonetizationActive ? '1,420.50' : '0.00'}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {contentMonetizationActive ? '300k+ Reel Views RPM' : 'Requires 10k, 4k hrs, 300k'}
          </span>
        </div>

        {/* Fan Subscriptions */}
        <div
          className={`p-4 rounded-3xl border transition-all ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Fan Subscriptions</span>
            <Users size={16} className="text-[#FF2E93]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#FF2E93]">
            ${subscriptionMonthlyUsd.toFixed(2)}/mo
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {subscriberCount} fans at ${monthlyPrice.toFixed(2)}/mo
          </span>
        </div>

        {/* Stars Balance */}
        <div
          className={`p-4 rounded-3xl border transition-all ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Stars & Gifts</span>
            <Star size={16} className="text-amber-400 fill-amber-400/20" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400">
            ${starEarningsUsd.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {starsBalance.toLocaleString()} total stars (1★ = $0.01)
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* METHOD 1: CONTENT MONETIZATION & IN-STREAM AD EARNINGS */}
      {/* ======================================================== */}
      <div
        id="method-content-monetization"
        className={`p-5 sm:p-7 rounded-3xl border transition-all ${
          isDarkMode ? 'bg-[#080D26] border-white/15' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00D2FF]/15 border border-[#00D2FF]/30 text-[#00D2FF] flex items-center justify-center shrink-0">
              <Film size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Method 1: Content Monetization</span>
                {isEligible ? (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Eligible & Unlocked ✓
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Requirements in Progress
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Earn money directly from your Reels, videos, and in-stream performance pools based on views and watch time.
              </p>
            </div>
          </div>

          {/* Direct eligibility toggle button */}
          <button
            type="button"
            onClick={handleToggleSimulatedEligibility}
            className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition flex items-center gap-1.5 self-start sm:self-auto ${
              isEligible
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-[#00D2FF]/15 text-[#00D2FF] border border-[#00D2FF]/40'
            }`}
          >
            {isEligible ? <Unlock size={13} /> : <Lock size={13} />}
            <span>{isEligible ? 'Criteria Met (Click to reset)' : 'Unlock Criteria (Demo)'}</span>
          </button>
        </div>

        {/* 3 Explicit Requirements mandated by the user */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Requirement 1: 10,000 Followers */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isFollowersMet
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : isDarkMode
                ? 'border-white/10 bg-white/5'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold flex items-center gap-1.5">
                <Users size={14} className="text-[#FF2E93]" />
                <span>10k Followers Required</span>
              </span>
              {isFollowersMet ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Met
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400">
                  {(TARGET_FOLLOWERS - followersCount).toLocaleString()} more needed
                </span>
              )}
            </div>
            <div className="text-lg font-black">
              {followersCount.toLocaleString()} / {TARGET_FOLLOWERS.toLocaleString()}
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-700/40 overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFollowersMet
                    ? 'bg-emerald-400'
                    : 'bg-gradient-to-r from-[#FF2E93] to-purple-500'
                }`}
                style={{ width: `${Math.min(100, (followersCount / TARGET_FOLLOWERS) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1.5">
              {Math.min(100, Math.round((followersCount / TARGET_FOLLOWERS) * 100))}% completed
            </span>
          </div>

          {/* Requirement 2: 4,000 Watch Time Hours */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isWatchTimeMet
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : isDarkMode
                ? 'border-white/10 bg-white/5'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold flex items-center gap-1.5">
                <Clock size={14} className="text-[#00D2FF]" />
                <span>4k Watchtime Hours</span>
              </span>
              {isWatchTimeMet ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Met
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400">
                  {(TARGET_WATCH_HOURS - watchTimeHours).toLocaleString()} hrs left
                </span>
              )}
            </div>
            <div className="text-lg font-black">
              {watchTimeHours.toLocaleString()} / {TARGET_WATCH_HOURS.toLocaleString()} hrs
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-700/40 overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isWatchTimeMet
                    ? 'bg-emerald-400'
                    : 'bg-gradient-to-r from-[#00D2FF] to-blue-500'
                }`}
                style={{ width: `${Math.min(100, (watchTimeHours / TARGET_WATCH_HOURS) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1.5">
              {Math.min(100, Math.round((watchTimeHours / TARGET_WATCH_HOURS) * 100))}% completed
            </span>
          </div>

          {/* Requirement 3: 300,000 Reel Views in 90 Days */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isReelViewsMet
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : isDarkMode
                ? 'border-white/10 bg-white/5'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold flex items-center gap-1.5">
                <Film size={14} className="text-purple-400" />
                <span>300k Reel Views (90 Days)</span>
              </span>
              {isReelViewsMet ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Met
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400">
                  {(TARGET_REEL_VIEWS - reelViews90Days).toLocaleString()} views left
                </span>
              )}
            </div>
            <div className="text-lg font-black">
              {reelViews90Days.toLocaleString()} / {TARGET_REEL_VIEWS.toLocaleString()}
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-700/40 overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isReelViewsMet
                    ? 'bg-emerald-400'
                    : 'bg-gradient-to-r from-purple-500 to-rose-500'
                }`}
                style={{ width: `${Math.min(100, (reelViews90Days / TARGET_REEL_VIEWS) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1.5">
              {Math.min(100, Math.round((reelViews90Days / TARGET_REEL_VIEWS) * 100))}% completed
            </span>
          </div>
        </div>

        {/* Content Monetization Activation Controls */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            contentMonetizationActive
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : isDarkMode
              ? 'bg-white/5 border-white/10'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                contentMonetizationActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {contentMonetizationActive ? <Check size={18} strokeWidth={3} /> : <Lock size={18} />}
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold block">
                In-Stream Reel & Video Ad Placement
              </span>
              <span className="text-[11px] text-slate-400 block">
                {isEligible
                  ? 'Ads automatically run before, during, and after your videos. You retain 70% of gross earnings.'
                  : 'Requires meeting all 3 criteria (10k followers, 4k watchtime hrs, 300k reel views in 90 days).'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={contentMonetizationActive}
                disabled={!isEligible}
                onChange={(e) => setContentMonetizationActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 disabled:opacity-40" />
            </label>
            <span className="text-xs font-bold">
              {contentMonetizationActive ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* METHOD 2: STARS & VIRTUAL GIFTS */}
      {/* ======================================================== */}
      <div
        id="method-stars-gifts"
        className={`p-5 sm:p-7 rounded-3xl border transition-all ${
          isDarkMode ? 'bg-[#080D26] border-white/15' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Star size={20} className="fill-amber-400/20" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Method 2: Open Stars to Receive Gifts from Followers</span>
                {starsEnabled ? (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Open & Receiving Gifts ✓
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30">
                    Stars Closed
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Followers can buy and send you Star gifts on your posts, reels, live streams, and profile. (1 Star = $0.01 USD payout).
              </p>
            </div>
          </div>

          {/* Toggle Switch to Open/Close Stars */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-slate-300">
              {starsEnabled ? 'Stars Open' : 'Stars Closed'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={starsEnabled}
                onChange={(e) => {
                  setStarsEnabled(e.target.checked);
                  showToast(e.target.checked ? '⭐ Stars are now OPEN to receive gifts!' : 'Stars are now closed.');
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400" />
            </label>
          </div>
        </div>

        {/* Stars Details & Simulator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Current Star Balance & Payout */}
          <div
            className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Your Current Stars Balance</span>
              <span className="text-xs font-extrabold text-amber-400">100★ = $1.00 USD</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center gap-1.5">
                <Star size={24} className="fill-amber-400" />
                <span>{starsBalance.toLocaleString()} Stars</span>
              </span>
              <span className="text-sm font-bold text-emerald-400">
                (${starEarningsUsd.toFixed(2)})
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Funds are automatically transferred to your designated payout account on the 1st of every month.
            </p>

            {/* Test Simulation Button */}
            <div className="mt-4 pt-3 border-t border-inherit flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSimulateGift(500)}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition cursor-pointer flex items-center gap-1.5"
              >
                <Gift size={13} />
                <span>Simulate Receiving 500 Stars ($5.00)</span>
              </button>
            </div>
          </div>

          {/* Automated Thank-You Message Configuration */}
          <div
            className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <label className="text-xs font-bold block mb-1.5">
              Automated Fan Thank-You Message
            </label>
            <textarea
              value={thankYouMessage}
              onChange={(e) => setThankYouMessage(e.target.value)}
              rows={3}
              placeholder="Enter message automatically sent when someone sends you stars..."
              className={`w-full p-2.5 text-xs rounded-xl border focus:outline-hidden resize-none ${
                isDarkMode
                  ? 'bg-slate-900 border-white/15 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Sent via direct message when a fan gifts you stars on any post or reel.
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* METHOD 3: MONTHLY FAN SUBSCRIPTION */}
      {/* ======================================================== */}
      <div
        id="method-monthly-subscription"
        className={`p-5 sm:p-7 rounded-3xl border transition-all ${
          isDarkMode ? 'bg-[#080D26] border-white/15' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF2E93]/15 border border-[#FF2E93]/30 text-[#FF2E93] flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Method 3: Monthly Fan Subscriptions</span>
                {subscriptionEnabled ? (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Subscriptions Active ✓
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30">
                    Subscriptions Off
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Followers pay you every month for exclusive perks. You choose the exact monthly price to be paid.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-slate-300">
              {subscriptionEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={subscriptionEnabled}
                onChange={(e) => {
                  setSubscriptionEnabled(e.target.checked);
                  showToast(
                    e.target.checked
                      ? `✓ Subscriptions enabled at $${monthlyPrice.toFixed(2)}/mo!`
                      : 'Subscriptions disabled.'
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF2E93]" />
            </label>
          </div>
        </div>

        {/* Custom Price Setting Slider and Direct Input */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
          {/* Price setting controls */}
          <div
            className={`lg:col-span-7 p-5 rounded-2xl border space-y-4 ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                  <Sliders size={14} className="text-[#FF2E93]" />
                  <span>Set How Much Money Users Pay You Per Month</span>
                </label>
                <span className="text-xs font-black text-[#FF2E93] bg-[#FF2E93]/15 px-2.5 py-0.5 rounded-full border border-[#FF2E93]/30">
                  ${monthlyPrice.toFixed(2)} / month
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="1.99"
                max="49.99"
                step="0.50"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(parseFloat(e.target.value))}
                className="w-full accent-[#FF2E93] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>$1.99/mo (Affordable)</span>
                <span>$9.99/mo (Recommended)</span>
                <span>$49.99/mo (VIP)</span>
              </div>
            </div>

            {/* Direct Number Input & Currency */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Custom Dollar Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    min="0.99"
                    max="199.99"
                    step="0.01"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(Math.max(0.99, parseFloat(e.target.value) || 0))}
                    className={`w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border focus:outline-hidden ${
                      isDarkMode
                        ? 'bg-slate-900 border-white/15 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className={`w-full px-3 py-2 text-xs font-bold rounded-xl border focus:outline-hidden cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-900 border-white/15 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Popular Tier presets */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                Quick Preset Price Points:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {[4.99, 7.99, 9.99, 14.99, 19.99, 29.99].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMonthlyPrice(val)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition cursor-pointer ${
                      monthlyPrice === val
                        ? 'bg-[#FF2E93] text-white border-[#FF2E93]'
                        : isDarkMode
                        ? 'border-white/10 hover:bg-white/10 text-slate-300'
                        : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    ${val.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Forecast & Perks */}
          <div
            className={`lg:col-span-5 p-5 rounded-2xl border space-y-4 ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <span className="text-xs font-extrabold text-slate-300 block mb-1">
                Estimated Recurring Revenue (MRR)
              </span>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <div className="text-xl sm:text-2xl font-black text-purple-400">
                  ${(monthlyPrice * subscriberCount).toFixed(2)} / month
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Based on current {subscriberCount} subscribers at ${monthlyPrice.toFixed(2)}/mo
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                What Subscribers Receive:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {subscriberPerks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payout & Banking Section */}
      <div
        className={`p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#080D26] border-white/10' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <CreditCard size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Payout Destination</span>
            <span className="text-sm font-bold block">{payoutMethod}</span>
            <span className="text-[11px] text-slate-500 block">Payouts sent monthly via direct deposit / PayPal</span>
          </div>
        </div>

        {isEditingPayout ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={newPayoutInput}
              onChange={(e) => setNewPayoutInput(e.target.value)}
              className={`px-3 py-1.5 text-xs rounded-xl border ${
                isDarkMode ? 'bg-slate-900 border-white/20 text-white' : 'bg-white border-slate-300'
              }`}
            />
            <button
              onClick={() => {
                setPayoutMethod(newPayoutInput);
                setIsEditingPayout(false);
                showToast('✓ Payout method updated!');
              }}
              className="px-3 py-1.5 rounded-full text-xs font-bold gradient-btn-primary text-white cursor-pointer"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditingPayout(true)}
            className="px-4 py-2 rounded-full text-xs font-bold border border-slate-300 dark:border-white/15 hover:bg-white/10 transition cursor-pointer self-start sm:self-auto"
          >
            Edit Payout Method
          </button>
        )}
      </div>
    </div>
  );
};
