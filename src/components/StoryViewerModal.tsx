import React, { useEffect, useState, useRef } from 'react';
import { Story } from '../types';
import { AccountBadge } from './AccountBadge';
import { X, Heart, Music, Volume2, VolumeX, Eye } from 'lucide-react';
import { ProfileDetailsData } from './UserProfileModal';

interface StoryViewerModalProps {
  story: Story | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onViewAuthorProfile?: (author: ProfileDetailsData) => void;
  isDarkMode: boolean;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  story,
  onClose,
  onNext,
  onPrev,
  onViewAuthorProfile,
}) => {
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!story) return;
    setProgress(0);
    setLiked(false);

    // Play background sound if attached to story
    if (story.musicUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(story.musicUrl);
      audio.loop = true;
      audio.volume = isMuted ? 0 : 0.75;
      audio.play().catch(() => {
        // Autoplay may be restricted
      });
      audioRef.current = audio;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onNext) onNext();
          else onClose();
          return 100;
        }
        return prev + 1.5;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [story?.id]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    onClose();
  };

  const handleAuthorClick = () => {
    if (!story) return;
    handleClose();
    onViewAuthorProfile?.({
      id: story.authorId,
      name: story.authorName,
      username: story.authorUsername,
      avatar: story.authorAvatar,
      role: story.authorRole,
    });
  };

  if (!story) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md animate-fade-in select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-md aspect-[9/16] sm:aspect-[9/15] max-h-[88vh] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-white/20 flex flex-col justify-between">
        {/* Story Background Media (Video or Image) */}
        {story.mediaType === 'video' ? (
          <video
            src={story.mediaUrl}
            autoPlay
            loop
            playsInline
            muted={Boolean(story.musicUrl)} // if background music is active, mute video to prevent audio clash
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={story.mediaUrl}
            alt={story.caption || 'Creator story'}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Ambient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/70 pointer-events-none" />

        {/* Top Controls: Progress Bar & Author */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Progress Bar */}
          <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#FF2E93] to-[#00D2FF] h-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Author info */}
          <div className="flex items-center justify-between">
            <div
              onClick={handleAuthorClick}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Click to view creator details"
            >
              <img
                src={story.authorAvatar}
                alt={story.authorName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FF2E93] group-hover:scale-105 transition"
              />
              <div className="text-white">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold group-hover:text-[#00D2FF] transition">
                    {story.authorName}
                  </span>
                  <AccountBadge role={story.authorRole} size="sm" />
                </div>
                <span className="text-[10px] text-white/70">
                  @{story.authorUsername} • {story.createdAt}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {story.musicUrl && (
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition cursor-pointer"
                  title={isMuted ? 'Unmute music' : 'Mute music'}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              )}

              <button
                onClick={handleClose}
                className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Attached Background Sound Pill */}
          {story.musicTitle && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium animate-fade-in">
              <Music size={12} className="text-[#FF2E93] animate-pulse" />
              <span className="truncate max-w-[200px]">{story.musicTitle}</span>
              <span className="flex items-center gap-0.5 ml-1">
                <span className="w-1 h-2 bg-[#00D2FF] rounded-full animate-bounce" />
                <span className="w-1 h-3 bg-[#FF2E93] rounded-full animate-bounce [animation-delay:0.1s]" />
              </span>
            </div>
          )}
        </div>

        {/* Tap areas for Prev / Next */}
        <div className="absolute inset-y-20 inset-x-0 flex z-10">
          <div className="w-1/3 h-full cursor-pointer" onClick={onPrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={onNext} />
        </div>

        {/* Bottom Bar: Caption and Reactions */}
        <div className="relative z-20 p-4 space-y-3">
          {story.caption && (
            <p className="text-white text-xs sm:text-sm font-medium leading-relaxed drop-shadow-md">
              {story.caption}
            </p>
          )}

          <div className="flex items-center justify-between text-white/90 pt-1">
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <Eye size={14} className="text-[#00D2FF]" />
              <span>{story.viewsCount || 1} views</span>
            </div>

            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-full backdrop-blur-md transition cursor-pointer ${
                liked ? 'bg-[#FF2E93] text-white scale-110' : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <Heart size={18} className={liked ? 'fill-current' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
