import React, { useState, useEffect } from 'react';
import { PageRoute, Creator, CollabRequest, Story, Post, Reel } from './types';
import { SAMPLE_CREATORS, SAMPLE_COLLAB_REQUESTS } from './data/sampleData';
import { INITIAL_STORIES, INITIAL_POSTS } from './data/samplePosts';
import { SAMPLE_REELS } from './data/sampleMedia';
import { WelcomeAuthScreen } from './components/WelcomeAuthScreen';
import { SidebarNav } from './components/SidebarNav';
import { MobileHeader } from './components/MobileHeader';
import { HomeFeed } from './components/HomeFeed';
import { AddStoryModal } from './components/AddStoryModal';
import { StoryViewerModal } from './components/StoryViewerModal';
import { CreatePostModal } from './components/CreatePostModal';
import { CollabModal } from './components/CollabModal';
import { CreatorProfileModal } from './components/CreatorProfileModal';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { ChatModal } from './components/ChatModal';
import { DiscoverPage } from './pages/DiscoverPage';
import { CreatorsPage } from './pages/CreatorsPage';
import { FansPage } from './pages/FansPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { AboutPage } from './pages/AboutPage';
import { ReelsPage } from './components/ReelsPage';
import { GroupsPage } from './components/GroupsPage';
import { SearchPage } from './pages/SearchPage';
import { NotificationsPage } from './components/NotificationsPage';
import { MessagesPage } from './components/MessagesPage';
import { UserProfileModal, ProfileDetailsData } from './components/UserProfileModal';
import { CollabCallModal } from './components/CollabCallModal';
import { EmailVerificationScreen } from './components/EmailVerificationScreen';
import { AccountTypeSelectionModal } from './components/AccountTypeSelectionModal';
import { MonetizationPage } from './pages/MonetizationPage';
import { VerifiedBadgeModal } from './components/VerifiedBadgeModal';
import { useAuth } from './context/AuthContext';

export default function App() {
  // 1. PRIMARY DEFAULT THEME: Light Mode as requested!
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Active page route (default is 'home')
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');

  // Stories, Posts, and Reels State (persists and appends dynamically)
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [reels, setReels] = useState<Reel[]>(SAMPLE_REELS);

  // Active modals
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [selectedCollab, setSelectedCollab] = useState<CollabRequest | null>(null);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [isCollabCallModalOpen, setIsCollabCallModalOpen] = useState(false);
  const [isVerifiedModalOpen, setIsVerifiedModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Unread indicator state for navigation items (Messages, Notifications)
  const [unreadSections, setUnreadSections] = useState<Record<string, boolean>>({
    messages: true,
    notifications: true,
  });

  // Creator or Fan detailed profile modal (cover, avatar, social links, follow/unfollow, message)
  const [selectedDetailedProfile, setSelectedDetailedProfile] = useState<ProfileDetailsData | null>(null);

  // Direct Chat Modal State
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<{
    name: string;
    handle: string;
    avatar: string;
    role: 'creator' | 'fan';
  }>({
    name: 'Topson Media',
    handle: '@topsonmedia',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    role: 'creator',
  });

  const {
    currentUser,
    userProfile,
    logout,
    updateProfile,
    isEmailVerified,
    pendingGoogleUser,
    completeGoogleRegistration,
    emailActionNotification,
    clearEmailActionNotification,
  } = useAuth();

  // Sync hash routing if any
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').replace('/', '') as PageRoute;
      if (
        [
          'home',
          'dashboard',
          'discover',
          'creators',
          'fans',
          'features',
          'about',
          'reels',
          'groups',
          'search',
          'notifications',
          'messages',
          'profile',
          'settings',
          'monetization',
        ].includes(hash)
      ) {
        setCurrentPage(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync HTML theme class and body colors
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#060919';
      document.body.style.color = '#FFFFFF';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F8FAFC';
      document.body.style.color = '#0F172A';
    }
  }, [isDarkMode]);

  // Toast notification for actions
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNavigate = (page: PageRoute) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (unreadSections[page]) {
      setUnreadSections((prev) => ({ ...prev, [page]: false }));
    }
  };

  // Handler for adding a new Story
  const handleAddStory = (newStory: Story) => {
    setStories((prev) => [newStory, ...prev]);
    showToast('Your story has been published to the story bar! ✨');
  };

  // Handler for sharing a post to user's story
  const handleSharePostToStory = (post: Post) => {
    const newStory: Story = {
      id: `story-shared-${Date.now()}`,
      authorId: userProfile?.id || 'me',
      authorName: userProfile?.fullName || 'You',
      authorUsername: userProfile?.username || 'you',
      authorAvatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      authorRole: userProfile?.role || 'creator',
      mediaUrl: post.mediaUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      mediaType: post.mediaType || 'image',
      caption: `Shared post from @${post.authorUsername}: ${post.content.slice(0, 60)}...`,
      createdAt: 'Just now',
      viewsCount: 1,
      isUserStory: true,
    };
    setStories((prev) => [newStory, ...prev]);
    showToast('Shared to your story successfully! 🌟');
  };

  // Handler for adding a new Post
  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    setCurrentPage('home');
    showToast('Your post has been published to the home feed! 🚀');
  };

  // Handler for liking a post
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newHasLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked: newHasLiked,
            likesCount: newHasLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );
  };

  // Handler for adding a comment to a post
  const handleAddComment = (postId: string, text: string) => {
    const comment = {
      id: `comment-${Date.now()}`,
      authorName: userProfile?.fullName || 'You',
      authorUsername: userProfile?.username || 'you',
      authorAvatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      authorRole: userProfile?.role || 'creator',
      content: text,
      createdAt: 'Just now',
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: (post.commentsCount || 0) + 1,
            comments: [...(post.comments || []), comment],
          };
        }
        return post;
      })
    );
    showToast('Comment posted! 💬');
  };

  const handleStartChat = (user: { name: string; handle: string; avatar: string; role: 'creator' | 'fan' }) => {
    setChatRecipient(user);
    setChatModalOpen(true);
  };

  const handleOpenCollabModal = (collabOrTitle?: CollabRequest | string) => {
    if (typeof collabOrTitle === 'object' && collabOrTitle !== null) {
      setSelectedCollab(collabOrTitle);
    } else {
      setSelectedCollab(SAMPLE_COLLAB_REQUESTS[0]);
    }
    setIsCollabModalOpen(true);
  };

  // -------------------------------------------------------------
  // VIEW 1A: NEW GOOGLE USER ROLE SELECTION (Requirement 10)
  // -------------------------------------------------------------
  if (pendingGoogleUser) {
    return (
      <AccountTypeSelectionModal
        user={pendingGoogleUser}
        isDarkMode={isDarkMode}
        onSelectRole={async (role) => {
          const res = await completeGoogleRegistration(role);
          if (res.success) {
            showToast('Welcome to Creator Meet! Account setup complete. ✨');
            setCurrentPage('home');
          } else {
            showToast(res.error || 'Failed to complete registration.');
          }
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // VIEW 1B: BEFORE USER LOGS IN (VISITOR STATE)
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div id="welcome-auth-viewport">
        <WelcomeAuthScreen
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onAuthSuccess={() => {
            window.location.hash = 'home';
            setCurrentPage('home');
            showToast('Welcome to Creator Meet!');
          }}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 1C: EMAIL VERIFICATION GATE (Requirement 4 & 7)
  // "Do not allow the user to fully access the Creator Meet account until the email has been verified."
  // -------------------------------------------------------------
  if (!isEmailVerified) {
    return (
      <EmailVerificationScreen
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onVerifiedSuccess={() => {
          showToast('Email verified successfully! Welcome to Creator Meet. ✨');
          setCurrentPage('home');
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AFTER USER LOGS IN (AUTHENTICATED APPLICATION STATE)
  // "after user created account and log into in will look home page and navigations put tham in left side"
  // "and put where to add story and where to display added story"
  // "and on home create where posts will displayed, add create button that will allow creator to post a content"
  // -------------------------------------------------------------
  return (
    <div
      id="app-main-layout"
      className={`min-h-screen flex flex-col md:flex-row font-sans selection:bg-[#FF2E93] selection:text-white transition-colors duration-200 ${
        isDarkMode ? 'bg-[#060919] text-white' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="app-toast-notification"
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500 text-white font-medium text-xs shadow-2xl flex items-center gap-2 animate-fade-in"
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Email Action Notification Banner (e.g. from email verification link) */}
      {emailActionNotification && (
        <div
          id="email-action-notification-banner"
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold shadow-2xl flex items-center justify-between gap-3 animate-fade-in ${
            emailActionNotification.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          <span>{emailActionNotification.message}</span>
          <button
            onClick={clearEmailActionNotification}
            className="p-1 rounded-full hover:bg-white/20 cursor-pointer ml-2 text-xs shrink-0"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Left Sidebar Navigation */}
      <SidebarNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        userProfile={userProfile}
        onLogout={logout}
        onOpenCreatePost={() => setIsCreatePostModalOpen(true)}
        onOpenProfile={() => handleNavigate('profile')}
        unreadMap={unreadSections}
      />

      {/* Mobile Header for smaller screens */}
      <MobileHeader
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        userProfile={userProfile}
        onLogout={logout}
        onOpenCreatePost={() => setIsCreatePostModalOpen(true)}
        onOpenProfile={() => handleNavigate('profile')}
        unreadMap={unreadSections}
      />

      {/* 2. Main Content Area */}
      <main
        className={`flex-1 min-w-0 ${
          currentPage === 'reels' || currentPage === 'messages'
            ? 'h-screen overflow-hidden'
            : 'overflow-y-auto min-h-screen pb-12'
        }`}
      >
        {(currentPage === 'home' || currentPage === 'dashboard') && (
          <HomeFeed
            stories={stories}
            posts={posts}
            reels={reels}
            userProfile={userProfile}
            onOpenAddStory={() => setIsAddStoryModalOpen(true)}
            onSelectStory={(s) => setSelectedStory(s)}
            onOpenCreatePost={() => setIsCreatePostModalOpen(true)}
            onOpenCollabCall={() => setIsCollabCallModalOpen(true)}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onSelectCreator={(c) => {
              setSelectedDetailedProfile({
                id: c.id,
                name: c.name,
                username: c.handle.replace('@', ''),
                avatar: c.avatar,
                role: 'creator',
                verified: true,
                bio: c.bio,
                category: c.category,
                flag: c.flag,
                country: c.country,
                followers: c.followers,
                platforms: c.platforms,
                coverImage: c.coverImage,
              });
            }}
            onStartChatWithAuthor={handleStartChat}
            onViewAuthorProfile={(profile) => setSelectedDetailedProfile(profile)}
            onShareToStory={handleSharePostToStory}
            onOpenVerifiedModal={() => setIsVerifiedModalOpen(true)}
            isDarkMode={isDarkMode}
          />
        )}

        {currentPage === 'reels' && (
          <ReelsPage
            userProfile={userProfile}
            isDarkMode={isDarkMode}
            onViewProfile={(profile) => setSelectedDetailedProfile(profile)}
            onStartChat={handleStartChat}
            onRequireAuth={() => true}
          />
        )}

        {currentPage === 'search' && (
          <SearchPage
            isDarkMode={isDarkMode}
            onViewProfile={(profile) => setSelectedDetailedProfile(profile)}
            onNavigate={handleNavigate}
            onStartChat={handleStartChat}
          />
        )}

        {currentPage === 'notifications' && (
          <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <NotificationsPage
              userProfile={userProfile}
              isDarkMode={isDarkMode}
              onNavigate={handleNavigate}
              onViewProfile={(profile) => setSelectedDetailedProfile(profile)}
            />
          </div>
        )}

        {currentPage === 'messages' && (
          <MessagesPage
            userProfile={userProfile}
            isDarkMode={isDarkMode}
            onViewProfile={(profile) => setSelectedDetailedProfile(profile)}
          />
        )}

        {currentPage === 'groups' && (
          <GroupsPage
            userProfile={userProfile}
            isDarkMode={isDarkMode}
            onViewProfile={(profile) => setSelectedDetailedProfile(profile)}
            onStartChat={handleStartChat}
          />
        )}

        {currentPage === 'discover' && (
          <div className="max-w-6xl mx-auto p-4 sm:p-6">
            <DiscoverPage
              isDarkMode={isDarkMode}
              onSelectCreator={(c) => {
                setSelectedDetailedProfile({
                  id: c.id,
                  name: c.name,
                  username: c.handle.replace('@', ''),
                  avatar: c.avatar,
                  role: 'creator',
                  verified: true,
                  bio: c.bio,
                  category: c.category,
                  flag: c.flag,
                  country: c.country,
                  followers: c.followers,
                  platforms: c.platforms,
                  coverImage: c.coverImage,
                });
              }}
              onOpenCollabModal={(title) => handleOpenCollabModal(title)}
              onOpenAuth={() => {}}
              onRequireAuth={() => true}
              onStartChat={handleStartChat}
            />
          </div>
        )}

        {currentPage === 'creators' && (
          <div className="max-w-6xl mx-auto p-4 sm:p-6">
            <CreatorsPage
              isDarkMode={isDarkMode}
              onOpenCollabModal={(c) => handleOpenCollabModal(c)}
              onSelectCreator={(c) => {
                setSelectedDetailedProfile({
                  id: c.id,
                  name: c.name,
                  username: c.handle.replace('@', ''),
                  avatar: c.avatar,
                  role: 'creator',
                  verified: true,
                  bio: c.bio,
                  category: c.category,
                  flag: c.flag,
                  country: c.country,
                  followers: c.followers,
                  platforms: c.platforms,
                  coverImage: c.coverImage,
                });
              }}
              onOpenAuth={() => {}}
              onRequireAuth={() => true}
              onStartChat={handleStartChat}
            />
          </div>
        )}

        {currentPage === 'fans' && (
          <div className="max-w-6xl mx-auto p-4 sm:p-6">
            <FansPage
              isDarkMode={isDarkMode}
              onOpenAuth={() => {}}
              onNavigate={handleNavigate}
              onRequireAuth={() => true}
              onStartChat={handleStartChat}
              onViewProfile={(profile) => setSelectedDetailedProfile(profile)}
            />
          </div>
        )}

        {currentPage === 'features' && (
          <div className="max-w-6xl mx-auto p-4 sm:p-6">
            <FeaturesPage
              isDarkMode={isDarkMode}
              onOpenAuth={() => {}}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {currentPage === 'about' && (
          <div className="max-w-6xl mx-auto p-4 sm:p-6">
            <AboutPage
              isDarkMode={isDarkMode}
              onOpenAuth={() => {}}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            isDarkMode={isDarkMode}
            posts={posts}
            reels={reels}
            onNavigate={handleNavigate}
            onLikePost={handleLikePost}
            onOpenCreatePost={() => setIsCreatePostModalOpen(true)}
            onOpenVerifiedModal={() => setIsVerifiedModalOpen(true)}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          />
        )}

        {currentPage === 'settings' && (
          <SettingsPage
            isDarkMode={isDarkMode}
            onNavigate={handleNavigate}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          />
        )}

        {currentPage === 'monetization' && (
          <MonetizationPage
            userProfile={userProfile}
            isDarkMode={isDarkMode}
            onNavigate={handleNavigate}
            onOpenVerifiedModal={() => setIsVerifiedModalOpen(true)}
            onUpgradeToCreator={async () => {
              await updateProfile({ role: 'creator', accountType: 'creator' });
              showToast('🎉 Your account has been upgraded to Creator! Monetization methods are now unlocked.');
            }}
          />
        )}
      </main>

      {/* 3. Modals */}
      {/* Add Story Modal */}
      <AddStoryModal
        isOpen={isAddStoryModalOpen}
        onClose={() => setIsAddStoryModalOpen(false)}
        userProfile={userProfile}
        onAddStory={handleAddStory}
        isDarkMode={isDarkMode}
      />

      {/* Story Viewer Modal */}
      <StoryViewerModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
        onViewAuthorProfile={(profile) => setSelectedDetailedProfile(profile)}
        isDarkMode={isDarkMode}
      />

      {/* Comprehensive Creator / Fan Profile Modal */}
      <UserProfileModal
        isOpen={selectedDetailedProfile !== null}
        onClose={() => setSelectedDetailedProfile(null)}
        profile={selectedDetailedProfile}
        isDarkMode={isDarkMode}
        onStartChat={(target) => {
          setSelectedDetailedProfile(null);
          handleStartChat(target);
        }}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        userProfile={userProfile}
        onAddPost={handleAddPost}
        isDarkMode={isDarkMode}
      />

      {/* Collab Modal */}
      <CollabModal
        isOpen={isCollabModalOpen}
        onClose={() => setIsCollabModalOpen(false)}
        collab={selectedCollab}
        isDarkMode={isDarkMode}
      />

      {/* Collab Call Modal (Face-to-face live call with followers and viewers) */}
      <CollabCallModal
        isOpen={isCollabCallModalOpen}
        onClose={() => setIsCollabCallModalOpen(false)}
        userProfile={userProfile}
        isDarkMode={isDarkMode}
      />

      {/* Creator Profile Modal */}
      <CreatorProfileModal
        isOpen={selectedCreator !== null}
        onClose={() => setSelectedCreator(null)}
        creator={selectedCreator}
        isDarkMode={isDarkMode}
        onOpenCollabModal={() => {
          setSelectedCreator(null);
          handleOpenCollabModal();
        }}
        onRequireAuth={() => true}
        onStartChat={handleStartChat}
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        targetUser={chatRecipient}
        isDarkMode={isDarkMode}
      />

      {/* Verified Creator Badge Modal (Blue Tick Pass) */}
      <VerifiedBadgeModal
        isOpen={isVerifiedModalOpen}
        onClose={() => setIsVerifiedModalOpen(false)}
        userProfile={userProfile}
        isDarkMode={isDarkMode}
        onOpenAuth={() => {}}
        onViewProfile={() => handleNavigate('profile')}
        onVerifiedSuccess={async () => {
          await updateProfile({ isVerified: true, verified: true, blueTick: true });
          showToast('🎉 Blue Tick verified badge activated on your profile!');
        }}
      />
    </div>
  );
}
