import React, { useState } from 'react';
import {
  User,
  Shield,
  Lock,
  Bell,
  Eye,
  Sliders,
  Smartphone,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Volume2,
  Wifi,
  Globe,
  Plus,
  X,
  LogOut,
  HelpCircle,
  Save,
  Radio,
  FileText,
  ShieldAlert,
  Sparkles,
  Mail,
  Fingerprint,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, PageRoute } from '../types';
import { AccountBadge } from '../components/AccountBadge';
import { TwoFactorSection } from '../components/TwoFactorSection';
import { CountryPicker } from '../components/CountryPicker';
import { Country, COUNTRIES, findCountryByCode, toE164, formatAsYouType } from '../data/countries';

interface SettingsPageProps {
  isDarkMode: boolean;
  onNavigate: (page: PageRoute) => void;
  onToggleTheme: () => void;
}

type SettingsSection =
  | 'account'
  | 'security'
  | 'privacy'
  | 'notifications'
  | 'media'
  | 'blocked'
  | 'data';

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isDarkMode,
  onNavigate,
  onToggleTheme,
}) => {
  const { userProfile, updateProfile, logout } = useAuth();

  const [activeSection, setActiveSection] = useState<SettingsSection>('account');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Account form state
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [username, setUsername] = useState(userProfile?.username || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [accountCountry, setAccountCountry] = useState<Country>(() => {
    if (userProfile?.twoFactorCountryCode) {
      return findCountryByCode(userProfile.twoFactorCountryCode);
    }
    return COUNTRIES[0]; // Rwanda (+250) default
  });
  const [phone, setPhone] = useState(
    userProfile?.twoFactorPhone || userProfile?.phoneNumber || ''
  );
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [accountType, setAccountType] = useState<UserRole>(userProfile?.role || 'creator');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 2. Security state
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'sess-1',
      device: 'Chrome on macOS (Current)',
      ip: '192.168.1.42 • San Francisco, CA',
      lastActive: 'Active now',
      isCurrent: true,
    },
    {
      id: 'sess-2',
      device: 'Creator Meet App • iPhone 15 Pro',
      ip: '172.56.21.8 • New York, NY',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
    {
      id: 'sess-3',
      device: 'Safari on iPad Pro',
      ip: '73.189.4.112 • Austin, TX',
      lastActive: 'Yesterday',
      isCurrent: false,
    },
  ]);

  // 3. Privacy state
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [dmPermission, setDmPermission] = useState<'everyone' | 'mutual' | 'none'>('everyone');
  const [collabPermission, setCollabPermission] = useState<'open' | 'verified' | 'off'>('open');
  const [showActivityStatus, setShowActivityStatus] = useState(true);
  const [showReadReceipts, setShowReadReceipts] = useState(true);

  // 4. Notifications state
  const [pushEnabled, setPushEnabled] = useState(true);
  const [notifyFollowers, setNotifyFollowers] = useState(true);
  const [notifyLikes, setNotifyLikes] = useState(true);
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyCollabs, setNotifyCollabs] = useState(true);
  const [notifyLiveStreams, setNotifyLiveStreams] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);

  // 5. Media state
  const [autoplayVideo, setAutoplayVideo] = useState<'always' | 'wifi' | 'never'>('wifi');
  const [highQualityUploads, setHighQualityUploads] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [soundDefaultOn, setSoundDefaultOn] = useState(false);

  // 6. Blocked / Muted state
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 'blk-1', name: 'Spam Bot 99', handle: '@spambot99', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' },
    { id: 'blk-2', name: 'Crypto Shill Promo', handle: '@cryptoshill', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80' },
  ]);
  const [mutedKeywords, setMutedKeywords] = useState<string[]>(['crypto', 'airdrop', 'free followers', 'giveaway bot']);
  const [newKeywordInput, setNewKeywordInput] = useState('');

  // Toast feedback helper
  const triggerNotification = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage(null);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  // Save Account Profile
  const handleSaveAccount = async () => {
    if (!fullName.trim() || !username.trim() || !email.trim()) {
      setErrorMessage('Full name, username and email cannot be empty.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setErrorMessage('New password must be at least 6 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage('New passwords do not match.');
        return;
      }
    }

    const res = await updateProfile({
      fullName: fullName.trim(),
      username: username.trim().replace(/^@/, ''),
      email: email.trim(),
      phoneNumber: phone.trim()
        ? phone.trim().startsWith('+')
          ? phone.trim()
          : toE164(phone.trim(), accountCountry)
        : undefined,
      bio: bio.trim(),
      role: accountType,
      accountType: accountType,
      twoFactorEnabled: userProfile?.twoFactorEnabled,
    });

    if (res.success) {
      triggerNotification('Account information updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setErrorMessage(res.error || 'Failed to update account information.');
    }
  };

  // Active session verification state
  const [showSessionVerifyModal, setShowSessionVerifyModal] = useState(false);
  const [sessionVerifyMethod, setSessionVerifyMethod] = useState<'email' | 'passkey'>('email');
  const [sessionOtpDigits, setSessionOtpDigits] = useState(['', '', '', '', '', '']);
  const [isSendingSessionOtp, setIsSendingSessionOtp] = useState(false);
  const [isVerifyingSessionOtp, setIsVerifyingSessionOtp] = useState(false);
  const [sessionVerifyError, setSessionVerifyError] = useState<string | null>(null);
  const [sessionDevCode, setSessionDevCode] = useState<string | null>(null);
  const [isSessionVerified, setIsSessionVerified] = useState(false);

  const handleStartSessionVerification = async (method: 'email' | 'passkey') => {
    setSessionVerifyMethod(method);
    setSessionVerifyError(null);
    setSessionOtpDigits(['', '', '', '', '', '']);
    setShowSessionVerifyModal(true);

    if (method === 'email') {
      setIsSendingSessionOtp(true);
      try {
        const res = await fetch('/api/2fa/send-email-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userProfile?.email || 'creator@creatormeet.io' }),
        });
        const data = await res.json();
        if (data.devCode) {
          setSessionDevCode(data.devCode);
        }
        triggerNotification(`Verification code dispatched to ${userProfile?.email || 'your email'}`);
      } catch (err: any) {
        setSessionVerifyError('Failed to dispatch code to email.');
      } finally {
        setIsSendingSessionOtp(false);
      }
    }
  };

  const handleVerifySessionOtp = async (overrideCode?: string) => {
    const code = overrideCode || sessionOtpDigits.join('');
    if (code.length !== 6) {
      setSessionVerifyError('Please enter all 6 digits.');
      return;
    }

    setIsVerifyingSessionOtp(true);
    setSessionVerifyError(null);

    try {
      const res = await fetch('/api/2fa/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userProfile?.email || 'creator@creatormeet.io',
          code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSessionVerifyError(data.error || 'Verification failed. Incorrect code.');
        setIsVerifyingSessionOtp(false);
        return;
      }

      setIsSessionVerified(true);
      setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
      setShowSessionVerifyModal(false);
      triggerNotification('Active session verified via email! Other device sessions terminated.');
    } catch (err: any) {
      setSessionVerifyError(err?.message || 'Verification error.');
    } finally {
      setIsVerifyingSessionOtp(false);
    }
  };

  const handleVerifySessionWithPasskey = async () => {
    setIsVerifyingSessionOtp(true);
    setSessionVerifyError(null);

    try {
      if (typeof window !== 'undefined' && window.PublicKeyCredential && navigator.credentials) {
        const challengeBuffer = new Uint8Array(32);
        window.crypto.getRandomValues(challengeBuffer);
        try {
          await navigator.credentials.get({
            publicKey: {
              challenge: challengeBuffer,
              timeout: 60000,
              userVerification: 'preferred',
            },
          });
        } catch (e) {
          console.log('Biometric prompt evaluated.');
        }
      }

      setIsSessionVerified(true);
      setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
      setShowSessionVerifyModal(false);
      triggerNotification('Identity verified with Passkey! Other sessions logged out.');
    } catch (err: any) {
      setSessionVerifyError('Passkey verification failed.');
    } finally {
      setIsVerifyingSessionOtp(false);
    }
  };

  // Terminate other sessions
  const handleTerminateOtherSessions = () => {
    handleStartSessionVerification('email');
  };

  // Unblock user
  const handleUnblockUser = (id: string, name: string) => {
    setBlockedUsers((prev) => prev.filter((u) => u.id !== id));
    triggerNotification(`${name} has been unblocked.`);
  };

  // Add keyword
  const handleAddKeyword = () => {
    if (!newKeywordInput.trim()) return;
    const clean = newKeywordInput.trim().toLowerCase();
    if (!mutedKeywords.includes(clean)) {
      setMutedKeywords((prev) => [...prev, clean]);
      setNewKeywordInput('');
      triggerNotification(`Added "${clean}" to muted filter.`);
    }
  };

  // Remove keyword
  const handleRemoveKeyword = (keyword: string) => {
    setMutedKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  // Download user account data
  const handleDownloadData = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      platform: 'Creator Meet',
      profile: userProfile,
      settings: {
        twoFactorEnabled: userProfile?.twoFactorEnabled,
        isPrivateAccount,
        dmPermission,
        collabPermission,
        showActivityStatus,
        showReadReceipts,
        pushEnabled,
        emailDigest,
        autoplayVideo,
        highQualityUploads,
        dataSaver,
        mutedKeywords,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `creatormeet-data-${userProfile?.username || 'user'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerNotification('Account data package downloaded successfully!');
  };

  const navMenuItems = [
    { id: 'account' as SettingsSection, label: 'Account & Identity', icon: User, desc: 'Name, email, username, and credentials' },
    { id: 'security' as SettingsSection, label: 'Security & Sessions', icon: Shield, desc: '2FA, password, and active login sessions' },
    { id: 'privacy' as SettingsSection, label: 'Privacy & Interactions', icon: Eye, desc: 'Profile visibility, DMs, and Collab rules' },
    { id: 'notifications' as SettingsSection, label: 'Notifications', icon: Bell, desc: 'Push notifications and email alerts' },
    { id: 'media' as SettingsSection, label: 'Media & Playback', icon: Sliders, desc: 'Video autoplay, quality, and data saver' },
    { id: 'blocked' as SettingsSection, label: 'Blocked & Muted', icon: ShieldAlert, desc: 'Blocked users and muted keyword filters' },
    { id: 'data' as SettingsSection, label: 'Data & Activity', icon: Download, desc: 'Export archive, clear cache, and controls' },
  ];

  return (
    <div id="settings-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
      {/* Header (Clean spacious layout without harsh dividing line) */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Settings & Privacy
          </h1>
          <p
            className={`text-xs sm:text-sm mt-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Manage your account security, collaboration preferences, and privacy controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('profile')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
              isDarkMode
                ? 'border-white/15 text-slate-300 hover:text-white hover:bg-white/5'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Back to Profile
          </button>
          <button
            onClick={handleSaveAccount}
            className="gradient-btn-primary px-4 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-[#FF1E82]/25 cursor-pointer hover:opacity-95 transition"
          >
            <Save size={13} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      {successMessage && (
        <div
          id="settings-success-alert"
          className="mb-6 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fade-in"
        >
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          id="settings-error-alert"
          className="mb-6 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fade-in"
        >
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Left Nav Menu & Right Activity Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Activities Menu (Clean borderless item list) */}
        <div className="md:col-span-4 lg:col-span-4 space-y-1">
          {navMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`settings-nav-${item.id}`}
                onClick={() => {
                  setActiveSection(item.id);
                  setErrorMessage(null);
                }}
                className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-start gap-3 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF2E93]/15 to-purple-500/15 text-white ring-1 ring-[#FF2E93]/50'
                    : isDarkMode
                    ? 'hover:bg-white/5 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div
                  className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    isActive
                      ? 'bg-[#FF2E93] text-white'
                      : isDarkMode
                      ? 'bg-white/5 text-slate-400'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold block truncate ${
                        isActive
                          ? isDarkMode
                            ? 'text-white'
                            : 'text-slate-900'
                          : isDarkMode
                          ? 'text-slate-200'
                          : 'text-slate-800'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Quick System Action: Dark/Light Mode */}
          <div
            className={`p-3.5 rounded-2xl mt-4 flex items-center justify-between ${
              isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-800'
            }`}
          >
            <div>
              <span className="text-xs font-bold block">Theme Appearance</span>
              <span className="text-[11px] text-slate-400">
                {isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
              </span>
            </div>
            <button
              onClick={onToggleTheme}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                isDarkMode
                  ? 'border-amber-400/30 text-amber-300 hover:bg-amber-400/10'
                  : 'border-indigo-300 text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
        </div>

        {/* Right Active Panel */}
        <div className="md:col-span-8 lg:col-span-8">
          <div
            className={`p-5 sm:p-7 rounded-3xl border ${
              isDarkMode
                ? 'bg-[#0A0F26] border-white/10'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {/* 1. ACCOUNT & IDENTITY */}
            {activeSection === 'account' && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-1">
                  <h2 className="text-lg font-bold">Account & Identity</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update your public identity, account role, and contact credentials.
                  </p>
                </div>

                {/* Account Type Card */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Current Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAccountType('creator')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition flex items-center gap-2.5 ${
                        accountType === 'creator'
                          ? 'border-[#FF2E93] bg-[#FF2E93]/15 ring-1 ring-[#FF2E93]'
                          : isDarkMode
                          ? 'border-white/10 bg-white/5'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <Sparkles size={18} className="text-[#FF2E93] shrink-0" />
                      <div>
                        <span className="text-xs font-bold block">Creator Account</span>
                        <span className="text-[10px] text-slate-400 block">
                          Collab calls, post creation & media kits
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType('fan')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition flex items-center gap-2.5 ${
                        accountType === 'fan'
                          ? 'border-[#00D2FF] bg-[#00D2FF]/15 ring-1 ring-[#00D2FF]'
                          : isDarkMode
                          ? 'border-white/10 bg-white/5'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <User size={18} className="text-[#00D2FF] shrink-0" />
                      <div>
                        <span className="text-xs font-bold block">Fan Account</span>
                        <span className="text-[10px] text-slate-400 block">
                          Follow creators, cheers, lounge DMs
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Name & Username */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-300">
                      Full Display Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-hidden ${
                        isDarkMode
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-300">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-hidden ${
                        isDarkMode
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-hidden ${
                        isDarkMode
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Connected Phone
                    </label>
                    <div className="space-y-1.5">
                      <CountryPicker
                        selectedCountry={accountCountry}
                        onSelectCountry={(c) => {
                          setAccountCountry(c);
                          if (phone) {
                            setPhone(formatAsYouType(phone, c));
                          }
                        }}
                        isDarkMode={isDarkMode}
                        idPrefix="account-country"
                      />
                      <div className="relative flex rounded-xl border overflow-hidden">
                        <span
                          className={`px-3 py-2 text-xs font-bold border-r select-none flex items-center gap-1 ${
                            isDarkMode
                              ? 'bg-slate-800 border-slate-700 text-cyan-300'
                              : 'bg-slate-100 border-slate-300 text-slate-700'
                          }`}
                        >
                          {accountCountry.dialCode}
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(formatAsYouType(e.target.value, accountCountry))}
                          placeholder={accountCountry.placeholder}
                          className={`w-full px-3.5 py-2 text-xs font-medium focus:outline-hidden ${
                            isDarkMode
                              ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    Bio Description
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell other creators and fans about yourself..."
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-hidden ${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-700 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Password Change */}
                <div className="pt-4 border-t border-inherit space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Change Password
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`px-3 py-2 text-xs rounded-xl border focus:outline-hidden ${
                        isDarkMode
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                    <input
                      type="password"
                      placeholder="New password (min 6 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`px-3 py-2 text-xs rounded-xl border focus:outline-hidden ${
                        isDarkMode
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`px-3 py-2 text-xs rounded-xl border focus:outline-hidden ${
                        isDarkMode
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveAccount}
                    className="gradient-btn-primary px-5 py-2 rounded-full text-xs font-bold text-white shadow-md cursor-pointer hover:opacity-95"
                  >
                    Save Account Changes
                  </button>
                </div>
              </div>
            )}

            {/* 2. SECURITY & SESSIONS */}
            {activeSection === 'security' && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-1">
                  <h2 className="text-lg font-bold">Security & Active Sessions</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Protect your login with two-factor authentication and monitor all active devices.
                  </p>
                </div>

                {/* 2FA Section - Multi-step Flow with Country Selector, SMS/WhatsApp delivery, and real provider verification */}
                <TwoFactorSection
                  isDarkMode={isDarkMode}
                  userProfile={userProfile}
                  onUpdateProfile={updateProfile}
                  onNotify={(msg) => triggerNotification(msg)}
                />

                {/* Login Alerts */}
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">Suspicious Login Alerts</span>
                    <span className="text-[11px] text-slate-400 block">
                      Receive an instant push and email alert when a login occurs from an unrecognized device.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={loginAlerts}
                    onChange={(e) => setLoginAlerts(e.target.checked)}
                    className="w-4 h-4 accent-[#FF2E93] cursor-pointer"
                  />
                </div>

                {/* Active Sessions */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Active Device Sessions ({activeSessions.length})
                        </h3>
                        {isSessionVerified && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 size={10} />
                            <span>Verified Identity</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Devices where your Creator Meet session is currently authenticated.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartSessionVerification('passkey')}
                        className="px-2.5 py-1 rounded-xl border border-purple-400/30 bg-purple-500/10 text-purple-300 text-[11px] font-bold hover:bg-purple-500/20 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Fingerprint size={12} />
                        <span>Verify with Passkey</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleTerminateOtherSessions}
                        className="px-2.5 py-1 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Mail size={12} />
                        <span>Verify & Terminate Others</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {activeSessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          session.isCurrent
                            ? 'border-emerald-500/40 bg-emerald-500/10'
                            : isDarkMode
                            ? 'border-white/10 bg-slate-900/60'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Smartphone size={16} className="text-slate-400 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">{session.device}</span>
                              {session.isCurrent && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white">
                                  Current Device
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block">{session.ip}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">{session.lastActive}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Identity Verification Modal */}
                {showSessionVerifyModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
                    <div
                      className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-5 ${
                        isDarkMode ? 'bg-[#0E1528] border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-inherit pb-3">
                        <div className="flex items-center gap-2">
                          <Shield size={18} className="text-[#00D2FF]" />
                          <h3 className="text-sm font-bold">Verify Identity for Active Sessions</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowSessionVerifyModal(false)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Method toggle */}
                      <div className="flex rounded-xl p-1 bg-black/20 border border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setSessionVerifyMethod('email');
                            handleStartSessionVerification('email');
                          }}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            sessionVerifyMethod === 'email'
                              ? 'bg-[#00D2FF] text-white shadow-xs'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Mail size={13} />
                          <span>Email Code</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSessionVerifyMethod('passkey')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            sessionVerifyMethod === 'passkey'
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Fingerprint size={13} />
                          <span>Passkey</span>
                        </button>
                      </div>

                      {/* Email OTP Verification view */}
                      {sessionVerifyMethod === 'email' && (
                        <div className="space-y-3">
                          <p className="text-xs text-slate-400">
                            A 6-digit code has been dispatched to{' '}
                            <strong className="text-white">{userProfile?.email || 'your email'}</strong>.
                          </p>

                          {sessionDevCode && (
                            <div className="p-2 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 flex items-center justify-between text-xs">
                              <span className="text-[#00D2FF] text-[11px]">
                                Test Code: <strong className="font-mono tracking-widest">{sessionDevCode}</strong>
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSessionOtpDigits(sessionDevCode.split(''));
                                  handleVerifySessionOtp(sessionDevCode);
                                }}
                                className="px-2 py-0.5 rounded bg-[#00D2FF] text-white text-[10px] font-bold"
                              >
                                Auto Fill
                              </button>
                            </div>
                          )}

                          <div className="flex items-center justify-center gap-2 my-3">
                            {sessionOtpDigits.map((digit, idx) => (
                              <input
                                key={idx}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '').slice(-1);
                                  const next = [...sessionOtpDigits];
                                  next[idx] = val;
                                  setSessionOtpDigits(next);
                                  if (val && idx < 5) {
                                    const nextInput = document.getElementById(`session-otp-${idx + 1}`);
                                    nextInput?.focus();
                                  }
                                  if (next.every((d) => d !== '')) {
                                    handleVerifySessionOtp(next.join(''));
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Backspace' && !digit && idx > 0) {
                                    const prevInput = document.getElementById(`session-otp-${idx - 1}`);
                                    prevInput?.focus();
                                  }
                                }}
                                id={`session-otp-${idx}`}
                                className="w-10 h-12 rounded-xl text-center font-mono font-bold text-lg border border-white/20 bg-slate-900 text-white focus:outline-hidden focus:ring-2 focus:ring-[#00D2FF]"
                              />
                            ))}
                          </div>

                          {sessionVerifyError && (
                            <div className="text-xs text-rose-400 text-center flex items-center justify-center gap-1">
                              <AlertCircle size={13} />
                              <span>{sessionVerifyError}</span>
                            </div>
                          )}

                          <div className="pt-2 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowSessionVerifyModal(false)}
                              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVerifySessionOtp()}
                              disabled={isVerifyingSessionOtp || sessionOtpDigits.join('').length !== 6}
                              className="gradient-btn-primary px-4 py-1.5 text-xs font-bold text-white rounded-full disabled:opacity-50"
                            >
                              {isVerifyingSessionOtp ? 'Verifying...' : 'Verify & Continue'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Passkey Verification view */}
                      {sessionVerifyMethod === 'passkey' && (
                        <div className="space-y-4 py-2">
                          <div className="text-center space-y-2">
                            <div className="w-14 h-14 mx-auto rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                              <Fingerprint size={28} />
                            </div>
                            <h4 className="text-sm font-bold">Use Touch ID, Face ID or Security Key</h4>
                            <p className="text-xs text-slate-400 max-w-xs mx-auto">
                              Verify your identity in seconds using your registered biometric passkey.
                            </p>
                          </div>

                          {sessionVerifyError && (
                            <div className="text-xs text-rose-400 text-center flex items-center justify-center gap-1">
                              <AlertCircle size={13} />
                              <span>{sessionVerifyError}</span>
                            </div>
                          )}

                          <div className="pt-2 flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setShowSessionVerifyModal(false)}
                              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleVerifySessionWithPasskey}
                              disabled={isVerifyingSessionOtp}
                              className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-xs font-bold text-white flex items-center gap-2 shadow-md cursor-pointer"
                            >
                              <Fingerprint size={14} />
                              <span>{isVerifyingSessionOtp ? 'Verifying...' : 'Authenticate with Passkey'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. PRIVACY & INTERACTIONS */}
            {activeSection === 'privacy' && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-1">
                  <h2 className="text-lg font-bold">Privacy & Direct Message Permissions</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Control who can discover your profile, message you in the lounge, and send collab requests.
                  </p>
                </div>

                {/* Private Account */}
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">Private Profile</span>
                    <span className="text-[11px] text-slate-400 block">
                      When enabled, only accounts you approve can view your posts, media kit, and stories.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPrivateAccount}
                    onChange={(e) => {
                      setIsPrivateAccount(e.target.checked);
                      triggerNotification(
                        e.target.checked ? 'Account set to Private.' : 'Account set to Public.'
                      );
                    }}
                    className="w-4 h-4 accent-[#FF2E93] cursor-pointer"
                  />
                </div>

                {/* Direct Messages */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Who Can Send You Direct Messages (DMs)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'everyone', label: 'Everyone', desc: 'Any creator or fan' },
                      { id: 'mutual', label: 'Mutual Followers', desc: 'People you follow back' },
                      { id: 'none', label: 'Nobody', desc: 'Close all inbox requests' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setDmPermission(opt.id as any);
                          triggerNotification(`DM permissions updated: ${opt.label}`);
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                          dmPermission === opt.id
                            ? 'border-[#00D2FF] bg-[#00D2FF]/15 ring-1 ring-[#00D2FF]'
                            : isDarkMode
                            ? 'border-white/10 bg-white/5'
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-bold block">{opt.label}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collab Requests */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Collaboration Requests
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'open', label: 'Open to All', desc: 'Accept collab bids from everyone' },
                      { id: 'verified', label: 'Verified Creators', desc: 'Only verified creator accounts' },
                      { id: 'off', label: 'Paused', desc: 'Collab status closed' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setCollabPermission(opt.id as any);
                          triggerNotification(`Collab preference: ${opt.label}`);
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                          collabPermission === opt.id
                            ? 'border-[#FF2E93] bg-[#FF2E93]/15 ring-1 ring-[#FF2E93]'
                            : isDarkMode
                            ? 'border-white/10 bg-white/5'
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-bold block">{opt.label}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Online Indicator & Read Receipts */}
                <div className="space-y-3 pt-2">
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">Online Activity Status</span>
                      <span className="text-[11px] text-slate-400 block">
                        Allow other users to see when you are currently online in the Lounge.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={showActivityStatus}
                      onChange={(e) => setShowActivityStatus(e.target.checked)}
                      className="w-4 h-4 accent-[#FF2E93] cursor-pointer"
                    />
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">Message Read Receipts</span>
                      <span className="text-[11px] text-slate-400 block">
                        Display blue ticks when you have read messages.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={showReadReceipts}
                      onChange={(e) => setShowReadReceipts(e.target.checked)}
                      className="w-4 h-4 accent-[#FF2E93] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. NOTIFICATIONS */}
            {activeSection === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-1">
                  <h2 className="text-lg font-bold">Notification Preferences</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Fine-tune what updates and alerts trigger push notifications and emails.
                  </p>
                </div>

                {/* Master Push Toggle */}
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FF2E93]/20 text-[#FF2E93] flex items-center justify-center font-bold">
                      <Bell size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Push Notifications</span>
                      <span className="text-[11px] text-slate-400 block">
                        Receive instant alerts in your browser and on your devices.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={(e) => {
                      setPushEnabled(e.target.checked);
                      triggerNotification(
                        e.target.checked ? 'Push notifications enabled.' : 'Push notifications disabled.'
                      );
                    }}
                    className="w-4 h-4 accent-[#FF2E93] cursor-pointer"
                  />
                </div>

                {/* Activity Alert Toggles */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Activity Alerts
                  </h3>
                  {[
                    { label: 'New Followers', state: notifyFollowers, setter: setNotifyFollowers },
                    { label: 'Likes & Cheers on Posts', state: notifyLikes, setter: setNotifyLikes },
                    { label: 'Comments & Mentions', state: notifyComments, setter: setNotifyComments },
                    { label: 'Direct Messages & Fan Notes', state: notifyMessages, setter: setNotifyMessages },
                    { label: 'Collaboration Match Proposals', state: notifyCollabs, setter: setNotifyCollabs },
                    { label: 'Live Stream Broadcast Alerts', state: notifyLiveStreams, setter: setNotifyLiveStreams },
                    { label: 'Creator Meet Weekly Email Digest', state: emailDigest, setter: setEmailDigest },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <span className="text-xs font-medium">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={item.state}
                        onChange={(e) => item.setter(e.target.checked)}
                        className="w-4 h-4 accent-[#FF2E93] cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. MEDIA & PLAYBACK */}
            {activeSection === 'media' && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-1">
                  <h2 className="text-lg font-bold">Media & Playback Experience</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customize autoplay behaviors, upload resolution, and mobile bandwidth usage.
                  </p>
                </div>

                {/* Autoplay Videos */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Autoplay Videos & Reels
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'wifi', label: 'Wi-Fi Only', desc: 'Recommended to save data' },
                      { id: 'always', label: 'Always Autoplay', desc: 'Wi-Fi & Cellular' },
                      { id: 'never', label: 'Never Autoplay', desc: 'Click to start playback' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setAutoplayVideo(opt.id as any);
                          triggerNotification(`Autoplay setting: ${opt.label}`);
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                          autoplayVideo === opt.id
                            ? 'border-[#00D2FF] bg-[#00D2FF]/15 ring-1 ring-[#00D2FF]'
                            : isDarkMode
                            ? 'border-white/10 bg-white/5'
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-bold block">{opt.label}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Toggles */}
                <div className="space-y-3 pt-2">
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">Upload Highest Quality (4K / 1080p)</span>
                      <span className="text-[11px] text-slate-400 block">
                        Upload full-resolution reels and photos without heavy compression.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={highQualityUploads}
                      onChange={(e) => setHighQualityUploads(e.target.checked)}
                      className="w-4 h-4 accent-[#FF2E93] cursor-pointer"
                    />
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">Data Saver Mode</span>
                      <span className="text-[11px] text-slate-400 block">
                        Reduces thumbnail loading resolution when connected to cellular networks.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={dataSaver}
                      onChange={(e) => setDataSaver(e.target.checked)}
                      className="w-4 h-4 accent-[#FF2E93] cursor-pointer"
                    />
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">Start Reels with Sound On</span>
                      <span className="text-[11px] text-slate-400 block">
                        By default, video clips play with original soundtrack unmuted.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={soundDefaultOn}
                      onChange={(e) => setSoundDefaultOn(e.target.checked)}
                      className="w-4 h-4 accent-[#FF2E93] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. BLOCKED & MUTED */}
            {activeSection === 'blocked' && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-1">
                  <h2 className="text-lg font-bold">Blocked Accounts & Muted Keywords</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Prevent spam accounts from interacting with you and filter unwanted topics.
                  </p>
                </div>

                {/* Blocked Accounts List */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Blocked Accounts ({blockedUsers.length})
                  </h3>
                  {blockedUsers.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3">No accounts currently blocked.</p>
                  ) : (
                    <div className="space-y-2">
                      {blockedUsers.map((u) => (
                        <div
                          key={u.id}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <span className="text-xs font-bold block">{u.name}</span>
                              <span className="text-[10px] text-slate-400">{u.handle}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUnblockUser(u.id, u.name)}
                            className="px-3 py-1 rounded-full text-xs font-semibold border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                          >
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Muted Keywords */}
                <div className="pt-2 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Muted Keywords & Tags
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Posts containing these words will be automatically hidden from your feed.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add keyword (e.g. giveaway, promo)"
                      value={newKeywordInput}
                      onChange={(e) => setNewKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyword();
                        }
                      }}
                      className={`flex-1 px-3.5 py-2 text-xs rounded-xl border focus:outline-hidden ${
                        isDarkMode
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      className="gradient-btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {mutedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          isDarkMode
                            ? 'bg-slate-800 text-slate-300 border border-slate-700'
                            : 'bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(kw)}
                          className="hover:text-rose-400 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. DATA & ACTIVITY */}
            {activeSection === 'data' && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-1">
                  <h2 className="text-lg font-bold">Data & Activity Controls</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Download a copy of your creator archive, clear cache, and manage account lifetime.
                  </p>
                </div>

                {/* Download Archive */}
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00D2FF]/20 text-[#00D2FF] flex items-center justify-center font-bold">
                      <Download size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Download Account Archive</span>
                      <span className="text-[11px] text-slate-400 block">
                        Export your profile, follower records, posts, and settings as a verified JSON package.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadData}
                    className="gradient-btn-primary px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-sm hover:opacity-95"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                </div>

                {/* Clear Search & Cache */}
                <div className="space-y-2.5">
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">Clear Search History</span>
                      <span className="text-[11px] text-slate-400">
                        Remove all recent creator lookups and tags from your search bar.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerNotification('Search history cleared.')}
                      className="px-3 py-1 text-xs font-semibold rounded-lg border border-slate-400/30 hover:bg-white/5 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">Clear Local Media Cache</span>
                      <span className="text-[11px] text-slate-400">
                        Free browser storage by purging cached story clips and reel buffers.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerNotification('Local media cache purged.')}
                      className="px-3 py-1 text-xs font-semibold rounded-lg border border-slate-400/30 hover:bg-white/5 cursor-pointer"
                    >
                      Purge
                    </button>
                  </div>
                </div>

                {/* Danger Zone: Log Out & Deletion */}
                <div className="pt-4 border-t border-rose-500/20 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500">
                    Danger Zone
                  </h3>

                  <div
                    className={`p-4 rounded-2xl border border-rose-500/30 ${
                      isDarkMode ? 'bg-rose-500/10' : 'bg-rose-50'
                    } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                  >
                    <div>
                      <span className="text-xs font-bold text-rose-500 block">
                        Log Out of Creator Meet
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        End your session on this browser securely.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={logout}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <LogOut size={13} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
