import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  MessageSquarePlus,
  UserPlus,
  UserCheck,
  Sparkles,
  Play,
  Share2,
  Crown,
  Star,
  Lock,
  Unlock,
  Coins,
  Heart,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { UserRole } from '../types';
import { AccountBadge } from './AccountBadge';
import { SubscribeModal } from './SubscribeModal';
import { SendStarsModal } from './SendStarsModal';

export interface ProfileDetailsData {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage?: string;
  role: UserRole;
  verified?: boolean;
  bio?: string;
  country?: string;
  flag?: string;
  category?: string;
  followersCount?: number | string;
  followingCount?: number | string;
  isFollowing?: boolean;
  collabOpen?: boolean;
  collabRole?: string;
  monetizationEnabled?: boolean;
  starsEnabled?: boolean;
  subscriptionEnabled?: boolean;
  monthlyPrice?: number;
  platforms?: {
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    x?: string;
    website?: string;
  };
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileDetailsData | null;
  isDarkMode: boolean;
  onStartChat?: (user: { name: string; handle: string; avatar: string; role: 'creator' | 'fan' }) => void;
  onOpenCollabModal?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  isDarkMode,
  onStartChat,
  onOpenCollabModal,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState<number>(1240);
  const [copiedToast, setCopiedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Monetization modals
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isSendStarsModalOpen, setIsSendStarsModalOpen] = useState(false);

  // Subscribed state to this specific creator
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [starsGiftedTotal, setStarsGiftedTotal] = useState(0);

  // Demo toggle: simulate creator having monetization turned ON vs OFF
  const [creatorMonetizationOn, setCreatorMonetizationOn] = useState<boolean>(true);

  const isCreator = profile?.role === 'creator';
  const isFan = profile?.role === 'fan';

  // Monthly subscription price
  const monthlyPrice = profile?.monthlyPrice ?? 9.99;

  useEffect(() => {
    if (!profile) return;

    // Follow state
    try {
      const stored = localStorage.getItem('creatormeet_followed_ids');
      const followedIds: string[] = stored ? JSON.parse(stored) : [];
      setIsFollowing(followedIds.includes(profile.id));
    } catch {
      setIsFollowing(Boolean(profile.isFollowing));
    }

    // Subscription state
    try {
      const subKey = `creatormeet_subscribed_${profile.id}`;
      setIsSubscribed(localStorage.getItem(subKey) === 'true');
    } catch {
      setIsSubscribed(false);
    }

    // Stars gifted state
    try {
      const starsKey = `creatormeet_stars_to_${profile.id}`;
      const savedStars = localStorage.getItem(starsKey);
      setStarsGiftedTotal(savedStars ? parseInt(savedStars, 10) : 0);
    } catch {
      setStarsGiftedTotal(0);
    }

    // Default creator monetization state
    setCreatorMonetizationOn(profile.monetizationEnabled !== false);

    // Initial follower count
    if (typeof profile.followersCount === 'number') {
      setFollowers(profile.followersCount);
    } else if (typeof profile.followersCount === 'string') {
      const parsed = parseInt(profile.followersCount.replace(/[^0-9]/g, ''));
      setFollowers(parsed || 1420);
    } else {
      setFollowers(profile.role === 'creator' ? 2450 : 88);
    }
  }, [profile?.id, profile?.role]);

  if (!isOpen || !profile) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowers((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const stored = localStorage.getItem('creatormeet_followed_ids');
      let followedIds: string[] = stored ? JSON.parse(stored) : [];
      if (nextState) {
        followedIds.push(profile.id);
      } else {
        followedIds = followedIds.filter((id) => id !== profile.id);
      }
      localStorage.setItem('creatormeet_followed_ids', JSON.stringify(followedIds));
    } catch (e) {
      console.warn('Could not save follow state', e);
    }
  };

  const handleMessageClick = () => {
    onClose();
    if (onStartChat) {
      onStartChat({
        name: profile.name,
        handle: `@${profile.username.replace(/^@/, '')}`,
        avatar: profile.avatar,
        role: profile.role,
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleSubscribedSuccess = () => {
    setIsSubscribed(true);
    try {
      localStorage.setItem(`creatormeet_subscribed_${profile.id}`, 'true');
    } catch {}
    showToast(`🎉 You are now subscribed to @${profile.username.replace(/^@/, '')}! VIP content unlocked.`);
  };

  const handleStarsSentSuccess = (amount: number) => {
    const updated = starsGiftedTotal + amount;
    setStarsGiftedTotal(updated);
    try {
      localStorage.setItem(`creatormeet_stars_to_${profile.id}`, updated.toString());
    } catch {}
    showToast(`⭐ Sent ${amount} Stars gift to ${profile.name}! Thank you for supporting.`);
  };

  const defaultCover =
    isCreator
      ? 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80'
      : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80';

  const defaultBio =
    profile.bio ||
    (isCreator
      ? 'Passionate digital creator exploring cinema, audio, and design. Open for dynamic collaborations and subscriptions on Creator Meet!'
      : 'Community enthusiast and fan supporter following inspiring storytellers, sending star gifts, and supporting great art worldwide.');

  const platforms = profile.platforms || {
    youtube: isCreator ? `https://youtube.com/@${profile.username}` : undefined,
    instagram: `https://instagram.com/${profile.username}`,
    tiktok: `https://tiktok.com/@${profile.username}`,
    x: `https://x.com/${profile.username}`,
    facebook: `https://facebook.com/${profile.username}`,
    website: isCreator ? `https://${profile.username}.creatorspace.net` : undefined,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all ${
          isDarkMode
            ? 'bg-[#080D26] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Floating Controls */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          {/* Creator Monetization Simulation Toggle for testing */}
          {isCreator && (
            <button
              type="button"
              onClick={() => setCreatorMonetizationOn(!creatorMonetizationOn)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md transition flex items-center gap-1 cursor-pointer border ${
                creatorMonetizationOn
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
              }`}
              title="Toggle to test monetization ON vs OFF on this creator profile"
            >
              <SlidersHorizontal size={11} />
              <span>Monetization: {creatorMonetizationOn ? 'ON' : 'OFF'}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition cursor-pointer"
            title="Share Profile"
          >
            <Share2 size={15} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Floating Toasts */}
        {copiedToast && (
          <div className="absolute top-14 right-4 z-40 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold shadow-lg animate-fade-in">
            Profile link copied!
          </div>
        )}

        {toastMessage && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-[#FF2E93] text-white text-xs font-bold shadow-xl animate-fade-in text-center max-w-sm">
            {toastMessage}
          </div>
        )}

        {/* 1. Profile Cover Image Banner */}
        <div className="relative h-40 sm:h-48 bg-slate-900 overflow-hidden">
          <img
            src={profile.coverImage || defaultCover}
            alt={`${profile.name} cover`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        {/* 2. Profile Avatar & Primary Details */}
        <div className="px-5 sm:px-6 pb-6 relative -mt-14 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-3.5">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-22 h-22 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-white/10 shadow-2xl border-2 border-inherit"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>

              <div className="mb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-xl font-black">{profile.name}</h2>
                  {profile.verified && (
                    <ShieldCheck size={18} className="text-[#00D2FF] fill-[#00D2FF]/20" />
                  )}
                </div>
                <p className="text-xs text-slate-400">@{profile.username.replace(/^@/, '')}</p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {/* Message button (always visible) */}
              <button
                id="user-profile-message-btn"
                onClick={handleMessageClick}
                className="px-3.5 py-2 text-xs font-bold rounded-full border border-white/20 hover:border-white/40 text-inherit bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5 cursor-pointer min-h-[34px]"
              >
                <MessageSquarePlus size={14} className="text-[#00D2FF]" />
                <span>Message</span>
              </button>

              {/* Follow button (always visible) */}
              <button
                id="user-profile-follow-btn"
                onClick={handleToggleFollow}
                className={`px-4 py-2 text-xs font-bold rounded-full transition flex items-center gap-1.5 cursor-pointer min-h-[34px] shadow-sm ${
                  isFollowing
                    ? 'bg-slate-700 text-white hover:bg-rose-600 hover:shadow-rose-600/30'
                    : 'gradient-btn-primary text-white shadow-[#FF1E82]/30'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={14} />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    <span>Follow</span>
                  </>
                )}
              </button>

              {/* Creator with monetization ON: Subscribe & Send Gift quick buttons */}
              {isCreator && creatorMonetizationOn && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsSubscribeModalOpen(true)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-full transition flex items-center gap-1.5 cursor-pointer min-h-[34px] shadow-xs ${
                      isSubscribed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'border border-[#FF2E93]/40 bg-[#FF2E93]/15 hover:bg-[#FF2E93]/25 text-[#FF2E93]'
                    }`}
                    title={isSubscribed ? 'Subscribed' : `Subscribe for $${monthlyPrice}/mo`}
                  >
                    <Crown size={14} className={isSubscribed ? 'text-emerald-400' : 'text-amber-400'} />
                    <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSendStarsModalOpen(true)}
                    className="p-2 sm:px-3 sm:py-2 text-xs font-bold rounded-full border border-amber-400/40 bg-amber-400/15 hover:bg-amber-400/25 text-amber-400 transition flex items-center gap-1.5 cursor-pointer min-h-[34px]"
                    title="Send Gift of Stars"
                  >
                    <Star size={14} className="fill-amber-400" />
                    <span className="hidden sm:inline">Gift</span>
                  </button>
                </>
              )}

              {/* Collab button (CREATORS ONLY - NOT visible on fan profiles) */}
              {isCreator && onOpenCollabModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCollabModal();
                  }}
                  className="px-3.5 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition cursor-pointer min-h-[34px]"
                >
                  Collab
                </button>
              )}
            </div>
          </div>

          {/* Badges and Counts */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <AccountBadge role={profile.role} size="md" />

            {/* Category tag: only visible if creator, or community label if fan */}
            {isCreator && profile.category && (
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-semibold text-[11px]">
                {profile.category}
              </span>
            )}

            {isFan && (
              <span className="px-2.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 font-semibold text-[11px] flex items-center gap-1">
                <Heart size={11} className="fill-pink-400" />
                <span>Creator Supporter</span>
              </span>
            )}

            {profile.country && (
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] flex items-center gap-1">
                <span>{profile.flag || '🌍'}</span>
                <span>{profile.country}</span>
              </span>
            )}

            <div className="flex items-center gap-3 text-xs font-bold ml-auto">
              <span>
                <strong className="text-inherit">{followers}</strong>{' '}
                <span className="text-slate-400 font-normal">Followers</span>
              </span>
              <span>
                <strong className="text-inherit">{profile.followingCount || 230}</strong>{' '}
                <span className="text-slate-400 font-normal">Following</span>
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* REQUIREMENT 1: CREATOR MONETIZATION ACTIVE -> ASK USER TO SUBSCRIBE & SEND GIFT */}
          {/* ========================================================================= */}
          {isCreator && creatorMonetizationOn && (
            <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-[#FF2E93]/10 to-[#00D2FF]/10 p-4 sm:p-5 shadow-lg animate-fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-[#FF2E93] to-purple-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-black tracking-tight">
                        Support {profile.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Coins size={10} />
                        <span>Monetization Active</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 dark:text-slate-300 mt-1 leading-relaxed">
                      {profile.name} has opened monetization! Subscribe for <strong>${monthlyPrice}/mo</strong> or send <strong>Stars gifts</strong> to unlock exclusive subscriber-only masterclasses, receive the Supporter Crown badge, and support upcoming works.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Subscribe & Send Gift */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="creator-modal-subscribe-btn"
                  onClick={() => setIsSubscribeModalOpen(true)}
                  className={`py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer transition hover:opacity-95 ${
                    isSubscribed
                      ? 'bg-emerald-500 text-white'
                      : 'gradient-btn-primary text-white shadow-[#FF1E82]/30'
                  }`}
                >
                  <Crown size={16} className={isSubscribed ? 'text-white' : 'text-amber-300'} />
                  <span>
                    {isSubscribed
                      ? '✓ Subscribed ($' + monthlyPrice + '/mo Active)'
                      : `Subscribe ($${monthlyPrice}/mo)`}
                  </span>
                </button>

                <button
                  type="button"
                  id="creator-modal-send-stars-btn"
                  onClick={() => setIsSendStarsModalOpen(true)}
                  className="py-2.5 px-4 rounded-2xl border border-amber-400/50 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
                >
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span>Send Gift (Stars ⭐)</span>
                </button>
              </div>

              {/* Subscriber & Supporter Status Badge */}
              {(isSubscribed || starsGiftedTotal > 0) && (
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 size={14} />
                    <span>You are an active supporter of this creator</span>
                  </div>
                  {starsGiftedTotal > 0 && (
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Star size={12} className="fill-amber-300" />
                      <span>{starsGiftedTotal} Stars Gifted</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Notice when creator has monetization turned OFF */}
          {isCreator && !creatorMonetizationOn && (
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
              isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <div className="flex items-center gap-2 text-xs">
                <AlertCircle size={15} className="text-slate-400 shrink-0" />
                <span>Monetization methods are currently paused by this creator. Subscriptions and Star gifts are closed.</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* REQUIREMENT 2 & 3: FAN ACCOUNT SPECIFIC (FAN CANNOT GET MONETIZATION METHODS) */}
          {/* ========================================================================= */}
          {isFan && (
            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-pink-500/10 border-pink-500/20 text-slate-300' : 'bg-pink-50 border-pink-200 text-slate-700'
            }`}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Heart size={18} className="fill-pink-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-pink-400">
                    Community Fan Account
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    This member has a registered Fan Account. Fan accounts cannot receive monetization methods (such as watch-time ad pools, fan monthly subscriptions, or receiving Stars gifts). Fans enjoy exploring feeds, cheering on artists, and subscribing to creators.
                  </p>
                </div>
              </div>

              {/* Fan Activity highlights */}
              <div className="mt-3.5 grid grid-cols-3 gap-2 pt-3 border-t border-inherit text-center">
                <div className="p-2 rounded-xl bg-black/10 dark:bg-white/5">
                  <div className="text-xs font-black text-inherit">18</div>
                  <div className="text-[10px] text-slate-400">Creators Supported</div>
                </div>
                <div className="p-2 rounded-xl bg-black/10 dark:bg-white/5">
                  <div className="text-xs font-black text-amber-400">1,500 ⭐</div>
                  <div className="text-[10px] text-slate-400">Stars Gifted</div>
                </div>
                <div className="p-2 rounded-xl bg-black/10 dark:bg-white/5">
                  <div className="text-xs font-black text-emerald-400">Active</div>
                  <div className="text-[10px] text-slate-400">Fan Lounge Status</div>
                </div>
              </div>
            </div>
          )}

          {/* Collab Invitation (CREATOR ONLY - NOT visible on fan profiles) */}
          {isCreator && profile.collabOpen !== false && (
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-[#00D2FF]/15 to-purple-500/10 border-[#00D2FF]/30 text-cyan-200'
                  : 'bg-gradient-to-r from-cyan-50 to-purple-50 border-cyan-200 text-cyan-950 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#00D2FF]/20 text-[#00D2FF] flex items-center justify-center shrink-0 ring-1 ring-[#00D2FF]/30">
                  <Sparkles size={17} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D2FF] block">
                    Collab Invitation
                  </span>
                  <span className="text-xs sm:text-sm font-bold truncate block">
                    Seeking: {profile.collabRole || (profile.category ? `${profile.category} Partner` : 'Video Editor & Colorist')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleMessageClick}
                className="gradient-btn-primary px-4 py-1.5 text-xs font-bold text-white rounded-full flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer hover:opacity-95 transition"
              >
                <Sparkles size={12} />
                <span>Connect</span>
              </button>
            </div>
          )}

          {/* Bio Description */}
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-inherit">
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">
              {defaultBio}
            </p>
          </div>

          {/* Social Medias Profile Links */}
          <div className="pt-3 border-t border-inherit">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Social Media Channels
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {platforms.youtube && (
                <a
                  href={platforms.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 transition text-xs font-medium"
                >
                  <Youtube size={16} />
                  <span className="truncate">YouTube</span>
                </a>
              )}

              {platforms.instagram && (
                <a
                  href={platforms.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 rounded-xl bg-pink-600/10 hover:bg-pink-600/20 text-pink-400 border border-pink-500/20 transition text-xs font-medium"
                >
                  <Instagram size={16} />
                  <span className="truncate">Instagram</span>
                </a>
              )}

              {platforms.tiktok && (
                <a
                  href={platforms.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 rounded-xl bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/20 transition text-xs font-medium"
                >
                  <Sparkles size={16} />
                  <span className="truncate">TikTok</span>
                </a>
              )}

              {platforms.x && (
                <a
                  href={platforms.x}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-600/10 hover:bg-slate-600/20 text-slate-300 border border-slate-500/20 transition text-xs font-medium"
                >
                  <Twitter size={16} />
                  <span className="truncate">X (Twitter)</span>
                </a>
              )}

              {platforms.facebook && (
                <a
                  href={platforms.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 transition text-xs font-medium"
                >
                  <Facebook size={16} />
                  <span className="truncate">Facebook</span>
                </a>
              )}

              {platforms.website && (
                <a
                  href={platforms.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 transition text-xs font-medium"
                >
                  <Globe size={16} />
                  <span className="truncate">Website</span>
                </a>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* REQUIREMENT 3: CREATOR PORTFOLIO & SUBSCRIBER-ONLY CONTENT LOCK */}
          {/* (ONLY VISIBLE FOR CREATORS - NOT VISIBLE FOR FAN ACCOUNTS) */}
          {/* ========================================================================= */}
          {isCreator && (
            <div className="pt-3 border-t border-inherit">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#00D2FF] uppercase tracking-wider flex items-center gap-1.5">
                  <Play size={14} className="fill-[#00D2FF]" />
                  <span>Featured Work & Creations</span>
                </span>
                <span className="text-[10px] text-slate-400">Verified Activity</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Public Work (Always accessible) */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800 group border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80"
                    alt="Public Work"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Play size={24} fill="white" className="text-white" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xl">
                    <span>Public Work: Commercial Reel</span>
                    <span className="text-emerald-400">Free Access</span>
                  </div>
                </div>

                {/* 2. Exclusive Subscriber-Only Work */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-amber-500/30 group">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
                    alt="Subscriber Masterclass"
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition ${
                      isSubscribed ? 'group-hover:scale-105' : 'blur-xs'
                    }`}
                  />

                  {/* If NOT Subscribed: Content is locked & NOT visible */}
                  {!isSubscribed ? (
                    <div className="absolute inset-0 bg-black/75 p-3 flex flex-col items-center justify-center text-center">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mb-1.5 ring-1 ring-amber-400/40">
                        <Lock size={15} />
                      </div>
                      <span className="text-[11px] font-black text-white leading-tight">
                        Subscriber-Only Work
                      </span>
                      <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">
                        4K Color Grading Masterclass & RAW Assets
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsSubscribeModalOpen(true)}
                        className="mt-2 px-3 py-1 rounded-xl gradient-btn-primary text-white text-[10px] font-bold shadow-md cursor-pointer flex items-center gap-1"
                      >
                        <Crown size={11} className="text-amber-300" />
                        <span>Subscribe (${monthlyPrice}/mo) to Unlock</span>
                      </button>
                    </div>
                  ) : (
                    /* If IS Subscribed: Content unlocked */
                    <>
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Play size={24} fill="white" className="text-white" />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-bold text-white bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-xl">
                        <span className="flex items-center gap-1 text-amber-300">
                          <Crown size={12} />
                          <span>Subscriber Exclusive</span>
                        </span>
                        <span className="text-emerald-400">Unlocked ✓</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Note: Reminding visitor that private owner controls are not visible */}
          <div className="pt-2 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-500">
              Viewing Public Profile • Private account settings, payout bank details, and drafts are not visible to visitors.
            </span>
          </div>
        </div>
      </div>

      {/* Subscribe to Creator Modal */}
      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        creatorProfile={profile}
        monthlyPrice={monthlyPrice}
        isDarkMode={isDarkMode}
        onSubscribed={handleSubscribedSuccess}
      />

      {/* Send Stars Gift Modal */}
      <SendStarsModal
        isOpen={isSendStarsModalOpen}
        onClose={() => setIsSendStarsModalOpen(false)}
        creatorProfile={profile}
        isDarkMode={isDarkMode}
        onStarsSent={handleStarsSentSuccess}
      />
    </div>
  );
};
