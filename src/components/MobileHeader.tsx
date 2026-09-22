import React, { useState } from 'react';
import { Logo } from './Logo';
import { PageRoute, UserProfile } from '../types';
import {
  Menu,
  X,
  Home,
  Film,
  Search,
  Bell,
  MessagesSquare,
  Heart,
  Zap,
  PlusCircle,
  Moon,
  Sun,
  LogOut,
  User as UserIcon,
  Settings,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { AccountBadge } from './AccountBadge';

interface MobileHeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenCreatePost: () => void;
  onOpenProfile: () => void;
  unreadMap?: Record<string, boolean>;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentPage,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  userProfile,
  onLogout,
  onOpenCreatePost,
  onOpenProfile,
  unreadMap,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home Feed', page: 'home' as PageRoute, icon: Home },
    { label: 'Reels', page: 'reels' as PageRoute, icon: Film },
    { label: 'Search', page: 'search' as PageRoute, icon: Search },
    { label: 'Notifications', page: 'notifications' as PageRoute, icon: Bell },
    { label: 'Messages', page: 'messages' as PageRoute, icon: MessagesSquare },
    { label: 'Fan Lounge', page: 'fans' as PageRoute, icon: Heart },
    { label: 'Profile', page: 'profile' as PageRoute, icon: UserIcon },
    { label: 'Settings & Privacy', page: 'settings' as PageRoute, icon: Settings },
    { label: 'Features', page: 'features' as PageRoute, icon: Zap },
  ];

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  const displayName = userProfile?.username
    ? `@${userProfile.username}`
    : userProfile?.fullName || 'User';

  const userAvatar =
    userProfile?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7928CA&color=fff&size=100`;

  return (
    <>
      <header
        className={`md:hidden sticky top-0 z-40 px-4 h-14 flex items-center justify-between border-b backdrop-blur-lg ${
          isDarkMode
            ? 'bg-[#070B19]/90 border-white/10 text-white'
            : 'bg-white/90 border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <button onClick={() => handleNavClick('home')} className="cursor-pointer">
          <Logo isDark={isDarkMode} size="sm" />
        </button>

        <div className="flex items-center gap-2">
          {/* Create Button */}
          <button
            onClick={onOpenCreatePost}
            className="gradient-btn-primary px-3 py-1 text-xs font-bold text-white rounded-full flex items-center gap-1 shadow-xs cursor-pointer min-h-[30px]"
          >
            <PlusCircle size={13} />
            <span>Create</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-1.5 rounded-full ${
              isDarkMode ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`relative p-1.5 rounded-lg cursor-pointer ${
              isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
            {!menuOpen && unreadMap && Object.values(unreadMap).some(Boolean) && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className={`md:hidden fixed inset-x-0 top-14 z-30 p-4 border-b shadow-xl space-y-2 animate-fade-in ${
            isDarkMode
              ? 'bg-[#080D26] border-white/10 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Profile row */}
          <button
            onClick={() => {
              setMenuOpen(false);
              onOpenProfile();
            }}
            className={`w-full flex items-center gap-3 p-2 rounded-xl border mb-2 cursor-pointer text-left ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <img
              src={userAvatar}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FF2E93]"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold block truncate">{userProfile?.fullName || displayName}</span>
                {(userProfile?.isVerified || userProfile?.verified || userProfile?.blueTick) && (
                  <ShieldCheck size={14} className="text-[#00D2FF] fill-[#00D2FF]/20 shrink-0" />
                )}
              </div>
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{displayName}</span>
            </div>
            {userProfile?.role && <AccountBadge role={userProfile.role} size="sm" />}
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.page === 'home'
                ? currentPage === 'home' || currentPage === 'dashboard'
                : currentPage === item.page;
            const hasUnread = Boolean(unreadMap?.[item.page]);

            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF2E93] to-[#7928CA] text-white'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-white/5'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{item.label}</span>
                {hasUnread && (
                  <span
                    id={`mobile-unread-dot-${item.page}`}
                    className="w-1.5 h-1.5 rounded-full bg-rose-500 ml-auto shrink-0"
                    title="New unread activity"
                  />
                )}
              </button>
            );
          })}

          <div className={`pt-2 border-t flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
            <button
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
              className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 py-1"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
