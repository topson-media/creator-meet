import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  QrCode,
  Send,
  Share2,
  Download,
  Smartphone,
  MessageCircle,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareUrl: string;
  type: 'post' | 'profile' | 'reel';
  targetUser?: {
    name: string;
    handle: string;
    avatar: string;
  };
  isDarkMode: boolean;
  onSendInMessage?: (recipientHandle: string, shareText: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  shareUrl,
  type,
  targetUser,
  isDarkMode,
  onSendInMessage,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'message'>('link');
  const [selectedFriend, setSelectedFriend] = useState<string>('@topsonmedia');
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    try {
      navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendMessage = () => {
    if (onSendInMessage) {
      onSendInMessage(selectedFriend, messageText || `Check out this ${type}: ${shareUrl}`);
    }
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      onClose();
    }, 1200);
  };

  // Mock friends to send message to
  const friendsList = [
    {
      name: 'Topson Media',
      handle: '@topsonmedia',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Elena Rostova',
      handle: '@elenafilm',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Marcus V.',
      handle: '@marcus_vibe',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-md rounded-3xl p-6 border shadow-2xl transition-all ${
          isDarkMode
            ? 'bg-[#0A0F29] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF2E93] to-[#7928CA] flex items-center justify-center text-white">
              <Share2 size={16} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">Share {type === 'profile' ? 'Profile' : type === 'reel' ? 'Reel' : 'Post'}</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[240px]">{title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 p-1 my-4 rounded-2xl bg-black/10 dark:bg-white/5 border border-inherit">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'link'
                ? 'bg-gradient-to-r from-[#FF2E93] to-[#7928CA] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Copy size={13} />
            <span>Copy Link</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-gradient-to-r from-[#FF2E93] to-[#7928CA] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode size={13} />
            <span>QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab('message')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'message'
                ? 'bg-gradient-to-r from-[#FF2E93] to-[#7928CA] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Send size={13} />
            <span>Send Message</span>
          </button>
        </div>

        {/* Tab 1: Copy Link */}
        {activeTab === 'link' && (
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Direct Share Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className={`flex-1 p-3 rounded-2xl text-xs font-mono border transition ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-slate-200'
                      : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                />
                <button
                  onClick={handleCopy}
                  className="gradient-btn-primary px-4 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[42px]"
                >
                  {copied ? (
                    <>
                      <Check size={15} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Anyone with this link can view this {type} directly on Creator Meet.
            </p>
          </div>
        )}

        {/* Tab 2: Visual QR Code */}
        {activeTab === 'qr' && (
          <div className="flex flex-col items-center justify-center py-3 space-y-4 text-center">
            {/* High-contrast crisp vector QR Code container */}
            <div className="p-4 bg-white rounded-3xl shadow-xl ring-4 ring-[#00D2FF]/30">
              <svg
                viewBox="0 0 160 160"
                className="w-44 h-44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background */}
                <rect width="160" height="160" fill="#FFFFFF" rx="12" />
                {/* Corner Top-Left Position Detection Pattern */}
                <rect x="16" y="16" width="36" height="36" fill="#000000" rx="6" />
                <rect x="22" y="22" width="24" height="24" fill="#FFFFFF" rx="3" />
                <rect x="28" y="28" width="12" height="12" fill="#000000" rx="2" />

                {/* Corner Top-Right Position Detection Pattern */}
                <rect x="108" y="16" width="36" height="36" fill="#000000" rx="6" />
                <rect x="114" y="22" width="24" height="24" fill="#FFFFFF" rx="3" />
                <rect x="120" y="28" width="12" height="12" fill="#000000" rx="2" />

                {/* Corner Bottom-Left Position Detection Pattern */}
                <rect x="16" y="108" width="36" height="36" fill="#000000" rx="6" />
                <rect x="22" y="114" width="24" height="24" fill="#FFFFFF" rx="3" />
                <rect x="28" y="120" width="12" height="12" fill="#000000" rx="2" />

                {/* Data Matrix Dots Pattern */}
                <rect x="64" y="20" width="8" height="8" fill="#000000" rx="2" />
                <rect x="80" y="20" width="8" height="8" fill="#000000" rx="2" />
                <rect x="72" y="32" width="8" height="8" fill="#000000" rx="2" />
                <rect x="88" y="32" width="8" height="8" fill="#000000" rx="2" />
                <rect x="64" y="44" width="8" height="8" fill="#000000" rx="2" />
                <rect x="80" y="44" width="8" height="8" fill="#000000" rx="2" />

                <rect x="20" y="64" width="8" height="8" fill="#000000" rx="2" />
                <rect x="36" y="64" width="8" height="8" fill="#000000" rx="2" />
                <rect x="52" y="64" width="8" height="8" fill="#000000" rx="2" />
                <rect x="68" y="64" width="8" height="8" fill="#FF2E93" rx="2" />
                <rect x="84" y="64" width="8" height="8" fill="#000000" rx="2" />
                <rect x="100" y="64" width="8" height="8" fill="#000000" rx="2" />
                <rect x="116" y="64" width="8" height="8" fill="#000000" rx="2" />
                <rect x="132" y="64" width="8" height="8" fill="#000000" rx="2" />

                <rect x="20" y="80" width="8" height="8" fill="#000000" rx="2" />
                <rect x="36" y="80" width="8" height="8" fill="#000000" rx="2" />
                <rect x="68" y="80" width="8" height="8" fill="#7928CA" rx="2" />
                <rect x="84" y="80" width="8" height="8" fill="#000000" rx="2" />
                <rect x="100" y="80" width="8" height="8" fill="#000000" rx="2" />
                <rect x="124" y="80" width="8" height="8" fill="#000000" rx="2" />

                <rect x="20" y="96" width="8" height="8" fill="#000000" rx="2" />
                <rect x="52" y="96" width="8" height="8" fill="#000000" rx="2" />
                <rect x="68" y="96" width="8" height="8" fill="#000000" rx="2" />
                <rect x="84" y="96" width="8" height="8" fill="#000000" rx="2" />
                <rect x="116" y="96" width="8" height="8" fill="#000000" rx="2" />
                <rect x="132" y="96" width="8" height="8" fill="#000000" rx="2" />

                <rect x="64" y="116" width="8" height="8" fill="#000000" rx="2" />
                <rect x="80" y="116" width="8" height="8" fill="#000000" rx="2" />
                <rect x="96" y="116" width="8" height="8" fill="#000000" rx="2" />
                <rect x="120" y="116" width="8" height="8" fill="#000000" rx="2" />
                <rect x="72" y="128" width="8" height="8" fill="#000000" rx="2" />
                <rect x="88" y="128" width="8" height="8" fill="#000000" rx="2" />
                <rect x="112" y="128" width="8" height="8" fill="#000000" rx="2" />
                <rect x="128" y="128" width="8" height="8" fill="#000000" rx="2" />

                {/* Center Badge */}
                <circle cx="80" cy="80" r="14" fill="#0A0F29" />
                <circle cx="80" cy="80" r="11" fill="#FF2E93" />
              </svg>
            </div>

            <div>
              <p className="text-xs font-bold">Scan with phone camera</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Instant access to this {type} on any mobile device
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-full border border-inherit text-xs font-semibold hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Send in Message */}
        {activeTab === 'message' && (
          <div className="space-y-3 py-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Choose Contact or Friend</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {friendsList.map((f) => (
                  <div
                    key={f.handle}
                    onClick={() => setSelectedFriend(f.handle)}
                    className={`flex items-center justify-between p-2 rounded-xl border transition cursor-pointer ${
                      selectedFriend === f.handle
                        ? 'bg-[#FF2E93]/15 border-[#FF2E93]'
                        : isDarkMode
                        ? 'bg-slate-900 border-white/10 hover:border-white/30'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={f.avatar} alt={f.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold">{f.name}</p>
                        <p className="text-[10px] text-slate-400">{f.handle}</p>
                      </div>
                    </div>
                    {selectedFriend === f.handle && (
                      <span className="w-5 h-5 rounded-full bg-[#FF2E93] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Add Note (optional)</label>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Check this out!"
                className={`w-full p-2.5 text-xs rounded-xl border transition ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-slate-100 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={messageSent}
              className="w-full gradient-btn-primary py-2.5 text-xs font-bold text-white rounded-full flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#FF1E82]/30"
            >
              {messageSent ? (
                <>
                  <Check size={14} />
                  <span>Sent to {selectedFriend}!</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Send in Direct Message</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
