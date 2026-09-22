import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  QrCode as QrCodeIcon,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';
import { AccountBadge } from './AccountBadge';

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  isDarkMode: boolean;
}

export const ShareProfileModal: React.FC<ShareProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  isDarkMode,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#profile?u=${userProfile?.username || 'creator'}`
    : `https://creatormeet.app/@${userProfile?.username || 'creator'}`;

  const displayName = userProfile?.fullName || 'Creator';
  const handle = userProfile?.username ? `@${userProfile.username}` : '@creator';
  const avatar =
    userProfile?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7928CA&color=fff&size=120`;

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(profileUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: isDarkMode ? '#00D2FF' : '#0F172A',
        light: isDarkMode ? '#0B1028' : '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [isOpen, profileUrl, isDarkMode]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${userProfile?.username || 'creator'}-profile-qr.png`;
    a.click();
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${displayName} on CreatorMeet`,
          text: `Check out ${displayName}'s creative portfolio and reels on CreatorMeet!`,
          url: profileUrl,
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-5 sm:p-6 transition-all ${
          isDarkMode
            ? 'bg-[#080D26] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 mb-5">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-gradient-to-tr from-[#FF2E93] to-[#00D2FF] flex items-center justify-center text-white shadow-md mb-2">
            <QrCodeIcon size={20} />
          </div>
          <h3 className="text-lg font-black tracking-tight">Share Profile</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Scan with phone camera or copy link to share anywhere
          </p>
        </div>

        {/* Profile Card Summary */}
        <div
          className={`flex items-center gap-3 p-3 rounded-2xl border mb-5 ${
            isDarkMode
              ? 'bg-white/5 border-white/10'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <img
            src={avatar}
            alt={displayName}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#00D2FF]/40 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm truncate">{displayName}</span>
              <AccountBadge role={userProfile?.role || 'creator'} size="sm" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {handle} • {userProfile?.category || 'Creator'}
            </p>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center mb-5">
          <div
            className={`p-3.5 rounded-2xl border shadow-inner flex items-center justify-center ${
              isDarkMode
                ? 'bg-[#0B1028] border-white/10'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Profile QR Code"
                className="w-48 h-48 sm:w-52 sm:h-52 rounded-xl object-contain shadow-xs"
              />
            ) : (
              <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-xl flex items-center justify-center">
                <span className="text-xs text-slate-400 animate-pulse">
                  Generating QR Code...
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleDownloadQR}
            disabled={!qrDataUrl}
            className="mt-2.5 text-xs font-semibold text-[#00D2FF] hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download size={13} />
            <span>Download QR Code Image</span>
          </button>
        </div>

        {/* Share Link Input with Copy Button */}
        <div className="space-y-2 mb-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Profile Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={profileUrl}
              className={`flex-1 px-3.5 py-2 text-xs rounded-xl border truncate select-all ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-200'
                  : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            />
            <button
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'gradient-btn-primary text-white hover:opacity-90'
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Share Buttons */}
        <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={handleNativeShare}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/15 hover:border-[#00D2FF] hover:text-[#00D2FF] transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 size={13} />
            <span>Share More</span>
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Check out ${displayName}'s profile on CreatorMeet: ${profileUrl}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="py-2 px-3 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>WhatsApp</span>
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `Check out ${displayName}'s profile on CreatorMeet!`
            )}&url=${encodeURIComponent(profileUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="py-2 px-3 rounded-xl text-xs font-bold bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>X / Twitter</span>
          </a>
        </div>
      </div>
    </div>
  );
};
