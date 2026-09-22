import React, { useState } from 'react';
import { SAMPLE_CREATORS } from '../data/sampleData';
import { Creator } from '../types';
import { AccountBadge } from '../components/AccountBadge';
import {
  Search,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

interface DiscoverPageProps {
  isDarkMode: boolean;
  onSelectCreator: (creator: Creator) => void;
  onOpenCollabModal: (collabTitle?: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onRequireAuth?: (action: 'follow' | 'comment' | 'chat', targetName?: string) => boolean;
  onStartChat?: (user: { name: string; handle: string; avatar: string; role: 'creator' | 'fan' }) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  isDarkMode,
  onSelectCreator,
  onOpenCollabModal,
  onOpenAuth,
  onRequireAuth,
  onStartChat,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [collabsOnly, setCollabsOnly] = useState(false);
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Technology', 'Design & Art', 'Music', 'Gaming', 'Lifestyle'];

  const filteredCreators = SAMPLE_CREATORS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.country.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesCollab = !collabsOnly || c.openForCollabs;

    return matchesSearch && matchesCategory && matchesCollab;
  });

  const toggleFollow = (creator: Creator) => {
    if (onRequireAuth && !onRequireAuth('follow', creator.name)) {
      return;
    }
    setFollowedIds((prev) => ({ ...prev, [creator.id]: !prev[creator.id] }));
  };

  const handleChat = (creator: Creator) => {
    if (onRequireAuth && !onRequireAuth('chat', creator.name)) {
      return;
    }
    if (onStartChat) {
      onStartChat({
        name: creator.name,
        handle: creator.handle,
        avatar: creator.avatar,
        role: creator.accountType || 'creator',
      });
    }
  };

  const handlePitch = (creator: Creator) => {
    if (onRequireAuth && !onRequireAuth('chat', creator.name)) {
      return;
    }
    onOpenCollabModal(creator.collabType);
  };

  return (
    <div id="discover-page" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 text-center sm:text-left">
        <div
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-2 ${
            isDarkMode
              ? 'bg-[#12193E] text-[#00D2FF] border border-blue-500/30'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}
        >
          <Sparkles size={12} />
          <span>Creator Directory</span>
        </div>
        <h1
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          Discover Inspiring Creators
        </h1>
        <p
          className={`mt-1.5 text-xs sm:text-sm max-w-xl ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Connect, follow, and collaborate with verified creators from around the world.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-full border focus:outline-hidden ${
                isDarkMode
                  ? 'bg-slate-900/90 border-slate-700 text-white focus:border-[#00D2FF]'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-[#00D2FF]'
              }`}
            />
          </div>

          {/* Collab Toggle */}
          <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none self-start sm:self-auto">
            <input
              type="checkbox"
              checked={collabsOnly}
              onChange={(e) => setCollabsOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded-xs text-[#FF2E93] focus:ring-0 accent-[#FF2E93] cursor-pointer"
            />
            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
              Open for Collaborations
            </span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer min-h-[28px] ${
                selectedCategory === cat
                  ? 'bg-[#FF2E93] text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-2 border-b border-white/10">
        <span>Showing {filteredCreators.length} creators</span>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-[#00D2FF] hover:underline cursor-pointer"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Clean Creator Grid (Clear, uncluttered presentation) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCreators.map((creator) => {
          const isFollowed = followedIds[creator.id];
          return (
            <div
              key={creator.id}
              className={`rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between border ${
                isDarkMode
                  ? 'bg-[#090E26]/70 border-white/10 hover:border-white/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                {/* Header: Avatar, Name, Country */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-[#00D2FF]/40"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h3
                          className={`font-bold text-xs sm:text-sm ${
                            isDarkMode ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {creator.name}
                        </h3>
                        {creator.verified && (
                          <CheckCircle2 size={13} className="text-[#00D2FF]" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{creator.handle}</p>
                    </div>
                  </div>

                  <span className="text-xs" title={creator.country}>
                    {creator.flag}
                  </span>
                </div>

                {/* Role & Category */}
                <div className="flex items-center gap-1.5 mb-2">
                  <AccountBadge role="creator" size="sm" />
                  <span className="text-[11px] text-slate-400 font-medium ml-auto">
                    {creator.category}
                  </span>
                </div>

                {/* Bio */}
                <p
                  className={`text-xs line-clamp-2 leading-relaxed ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {creator.bio}
                </p>

                {/* Collab Indicator */}
                {creator.openForCollabs && (
                  <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 text-[10px] font-medium">
                    <span>Collab: {creator.collabType}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons - Attractive and Small */}
              <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => onSelectCreator(creator)}
                  className={`text-xs font-semibold py-1 px-2.5 rounded-full transition flex items-center gap-1 cursor-pointer min-h-[28px] ${
                    isDarkMode
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>Profile</span>
                  <ExternalLink size={11} />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleChat(creator)}
                    className="p-1.5 text-xs font-semibold rounded-full border border-white/20 text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer min-h-[28px] min-w-[28px] flex items-center justify-center"
                    title={`Chat with ${creator.name}`}
                  >
                    <MessageSquare size={13} />
                  </button>

                  {creator.openForCollabs && (
                    <button
                      onClick={() => handlePitch(creator)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-600 hover:bg-purple-500 text-white transition cursor-pointer min-h-[28px]"
                    >
                      Pitch
                    </button>
                  )}

                  <button
                    onClick={() => toggleFollow(creator)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition cursor-pointer min-h-[28px] ${
                      isFollowed
                        ? 'bg-slate-700 text-white'
                        : 'bg-[#0080FF] hover:bg-[#0070e0] text-white shadow-xs'
                    }`}
                  >
                    {isFollowed ? '✓ Following' : 'Follow'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
