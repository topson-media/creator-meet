import React, { useState } from 'react';
import { SAMPLE_COLLAB_REQUESTS } from '../data/sampleData';
import { CollabRequest, Creator } from '../types';
import {
  Video,
  PlusCircle,
  Clock,
  Sparkles,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

interface CreatorsPageProps {
  isDarkMode: boolean;
  onOpenCollabModal: (collab?: CollabRequest) => void;
  onSelectCreator: (creator: Creator) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onRequireAuth?: (action: 'follow' | 'comment' | 'chat', targetName?: string) => boolean;
  onStartChat?: (user: { name: string; handle: string; avatar: string; role: 'creator' | 'fan' }) => void;
}

export const CreatorsPage: React.FC<CreatorsPageProps> = ({
  isDarkMode,
  onOpenCollabModal,
  onRequireAuth,
  onStartChat,
}) => {
  const [roleFilter, setRoleFilter] = useState('All');
  const [collabList, setCollabList] = useState<CollabRequest[]>(SAMPLE_COLLAB_REQUESTS);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState('Video Editor');
  const [newBudget, setNewBudget] = useState('$200 - $350');
  const [newDesc, setNewDesc] = useState('');

  const roles = ['All', 'Video Editor', 'Co-Host / Guest', '3D Artist', 'Gaming Streamer'];

  const filteredCollabs = collabList.filter((collab) => {
    return roleFilter === 'All' || collab.neededRole === roleFilter;
  });

  const handleOpenPostForm = () => {
    if (onRequireAuth && !onRequireAuth('comment', 'Collab Exchange')) {
      return;
    }
    setShowNewPostForm(true);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRequireAuth && !onRequireAuth('comment', 'Collab Exchange')) {
      return;
    }
    const newCollab: CollabRequest = {
      id: `collab-${Date.now()}`,
      creatorName: 'You (Creator)',
      handle: '@you',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      title: newTitle,
      description: newDesc,
      neededRole: newRole,
      budget: newBudget,
      platform: 'YouTube & TikTok',
      timeAgo: 'Just now',
      category: 'Creative Collaboration',
      responsesCount: 0,
    };
    setCollabList([newCollab, ...collabList]);
    setShowNewPostForm(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handlePitchCollab = (collab: CollabRequest) => {
    if (onRequireAuth && !onRequireAuth('chat', collab.creatorName)) {
      return;
    }
    onOpenCollabModal(collab);
  };

  const handleChatCreator = (collab: CollabRequest) => {
    if (onRequireAuth && !onRequireAuth('chat', collab.creatorName)) {
      return;
    }
    if (onStartChat) {
      onStartChat({
        name: collab.creatorName,
        handle: collab.handle,
        avatar: collab.avatar,
        role: 'creator',
      });
    }
  };

  return (
    <div id="creators-page" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-2 ${
              isDarkMode
                ? 'bg-[#15123A] text-purple-300 border border-purple-500/30'
                : 'bg-purple-100 text-purple-700 border border-purple-200'
            }`}
          >
            <Video size={12} className="text-[#FF2E93]" />
            <span>Creator Collab Exchange</span>
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Find Creative Partners
          </h1>
          <p
            className={`mt-1.5 text-xs sm:text-sm max-w-xl ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Find video editors, co-hosts, thumbnail artists, and podcast guests.
          </p>
        </div>

        {/* Small Attractive Post Collab Button */}
        <button
          id="post-collab-btn"
          onClick={handleOpenPostForm}
          className="gradient-btn-primary px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-full flex items-center gap-1.5 shadow-xs cursor-pointer self-start md:self-auto min-h-[36px]"
        >
          <PlusCircle size={14} />
          <span>Post Collab Request</span>
        </button>
      </div>

      {/* New Post Form Modal/Card */}
      {showNewPostForm && (
        <div className="mb-6 p-4 rounded-2xl border border-[#FF2E93]/40 bg-[#0F1435] text-white">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#00D2FF]" />
            <span>Post a New Collaboration Request</span>
          </h3>
          <form onSubmit={handleCreatePost} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Looking for a YouTube video editor"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Role Needed
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-hidden"
                >
                  <option value="Video Editor">Video Editor</option>
                  <option value="Co-Host / Guest">Co-Host / Guest</option>
                  <option value="3D Artist">3D Artist</option>
                  <option value="Gaming Streamer">Gaming Streamer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Description & Requirements
              </label>
              <textarea
                rows={2}
                required
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Describe what you are looking for..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowNewPostForm(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="gradient-btn-primary px-4 py-1.5 text-xs font-semibold text-white rounded-full cursor-pointer"
              >
                Publish Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Role Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-white/10 no-scrollbar">
        <span className="text-xs text-slate-400 font-medium mr-1 whitespace-nowrap">Filter:</span>
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer min-h-[28px] ${
              roleFilter === r
                ? 'bg-[#FF2E93] text-white'
                : isDarkMode
                ? 'bg-white/5 text-slate-300 hover:bg-white/10'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Collabs List (Clear, clean rows without heavy nested cards) */}
      <div className="space-y-3">
        {filteredCollabs.map((collab) => (
          <div
            key={collab.id}
            className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDarkMode
                ? 'bg-[#090E26]/70 border-white/10 hover:border-white/20'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <img
                src={collab.avatar}
                alt={collab.creatorName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-purple-500/40 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className={`font-bold text-xs sm:text-sm ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {collab.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                    {collab.neededRole}
                  </span>
                </div>
                <p
                  className={`mt-1 text-xs line-clamp-1 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {collab.description}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-400">
                  <span>by {collab.creatorName}</span>
                  <span>•</span>
                  <span>{collab.platform}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {collab.timeAgo}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => handleChatCreator(collab)}
                className="p-1.5 rounded-full border border-white/20 text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer min-h-[28px] min-w-[28px] flex items-center justify-center"
                title={`Chat with ${collab.creatorName}`}
              >
                <MessageSquare size={13} />
              </button>

              <button
                onClick={() => handlePitchCollab(collab)}
                className="gradient-btn-primary px-3.5 py-1 text-xs font-semibold text-white rounded-full flex items-center gap-1 shadow-xs cursor-pointer min-h-[28px]"
              >
                <span>Pitch</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
