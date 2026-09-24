export type PageRoute =
  | 'home'
  | 'dashboard'
  | 'reels'
  | 'search'
  | 'discover'
  | 'notifications'
  | 'messages'
  | 'groups'
  | 'creators'
  | 'fans'
  | 'features'
  | 'about'
  | 'login'
  | 'signup'
  | 'profile'
  | 'settings'
  | 'monetization';

export type UserRole = 'creator' | 'fan';

export interface CreatorMonetizationState {
  contentMonetizationEnabled?: boolean;
  watchTimeHours?: number; // target: 4000
  reelViews90Days?: number; // target: 300000
  followersCount?: number; // target: 10000
  starsEnabled?: boolean;
  totalStarsReceived?: number;
  starBalanceUsd?: number;
  subscriptionEnabled?: boolean;
  subscriptionMonthlyPrice?: number; // user custom price per month
  subscriberCount?: number;
  totalEarningsUsd?: number;
  payoutMethod?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  accountType: UserRole;
  avatar: string;
  coverImage?: string;
  bio?: string;
  country?: string;
  flag?: string;
  category?: string;
  followersCount?: number;
  followingCount?: number;
  phoneNumber?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: 'email' | 'passkey' | 'sms' | 'whatsapp';
  twoFactorEmail?: string;
  twoFactorPasskeyId?: string;
  twoFactorPasskeyName?: string;
  twoFactorPhone?: string; // Stored in full E.164 format
  twoFactorCountryCode?: string; // ISO 2-letter code, e.g. 'RW'
  twoFactorBackupCodes?: string[];
  twoFactorVerifiedAt?: string;
  platforms?: {
    youtube?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    x?: string;
    website?: string;
  };
  isVerified?: boolean;
  verified?: boolean;
  blueTick?: boolean;
  subscriptionPlan?: 'free' | 'verified_creator' | 'elite_creator';
  verifiedAt?: string;
  monetization?: CreatorMonetizationState;
  createdAt: string;
  updatedAt?: string;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: UserRole;
  mediaUrl: string;
  mediaType?: 'image' | 'video';
  musicTitle?: string;
  musicUrl?: string;
  caption?: string;
  createdAt: string;
  viewsCount?: number;
  isUserStory?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: UserRole;
  authorBio?: string;
  authorCover?: string;
  authorCountry?: string;
  authorFlag?: string;
  authorPlatforms?: {
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    x?: string;
    website?: string;
  };
  verified?: boolean;
  content: string;
  mediaUrl?: string;
  mediaUrls?: string[];
  mediaType?: 'image' | 'video';
  musicTitle?: string;
  musicArtist?: string;
  musicUrl?: string;
  tags?: string[];
  category?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  hasLiked?: boolean;
  hasSaved?: boolean;
  collabOpen?: boolean;
  collabRole?: string;
  comments?: PostComment[];
}

export interface Reel {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: UserRole;
  authorCover?: string;
  authorBio?: string;
  verified?: boolean;
  videoUrl: string;
  videoUrls?: string[];
  thumbnailUrl?: string;
  caption: string;
  musicTitle?: string;
  musicUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  hasLiked?: boolean;
  hasSaved?: boolean;
  isFollowing?: boolean;
  tags?: string[];
  createdAt: string;
  comments?: PostComment[];
}

export interface GroupMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export interface GroupMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: UserRole;
  isOnline?: boolean;
}

export interface GroupJoinRequest {
  id: string;
  userId: string;
  name: string;
  username: string;
  avatar: string;
  role: UserRole;
  requestedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  avatar: string;
  coverImage?: string;
  memberCount: number;
  isPrivate?: boolean;
  createdBy: string;
  creatorId?: string;
  createdAt: string;
  members: GroupMember[];
  messages: GroupMessage[];
  pendingRequests?: GroupJoinRequest[];
  approvedMemberIds?: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage?: string;
  verified: boolean;
  roleBadge: string;
  accountType?: UserRole;
  isDemo?: boolean;
  country: string;
  flag: string;
  category: string;
  subCategory?: string;
  followers: string;
  bio: string;
  platforms: {
    youtube?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    x?: string;
    website?: string;
  };
  featuredPost?: {
    title: string;
    thumbnail: string;
    likes: string;
    comments: string;
    timeAgo: string;
  };
  openForCollabs: boolean;
  collabType?: string;
}

export interface CollabRequest {
  id: string;
  creatorName: string;
  handle: string;
  avatar: string;
  title: string;
  description: string;
  neededRole: string;
  budget?: string;
  platform: string;
  timeAgo: string;
  category: string;
  responsesCount: number;
  isDemo?: boolean;
}

export interface FanTestimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  quote: string;
  favoriteCreator: string;
}
