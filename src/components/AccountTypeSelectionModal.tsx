import React, { useState } from 'react';
import { UserRole } from '../types';
import { Sparkles, Heart, ArrowRight, Loader2, ShieldCheck, Check } from 'lucide-react';
import { Logo } from './Logo';

interface PendingGoogleUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AccountTypeSelectionModalProps {
  user: PendingGoogleUser;
  isDarkMode: boolean;
  onSelectRole: (role: UserRole) => Promise<void>;
}

export const AccountTypeSelectionModal: React.FC<AccountTypeSelectionModalProps> = ({
  user,
  isDarkMode,
  onSelectRole,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('creator');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onSelectRole(selectedRole);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="account-type-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        id="account-type-card"
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all my-auto text-center ${
          isDarkMode
            ? 'bg-[#0A0F29] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex justify-center mb-4">
          <Logo isDark={isDarkMode} size="md" />
        </div>

        {/* User Info from Google */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-2">
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=7928CA&color=fff`}
              alt={user.displayName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#00D2FF] shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm ring-2 ring-white">
              <ShieldCheck size={12} />
            </div>
          </div>
          <h2
            id="google-user-welcome-title"
            className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Welcome, {user.displayName || 'Creator'}!
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold">
            <Check size={12} />
            <span>Google Account Authenticated & Verified</span>
          </div>
        </div>

        <p
          className={`text-xs sm:text-sm mb-5 font-medium ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Choose how you want to use Creator Meet:
        </p>

        {/* Two Choices */}
        <div className="grid grid-cols-1 gap-3 mb-6 text-left">
          {/* Creator Option */}
          <div
            id="select-role-creator"
            onClick={() => setSelectedRole('creator')}
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 ${
              selectedRole === 'creator'
                ? 'border-[#FF2E93] bg-[#FF2E93]/10 ring-2 ring-[#FF2E93]'
                : isDarkMode
                ? 'border-white/10 bg-slate-900/40 hover:border-slate-600'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-[#FF2E93] flex items-center justify-center font-bold shrink-0 mt-0.5">
                <Sparkles size={18} />
              </div>
              <div>
                <span
                  className={`text-sm font-bold block ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Content Creator
                </span>
                <span className="text-xs text-slate-400 block mt-0.5 leading-relaxed">
                  Collab with fellow creators, publish posts & reels, connect with brands, and grow your audience.
                </span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                selectedRole === 'creator'
                  ? 'border-[#FF2E93] bg-[#FF2E93] text-white'
                  : 'border-slate-500'
              }`}
            >
              {selectedRole === 'creator' && <Check size={12} />}
            </div>
          </div>

          {/* Fan Option */}
          <div
            id="select-role-fan"
            onClick={() => setSelectedRole('fan')}
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 ${
              selectedRole === 'fan'
                ? 'border-[#00D2FF] bg-[#00D2FF]/10 ring-2 ring-[#00D2FF]'
                : isDarkMode
                ? 'border-white/10 bg-slate-900/40 hover:border-slate-600'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-[#00D2FF] flex items-center justify-center font-bold shrink-0 mt-0.5">
                <Heart size={18} fill="currentColor" />
              </div>
              <div>
                <span
                  className={`text-sm font-bold block ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Fan & Community Member
                </span>
                <span className="text-xs text-slate-400 block mt-0.5 leading-relaxed">
                  Discover inspiring creators, join exclusive communities, support favorite talent, and chat.
                </span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                selectedRole === 'fan'
                  ? 'border-[#00D2FF] bg-[#00D2FF] text-white'
                  : 'border-slate-500'
              }`}
            >
              {selectedRole === 'fan' && <Check size={12} />}
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          id="confirm-role-selection-btn"
          type="button"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="w-full py-3 px-5 rounded-full text-sm font-bold text-white gradient-btn-primary shadow-lg shadow-[#FF1E82]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Setting up your account...</span>
            </>
          ) : (
            <>
              <span>Continue to Creator Meet</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
