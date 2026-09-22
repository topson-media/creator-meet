import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Clock,
  Trash2,
  Film,
  User,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_CREATORS } from '../data/sampleData';
import { SAMPLE_REELS } from '../data/sampleMedia';
import { INITIAL_POSTS } from '../data/samplePosts';
import { ProfileDetailsData } from '../components/UserProfileModal';
import { PageRoute } from '../types';

interface SearchPageProps {
  isDarkMode: boolean;
  onViewProfile?: (profile: ProfileDetailsData) => void;
  onNavigate?: (page: PageRoute) => void;
  onStartChat?: (user: { name: string; handle: string; avatar: string; role: 'creator' | 'fan' }) => void;
}

type UnifiedSearchResult =
  | {
      type: 'creator';
      id: string;
      title: string;
      subtitle: string;
      badgeText: string;
      avatar: string;
      raw: any;
    }
  | {
      type: 'reel';
      id: string;
      title: string;
      subtitle: string;
      badgeText: string;
      thumbnail: string;
      raw: any;
    }
  | {
      type: 'post';
      id: string;
      title: string;
      subtitle: string;
      badgeText: string;
      avatar: string;
      raw: any;
    };

export const SearchPage: React.FC<SearchPageProps> = ({
  isDarkMode,
  onViewProfile,
  onNavigate,
  onStartChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Recent searches list arranged from top to bottom
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Cinematography',
    'Elena Rostova',
    'Gaming Stream',
    'Blender 3D VFX',
    'Music Production',
  ]);

  const handleSelectRecent = (term: string) => {
    setSearchQuery(term);
  };

  const handleRemoveRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((item) => item !== term));
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const clean = searchQuery.trim();
    if (!recentSearches.includes(clean)) {
      setRecentSearches([clean, ...recentSearches.filter((item) => item !== clean).slice(0, 9)]);
    }
  };

  // Unified search results arranged in a single list from top to bottom
  const unifiedResults = useMemo<UnifiedSearchResult[]>(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();

    const results: UnifiedSearchResult[] = [];

    // Match creators
    SAMPLE_CREATORS.forEach((creator) => {
      if (
        creator.name.toLowerCase().includes(q) ||
        creator.handle.toLowerCase().includes(q) ||
        creator.category.toLowerCase().includes(q) ||
        creator.bio.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'creator',
          id: `creator-${creator.id}`,
          title: creator.name,
          subtitle: `${creator.handle} • ${creator.category}`,
          badgeText: creator.followers,
          avatar: creator.avatar,
          raw: creator,
        });
      }
    });

    // Match reels
    SAMPLE_REELS.forEach((reel) => {
      if (
        reel.caption.toLowerCase().includes(q) ||
        reel.authorName.toLowerCase().includes(q) ||
        reel.authorUsername.toLowerCase().includes(q) ||
        (reel.musicTitle && reel.musicTitle.toLowerCase().includes(q))
      ) {
        results.push({
          type: 'reel',
          id: `reel-${reel.id}`,
          title: reel.caption,
          subtitle: `Reel by ${reel.authorName} (@${reel.authorUsername})`,
          badgeText: `${reel.likesCount} Likes`,
          thumbnail: reel.thumbnailUrl || reel.authorAvatar,
          raw: reel,
        });
      }
    });

    // Match posts
    INITIAL_POSTS.forEach((post) => {
      if (
        post.content.toLowerCase().includes(q) ||
        post.authorName.toLowerCase().includes(q) ||
        post.authorUsername.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'post',
          id: `post-${post.id}`,
          title: post.content,
          subtitle: `Post by ${post.authorName} • ${post.createdAt}`,
          badgeText: `${post.likesCount} Likes`,
          avatar: post.authorAvatar,
          raw: post,
        });
      }
    });

    return results;
  }, [searchQuery]);

  return (
    <div id="search-page-container" className="py-6 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-6">
      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-4 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            autoFocus
            className={`w-full pl-11 pr-11 py-3 rounded-2xl text-sm font-medium border shadow-xs transition focus:outline-hidden focus:ring-2 focus:ring-[#FF2E93] ${
              isDarkMode
                ? 'bg-[#0B1028] border-white/15 text-white placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/10 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* When no query is typed: Display Recent Searches arranged from top to bottom */}
      {!searchQuery.trim() && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider text-[11px]">
              <Clock size={13} className="text-[#00D2FF]" />
              <span>Recent Searches</span>
            </h2>
            {recentSearches.length > 0 && (
              <button
                onClick={handleClearAllRecent}
                className="text-xs text-rose-400 hover:text-rose-500 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={12} />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {recentSearches.length > 0 ? (
            <div
              className={`rounded-2xl border overflow-hidden divide-y ${
                isDarkMode
                  ? 'bg-[#0B1028] border-white/10 divide-white/5'
                  : 'bg-white border-slate-200 divide-slate-100 shadow-xs'
              }`}
            >
              {recentSearches.map((term) => (
                <div
                  key={term}
                  onClick={() => handleSelectRecent(term)}
                  className={`flex items-center justify-between px-4 py-3.5 cursor-pointer transition ${
                    isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400">
                      <Clock size={15} />
                    </div>
                    <span className="text-sm font-medium truncate">{term}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveRecent(e, term)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition cursor-pointer"
                    title="Remove from recents"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`p-8 rounded-2xl border text-center ${
                isDarkMode ? 'bg-[#0B1028] border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <Clock size={28} className="mx-auto text-slate-400 mb-2 opacity-50" />
              <p className="text-xs text-slate-400">No recent searches yet</p>
            </div>
          )}
        </div>
      )}

      {/* When query is typed: Display search results arranged on a list from top to bottom */}
      {searchQuery.trim() && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400">
              {unifiedResults.length} {unifiedResults.length === 1 ? 'Result' : 'Results'} found
            </span>
          </div>

          {unifiedResults.length > 0 ? (
            <div
              className={`rounded-2xl border overflow-hidden divide-y ${
                isDarkMode
                  ? 'bg-[#0B1028] border-white/10 divide-white/5'
                  : 'bg-white border-slate-200 divide-slate-100 shadow-xs'
              }`}
            >
              {unifiedResults.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 flex items-center justify-between gap-3.5 transition ${
                    isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Left avatar or thumbnail */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {item.type === 'creator' && (
                      <div className="relative shrink-0">
                        <img
                          src={item.avatar}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#00D2FF]/30"
                        />
                        <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#00D2FF] text-black">
                          <User size={10} />
                        </div>
                      </div>
                    )}

                    {item.type === 'reel' && (
                      <div className="relative shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-black">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                          <Film size={14} />
                        </div>
                      </div>
                    )}

                    {item.type === 'post' && (
                      <div className="relative shrink-0">
                        <img
                          src={item.avatar}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-purple-500 text-white">
                          <MessageSquare size={10} />
                        </div>
                      </div>
                    )}

                    {/* Text Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold truncate">{item.title}</h3>
                        {item.type === 'creator' && (
                          <ShieldCheck size={14} className="text-[#00D2FF] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  {/* Right Action Button */}
                  <div className="shrink-0 flex items-center gap-2">
                    {item.type === 'creator' && (
                      <>
                        {onStartChat && (
                          <button
                            onClick={() =>
                              onStartChat({
                                name: item.raw.name,
                                handle: item.raw.handle,
                                avatar: item.raw.avatar,
                                role: 'creator',
                              })
                            }
                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-[#00D2FF] hover:text-black text-slate-400 transition cursor-pointer"
                            title="Message"
                          >
                            <Send size={14} />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            onViewProfile?.({
                              id: item.raw.id,
                              name: item.raw.name,
                              username: item.raw.handle.replace('@', ''),
                              avatar: item.raw.avatar,
                              role: 'creator',
                              verified: true,
                              bio: item.raw.bio,
                              category: item.raw.category,
                              country: item.raw.country,
                              flag: item.raw.flag,
                              followers: item.raw.followers,
                              platforms: item.raw.platforms,
                              coverImage: item.raw.coverImage,
                            })
                          }
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#FF2E93] text-[#FF2E93] hover:bg-[#FF2E93] hover:text-white transition cursor-pointer"
                        >
                          Profile
                        </button>
                      </>
                    )}

                    {item.type === 'reel' && onNavigate && (
                      <button
                        onClick={() => onNavigate('reels')}
                        className="gradient-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition cursor-pointer flex items-center gap-1"
                      >
                        <span>Watch</span>
                        <ArrowRight size={12} />
                      </button>
                    )}

                    {item.type === 'post' && onNavigate && (
                      <button
                        onClick={() => onNavigate('home')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:border-purple-400 transition cursor-pointer"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`p-10 rounded-2xl border text-center space-y-2 ${
                isDarkMode ? 'bg-[#0B1028] border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <Search size={28} className="mx-auto text-slate-400 opacity-60" />
              <p className="text-sm font-bold">No results found for "{searchQuery}"</p>
              <p className="text-xs text-slate-400">Try searching for a different keyword or creator name.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
