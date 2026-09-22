import React, { useState } from 'react';
import { Post, Story, UserProfile, Creator, Reel } from '../types';
import { StoryTray } from './StoryTray';
import { PostCard } from './PostCard';
import { ReelPostCard } from './ReelPostCard';
import { SAMPLE_CREATORS } from '../data/sampleData';
import { SAMPLE_REELS } from '../data/sampleMedia';
import {
  Sparkles,
  Image as ImageIcon,
  Users,
  Video,
  PlusCircle,
  TrendingUp,
  Flame,
  Search,
  Radio,
  Film,
  ShieldCheck,
  Check,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { AccountBadge } from './AccountBadge';
import { ProfileDetailsData } from './UserProfileModal';

interface HomeFeedProps {
  stories: Story[];
  posts: Post[];
  reels?: Reel[];
  userProfile: UserProfile | null;
  onOpenAddStory: () => void;
  onSelectStory: (story: Story) => void;
  onOpenCreatePost: () => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onSelectCreator: (creator: Creator) => void;
  onStartChatWithAuthor?: (author: { name: string; handle: string; avatar: string; role: 'creator' | 'fan' }) => void;
  onViewAuthorProfile?: (author: ProfileDetailsData) => void;
  onOpenCollabCall?: () => void;
  onShareToStory?: (post: Post) => void;
  onOpenVerifiedModal?: () => void;
  isDarkMode: boolean;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  stories,
  posts,
  reels,
  userProfile,
  onOpenAddStory,
  onSelectStory,
  onOpenCreatePost,
  onLikePost,
  onAddComment,
  onSelectCreator,
  onStartChatWithAuthor,
  onViewAuthorProfile,
  onOpenCollabCall,
  onShareToStory,
  onOpenVerifiedModal,
  isDarkMode,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const feedReels: Reel[] = reels && reels.length > 0 ? reels : SAMPLE_REELS;

  const categories = [
    { id: 'all', label: 'All Feed' },
    { id: 'reels', label: 'Reels 🎬' },
    { id: 'collabs', label: 'Go Live 🔴' },
    { id: 'Production', label: 'Production' },
    { id: 'Filmmaking', label: 'Filmmaking' },
    { id: 'Design & 3D', label: 'Design & 3D' },
    { id: 'Music', label: 'Music' },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'collabs'
        ? post.collabOpen
        : post.category === activeCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const userAvatar =
    userProfile?.avatar ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

  const isVerified = Boolean(
    userProfile?.isVerified ||
      userProfile?.verified ||
      userProfile?.blueTick ||
      (typeof window !== 'undefined' && localStorage.getItem('creatormeet_user_verified') === 'true')
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Center Stream (Stories + Composer + Posts) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* 1. Stories Tray (Where to add story & display added stories) */}
          <StoryTray
            stories={stories}
            userProfile={userProfile}
            onOpenAddStory={onOpenAddStory}
            onSelectStory={onSelectStory}
            isDarkMode={isDarkMode}
          />

          {/* Mobile / Tablet Permanent Verified Notification Banner */}
          {onOpenVerifiedModal && (
            <div className="block lg:hidden">
              <button
                type="button"
                id="mobile-verified-banner-btn"
                onClick={onOpenVerifiedModal}
                className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-left cursor-pointer shadow-md ${
                  isVerified
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-cyan-950/40 via-[#080D26] to-purple-950/40 border-[#00D2FF]/40 text-white'
                      : 'bg-gradient-to-r from-cyan-50 via-white to-blue-50 border-cyan-300 text-slate-900'
                    : isDarkMode
                    ? 'bg-gradient-to-r from-[#00D2FF]/20 via-[#080D26] to-[#FF2E93]/20 border-[#00D2FF]/40 hover:border-[#00D2FF]/70 text-white'
                    : 'bg-gradient-to-r from-cyan-100/70 via-white to-pink-50 border-cyan-300 hover:border-cyan-400 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#00D2FF]/20 border border-[#00D2FF]/40 text-[#00D2FF] flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} className="fill-[#00D2FF]/20" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black truncate">
                        {isVerified ? 'Official Blue Tick Active' : 'Get Verified Badge & Blue Tick'}
                      </span>
                      <ShieldCheck size={14} className="text-[#00D2FF] fill-[#00D2FF]/20 shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {isVerified
                        ? '3x priority reach & VIP creator benefits enabled'
                        : 'Preview how your profile will look with Blue Tick →'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-[#00D2FF]">
                  <span>{isVerified ? 'View' : 'Preview'}</span>
                  <ArrowRight size={13} />
                </div>
              </button>
            </div>
          )}

          {/* 2. Quick Post Creator Box */}
          <div
            className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition-all ${
              isDarkMode
                ? 'bg-[#080D26]/90 border-white/10 shadow-lg shadow-black/20'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={userAvatar}
                alt="Your Avatar"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#FF2E93] shrink-0"
              />
              <button
                onClick={onOpenCreatePost}
                className={`flex-1 text-left px-4 py-2.5 rounded-full text-xs sm:text-sm transition cursor-pointer border ${
                  isDarkMode
                    ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                }`}
              >
                What are you creating today, {userProfile?.fullName?.split(' ')[0] || 'Creator'}?
              </button>
            </div>

            {/* Quick action buttons row */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-inherit">
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={onOpenCreatePost}
                  className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-2.5 rounded-full transition cursor-pointer ${
                    isDarkMode
                      ? 'text-slate-300 hover:bg-white/10'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ImageIcon size={15} className="text-[#00D2FF]" />
                  <span className="hidden sm:inline">Photo/Video</span>
                </button>

                <button
                  onClick={onOpenCollabCall || onOpenCreatePost}
                  id="feed-go-live-quick-btn"
                  className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-full transition cursor-pointer border ${
                    isDarkMode
                      ? 'text-rose-400 hover:bg-rose-500/15 bg-rose-500/10 border-rose-500/20'
                      : 'text-rose-600 hover:bg-rose-100 bg-rose-50 border-rose-200'
                  }`}
                  title="Go Live - Start broadcasting to all viewers"
                >
                  <Radio size={14} className="text-rose-500 animate-pulse" />
                  <span className="font-bold">Go Live</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                </button>
              </div>

              {/* Primary Create Button */}
              <button
                id="feed-create-post-btn"
                onClick={onOpenCreatePost}
                className="gradient-btn-primary px-4 py-1.5 text-xs font-bold text-white rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF1E82]/30 cursor-pointer min-h-[32px]"
              >
                <PlusCircle size={14} />
                <span>Create Post</span>
              </button>
            </div>
          </div>

          {/* 3. Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-[#FF2E93] to-[#7928CA] text-white shadow-xs'
                    : isDarkMode
                    ? 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 4. Posts & Reels Stream (User can view reels as posts when scrolling) */}
          <div className="space-y-4">
            {activeCategory === 'reels' ? (
              feedReels.map((reel) => (
                <ReelPostCard
                  key={reel.id}
                  reel={reel}
                  userProfile={userProfile}
                  onViewAuthorProfile={onViewAuthorProfile}
                  onShareToStory={onShareToStory}
                  isDarkMode={isDarkMode}
                />
              ))
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => {
                // Interleave reel into the home stream after every 2 posts so scrolling users view reels as posts
                const shouldInsertReel = index > 0 && index % 2 === 0;
                const reelIndex = (Math.floor(index / 2) - 1) % feedReels.length;
                const reelToInsert = shouldInsertReel && feedReels[reelIndex] ? feedReels[reelIndex] : null;

                return (
                  <React.Fragment key={post.id}>
                    {reelToInsert && (
                      <ReelPostCard
                        key={`feed-interleaved-reel-${reelToInsert.id}-${index}`}
                        reel={reelToInsert}
                        userProfile={userProfile}
                        onViewAuthorProfile={onViewAuthorProfile}
                        onShareToStory={onShareToStory}
                        isDarkMode={isDarkMode}
                      />
                    )}
                    <PostCard
                      post={post}
                      userProfile={userProfile}
                      onLike={onLikePost}
                      onAddComment={onAddComment}
                      onStartChatWithAuthor={onStartChatWithAuthor}
                      onViewAuthorProfile={onViewAuthorProfile}
                      onShareToStory={onShareToStory}
                      isDarkMode={isDarkMode}
                    />
                  </React.Fragment>
                );
              })
            ) : (
              <div
                className={`text-center py-12 rounded-3xl border ${
                  isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}
              >
                <Sparkles className="mx-auto mb-2 text-[#00D2FF]" size={28} />
                <p className="text-sm font-semibold">No posts in this category yet</p>
                <p className="text-xs mt-1">Be the first to share your creative update!</p>
                <button
                  onClick={onOpenCreatePost}
                  className="mt-4 gradient-btn-primary px-4 py-1.5 text-xs font-bold text-white rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle size={14} />
                  <span>Create First Post</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Recommended Creators, Permanent Verified Card & Highlights */}
        <div className="hidden lg:block space-y-4 sticky top-20 self-start">
          {/* 1. PERMANENT VERIFIED BADGE & BLUE TICK NOTIFICATION CARD */}
          <div
            id="permanent-verified-badge-card"
            className={`rounded-3xl p-5 border transition-all relative overflow-hidden shadow-lg ${
              isVerified
                ? isDarkMode
                  ? 'bg-gradient-to-br from-[#00D2FF]/15 via-[#080D26] to-purple-950/30 border-[#00D2FF]/40 ring-1 ring-[#00D2FF]/30'
                  : 'bg-gradient-to-br from-cyan-50 via-white to-blue-50/70 border-cyan-300 shadow-cyan-100/50'
                : isDarkMode
                ? 'bg-gradient-to-br from-[#00D2FF]/20 via-[#080D26]/95 to-[#FF2E93]/15 border-[#00D2FF]/35 hover:border-[#00D2FF]/60 ring-1 ring-[#00D2FF]/20'
                : 'bg-gradient-to-br from-cyan-50/90 via-white to-pink-50/60 border-cyan-200 hover:border-cyan-300 shadow-md'
            }`}
          >
            {/* Top pill badge */}
            <div className="flex items-center justify-between mb-3.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  isVerified
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/40 animate-pulse'
                }`}
              >
                {isVerified ? (
                  <>
                    <Check size={11} strokeWidth={3} />
                    <span>Blue Tick Active</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={11} />
                    <span>Permanent Notification</span>
                  </>
                )}
              </span>
              <span className="text-[10px] font-bold text-[#00D2FF]">Creator Pass</span>
            </div>

            {/* Header with Title and Description */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00D2FF]/20 border border-[#00D2FF]/40 text-[#00D2FF] flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck size={22} className="fill-[#00D2FF]/20" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-black leading-tight flex items-center gap-1.5 flex-wrap">
                  <span>{isVerified ? 'Official Blue Tick Verified' : 'Get Verified Badge & Blue Tick'}</span>
                  <ShieldCheck size={16} className="text-[#00D2FF] fill-[#00D2FF]/20 shrink-0" />
                </h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-300 mt-1 leading-snug">
                  {isVerified
                    ? 'Your profile proudly displays the official blue checkmark with 3x feed boost active.'
                    : 'Add the official blue checkmark badge on your profile with priority reach & pro perks.'}
                </p>
              </div>
            </div>

            {/* Mini Live Profile Preview Card */}
            <div
              className={`mt-4 p-3 rounded-2xl border transition-all ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={userAvatar}
                    alt={userProfile?.fullName || 'Creator'}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#00D2FF]"
                  />
                  <div className="absolute -bottom-1 -right-1 p-0.5 bg-[#00D2FF] text-slate-950 rounded-full shadow-sm">
                    <Check size={9} strokeWidth={3} />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black truncate">
                      {userProfile?.fullName || 'Your Name'}
                    </span>
                    <ShieldCheck size={14} className="text-[#00D2FF] fill-[#00D2FF]/20 shrink-0" />
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">
                    @{userProfile?.username || 'yourhandle'}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Zap size={9} /> 3x Feed Visibility Boost
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button to open full verified profile preview & subscription modal */}
            {onOpenVerifiedModal && (
              <button
                type="button"
                id="open-verified-badge-modal-btn"
                onClick={onOpenVerifiedModal}
                className={`w-full mt-3.5 py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md ${
                  isVerified
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-white/20'
                    : 'gradient-btn-primary text-white shadow-[#FF1E82]/25 hover:opacity-95'
                }`}
              >
                {isVerified ? (
                  <>
                    <ShieldCheck size={14} className="text-[#00D2FF]" />
                    <span>View Blue Tick & Perks</span>
                    <ArrowRight size={13} />
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    <span>Preview Profile & Get Blue Tick</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Creator Spotlight Box */}
          <div
            className={`rounded-3xl p-5 border transition-all ${
              isDarkMode
                ? 'bg-[#080D26]/90 border-white/10 shadow-lg'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-[#FF2E93]" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Creators to Connect</h4>
              </div>
              <span className="text-[10px] text-[#00D2FF] font-semibold">Top Collaborators</span>
            </div>

            <div className="space-y-3">
              {SAMPLE_CREATORS.slice(0, 4).map((creator) => (
                <div
                  key={creator.id}
                  className={`flex items-center justify-between gap-2 p-2 rounded-2xl transition cursor-pointer ${
                    isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'
                  }`}
                  onClick={() => onSelectCreator(creator)}
                >
                  <div className="flex items-center gap-2.5 min-w-0 text-left">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-white/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold truncate">{creator.name}</span>
                        <span className="text-[11px]">{creator.flag}</span>
                      </div>
                      <span className={`text-[10px] block truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500 font-medium'}`}>
                        {creator.category} • {creator.followers}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartChatWithAuthor?.({
                        name: creator.name,
                        handle: creator.handle,
                        avatar: creator.avatar,
                        role: 'creator',
                      });
                    }}
                    className="gradient-btn-primary px-2.5 py-1 text-[11px] font-bold text-white rounded-full shrink-0 cursor-pointer min-h-[26px]"
                  >
                    Chat
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Collab Tips Card */}
          <div
            className={`rounded-3xl p-5 border ${
              isDarkMode
                ? 'bg-gradient-to-br from-indigo-950/40 to-purple-950/30 border-white/10'
                : 'bg-gradient-to-br from-slate-50 to-indigo-50/50 border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold mb-2 text-[#00D2FF]">
              <Sparkles size={14} />
              <span>Pro Collab Tip</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700 font-normal'}`}>
              When creating a post, you can attach high-fidelity media, embed a direct soundtrack, or tag collaborators to co-create!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
