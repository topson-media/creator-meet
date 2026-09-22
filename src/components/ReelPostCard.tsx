import React, { useState, useRef, useEffect } from 'react';
import { Reel, UserProfile } from '../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  Plus,
  Check,
  Send,
  X,
  Link2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { ProfileDetailsData } from './UserProfileModal';

interface ReelPostCardProps {
  reel: Reel;
  userProfile: UserProfile | null;
  onLike?: (reelId: string) => void;
  onAddComment?: (reelId: string, commentText: string) => void;
  onViewAuthorProfile?: (author: ProfileDetailsData) => void;
  onShareToStory?: (post: any) => void;
  isDarkMode: boolean;
}

export const ReelPostCard: React.FC<ReelPostCardProps> = ({
  reel,
  userProfile,
  onLike,
  onAddComment,
  onViewAuthorProfile,
  onShareToStory,
  isDarkMode,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likesCount || 340);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpandedWords, setIsExpandedWords] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState(reel.comments || []);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sentFollowers, setSentFollowers] = useState<string[]>([]);
  const [storyShared, setStoryShared] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isOwnReel =
    userProfile?.username === reel.authorUsername ||
    userProfile?.id === reel.authorId;

  // Read initial follow status
  useEffect(() => {
    try {
      const stored = localStorage.getItem('creatormeet_followed_ids');
      if (stored) {
        const followedIds: string[] = JSON.parse(stored);
        setIsFollowing(followedIds.includes(reel.authorId) || followedIds.includes(reel.authorUsername));
      }
    } catch {
      // ignore
    }
  }, [reel.authorId, reel.authorUsername]);

  const handleToggleFollow = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    try {
      const stored = localStorage.getItem('creatormeet_followed_ids');
      let followedIds: string[] = stored ? JSON.parse(stored) : [];
      if (next) {
        followedIds.push(reel.authorId);
      } else {
        followedIds = followedIds.filter((id) => id !== reel.authorId && id !== reel.authorUsername);
      }
      localStorage.setItem('creatormeet_followed_ids', JSON.stringify(followedIds));
    } catch (e) {
      console.warn('Could not persist follow status', e);
    }
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLikeClick = () => {
    const next = !hasLiked;
    setHasLiked(next);
    setLikesCount((prev) => (next ? prev + 1 : prev - 1));
    onLike?.(reel.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment = {
      id: `rc-${Date.now()}`,
      authorName: userProfile?.fullName || 'You',
      authorUsername: userProfile?.username || 'you',
      authorAvatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      authorRole: userProfile?.role || 'creator',
      content: commentInput.trim(),
      createdAt: 'Just now',
    };
    setComments([...comments, newComment]);
    onAddComment?.(reel.id, commentInput.trim());
    setCommentInput('');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/#reels?id=${reel.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleSendToFollower = (username: string) => {
    if (!sentFollowers.includes(username)) {
      setSentFollowers([...sentFollowers, username]);
    }
  };

  const handleShareToStoryAction = () => {
    if (onShareToStory) {
      onShareToStory({
        id: `post-reel-${reel.id}`,
        authorId: reel.authorId,
        authorName: reel.authorName,
        authorUsername: reel.authorUsername,
        authorAvatar: reel.authorAvatar,
        authorRole: reel.authorRole,
        mediaUrl: reel.thumbnailUrl || reel.videoUrl,
        mediaType: 'video',
        content: `Shared reel: ${reel.caption}`,
      });
    }
    setStoryShared(true);
    setTimeout(() => {
      setStoryShared(false);
      setIsShareModalOpen(false);
    }, 1800);
  };

  const isLongText = reel.caption.length > 105;

  const sampleFollowers = [
    { id: 'f-1', name: 'Maya Chen', username: 'mayachen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    { id: 'f-2', name: 'Kenji Sato', username: 'kenjisato', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { id: 'f-3', name: 'Sarah Williams', username: 'swilliams', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
    { id: 'f-4', name: 'Alex Rivera', username: 'alexr', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  ];

  return (
    <>
      <article
        id={`feed-reel-${reel.id}`}
        className={`rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden ${
          isDarkMode
            ? 'bg-[#080D26]/95 border-purple-500/20 text-white shadow-lg shadow-black/20'
            : 'bg-white border-purple-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* LEFT SIDE: Reel Video in 9:16 vertical ratio within compact container */}
          <div
            onClick={() => setIsFullModalOpen(true)}
            className={`relative w-full sm:w-60 md:w-72 lg:w-80 shrink-0 bg-slate-950 overflow-hidden flex items-center justify-center cursor-pointer group ${
              isDarkMode ? 'border-b sm:border-b-0 sm:border-r border-white/10' : 'border-b sm:border-b-0 sm:border-r border-slate-200'
            }`}
            title="Click to view full reel"
          >
            <video
              ref={videoRef}
              src={reel.videoUrl}
              poster={reel.thumbnailUrl}
              loop
              playsInline
              muted={isMuted}
              className="w-full h-56 sm:h-full max-h-[300px] object-cover bg-black"
            />

            {/* Reel Badge */}
            <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5 border border-white/15">
              <Film size={11} className="text-[#FF2E93]" />
              <span>Reel</span>
            </div>

            {/* Play/Pause overlay button */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center opacity-85 group-hover:opacity-100 hover:scale-110 transition backdrop-blur-xs cursor-pointer z-10"
              title={isPlaying ? 'Pause Reel' : 'Play Reel'}
            >
              {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
            </button>

            {/* Mute button */}
            <button
              type="button"
              onClick={handleToggleMute}
              className="absolute bottom-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/70 text-white hover:bg-black/90 transition backdrop-blur-xs cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>

            {/* Fullscreen icon */}
            <div className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition backdrop-blur-xs">
              <Maximize2 size={13} />
            </div>
          </div>

          {/* RIGHT SIDE: Author with Follow button, Caption with see more / see less, Hashtags on right, Actions */}
          <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-4 min-w-0">
            <div>
              {/* Author Header */}
              <div className="flex items-center justify-between gap-2 pb-1.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={reel.authorAvatar}
                    alt={reel.authorName}
                    referrerPolicy="no-referrer"
                    onClick={() =>
                      onViewAuthorProfile?.({
                        id: reel.authorId,
                        name: reel.authorName,
                        username: reel.authorUsername,
                        avatar: reel.authorAvatar,
                        role: reel.authorRole,
                        verified: reel.verified,
                        coverImage: reel.authorCover,
                        bio: reel.authorBio,
                        category: 'Reels Creator',
                        collabRole: 'Video Editor & Colorist',
                      })
                    }
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-purple-500/50 shrink-0 cursor-pointer hover:scale-105 transition"
                  />
                  <div className="min-w-0 flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() =>
                        onViewAuthorProfile?.({
                          id: reel.authorId,
                          name: reel.authorName,
                          username: reel.authorUsername,
                          avatar: reel.authorAvatar,
                          role: reel.authorRole,
                          verified: reel.verified,
                          coverImage: reel.authorCover,
                          bio: reel.authorBio,
                          category: 'Reels Creator',
                          collabRole: 'Video Editor & Colorist',
                        })
                      }
                      className="text-xs sm:text-sm font-bold hover:text-[#00D2FF] transition truncate text-left cursor-pointer"
                    >
                      {reel.authorName}
                    </button>
                    {reel.verified && <ShieldCheck size={14} className="text-[#00D2FF] shrink-0" />}

                    {/* Follow button after profile name */}
                    {!isOwnReel && (
                      <button
                        type="button"
                        onClick={handleToggleFollow}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition cursor-pointer flex items-center gap-1 shrink-0 ${
                          isFollowing
                            ? isDarkMode
                              ? 'bg-white/10 text-slate-300 hover:bg-rose-500/20 hover:text-rose-400'
                              : 'bg-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600'
                            : 'gradient-btn-primary text-white hover:opacity-95 shadow-xs'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <Check size={11} />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <Plus size={11} />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    )}

                    <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} shrink-0 ml-auto sm:ml-1`}>
                      • {reel.createdAt}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullModalOpen(true)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer shrink-0"
                  title="View full reel"
                >
                  <Maximize2 size={14} />
                </button>
              </div>

              {/* Caption with see more / see less */}
              <div className="py-1">
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                  {isLongText ? (
                    <>
                      <span>{isExpandedWords ? reel.caption : `${reel.caption.slice(0, 105)}...`}</span>
                      <button
                        type="button"
                        onClick={() => setIsExpandedWords(!isExpandedWords)}
                        className="text-[#00D2FF] font-bold hover:underline ml-1 cursor-pointer transition"
                      >
                        {isExpandedWords ? 'see less' : 'see more'}
                      </button>
                    </>
                  ) : (
                    reel.caption
                  )}
                </p>
              </div>

              {/* Hashtags on the right */}
              {reel.tags && reel.tags.length > 0 && (
                <div className="flex flex-wrap items-center justify-end gap-1.5 mt-2 pt-0.5">
                  {reel.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition cursor-pointer hover:underline ${
                        isDarkMode
                          ? 'bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20'
                          : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Row: Interactions */}
            <div
              className={`pt-2.5 mt-2 border-t flex items-center justify-between text-xs ${
                isDarkMode ? 'border-white/10' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={handleLikeClick}
                  className={`flex items-center gap-1.5 transition cursor-pointer font-semibold ${
                    hasLiked
                      ? 'text-[#FF2E93]'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Heart size={16} className={hasLiked ? 'fill-[#FF2E93] text-[#FF2E93] scale-110' : ''} />
                  <span>{likesCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowComments(!showComments)}
                  className={`flex items-center gap-1.5 transition cursor-pointer font-semibold ${
                    showComments
                      ? 'text-[#00D2FF]'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageCircle size={16} />
                  <span>{comments.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className={`flex items-center gap-1.5 transition cursor-pointer ${
                    isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Share2 size={15} />
                  <span>Share</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSaved
                    ? 'text-amber-400 bg-amber-400/10'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Bookmark size={15} className={isSaved ? 'fill-current' : ''} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Comments Drawer */}
        {showComments && (
          <div className={`p-4 sm:p-5 border-t border-inherit space-y-3 ${isDarkMode ? 'bg-black/30' : 'bg-slate-50/80'}`}>
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={comment.authorAvatar}
                    alt={comment.authorName}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div
                    className={`flex-1 p-2.5 rounded-xl border ${
                      isDarkMode
                        ? 'bg-white/5 border-white/5 text-slate-200'
                        : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">{comment.authorName}</span>
                      <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {comment.createdAt}
                      </span>
                    </div>
                    <p className={`font-normal ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Comment on this reel..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className={`flex-1 px-3.5 py-2 text-xs rounded-full border transition ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="p-2 rounded-full gradient-btn-primary text-white disabled:opacity-40 transition cursor-pointer shrink-0"
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        )}
      </article>

      {/* FULL REEL MODAL */}
      {isFullModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFullModalOpen(false);
          }}
        >
          <div
            className={`relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border shadow-2xl flex flex-col md:flex-row ${
              isDarkMode ? 'bg-[#080D26] border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <button
              type="button"
              onClick={() => setIsFullModalOpen(false)}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="w-full md:w-1/2 bg-black flex items-center justify-center min-h-[340px] max-h-[580px] overflow-hidden">
              <video
                src={reel.videoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-contain max-h-[580px]"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between p-5 overflow-y-auto max-h-[580px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-inherit">
                  <div className="flex items-center gap-3">
                    <img
                      src={reel.authorAvatar}
                      alt={reel.authorName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/50"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{reel.authorName}</span>
                        {reel.verified && <ShieldCheck size={14} className="text-[#00D2FF]" />}
                        {!isOwnReel && (
                          <button
                            type="button"
                            onClick={handleToggleFollow}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                              isFollowing ? 'bg-white/10 text-slate-300' : 'gradient-btn-primary text-white'
                            }`}
                          >
                            {isFollowing ? 'Following' : '+ Follow'}
                          </button>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">@{reel.authorUsername} • {reel.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="py-4">
                  <p className="text-sm leading-relaxed whitespace-pre-line font-normal">{reel.caption}</p>
                  {reel.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {reel.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-inherit">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Comments ({comments.length})
                  </h4>
                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 p-2.5 rounded-xl bg-white/5 border border-inherit">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold">{comment.authorName}</span>
                            <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                          </div>
                          <p className="text-slate-300 font-normal">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-inherit space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      onClick={handleLikeClick}
                      className={`flex items-center gap-1.5 font-bold cursor-pointer ${
                        hasLiked ? 'text-[#FF2E93]' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Heart size={18} className={hasLiked ? 'fill-current' : ''} />
                      <span>{likesCount}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsShareModalOpen(true)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSaved(!isSaved)}
                    className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                      isSaved ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>

                <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Comment on this reel..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 px-4 py-2 text-xs rounded-full border border-inherit bg-slate-900/60 text-white placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="p-2 rounded-full gradient-btn-primary text-white disabled:opacity-40 cursor-pointer shrink-0"
                  >
                    <Send size={13} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsShareModalOpen(false);
          }}
        >
          <div
            className={`w-full max-w-md p-5 rounded-3xl border shadow-2xl space-y-4 ${
              isDarkMode ? 'bg-[#0E1528] border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b border-inherit pb-3">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-[#00D2FF]" />
                <h3 className="text-sm font-bold">Share Reel</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-inherit flex items-center gap-3">
              <img
                src={reel.thumbnailUrl}
                alt="Reel preview"
                referrerPolicy="no-referrer"
                className="w-12 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{reel.authorName}</p>
                <p className="text-[11px] text-slate-400 truncate">{reel.caption}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleShareToStoryAction}
              disabled={storyShared}
              className={`w-full p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                storyShared
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : isDarkMode
                  ? 'bg-gradient-to-r from-pink-500/15 to-purple-500/15 border-pink-500/30 hover:bg-pink-500/25 text-white'
                  : 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 hover:bg-pink-100 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF2E93] to-[#00D2FF] p-0.5 flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                    <Sparkles size={14} className="text-[#FF2E93]" />
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block">Share to Your Story</span>
                  <span className="text-[10px] text-slate-400 block">Feature this reel in your 24h stories</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#FF2E93] to-[#7928CA] text-white">
                {storyShared ? 'Shared ✓' : 'Share'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className={`w-full p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : isDarkMode
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Link2 size={16} />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block">Copy Link to Reel</span>
                  <span className="text-[10px] text-slate-400 block">Share direct URL with anyone</span>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10">
                {copiedLink ? 'Copied ✓' : 'Copy'}
              </span>
            </button>

            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Share to Followers
              </span>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {sampleFollowers.map((follower) => {
                  const hasSent = sentFollowers.includes(follower.username);
                  return (
                    <div
                      key={follower.id}
                      className="p-2 rounded-2xl bg-white/5 border border-inherit flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={follower.avatar}
                          alt={follower.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                        />
                        <div className="min-w-0">
                          <p className="font-bold truncate">{follower.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">@{follower.username}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSendToFollower(follower.username)}
                        disabled={hasSent}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shrink-0 ${
                          hasSent
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'gradient-btn-primary text-white shadow-xs'
                        }`}
                      >
                        {hasSent ? 'Sent ✓' : 'Send'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
