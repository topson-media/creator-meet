import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Users,
  Send,
  Hash,
  Award,
  CheckCircle2,
  Flame,
  UserCheck,
  Plus,
  X,
  Crown,
  Eye,
  MessageSquare,
  ChevronRight,
  Shield,
  Upload,
} from 'lucide-react';
import { PageRoute } from '../types';
import { useAuth } from '../context/AuthContext';
import { AccountBadge } from '../components/AccountBadge';
import { ProfileDetailsData } from '../components/UserProfileModal';

interface FansPageProps {
  isDarkMode: boolean;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onNavigate: (page: PageRoute) => void;
  onRequireAuth?: (action: 'follow' | 'comment' | 'chat', targetName?: string) => boolean;
  onStartChat?: (user: { name: string; handle: string; avatar: string; role: 'creator' | 'fan' }) => void;
  onViewProfile?: (profile: ProfileDetailsData) => void;
}

interface FanThread {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  caption: string;
  timeAgo: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  hasLiked?: boolean;
}

interface LoungeMessage {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  timeAgo: string;
  likes: number;
  hasLiked?: boolean;
  isAdmin?: boolean;
}

interface CommunityLounge {
  id: string;
  title: string;
  category: string;
  description: string;
  activeMembers: number;
  bannerImage: string;
  isJoined?: boolean;
  isAdmin?: boolean;
  adminName?: string;
  messages: LoungeMessage[];
}

export const FansPage: React.FC<FansPageProps> = ({
  isDarkMode,
  onNavigate,
  onRequireAuth,
  onStartChat,
  onViewProfile,
}) => {
  const { userProfile } = useAuth();

  // 1. Mock Data: Trending Communities
  const [communities, setCommunities] = useState<CommunityLounge[]>([
    {
      id: 'comm-1',
      title: 'Cinematic VFX & 3D Lounge',
      category: 'Animation & Film',
      description: 'The premier hangout for CGI artists, Unreal Engine creators & VFX enthusiasts.',
      activeMembers: 14280,
      bannerImage:
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      isJoined: false,
      adminName: 'Elena Rostova',
      messages: [
        {
          id: 'lm-1',
          authorName: 'Elena Rostova',
          authorUsername: 'elenavfx',
          authorAvatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          content: 'Welcome everyone! Sharing my new Blender 4.2 lighting preset file in the pinned thread.',
          timeAgo: '2h ago',
          likes: 24,
          isAdmin: true,
        },
        {
          id: 'lm-2',
          authorName: 'Marcus Wright',
          authorUsername: 'mwright',
          authorAvatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          content: 'The subsurface scattering pass looks buttery smooth. Are you rendering with Cycles or Octane?',
          timeAgo: '45m ago',
          likes: 8,
        },
      ],
    },
    {
      id: 'comm-2',
      title: 'Apex Esports & Gaming Hub',
      category: 'Gaming & Streams',
      description: 'Daily tournament watch-parties, clip reactions, and squad match-making.',
      activeMembers: 28940,
      bannerImage:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      isJoined: true,
      adminName: 'Topson Gaming',
      messages: [
        {
          id: 'lm-3',
          authorName: 'Topson Media',
          authorUsername: 'topsonmedia',
          authorAvatar:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          content: 'Squad stream is live tonight at 8 PM EST! Drop your gamer tags below to squad up.',
          timeAgo: '1h ago',
          likes: 56,
          isAdmin: true,
        },
        {
          id: 'lm-4',
          authorName: 'Kai Nakamura',
          authorUsername: 'kainaka',
          authorAvatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          content: 'Count me in for ranked arena! Ranked Diamond II currently.',
          timeAgo: '20m ago',
          likes: 12,
        },
      ],
    },
    {
      id: 'comm-3',
      title: 'Synthwave & Beats Collective',
      category: 'Music Production',
      description: 'Share royalty-free loops, collaborate on stems, and listen to community drops.',
      activeMembers: 9750,
      bannerImage:
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      isJoined: false,
      adminName: 'Aria Beatmaker',
      messages: [
        {
          id: 'lm-5',
          authorName: 'Aria Beatmaker',
          authorUsername: 'ariabeats',
          authorAvatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
          content: 'New 80s analog synth pack dropped! Free for all community lounge members.',
          timeAgo: '3h ago',
          likes: 41,
          isAdmin: true,
        },
      ],
    },
  ]);

  // Active Lounge View State
  const [activeLounge, setActiveLounge] = useState<CommunityLounge | null>(null);
  const [loungeNewMessage, setLoungeNewMessage] = useState('');

  // Create New Lounge State
  const [isCreateLoungeOpen, setIsCreateLoungeOpen] = useState(false);
  const [createLoungeTitle, setCreateLoungeTitle] = useState('');
  const [createLoungeCategory, setCreateLoungeCategory] = useState('Gaming & Streams');
  const [createLoungeDescription, setCreateLoungeDescription] = useState('');
  const [createLoungeBanner, setCreateLoungeBanner] = useState(
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80'
  );

  // 2. Mock Data: Fan-submitted conversation threads
  const [threads, setThreads] = useState<FanThread[]>([
    {
      id: 'thread-1',
      authorName: 'Sarah Jenkins',
      authorUsername: 'sarah_j',
      authorAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      caption:
        "Just finished watching Elena Rostova's color grading masterclass! The subtle teal & warm orange split toning technique totally changed how I export my weekly travel vlogs. Anyone else trying it?",
      timeAgo: '15m ago',
      likesCount: 34,
      commentsCount: 8,
      sharesCount: 3,
      hasLiked: false,
    },
    {
      id: 'thread-2',
      authorName: 'Alex Rivera',
      authorUsername: 'arivera_vfx',
      authorAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      caption:
        "The collaborative audio drops in the Sound Lab are insane this week. Shout out to @topsonmedia for answering community questions in real-time during yesterday's stream! 🚀",
      timeAgo: '1h ago',
      likesCount: 62,
      commentsCount: 14,
      sharesCount: 7,
      hasLiked: true,
    },
    {
      id: 'thread-3',
      authorName: 'Mia Tanaka',
      authorUsername: 'mia_pixels',
      authorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      caption:
        "Excited for the upcoming Creator Meet live showcase! Who is attending the virtual networking circles on Friday? Let's connect beforehand and review each other's portfolio reels!",
      timeAgo: '3h ago',
      likesCount: 89,
      commentsCount: 21,
      sharesCount: 12,
      hasLiked: false,
    },
  ]);

  // Trending tags for right sidebar
  const trendingTags = [
    { tag: '#Gaming', posts: '124.5k posts', hot: true },
    { tag: '#Music', posts: '98.2k posts', hot: true },
    { tag: '#Cinematography', posts: '67.8k posts', hot: false },
    { tag: '#Animation3D', posts: '45.1k posts', hot: false },
    { tag: '#CreatorEconomy', posts: '32.4k posts', hot: false },
  ];

  // Top active fans for right sidebar
  const topActiveFans = [
    {
      id: 'fan-p1',
      name: 'Elena Vance',
      handle: '@elena_vance',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      points: '1,420 XP',
      role: 'fan' as const,
    },
    {
      id: 'fan-p2',
      name: 'Kai Nakamura',
      handle: '@kainaka',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      points: '1,180 XP',
      role: 'fan' as const,
    },
    {
      id: 'fan-p3',
      name: 'Jessica Morris',
      handle: '@jess_morris',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      points: '950 XP',
      role: 'fan' as const,
    },
  ];

  // Post new thread state
  const [newThreadCaption, setNewThreadCaption] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);

  const handleToggleJoinCommunity = (id: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.isJoined;
          const updated = {
            ...c,
            isJoined: next,
            activeMembers: next ? c.activeMembers + 1 : Math.max(1, c.activeMembers - 1),
          };
          if (next) {
            setActiveLounge(updated);
          }
          return updated;
        }
        return c;
      })
    );
  };

  const handleOpenLounge = (comm: CommunityLounge) => {
    setActiveLounge(comm);
  };

  const handleSendLoungeMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loungeNewMessage.trim() || !activeLounge) return;

    const newMessage: LoungeMessage = {
      id: `lounge-msg-${Date.now()}`,
      authorName: userProfile?.fullName || 'You',
      authorUsername: userProfile?.username || 'you',
      authorAvatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      content: loungeNewMessage.trim(),
      timeAgo: 'Just now',
      likes: 1,
      isAdmin: activeLounge.isAdmin,
    };

    const updatedMessages = [newMessage, ...activeLounge.messages];
    const updatedLounge = { ...activeLounge, messages: updatedMessages };

    setActiveLounge(updatedLounge);
    setCommunities((prev) =>
      prev.map((c) => (c.id === activeLounge.id ? updatedLounge : c))
    );
    setLoungeNewMessage('');
  };

  const handleCreateLoungeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createLoungeTitle.trim()) return;

    const newLounge: CommunityLounge = {
      id: `comm-user-${Date.now()}`,
      title: createLoungeTitle.trim(),
      category: createLoungeCategory,
      description:
        createLoungeDescription.trim() ||
        'Welcome to my creator lounge! Join the chat, share ideas, and connect with other community fans.',
      activeMembers: 1,
      bannerImage:
        createLoungeBanner ||
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
      isJoined: true,
      isAdmin: true,
      adminName: userProfile?.fullName || 'You',
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          authorName: userProfile?.fullName || 'You',
          authorUsername: userProfile?.username || 'you',
          authorAvatar:
            userProfile?.avatar ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          content: `Welcome to the official ${createLoungeTitle.trim()} lounge! As admin, I will be hosting discussions and sharing insider updates here.`,
          timeAgo: 'Just now',
          likes: 2,
          isAdmin: true,
        },
      ],
    };

    setCommunities([newLounge, ...communities]);
    setIsCreateLoungeOpen(false);
    setActiveLounge(newLounge);
    setCreateLoungeTitle('');
    setCreateLoungeDescription('');
  };

  const handleLikeThread = (id: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.hasLiked;
          return {
            ...t,
            hasLiked: next,
            likesCount: next ? t.likesCount + 1 : Math.max(0, t.likesCount - 1),
          };
        }
        return t;
      })
    );
  };

  const handleShareThread = (t: FanThread) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#fans?thread=${t.id}`);
    }
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handlePostThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadCaption.trim()) return;

    const newThread: FanThread = {
      id: `thread-${Date.now()}`,
      authorName: userProfile?.fullName || 'Active Fan',
      authorUsername: userProfile?.username || 'active_fan',
      authorAvatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      caption: newThreadCaption.trim(),
      timeAgo: 'Just now',
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      hasLiked: true,
    };

    setThreads([newThread, ...threads]);
    setNewThreadCaption('');
  };

  return (
    <div id="fan-lounge-page" className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Toast */}
      {copiedToast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2 rounded-2xl bg-emerald-500 text-white font-semibold text-xs shadow-2xl animate-fade-in">
          Thread link copied!
        </div>
      )}

      {/* 1. BANNER: Top title "Fan Lounge" with tagline "Meet. Connect. Share. Grow." and prominent photo of happy people */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 border shadow-xl transition-all ${
          isDarkMode
            ? 'bg-gradient-to-br from-[#130924] via-[#0A0D1F] to-[#070A18] border-purple-500/20 text-white'
            : 'bg-gradient-to-br from-purple-50/90 via-pink-50/50 to-white border-purple-100 text-slate-900 shadow-purple-500/5'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-[#FF2E93] border border-pink-500/30">
              <Sparkles size={12} />
              <span>Community Space</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Fan Lounge
            </h1>

            {/* Tagline in glowing purple-to-magenta gradient */}
            <p className="text-lg sm:text-2xl font-black tracking-wide bg-gradient-to-r from-[#9055FF] via-[#D926AA] to-[#FF2E93] bg-clip-text text-transparent">
              Meet. Connect. Share. Grow.
            </p>

            <p className="text-xs sm:text-sm max-w-xl leading-relaxed text-slate-600 dark:text-slate-300">
              Join creator-centric discussions, discover trending fan circles, share updates, and connect with other fans and creators worldwide in a dedicated space.
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 flex-wrap">
              <button
                onClick={() => setIsCreateLoungeOpen(true)}
                className="gradient-btn-primary px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#FF1E82]/25 hover:scale-105 transition cursor-pointer flex items-center gap-2"
              >
                <Plus size={15} />
                <span>Create My Lounge</span>
              </button>

              <button
                onClick={() => {
                  const comm = communities[0];
                  if (comm) handleOpenLounge(comm);
                }}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border transition cursor-pointer flex items-center gap-2 ${
                  isDarkMode
                    ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-xs'
                }`}
              >
                <MessageSquare size={15} className="text-[#00D2FF]" />
                <span>Explore Trending Lounge</span>
              </button>
            </div>
          </div>

          {/* Right Showcase Image Card: Happy girls and boys looking and smiling together */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 ring-4 ring-purple-500/20 group">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
                alt="Happy young people girls and boys smiling and enjoying community"
                referrerPolicy="no-referrer"
                className="w-full h-56 sm:h-64 object-cover object-center group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Status overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold drop-shadow-md">
                    28,000+ Fans & Creators Online
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black uppercase tracking-wider border border-white/20 text-[#00D2FF]">
                  Live Hub
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DISCOVER GRIDS: Trending Communities with Create Lounge & View Lounge */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-[#FF2E93]" />
            <h2 className="text-lg sm:text-xl font-black">Trending Communities</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateLoungeOpen(true)}
              className="gradient-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5 hover:scale-105 transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Create My Lounge</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {communities.map((comm) => (
            <div
              key={comm.id}
              className={`rounded-2xl border overflow-hidden flex flex-col justify-between shadow-md transition-all hover:scale-[1.01] hover:shadow-xl ${
                isDarkMode
                  ? 'bg-[#0B1028] border-white/10 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Card Banner */}
              <div
                onClick={() => comm.isJoined && handleOpenLounge(comm)}
                className={`relative h-36 w-full overflow-hidden ${comm.isJoined ? 'cursor-pointer' : ''}`}
              >
                <img
                  src={comm.bannerImage}
                  alt={comm.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider">
                    {comm.category}
                  </span>
                  {comm.isAdmin && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-black flex items-center gap-1 shadow-md">
                      <Crown size={11} />
                      <span>Admin</span>
                    </span>
                  )}
                </div>

                {/* Total active member counter */}
                <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-xs text-white/90 font-semibold drop-shadow-md">
                  <Users size={14} className="text-[#00D2FF]" />
                  <span>{comm.activeMembers.toLocaleString()} active members</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div
                  onClick={() => comm.isJoined && handleOpenLounge(comm)}
                  className={comm.isJoined ? 'cursor-pointer' : ''}
                >
                  <h3 className="text-base font-bold leading-tight line-clamp-1">{comm.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {comm.description}
                  </p>
                </div>

                {/* Action Buttons: Join or View Lounge */}
                <div className="flex items-center gap-2">
                  {comm.isJoined ? (
                    <button
                      onClick={() => handleOpenLounge(comm)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 gradient-btn-primary text-white hover:opacity-95"
                    >
                      <MessageSquare size={14} />
                      <span>View & Chat in Lounge</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleJoinCommunity(comm.id)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 gradient-btn-primary text-white shadow-[#FF1E82]/25 hover:opacity-95"
                    >
                      <Sparkles size={14} />
                      <span>Join Lounge</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 & 4. TWO-COLUMN LAYOUT: Main Bottom-Left Conversation Feed + Bottom-Right Sidebar Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* 3. CONVERSATION FEED: Timeline view of fan-submitted text threads */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black flex items-center gap-2">
              <MessageCircle size={18} className="text-[#00D2FF]" />
              <span>Community Feed & Discussions</span>
            </h2>
            <span className="text-xs text-slate-400">{threads.length} fan threads</span>
          </div>

          {/* Quick Submit Box */}
          <form
            onSubmit={handlePostThread}
            className={`p-4 rounded-2xl border shadow-sm transition ${
              isDarkMode
                ? 'bg-[#0B1028] border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-start gap-3">
              <img
                src={
                  userProfile?.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                }
                alt="Your avatar"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/30 shrink-0"
              />
              <div className="flex-1 space-y-2">
                <textarea
                  value={newThreadCaption}
                  onChange={(e) => setNewThreadCaption(e.target.value)}
                  placeholder="Share your thoughts, ask fellow fans, or review a recent video..."
                  rows={2}
                  className={`w-full p-3 rounded-xl text-xs border transition focus:outline-hidden ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Posting as verified community fan
                  </span>
                  <button
                    type="submit"
                    disabled={!newThreadCaption.trim()}
                    className="gradient-btn-primary px-4 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-[#FF1E82]/20 disabled:opacity-40 transition cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Post Thread</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Thread list */}
          <div className="space-y-4">
            {threads.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border shadow-xs transition-all ${
                  isDarkMode
                    ? 'bg-[#0B1028] border-white/10 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {/* Header: User avatar, username with Fan Badge, timestamp */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.authorAvatar}
                      alt={item.authorName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00D2FF]/40"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold">{item.authorName}</span>
                        {/* Fan Badge */}
                        <AccountBadge role="fan" size="sm" />
                      </div>
                      <span className="text-[11px] text-slate-400">@{item.authorUsername}</span>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400">{item.timeAgo}</span>
                </div>

                {/* Text caption space */}
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 mb-4 whitespace-pre-line">
                  {item.caption}
                </p>

                {/* Active action icons: Like (Heart), Reply (Comment), Share */}
                <div className="flex items-center gap-6 pt-3 border-t border-inherit text-xs text-slate-500 dark:text-slate-400">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLikeThread(item.id)}
                    className={`flex items-center gap-1.5 cursor-pointer transition ${
                      item.hasLiked ? 'text-[#FF2E93] font-bold' : 'hover:text-[#FF2E93]'
                    }`}
                  >
                    <Heart size={16} className={item.hasLiked ? 'fill-current text-[#FF2E93]' : ''} />
                    <span>{item.likesCount}</span>
                  </button>

                  {/* Reply (Comment) Button */}
                  <button
                    onClick={() => {
                      setNewThreadCaption(`@${item.authorUsername} `);
                    }}
                    className="flex items-center gap-1.5 hover:text-[#00D2FF] cursor-pointer transition"
                  >
                    <MessageCircle size={16} />
                    <span>{item.commentsCount} Replies</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShareThread(item)}
                    className="flex items-center gap-1.5 hover:text-purple-400 cursor-pointer transition"
                  >
                    <Share2 size={15} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. RIGHT SIDEBAR WIDGETS: Two neat boxes: "Trending Tags" (#Gaming, #Music) and "Top Active Fans" showing 3 avatar profiles */}
        <div className="space-y-5">
          {/* Box 1: Trending Tags */}
          <div
            className={`p-5 rounded-2xl border shadow-sm transition ${
              isDarkMode
                ? 'bg-[#0B1028] border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Hash size={18} className="text-[#FF2E93]" />
              <h3 className="text-sm font-black">Trending Tags</h3>
            </div>

            <div className="space-y-2.5">
              {trendingTags.map((t) => (
                <div
                  key={t.tag}
                  onClick={() => {
                    setNewThreadCaption(`${t.tag} `);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition hover:scale-[1.02] ${
                    isDarkMode
                      ? 'bg-white/5 border-white/5 hover:border-pink-500/40'
                      : 'bg-slate-50 border-slate-200 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-pink-500 dark:text-pink-400">
                      {t.tag}
                    </span>
                    {t.hot && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-[#FF2E93] text-white">
                        Hot
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{t.posts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Box 2: Top Active Fans (showing 3 avatar profiles) */}
          <div
            className={`p-5 rounded-2xl border shadow-sm transition ${
              isDarkMode
                ? 'bg-[#0B1028] border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Award size={18} className="text-[#00D2FF]" />
              <h3 className="text-sm font-black">Top Active Fans</h3>
            </div>

            <div className="space-y-3">
              {topActiveFans.map((fan, idx) => (
                <div
                  key={fan.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition ${
                    isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div
                    onClick={() =>
                      onViewProfile?.({
                        id: fan.id,
                        name: fan.name,
                        username: fan.handle.replace('@', ''),
                        avatar: fan.avatar,
                        role: fan.role,
                        verified: false,
                        bio: `Top active community fan with ${fan.points} in the Fan Lounge! Passionate creator supporter and active discussion contributor.`,
                        category: 'Community VIP Fan',
                        country: 'United States',
                        followers: fan.points,
                        coverImage:
                          'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="flex items-center gap-2.5 cursor-pointer group flex-1 min-w-0"
                    title="View Fan Profile"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={fan.avatar}
                        alt={fan.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00D2FF]/40 group-hover:scale-105 transition"
                      />
                      <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight truncate group-hover:text-[#00D2FF] transition flex items-center gap-1">
                        <span>{fan.name}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{fan.handle} • <span className="text-[#FF2E93] font-semibold">{fan.points}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {onViewProfile && (
                      <button
                        onClick={() =>
                          onViewProfile({
                            id: fan.id,
                            name: fan.name,
                            username: fan.handle.replace('@', ''),
                            avatar: fan.avatar,
                            role: fan.role,
                            verified: false,
                            bio: `Top active community fan with ${fan.points} in the Fan Lounge! Passionate creator supporter and active discussion contributor.`,
                            category: 'Community VIP Fan',
                            country: 'United States',
                            followers: fan.points,
                            coverImage:
                              'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
                          })
                        }
                        className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-[#00D2FF] transition cursor-pointer"
                        title="View Profile"
                      >
                        <Eye size={14} />
                      </button>
                    )}

                    {onStartChat && (
                      <button
                        onClick={() =>
                          onStartChat({
                            name: fan.name,
                            handle: fan.handle,
                            avatar: fan.avatar,
                            role: fan.role,
                          })
                        }
                        className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-[#FF2E93] transition cursor-pointer"
                        title="Direct Message"
                      >
                        <Send size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL: Active Lounge Contents, Feed & Real-time Messaging */}
      {activeLounge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveLounge(null);
          }}
        >
          <div
            className={`w-full max-w-2xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
              isDarkMode ? 'bg-[#0B1028] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Lounge Header Banner */}
            <div className="relative h-32 sm:h-40 shrink-0">
              <img
                src={activeLounge.bannerImage}
                alt={activeLounge.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              <button
                onClick={() => setActiveLounge(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition cursor-pointer border border-white/20"
                title="Close Lounge"
              >
                <X size={16} />
              </button>

              <div className="absolute bottom-3 left-4 sm:left-6 right-4 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF2E93] text-white uppercase tracking-wider">
                      {activeLounge.category}
                    </span>
                    {activeLounge.isAdmin && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black flex items-center gap-1 shadow-md">
                        <Crown size={11} />
                        <span>You are Admin</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                    {activeLounge.title}
                  </h2>
                  <p className="text-xs text-white/80 flex items-center gap-2 mt-0.5">
                    <Users size={12} className="text-[#00D2FF]" />
                    <span>{activeLounge.activeMembers.toLocaleString()} members</span>
                    <span>•</span>
                    <span>Admin: {activeLounge.adminName || 'Elena Rostova'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Lounge Description & Info */}
            <div className={`px-4 sm:px-6 py-2.5 border-b text-xs text-slate-500 dark:text-slate-400 ${
              isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'
            }`}>
              {activeLounge.description}
            </div>

            {/* Messages & Posts List inside the Lounge */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="text-center py-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Lounge Discussion Channel
                </span>
              </div>

              {activeLounge.messages.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No messages yet. Be the first to start the conversation!
                </div>
              ) : (
                activeLounge.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      msg.isAdmin
                        ? isDarkMode
                          ? 'bg-purple-950/20 border-purple-500/30'
                          : 'bg-purple-50/70 border-purple-200'
                        : isDarkMode
                        ? 'bg-white/5 border-white/5'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={msg.authorAvatar}
                          alt={msg.authorName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-[#00D2FF]/40"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold">{msg.authorName}</span>
                            {msg.isAdmin && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400/90 text-black">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">@{msg.authorUsername} • {msg.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed pl-10">
                      {msg.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Real-time Post / Message Input for this Lounge */}
            <form
              onSubmit={handleSendLoungeMessage}
              className={`p-3 sm:p-4 border-t flex items-center gap-2 ${
                isDarkMode ? 'border-white/10 bg-[#060919]' : 'border-slate-200 bg-white'
              }`}
            >
              <input
                type="text"
                value={loungeNewMessage}
                onChange={(e) => setLoungeNewMessage(e.target.value)}
                placeholder={`Post or message in ${activeLounge.title}...`}
                className={`flex-1 px-4 py-2.5 rounded-2xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-[#FF2E93] ${
                  isDarkMode
                    ? 'bg-white/5 border-white/15 text-white placeholder-slate-500'
                    : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                type="submit"
                disabled={!loungeNewMessage.trim()}
                className="gradient-btn-primary px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-md flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition cursor-pointer"
              >
                <Send size={14} />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: Create New Community Lounge */}
      {isCreateLoungeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCreateLoungeOpen(false);
          }}
        >
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-7 space-y-5 transition-all ${
              isDarkMode ? 'bg-[#0B1028] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown size={20} className="text-amber-400" />
                <h2 className="text-lg sm:text-xl font-black">Create Your Community Lounge</h2>
              </div>
              <button
                onClick={() => setIsCreateLoungeOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-inherit transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Create a dedicated community space for fans and creators. You will be the creator and <strong>Admin</strong> with full control over topics and conversations.
            </p>

            <form onSubmit={handleCreateLoungeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">Lounge Title *</label>
                <input
                  type="text"
                  required
                  value={createLoungeTitle}
                  onChange={(e) => setCreateLoungeTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Game Developers Lab"
                  className={`w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-[#FF2E93] ${
                    isDarkMode
                      ? 'bg-white/5 border-white/15 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">Category</label>
                <select
                  value={createLoungeCategory}
                  onChange={(e) => setCreateLoungeCategory(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-[#00D2FF] ${
                    isDarkMode
                      ? 'bg-[#060919] border-white/15 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="Gaming & Streams">Gaming & Streams</option>
                  <option value="Animation & Film">Animation & Film</option>
                  <option value="Music Production">Music Production</option>
                  <option value="AI & Digital Tech">AI & Digital Tech</option>
                  <option value="Lifestyle & Fitness">Lifestyle & Fitness</option>
                  <option value="Visual Art & Design">Visual Art & Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">About this Lounge</label>
                <textarea
                  rows={3}
                  value={createLoungeDescription}
                  onChange={(e) => setCreateLoungeDescription(e.target.value)}
                  placeholder="Describe the rules, purpose, and topics discussed in your lounge..."
                  className={`w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-[#FF2E93] ${
                    isDarkMode
                      ? 'bg-white/5 border-white/15 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">Banner Image URL</label>
                <input
                  type="url"
                  value={createLoungeBanner}
                  onChange={(e) => setCreateLoungeBanner(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className={`w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-[#00D2FF] ${
                    isDarkMode
                      ? 'bg-white/5 border-white/15 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateLoungeOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!createLoungeTitle.trim()}
                  className="gradient-btn-primary px-5 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Crown size={14} />
                  <span>Launch My Lounge as Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
