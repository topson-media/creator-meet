import React, { useState, useRef } from 'react';
import { Post, UserProfile } from '../types';
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
  Check,
  Users,
} from 'lucide-react';
import { MUSIC_PRESETS } from '../data/sampleMedia';
import { playAudioTrack, stopAudioTrack } from '../utils/audioPlayer';
import { AccountBadge } from './AccountBadge';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onAddPost: (newPost: Post) => void;
  isDarkMode: boolean;
}

const POST_MEDIA_PRESETS = [
  {
    label: 'Studio Setup',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    type: 'image' as const,
  },
  {
    label: 'Camera Gear',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    type: 'image' as const,
  },
  {
    label: 'Neon Synth',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    type: 'image' as const,
  },
  {
    label: 'Motion 3D',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    type: 'image' as const,
  },
  {
    label: 'Action Reel',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'video' as const,
  },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onAddPost,
  isDarkMode,
}) => {
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState<string>(POST_MEDIA_PRESETS[0].url);
  const [mediaFileName, setMediaFileName] = useState<string | null>(null);

  // Active attachment tab to reduce visual traffic
  const [activeAttachmentTab, setActiveAttachmentTab] = useState<'media' | 'audio'>('media');

  // Background Music state
  const [addMusic, setAddMusic] = useState(false);
  const [musicTitle, setMusicTitle] = useState('Neon Skyline (Chill Beats)');
  const [musicArtist, setMusicArtist] = useState('Lofi Producer Collective');
  const [musicUrl, setMusicUrl] = useState(MUSIC_PRESETS[0].url);
  const [customMusicUrl, setCustomMusicUrl] = useState('');
  const [isPlayingAudioPreview, setIsPlayingAudioPreview] = useState(false);

  // Metadata
  const [category, setCategory] = useState('Production');
  const [tagsInput, setTagsInput] = useState('#creator, #showcase');
  const [collabOpen, setCollabOpen] = useState(true);
  const [collabRole, setCollabRole] = useState('Video Editor & Colorist');
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'image');
    setMediaFileName(file.name);
    const localUrl = URL.createObjectURL(file);
    setMediaUrl(localUrl);
  };

  const toggleAudioPreview = (urlToPlay: string) => {
    if (isPlayingAudioPreview) {
      stopAudioTrack();
      setIsPlayingAudioPreview(false);
    } else {
      playAudioTrack(
        urlToPlay,
        () => setIsPlayingAudioPreview(true),
        () => setIsPlayingAudioPreview(false),
        () => setIsPlayingAudioPreview(false)
      );
      setIsPlayingAudioPreview(true);
    }
  };

  const handleModalClose = () => {
    stopAudioTrack();
    setIsPlayingAudioPreview(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    stopAudioTrack();
    setIsPlayingAudioPreview(false);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const effectiveMusicUrl = customMusicUrl.trim() || musicUrl;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: userProfile?.id || 'current-user',
      authorName: userProfile?.fullName || 'Topson Media',
      authorUsername: userProfile?.username || 'topsonmedia',
      authorAvatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      authorRole: userProfile?.role || 'creator',
      authorCover: userProfile?.coverImage,
      authorBio: userProfile?.bio,
      verified: true,
      category,
      createdAt: 'Just now',
      content: content.trim(),
      mediaUrl: mediaUrl || undefined,
      mediaType,
      musicTitle: addMusic ? musicTitle : undefined,
      musicArtist: addMusic ? musicArtist : undefined,
      musicUrl: effectiveMusicUrl,
      tags,
      likesCount: 1,
      commentsCount: 0,
      hasLiked: true,
      collabOpen,
      collabRole: collabOpen ? (collabRole.trim() || 'Video Editor & Colorist') : undefined,
      comments: [],
    };

    setTimeout(() => {
      onAddPost(newPost);
      setIsSubmitting(false);
      setContent('');
      handleModalClose();
    }, 300);
  };

  const authorName = userProfile?.fullName || 'Creator';
  const authorHandle = userProfile?.username ? `@${userProfile.username}` : '@creator';
  const authorAvatar =
    userProfile?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

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
        <div className="flex items-center justify-between px-5 py-4 border-b border-inherit sticky top-0 bg-inherit z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF2E93] to-[#00D2FF] flex items-center justify-center text-white shadow-md">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight">Create Post</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Share updates with your followers
              </p>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Creator Profile Badge */}
          <div className="flex items-center gap-3">
            <img
              src={authorAvatar}
              alt={authorName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00D2FF]/40"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold">{authorName}</span>
                <AccountBadge role={userProfile?.role || 'creator'} size="sm" />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {authorHandle} • Public
              </span>
            </div>
          </div>

          {/* Main Post Textarea with organized placeholder */}
          <div>
            <textarea
              id="post-content-input"
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`What's on your mind, ${authorName}?`}
              className={`w-full p-3.5 rounded-2xl text-xs sm:text-sm border transition focus:outline-hidden ${
                isDarkMode
                  ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-[#FF2E93]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#FF2E93]'
              }`}
            />
          </div>

          {/* Organized Attachment Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setActiveAttachmentTab('media')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeAttachmentTab === 'media'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-inherit'
              }`}
            >
              <ImageIcon size={13} className="text-[#00D2FF]" />
              <span>Media</span>
              {mediaUrl && <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveAttachmentTab('audio');
                if (!addMusic) setAddMusic(true);
              }}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeAttachmentTab === 'audio'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-inherit'
              }`}
            >
              <Music size={13} className="text-[#FF2E93]" />
              <span>Soundtrack</span>
              {addMusic && <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E93]" />}
            </button>
          </div>

          {/* TAB 1: MEDIA ATTACHMENT */}
          {activeAttachmentTab === 'media' && (
            <div className="space-y-3 animate-fade-in">
              {/* File upload input hidden */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Compact Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-3.5 text-center cursor-pointer transition flex items-center justify-center gap-3 ${
                  isDarkMode
                    ? 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#00D2FF]'
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-[#00D2FF]'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#00D2FF]/10 text-[#00D2FF] flex items-center justify-center shrink-0">
                  <Upload size={16} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold truncate">
                    {mediaFileName ? `File: ${mediaFileName}` : 'Drop photo/video or browse device'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Supports JPG, PNG, MP4 and WebM
                  </p>
                </div>
              </div>

              {/* Presets Horizontal Scroll */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold shrink-0">
                  Presets:
                </span>
                {POST_MEDIA_PRESETS.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setMediaUrl(preset.url);
                      setMediaType(preset.type);
                      setMediaFileName(preset.label);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 transition cursor-pointer border ${
                      mediaUrl === preset.url
                        ? 'bg-[#00D2FF] text-black border-[#00D2FF]'
                        : isDarkMode
                        ? 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Media Preview Box */}
              {mediaUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-inherit bg-black max-h-48 flex items-center justify-center shadow-md">
                  {mediaType === 'video' ? (
                    <video
                      src={mediaUrl}
                      controls
                      playsInline
                      className="w-full max-h-48 object-contain"
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full max-h-48 object-cover"
                    />
                  )}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold uppercase tracking-wider">
                    {mediaType}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaUrl('');
                      setMediaFileName(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition cursor-pointer"
                    title="Remove media"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AUDIO / SOUNDTRACK ATTACHMENT */}
          {activeAttachmentTab === 'audio' && (
            <div className="space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Music size={14} className="text-[#FF2E93]" />
                  <span>Attach Soundtrack to Post</span>
                </span>

                <button
                  type="button"
                  onClick={() => toggleAudioPreview(customMusicUrl.trim() || musicUrl)}
                  className="px-2.5 py-1 rounded-full bg-[#FF2E93] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer hover:opacity-90"
                >
                  {isPlayingAudioPreview ? (
                    <>
                      <Pause size={11} />
                      <span>Pause Preview</span>
                    </>
                  ) : (
                    <>
                      <Play size={11} fill="white" />
                      <span>Test Sound</span>
                    </>
                  )}
                </button>
              </div>

              {/* Preset tracks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MUSIC_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => {
                      setMusicTitle(preset.title);
                      setMusicArtist(preset.artist);
                      setMusicUrl(preset.url);
                      setCustomMusicUrl('');
                    }}
                    className={`p-2 rounded-xl text-left border transition cursor-pointer flex items-center justify-between ${
                      musicUrl === preset.url && !customMusicUrl
                        ? 'bg-[#FF2E93]/15 border-[#FF2E93] text-[#FF2E93]'
                        : isDarkMode
                        ? 'bg-slate-900 border-white/10 text-slate-300 hover:border-slate-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="min-w-0 pr-1">
                      <p className="text-xs font-bold truncate">{preset.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {preset.artist}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono shrink-0">{preset.duration}</span>
                  </button>
                ))}
              </div>

              {/* Custom audio link input */}
              <div className="relative">
                <LinkIcon
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="url"
                  placeholder="Paste audio URL (e.g. https://.../soundtrack.mp3)"
                  value={customMusicUrl}
                  onChange={(e) => setCustomMusicUrl(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border transition ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Category & Hashtags in Clean Inline Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border transition ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="Production">Production</option>
                <option value="Filmmaking">Filmmaking</option>
                <option value="Music">Music & Sound</option>
                <option value="Design & 3D">Design & 3D</option>
                <option value="Gaming">Gaming</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Hashtags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Hashtags (e.g. #vfx, #music)"
                className={`w-full px-3 py-2 text-xs rounded-xl border transition ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Collab Invitation Setting */}
          <div
            className={`p-3 rounded-2xl border transition ${
              collabOpen
                ? isDarkMode
                  ? 'bg-[#00D2FF]/10 border-[#00D2FF]/30'
                  : 'bg-cyan-50/70 border-cyan-200'
                : isDarkMode
                ? 'bg-white/5 border-white/10'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-[#00D2FF]" />
                <span className="text-xs font-bold">Collab Invitation</span>
              </div>
              <button
                type="button"
                onClick={() => setCollabOpen(!collabOpen)}
                className={`w-9 h-5 rounded-full relative transition cursor-pointer p-0.5 ${
                  collabOpen ? 'bg-[#00D2FF]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
                    collabOpen ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {collabOpen && (
              <div className="mt-2.5 pt-2 border-t border-inherit">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#00D2FF] mb-1">
                  Seeking Role (e.g. Video Editor & Colorist)
                </label>
                <input
                  type="text"
                  value={collabRole}
                  onChange={(e) => setCollabRole(e.target.value)}
                  placeholder="Video Editor & Colorist"
                  className={`w-full px-3 py-1.5 text-xs rounded-xl border transition ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 text-xs font-semibold rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer text-slate-500 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              id="submit-post-btn"
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="gradient-btn-primary px-5 py-2 text-xs font-bold text-white rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF1E82]/30 cursor-pointer disabled:opacity-50 min-h-[36px]"
            >
              <Send size={13} />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
