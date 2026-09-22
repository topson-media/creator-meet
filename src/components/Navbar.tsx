import React, { useState } from 'react';
import { Logo } from './Logo';
import { PageRoute } from '../types';
import { useAuth } from '../context/AuthContext';
import { AccountBadge } from './AccountBadge';
import { Moon, Sun, Menu, X, ArrowRight, UserPlus, LogIn, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  onOpenAuth,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();

  const isLoggedIn = !!currentUser;

  // Requirement 4:
  // When visitor is NOT logged in: Home, Discover, Creators, Fans, Features, About
  // When user IS logged in: Home, Discover, Creators, Fans, Features
  const navLinks: { label: string; page: PageRoute }[] = isLoggedIn
    ? [
        { label: 'Home', page: 'home' },
        { label: 'Discover', page: 'discover' },
        { label: 'Creators', page: 'creators' },
        { label: 'Fans', page: 'fans' },
        { label: 'Features', page: 'features' },
      ]
    : [
        { label: 'Home', page: 'home' },
        { label: 'Discover', page: 'discover' },
        { label: 'Creators', page: 'creators' },
        { label: 'Fans', page: 'fans' },
        { label: 'Features', page: 'features' },
        { label: 'About', page: 'about' },
      ];

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    onNavigate('home');
  };

  const displayName = userProfile?.username
    ? `@${userProfile.username}`
    : currentUser?.email?.split('@')[0] || 'User';

  const userAvatar =
    userProfile?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7928CA&color=fff&size=100`;

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-50 transition-colors duration-300 backdrop-blur-xl border-b ${
        isDarkMode
          ? 'bg-[#070B19]/90 border-white/10 text-white'
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="navbar-brand-logo"
          onClick={() => handleNavClick('home')}
          className="cursor-pointer focus:outline-hidden"
        >
          <Logo isDark={isDarkMode} size="sm" />
        </button>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center space-x-1"
          aria-label="Main Navigation"
        >
          {navLinks.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                id={`nav-link-${item.page}`}
                onClick={() => handleNavClick(item.page)}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? isDarkMode
                      ? 'text-white'
                      : 'text-[#FF2E93] font-semibold'
                    : isDarkMode
                    ? 'text-slate-300 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#FF2E93] rounded-full shadow-xs shadow-[#FF2E93]/80"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions - Attractive & Small */}
        <div className="hidden md:flex items-center space-x-2.5">
          {/* Dark / Light Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800/80 text-amber-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {!isLoggedIn ? (
            /* Visitor NOT logged in: [Log In], [Get Started] */
            <>
              <button
                id="navbar-login-btn"
                onClick={() => onOpenAuth('login')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer min-h-[32px] ${
                  isDarkMode
                    ? 'border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 hover:bg-white/5'
                    : 'border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                Log In
              </button>

              <button
                id="navbar-get-started-btn"
                onClick={() => onOpenAuth('signup')}
                className="gradient-btn-primary px-3.5 py-1.5 text-xs font-semibold text-white rounded-full flex items-center gap-1 shadow-sm shadow-[#FF1E82]/30 cursor-pointer min-h-[32px]"
              >
                <span>Get Started</span>
                <ArrowRight size={13} />
              </button>
            </>
          ) : (
            /* User IS logged in: Profile avatar, Username, Profile, Log Out */
            <div className="flex items-center gap-2">
              {/* Profile Avatar + Username button */}
              <button
                id="navbar-user-profile-btn"
                onClick={onOpenProfile}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all cursor-pointer min-h-[32px] ${
                  isDarkMode
                    ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <img
                  src={userAvatar}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-purple-400/50"
                />
                <span className="text-xs font-bold max-w-[110px] truncate">{displayName}</span>
                {userProfile?.role && <AccountBadge role={userProfile.role} size="sm" />}
              </button>

              {/* Profile button */}
              <button
                id="navbar-profile-btn"
                onClick={onOpenProfile}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer min-h-[32px] ${
                  isDarkMode
                    ? 'border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 hover:bg-white/5'
                    : 'border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                Profile
              </button>

              {/* Log Out button */}
              <button
                id="navbar-logout-btn"
                onClick={handleLogout}
                className="px-3 py-1 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/25 rounded-full transition-all duration-200 cursor-pointer min-h-[32px] flex items-center gap-1"
              >
                <LogOut size={12} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            id="mobile-theme-toggle"
            onClick={onToggleTheme}
            className={`p-2 rounded-full ${
              isDarkMode ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg ${
              isDarkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className={`md:hidden px-4 pt-2 pb-6 border-b transition-all ${
            isDarkMode
              ? 'bg-[#070B19] border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* If Logged In, display user banner in mobile menu */}
          {isLoggedIn && (
            <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={userAvatar}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-400/50"
                />
                <div>
                  <span className="text-sm font-bold block">{displayName}</span>
                  {userProfile?.role && <AccountBadge role={userProfile.role} size="sm" />}
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="text-xs text-[#00D2FF] font-semibold hover:underline"
              >
                View
              </button>
            </div>
          )}

          <div className="flex flex-col space-y-1.5 mb-4">
            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  id={`mobile-nav-${item.page}`}
                  onClick={() => handleNavClick(item.page)}
                  className={`text-left px-4 py-2.5 rounded-lg text-base font-medium flex items-center justify-between ${
                    isActive
                      ? isDarkMode
                        ? 'bg-white/10 text-[#FF2E93]'
                        : 'bg-rose-50 text-[#FF2E93] font-semibold'
                      : isDarkMode
                      ? 'text-slate-300 hover:bg-white/5'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-[#FF2E93]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-700/40">
            {!isLoggedIn ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="mobile-login-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className={`w-full py-3 text-sm font-semibold rounded-full border text-center flex items-center justify-center gap-1.5 min-h-[44px] ${
                    isDarkMode
                      ? 'border-slate-700 text-slate-200 hover:bg-white/5'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LogIn size={15} />
                  Log In
                </button>
                <button
                  id="mobile-get-started-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="w-full gradient-btn-primary py-3 text-sm font-semibold text-white rounded-full text-center flex items-center justify-center gap-1.5 shadow-md shadow-[#FF1E82]/30 min-h-[44px]"
                >
                  <UserPlus size={15} />
                  Get Started
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="mobile-profile-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className={`w-full py-3 text-sm font-semibold rounded-full border text-center flex items-center justify-center gap-1.5 min-h-[44px] ${
                    isDarkMode
                      ? 'border-slate-700 text-slate-200 hover:bg-white/5'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <UserIcon size={15} />
                  Profile
                </button>
                <button
                  id="mobile-logout-btn"
                  onClick={handleLogout}
                  className="w-full py-3 text-sm font-semibold rounded-full border border-rose-500/30 text-rose-400 bg-rose-500/10 text-center flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <LogOut size={15} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
