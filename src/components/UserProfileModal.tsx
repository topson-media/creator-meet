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
  Heart,
  Calendar,
  Share2,
} from 'lucide-react';
import { UserRole } from '../types';
import { AccountBadge } from './AccountBadge';

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
  const [activeTab, setActiveTab] = useState<'about' | 'works' | 'collabs'>('about');
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    if (!profile) return;

    // Read followed users from localStorage
    try {
      const stored = localStorage.getItem('creatormeet_followed_ids');
      const followedIds: string[] = stored ? JSON.parse(stored) : [];
      setIsFollowing(followedIds.includes(profile.id));
    } catch {
      setIsFollowing(Boolean(profile.isFollowing));
    }

    // Set initial follower count
    if (typeof profile.followersCount === 'number') {
      setFollowers(profile.followersCount);
    } else if (typeof profile.followersCount === 'string') {
      const parsed = parseInt(profile.followersCount.replace(/[^0-9]/g, ''));
      setFollowers(parsed || 1420);
    } else {
      setFollowers(profile.role === 'creator' ? 2450 : 88);
    }
  }, [profile?.id]);

  if (!isOpen || !profile) return null;

  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowers((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    // Save to localStorage
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

  const defaultCover =
    profile.role === 'creator'
      ? 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80'
      : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80';

  const defaultBio =
    profile.bio ||
    (profile.role === 'creator'
      ? 'Passionate digital creator exploring cinema, audio, and design. Open for dynamic collaborations on Creator Meet!'
      : 'Community enthusiast and creative supporter following inspiring storytellers and artists worldwide.');

  // Default social links if not specified
  const platforms = profile.platforms || {
    youtube: `https://youtube.com/@${profile.username}`,
    instagram: `https://instagram.com/${profile.username}`,
    tiktok: `https://tiktok.com/@${profile.username}`,
    x: `https://x.com/${profile.username}`,
    facebook: `https://facebook.com/${profile.username}`,
    website: `https://${profile.username}.creatorspace.net`,
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

        {copiedToast && (
          <div className="absolute top-14 right-4 z-40 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold shadow-lg animate-fade-in">
            Profile link copied!
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
        <div className="px-5 sm:px-6 pb-6 relative -mt-14">
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

            {/* Action Buttons: Message & Follow / Unfollow */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id="user-profile-message-btn"
                onClick={handleMessageClick}
                className="px-3.5 py-2 text-xs font-bold rounded-full border border-white/20 hover:border-white/40 text-inherit bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5 cursor-pointer min-h-[34px]"
              >
                <MessageSquarePlus size={14} className="text-[#00D2FF]" />
                <span>Message</span>
              </button>

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

              {profile.role === 'creator' && onOpenCollabModal && (
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
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <AccountBadge role={profile.role} size="md" />

            {profile.category && (
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-semibold text-[11px]">
                {profile.category}
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

          {/* Collab Invitation on visited profile */}
          <div
            className={`mt-3.5 p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
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

          {/* 3. Bio Description */}
          <div className="mt-3.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-inherit">
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">
              {defaultBio}
            </p>
          </div>

          {/* 4. Social Medias Profile Links */}
          <div className="mt-4 pt-3.5 border-t border-inherit">
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

          {/* 5. Creator Portfolio / Highlights Preview */}
          <div className="mt-4 pt-3.5 border-t border-inherit">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#00D2FF] uppercase tracking-wider">
                Featured Work & Activity
              </span>
              <span className="text-[10px] text-slate-400">Verified Activity</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-800 group">
                <img
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80"
                  alt="Work 1"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Play size={20} fill="white" className="text-white" />
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-800 group">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
                  alt="Work 2"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Play size={20} fill="white" className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
