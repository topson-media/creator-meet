import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Logo } from './Logo';
import { AVATAR_PRESETS, COVER_PRESETS } from '../data/assets';
import {
  Sparkles,
  Heart,
  Mail,
  Lock,
  User,
  AtSign,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Check,
  Loader2,
  Image as ImageIcon,
  Camera,
  Upload,
} from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSwitchMode: (mode: 'login' | 'signup') => void;
  onSuccess: () => void;
  isDarkMode: boolean;
  isModal?: boolean;
}

interface FieldErrors {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSwitchMode,
  onSuccess,
  isDarkMode,
  isModal = false,
}) => {
  const { register, login, loginWithGoogle, loginWithDemoGoogleUser, resetPassword } = useAuth();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<UserRole>('creator');
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0].url);
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);

  // Field-level error messages displayed directly below the corresponding input
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Google submission state
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [unauthorizedDomainInfo, setUnauthorizedDomainInfo] = useState<{
    domain: string;
    copied: boolean;
  } | null>(null);

  // Hidden File Input Refs for Device Upload Only
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState<string | null>(null);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotGeneralError, setForgotGeneralError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Helper to clear error when user modifies an input
  const handleInputChange = (field: keyof FieldErrors, setter: (val: string) => void, val: string) => {
    setter(val);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (errorMessage) setErrorMessage(null);
  };

  // Clear messages when mode changes
  const handleSwitch = (newMode: 'login' | 'signup') => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});
    setUnauthorizedDomainInfo(null);
    onSwitchMode(newMode);
  };

  // Google Sign-In & Sign-Up Handler
  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});
    setUnauthorizedDomainInfo(null);

    // If creating account (signup mode), user must accept rules
    if (mode === 'signup' && !acceptedTerms) {
      const termsMsg = 'Please accept the Rules and Regulations to continue.';
      setFieldErrors((prev) => ({ ...prev, terms: termsMsg }));
      return;
    }

    try {
      setIsGoogleSubmitting(true);
      const res = await loginWithGoogle();
      setIsGoogleSubmitting(false);

      if (res.success) {
        onSuccess();
      } else {
        if (res.isUnauthorizedDomain) {
          setUnauthorizedDomainInfo({
            domain: res.unauthorizedDomain || (typeof window !== 'undefined' ? window.location.hostname : ''),
            copied: false,
          });
        }
        setErrorMessage(res.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setIsGoogleSubmitting(false);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  // Submit Handler with inline validation and no browser 'required' popups
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const errors: FieldErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode === 'signup') {
      if (!fullName.trim()) {
        errors.fullName = 'Please enter your full name.';
      }

      if (!username.trim()) {
        errors.username = 'Please enter a username.';
      } else if (username.trim().length < 3) {
        errors.username = 'Username must be at least 3 characters.';
      }

      if (!email.trim()) {
        errors.email = 'Please enter your email.';
      } else if (!emailRegex.test(email.trim())) {
        errors.email = 'Please enter a valid email address.';
      }

      if (!password) {
        errors.password = 'Please enter your password.';
      } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters.';
      }

      if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
      }

      if (!acceptedTerms) {
        errors.terms = 'Please accept the Rules and Regulations to continue.';
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      setFieldErrors({});
      setIsSubmitting(true);
      const res = await register({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim(),
        password,
        confirmPassword,
        role: accountType,
        avatar,
        coverImage,
      });
      setIsSubmitting(false);

      if (res.success) {
        onSuccess();
      } else {
        if (res.error?.includes('already exists')) {
          setFieldErrors({ email: 'An account with this email already exists.' });
        } else if (res.error?.includes('Password')) {
          setFieldErrors({ password: res.error });
        } else if (res.error?.includes('email address') || res.error?.includes('valid email')) {
          setFieldErrors({ email: 'Please enter a valid email address.' });
        } else {
          setErrorMessage(res.error || 'Something went wrong. Please try again.');
        }
      }
    } else {
      // Login mode
      if (!email.trim()) {
        errors.email = 'Please enter your email.';
      } else if (!emailRegex.test(email.trim())) {
        errors.email = 'Please enter a valid email address.';
      }

      if (!password) {
        errors.password = 'Please enter your password.';
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      setFieldErrors({});
      setIsSubmitting(true);
      const res = await login(email.trim(), password);
      setIsSubmitting(false);

      if (res.success) {
        onSuccess();
      } else {
        if (res.error?.includes('Incorrect email or password')) {
          setFieldErrors({
            password: 'Incorrect email or password.',
          });
        } else {
          setErrorMessage(res.error || 'Something went wrong. Please try again.');
        }
      }
    }
  };

  // Forgot password form handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotEmailError(null);
    setForgotGeneralError(null);
    setForgotMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!forgotEmail.trim()) {
      setForgotEmailError('Please enter your email.');
      return;
    }
    if (!emailRegex.test(forgotEmail.trim())) {
      setForgotEmailError('Please enter a valid email address.');
      return;
    }

    setIsResetting(true);
    const res = await resetPassword(forgotEmail.trim());
    setIsResetting(false);

    if (res.success) {
      setForgotMessage(res.message || 'Password reset link sent! Check your inbox.');
    } else {
      if (res.error?.includes('No account found')) {
        setForgotEmailError('No account found with this email address.');
      } else {
        setForgotGeneralError(res.error || 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="w-full">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <Logo isDark={isDarkMode} size="md" />
        </div>
        <h2
          id="auth-form-title"
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <p
          className={`text-xs sm:text-sm mt-1.5 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {mode === 'signup'
            ? 'Join Creator Meet to collaborate, build connections, and grow.'
            : 'Enter your email and password to log in.'}
        </p>
      </div>

      {/* General Alert Banners (Only for server-wide state, field errors render inline on bottom of inputs) */}
      {errorMessage && (
        <div
          id="auth-error-message"
          className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs sm:text-sm font-medium flex items-center gap-2 animate-fade-in"
        >
          <AlertCircle size={16} className="shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          id="auth-success-message"
          className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs sm:text-sm font-medium flex items-center gap-2 animate-fade-in"
        >
          <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Registration / Login Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {mode === 'signup' ? (
          <>
            {/* Full Name */}
            <div>
              <label
                htmlFor="register-fullname"
                className={`block text-xs font-semibold mb-1.5 ${
                  fieldErrors.fullName
                    ? 'text-rose-500'
                    : isDarkMode
                    ? 'text-slate-300'
                    : 'text-slate-700'
                }`}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={17}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition ${
                    fieldErrors.fullName ? 'text-rose-400' : 'text-slate-400'
                  }`}
                />
                <input
                  id="register-fullname"
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={fullName}
                  onChange={(e) => handleInputChange('fullName', setFullName, e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-all focus:outline-hidden min-h-[46px] ${
                    fieldErrors.fullName
                      ? 'border-rose-500 bg-rose-500/5 text-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : isDarkMode
                      ? 'bg-slate-900/90 border-slate-700 text-white focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                  }`}
                />
              </div>
              {fieldErrors.fullName && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1.5 animate-fade-in">
                  <AlertCircle size={14} className="shrink-0 text-rose-500" />
                  <span>{fieldErrors.fullName}</span>
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="register-username"
                className={`block text-xs font-semibold mb-1.5 ${
                  fieldErrors.username
                    ? 'text-rose-500'
                    : isDarkMode
                    ? 'text-slate-300'
                    : 'text-slate-700'
                }`}
              >
                Username
              </label>
              <div className="relative">
                <AtSign
                  size={17}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition ${
                    fieldErrors.username ? 'text-rose-400' : 'text-slate-400'
                  }`}
                />
                <input
                  id="register-username"
                  type="text"
                  placeholder="username (letters, numbers, _)"
                  value={username}
                  onChange={(e) =>
                    handleInputChange(
                      'username',
                      setUsername,
                      e.target.value.toLowerCase().replace(/\s+/g, '')
                    )
                  }
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-all focus:outline-hidden min-h-[46px] ${
                    fieldErrors.username
                      ? 'border-rose-500 bg-rose-500/5 text-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : isDarkMode
                      ? 'bg-slate-900/90 border-slate-700 text-white focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                  }`}
                />
              </div>
              {fieldErrors.username && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1.5 animate-fade-in">
                  <AlertCircle size={14} className="shrink-0 text-rose-500" />
                  <span>{fieldErrors.username}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="register-email"
                className={`block text-xs font-semibold mb-1.5 ${
                  fieldErrors.email
                    ? 'text-rose-500'
                    : isDarkMode
                    ? 'text-slate-300'
                    : 'text-slate-700'
                }`}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition ${
                    fieldErrors.email ? 'text-rose-400' : 'text-slate-400'
                  }`}
                />
                <input
                  id="register-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => handleInputChange('email', setEmail, e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-all focus:outline-hidden min-h-[46px] ${
                    fieldErrors.email
                      ? 'border-rose-500 bg-rose-500/5 text-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : isDarkMode
                      ? 'bg-slate-900/90 border-slate-700 text-white focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1.5 animate-fade-in">
                  <AlertCircle size={14} className="shrink-0 text-rose-500" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="register-password"
                className={`block text-xs font-semibold mb-1.5 ${
                  fieldErrors.password
                    ? 'text-rose-500'
                    : isDarkMode
                    ? 'text-slate-300'
                    : 'text-slate-700'
                }`}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition ${
                    fieldErrors.password ? 'text-rose-400' : 'text-slate-400'
                  }`}
                />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => handleInputChange('password', setPassword, e.target.value)}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm border transition-all focus:outline-hidden min-h-[46px] ${
                    fieldErrors.password
                      ? 'border-rose-500 bg-rose-500/5 text-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : isDarkMode
                      ? 'bg-slate-900/90 border-slate-700 text-white focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 cursor-pointer transition ${
                    isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                  }`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1.5 animate-fade-in">
                  <AlertCircle size={14} className="shrink-0 text-rose-500" />
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="register-confirm-password"
                className={`block text-xs font-semibold mb-1.5 ${
                  fieldErrors.confirmPassword
                    ? 'text-rose-500'
                    : isDarkMode
                    ? 'text-slate-300'
                    : 'text-slate-700'
                }`}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition ${
                    fieldErrors.confirmPassword ? 'text-rose-400' : 'text-slate-400'
                  }`}
                />
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    handleInputChange('confirmPassword', setConfirmPassword, e.target.value)
                  }
                  className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm border transition-all focus:outline-hidden min-h-[46px] ${
                    fieldErrors.confirmPassword
                      ? 'border-rose-500 bg-rose-500/5 text-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : isDarkMode
                      ? 'bg-slate-900/90 border-slate-700 text-white focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 cursor-pointer transition ${
                    isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1.5 animate-fade-in">
                  <AlertCircle size={14} className="shrink-0 text-rose-500" />
                  <span>{fieldErrors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* Account Type Section */}
            <div className="pt-1">
              <label
                className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* Content Creator Card */}
                <div
                  id="account-type-creator"
                  onClick={() => setAccountType('creator')}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between gap-1.5 ${
                    accountType === 'creator'
                      ? 'border-[#FF2E93] bg-[#FF2E93]/10 ring-1 ring-[#FF2E93]'
                      : isDarkMode
                      ? 'border-white/10 bg-slate-900/40 hover:border-slate-600'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-pink-500/20 text-[#FF2E93] flex items-center justify-center font-bold shrink-0">
                      <Sparkles size={13} />
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`text-xs font-bold block truncate ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        Creator
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        Collab and Grow
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      accountType === 'creator'
                        ? 'border-[#FF2E93] bg-[#FF2E93]'
                        : 'border-slate-500'
                    }`}
                  >
                    {accountType === 'creator' && (
                      <div className="w-1 h-1 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                {/* Fan Card */}
                <div
                  id="account-type-fan"
                  onClick={() => setAccountType('fan')}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between gap-1.5 ${
                    accountType === 'fan'
                      ? 'border-[#00D2FF] bg-[#00D2FF]/10 ring-1 ring-[#00D2FF]'
                      : isDarkMode
                      ? 'border-white/10 bg-slate-900/40 hover:border-slate-600'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-[#00D2FF] flex items-center justify-center font-bold shrink-0">
                      <Heart size={13} fill="currentColor" />
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`text-xs font-bold block truncate ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        Fan
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        Follow and Join
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      accountType === 'fan'
                        ? 'border-[#00D2FF] bg-[#00D2FF]'
                        : 'border-slate-500'
                    }`}
                  >
                    {accountType === 'fan' && (
                      <div className="w-1 h-1 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Avatar & Cover Image Customization */}
            <div className={`pt-2.5 border-t space-y-3 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
              <input
                ref={avatarFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
              <input
                ref={coverFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverFileChange}
              />

              {/* Profile Picture */}
              <div>
                <label
                  className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Profile Picture
                </label>
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="relative cursor-pointer group shrink-0"
                    title="Upload profile picture from device"
                  >
                    <img
                      src={avatar}
                      alt="Avatar preview"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#FF2E93] group-hover:opacity-85 transition shadow-sm"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white">
                      <Camera size={16} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-[#FF2E93] to-[#7928CA] text-white flex items-center justify-center shadow-md ring-1 ring-white">
                      <Camera size={10} />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition ${
                      isDarkMode
                        ? 'bg-slate-900/90 border-slate-700 text-slate-200 hover:border-[#FF2E93] hover:text-white'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-[#FF2E93] hover:text-[#FF2E93] shadow-xs'
                    }`}
                  >
                    <Upload size={14} className="text-[#FF2E93]" />
                    <span>Choose image from device</span>
                  </button>
                </div>
              </div>

              {/* Profile Cover Image */}
              <div>
                <label
                  className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Profile Cover Image
                </label>
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => coverFileInputRef.current?.click()}
                    className="relative cursor-pointer group shrink-0"
                    title="Upload cover image from device"
                  >
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      referrerPolicy="no-referrer"
                      className="w-16 h-10 rounded-lg object-cover ring-1 ring-white/20 group-hover:opacity-85 transition shadow-sm"
                    />
                    <div className="absolute inset-0 rounded-lg bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white">
                      <ImageIcon size={14} />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition ${
                      isDarkMode
                        ? 'bg-slate-900/90 border-slate-700 text-slate-200 hover:border-[#00D2FF] hover:text-white'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-[#00D2FF] hover:text-[#00D2FF] shadow-xs'
                    }`}
                  >
                    <Upload size={14} className="text-[#00D2FF]" />
                    <span>Choose cover from device</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Regulations Validation Checkbox */}
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                fieldErrors.terms
                  ? 'border-rose-500 bg-rose-500/10'
                  : isDarkMode
                  ? 'border-white/10 bg-white/5'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <label
                htmlFor="accept-terms-checkbox"
                className="flex items-start gap-2.5 cursor-pointer select-none group"
              >
                <input
                  id="accept-terms-checkbox"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked && fieldErrors.terms) {
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.terms;
                        return next;
                      });
                    }
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#FF2E93] focus:ring-[#FF2E93] accent-[#FF2E93] cursor-pointer"
                />
                <span
                  className={`text-xs leading-relaxed font-medium ${
                    fieldErrors.terms
                      ? 'text-rose-400 font-semibold'
                      : isDarkMode
                      ? 'text-slate-300 group-hover:text-white'
                      : 'text-slate-700 group-hover:text-slate-900'
                  }`}
                >
                  I accept the Rules and Regulations of Creator Meet.
                </span>
              </label>
              {fieldErrors.terms && (
                <p className="mt-2 text-xs text-rose-500 font-medium flex items-center gap-1.5 animate-fade-in">
                  <AlertCircle size={14} className="shrink-0 text-rose-500" />
                  <span>{fieldErrors.terms}</span>
                </p>
              )}
            </div>

            {/* Submit Button: Create Account */}
            <div className="pt-1">
              <button
                id="register-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="gradient-btn-primary w-full py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1.5 shadow-md shadow-[#FF1E82]/30 cursor-pointer disabled:opacity-60 min-h-[42px] transition-all hover:opacity-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* LOGIN MODE */
          <>
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className={`block text-xs font-semibold mb-1.5 ${
                  fieldErrors.email
                    ? 'text-rose-500'
                    : isDarkMode
                    ? 'text-slate-300'
                    : 'text-slate-700'
                }`}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition ${
                    fieldErrors.email ? 'text-rose-400' : 'text-slate-400'
                  }`}
                />
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => handleInputChange('email', setEmail, e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-all focus:outline-hidden min-h-[46px] ${
                    fieldErrors.email
                      ? 'border-rose-500 bg-rose-500/5 text-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : isDarkMode
                      ? 'bg-slate-900/90 border-slate-700 text-white focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1.5 animate-fade-in">
                  <AlertCircle size={14} className="shrink-0 text-rose-500" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            {/* Password with Forgot Password link placed directly above input aligned with label */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className={`block text-xs font-semibold ${
                    fieldErrors.password
                      ? 'text-rose-500'
                      : isDarkMode
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}
                >
                  Password
                </label>
                <button
                  id="forgot-password-link"
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotEmailError(null);
                    setForgotGeneralError(null);
                    setForgotMessage(null);
                    setShowForgotModal(true);
                  }}
                  className="text-xs text-[#00D2FF] hover:text-[#00D2FF]/80 hover:underline cursor-pointer font-medium transition"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock
                  size={17}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition ${
                    fieldErrors.password ? 'text-rose-400' : 'text-slate-400'
                  }`}
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => handleInputChange('password', setPassword, e.target.value)}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm border transition-all focus:outline-hidden min-h-[46px] ${
                    fieldErrors.password
                      ? 'border-rose-500 bg-rose-500/5 text-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : isDarkMode
                      ? 'bg-slate-900/90 border-slate-700 text-white focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 cursor-pointer transition ${
                    isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                  }`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1.5 animate-fade-in">
                  <AlertCircle size={14} className="shrink-0 text-rose-500" />
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            {/* Submit Button: Log In */}
            <div className="pt-1">
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="gradient-btn-primary w-full py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1.5 shadow-md shadow-[#FF1E82]/30 cursor-pointer disabled:opacity-60 min-h-[42px] transition-all hover:opacity-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Logging In...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>

      {/* Divider placed below login/register submit button */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`} />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span
            className={`px-3 text-[11px] font-bold tracking-wider ${
              isDarkMode ? 'bg-[#080D26] text-slate-400' : 'bg-white text-slate-500'
            }`}
          >
            OR
          </span>
        </div>
      </div>

      {/* Continue with Google button placed at bottom of login button */}
      <div>
        <button
          id="google-auth-button"
          type="button"
          onClick={handleGoogleAuth}
          disabled={isGoogleSubmitting || isSubmitting}
          className={`w-full py-2.5 px-4 rounded-full border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 cursor-pointer transition shadow-xs ${
            isDarkMode
              ? 'bg-slate-900/90 border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
          }`}
        >
          {isGoogleSubmitting ? (
            <Loader2 size={16} className="animate-spin text-[#00D2FF]" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>
            {isGoogleSubmitting ? 'Connecting with Google...' : 'Continue with Google'}
          </span>
        </button>

        {/* Authorized Domain Helper Card (shown only if Google requires domain allowlisting) */}
        {unauthorizedDomainInfo && (
          <div className="mt-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs animate-fade-in text-left">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block">Domain Authorization Required</span>
                <span className="text-slate-300 text-[11px] leading-relaxed block mt-0.5">
                  Firebase project <strong className="text-white">creator-meet-app</strong> requires this domain to be allowlisted in the Firebase Console.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-1.5 p-2 bg-black/40 rounded-xl border border-white/10 mb-2.5">
              <span className="font-mono text-[11px] text-amber-200 truncate select-all">
                {unauthorizedDomainInfo.domain}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(unauthorizedDomainInfo.domain);
                  setUnauthorizedDomainInfo((prev) => (prev ? { ...prev, copied: true } : null));
                  setTimeout(() => {
                    setUnauthorizedDomainInfo((prev) => (prev ? { ...prev, copied: false } : null));
                  }, 2000);
                }}
                className="px-2.5 py-1 text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-md shrink-0 transition cursor-pointer flex items-center gap-1"
              >
                {unauthorizedDomainInfo.copied ? (
                  <>
                    <Check size={12} className="text-amber-300" />
                    <span>Copied</span>
                  </>
                ) : (
                  <span>Copy</span>
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="https://console.firebase.google.com/project/creator-meet-app/authentication/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-2.5 text-center rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition shadow-xs"
              >
                Add Domain in Firebase Console
              </a>
              <button
                type="button"
                onClick={async () => {
                  setIsGoogleSubmitting(true);
                  const demoRes = await loginWithDemoGoogleUser(accountType);
                  setIsGoogleSubmitting(false);
                  if (demoRes.success) {
                    onSuccess();
                  } else {
                    setErrorMessage('Something went wrong. Please try again.');
                  }
                }}
                className="py-1.5 px-2.5 text-center rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium text-[11px] transition cursor-pointer"
              >
                Instant Preview Login
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Tip: Email and password signup and login work immediately without domain authorization.
            </p>
          </div>
        )}
      </div>

      {/* Mode switch link */}
      <div className="text-center pt-4 text-xs sm:text-sm text-slate-400">
        {mode === 'signup' ? (
          <>
            <span>Already have an account? </span>
            <button
              id="switch-to-login-btn"
              type="button"
              onClick={() => handleSwitch('login')}
              className="font-bold text-[#00D2FF] hover:underline cursor-pointer ml-1"
            >
              Log in
            </button>
          </>
        ) : (
          <>
            <span>Don't have an account? </span>
            <button
              id="switch-to-register-btn"
              type="button"
              onClick={() => handleSwitch('signup')}
              className="font-bold text-[#FF2E93] hover:underline cursor-pointer ml-1"
            >
              Create one
            </button>
          </>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForgotModal(false);
          }}
        >
          <div
            className={`w-full max-w-md rounded-3xl p-6 sm:p-7 border shadow-2xl ${
              isDarkMode
                ? 'bg-[#0A102E] border-white/15 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="text-xl font-bold mb-2">Reset Your Password</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-4">
              Enter your email address and we will send you instructions to reset your password.
            </p>

            {forgotGeneralError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-rose-500" />
                <span>{forgotGeneralError}</span>
              </div>
            )}

            {forgotMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
                <span>{forgotMessage}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="forgot-email-input"
                  className={`block text-xs font-semibold mb-1.5 ${
                    forgotEmailError
                      ? 'text-rose-500'
                      : isDarkMode
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}
                >
                  Account Email
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition ${
                      forgotEmailError ? 'text-rose-400' : 'text-slate-400'
                    }`}
                  />
                  <input
                    id="forgot-email-input"
                    type="email"
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (forgotEmailError) setForgotEmailError(null);
                      if (forgotGeneralError) setForgotGeneralError(null);
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-hidden ${
                      forgotEmailError
                        ? 'border-rose-500 bg-rose-500/5 text-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : isDarkMode
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-[#00D2FF]'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#00D2FF]'
                    }`}
                  />
                </div>
                {forgotEmailError && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1.5 animate-fade-in">
                    <AlertCircle size={14} className="shrink-0 text-rose-500" />
                    <span>{forgotEmailError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="gradient-btn-primary px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-md cursor-pointer disabled:opacity-60 transition"
                >
                  {isResetting ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 size={13} className="animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
