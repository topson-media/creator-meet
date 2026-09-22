import React, { useState, useEffect, useRef } from 'react';
import { Post, UserProfile } from '../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  ShieldCheck,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Link2,
  Check,
  Plus,
  Radio,
  Sparkles,
} from 'lucide-react';
import { ProfileDetailsData } from './UserProfileModal';

interface PostCardProps {
  post: Post;
  userProfile: UserProfile | null;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onStartChatWithAuthor?: (author: { name: string; handle: string; avatar: string; role: 'creator' | 'fan' }) => void;
  onViewAuthorProfile?: (author: ProfileDetailsData) => void;
  onShareToStory?: (post: Post) => void;
  isDarkMode: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  userProfile,
  onLike,
  onAddComment,
  onStartChatWithAuthor,
  onViewAuthorProfile,
  onShareToStory,
  isDarkMode,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isExpandedWords, setIsExpandedWords] = useState(false);
  const [isFullPostModalOpen, setIsFullPostModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sentFollowers, setSentFollowers] = useState<string[]>([]);
  const [storyShared, setStoryShared] = useState(false);

  // Follow state for this post's author
  const [isFollowing, setIsFollowing] = useState(false);

  // Sample followers to share to
  const sampleFollowers = [
    { id: 'f-1', name: 'Maya Chen', username: 'mayachen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    { id: 'f-2', name: 'Kenji Sato', username: 'kenjisato', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { id: 'f-3', name: 'Sarah Williams', username: 'swilliams', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
    { id: 'f-4', name: 'Alex Rivera', username: 'alexr', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  ];

  const isOwnPost =
    userProfile?.username === post.authorUsername ||
    userProfile?.id === post.authorId;

  // Read initial follow status from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('creatormeet_followed_ids');
      if (stored) {
        const followedIds: string[] = JSON.parse(stored);
        setIsFollowing(followedIds.includes(post.authorId) || followedIds.includes(post.authorUsername));
      }
    } catch {
      // ignore
    }
  }, [post.authorId, post.authorUsername]);

  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);

    try {
      const stored = localStorage.getItem('creatormeet_followed_ids');
      let followedIds: string[] = stored ? JSON.parse(stored) : [];
      if (nextState) {
        followedIds.push(post.authorId);
      } else {
        followedIds = followedIds.filter((id) => id !== post.authorId && id !== post.authorUsername);
      }
      localStorage.setItem('creatormeet_followed_ids', JSON.stringify(followedIds));
    } catch (e) {
      console.warn('Could not persist follow status', e);
    }
  };

  // Music playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusicPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.musicUrl) return;

    if (isPlayingAudio) {
      audioRef.current?.pause();
      setIsPlayingAudio(false);
    } else {
      if (!audioRef.current) {
        const audio = new Audio(post.musicUrl);
        audio.loop = true;
        audio.volume = isMuted ? 0 : 0.8;
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          console.warn('Audio error');
          setIsPlayingAudio(false);
        };
        audioRef.current = audio;
      }
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => setIsPlayingAudio(false));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewAuthorProfile) {
      onViewAuthorProfile({
        id: post.authorId,
        name: post.authorName,
        username: post.authorUsername,
        avatar: post.authorAvatar,
        role: post.authorRole,
        verified: post.verified,
        coverImage: post.authorCover,
        bio: post.authorBio,
        country: post.authorCountry,
        flag: post.authorFlag,
        category: post.category,
        collabOpen: post.collabOpen,
        collabRole: post.collabRole || 'Video Editor & Colorist',
        platforms: post.authorPlatforms,
      });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
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
      onShareToStory(post);
    }
    setStoryShared(true);
    setTimeout(() => {
      setStoryShared(false);
      setIsShareModalOpen(false);
    }, 1800);
  };

  const hasMedia = Boolean(post.mediaUrl);
  const isLongText = post.content.length > 105;

  return (
    <>
      <article
        id={`post-${post.id}`}
        className={`rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden ${
          isDarkMode
            ? 'bg-[#080D26]/95 border-white/10 text-white shadow-lg shadow-black/20'
            : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        {/* Side-by-side Layout: Media on Left, Details & Actions on Right */}
        <div className={`flex ${hasMedia ? 'flex-col sm:flex-row' : 'flex-col'} items-stretch`}>
          {/* LEFT SIDE: Media in compact ratio, click to open full view */}
          {hasMedia && (
            <div
              onClick={() => setIsFullPostModalOpen(true)}
              className={`relative w-full sm:w-60 md:w-72 lg:w-80 shrink-0 bg-slate-950 overflow-hidden flex items-center justify-center self-stretch cursor-pointer group ${
                isDarkMode
                  ? 'border-b sm:border-b-0 sm:border-r border-white/10'
                  : 'border-b sm:border-b-0 sm:border-r border-slate-200'
              }`}
              title="Click to view full post"
            >
              {post.mediaType === 'video' ? (
                <video
                  src={post.mediaUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-48 sm:h-full max-h-[280px] object-cover bg-black"
                />
              ) : (
                <img
                  src={post.mediaUrl}
                  alt="Post attachment"
                  referrerPolicy="no-referrer"
                  className="w-full h-48 sm:h-full max-h-[280px] object-cover group-hover:scale-102 transition duration-300"
                />
              )}

              {/* Fullscreen indicator badge on hover */}
              <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition backdrop-blur-xs">
                <Maximize2 size={13} />
              </div>

              {/* Audio Overlay Tag */}
              {post.musicUrl && (
                <div className="absolute bottom-2.5 left-2.5 z-10">
                  <button
                    type="button"
                    onClick={toggleMusicPlay}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md transition cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-[#FF2E93] text-white'
                        : 'bg-black/75 hover:bg-black/90 text-white'
                    }`}
                  >
                    {isPlayingAudio ? <Pause size={10} fill="white" /> : <Play size={10} fill="white" className="ml-0.5" />}
                    <span className="truncate max-w-[110px]">{post.musicTitle || 'Soundtrack'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* RIGHT SIDE: Author with Follow button, Description with see more / see less, Hashtags on right, Actions */}
          <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-4 min-w-0">
            <div>
              {/* Top Row: Author name & Follow button (creator/fan badge and what he do removed from post) */}
              <div className="flex items-center justify-between gap-2 pb-1.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    referrerPolicy="no-referrer"
                    onClick={handleAuthorClick}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-[#00D2FF]/40 shrink-0 cursor-pointer hover:scale-105 transition"
                    title="View visited profile"
                  />
                  <div className="min-w-0 flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleAuthorClick}
                      className="text-xs sm:text-sm font-bold hover:text-[#00D2FF] transition truncate text-left cursor-pointer"
                    >
                      {post.authorName}
                    </button>
                    {post.verified && <ShieldCheck size={14} className="text-[#00D2FF] shrink-0" />}

                    {/* Follow button after profile name (if not current user) */}
                    {!isOwnPost && (
                      <button
                        type="button"
                        onClick={handleToggleFollow}
                        id={`follow-btn-${post.id}`}
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
                      • {post.createdAt}
                    </span>
                  </div>
                </div>

                {/* Expand to Full View Button */}
                <button
                  type="button"
                  onClick={() => setIsFullPostModalOpen(true)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer shrink-0"
                  title="View full post"
                >
                  <Maximize2 size={14} />
                </button>
              </div>

              {/* Description / Caption with "see more" and "see less" */}
              <div className="py-1">
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                  {isLongText ? (
                    <>
                      <span>{isExpandedWords ? post.content : `${post.content.slice(0, 105)}...`}</span>
                      <button
                        type="button"
                        onClick={() => setIsExpandedWords(!isExpandedWords)}
                        className="text-[#00D2FF] font-bold hover:underline ml-1 cursor-pointer transition"
                      >
                        {isExpandedWords ? 'see less' : 'see more'}
                      </button>
                    </>
                  ) : (
                    post.content
                  )}
                </p>
              </div>

              {/* HASHTAGS ON THE RIGHT SIDE OF POST */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center justify-end gap-1.5 mt-2 pt-0.5">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition cursor-pointer hover:underline ${
                        isDarkMode
                          ? 'bg-[#00D2FF]/10 border-[#00D2FF]/20 text-[#00D2FF] hover:bg-[#00D2FF]/20'
                          : 'bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Row: Interactions (Like, Comments, Share, and Save) */}
            <div
              className={`pt-2.5 mt-2 border-t flex items-center justify-between text-xs ${
                isDarkMode ? 'border-white/10' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={() => onLike(post.id)}
                  className={`flex items-center gap-1.5 transition cursor-pointer font-semibold ${
                    post.hasLiked
                      ? 'text-[#FF2E93]'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Heart
                    size={16}
                    className={post.hasLiked ? 'fill-[#FF2E93] text-[#FF2E93] scale-110' : ''}
                  />
                  <span>{post.likesCount}</span>
                </button>

                {/* Comments Toggle Button */}
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
                  <span>{post.comments?.length || post.commentsCount || 0}</span>
                </button>

                {/* Share Button (opens Share modal) */}
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

              {/* Save Post Button */}
              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                id={`save-post-btn-${post.id}`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSaved
                    ? 'text-amber-400 bg-amber-400/10'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save post'}
              >
                <Bookmark size={15} className={isSaved ? 'fill-current' : ''} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inline Comments Section */}
        {showComments && (
          <div className={`p-4 sm:p-5 border-t border-inherit space-y-3 ${isDarkMode ? 'bg-black/30' : 'bg-slate-50/80'}`}>
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      referrerPolicy="no-referrer"
                      onClick={handleAuthorClick}
                      className="w-7 h-7 rounded-full object-cover shrink-0 cursor-pointer hover:ring-1 hover:ring-[#00D2FF]"
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
            ) : (
              <p className={`text-xs italic ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                No comments yet. Start the conversation!
              </p>
            )}

            {/* Add Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Write a comment..."
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

      {/* FULL POST MODAL (user can click on post and become full) */}
      {isFullPostModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFullPostModalOpen(false);
          }}
        >
          <div
            className={`relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border shadow-2xl flex flex-col md:flex-row ${
              isDarkMode ? 'bg-[#080D26] border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            {/* Close modal button */}
            <button
              type="button"
              onClick={() => setIsFullPostModalOpen(false)}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Media side in full ratio */}
            {hasMedia && (
              <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative min-h-[300px] max-h-[480px] md:max-h-[600px] overflow-hidden">
                {post.mediaType === 'video' ? (
                  <video
                    src={post.mediaUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain max-h-[580px]"
                  />
                ) : (
                  <img
                    src={post.mediaUrl}
                    alt="Full post"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain max-h-[580px]"
                  />
                )}
              </div>
            )}

            {/* Details & Comments side */}
            <div className={`flex-1 flex flex-col justify-between p-5 overflow-y-auto max-h-[600px] ${!hasMedia ? 'w-full' : ''}`}>
              <div>
                {/* Header in full view */}
                <div className="flex items-center justify-between pb-3 border-b border-inherit">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      referrerPolicy="no-referrer"
                      onClick={handleAuthorClick}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00D2FF]/50 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          onClick={handleAuthorClick}
                          className="font-bold text-sm hover:text-[#00D2FF] cursor-pointer"
                        >
                          {post.authorName}
                        </span>
                        {post.verified && <ShieldCheck size={14} className="text-[#00D2FF]" />}
                        {!isOwnPost && (
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
                      <span className="text-[11px] text-slate-400">@{post.authorUsername} • {post.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Full Caption Content */}
                <div className="py-4">
                  <p className="text-sm leading-relaxed whitespace-pre-line font-normal">
                    {post.content}
                  </p>

                  {/* Soundtrack info */}
                  {post.musicUrl && (
                    <div className="mt-3 p-2.5 rounded-2xl bg-white/5 border border-inherit flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={toggleMusicPlay}
                          className="w-7 h-7 rounded-full bg-[#FF2E93] text-white flex items-center justify-center cursor-pointer"
                        >
                          {isPlayingAudio ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                        </button>
                        <div>
                          <p className="font-bold text-[11px]">{post.musicTitle || 'Attached Soundtrack'}</p>
                          <p className="text-[9px] text-slate-400">{post.musicArtist || 'Creator Audio'}</p>
                        </div>
                      </div>
                      <button type="button" onClick={toggleMute} className="p-1 text-slate-400 hover:text-white">
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                    </div>
                  )}

                  {/* Hashtags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comments List in full modal */}
                <div className="pt-2 border-t border-inherit">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Comments ({post.comments?.length || post.commentsCount || 0})
                  </h4>
                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment) => (
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
                      ))
                    ) : (
                      <p className="text-xs italic text-slate-400">No comments yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions & Input in full modal */}
              <div className="pt-4 border-t border-inherit space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      onClick={() => onLike(post.id)}
                      className={`flex items-center gap-1.5 font-bold cursor-pointer ${
                        post.hasLiked ? 'text-[#FF2E93]' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Heart size={18} className={post.hasLiked ? 'fill-current' : ''} />
                      <span>{post.likesCount}</span>
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
                    placeholder="Write a comment..."
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

      {/* SHARE MODAL (copy link, share to another follower, share to story) */}
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
                <h3 className="text-sm font-bold">Share Post</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Post preview pill */}
            <div className="p-3 rounded-2xl bg-white/5 border border-inherit flex items-center gap-3">
              {post.mediaUrl && (
                <img
                  src={post.mediaUrl}
                  alt="Post preview"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{post.authorName}</p>
                <p className="text-[11px] text-slate-400 truncate">{post.content}</p>
              </div>
            </div>

            {/* Option 1: Share to Story */}
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
                  <span className="text-[10px] text-slate-400 block">Feature this creative post at the top of your profile</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#FF2E93] to-[#7928CA] text-white">
                {storyShared ? 'Shared ✓' : 'Share'}
              </span>
            </button>

            {/* Option 2: Copy Link */}
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
                  <span className="text-xs font-bold block">Copy Link to Post</span>
                  <span className="text-[10px] text-slate-400 block">Share direct link with friends anywhere</span>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10">
                {copiedLink ? 'Copied ✓' : 'Copy'}
              </span>
            </button>

            {/* Option 3: Share to Another Follower */}
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
