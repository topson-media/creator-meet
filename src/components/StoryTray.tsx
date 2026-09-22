import React, { useRef } from 'react';
import { Story, UserProfile } from '../types';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface StoryTrayProps {
  stories: Story[];
  userProfile: UserProfile | null;
  onOpenAddStory: () => void;
  onSelectStory: (story: Story) => void;
  isDarkMode: boolean;
}

export const StoryTray: React.FC<StoryTrayProps> = ({
  stories,
  userProfile,
  onOpenAddStory,
  onSelectStory,
  isDarkMode,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const userAvatar =
    userProfile?.avatar ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

  const userStories = stories.filter((s) => s.isUserStory || s.authorId === userProfile?.id);
  const otherStories = stories.filter((s) => !s.isUserStory && s.authorId !== userProfile?.id);

  return (
    <div
      id="stories-section"
      className={`relative w-full rounded-2xl p-3 sm:p-4 border transition-colors ${
        isDarkMode
          ? 'bg-[#080D26]/80 border-white/10'
          : 'bg-white border-slate-200 shadow-xs'
      }`}
    >
      {/* Scroll left button */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll stories left"
        className={`hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full items-center justify-center backdrop-blur-md shadow-md transition cursor-pointer ${
          isDarkMode
            ? 'bg-black/60 text-white hover:bg-black/80'
            : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
        }`}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Stories horizontal container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1 px-1"
      >
        {/* 1. Add Story Button Card */}
        <button
          id="add-story-btn"
          onClick={onOpenAddStory}
          className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-hidden"
          title="Add a new story"
        >
          <div className="relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] border-2 border-dashed border-[#FF2E93] group-hover:border-[#00D2FF] transition-all flex items-center justify-center">
              <img
                src={userAvatar}
                alt="Your Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gradient-to-r from-[#FF2E93] to-[#7928CA] text-white flex items-center justify-center shadow-md ring-2 ${
              isDarkMode ? 'ring-[#080D26]' : 'ring-white'
            } group-hover:scale-110 transition`}>
              <Plus size={12} strokeWidth={3} />
            </div>
          </div>
          <span
            className={`text-[11px] font-semibold truncate max-w-[64px] text-center ${
              isDarkMode ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            Add Story
          </span>
        </button>

        {/* 2. User's Own Added Stories (if any) */}
        {userStories.map((story) => (
          <button
            key={story.id}
            onClick={() => onSelectStory(story)}
            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-hidden"
            title={`View your story`}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#00D2FF] via-[#7928CA] to-[#FF2E93] group-hover:scale-105 transition-all duration-300 shadow-md">
              <div className={`w-full h-full rounded-full p-[1.5px] ${isDarkMode ? 'bg-[#080D26]' : 'bg-white'}`}>
                <img
                  src={story.mediaUrl || userAvatar}
                  alt={story.authorName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#00D2FF] truncate max-w-[68px] text-center">
              Your Story
            </span>
          </button>
        ))}

        {/* 3. Other Creator Stories */}
        {otherStories.map((story) => (
          <button
            key={story.id}
            onClick={() => onSelectStory(story)}
            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-hidden"
            title={`View story from ${story.authorName}`}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#FF2E93] via-purple-500 to-[#00D2FF] group-hover:scale-105 transition-all duration-300 shadow-md">
              <div
                className={`w-full h-full rounded-full p-[1.5px] ${
                  isDarkMode ? 'bg-[#080D26]' : 'bg-white'
                }`}
              >
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span
              className={`text-[11px] font-semibold truncate max-w-[68px] text-center ${
                isDarkMode ? 'text-slate-300' : 'text-slate-800'
              }`}
            >
              {story.authorName.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Scroll right button */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll stories right"
        className={`hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full items-center justify-center backdrop-blur-md shadow-md transition cursor-pointer ${
          isDarkMode
            ? 'bg-black/60 text-white hover:bg-black/80'
            : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
        }`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
