import React, { useState, useRef } from 'react';
import { Story, UserProfile } from '../types';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Video,
  Upload,
  Music,
  Play,
  Pause,
  Trash2,
  Send,
  Link as LinkIcon,
} from 'lucide-react';
import { MUSIC_PRESETS } from '../data/sampleMedia';
import { playAudioTrack, stopAudioTrack } from '../utils/audioPlayer';

interface AddStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onAddStory: (newStory: Story) => void;
  isDarkMode: boolean;
}

const STORY_MEDIA_PRESETS = [
  {
    label: 'Studio Mic & Setup',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1080&q=80',
    type: 'image' as const,
  },
  {
    label: 'Cyber Workspace',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1080&q=80',
    type: 'image' as const,
  },
  {
    label: 'Cinematic Reel Clip',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'video' as const,
  },
  {
    label: '3D Render Art',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=80',
    type: 'image' as const,
  },
];

export const AddStoryModal: React.FC<AddStoryModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onAddStory,
  isDarkMode,
}) => {
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState(STORY_MEDIA_PRESETS[0].url);
  const [mediaFileName, setMediaFileName] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  // Background Sound
  const [addSound, setAddSound] = useState(true);
  const [musicTitle, setMusicTitle] = useState('Neon Skyline (Chill Beats)');
  const [musicUrl, setMusicUrl] = useState(MUSIC_PRESETS[0].url);
  const [customMusicUrl, setCustomMusicUrl] = useState('');
  const [isPlayingSoundPreview, setIsPlayingSoundPreview] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'image');
    setMediaFileName(file.name);

    const localUrl = URL.createObjectURL(file);
    setMediaUrl(localUrl);
  };

  const toggleSoundPreview = (url: string) => {
    if (isPlayingSoundPreview) {
      stopAudioTrack();
      setIsPlayingSoundPreview(false);
    } else {
      playAudioTrack(
        url,
        () => setIsPlayingSoundPreview(true),
        () => setIsPlayingSoundPreview(false),
        () => setIsPlayingSoundPreview(false)
      );
    }
  };

  const handleModalClose = () => {
    stopAudioTrack();
    setIsPlayingSoundPreview(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    stopAudioTrack();
    setIsSubmitting(true);

    const effectiveSoundUrl = customMusicUrl.trim() || (addSound ? musicUrl : undefined);

    const story: Story = {
      id: `story-${Date.now()}`,
      authorId: userProfile?.id || 'current-user',
      authorName: userProfile?.fullName || userProfile?.username || 'You',
      authorUsername: userProfile?.username || 'you',
      authorAvatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      authorRole: userProfile?.role || 'creator',
      mediaUrl,
      mediaType,
      musicTitle: addSound ? musicTitle : undefined,
      musicUrl: effectiveSoundUrl,
      caption: caption.trim() || 'Sharing a moment on Creator Meet! ✨',
      createdAt: 'Just now',
      viewsCount: 1,
      isUserStory: true,
    };

    setTimeout(() => {
      onAddStory(story);
      setIsSubmitting(false);
      setCaption('');
      handleModalClose();
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleModalClose();
      }}
    >
      <div
        className={`relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all ${
          isDarkMode
            ? 'bg-[#080D26] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-inherit sticky top-0 bg-inherit z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF2E93] to-[#00D2FF] flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">Add 24h Story</h3>
              <p className="text-[11px] text-slate-400">
                Upload image or video from device with background sound
              </p>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {/* 1. SELECT IMAGE OR VIDEO FROM DEVICE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Upload size={13} className="text-[#FF2E93]" />
              <span>Select Media from Device</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                isDarkMode
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#FF2E93]'
                  : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-[#FF2E93]'
              }`}
            >
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-8 h-8 rounded-full bg-[#00D2FF]/15 text-[#00D2FF] flex items-center justify-center">
                  <ImageIcon size={16} />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FF2E93]/15 text-[#FF2E93] flex items-center justify-center">
                  <Video size={16} />
                </div>
              </div>
              <p className="text-xs font-bold">
                {mediaFileName ? `Selected: ${mediaFileName}` : 'Choose Image or Video from Device'}
              </p>
              <p className="text-[11px] text-slate-400">
                Supports vertical phone camera videos, portrait photos, reels
              </p>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[10px] text-slate-400 shrink-0">Sample Media:</span>
              {STORY_MEDIA_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setMediaUrl(p.url);
                    setMediaType(p.type);
                    setMediaFileName(p.label);
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium shrink-0 border ${
                    mediaUrl === p.url
                      ? 'bg-[#FF2E93] text-white border-[#FF2E93]'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Live Media Preview */}
            {mediaUrl && (
              <div className="mt-3 relative rounded-2xl overflow-hidden aspect-[9/14] max-h-64 mx-auto bg-black border border-inherit flex items-center justify-center">
                {mediaType === 'video' ? (
                  <video
                    src={mediaUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt="Story Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold uppercase">
                  {mediaType}
                </span>
              </div>
            )}
          </div>

          {/* 2. BACKGROUND SOUND / MUSIC */}
          <div
            className={`p-3.5 rounded-2xl border transition ${
              addSound
                ? isDarkMode
                  ? 'bg-purple-950/20 border-purple-500/40'
                  : 'bg-purple-50 border-purple-200'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <label
                htmlFor="story-sound-toggle"
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <input
                  id="story-sound-toggle"
                  type="checkbox"
                  checked={addSound}
                  onChange={(e) => {
                    setAddSound(e.target.checked);
                    if (!e.target.checked) {
                      stopAudioTrack();
                      setIsPlayingSoundPreview(false);
                    }
                  }}
                  className="w-4 h-4 rounded text-[#FF2E93] accent-[#FF2E93] cursor-pointer"
                />
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Music size={14} className="text-[#00D2FF]" />
                  <span>Add Background Music / Sound to Story</span>
                </span>
              </label>

              {addSound && (
                <button
                  type="button"
                  onClick={() => toggleSoundPreview(customMusicUrl.trim() || musicUrl)}
                  className="px-2.5 py-1 rounded-full bg-[#00D2FF] text-black text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer hover:opacity-90"
                >
                  {isPlayingSoundPreview ? (
                    <>
                      <Pause size={11} />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Play size={11} fill="currentColor" />
                      <span>Test Sound</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {addSound && (
              <div className="mt-3 space-y-2 pt-2 border-t border-inherit">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {MUSIC_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => {
                        setMusicTitle(preset.title);
                        setMusicUrl(preset.url);
                        setCustomMusicUrl('');
                      }}
                      className={`p-2 rounded-xl text-left border transition cursor-pointer text-xs ${
                        musicUrl === preset.url && !customMusicUrl
                          ? 'bg-[#FF2E93]/20 border-[#FF2E93] text-[#FF2E93] font-bold'
                          : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      <p className="truncate font-semibold">{preset.title}</p>
                      <p className="text-[10px] text-slate-400">{preset.artist}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <div className="relative">
                    <LinkIcon
                      size={12}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="url"
                      placeholder="Or paste sound stream URL..."
                      value={customMusicUrl}
                      onChange={(e) => setCustomMusicUrl(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl border border-inherit bg-inherit"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Story Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's happening right now?"
              className={`w-full px-3.5 py-2 text-xs rounded-xl border transition ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 text-xs font-semibold rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-story-btn"
              type="submit"
              disabled={isSubmitting || !mediaUrl}
              className="gradient-btn-primary px-5 py-2 text-xs font-bold text-white rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF1E82]/30 cursor-pointer disabled:opacity-50 min-h-[36px]"
            >
              <Send size={13} />
              <span>{isSubmitting ? 'Posting...' : 'Share to Story'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
