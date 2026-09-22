import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  LogOut,
  Sun,
  Moon,
  ShieldCheck,
  Clock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface EmailVerificationScreenProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onVerifiedSuccess?: () => void;
}

export const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({
  isDarkMode,
  onToggleTheme,
  onVerifiedSuccess,
}) => {
  const { currentUser, userProfile, checkEmailVerification, resendVerificationEmail, logout } = useAuth();

  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Email address to show
  const targetEmail = currentUser?.email || userProfile?.email || 'your email address';

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Handler for "I've verified my email" button
  const handleCheckStatus = async () => {
    setIsChecking(true);
    setStatusMessage(null);

    try {
      const res = await checkEmailVerification();
      setIsChecking(false);

      if (res.isVerified) {
        setStatusMessage({
          type: 'success',
          text: 'Email verified successfully! Opening your Creator Meet account...',
        });
        if (onVerifiedSuccess) {
          setTimeout(onVerifiedSuccess, 1200);
        }
      } else {
        setStatusMessage({
          type: 'error',
          text:
            res.message ||
            'We have not detected your verification yet. Please click the link sent to your email, then click this button again.',
        });
      }
    } catch (err) {
      setIsChecking(false);
      setStatusMessage({
        type: 'error',
        text: 'An error occurred while checking verification status. Please try again.',
      });
    }
  };

  // Handler for "Resend verification email" button
  const handleResendEmail = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setStatusMessage(null);

    try {
      const res = await resendVerificationEmail();
      setIsResending(false);

      if (res.success) {
        setResendCooldown(60); // 60 seconds cooldown
        setStatusMessage({
          type: 'success',
          text: `Verification email resent to ${targetEmail}! Please check your inbox and spam folder.`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Failed to resend verification email. Please try again in a few moments.',
        });
      }
    } catch (err) {
      setIsResending(false);
      setStatusMessage({
        type: 'error',
        text: 'Unable to resend email right now. Please wait a minute and try again.',
      });
    }
  };

  return (
    <div
      id="email-verification-screen"
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? 'bg-[#060919] text-white' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top Header Bar */}
      <header
        className={`w-full px-6 py-4 flex items-center justify-between border-b ${
          isDarkMode ? 'border-white/10 bg-[#070B19]/80' : 'border-slate-200/90 bg-white/80'
        } backdrop-blur-md sticky top-0 z-30`}
      >
        <Logo isDark={isDarkMode} size="md" />

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            id="verification-theme-toggle"
            onClick={onToggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Logout button */}
          <button
            id="verification-header-logout-btn"
            onClick={logout}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isDarkMode
                ? 'text-slate-400 hover:text-white hover:bg-white/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div
          id="email-verification-card"
          className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all text-center animate-fade-in ${
            isDarkMode
              ? 'bg-[#090E26]/95 border-white/10 shadow-black/60'
              : 'bg-white border-slate-200 shadow-slate-200/80'
          }`}
        >
          {/* Animated Mail Shield Icon */}
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#00D2FF] to-[#7928CA] opacity-20 blur-lg animate-pulse" />
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-tr from-[#00D2FF] via-[#7928CA] to-[#FF2E93] p-0.5 shadow-xl flex items-center justify-center">
              <div
                className={`w-full h-full rounded-[22px] flex items-center justify-center ${
                  isDarkMode ? 'bg-[#090E26]' : 'bg-white'
                }`}
              >
                <div className="relative">
                  <Mail
                    size={36}
                    className="text-[#00D2FF]"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white">
                    <ShieldCheck size={12} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Title & Clear Message */}
          <h1
            id="verification-title"
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Verify Your Email Address
          </h1>
          <p
            id="verification-primary-message"
            className="mt-2 text-sm sm:text-base font-semibold text-[#00D2FF]"
          >
            Please check your email and verify your account.
          </p>

          <p
            className={`mt-2 text-xs sm:text-sm leading-relaxed max-w-md mx-auto ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            We have sent a verification link to{' '}
            <span className="font-bold underline decoration-[#00D2FF] decoration-2 underline-offset-2">
              {targetEmail}
            </span>
            . To protect the Creator Meet community, you must verify your email before entering.
          </p>

          {/* Status Message Banner */}
          {statusMessage && (
            <div
              id="verification-status-banner"
              className={`mt-5 p-3.5 rounded-2xl text-xs sm:text-sm font-medium flex items-start text-left gap-2.5 animate-fade-in ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{statusMessage.text}</span>
            </div>
          )}

          {/* Helpful Tips Card */}
          <div
            className={`mt-6 p-4 rounded-2xl border text-left text-xs ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1.5 text-slate-400 uppercase tracking-wider text-[10px]">
              <Sparkles size={12} className="text-[#FF2E93]" />
              <span>Next Steps</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>Open your email inbox and look for an email from Creator Meet.</li>
              <li>Click the verification link inside the email.</li>
              <li>
                Check your <span className="font-semibold">Spam</span> or{' '}
                <span className="font-semibold">Junk</span> folder if you don't see it within 1 minute.
              </li>
              <li>Return here and click <strong>"I've verified my email"</strong> below.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {/* Primary Button: "I've verified my email" */}
            <button
              id="check-verified-btn"
              type="button"
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="w-full py-3 px-5 rounded-full text-sm font-bold text-white gradient-btn-primary shadow-lg shadow-[#FF1E82]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isChecking ? (
                <>
                  <RotateCw size={16} className="animate-spin" />
                  <span>Checking verification status...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />
                  <span>I've verified my email</span>
                </>
              )}
            </button>

            {/* Secondary Button: "Resend verification email" */}
            <button
              id="resend-verification-btn"
              type="button"
              onClick={handleResendEmail}
              disabled={isResending || resendCooldown > 0}
              className={`w-full py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold border transition flex items-center justify-center gap-2 cursor-pointer ${
                resendCooldown > 0 || isResending
                  ? 'bg-slate-800/40 border-slate-700 text-slate-500 cursor-not-allowed'
                  : isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isResending ? (
                <>
                  <RotateCw size={14} className="animate-spin" />
                  <span>Sending email...</span>
                </>
              ) : resendCooldown > 0 ? (
                <>
                  <Clock size={14} />
                  <span>Resend available in {resendCooldown}s</span>
                </>
              ) : (
                <>
                  <Mail size={14} />
                  <span>Resend verification email</span>
                </>
              )}
            </button>
          </div>

          {/* Change Account or Log Out */}
          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Wrong email address?</span>
            <button
              id="verification-switch-account-btn"
              type="button"
              onClick={logout}
              className="font-bold text-[#00D2FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <LogOut size={13} />
              <span>Log out & sign in again</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`w-full py-4 text-center text-xs border-t ${
          isDarkMode ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-500'
        }`}
      >
        © {new Date().getFullYear()} Creator Meet. Verified Email Protection.
      </footer>
    </div>
  );
};
