import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Send,
  Sparkles,
  Phone,
  Video,
  Info,
  CheckCheck,
  Check,
  Smile,
  Paperclip,
  MoreVertical,
  User,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { UserProfile } from '../types';
import { AccountBadge } from './AccountBadge';
import { ProfileDetailsData } from './UserProfileModal';

interface MessageItem {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantUsername: string;
  participantAvatar: string;
  participantRole: 'creator' | 'fan';
  verified: boolean;
  isOnline: boolean;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: MessageItem[];
}

interface MessagesPageProps {
  userProfile: UserProfile | null;
  isDarkMode: boolean;
  onViewProfile?: (profile: ProfileDetailsData) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  userProfile,
  isDarkMode,
  onViewProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      participantId: 'creator-elena',
      participantName: 'Elena Rostova',
      participantUsername: 'elenarostova',
      participantAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      participantRole: 'creator',
      verified: true,
      isOnline: true,
      lastMessage: 'Hey! Loved your idea on the cinematic lighting setup for YouTube.',
      lastTimestamp: '10:42 AM',
      unreadCount: 1,
      messages: [
        {
          id: 'm-1',
          senderId: 'creator-elena',
          text: 'Hi there! Thanks for reaching out through Creator Meet.',
          timestamp: '10:40 AM',
          isMe: false,
        },
        {
          id: 'm-2',
          senderId: 'creator-elena',
          text: 'Hey! Loved your idea on the cinematic lighting setup for YouTube.',
          timestamp: '10:42 AM',
          isMe: false,
        },
      ],
    },
    {
      id: 'conv-2',
      participantId: 'creator-topson',
      participantName: 'Topson Media',
      participantUsername: 'topsonmedia',
      participantAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      participantRole: 'creator',
      verified: true,
      isOnline: true,
      lastMessage: 'We are organizing a sound engineering live circle this Thursday!',
      lastTimestamp: 'Yesterday',
      unreadCount: 0,
      messages: [
        {
          id: 'm-3',
          senderId: 'creator-topson',
          text: 'We are organizing a sound engineering live circle this Thursday! Would love to have you join.',
          timestamp: 'Yesterday 4:15 PM',
          isMe: false,
        },
      ],
    },
    {
      id: 'conv-3',
      participantId: 'creator-marcus',
      participantName: 'Marcus Vance',
      participantUsername: 'marcusvfx',
      participantAvatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      participantRole: 'creator',
      verified: true,
      isOnline: false,
      lastMessage: 'Check out the new Unreal Engine render pipeline reel!',
      lastTimestamp: 'Sep 15',
      unreadCount: 0,
      messages: [
        {
          id: 'm-4',
          senderId: 'creator-marcus',
          text: 'Check out the new Unreal Engine render pipeline reel! Sent you the project breakdown.',
          timestamp: 'Sep 15, 2:30 PM',
          isMe: false,
        },
      ],
    },
    {
      id: 'conv-4',
      participantId: 'fan-sarah',
      participantName: 'Sarah Jenkins',
      participantUsername: 'sarah_j',
      participantAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      participantRole: 'fan',
      verified: false,
      isOnline: true,
      lastMessage: 'Thank you for following back! Big fan of your work.',
      lastTimestamp: 'Sep 14',
      unreadCount: 0,
      messages: [
        {
          id: 'm-5',
          senderId: 'fan-sarah',
          text: 'Thank you for following back! Big fan of your work.',
          timestamp: 'Sep 14, 11:20 AM',
          isMe: false,
        },
      ],
    },
  ]);

  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgText = inputText.trim();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      senderId: userProfile?.id || 'current-user',
      text: userMsgText,
      timestamp: timeStr,
      isMe: true,
      status: 'sent',
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConvId) {
          return {
            ...conv,
            lastMessage: userMsgText,
            lastTimestamp: 'Just now',
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );

    setInputText('');

    // Simulate creator friendly reply after 1.2s
    setTimeout(() => {
      const replies = [
        'Awesome! Thanks for sharing that with me!',
        'Got it! That sounds super creative. Let me check the schedule.',
        'Appreciate your message! Stay tuned for the next drop.',
        'Sounds great! Looking forward to collaborating on this.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const replyMsg: MessageItem = {
        id: `reply-${Date.now()}`,
        senderId: activeConv.participantId,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConvId) {
            return {
              ...conv,
              lastMessage: randomReply,
              lastTimestamp: 'Just now',
              messages: [...conv.messages, replyMsg],
            };
          }
          return conv;
        })
      );
    }, 1200);
  };

  const filteredConversations = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participantUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      id="messages-page-layout"
      className="h-[calc(100vh-20px)] max-w-7xl mx-auto p-2 sm:p-4 flex flex-col"
    >
      <div
        className={`flex-1 rounded-3xl border shadow-xl flex overflow-hidden ${
          isDarkMode
            ? 'bg-[#0B1028] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* LEFT COLUMN: Conversation Threads List */}
        <div
          className={`w-full sm:w-80 md:w-96 border-r flex flex-col shrink-0 ${
            activeConvId ? 'hidden sm:flex' : 'flex'
          } ${isDarkMode ? 'border-white/10 bg-[#070A1C]' : 'border-slate-200 bg-slate-50/50'}`}
        >
          {/* Header */}
          <div className="p-4 border-b border-inherit space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>Messages</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF2E93] text-white">
                  {conversations.reduce((acc, c) => acc + c.unreadCount, 0) || 'Direct'}
                </span>
              </h1>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border transition focus:outline-hidden ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-inherit">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveConvId(conv.id);
                    // clear unread
                    setConversations((prev) =>
                      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
                    );
                  }}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-white/10'
                        : 'bg-pink-50/70'
                      : isDarkMode
                      ? 'hover:bg-white/5'
                      : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.participantAvatar}
                      alt={conv.participantName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#00D2FF]/30"
                    />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#070A1C]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-bold truncate">{conv.participantName}</span>
                        {conv.verified && (
                          <ShieldCheck size={13} className="text-[#00D2FF] shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {conv.lastTimestamp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-relaxed">
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#FF2E93] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Chat Feed & Input */}
        {activeConv ? (
          <div className="flex-1 flex flex-col min-w-0 h-full">
            {/* Chat Top Header */}
            <div className="p-3.5 px-4 sm:px-6 border-b border-inherit flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setActiveConvId('')}
                  className="sm:hidden p-1.5 rounded-lg text-slate-400 hover:bg-white/10"
                >
                  ←
                </button>
                <div className="relative">
                  <img
                    src={activeConv.participantAvatar}
                    alt={activeConv.participantName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00D2FF]/40"
                  />
                  {activeConv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1028]" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold truncate">
                      {activeConv.participantName}
                    </span>
                    {activeConv.verified && (
                      <ShieldCheck size={14} className="text-[#00D2FF] shrink-0" />
                    )}
                    <AccountBadge role={activeConv.participantRole} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {activeConv.isOnline ? (
                      <span className="text-emerald-400 font-semibold">Active now</span>
                    ) : (
                      `@${activeConv.participantUsername}`
                    )}
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1 sm:gap-2 text-slate-400">
                <button
                  onClick={() =>
                    onViewProfile?.({
                      id: activeConv.participantId,
                      name: activeConv.participantName,
                      username: activeConv.participantUsername,
                      avatar: activeConv.participantAvatar,
                      role: activeConv.participantRole,
                      verified: activeConv.verified,
                    })
                  }
                  className="px-3 py-1.5 rounded-full text-xs font-bold border border-inherit hover:border-[#FF2E93] hover:text-[#FF2E93] transition cursor-pointer"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Chat Messages Timeline */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isMe && (
                    <img
                      src={activeConv.participantAvatar}
                      alt={activeConv.participantName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                    />
                  )}

                  <div
                    className={`max-w-[78%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.isMe
                        ? 'gradient-btn-primary text-white rounded-br-none'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-100 rounded-bl-none'
                        : 'bg-slate-100 text-slate-900 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                        msg.isMe ? 'text-white/80' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.isMe && <CheckCheck size={12} className="text-white" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Send Input Box */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 border-t border-inherit flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeConv.participantName}...`}
                className={`flex-1 px-4 py-3 rounded-2xl text-xs sm:text-sm border transition focus:outline-hidden ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="gradient-btn-primary p-3 rounded-2xl text-white shadow-md shadow-[#FF1E82]/30 disabled:opacity-40 transition cursor-pointer hover:scale-105"
                title="Send Message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Sparkles size={36} className="text-[#FF2E93] mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Select a conversation
            </h3>
            <p className="text-xs max-w-xs mt-1">
              Choose a creator or fan from the list to start messaging in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
