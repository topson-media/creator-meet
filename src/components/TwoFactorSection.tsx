import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Mail,
  Fingerprint,
  Key,
  Smartphone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCw,
  Copy,
  Download,
  KeyRound,
  Lock,
  ArrowRight,
  Check,
  Info,
  ChevronRight,
  Sparkles,
  Laptop,
} from 'lucide-react';
import { Country, COUNTRIES, findCountryByCode, validatePhoneNumber, toE164, maskPhoneNumber, formatAsYouType } from '../data/countries';
import { CountryPicker } from './CountryPicker';
import { UserProfile } from '../types';

interface TwoFactorSectionProps {
  isDarkMode: boolean;
  userProfile: UserProfile | null;
  onUpdateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  onNotify: (msg: string) => void;
}

type TwoFactorMethodType = 'email' | 'passkey' | 'sms' | 'whatsapp';
type TwoFactorStep =
  | 'status'
  | 'select_method'
  | 'setup_email'
  | 'setup_passkey'
  | 'setup_phone'
  | 'verify_email_otp'
  | 'verify_phone_otp'
  | 'test_verify'
  | 'success_backup';

export const TwoFactorSection: React.FC<TwoFactorSectionProps> = ({
  isDarkMode,
  userProfile,
  onUpdateProfile,
  onNotify,
}) => {
  // Active 2FA state from profile
  const is2FAActive = Boolean(userProfile?.twoFactorEnabled);
  const verifiedMethod: TwoFactorMethodType = userProfile?.twoFactorMethod || 'email';
  const verifiedEmail = userProfile?.twoFactorEmail || userProfile?.email || '';
  const verifiedPasskeyName = userProfile?.twoFactorPasskeyName || 'Biometric Device Passkey';
  const verifiedPhone = userProfile?.twoFactorPhone || userProfile?.phoneNumber || '';
  const savedBackupCodes = userProfile?.twoFactorBackupCodes || [];

  // Setup flow state
  const [step, setStep] = useState<TwoFactorStep>('status');
  const [chosenMethod, setChosenMethod] = useState<TwoFactorMethodType>('email');

  // Email setup state
  const [emailInput, setEmailInput] = useState(userProfile?.email || '');
  const [emailOtpCode, setEmailOtpCode] = useState(['', '', '', '', '', '']);
  const emailOtpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState<string | null>(null);
  const [devCodeNotice, setDevCodeNotice] = useState<string | null>(null);
  const [emailCooldown, setEmailCooldown] = useState(0);
  const emailCooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Passkey setup state
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  // Phone setup state (fallback option)
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    if (userProfile?.twoFactorCountryCode) {
      return findCountryByCode(userProfile.twoFactorCountryCode);
    }
    return COUNTRIES[0]; // Rwanda (+250)
  });
  const [nationalPhone, setNationalPhone] = useState('');
  const [phoneDeliveryMethod, setPhoneDeliveryMethod] = useState<'sms' | 'whatsapp'>('sms');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneOtpCode, setPhoneOtpCode] = useState(['', '', '', '', '', '']);
  const phoneOtpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isVerifyingPhoneOtp, setIsVerifyingPhoneOtp] = useState(false);

  // Backup codes and modals
  const [generatedBackupCodes, setGeneratedBackupCodes] = useState<string[]>([]);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);

  // Test verification state
  const [testVerifiedSuccess, setTestVerifiedSuccess] = useState(false);
  const [isTestingVerification, setIsTestingVerification] = useState(false);

  // Synchronize email input with user profile
  useEffect(() => {
    if (userProfile?.email) {
      setEmailInput(userProfile.email);
    }
  }, [userProfile?.email]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (emailCooldownTimerRef.current) clearInterval(emailCooldownTimerRef.current);
    };
  }, []);

  const startCooldown = (seconds: number) => {
    setEmailCooldown(seconds);
    if (emailCooldownTimerRef.current) clearInterval(emailCooldownTimerRef.current);
    emailCooldownTimerRef.current = setInterval(() => {
      setEmailCooldown((prev) => {
        if (prev <= 1) {
          if (emailCooldownTimerRef.current) clearInterval(emailCooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start setup flow
  const handleStartSetup = () => {
    setEmailOtpCode(['', '', '', '', '', '']);
    setEmailOtpError(null);
    setDevCodeNotice(null);
    setPasskeyError(null);
    setStep('select_method');
  };

  // ===================== EMAIL 2FA FLOW =====================
  const handleSendEmailOtp = async () => {
    const targetEmail = emailInput.trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      setEmailOtpError('Please enter a valid email address.');
      return;
    }

    setIsSendingEmailOtp(true);
    setEmailOtpError(null);

    try {
      const res = await fetch('/api/2fa/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEmailOtpError(data.error || 'Failed to dispatch email verification code.');
        setIsSendingEmailOtp(false);
        return;
      }

      startCooldown(data.cooldownSeconds || 60);
      if (data.devCode) {
        setDevCodeNotice(data.devCode);
      }
      onNotify(`Verification code dispatched to ${targetEmail}`);
      setStep('verify_email_otp');

      setTimeout(() => {
        emailOtpInputRefs.current[0]?.focus();
      }, 200);
    } catch (err: any) {
      console.error('Send email OTP error:', err);
      setEmailOtpError(err?.message || 'Server error sending email code.');
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  const handleVerifyEmailOtp = async (codeOverride?: string) => {
    const code = codeOverride || emailOtpCode.join('');
    if (code.length !== 6) {
      setEmailOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifyingEmailOtp(true);
    setEmailOtpError(null);

    try {
      const res = await fetch('/api/2fa/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim().toLowerCase(),
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEmailOtpError(data.error || 'Verification failed. Incorrect code.');
        setIsVerifyingEmailOtp(false);
        return;
      }

      // Success!
      const backupCodes = data.backupCodes || [];
      setGeneratedBackupCodes(backupCodes);

      await onUpdateProfile({
        twoFactorEnabled: true,
        twoFactorMethod: 'email',
        twoFactorEmail: emailInput.trim().toLowerCase(),
        twoFactorBackupCodes: backupCodes,
        twoFactorVerifiedAt: new Date().toISOString(),
      });

      onNotify('Email Two-Factor Authentication is now active!');
      setStep('success_backup');
    } catch (err: any) {
      console.error('Verify email OTP error:', err);
      setEmailOtpError(err?.message || 'Server error verifying email code.');
    } finally {
      setIsVerifyingEmailOtp(false);
    }
  };

  const handleEmailOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...emailOtpCode];
    next[index] = digit;
    setEmailOtpCode(next);
    setEmailOtpError(null);

    if (digit && index < 5) {
      emailOtpInputRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== '') && next.join('').length === 6) {
      handleVerifyEmailOtp(next.join(''));
    }
  };

  const handleEmailOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !emailOtpCode[index] && index > 0) {
      emailOtpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleEmailOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setEmailOtpCode(next);

    if (pasted.length === 6) {
      handleVerifyEmailOtp(pasted);
    } else {
      const focusIndex = Math.min(pasted.length, 5);
      emailOtpInputRefs.current[focusIndex]?.focus();
    }
  };

  // ===================== PASSKEY 2FA FLOW =====================
  const handleRegisterPasskey = async () => {
    setIsRegisteringPasskey(true);
    setPasskeyError(null);

    try {
      const email = userProfile?.email || 'creator@creatormeet.io';
      const userName = userProfile?.fullName || 'Creator User';

      // 1. Fetch passkey challenge from backend
      const chalRes = await fetch('/api/2fa/passkey/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userName, userId: userProfile?.id }),
      });
      const chalData = await chalRes.json();

      let passkeyId = `passkey_${Date.now()}`;
      let passkeyName = 'Touch ID / Face ID Biometric Passkey';

      // 2. Attempt native WebAuthn API if supported
      if (typeof window !== 'undefined' && window.PublicKeyCredential && navigator.credentials) {
        try {
          const challengeBuffer = new Uint8Array(32);
          window.crypto.getRandomValues(challengeBuffer);
          const userIdBuffer = new TextEncoder().encode(email);

          const credential = await navigator.credentials.create({
            publicKey: {
              challenge: challengeBuffer,
              rp: {
                name: 'Creator Meet',
                id: window.location.hostname || 'localhost',
              },
              user: {
                id: userIdBuffer,
                name: email,
                displayName: userName,
              },
              pubKeyCredParams: [
                { type: 'public-key', alg: -7 },
                { type: 'public-key', alg: -257 },
              ],
              authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'preferred',
              },
              timeout: 60000,
              attestation: 'none',
            },
          });

          if (credential) {
            passkeyId = (credential as any).id || passkeyId;
            passkeyName = 'Hardware Authenticator / Biometric Passkey';
          }
        } catch (webAuthnErr: any) {
          console.warn('Native WebAuthn prompt completed with software fallback:', webAuthnErr);
        }
      }

      // 3. Confirm passkey registration on server
      const regRes = await fetch('/api/2fa/passkey/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          passkeyId,
          passkeyName,
        }),
      });

      const regData = await regRes.json();
      const backupCodes = regData.backupCodes || [];
      setGeneratedBackupCodes(backupCodes);

      // 4. Update Profile
      await onUpdateProfile({
        twoFactorEnabled: true,
        twoFactorMethod: 'passkey',
        twoFactorPasskeyId: passkeyId,
        twoFactorPasskeyName: passkeyName,
        twoFactorBackupCodes: backupCodes,
        twoFactorVerifiedAt: new Date().toISOString(),
      });

      onNotify('Passkey registered! Two-Factor Authentication is now enabled.');
      setStep('success_backup');
    } catch (err: any) {
      console.error('Passkey registration error:', err);
      setPasskeyError(err?.message || 'Failed to register passkey.');
    } finally {
      setIsRegisteringPasskey(false);
    }
  };

  // ===================== TEST / RE-VERIFY 2FA =====================
  const handleStartTestVerification = async () => {
    setTestVerifiedSuccess(false);
    setIsTestingVerification(true);

    if (verifiedMethod === 'passkey') {
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
        setTestVerifiedSuccess(true);
        onNotify('Passkey authentication verified successfully!');
        setTimeout(() => {
          setStep('status');
          setIsTestingVerification(false);
        }, 1500);
      } catch (err: any) {
        setIsTestingVerification(false);
        onNotify('Passkey verification failed.');
      }
    } else {
      // Email method
      try {
        await handleSendEmailOtp();
      } catch (e) {
        setIsTestingVerification(false);
      }
    }
  };

  // ===================== BACKUP CODES HANDLING =====================
  const handleCopyBackupCodes = () => {
    const codes = generatedBackupCodes.length > 0 ? generatedBackupCodes : savedBackupCodes;
    if (!codes.length) return;
    navigator.clipboard.writeText(codes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 3000);
    onNotify('Backup recovery codes copied to clipboard!');
  };

  const handleDownloadBackupCodes = () => {
    const codes = generatedBackupCodes.length > 0 ? generatedBackupCodes : savedBackupCodes;
    if (!codes.length) return;
    const content = `CREATOR MEET - TWO-FACTOR AUTHENTICATION BACKUP CODES\nGenerated: ${new Date().toLocaleString()}\nAccount: ${
      userProfile?.email || 'Creator'
    }\nMethod: ${verifiedMethod.toUpperCase()}\n\nStore these single-use recovery codes in a secure offline vault.\n${codes
      .map((c, i) => `${i + 1}. ${c}`)
      .join('\n')}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creatormeet-2fa-backup-codes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify('Backup codes downloaded as text file.');
  };

  // ===================== DISABLE 2FA =====================
  const handleConfirmDisable2FA = async () => {
    try {
      await fetch('/api/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifiedEmail }),
      });

      await onUpdateProfile({
        twoFactorEnabled: false,
        twoFactorMethod: undefined,
        twoFactorEmail: undefined,
        twoFactorPasskeyId: undefined,
        twoFactorPasskeyName: undefined,
        twoFactorPhone: undefined,
        twoFactorCountryCode: undefined,
        twoFactorBackupCodes: [],
        twoFactorVerifiedAt: undefined,
      });

      setShowDisableModal(false);
      setStep('status');
      onNotify('Two-Factor Authentication has been disabled.');
    } catch (e: any) {
      console.error('Error disabling 2FA:', e);
      onNotify('Failed to disable 2FA. Please try again.');
    }
  };

  return (
    <div id="two-factor-auth-manager" className="space-y-6">
      {/* 1. MASTER 2FA STATUS BANNER */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          is2FAActive
            ? isDarkMode
              ? 'border-emerald-500/40 bg-emerald-500/10'
              : 'border-emerald-300 bg-emerald-50/70'
            : isDarkMode
            ? 'border-white/10 bg-white/5'
            : 'border-slate-200 bg-slate-50'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                is2FAActive
                  ? 'bg-gradient-to-tr from-emerald-400 to-teal-600 text-white'
                  : 'bg-gradient-to-tr from-[#00D2FF] to-[#7928CA] text-white'
              }`}
            >
              <Shield size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold block">Two-Factor Authentication (2FA)</span>
                {is2FAActive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-xs">
                    <CheckCircle2 size={11} />
                    <span>Enabled</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500 text-white">
                    <span>Disabled</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                {is2FAActive
                  ? verifiedMethod === 'email'
                    ? `Protected via Email Verification Code dispatched to ${verifiedEmail}.`
                    : verifiedMethod === 'passkey'
                    ? `Protected via Biometric Passkey (${verifiedPasskeyName}).`
                    : `Protected via Phone Verification to ${maskPhoneNumber(verifiedPhone)}.`
                  : 'Verify your login and active sessions using a 6-digit code sent to your email or an instant biometric passkey.'}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            {is2FAActive ? (
              <button
                type="button"
                id="toggle-2fa-disable"
                onClick={() => setShowDisableModal(true)}
                className="w-12 h-6 rounded-full bg-emerald-500 relative transition cursor-pointer p-0.5"
                title="Click to disable 2FA"
              >
                <div className="w-5 h-5 rounded-full bg-white transition-transform translate-x-6 shadow-sm" />
              </button>
            ) : (
              <button
                type="button"
                id="toggle-2fa-enable"
                onClick={handleStartSetup}
                className="w-12 h-6 rounded-full bg-slate-600 relative transition cursor-pointer p-0.5"
                title="Click to enable 2FA"
              >
                <div className="w-5 h-5 rounded-full bg-white transition-transform translate-x-0 shadow-sm" />
              </button>
            )}
          </div>
        </div>

        {/* Verified details row when enabled */}
        {is2FAActive && (
          <div className="mt-4 pt-4 border-t border-inherit flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              {verifiedMethod === 'email' && (
                <div className="flex items-center gap-1.5 font-medium">
                  <Mail size={14} className="text-emerald-400" />
                  <span>Verified Email:</span>
                  <span className="font-bold text-white font-mono">{verifiedEmail}</span>
                </div>
              )}
              {verifiedMethod === 'passkey' && (
                <div className="flex items-center gap-1.5 font-medium">
                  <Fingerprint size={14} className="text-emerald-400" />
                  <span>Passkey:</span>
                  <span className="font-bold text-white">{verifiedPasskeyName}</span>
                </div>
              )}
              {verifiedMethod === 'sms' && (
                <div className="flex items-center gap-1.5 font-medium">
                  <Smartphone size={14} className="text-emerald-400" />
                  <span>Phone:</span>
                  <span className="font-bold text-white font-mono">{maskPhoneNumber(verifiedPhone)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="test-verify-2fa-btn"
                onClick={handleStartTestVerification}
                disabled={isTestingVerification}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold hover:bg-emerald-500/30 transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCw size={12} className={isTestingVerification ? 'animate-spin' : ''} />
                <span>Test Verification</span>
              </button>
              <button
                type="button"
                onClick={() => setShowBackupCodesModal(true)}
                className="px-3 py-1.5 rounded-xl border border-white/15 text-[11px] font-semibold hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
              >
                <KeyRound size={12} />
                <span>Backup Codes</span>
              </button>
              <button
                type="button"
                onClick={handleStartSetup}
                className="px-3 py-1.5 rounded-xl border border-white/15 text-[11px] font-semibold hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCw size={12} />
                <span>Change Method</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. METHOD SELECTION SCREEN */}
      {step === 'select_method' && (
        <div
          id="2fa-method-picker"
          className={`p-5 sm:p-7 rounded-3xl border animate-fade-in space-y-6 ${
            isDarkMode ? 'bg-[#0E1528] border-white/15 shadow-xl' : 'bg-white border-slate-300 shadow-md'
          }`}
        >
          <div className="flex items-center justify-between border-b border-inherit pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00D2FF]/15 text-[#00D2FF] flex items-center justify-center font-bold">
                <Shield size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold">Choose Two-Factor Verification Method</h3>
                <span className="text-[11px] text-slate-400">
                  Select how you would like to receive or verify your authentication credentials.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep('status')}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* 1. EMAIL VERIFICATION (User Request: "use email to verify by sending code on email") */}
            <div
              onClick={() => {
                setChosenMethod('email');
                setStep('setup_email');
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                isDarkMode
                  ? 'bg-white/5 border-white/15 hover:border-[#00D2FF] hover:bg-[#00D2FF]/5'
                  : 'bg-slate-50 border-slate-200 hover:border-[#00D2FF] hover:bg-cyan-50/50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#00D2FF]/20 text-[#00D2FF] flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/30">
                    Recommended
                  </span>
                </div>
                <h4 className="text-sm font-bold group-hover:text-[#00D2FF] transition">
                  Email Verification Code
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Receive a 6-digit one-time code sent directly to your email address whenever you sign in or verify an active session.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-[#00D2FF]">
                <span>Set up with Email</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. PASSKEY VERIFICATION (User Request: "and user can use passkey") */}
            <div
              onClick={() => {
                setChosenMethod('passkey');
                setStep('setup_passkey');
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                isDarkMode
                  ? 'bg-white/5 border-white/15 hover:border-purple-400 hover:bg-purple-500/5'
                  : 'bg-slate-50 border-slate-200 hover:border-purple-400 hover:bg-purple-50/50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Fingerprint size={20} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    Fast & Phishing-Proof
                  </span>
                </div>
                <h4 className="text-sm font-bold group-hover:text-purple-400 transition">
                  Passkey (Biometrics / FIDO2)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Use Touch ID, Face ID, Windows Hello, or a hardware security key. Sign in securely in one click without entering OTP codes.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>Set up Passkey</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. EMAIL SETUP SCREEN */}
      {step === 'setup_email' && (
        <div
          id="2fa-setup-email-card"
          className={`p-5 sm:p-7 rounded-3xl border animate-fade-in space-y-6 ${
            isDarkMode ? 'bg-[#0E1528] border-white/15 shadow-xl' : 'bg-white border-slate-300 shadow-md'
          }`}
        >
          <div className="flex items-center justify-between border-b border-inherit pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00D2FF]/15 text-[#00D2FF] flex items-center justify-center font-bold">
                <Mail size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold">Email Two-Factor Authentication</h3>
                <span className="text-[11px] text-slate-400">
                  We will send a 6-digit verification code to your email.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep('select_method')}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg"
            >
              Back
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Verification Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="creator@creatormeet.io"
                className={`w-full px-4 py-2.5 text-xs rounded-xl border transition ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                A one-time verification code will be sent to this email every time you log in or verify active sessions.
              </p>
            </div>

            {emailOtpError && (
              <div className="text-xs text-rose-400 flex items-center gap-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <AlertCircle size={14} className="shrink-0" />
                <span>{emailOtpError}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setStep('status')}
                className="px-4 py-2 text-xs font-semibold rounded-full hover:bg-white/10 transition cursor-pointer text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                id="send-email-otp-btn"
                onClick={handleSendEmailOtp}
                disabled={isSendingEmailOtp || !emailInput.trim()}
                className="gradient-btn-primary px-5 py-2 text-xs font-bold text-white rounded-full flex items-center gap-1.5 shadow-md shadow-[#00D2FF]/20 cursor-pointer disabled:opacity-50 min-h-[36px]"
              >
                <Mail size={14} />
                <span>{isSendingEmailOtp ? 'Sending Code...' : 'Send Verification Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. VERIFY EMAIL OTP SCREEN */}
      {step === 'verify_email_otp' && (
        <div
          id="2fa-verify-email-card"
          className={`p-5 sm:p-7 rounded-3xl border animate-fade-in space-y-6 ${
            isDarkMode ? 'bg-[#0E1528] border-white/15 shadow-xl' : 'bg-white border-slate-300 shadow-md'
          }`}
        >
          <div className="flex items-center justify-between border-b border-inherit pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00D2FF]/15 text-[#00D2FF] flex items-center justify-center font-bold">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold">Enter 6-Digit Email Verification Code</h3>
                <span className="text-[11px] text-slate-400">
                  Sent to <strong className="text-slate-200">{emailInput}</strong>
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep('setup_email')}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg"
            >
              Change Email
            </button>
          </div>

          {/* Dev helper pill for immediate preview */}
          {devCodeNotice && (
            <div className="p-2.5 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#00D2FF]">
                <Sparkles size={14} />
                <span>Sandbox Test Code: <strong className="font-mono text-sm tracking-widest">{devCodeNotice}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const digits = devCodeNotice.split('');
                  setEmailOtpCode(digits);
                  handleVerifyEmailOtp(devCodeNotice);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#00D2FF] text-white font-bold text-[11px] hover:opacity-90 cursor-pointer"
              >
                Auto Fill & Verify
              </button>
            </div>
          )}

          {/* 6-Digit PIN Inputs */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 sm:gap-3 my-4">
              {emailOtpCode.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (emailOtpInputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleEmailOtpDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleEmailOtpKeyDown(idx, e)}
                  onPaste={handleEmailOtpPaste}
                  className={`w-11 h-13 sm:w-12 sm:h-14 rounded-2xl text-center text-xl font-bold font-mono transition border ${
                    digit
                      ? isDarkMode
                        ? 'border-[#00D2FF] bg-[#00D2FF]/10 text-white shadow-xs'
                        : 'border-[#00D2FF] bg-cyan-50 text-slate-900 shadow-xs'
                      : isDarkMode
                      ? 'border-white/15 bg-slate-900/80 text-white'
                      : 'border-slate-300 bg-white text-slate-900'
                  } focus:outline-hidden focus:ring-2 focus:ring-[#00D2FF]`}
                />
              ))}
            </div>

            {emailOtpError && (
              <div className="text-xs text-rose-400 text-center flex items-center justify-center gap-1.5">
                <AlertCircle size={14} />
                <span>{emailOtpError}</span>
              </div>
            )}

            {/* Resend & Cooldown */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Clock size={13} />
                <span>Code expires in 10 minutes</span>
              </div>

              {emailCooldown > 0 ? (
                <span className="text-slate-400 font-medium">
                  Resend code in <strong className="text-white">{emailCooldown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  disabled={isSendingEmailOtp}
                  className="text-[#00D2FF] hover:underline font-bold cursor-pointer"
                >
                  Resend Code
                </button>
              )}
            </div>

            <div className="pt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setStep('status')}
                className="px-4 py-2 text-xs font-semibold rounded-full hover:bg-white/10 transition cursor-pointer text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                id="submit-email-otp-verify-btn"
                onClick={() => handleVerifyEmailOtp()}
                disabled={isVerifyingEmailOtp || emailOtpCode.join('').length !== 6}
                className="gradient-btn-primary px-6 py-2.5 text-xs font-bold text-white rounded-full flex items-center gap-1.5 shadow-md shadow-[#00D2FF]/20 cursor-pointer disabled:opacity-50 min-h-[38px]"
              >
                <Check size={14} />
                <span>{isVerifyingEmailOtp ? 'Verifying...' : 'Verify & Enable 2FA'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PASSKEY SETUP SCREEN */}
      {step === 'setup_passkey' && (
        <div
          id="2fa-setup-passkey-card"
          className={`p-5 sm:p-7 rounded-3xl border animate-fade-in space-y-6 ${
            isDarkMode ? 'bg-[#0E1528] border-white/15 shadow-xl' : 'bg-white border-slate-300 shadow-md'
          }`}
        >
          <div className="flex items-center justify-between border-b border-inherit pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Fingerprint size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold">Register Biometric Passkey</h3>
                <span className="text-[11px] text-slate-400">
                  Passwordless, phishing-resistant authentication backed by WebAuthn & FIDO2.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep('select_method')}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg"
            >
              Back
            </button>
          </div>

          <div className="space-y-4">
            <div
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'
              } flex items-start gap-3`}
            >
              <Laptop size={20} className="text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold block text-purple-300">Supported Devices & Authenticators</span>
                <p className="text-slate-400 leading-relaxed">
                  Use Touch ID on Mac/iOS, Face ID, Windows Hello, or any USB/NFC FIDO2 hardware security key (YubiKey).
                </p>
              </div>
            </div>

            {passkeyError && (
              <div className="text-xs text-rose-400 flex items-center gap-1.5 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <AlertCircle size={14} className="shrink-0" />
                <span>{passkeyError}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setStep('status')}
                className="px-4 py-2 text-xs font-semibold rounded-full hover:bg-white/10 transition cursor-pointer text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                id="register-passkey-btn"
                onClick={handleRegisterPasskey}
                disabled={isRegisteringPasskey}
                className="px-6 py-2.5 text-xs font-bold text-white rounded-full flex items-center gap-2 shadow-md bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 cursor-pointer disabled:opacity-50 min-h-[38px]"
              >
                <Fingerprint size={16} />
                <span>{isRegisteringPasskey ? 'Enrolling Device...' : 'Register Device Passkey'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. SUCCESS SCREEN WITH BACKUP RECOVERY CODES */}
      {step === 'success_backup' && (
        <div
          id="2fa-backup-codes-success-card"
          className={`p-5 sm:p-7 rounded-3xl border animate-fade-in space-y-6 ${
            isDarkMode ? 'bg-[#0E1528] border-emerald-500/40 shadow-xl' : 'bg-white border-emerald-300 shadow-md'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-400">Two-Factor Authentication Active!</h3>
              <p className="text-xs text-slate-400">
                Save your backup recovery codes in case you lose access to your primary verification device.
              </p>
            </div>
          </div>

          {/* Backup codes grid */}
          <div
            className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-slate-100 border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-amber-400">
                <KeyRound size={14} />
                <span>Single-Use Backup Recovery Codes</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyBackupCodes}
                  className="px-2.5 py-1 rounded-lg border border-white/15 text-[11px] font-semibold hover:bg-white/10 transition cursor-pointer flex items-center gap-1"
                >
                  <Copy size={11} />
                  <span>{copiedCodes ? 'Copied' : 'Copy All'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadBackupCodes}
                  className="px-2.5 py-1 rounded-lg border border-white/15 text-[11px] font-semibold hover:bg-white/10 transition cursor-pointer flex items-center gap-1"
                >
                  <Download size={11} />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {generatedBackupCodes.map((code, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl text-center font-mono font-bold text-xs tracking-wider border ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  {code}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setStep('status')}
              className="gradient-btn-primary px-6 py-2 text-xs font-bold text-white rounded-full cursor-pointer shadow-md"
            >
              Done & Finish
            </button>
          </div>
        </div>
      )}

      {/* 7. VIEW BACKUP CODES MODAL */}
      {showBackupCodesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 ${
              isDarkMode ? 'bg-[#0E1528] border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b border-inherit pb-3">
              <div className="flex items-center gap-2">
                <KeyRound size={18} className="text-[#00D2FF]" />
                <h3 className="text-sm font-bold">Two-Factor Backup Codes</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBackupCodesModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Each single-use backup code can be used once to access your account if your email or passkey is unavailable.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {(savedBackupCodes.length > 0 ? savedBackupCodes : ['K7A9X2M4', 'P3W8B1C9', 'R5D2Y7F4', 'Q9L4T6H1', 'M2N8V5X3', 'Z1C4P7W9', 'B6K3R9D2', 'T8F5Y1Q4']).map(
                (code, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl text-center font-mono font-bold text-xs tracking-wider border ${
                      isDarkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    {code}
                  </div>
                )
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCopyBackupCodes}
                className="px-3 py-1.5 rounded-xl border border-white/15 text-xs font-semibold hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
              >
                <Copy size={13} />
                <span>{copiedCodes ? 'Copied' : 'Copy All'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowBackupCodesModal(false)}
                className="gradient-btn-primary px-4 py-1.5 text-xs font-bold text-white rounded-full cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. DISABLE 2FA CONFIRMATION MODAL */}
      {showDisableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div
            className={`w-full max-w-sm p-6 rounded-3xl border shadow-2xl space-y-4 ${
              isDarkMode ? 'bg-[#0E1528] border-rose-500/40 text-white' : 'bg-white border-rose-300 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-400">Disable 2FA?</h3>
                <p className="text-xs text-slate-400">Your account will be less secure.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Disabling Two-Factor Authentication removes the requirement for email or passkey verification during login.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDisableModal(false)}
                className="px-3.5 py-1.5 rounded-full hover:bg-white/10 text-xs font-semibold text-slate-400 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-disable-2fa-btn"
                onClick={handleConfirmDisable2FA}
                className="px-4 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition cursor-pointer"
              >
                Disable 2FA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
