export type BattleCategory = 'dance' | 'singing' | 'genz_vs_millennial' | 'custom_debate' | 'debate' | 'comedy' | 'roasting' | 'clout';
export type BattleMediaMode = 'video' | 'audio_openmic';
export type BattleEntryType = 'free' | 'paid';

export interface Contender {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  photoUrl?: string;
  videoUrl?: string;
  generation: 'Gen Z' | 'Millennial' | 'Creator' | string;
  score: number;
  freeVotes: number;
  paidVotes: number;
  status: string;
  isSpeaking: boolean;
  videoActive: boolean;
  audioActive: boolean;
  quote: string;
  followers: string;
  cameraUnlocked?: boolean; // Unlocked camera when leading votes in audio mode
  isMicMuted?: boolean; // Mute / unmute microphone control
  isCameraOff?: boolean; // Camera on / off control
}

export interface BattleJudge {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  photoUrl?: string;
  type: 'organizer_elected' | 'public_elected' | 'ai_judge';
  scoreA: number; // 0-100
  scoreB: number; // 0-100
  notes?: string;
  designatedByOrganizer?: boolean;
}

export interface PredictionBet {
  id: string;
  userId: string;
  battleId: string;
  chosenContenderId: string;
  amount: number;
  odds: number;
  potentialPayout: number;
  status: 'pending' | 'won' | 'lost';
  timestamp: string;
}

export interface DreamBattle {
  id: string;
  title: string;
  category: BattleCategory;
  mode: BattleMediaMode;
  contender1Name: string;
  contender1Avatar: string;
  contender2Name: string;
  contender2Avatar: string;
  proposedBy: string;
  bountyPotCoins: number;
  upvotesCount: number;
  userUpvoted?: boolean;
  status: 'crowdfunding' | 'booked';
}

export interface BattleItem {
  id: string;
  title: string;
  category: BattleCategory;
  mode: BattleMediaMode;
  entryType: BattleEntryType;
  entryFee: number;
  prizePool: number;
  status: 'live' | 'upcoming' | 'judging' | 'completed';
  audienceCount: number;
  contenderA: Contender;
  contenderB: Contender;
  contenders?: Contender[]; // Supports 2, 3, or multiple battlers
  round: number;
  totalRounds: number;
  timeRemainingSeconds: number;
  topic?: string;
  customTheme?: string; // Customised discipline theme set by host/users
  commentsCount: number;
  stageBannerUrl?: string;
  stageVideoUrl?: string;
  
  // Host stream media controls
  isHostMicMuted?: boolean;
  isHostCameraOff?: boolean;

  // Audio battle auto-camera unlock
  cameraUnlockedContenderId?: string;
  cameraUnlockThreshold?: number; // e.g., reaching 20 votes or 55% lead
  
  // 50% Judges / 50% Public voting
  judges?: BattleJudge[];
  judgeSelectionMode?: 'organizer_elected' | 'auto_elected_public' | 'ai_panel';
  judgeWeightPercent?: number; // 50%
  publicWeightPercent?: number; // 50%
  combinedWinnerId?: string;

  // Prediction Betting
  betOddsA?: number; // e.g. 1.85
  betOddsB?: number; // e.g. 2.10
  totalBetsPot?: number;

  // AI Judge / Commentator
  aiFeedback?: {
    verdict: string;
    winnerId: string;
    rhymesAndRoastsScore: number;
    flowAndDeliveryScore: number;
    crowdImpactScore: number;
    rebuttalSharpness: number;
    highlights: string[];
  };

  // Host and Judge rules
  hostId?: string;
  hostName?: string;
  hostHandle?: string;
  isHostCompetitor?: boolean; // false if host is observer/moderator, true if host also competes
  votingRule?: 'fifty_fifty' | 'public_only' | 'judges_only';
  coverPhotoUrl?: string;

  // Battle rewards (20% Host, 80% shared between battlers)
  likesCount?: number;
  hostRewardCoins?: number;
  battlerARewardCoins?: number;
  battlerBRewardCoins?: number;
  rewardsDistributed?: boolean;
}

export interface PostComment {
  id: string;
  authorId?: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likesCount?: number;
  likes?: number;
  likedBy?: string[];
  likedByMe?: boolean;
}

export interface MediaPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorGeneration?: string;
  type: 'video' | 'music' | 'picture';
  title: string;
  description: string;
  category: BattleCategory | string;
  downloadType: 'free' | 'paid';
  downloadPrice?: number;
  downloadCoinsCost?: number; // e.g. 5 virtual coins
  downloadCount: number;
  likesCount: number;
  commentsCount: number;
  comments?: PostComment[];
  sharesCount: number;
  timestamp: string;
  mediaUrl?: string;
  photoUrl?: string;
  videoUrl?: string;
  previewUrl?: string;
  requiresFollowToUnlock?: boolean; // Follow-to-unlock full video/photo
  unlockedByUser?: boolean;
  duration?: string;
  durationSeconds?: number; // Up to 90 seconds for short videos
  fileSize?: string;
  fileFormat: string;
  tags?: string[];
  isRepost?: boolean;
  repostedBy?: string;
  repostedByHandle?: string;
  repostTimestamp?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    size: string;
    type: 'doc' | 'audio' | 'image' | 'video';
    url?: string;
    description?: string;
  };
  isVoiceNote?: boolean;
  voiceDuration?: string;
  reactions?: Record<string, number>;
  userReaction?: string;
  status?: 'sent' | 'delivered' | 'read';
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  battleInvite?: {
    battleId: string;
    title: string;
    stakes: number;
    category: BattleCategory;
    status: 'pending' | 'accepted' | 'declined';
  };
}

export interface ConversationMember {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: 'admin' | 'member';
  isOnline: boolean;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  handle?: string;
  avatar: string;
  status: string;
  isOnline?: boolean;
  membersCount?: number;
  members?: ConversationMember[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  sharedDocs?: Array<{
    name: string;
    size: string;
    type: 'doc' | 'audio';
    timestamp: string;
    url?: string;
  }>;
}

export interface BattleGroup {
  id: string;
  name: string;
  tagline: string;
  category: BattleCategory;
  avatar: string;
  status: string;
  membersCount: number;
  wins: number;
  losses: number;
  isRecruiting: boolean;
  nextBattleTime?: string;
}

export interface StatusRing {
  id: string;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  statusText: string;
  state: 'in_battle' | 'live_stream' | 'rehearsing' | 'open_duel';
  hasUnseenStory: boolean;
  storyMedia: {
    type: 'video' | 'picture' | 'audio';
    caption: string;
    timestamp: string;
    photoUrl?: string;
  };
}

export interface BattleRewardLog {
  id: string;
  date: string;
  title: string;
  type: 'battle_host_share' | 'battle_winner_share' | 'battle_contender_share' | 'content_sale' | 'battle_like_boost';
  role: 'host' | 'battler' | 'creator';
  coins: number;
  percentage?: number;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  profilePhotoUrl?: string; // Custom profile picture
  coverPhotoUrl?: string; // Custom profile cover picture
  generation: 'Gen Z' | 'Millennial' | 'Gen X' | 'Boomer' | 'Creator' | 'Pro Battler' | string;
  status: string;
  bio: string;
  battlesWon: number;
  battlesLost: number;
  winStreak: number;
  earnings: number;
  coins: number; // total combined virtual coins
  votingCoins: number; // monthly 100 coin allowance spent to vote on others
  creatorRewardCoins: number; // virtual rewards earned from battles & simulated content sales
  monthlyCoinsClaimed?: boolean;
  totalCoinsGained?: number;
  tierRank?: 'Rookie' | 'Rising Star' | 'Battle Veteran' | 'Hall of Fame Champion';
  socialProvider?: 'google' | 'instagram' | 'facebook' | 'tiktok' | 'whatsapp' | 'email';
  followers: number;
  following: number;
  followedCreatorHandles?: string[]; // for follow-to-unlock feature
  unlockedMediaIds?: string[]; // for 5-coin paid download simulation
  repostedPostIds?: string[]; // posts shared/reposted by user to their profile
  contentUnlocksCount?: number;
  simulatedSalesCount?: number;
  rewardHistory?: BattleRewardLog[];
  privacy: {
    allowDMsFrom: 'everyone' | 'followers' | 'squad';
    allowCallsFrom: 'everyone' | 'followers' | 'squad';
    allowPaidChallenges: boolean;
    showOnlineStatus: boolean;
  };
}
