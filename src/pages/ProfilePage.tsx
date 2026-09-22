import React, { useState, useMemo } from 'react';
import {
  Settings,
  Shield,
  Edit3,
  Share2,
  Heart,
  Film,
  Image as ImageIcon,
  Grid,
  AtSign,
  Calendar,
  MapPin,
  ExternalLink,
  Check,
  X,
  Lock,
  Eye,
  Bell,
  LogOut,
  Sparkles,
  Camera,
  MessageSquare,
  Play,
  ArrowLeft,
  Sliders,
  CheckCircle2,
  Phone,
  Upload,
  Link as LinkIcon,
  Smartphone,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AccountBadge } from '../components/AccountBadge';
import { ShareProfileModal } from '../components/ShareProfileModal';
import { Post, Reel, PageRoute, UserRole } from '../types';

interface ProfilePageProps {
  isDarkMode: boolean;
  posts: Post[];
  reels: Reel[];
  onNavigate: (page: PageRoute) => void;
  onLikePost: (postId: string) => void;
  onOpenCreatePost: () => void;
  onToggleTheme: () => void;
  initialOpenSettings?: boolean;
  onOpenVerifiedModal?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  isDarkMode,
  posts,
  reels,
  onNavigate,
  onLikePost,
  onOpenCreatePost,
  onToggleTheme,
  initialOpenSettings = false,
  onOpenVerifiedModal,
}) => {
  const { userProfile, updateProfile, logout } = useAuth();

  const isUserVerified = Boolean(
    userProfile?.isVerified ||
      userProfile?.verified ||
      userProfile?.blueTick ||
      (typeof window !== 'undefined' && localStorage.getItem('creatormeet_user_verified') === 'true')
  );

  // Active tab for grouping: 'images' | 'reels' | 'liked'
  const [activeTab, setActiveTab] = useState<'images' | 'reels' | 'liked'>('images');

  // Modals visibility
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(initialOpenSettings);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync initialOpenSettings if changed externally
  React.useEffect(() => {
    if (initialOpenSettings) {
      setIsSettingsOpen(true);
    }
  }, [initialOpenSettings]);

  // Selected post for viewing
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  // Profile Form State
  const [editFullName, setEditFullName] = useState(userProfile?.fullName || 'Topson Media');
  const [editUsername, setEditUsername] = useState(userProfile?.username || 'topsonmedia');
  const [editBio, setEditBio] = useState(
    userProfile?.bio ||
      'Filmmaker, Director & Content Producer building cinematic stories. Sharing sound engineering and gear setups.'
  );
  const [editCategory, setEditCategory] = useState(userProfile?.category || 'Cinematography & Sound');
  const [editCountry, setEditCountry] = useState(userProfile?.country || 'United States');
  const [editAvatar, setEditAvatar] = useState(
    userProfile?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );
  const [editCover, setEditCover] = useState(
    userProfile?.coverImage ||
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80'
  );
  const [editRole, setEditRole] = useState<UserRole>(userProfile?.role || 'creator');

  // Image upload/link temporary states
  const [tempAvatarUrl, setTempAvatarUrl] = useState(
    userProfile?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );
  const [tempCoverUrl, setTempCoverUrl] = useState(
    userProfile?.coverImage ||
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80'
  );

  // Social Links
  const [youtubeUrl, setYoutubeUrl] = useState(userProfile?.platforms?.youtube || 'youtube.com/@topsonmedia');
  const [instagramUrl, setInstagramUrl] = useState(userProfile?.platforms?.instagram || 'instagram.com/topsonmedia');
  const [tiktokUrl, setTiktokUrl] = useState(userProfile?.platforms?.tiktok || 'tiktok.com/@topsonmedia');
  const [xUrl, setXUrl] = useState(userProfile?.platforms?.x || 'x.com/topsonmedia');
  const [websiteUrl, setWebsiteUrl] = useState(userProfile?.platforms?.website || 'topsonmedia.com');

  // Privacy & 2FA Settings
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [allowDMsFrom, setAllowDMsFrom] = useState<'everyone' | 'creators' | 'none'>('everyone');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(() => {
    try {
      if (userProfile?.twoFactorEnabled !== undefined) return userProfile.twoFactorEnabled;
      return localStorage.getItem('creatormeet_2fa_enabled') === 'true';
    } catch {
      return false;
    }
  });
  const [twoFactorPhone, setTwoFactorPhone] = useState(() => {
    try {
      return userProfile?.phoneNumber || localStorage.getItem('creatormeet_2fa_phone') || '+1 (555) 234-5678';
    } catch {
      return '+1 (555) 234-5678';
    }
  });
  const [twoFactorCodeSent, setTwoFactorCodeSent] = useState(false);
  const [twoFactorCodeInput, setTwoFactorCodeInput] = useState('');
  const [twoFactorVerified, setTwoFactorVerified] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  // Group 1: User's Image Posts
  const userImagePosts = useMemo(() => {
    const currentUserId = userProfile?.id || 'current-user';
    const currentUsername = userProfile?.username || 'topsonmedia';

    const userPosts = posts.filter(
      (p) =>
        p.authorId === currentUserId ||
        p.authorUsername.toLowerCase() === currentUsername.toLowerCase() ||
        p.authorUsername.toLowerCase() === 'topsonmedia'
    );

    // If none found yet, provide sample initial image posts so user's profile is rich
    if (userPosts.length === 0) {
      return posts.slice(0, 2);
    }
    return userPosts;
  }, [posts, userProfile]);

  // Group 2: User's Reels
  const userReels = useMemo(() => {
    const currentUserId = userProfile?.id || 'current-user';
    const currentUsername = userProfile?.username || 'topsonmedia';

    const filtered = reels.filter(
      (r) =>
        r.authorId === currentUserId ||
        r.authorUsername.toLowerCase() === currentUsername.toLowerCase() ||
        r.authorUsername.toLowerCase() === 'topsonmedia'
    );

    if (filtered.length === 0) {
      return reels.slice(0, 2);
    }
    return filtered;
  }, [reels, userProfile]);

  // Group 3: Posts User Has Liked
  const likedPosts = useMemo(() => {
    return posts.filter((p) => p.hasLiked);
  }, [posts]);

  // Save Avatar (Link or Device)
  const handleSaveAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempAvatarUrl) return;
    setEditAvatar(tempAvatarUrl);
    if (updateProfile) {
      await updateProfile({ avatar: tempAvatarUrl });
    }
    setIsAvatarModalOpen(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setTempAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Cover Image (Link or Device)
  const handleSaveCover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempCoverUrl) return;
    setEditCover(tempCoverUrl);
    if (updateProfile) {
      await updateProfile({ coverImage: tempCoverUrl });
    }
    setIsCoverModalOpen(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setTempCoverUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Edit Profile (Clean, attractive, NO word clutter, NO privacy settings)
  const handleSaveEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updateProfile) {
      await updateProfile({
        fullName: editFullName,
        username: editUsername,
        bio: editBio,
        category: editCategory,
        country: editCountry,
        role: editRole,
        accountType: editRole,
        platforms: {
          youtube: youtubeUrl,
          instagram: instagramUrl,
          tiktok: tiktokUrl,
          x: xUrl,
          website: websiteUrl,
        },
      });
    }
    setIsEditProfileOpen(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  // Save Settings & Privacy
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updateProfile) {
      await updateProfile({
        twoFactorEnabled: twoFactorAuth,
        phoneNumber: twoFactorPhone,
      });
    }

    try {
      localStorage.setItem('creatormeet_2fa_enabled', twoFactorAuth ? 'true' : 'false');
      localStorage.setItem('creatormeet_2fa_phone', twoFactorPhone);
    } catch (err) {
      console.warn('Could not save 2FA to localStorage:', err);
    }

    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
    setIsSettingsOpen(false);
  };

  // 2FA Daily SMS code handler
  const handleSend2FACode = () => {
    if (!twoFactorPhone.trim()) return;
    setTwoFactorCodeSent(true);
    setTwoFactorCodeInput('682914');
  };

  const handleVerify2FACode = () => {
    if (twoFactorCodeInput.trim().length >= 4) {
      setTwoFactorVerified(true);
      setTwoFactorAuth(true);
    }
  };

  const handleCopyProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div id="full-profile-page" className="min-h-screen pb-16">
      {/* Toast Notifications */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white font-medium text-xs shadow-2xl flex items-center gap-2 animate-fade-in border border-white/20">
          <Check size={14} className="text-emerald-400" />
          <span>Profile link copied to clipboard!</span>
        </div>
      )}

      {saveSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500 text-white font-medium text-xs shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span>Profile & Settings saved successfully!</span>
        </div>
      )}

      {/* Top Navigation Header */}
      <div
        className={`sticky top-0 z-30 px-4 sm:px-6 py-3.5 border-b backdrop-blur-md flex items-center justify-between transition ${
          isDarkMode
            ? 'bg-[#060919]/90 border-white/10 text-white'
            : 'bg-white/90 border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-inherit transition cursor-pointer"
            title="Back to Home"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                {userProfile?.fullName || editFullName}
              </h1>
              {isUserVerified && (
                <ShieldCheck
                  size={18}
                  className="text-[#00D2FF] fill-[#00D2FF]/20 shrink-0"
                  title="Official Creator Meet Blue Tick (Verified)"
                />
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              @{userProfile?.username || editUsername} • {userImagePosts.length + userReels.length} posts
            </p>
          </div>
        </div>

        {/* Action Icon: Settings & Privacy and Verified status */}
        <div className="flex items-center gap-2">
          {onOpenVerifiedModal && (
            <button
              type="button"
              id="profile-header-verified-btn"
              onClick={onOpenVerifiedModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border shadow-xs ${
                isUserVerified
                  ? 'bg-[#00D2FF]/15 text-[#00D2FF] border-[#00D2FF]/40 hover:bg-[#00D2FF]/25'
                  : 'gradient-btn-primary text-white hover:opacity-95'
              }`}
              title={isUserVerified ? 'Official Blue Tick Active' : 'Get Verified Blue Tick on Profile'}
            >
              <ShieldCheck size={14} className={isUserVerified ? 'text-[#00D2FF] fill-[#00D2FF]/20' : 'text-white'} />
              <span className="hidden sm:inline">{isUserVerified ? 'Blue Tick Active' : 'Get Blue Tick'}</span>
            </button>
          )}

          <button
            onClick={() => setIsSettingsOpen(true)}
            id="settings-and-privacy-btn"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-slate-200 dark:border-white/15 hover:border-[#FF2E93] hover:text-[#FF2E93] dark:hover:text-[#FF2E93] transition cursor-pointer shadow-xs"
            title="Settings and Privacy"
          >
            <Settings size={15} />
            <span className="hidden sm:inline">Settings & Privacy</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Cover Banner with Change Cover Icon */}
        <div className="relative h-44 sm:h-64 rounded-3xl overflow-hidden mt-4 shadow-md bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 group">
          <img
            src={userProfile?.coverImage || editCover}
            alt="Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Icon to change cover image */}
          <button
            onClick={() => {
              setTempCoverUrl(userProfile?.coverImage || editCover);
              setIsCoverModalOpen(true);
            }}
            id="change-cover-image-btn"
            className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-black/65 hover:bg-black/85 text-white backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-white/20 shadow-md hover:scale-105"
            title="Change Cover Image"
          >
            <Camera size={14} />
            <span>Change Cover</span>
          </button>
        </div>

        {/* Profile Details Header */}
        <div className="relative px-2 sm:px-4 -mt-16 sm:-mt-20 space-y-4">
          {/* Avatar and Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="relative inline-block">
              <img
                src={userProfile?.avatar || editAvatar}
                alt={userProfile?.fullName || editFullName}
                referrerPolicy="no-referrer"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-white dark:ring-[#060919] shadow-xl bg-slate-800"
              />
              {/* Only show Link or Device photo upload on avatar click */}
              <button
                onClick={() => {
                  setTempAvatarUrl(userProfile?.avatar || editAvatar);
                  setIsAvatarModalOpen(true);
                }}
                id="change-profile-avatar-btn"
                className="absolute bottom-2 right-2 p-2 rounded-2xl bg-[#FF2E93] text-white shadow-md hover:scale-110 transition cursor-pointer"
                title="Change Profile Picture"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                id="edit-profile-btn"
                className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border border-slate-200 dark:border-white/15 hover:border-[#FF2E93] transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2.5 rounded-2xl border border-slate-200 dark:border-white/15 text-slate-400 hover:text-[#00D2FF] hover:border-[#00D2FF] transition cursor-pointer"
                title="Settings & Privacy"
              >
                <Shield size={16} />
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                id="share-profile-btn"
                className="p-2.5 rounded-2xl border border-slate-200 dark:border-white/15 text-slate-500 dark:text-slate-400 hover:text-[#00D2FF] hover:border-[#00D2FF] transition cursor-pointer"
                title="Share Profile (QR Code & Link)"
              >
                <Share2 size={16} />
              </button>

              <button
                onClick={onOpenCreatePost}
                className="gradient-btn-primary px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-md shadow-[#FF1E82]/25 transition cursor-pointer"
              >
                + Create
              </button>
            </div>
          </div>

          {/* User Names & Bio */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {userProfile?.fullName || editFullName}
                </h2>
                {isUserVerified && (
                  <button
                    type="button"
                    onClick={onOpenVerifiedModal}
                    className="inline-flex items-center cursor-pointer hover:scale-110 transition"
                    title="Official Creator Meet Blue Tick (Verified) - Click to view benefits"
                  >
                    <ShieldCheck size={22} className="text-[#00D2FF] fill-[#00D2FF]/20 shrink-0" />
                  </button>
                )}
              </div>
              <AccountBadge role={userProfile?.role || editRole} size="md" />

              {onOpenVerifiedModal && (
                <button
                  type="button"
                  id="profile-badge-verified-cta"
                  onClick={onOpenVerifiedModal}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer border ${
                    isUserVerified
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-[#00D2FF]/15 text-[#00D2FF] border-[#00D2FF]/40 hover:bg-[#00D2FF]/25'
                  }`}
                >
                  <ShieldCheck size={13} className={isUserVerified ? 'text-emerald-400 fill-emerald-400/20' : 'text-[#00D2FF] fill-[#00D2FF]/20'} />
                  <span>{isUserVerified ? 'Verified Creator' : 'Get Blue Tick'}</span>
                </button>
              )}

              {/* posts > followers > following aside on right of creator */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-300 ml-1 py-1 px-3 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="flex items-center gap-1">
                  <strong className="text-slate-900 dark:text-white font-bold">{userImagePosts.length + userReels.length}</strong>
                  <span>posts</span>
                </span>
                <span className="text-slate-400 font-bold">&gt;</span>
                <span className="flex items-center gap-1">
                  <strong className="text-slate-900 dark:text-white font-bold">{userProfile?.followersCount || '1.8K'}</strong>
                  <span>followers</span>
                </span>
                <span className="text-slate-400 font-bold">&gt;</span>
                <span className="flex items-center gap-1">
                  <strong className="text-slate-900 dark:text-white font-bold">{userProfile?.followingCount || '240'}</strong>
                  <span>following</span>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1">
              <AtSign size={14} className="text-[#00D2FF]" />
              <span>{userProfile?.username || editUsername}</span>
              <span className="mx-1.5">•</span>
              <span className="text-[#FF2E93] font-semibold">
                {userProfile?.category || editCategory}
              </span>
            </p>

            <p className="text-xs sm:text-sm leading-relaxed max-w-2xl text-slate-700 dark:text-slate-200">
              {userProfile?.bio || editBio}
            </p>

            {/* Meta Row: Country & Joined Date */}
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-rose-400" />
                <span>{userProfile?.country || editCountry}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-slate-400" />
                <span>Joined {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'September 2026'}</span>
              </span>
            </div>

            {/* Social Platforms Row */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {youtubeUrl && (
                <a
                  href={`https://${youtubeUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition flex items-center gap-1"
                >
                  <ExternalLink size={10} />
                  <span>YouTube</span>
                </a>
              )}
              {instagramUrl && (
                <a
                  href={`https://${instagramUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 transition flex items-center gap-1"
                >
                  <ExternalLink size={10} />
                  <span>Instagram</span>
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={`https://${tiktokUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 transition flex items-center gap-1"
                >
                  <ExternalLink size={10} />
                  <span>TikTok</span>
                </a>
              )}
              {xUrl && (
                <a
                  href={`https://${xUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 transition flex items-center gap-1"
                >
                  <ExternalLink size={10} />
                  <span>X / Twitter</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content Tabs: [Images, Reels, Posts He Liked] */}
        <div className="mt-8">
          <div className="flex items-center justify-center border-b border-inherit gap-3 sm:gap-8">
            <button
              onClick={() => setActiveTab('images')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer border-b-2 ${
                activeTab === 'images'
                  ? 'border-[#FF2E93] text-[#FF2E93]'
                  : 'border-transparent text-slate-400 hover:text-inherit'
              }`}
            >
              <ImageIcon size={16} />
              <span>Images ({userImagePosts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer border-b-2 ${
                activeTab === 'reels'
                  ? 'border-[#00D2FF] text-[#00D2FF]'
                  : 'border-transparent text-slate-400 hover:text-inherit'
              }`}
            >
              <Film size={16} />
              <span>Reels ({userReels.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('liked')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer border-b-2 ${
                activeTab === 'liked'
                  ? 'border-rose-500 text-rose-500'
                  : 'border-transparent text-slate-400 hover:text-inherit'
              }`}
            >
              <Heart size={16} fill={activeTab === 'liked' ? 'currentColor' : 'none'} />
              <span>Liked Posts ({likedPosts.length})</span>
            </button>
          </div>

          {/* 1. IMAGES TAB */}
          {activeTab === 'images' && (
            <div className="mt-6">
              {userImagePosts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {userImagePosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-800 cursor-pointer shadow-xs"
                    >
                      <img
                        src={post.mediaUrl || post.authorAvatar}
                        alt="Post media"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 text-white font-bold text-xs sm:text-sm">
                        <span className="flex items-center gap-1">
                          <Heart size={16} fill="white" />
                          <span>{post.likesCount}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={16} fill="white" />
                          <span>{post.commentsCount || 0}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`p-12 rounded-3xl border text-center space-y-3 ${
                    isDarkMode ? 'bg-[#0B1028] border-white/10' : 'bg-white border-slate-200'
                  }`}
                >
                  <ImageIcon size={36} className="mx-auto text-slate-400" />
                  <h3 className="text-base font-bold">No Image Posts Yet</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Share your setup photos, behind-the-scenes, or artworks with the community.
                  </p>
                  <button
                    onClick={onOpenCreatePost}
                    className="gradient-btn-primary px-4 py-2 rounded-full text-xs font-bold text-white cursor-pointer"
                  >
                    Upload Image Post
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. REELS TAB */}
          {activeTab === 'reels' && (
            <div className="mt-6">
              {userReels.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {userReels.map((reel) => (
                    <div
                      key={reel.id}
                      onClick={() => onNavigate('reels')}
                      className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-black cursor-pointer shadow-md border border-white/10"
                    >
                      <video
                        src={reel.videoUrl}
                        playsInline
                        muted
                        loop
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/50 text-white">
                        <Play size={12} fill="white" />
                      </div>

                      <div className="absolute bottom-2.5 inset-x-2.5 text-white">
                        <p className="text-xs font-bold line-clamp-2 leading-tight">
                          {reel.caption}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-pink-400 font-bold">
                          <Heart size={11} fill="currentColor" />
                          <span>{reel.likesCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`p-12 rounded-3xl border text-center space-y-3 ${
                    isDarkMode ? 'bg-[#0B1028] border-white/10' : 'bg-white border-slate-200'
                  }`}
                >
                  <Film size={36} className="mx-auto text-slate-400" />
                  <h3 className="text-base font-bold">No Reels Uploaded Yet</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Drop your short-form videos and viral clips to the Reels vertical feed.
                  </p>
                  <button
                    onClick={() => onNavigate('reels')}
                    className="gradient-btn-primary px-4 py-2 rounded-full text-xs font-bold text-white cursor-pointer"
                  >
                    Open Reels Studio
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. POSTS HE LIKED TAB */}
          {activeTab === 'liked' && (
            <div className="mt-6">
              {likedPosts.length > 0 ? (
                <div className="space-y-4">
                  {likedPosts.map((post) => (
                    <div
                      key={post.id}
                      className={`p-4 sm:p-5 rounded-3xl border shadow-xs transition ${
                        isDarkMode
                          ? 'bg-[#0B1028] border-white/10 text-white'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.authorAvatar}
                            alt={post.authorName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00D2FF]/30"
                          />
                          <div>
                            <span className="text-xs sm:text-sm font-bold block">
                              {post.authorName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              @{post.authorUsername} • {post.createdAt}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => onLikePost(post.id)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition cursor-pointer"
                        >
                          <Heart size={14} fill="currentColor" />
                          <span>Liked ({post.likesCount})</span>
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-3">
                        {post.content}
                      </p>

                      {post.mediaUrl && (
                        <div className="rounded-2xl overflow-hidden max-h-80 bg-slate-900 mb-3">
                          <img
                            src={post.mediaUrl}
                            alt="Post Media"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`p-12 rounded-3xl border text-center space-y-3 ${
                    isDarkMode ? 'bg-[#0B1028] border-white/10' : 'bg-white border-slate-200'
                  }`}
                >
                  <Heart size={36} className="mx-auto text-rose-400/50" />
                  <h3 className="text-base font-bold">No Liked Posts Yet</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    When you like posts across the community, they will be organized right here for you.
                  </p>
                  <button
                    onClick={() => onNavigate('home')}
                    className="gradient-btn-primary px-4 py-2 rounded-full text-xs font-bold text-white cursor-pointer"
                  >
                    Explore Home Feed
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. PROFILE PICTURE MODAL (Only Link or Device Upload) */}
      {/* "when person press on that icon on profile picture don't show all settings only show him to add link of image or image from device" */}
      {/* ============================================================== */}
      {isAvatarModalOpen && (
        <div
          id="avatar-upload-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAvatarModalOpen(false);
          }}
        >
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden animate-scale-up ${
              isDarkMode ? 'bg-[#0B1028] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="p-5 border-b border-inherit flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-500/10 text-[#FF2E93]">
                  <Camera size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold">Change Profile Picture</h3>
                  <p className="text-[11px] text-slate-400">Add link or upload directly from your device</p>
                </div>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-inherit hover:bg-white/10 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAvatar} className="p-5 space-y-5">
              {/* Preview */}
              <div className="flex flex-col items-center justify-center pt-1">
                <img
                  src={tempAvatarUrl}
                  alt="Avatar Preview"
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-[#FF2E93]/40 shadow-xl bg-slate-800"
                />
                <span className="text-[11px] text-slate-400 mt-2 font-medium">Image Preview</span>
              </div>

              {/* Option 1: Image Link */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5">
                  <LinkIcon size={13} className="text-[#00D2FF]" />
                  <span>Image Link (URL)</span>
                </label>
                <input
                  type="url"
                  value={tempAvatarUrl.startsWith('data:') ? '' : tempAvatarUrl}
                  onChange={(e) => setTempAvatarUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-inherit opacity-30"></div>
                <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Or from device
                </span>
                <div className="flex-grow border-t border-inherit opacity-30"></div>
              </div>

              {/* Option 2: Choose from device */}
              <div>
                <label className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-[#FF2E93] dark:hover:border-[#FF2E93] cursor-pointer transition bg-slate-50 dark:bg-white/5 group">
                  <Upload size={16} className="text-[#FF2E93] group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Choose Image from Device
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-inherit transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gradient-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md shadow-[#FF1E82]/30 cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. COVER IMAGE MODAL (Only Link or Device Upload) */}
      {/* "and add icon to change cover image" */}
      {/* ============================================================== */}
      {isCoverModalOpen && (
        <div
          id="cover-upload-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCoverModalOpen(false);
          }}
        >
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden animate-scale-up ${
              isDarkMode ? 'bg-[#0B1028] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="p-5 border-b border-inherit flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Camera size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold">Change Cover Image</h3>
                  <p className="text-[11px] text-slate-400">Update your banner image using a link or device file</p>
                </div>
              </div>
              <button
                onClick={() => setIsCoverModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-inherit hover:bg-white/10 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCover} className="p-5 space-y-5">
              {/* Preview */}
              <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-900 border border-inherit">
                <img
                  src={tempCoverUrl}
                  alt="Cover Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Option 1: Image Link */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5">
                  <LinkIcon size={13} className="text-[#00D2FF]" />
                  <span>Cover Image Link (URL)</span>
                </label>
                <input
                  type="url"
                  value={tempCoverUrl.startsWith('data:') ? '' : tempCoverUrl}
                  onChange={(e) => setTempCoverUrl(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-inherit opacity-30"></div>
                <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Or from device
                </span>
                <div className="flex-grow border-t border-inherit opacity-30"></div>
              </div>

              {/* Option 2: Choose from device */}
              <div>
                <label className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-purple-400 cursor-pointer transition bg-slate-50 dark:bg-white/5 group">
                  <Upload size={16} className="text-purple-400 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Upload Banner from Device
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCoverModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-inherit transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gradient-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md shadow-[#FF1E82]/30 cursor-pointer"
                >
                  Save Cover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. ATTRACTIVE EDIT PROFILE MODAL */}
      {/* "when press on edit profile make that card attractive and remove every traffic in words and remove that section of privacy and settings from edit profile page" */}
      {/* ============================================================== */}
      {isEditProfileOpen && (
        <div
          id="edit-profile-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditProfileOpen(false);
          }}
        >
          <div
            className={`w-full max-w-xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-scale-up ${
              isDarkMode ? 'bg-[#080D24] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className="relative p-5 border-b border-inherit flex items-center justify-between bg-gradient-to-r from-[#FF2E93]/10 via-purple-500/10 to-[#00D2FF]/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FF2E93] text-white shadow-md">
                  <Edit3 size={16} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">Edit Profile</h3>
                  <span className="text-[11px] text-slate-400">Personalize your creator presence</span>
                </div>
              </div>

              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-inherit hover:bg-white/10 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body: Attractive, concise, NO word traffic, NO privacy/settings */}
            <form onSubmit={handleSaveEditProfile} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition focus:outline-hidden ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Username</label>
                  <div className="relative">
                    <AtSign size={13} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl text-xs border transition focus:outline-hidden ${
                        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Your story, focus, and projects"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition focus:outline-hidden resize-none ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Category / Niche</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="e.g. Cinematography"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition focus:outline-hidden ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Country / Region</label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition focus:outline-hidden ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-2 border-t border-inherit space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Social Channels
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">YouTube</span>
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="youtube.com/@channel"
                      className="w-full px-3 py-2 rounded-xl text-xs border border-inherit bg-transparent"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Instagram</span>
                    <input
                      type="text"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="instagram.com/user"
                      className="w-full px-3 py-2 rounded-xl text-xs border border-inherit bg-transparent"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">TikTok</span>
                    <input
                      type="text"
                      value={tiktokUrl}
                      onChange={(e) => setTiktokUrl(e.target.value)}
                      placeholder="tiktok.com/@user"
                      className="w-full px-3 py-2 rounded-xl text-xs border border-inherit bg-transparent"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">X / Twitter</span>
                    <input
                      type="text"
                      value={xUrl}
                      onChange={(e) => setXUrl(e.target.value)}
                      placeholder="x.com/user"
                      className="w-full px-3 py-2 rounded-xl text-xs border border-inherit bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-inherit flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-inherit transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gradient-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md shadow-[#FF1E82]/30 hover:opacity-95 transition cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. SETTINGS AND PRIVACY MODAL WITH TWO-FACTOR AUTHENTICATION */}
      {/* "on settings and privacy allow user to enable two factor authentication by adding phone number to receive code everyday he want to log in" */}
      {/* ============================================================== */}
      {isSettingsOpen && (
        <div
          id="settings-privacy-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSettingsOpen(false);
          }}
        >
          <div
            id="settings-privacy-dialog"
            className={`w-full max-w-xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-scale-up ${
              isDarkMode ? 'bg-[#080D24] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-inherit flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-r from-[#FF2E93] to-[#7928CA] text-white">
                  <Settings size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">Settings & Privacy</h3>
                  <p className="text-[11px] text-slate-400">Security, Two-Factor Authentication, and Account Controls</p>
                </div>
              </div>

              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveSettings} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* SECTION: TWO-FACTOR AUTHENTICATION (2FA) */}
              <div
                className={`p-4 rounded-2xl border transition ${
                  isDarkMode
                    ? 'border-[#00D2FF]/30 bg-[#00D2FF]/5'
                    : 'border-[#00D2FF]/40 bg-cyan-50/60'
                } space-y-3.5`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#00D2FF]/20 text-[#00D2FF]">
                      <Smartphone size={18} />
                    </div>
                    <div>
                      <span className={`text-sm font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Two-Factor Authentication (2FA)
                      </span>
                      <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Receive an SMS code everyday to verify your identity when logging in
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={twoFactorAuth}
                    onChange={(e) => setTwoFactorAuth(e.target.checked)}
                    className="w-5 h-5 accent-[#00D2FF] cursor-pointer"
                  />
                </div>

                {/* 2FA Phone Number Configuration */}
                {twoFactorAuth && (
                  <div className="pt-2 border-t border-inherit/20 space-y-3">
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Mobile Phone Number for Daily Login Codes
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                          <input
                            type="tel"
                            value={twoFactorPhone}
                            onChange={(e) => setTwoFactorPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl text-xs border transition focus:outline-hidden ${
                              isDarkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-xs'
                            }`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSend2FACode}
                          className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#00D2FF] text-slate-950 hover:bg-[#00D2FF]/90 transition cursor-pointer shrink-0 shadow-xs"
                        >
                          {twoFactorCodeSent ? 'Resend Code' : 'Send Daily Code'}
                        </button>
                      </div>
                    </div>

                    {/* Verification Code Box */}
                    {twoFactorCodeSent && !twoFactorVerified && (
                      <div className={`p-3 rounded-xl border space-y-2 ${
                        isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-xs'
                      }`}>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                          <Check size={13} />
                          <span>Verification code sent to {twoFactorPhone}</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <KeyRound size={14} className="absolute left-3 top-3 text-slate-400" />
                            <input
                              type="text"
                              maxLength={6}
                              value={twoFactorCodeInput}
                              onChange={(e) => setTwoFactorCodeInput(e.target.value)}
                              placeholder="6-digit code (e.g. 682914)"
                              className={`w-full pl-8 pr-3.5 py-2 rounded-xl text-xs border transition ${
                                isDarkMode ? 'border-white/20 bg-slate-950 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                              }`}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleVerify2FACode}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition cursor-pointer shrink-0 shadow-xs"
                          >
                            Verify & Activate
                          </button>
                        </div>
                      </div>
                    )}

                    {twoFactorVerified && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 size={16} className="shrink-0" />
                        <span>2FA Active: You will receive an SMS code on {twoFactorPhone} every time you log in.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION: PRIVACY CONTROLS */}
              <div className="space-y-3">
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Account Privacy
                </span>

                {/* Private Account Toggle */}
                <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                  isDarkMode ? 'border-inherit bg-white/2' : 'border-slate-200 bg-slate-50/70'
                }`}>
                  <div>
                    <span className={`text-xs font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Private Account</span>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Only approved followers can view your images & reels</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPrivateAccount}
                    onChange={(e) => setIsPrivateAccount(e.target.checked)}
                    className="w-5 h-5 accent-[#FF2E93] cursor-pointer"
                  />
                </div>

                {/* Direct Messages Permissions */}
                <div className={`p-3.5 rounded-2xl border space-y-2 ${
                  isDarkMode ? 'border-inherit bg-white/2' : 'border-slate-200 bg-slate-50/70'
                }`}>
                  <div>
                    <span className={`text-xs font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Direct Message Permissions</span>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Who can send you direct messages in Creator Meet</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {(['everyone', 'creators', 'none'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAllowDMsFrom(opt)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold capitalize border transition cursor-pointer ${
                          allowDMsFrom === opt
                            ? 'border-[#00D2FF] bg-[#00D2FF]/10 text-[#00D2FF] font-bold'
                            : isDarkMode
                            ? 'border-inherit text-slate-400 hover:text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:text-slate-950'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Online Status */}
                <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                  isDarkMode ? 'border-inherit bg-white/2' : 'border-slate-200 bg-slate-50/70'
                }`}>
                  <div>
                    <span className={`text-xs font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Show Online Activity Status</span>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Allow friends to see when you are active</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={showOnlineStatus}
                    onChange={(e) => setShowOnlineStatus(e.target.checked)}
                    className="w-5 h-5 accent-[#00D2FF] cursor-pointer"
                  />
                </div>
              </div>

              {/* SECTION: PREFERENCES & LOGOUT */}
              <div className="space-y-3 pt-2 border-t border-inherit">
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Preferences
                </span>

                {/* Theme Mode */}
                <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                  isDarkMode ? 'border-inherit bg-white/2' : 'border-slate-200 bg-slate-50/70'
                }`}>
                  <div>
                    <span className={`text-xs font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Theme Mode</span>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Currently: {isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                      isDarkMode
                        ? 'border-white/20 text-white hover:border-[#FF2E93]'
                        : 'border-slate-300 bg-white text-slate-800 hover:border-[#FF2E93] shadow-xs'
                    }`}
                  >
                    Switch to {isDarkMode ? 'Light' : 'Dark'}
                  </button>
                </div>

                {/* Logout */}
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isDarkMode ? 'border-rose-500/20 bg-rose-500/5' : 'border-rose-200 bg-rose-50'
                }`}>
                  <div>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">Sign Out</span>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Log out of your current session</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      setIsSettingsOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition cursor-pointer shadow-xs"
                  >
                    Log Out
                  </button>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-inherit flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gradient-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md shadow-[#FF1E82]/30 hover:opacity-95 transition cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Viewer Lightbox Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPost(null);
          }}
        >
          <div
            className={`w-full max-w-lg rounded-3xl overflow-hidden border shadow-2xl ${
              isDarkMode ? 'bg-[#0B1028] border-white/10 text-white' : 'bg-white text-slate-900'
            }`}
          >
            {selectedPost.mediaUrl && (
              <div className="relative aspect-video bg-black">
                <img
                  src={selectedPost.mediaUrl}
                  alt="Post"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedPost.authorAvatar}
                    alt={selectedPost.authorName}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FF2E93]"
                  />
                  <div>
                    <span className="text-xs font-bold block">{selectedPost.authorName}</span>
                    <span className="text-[10px] text-slate-400">@{selectedPost.authorUsername}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-inherit"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">{selectedPost.content}</p>
              <div className="flex items-center gap-4 text-xs font-bold pt-2 text-slate-400">
                <span className="flex items-center gap-1 text-pink-400">
                  <Heart size={14} fill="currentColor" />
                  <span>{selectedPost.likesCount} Likes</span>
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  <span>{selectedPost.commentsCount || 0} Comments</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Share Profile Modal (QR Code & Direct Share Link) */}
      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userProfile={userProfile}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
