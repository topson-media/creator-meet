import React, { useState } from 'react';
import { X, CheckCircle2, Youtube, Instagram, Facebook, Heart, MessageCircle, Play, MessageSquarePlus } from 'lucide-react';
import { Creator } from '../types';
import { AccountBadge } from './AccountBadge';

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator | null;
  isDarkMode: boolean;
  onOpenCollabModal?: () => void;
  onRequireAuth?: (action: 'follow' | 'comment' | 'chat', targetName?: string) => boolean;
  onStartChat?: (user: { name: string; handle: string; avatar: string; role: 'creator' | 'fan' }) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  isOpen,
  onClose,
  creator,
  isDarkMode,
  onOpenCollabModal,
  onRequireAuth,
  onStartChat,
}) => {
  const [following, setFollowing] = useState(false);

  if (!isOpen || !creator) return null;

  const handleFollowClick = () => {
    if (onRequireAuth && !onRequireAuth('follow', creator.name)) {
      return;
    }
    setFollowing(!following);
  };

  const handleChatClick = () => {
    if (onRequireAuth && !onRequireAuth('chat', creator.name)) {
      return;
    }
    onClose();
    if (onStartChat) {
      onStartChat({
        name: creator.name,
        handle: creator.handle,
        avatar: creator.avatar,
        role: creator.accountType || 'creator',
      });
    }
  };

  const handleCollabClick = () => {
    if (onRequireAuth && !onRequireAuth('chat', creator.name)) {
      return;
    }
    onClose();
    onOpenCollabModal?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all ${
          isDarkMode
            ? 'bg-[#0A0F2B] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Cover Header Banner */}
        <div className="relative h-36 sm:h-44 bg-slate-800 overflow-hidden">
          <img
            src={creator.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'}
            alt="Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2B] via-transparent to-black/30" />
        </div>

        {/* Profile Info Area */}
        <div className="px-5 pb-5 relative -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="flex items-end gap-3">
              <div className="relative">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover border-3 border-[#0A0F2B] shadow-xl"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0A0F2B] rounded-full" />
              </div>
              <div className="mb-0.5">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg sm:text-xl font-bold">{creator.name}</h2>
                  {creator.verified && (
                    <CheckCircle2 size={16} className="text-[#00D2FF] fill-[#00D2FF]/20" />
                  )}
                </div>
                <p className="text-xs text-slate-400">{creator.handle}</p>
              </div>
            </div>

            {/* Small Attractive Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleChatClick}
                className="px-3 py-1.5 text-xs font-semibold rounded-full border border-white/20 hover:border-white/40 text-white bg-white/5 transition flex items-center gap-1 cursor-pointer min-h-[30px]"
              >
                <MessageSquarePlus size={13} className="text-[#00D2FF]" />
                <span>Chat</span>
              </button>

              <button
                onClick={handleFollowClick}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition cursor-pointer min-h-[30px] ${
                  following
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-[#0080FF] hover:bg-[#0070e0] text-white shadow-xs'
                }`}
              >
                {following ? 'Following' : 'Follow'}
              </button>

              <button
                onClick={handleCollabClick}
                className="gradient-btn-primary px-3.5 py-1.5 text-xs font-semibold text-white rounded-full shadow-xs cursor-pointer min-h-[30px]"
              >
                <span>Collab</span>
              </button>
            </div>
          </div>

          {/* Badges & Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <AccountBadge role={creator.accountType || 'creator'} size="sm" />
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] flex items-center gap-1">
              <span>{creator.flag}</span>
              <span>{creator.country}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium">
              {creator.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-white text-[11px] font-bold">
              {creator.followers} followers
            </span>
          </div>

          {/* Bio */}
          <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {creator.bio}
          </p>

          {/* Social Platforms Row */}
          <div className="mt-3 flex items-center gap-2 pt-2.5 border-t border-white/10 text-slate-400">
            <span className="text-xs text-slate-400 font-medium">Platforms:</span>
            {creator.platforms.youtube && (
              <a
                href={creator.platforms.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-md bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition"
              >
                <Youtube size={14} />
              </a>
            )}
            {creator.platforms.instagram && (
              <a
                href={creator.platforms.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-md bg-pink-600/20 text-pink-400 hover:bg-pink-600 hover:text-white transition"
              >
                <Instagram size={14} />
              </a>
            )}
            {creator.platforms.facebook && (
              <a
                href={creator.platforms.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-md bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition"
              >
                <Facebook size={14} />
              </a>
            )}
          </div>

          {/* Featured Post Preview */}
          {creator.featuredPost && (
            <div className="mt-4 p-3 rounded-xl bg-[#060919] border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#00D2FF] uppercase tracking-wider">
                  Featured Release
                </span>
                <span className="text-[10px] text-slate-400">{creator.featuredPost.timeAgo}</span>
              </div>
              <h4 className="text-xs font-semibold text-white mb-2">
                {creator.featuredPost.title}
              </h4>
              <div className="relative rounded-lg overflow-hidden aspect-video bg-slate-900 group cursor-pointer max-h-48">
                <img
                  src={creator.featuredPost.thumbnail}
                  alt="Thumbnail"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#FF2E93] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Play size={16} fill="white" className="ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
