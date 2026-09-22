import React from 'react';
import { Logo } from './Logo';
import { PageRoute, UserProfile } from '../types';
import { AccountBadge } from './AccountBadge';
import {
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

interface SidebarNavProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenCreatePost: () => void;
  onOpenProfile: () => void;
  unreadMap?: Record<string, boolean>;
  onOpenVerifiedModal?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
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
  const navItems: { label: string; page: PageRoute; icon: any; badge?: string }[] = [
    { label: 'Home Feed', page: 'home' as PageRoute, icon: Home },
    { label: 'Reels', page: 'reels' as PageRoute, icon: Film },
    { label: 'Search', page: 'search' as PageRoute, icon: Search },
    { label: 'Notifications', page: 'notifications' as PageRoute, icon: Bell },
    { label: 'Messages', page: 'messages' as PageRoute, icon: MessagesSquare },
    { label: 'Fan Lounge', page: 'fans' as PageRoute, icon: Heart },
    { label: 'Profile', page: 'profile' as PageRoute, icon: UserIcon },
    { label: 'Settings & Privacy', page: 'settings' as PageRoute, icon: Settings },
    { label: 'Featured', page: 'features' as PageRoute, icon: Zap },
  ];

  const displayName = userProfile?.username
    ? `@${userProfile.username}`
    : userProfile?.fullName || 'User';

  const userAvatar =
    userProfile?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7928CA&color=fff&size=100`;

  return (
    <aside
      id="left-sidebar-navigation"
      className={`w-64 shrink-0 hidden md:flex flex-col justify-between h-screen sticky top-0 border-r transition-colors duration-200 z-40 ${
        isDarkMode
          ? 'bg-[#070B19] border-white/10 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Top Brand Logo */}
      <div className="p-5 border-b border-inherit">
        <button
          onClick={() => onNavigate('home')}
          className="cursor-pointer focus:outline-hidden text-left"
        >
          <Logo isDark={isDarkMode} size="md" />
        </button>
      </div>

      {/* Center Nav Links & Create Button */}
      <div className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
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
              id={`sidebar-nav-${item.page}`}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF2E93] to-[#7928CA] text-white shadow-md shadow-[#FF2E93]/25'
                  : isDarkMode
                  ? 'text-slate-300 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon size={18} />
              <span className="flex-1 text-left">{item.label}</span>
              {hasUnread && (
                <span
                  id={`sidebar-unread-dot-${item.page}`}
                  className="w-1.5 h-1.5 rounded-full bg-rose-500 ml-auto shrink-0"
                  title="New unread activity"
                />
              )}
              {item.badge && !hasUnread && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#FF2E93] text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Primary Create Button allowing creator to post content */}
        <div className="pt-2 px-1">
          <button
            id="sidebar-create-post-btn"
            onClick={onOpenCreatePost}
            className="w-full gradient-btn-primary py-2.5 px-4 text-xs sm:text-sm font-bold text-white rounded-full flex items-center justify-center gap-2 shadow-md shadow-[#FF1E82]/30 hover:opacity-95 transition-all cursor-pointer min-h-[38px]"
          >
            <PlusCircle size={16} />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* User Profile preview chip with Blue Tick */}
      <div className="p-3 border-t border-inherit">
        <button
          onClick={onOpenProfile}
          id="sidebar-user-profile-btn"
          className={`w-full flex items-center gap-2.5 p-2 rounded-2xl transition cursor-pointer text-left ${
            isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'
          }`}
          title="View Your Profile"
        >
          <div className="relative shrink-0">
            <img
              src={userAvatar}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover ring-1 ring-[#00D2FF]"
            />
            {(userProfile?.isVerified || userProfile?.verified || userProfile?.blueTick) && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#00D2FF] text-slate-950 rounded-full flex items-center justify-center shadow-xs">
                <Check size={9} strokeWidth={3} />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold truncate block">{userProfile?.fullName || displayName}</span>
              {(userProfile?.isVerified || userProfile?.verified || userProfile?.blueTick) && (
                <ShieldCheck size={13} className="text-[#00D2FF] fill-[#00D2FF]/20 shrink-0" />
              )}
            </div>
            <span className="text-[10px] text-slate-400 block truncate">{displayName}</span>
          </div>
        </button>
      </div>

      {/* Bottom Theme Toggle & Logout */}
      <div className="p-3.5 border-t border-inherit">
        <div className="flex items-center justify-between px-1">
          <button
            onClick={onToggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
              isDarkMode
                ? 'text-amber-300 hover:bg-slate-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            <span className="text-[11px]">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-full transition cursor-pointer"
            title="Log out of your account"
          >
            <LogOut size={13} />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
