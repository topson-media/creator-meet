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
  LogOut,
  User as UserIcon,
  Settings,
  Coins,
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
  const isFan = userProfile?.role === 'fan';

  const navItems: { label: string; page: PageRoute; icon: any; badge?: string }[] = [
    { label: 'Home Feed', page: 'home' as PageRoute, icon: Home },
    { label: 'Reels', page: 'reels' as PageRoute, icon: Film },
    { label: 'Search', page: 'search' as PageRoute, icon: Search },
    { label: 'Notifications', page: 'notifications' as PageRoute, icon: Bell },
    { label: 'Messages', page: 'messages' as PageRoute, icon: MessagesSquare },
    { label: 'Fan Lounge', page: 'fans' as PageRoute, icon: Heart },
    {
      label: 'Monetization',
      page: 'monetization' as PageRoute,
      icon: Coins,
      badge: isFan ? 'Creator Only' : 'Earn',
    },
    { label: 'Profile', page: 'profile' as PageRoute, icon: UserIcon },
    { label: 'Settings & Privacy', page: 'settings' as PageRoute, icon: Settings },
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

      {/* Bottom Clean Logout Button (Theme is strictly managed in Settings) */}
      <div className="p-3.5 border-t border-inherit">
        <button
          onClick={onLogout}
          id="sidebar-logout-btn"
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 px-3 py-2 rounded-xl transition cursor-pointer"
          title="Log out of your account"
        >
          <LogOut size={15} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
