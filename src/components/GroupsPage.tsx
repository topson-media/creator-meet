import React, { useState } from 'react';
import { Group, GroupMessage, UserProfile, UserRole } from '../types';
import { INITIAL_GROUPS } from '../data/sampleMedia';
import { AccountBadge } from './AccountBadge';
import { ProfileDetailsData } from './UserProfileModal';
import {
  Users,
  Plus,
  MessageSquare,
  Search,
  Sparkles,
  Send,
  X,
  ShieldCheck,
  Hash,
  Lock,
  Globe,
  Share2,
  ChevronRight,
  UserPlus,
} from 'lucide-react';

interface GroupsPageProps {
  userProfile: UserProfile | null;
  isDarkMode: boolean;
  onViewProfile?: (profile: ProfileDetailsData) => void;
  onStartChat?: (user: { name: string; handle: string; avatar: string; role: 'creator' | 'fan' }) => void;
}

const CATEGORIES = ['All Groups', 'Filmmaking & Video', 'Music & Audio', 'Podcasting', 'Community'];

export const GroupsPage: React.FC<GroupsPageProps> = ({
  userProfile,
  isDarkMode,
  onViewProfile,
  onStartChat,
}) => {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || 'group-1');
  const [selectedCategory, setSelectedCategory] = useState('All Groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  // Create Group Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('Filmmaking & Video');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupAvatar, setNewGroupAvatar] = useState('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80');

  const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  const filteredGroups = groups.filter((g) => {
    const matchesCat = selectedCategory === 'All Groups' || g.category === selectedCategory;
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeGroup) return;

    const newMessage: GroupMessage = {
      id: `gm-${Date.now()}`,
      senderId: userProfile?.id || 'current-user',
      senderName: userProfile?.fullName || userProfile?.username || 'You',
      senderAvatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      senderRole: userProfile?.role || 'creator',
      text: messageInput.trim(),
      timestamp: 'Just now',
    };

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === activeGroup.id) {
          return {
            ...g,
            messages: [...g.messages, newMessage],
          };
        }
        return g;
      })
    );

    setMessageInput('');
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: newGroupName.trim(),
      category: newGroupCategory,
      description: newGroupDescription.trim() || 'Collaborative circle for creators and fans.',
      avatar: newGroupAvatar,
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      memberCount: 1,
      isPrivate: false,
      createdBy: userProfile?.fullName || 'You',
      createdAt: 'Just now',
      members: [
        {
          id: userProfile?.id || 'current-user',
          name: userProfile?.fullName || 'You',
          username: userProfile?.username || 'you',
          avatar:
            userProfile?.avatar ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          role: userProfile?.role || 'creator',
          isOnline: true,
        },
      ],
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: userProfile?.id || 'current-user',
          senderName: userProfile?.fullName || 'You',
          senderAvatar:
            userProfile?.avatar ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          senderRole: userProfile?.role || 'creator',
          text: `Welcome to ${newGroupName.trim()}! Introduce yourself and share what you are working on!`,
          timestamp: 'Just now',
        },
      ],
    };

    setGroups([newGroup, ...groups]);
    setSelectedGroupId(newGroup.id);
    setShowCreateModal(false);
    setNewGroupName('');
    setNewGroupDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-btn-primary flex items-center justify-center text-white shadow-xs">
              <Users size={16} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Creator & Fan Discussion Groups
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create multi-user circles, brainstorm collaborations, trade stems, and sync directly
          </p>
        </div>

        {/* "+ Create Group" button */}
        <button
          id="create-new-group-btn"
          onClick={() => setShowCreateModal(true)}
          className="gradient-btn-primary px-4 py-2 text-xs font-bold text-white rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF1E82]/30 hover:opacity-95 transition cursor-pointer shrink-0 self-start sm:self-auto min-h-[36px]"
        >
          <Plus size={16} />
          <span>Create New Group</span>
        </button>
      </div>

      {/* Main Split Layout: Groups List + Active Discussion Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Groups Directory (5 Cols) */}
        <div
          className={`lg:col-span-5 rounded-3xl border p-4 sm:p-5 flex flex-col space-y-4 ${
            isDarkMode
              ? 'bg-[#080D26] border-white/10 text-white shadow-xl'
              : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}
        >
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search groups or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-2xl border transition ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-[#00D2FF] text-black border-[#00D2FF]'
                    : isDarkMode
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Groups list */}
          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredGroups.map((g) => {
              const isSelected = g.id === activeGroup?.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#FF2E93]/15 via-[#7928CA]/15 to-[#00D2FF]/15 border-[#00D2FF]'
                      : isDarkMode
                      ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={g.avatar}
                      alt={g.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-2xl object-cover ring-1 ring-white/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold truncate">{g.name}</h3>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{g.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span className="font-semibold text-[#00D2FF]">{g.category}</span>
                        <span>•</span>
                        <span>{g.memberCount} members</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    size={16}
                    className={`shrink-0 ${isSelected ? 'text-[#00D2FF]' : 'text-slate-500'}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Group Discussion Room (7 Cols) */}
        {activeGroup && (
          <div
            className={`lg:col-span-7 rounded-3xl border overflow-hidden flex flex-col h-[650px] shadow-2xl ${
              isDarkMode
                ? 'bg-[#080D26] border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Group Header Banner */}
            <div className="p-4 sm:p-5 border-b border-inherit bg-black/10 dark:bg-black/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={activeGroup.avatar}
                  alt={activeGroup.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#FF2E93] shrink-0"
                />
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-bold truncate">{activeGroup.name}</h2>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-white/10 font-medium text-[#00D2FF]">
                      {activeGroup.category}
                    </span>
                    <span>{activeGroup.memberCount} creators & fans active</span>
                  </div>
                </div>
              </div>

              {/* Header Action */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('Group discussion link copied to clipboard!');
                  }}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Share Group"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Members Quick Strip */}
            <div className="px-4 py-2 bg-white/5 border-b border-inherit flex items-center justify-between text-xs overflow-x-auto">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Members:</span>
                <div className="flex -space-x-2">
                  {activeGroup.members.slice(0, 6).map((m) => (
                    <img
                      key={m.id}
                      src={m.avatar}
                      alt={m.name}
                      referrerPolicy="no-referrer"
                      onClick={() => {
                        onViewProfile?.({
                          id: m.id,
                          name: m.name,
                          username: m.username,
                          avatar: m.avatar,
                          role: m.role,
                        });
                      }}
                      className="w-6 h-6 rounded-full object-cover ring-2 ring-[#080D26] cursor-pointer hover:scale-110 transition"
                      title={`${m.name} (${m.role}) - Click to view profile & follow`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-slate-400">Click member avatar to view profile</span>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {activeGroup.messages.map((msg) => {
                const isMe = msg.senderId === (userProfile?.id || 'current-user');
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      referrerPolicy="no-referrer"
                      onClick={() => {
                        onViewProfile?.({
                          id: msg.senderId,
                          name: msg.senderName,
                          username: msg.senderName.toLowerCase().replace(/\s+/g, ''),
                          avatar: msg.senderAvatar,
                          role: msg.senderRole,
                        });
                      }}
                      className="w-8 h-8 rounded-full object-cover shrink-0 cursor-pointer hover:ring-2 hover:ring-[#00D2FF] transition"
                      title="Click to view details, social links, cover & follow"
                    />

                    <div className={`max-w-[80%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`flex items-center gap-1.5 text-[11px] ${
                          isMe ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <span
                          onClick={() => {
                            onViewProfile?.({
                              id: msg.senderId,
                              name: msg.senderName,
                              username: msg.senderName.toLowerCase().replace(/\s+/g, ''),
                              avatar: msg.senderAvatar,
                              role: msg.senderRole,
                            });
                          }}
                          className="font-bold hover:underline cursor-pointer"
                        >
                          {msg.senderName}
                        </span>
                        <AccountBadge role={msg.senderRole} size="sm" />
                        <span className="text-slate-400 text-[10px]">{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-gradient-to-r from-[#FF2E93] to-[#7928CA] text-white rounded-tr-xs'
                            : isDarkMode
                            ? 'bg-slate-900/90 text-slate-100 border border-white/10 rounded-tl-xs'
                            : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Composer Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 border-t border-inherit bg-black/10 dark:bg-black/20 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`Message #${activeGroup.name}...`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className={`flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-full border transition ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="gradient-btn-primary p-2.5 rounded-full text-white shadow-md cursor-pointer disabled:opacity-40 transition shrink-0"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* CREATE GROUP MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl p-5 sm:p-6 ${
              isDarkMode
                ? 'bg-[#0A0F2B] border-white/15 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full gradient-btn-primary flex items-center justify-center text-white">
                  <Users size={16} />
                </div>
                <h3 className="text-base font-bold">Create Discussion Group</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              {/* Group Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. YouTube Video Editors Hub"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Category</label>
                <select
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value)}
                  className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="Filmmaking & Video">Filmmaking & Video</option>
                  <option value="Music & Audio">Music & Audio</option>
                  <option value="Podcasting">Podcasting</option>
                  <option value="Gaming & Streaming">Gaming & Streaming</option>
                  <option value="Community">Fans & Community</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Description & Focus
                </label>
                <textarea
                  rows={3}
                  placeholder="What is this group for? Who should join?"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className={`w-full p-3 text-xs rounded-xl border ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-full hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newGroupName.trim()}
                  className="gradient-btn-primary px-5 py-2 text-xs font-bold text-white rounded-full shadow-md cursor-pointer disabled:opacity-50 min-h-[34px]"
                >
                  Create Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
