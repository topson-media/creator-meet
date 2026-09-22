import React, { useState, useRef, useEffect } from 'react';
import { Reel, UserProfile } from '../types';
import { SAMPLE_REELS } from '../data/sampleMedia';
import { AccountBadge } from './AccountBadge';
import { ProfileDetailsData } from './UserProfileModal';
import {
  Heart,
  MessageCircle,
  Share2,
  Music,
  Plus,
  Volume2,
  VolumeX,
  Play,
  Sparkles,
  Send,
  X,
  Upload,
  ShieldCheck,
  ExternalLink,
  Check,
  Flame,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface ReelsPageProps {
  userProfile: UserProfile | null;
  isDarkMode: boolean;
  onViewProfile?: (profile: ProfileDetailsData) => void;
  onStartChat?: (user: { name: string; handle: string; avatar: string; role: 'creator' | 'fan' }) => void;
  onRequireAuth?: (action: string) => boolean;
}

export const ReelsPage: React.FC<ReelsPageProps> = ({
  userProfile,
  isDarkMode,
  onViewProfile,
  onStartChat,
  onRequireAuth,
}) => {
  const [reels, setReels] = useState<Reel[]>(SAMPLE_REELS);
  const [isMuted, setIsMuted] = useState(false);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [playingStates, setPlayingStates] = useState<{ [index: number]: boolean }>({ 0: true });

  // Modals & toasts
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [activeCommentReel, setActiveCommentReel] = useState<Reel | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);
  const [showCreateReelModal, setShowCreateReelModal] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [newMusicTitle, setNewMusicTitle] = useState('Chill Creator Beats');
  const [newFileName, setNewFileName] = useState<string | null>(null);

  // References to reel cards and video elements
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Intersection Observer for auto-playing active snap card and pausing out-of-view videos
  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      threshold: 0.65, // Must be 65% visible to count as active
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const indexAttr = entry.target.getAttribute('data-reel-index');
        if (indexAttr === null) return;
        const index = parseInt(indexAttr, 10);
        const video = videoRefs.current[index];

        if (entry.isIntersecting) {
          setActiveReelIndex(index);
          if (video) {
            video.currentTime = 0;
            video
              .play()
              .then(() => {
                setPlayingStates((prev) => ({ ...prev, [index]: true }));
              })
              .catch(() => {
                setPlayingStates((prev) => ({ ...prev, [index]: false }));
              });
          }
        } else {
          if (video) {
            video.pause();
            setPlayingStates((prev) => ({ ...prev, [index]: false }));
          }
        }
      });
    }, observerOptions);

    reelRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [reels]);

  // Toggle play/pause for a specific reel
  const handleTogglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setPlayingStates((prev) => ({ ...prev, [index]: true }));
    } else {
      video.pause();
      setPlayingStates((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Scroll to previous or next reel
  const handleScrollToReel = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < reels.length) {
      const el = reelRefs.current[targetIndex];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Toggle global mute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRefs.current.forEach((v) => {
      if (v) v.muted = nextMuted;
    });
  };

  // Like / Unlike Reel
  const handleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextLiked = !r.hasLiked;
          return {
            ...r,
            hasLiked: nextLiked,
            likesCount: nextLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
          };
        }
        return r;
      })
    );
  };

  // Toggle Follow
  const handleToggleFollow = (authorId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.authorId === authorId) {
          return {
            ...r,
            isFollowing: !r.isFollowing,
          };
        }
        return r;
      })
    );
  };

  // Share Reel
  const handleShareReel = (reel: Reel) => {
    const url = `${window.location.origin}/#reels?id=${reel.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  // Open Comments
  const handleOpenComments = (reel: Reel) => {
    setActiveCommentReel(reel);
    setShowCommentsModal(true);
  };

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeCommentReel) return;

    const newComment = {
      id: `rc-${Date.now()}`,
      authorName: userProfile?.fullName || 'You',
      authorUsername: userProfile?.username || 'you',
      authorAvatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      authorRole: userProfile?.role || 'creator',
      content: commentInput.trim(),
      createdAt: 'Just now',
    };

    setReels((prev) =>
      prev.map((r) => {
        if (r.id === activeCommentReel.id) {
          const updated = {
            ...r,
            commentsCount: r.commentsCount + 1,
            comments: [newComment, ...(r.comments || [])],
          };
          setActiveCommentReel(updated);
          return updated;
        }
        return r;
      })
    );

    setCommentInput('');
  };

  // Upload local video file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFileName(file.name);
    const localUrl = URL.createObjectURL(file);
    setNewVideoUrl(localUrl);
  };

  // Submit new Reel
  const handleCreateReelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl) return;

    const newReel: Reel = {
      id: `reel-${Date.now()}`,
      authorId: userProfile?.id || 'current-user',
      authorName: userProfile?.fullName || 'You',
      authorUsername: userProfile?.username || 'you',
      authorAvatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      authorRole: userProfile?.role || 'creator',
      verified: true,
      videoUrl: newVideoUrl,
      caption: newCaption || 'Creative reel dropped on Creator Meet! 🎥✨',
      musicTitle: newMusicTitle,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      hasLiked: true,
      createdAt: 'Just now',
      comments: [],
    };

    setReels([newReel, ...reels]);
    setShowCreateReelModal(false);
    setNewCaption('');
    setNewFileName(null);

    // Scroll to top reel
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    /* 1. FULL-SCREEN SCROLL CONTAINER */
    <div
      ref={containerRef}
      id="reels-main-scroll-container"
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black relative select-none"
    >
      {/* Fixed Header floating on top of reels */}
      <div className="fixed top-3 left-4 md:left-72 right-4 z-40 flex items-center justify-between pointer-events-none">
        {/* Brand indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white pointer-events-auto">
          <Sparkles size={14} className="text-[#FF2E93]" />
          <span className="text-xs font-black tracking-wider uppercase">Reels</span>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition cursor-pointer border border-white/15"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={() => setShowCreateReelModal(true)}
            className="gradient-btn-primary px-3.5 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-[#FF1E82]/30 hover:scale-105 transition cursor-pointer"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Post Reel</span>
          </button>
        </div>
      </div>

      {/* Copied Link Toast */}
      {copiedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-emerald-500 text-white font-semibold text-xs shadow-2xl flex items-center gap-1.5 animate-fade-in">
          <Check size={14} />
          <span>Reel link copied to clipboard!</span>
        </div>
      )}

      {/* 2. REEL CARD DIMENSIONS */}
      {reels.map((reel, index) => {
        const isCurrentActive = activeReelIndex === index;
        const isPlaying = playingStates[index] ?? false;

        return (
          <div
            key={reel.id}
            ref={(el) => (reelRefs.current[index] = el)}
            data-reel-index={index}
            className="h-screen w-full snap-start snap-always relative flex items-center justify-center bg-black"
          >
            {/* 4. VIDEO SIMULATION/LOGIC WITH OUTER POSITIONING WRAPPER */}
            <div className="relative w-full h-full max-w-[480px] sm:max-h-[92vh] sm:rounded-3xl flex items-center justify-center">
              {/* Inner Video Container (overflow hidden for video and overlays) */}
              <div className="relative w-full h-full sm:rounded-3xl overflow-hidden flex items-center justify-center bg-black shadow-2xl">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={reel.videoUrl}
                  playsInline
                  loop
                  muted={isMuted}
                  onClick={() => handleTogglePlay(index)}
                  className="w-full h-full object-cover cursor-pointer"
                />

              {/* Pause overlay icon when paused */}
              {!isPlaying && (
                <div
                  onClick={() => handleTogglePlay(index)}
                  className="absolute inset-0 flex items-center justify-center bg-black/35 cursor-pointer z-10 transition"
                >
                  <div className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md shadow-2xl border border-white/20 hover:scale-110 transition">
                    <Play size={28} fill="white" className="ml-1" />
                  </div>
                </div>
              )}

              {/* Cinematic Vignette Gradients */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85 pointer-events-none z-10" />

              {/* 3. INTERFACE OVERLAYS: BOTTOM-LEFT CREATOR INFO */}
              <div className="absolute bottom-6 left-4 sm:left-6 z-20 max-w-[72%] sm:max-w-[76%] text-white space-y-2 pointer-events-auto">
                {/* Creator Header */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div
                    onClick={() =>
                      onViewProfile?.({
                        id: reel.authorId,
                        name: reel.authorName,
                        username: reel.authorUsername,
                        avatar: reel.authorAvatar,
                        role: reel.authorRole,
                        verified: reel.verified,
                        coverImage: reel.authorCover,
                        bio: reel.authorBio,
                      })
                    }
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <span className="font-bold text-sm sm:text-base group-hover:text-[#00D2FF] transition flex items-center gap-1 drop-shadow-md">
                      {reel.authorName}
                      {reel.verified && <ShieldCheck size={15} className="text-[#00D2FF]" />}
                    </span>
                  </div>

                  <AccountBadge role={reel.authorRole} size="sm" />

                  {/* Follow Button */}
                  <button
                    onClick={() => handleToggleFollow(reel.authorId)}
                    className={`px-3 py-0.5 rounded-full text-[11px] font-bold border transition cursor-pointer shadow-xs ${
                      reel.isFollowing
                        ? 'bg-white/20 border-white/30 text-white'
                        : 'bg-[#FF2E93] border-[#FF2E93] text-white hover:opacity-95'
                    }`}
                  >
                    {reel.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>

                {/* Caption */}
                <p className="text-xs sm:text-sm font-normal text-white/95 leading-relaxed drop-shadow-md line-clamp-3">
                  {reel.caption}
                </p>

                {/* Music Track */}
                {reel.musicTitle && (
                  <div className="flex items-center gap-2 text-[11px] text-white/80 font-medium">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center animate-spin [animation-duration:5s]">
                      <Music size={11} className="text-[#00D2FF]" />
                    </div>
                    <span className="truncate max-w-[200px]">{reel.musicTitle}</span>
                  </div>
                )}
              </div>

              {/* 3. INTERFACE OVERLAYS: RIGHT-HAND ACTION STACK */}
              <div className="absolute right-4 sm:right-6 bottom-8 z-20 flex flex-col items-center gap-4 text-white pointer-events-auto">
                {/* Creator Avatar with mini Follow Badge */}
                <div className="relative mb-1">
                  <img
                    src={reel.authorAvatar}
                    alt={reel.authorName}
                    referrerPolicy="no-referrer"
                    onClick={() =>
                      onViewProfile?.({
                        id: reel.authorId,
                        name: reel.authorName,
                        username: reel.authorUsername,
                        avatar: reel.authorAvatar,
                        role: reel.authorRole,
                        verified: reel.verified,
                        coverImage: reel.authorCover,
                        bio: reel.authorBio,
                      })
                    }
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#00D2FF] cursor-pointer hover:scale-105 transition shadow-lg"
                  />
                  {!reel.isFollowing && (
                    <button
                      onClick={() => handleToggleFollow(reel.authorId)}
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FF2E93] text-white flex items-center justify-center text-[10px] font-bold shadow-md hover:scale-110 transition cursor-pointer"
                      title="Follow"
                    >
                      <Plus size={10} />
                    </button>
                  )}
                </div>

                {/* Like Button */}
                <button
                  onClick={() => handleLikeReel(reel.id)}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                  title="Like Reel"
                >
                  <div
                    className={`p-3 rounded-full backdrop-blur-md transition ${
                      reel.hasLiked
                        ? 'bg-[#FF2E93] text-white scale-110 shadow-lg shadow-[#FF2E93]/40'
                        : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                  >
                    <Heart size={20} className={reel.hasLiked ? 'fill-current' : ''} />
                  </div>
                  <span className="text-[11px] font-bold drop-shadow-md">
                    {reel.likesCount.toLocaleString()}
                  </span>
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => handleOpenComments(reel)}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                  title="Comments"
                >
                  <div className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition">
                    <MessageCircle size={20} />
                  </div>
                  <span className="text-[11px] font-bold drop-shadow-md">
                    {reel.comments?.length || reel.commentsCount}
                  </span>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => handleShareReel(reel)}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                  title="Share Reel Link"
                >
                  <div className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition">
                    <Share2 size={19} />
                  </div>
                  <span className="text-[10px] font-semibold drop-shadow-md">Share</span>
                </button>

                {/* Original Post / Source URL Button */}
                <button
                  onClick={() => {
                    handleShareReel(reel);
                  }}
                  className="p-3 rounded-full bg-black/50 hover:bg-[#00D2FF] hover:text-black text-white backdrop-blur-md transition cursor-pointer"
                  title="Original Post Link"
                >
                  <ExternalLink size={18} />
                </button>

                {/* Direct Message Author */}
                {onStartChat && (
                  <button
                    onClick={() => {
                      onStartChat({
                        name: reel.authorName,
                        handle: `@${reel.authorUsername}`,
                        avatar: reel.authorAvatar,
                        role: reel.authorRole,
                      });
                    }}
                    className="p-3 rounded-full bg-black/50 hover:bg-gradient-to-r hover:from-[#FF2E93] hover:to-[#7928CA] text-white backdrop-blur-md transition cursor-pointer"
                    title="Send Message"
                  >
                    <Send size={18} />
                  </button>
                )}
              </div>

              </div>

              {/* Top and Bottom Arrows at a short distance from the reel on the right */}
              <div className="absolute right-2 sm:-right-16 md:-right-20 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 pointer-events-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScrollToReel(index - 1);
                  }}
                  disabled={index === 0}
                  className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition cursor-pointer shadow-2xl ${
                    index === 0
                      ? 'bg-black/30 border-white/10 text-white/20 cursor-not-allowed'
                      : 'bg-black/75 hover:bg-black/95 border-white/30 text-white hover:text-[#00D2FF] hover:border-[#00D2FF] hover:scale-110 active:scale-95'
                  }`}
                  title="Previous Reel (Up)"
                  aria-label="Previous Reel"
                >
                  <ChevronUp size={24} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScrollToReel(index + 1);
                  }}
                  disabled={index === reels.length - 1}
                  className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition cursor-pointer shadow-2xl ${
                    index === reels.length - 1
                      ? 'bg-black/30 border-white/10 text-white/20 cursor-not-allowed'
                      : 'bg-black/75 hover:bg-black/95 border-white/30 text-white hover:text-[#FF2E93] hover:border-[#FF2E93] hover:scale-110 active:scale-95'
                  }`}
                  title="Next Reel (Down)"
                  aria-label="Next Reel"
                >
                  <ChevronDown size={24} />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* COMMENTS MODAL / DRAWER */}
      {showCommentsModal && activeCommentReel && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCommentsModal(false);
          }}
        >
          <div
            className={`w-full max-w-md max-h-[75vh] rounded-t-3xl sm:rounded-3xl border shadow-2xl p-4 flex flex-col ${
              isDarkMode
                ? 'bg-[#0A0F2B] border-white/15 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <MessageCircle size={16} className="text-[#00D2FF]" />
                <span>
                  Comments ({activeCommentReel.comments?.length || activeCommentReel.commentsCount})
                </span>
              </h3>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Comment list */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {activeCommentReel.comments && activeCommentReel.comments.length > 0 ? (
                activeCommentReel.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5 text-xs">
                    <img
                      src={c.authorAvatar}
                      alt={c.authorName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 bg-white/5 p-2.5 rounded-2xl">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold flex items-center gap-1">
                          {c.authorName}
                          <AccountBadge role={c.authorRole} size="sm" />
                        </span>
                        <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                      </div>
                      <p className="text-slate-300">{c.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">
                  No comments yet. Join the conversation!
                </p>
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="pt-3 border-t border-inherit flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment on this reel..."
                className={`flex-1 p-2.5 rounded-2xl text-xs border transition ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-400'
                    : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500'
                }`}
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="p-2.5 rounded-2xl gradient-btn-primary text-white disabled:opacity-40 transition cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE REEL MODAL */}
      {showCreateReelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateReelModal(false);
          }}
        >
          <div
            className={`relative w-full max-w-lg rounded-3xl p-6 border shadow-2xl transition-all ${
              isDarkMode
                ? 'bg-[#0A0F29] border-white/15 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full gradient-btn-primary flex items-center justify-center text-white">
                  <Sparkles size={16} />
                </div>
                <h3 className="text-base font-bold">Post New Creator Reel</h3>
              </div>
              <button
                onClick={() => setShowCreateReelModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateReelSubmit} className="space-y-4 pt-4">
              {/* File upload or sample video select */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Video File (MP4, WebM)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:gradient-btn-primary file:text-white cursor-pointer"
                  />
                  {newFileName && (
                    <span className="text-[11px] text-emerald-400 truncate max-w-[150px]">
                      ✓ {newFileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Reel Caption</label>
                <textarea
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Drop an exciting caption, keywords, or hashtags #creative #creator"
                  rows={3}
                  className={`w-full p-3 rounded-2xl text-xs border transition ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Music / Audio Track Title */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Audio / Music Track
                </label>
                <div className="flex items-center gap-2">
                  <Music size={15} className="text-[#00D2FF]" />
                  <input
                    type="text"
                    value={newMusicTitle}
                    onChange={(e) => setNewMusicTitle(e.target.value)}
                    placeholder="e.g. Original Audio - Topson Sound Lab"
                    className={`flex-1 p-2.5 rounded-xl text-xs border transition ${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-700 text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full gradient-btn-primary py-3 rounded-full text-xs font-bold text-white shadow-lg shadow-[#FF1E82]/30 cursor-pointer hover:opacity-95 transition"
              >
                Publish Reel to Feed
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
