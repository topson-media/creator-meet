import React, { useState } from 'react';
import {
  Bell,
  Heart,
  UserPlus,
  Users,
  MessageCircle,
  Sparkles,
  CheckCircle,
  Filter,
} from 'lucide-react';
import { UserProfile } from '../types';

interface NotificationsPageProps {
  userProfile: UserProfile | null;
  isDarkMode: boolean;
  onNavigate: (page: any) => void;
  onViewProfile?: (profile: any) => void;
}

interface NotificationItem {
  id: string;
  type: 'like' | 'follow' | 'group' | 'collab' | 'comment';
  user: {
    name: string;
    username: string;
    avatar: string;
    role: 'creator' | 'fan';
  };
  text: string;
  target?: string;
  timeAgo: string;
  isRead?: boolean;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  userProfile,
  isDarkMode,
  onNavigate,
  onViewProfile,
}) => {
  const [filter, setFilter] = useState<'all' | 'follows' | 'groups' | 'likes'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'follow',
      user: {
        name: 'Elena Rostova',
        username: 'elenafilm',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        role: 'creator',
      },
      text: 'started following your creator profile and reels',
      timeAgo: '5m ago',
      isRead: false,
    },
    {
      id: 'notif-2',
      type: 'like',
      user: {
        name: 'Marcus Vance',
        username: 'marcus_vibe',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        role: 'creator',
      },
      text: 'liked your 9:16 reel',
      target: 'Cinematic Anamorphic Reel',
      timeAgo: '24m ago',
      isRead: false,
    },
    {
      id: 'notif-3',
      type: 'group',
      user: {
        name: 'Klara Bloom',
        username: 'klarasound',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        role: 'fan',
      },
      text: 'requested to join your group circle',
      target: 'Indie Filmmakers & Directors Collective',
      timeAgo: '1h ago',
      isRead: true,
    },
    {
      id: 'notif-4',
      type: 'collab',
      user: {
        name: 'Devon Miles',
        username: 'devon_beats',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        role: 'creator',
      },
      text: 'invited you to collaborate on sound design for new drop',
      timeAgo: '3h ago',
      isRead: true,
    },
    {
      id: 'notif-5',
      type: 'comment',
      user: {
        name: 'Sophia Chen',
        username: 'sophiacreates',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        role: 'creator',
      },
      text: 'commented on your post: "The soundtrack is magnificent! Keep inspiring us!"',
      timeAgo: '5h ago',
      isRead: true,
    },
  ]);

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'follows') return n.type === 'follow';
    if (filter === 'groups') return n.type === 'group';
    if (filter === 'likes') return n.type === 'like';
    return true;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF2E93] to-[#7928CA] flex items-center justify-center text-white shadow-md">
            <Bell size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black">Notifications</h1>
            <p className="text-xs text-slate-400">Activity on your posts, reels, and circles</p>
          </div>
        </div>

        <button
          onClick={markAllAsRead}
          className="text-xs font-semibold text-[#00D2FF] hover:underline cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Activity' },
          { id: 'follows', label: 'Followers' },
          { id: 'groups', label: 'Group Requests' },
          { id: 'likes', label: 'Likes & Reactions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
              filter === tab.id
                ? 'bg-[#FF2E93] text-white border-[#FF2E93]'
                : isDarkMode
                ? 'bg-white/5 border-white/10 text-slate-300 hover:border-white/25'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div
        className={`rounded-3xl border divide-y overflow-hidden shadow-xl ${
          isDarkMode
            ? 'bg-[#080D26] border-white/10 divide-white/10 text-white'
            : 'bg-white border-slate-200 divide-slate-100 text-slate-900'
        }`}
      >
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Bell size={32} className="mx-auto opacity-40" />
            <p className="text-sm font-semibold">No notifications in this category</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => {
            const getIcon = () => {
              switch (notif.type) {
                case 'follow':
                  return <UserPlus size={14} className="text-[#00D2FF]" />;
                case 'like':
                  return <Heart size={14} className="text-[#FF2E93] fill-[#FF2E93]" />;
                case 'group':
                  return <Users size={14} className="text-purple-400" />;
                case 'collab':
                  return <Sparkles size={14} className="text-amber-400" />;
                default:
                  return <MessageCircle size={14} className="text-emerald-400" />;
              }
            };

            return (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-3.5 transition ${
                  !notif.isRead
                    ? isDarkMode
                      ? 'bg-purple-950/15'
                      : 'bg-purple-50/50'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={notif.user.avatar}
                      alt={notif.user.name}
                      referrerPolicy="no-referrer"
                      onClick={() =>
                        onViewProfile?.({
                          id: notif.user.username,
                          name: notif.user.name,
                          username: notif.user.username,
                          avatar: notif.user.avatar,
                          role: notif.user.role,
                        })
                      }
                      className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-[#00D2FF] transition"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#080D26] border border-white/20 flex items-center justify-center">
                      {getIcon()}
                    </div>
                  </div>

                  <div className="min-w-0 text-xs sm:text-sm">
                    <p className="leading-snug">
                      <span
                        onClick={() =>
                          onViewProfile?.({
                            id: notif.user.username,
                            name: notif.user.name,
                            username: notif.user.username,
                            avatar: notif.user.avatar,
                            role: notif.user.role,
                          })
                        }
                        className="font-bold hover:underline cursor-pointer"
                      >
                        {notif.user.name}
                      </span>{' '}
                      <span className="text-slate-400">@{notif.user.username}</span>{' '}
                      <span>{notif.text}</span>
                      {notif.target && (
                        <span className="font-semibold text-[#00D2FF]"> "{notif.target}"</span>
                      )}
                    </p>
                    <span className="text-[11px] text-slate-500 mt-1 block">{notif.timeAgo}</span>
                  </div>
                </div>

                {notif.type === 'group' && (
                  <button
                    onClick={() => onNavigate('messages')}
                    className="px-3 py-1.5 rounded-full text-xs font-bold gradient-btn-primary text-white shrink-0 cursor-pointer shadow-xs"
                  >
                    Review
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
