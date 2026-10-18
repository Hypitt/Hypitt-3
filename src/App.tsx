import React, { useState } from 'react';
import { BattleNavbar } from './components/battle/BattleNavbar';
import { HomeView } from './components/battle/HomeView';
import { BattleArenaView } from './components/battle/BattleArenaView';
import { CreateView } from './components/battle/CreateView';
import { MediaFeedView } from './components/battle/MediaFeedView';
import { MessagesCallsView } from './components/battle/MessagesCallsView';
import { GroupsView } from './components/battle/GroupsView';
import { ProfileView } from './components/battle/ProfileView';
import { SearchView } from './components/battle/SearchView';
import { CreateBattleModal } from './components/battle/CreateBattleModal';
import { CallOverlay } from './components/battle/CallOverlay';
import { AuthModal } from './components/battle/AuthModal';
import { UserProfileModal } from './components/battle/UserProfileModal';
import {
  INITIAL_USER,
  INITIAL_BATTLES,
  INITIAL_POSTS,
  INITIAL_GROUPS,
  INITIAL_CONVERSATIONS,
  INITIAL_STATUS_RINGS,
  INITIAL_DREAM_BATTLES
} from './data/battleData';
import { BattleItem, MediaPost, UserProfile, StatusRing, DreamBattle, PostComment } from './types/battleTypes';
import { Share2, Users, Check, Copy, X, Sparkles, Gift } from 'lucide-react';
import { sounds } from './utils/soundEffects';
import { Language, TRANSLATIONS } from './utils/i18n';

export default function App() {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('arena_preferred_lang');
      if (saved === 'fr' || saved === 'en') return saved;
    } catch {}
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('arena_preferred_lang', lang);
    } catch {}
  };

  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('arena_current_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_USER;
  });

  const [statusRings, setStatusRings] = useState<StatusRing[]>(INITIAL_STATUS_RINGS);
  const [battles, setBattles] = useState<BattleItem[]>(INITIAL_BATTLES);
  const [selectedBattleId, setSelectedBattleId] = useState<string>(INITIAL_BATTLES[0].id);
  const [posts, setPosts] = useState<MediaPost[]>(INITIAL_POSTS);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [dreamBattles, setDreamBattles] = useState<DreamBattle[]>(INITIAL_DREAM_BATTLES);

  // Social Invite Modal (Pull in users from WhatsApp, Instagram, TikTok, Facebook)
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [inviteCopied, setInviteCopied] = useState<boolean>(false);
  const [socialBonusNotice, setSocialBonusNotice] = useState<string | null>(null);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Modals & Overlays
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedCreatorProfile, setSelectedCreatorProfile] = useState<any | null>(null);
  const [activeCall, setActiveCall] = useState<{
    callType: 'audio' | 'video';
    targetName: string;
    isGroup: boolean;
  } | null>(null);

  const handleViewCreatorProfile = (creator: any) => {
    sounds.playVineBoom();
    setSelectedCreatorProfile(creator);
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('arena_current_user');
    } catch {}
  };

  // User State Handlers
  const handleUpdateStatus = (newStatus: string) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    setUser((prev) => (prev ? { ...prev, status: newStatus } : null));
    setStatusRings((prev) =>
      prev.map((ring) =>
        ring.creatorHandle === user.handle
          ? { ...ring, statusText: newStatus }
          : ring
      )
    );
  };

  const handleAddStatusRing = (newRing: StatusRing) => {
    setStatusRings((prev) => [newRing, ...prev.filter((r) => r.creatorHandle !== newRing.creatorHandle)]);
  };

  // Coin Economy Handler (Separated Balances: Voting Coins vs Creator Reward Coins)
  const handleUpdateUserCoins = (delta: number) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    setUser((prev) => {
      if (!prev) return null;
      if (delta < 0) {
        // Spending coins (voting, super votes, or content unlocks)
        const spend = Math.abs(delta);
        const curVoting = prev.votingCoins ?? 100;
        const newVoting = Math.max(0, curVoting - spend);
        const newTotal = Math.max(0, prev.coins + delta);
        const updated = {
          ...prev,
          coins: newTotal,
          votingCoins: newVoting,
        };
        try {
          localStorage.setItem('arena_current_user', JSON.stringify(updated));
        } catch {}
        return updated;
      } else {
        // Gaining virtual rewards (battle rewards, tips, engagement)
        const curRewards = prev.creatorRewardCoins ?? 0;
        const newRewards = curRewards + delta;
        const newTotal = prev.coins + delta;
        const updated = {
          ...prev,
          coins: newTotal,
          creatorRewardCoins: newRewards,
          totalCoinsGained: (prev.totalCoinsGained ?? 0) + delta,
        };
        try {
          localStorage.setItem('arena_current_user', JSON.stringify(updated));
        } catch {}
        return updated;
      }
    });
  };

  const handleRechargeCoins = (amount: number) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    handleUpdateUserCoins(amount);
  };

  // Claim Monthly Coins Allowance (+100 Virtual Voting Coins)
  const handleClaimMonthlyCoins = () => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    sounds.playCheer();
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        coins: prev.coins + 100,
        votingCoins: (prev.votingCoins ?? 0) + 100,
        monthlyCoinsClaimed: true,
      };
      try {
        localStorage.setItem('arena_current_user', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setSocialBonusNotice(
      language === 'fr'
        ? 'Allocation mensuelle de 100 pièces de vote réclamée ! Dépensez 1 pièce par vote régulier ou 5/10 pièces pour les SuperVotes.'
        : 'Claimed 100 Monthly Voting Coins! Spend 1 coin per regular vote or 5/10 coins for SuperVotes.'
    );
    setTimeout(() => setSocialBonusNotice(null), 5000);
  };

  // Add Battle Reward Log & Credit Creator Reward Coins
  const handleAddRewardLog = (log: any) => {
    if (!user) return;
    sounds.playCheer();
    setUser((prev) => {
      if (!prev) return null;
      const currentHistory = prev.rewardHistory || [];
      const updated = {
        ...prev,
        coins: prev.coins + (log.coins || 0),
        creatorRewardCoins: (prev.creatorRewardCoins || 0) + (log.coins || 0),
        rewardHistory: [log, ...currentHistory],
      };
      try {
        localStorage.setItem('arena_current_user', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Follow-to-Unlock Creator Toggle
  const handleToggleFollowCreator = (creatorHandle: string) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    sounds.playCheer();
    setUser((prev) => {
      if (!prev) return null;
      const list = prev.followedCreatorHandles || [];
      const isFollowing = list.includes(creatorHandle);
      const updatedList = isFollowing
        ? list.filter((h) => h !== creatorHandle)
        : [...list, creatorHandle];
      const updated = {
        ...prev,
        followedCreatorHandles: updatedList,
        following: isFollowing ? Math.max(0, prev.following - 1) : prev.following + 1,
      };
      try {
        localStorage.setItem('arena_current_user', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 5-Coin Simulated Media Unlock
  const handleUnlockMedia = (postId: string, costCoins: number, creatorHandle?: string) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    handleUpdateUserCoins(-costCoins);
    setUser((prev) => {
      if (!prev) return null;
      const unlocked = prev.unlockedMediaIds || [];
      if (unlocked.includes(postId)) return prev;

      const newLog = {
        id: `rew_sale_${Date.now()}`,
        date: language === 'fr' ? 'À l’instant' : 'Just now',
        title: language === 'fr' ? 'Déblocage de Contenu (5 Pièces)' : 'Simulated Content Unlock (5 Coins)',
        type: 'content_sale' as const,
        role: 'creator' as const,
        coins: costCoins,
        description: language === 'fr'
          ? `Déblocage simulé de photo/vidéo pour ${costCoins} pièces de ${creatorHandle || 'créateur'}`
          : `Simulated 5-coin unlock download for ${costCoins} coins from ${creatorHandle || 'creator'}`,
      };

      const updated = {
        ...prev,
        unlockedMediaIds: [...unlocked, postId],
        contentUnlocksCount: (prev.contentUnlocksCount || 0) + 1,
        simulatedSalesCount: (prev.simulatedSalesCount || 0) + 1,
        rewardHistory: [newLog, ...(prev.rewardHistory || [])],
      };
      try {
        localStorage.setItem('arena_current_user', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleUpdateUserProfile = (updatedUser: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updatedUser };
      try {
        localStorage.setItem('arena_current_user', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleShareToProfile = (post: MediaPost) => {
    sounds.playCheer();
    const repost: MediaPost = {
      ...post,
      id: `repost_${Date.now()}`,
      isRepost: true,
      repostedBy: user?.name || 'Alex Rivera',
      repostedByHandle: user?.handle || '@alex_battler',
      timestamp: language === 'fr' ? 'Republié à l’instant' : 'Reposted just now',
    };
    setPosts((prev) => [repost, ...prev]);
    setUser((prev) => {
      if (!prev) return null;
      const repostedIds = [...(prev.repostedPostIds || []), post.id];
      const next = { ...prev, repostedPostIds: repostedIds };
      try {
        localStorage.setItem('arena_current_user', JSON.stringify(next));
      } catch {}
      return next;
    });
    setSocialBonusNotice(
      language === 'fr'
        ? `"${post.title}" a été partagé sur votre profil !`
        : `"${post.title}" shared to your profile feed!`
    );
    setTimeout(() => setSocialBonusNotice(null), 3000);
  };

  // Battle Handlers
  const handleCreateBattle = (newBattle: BattleItem) => {
    setBattles([newBattle, ...battles]);
    setSelectedBattleId(newBattle.id);
    setActiveTab('battles');
    setShowCreateModal(false);
  };

  const handleJoinBattle = (battleId: string) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }

    const battle = battles.find((b) => b.id === battleId);
    if (!battle) return;

    if (battle.entryType === 'paid') {
      const fee = battle.entryFee || 15;
      if (user.coins < fee) {
        setSocialBonusNotice(
          language === 'fr'
            ? `Vous avez besoin de ${fee} pièces pour entrer dans cette compétition payante.`
            : `Need ${fee} Coins to join this paid competition pot.`
        );
        setTimeout(() => setSocialBonusNotice(null), 4000);
        return;
      }
      handleUpdateUserCoins(-fee);
    }

    // Step into contender slot immutably
    setBattles((prev) =>
      prev.map((b) =>
        b.id === battleId
          ? {
              ...b,
              contenderB: {
                id: user.id,
                name: user.name,
                handle: user.handle,
                avatar: user.avatar,
                generation: user.generation,
                score: 50,
                freeVotes: 0,
                paidVotes: 0,
                status: 'Live On Stage · Hot Mic',
                isSpeaking: true,
                videoActive: b.mode === 'video',
                audioActive: true,
                quote: 'Stepped onto the stage to compete live.',
                followers: `${(user.followers / 1000).toFixed(1)}k`,
              },
            }
          : b
      )
    );

    handleUpdateStatus(`In Live Competition: ${battle.title.slice(0, 30)}...`);
    setSocialBonusNotice(
      language === 'fr'
        ? `Vous êtes désormais sur scène dans "${battle.title}" !`
        : `You stepped on stage in "${battle.title}"!`
    );
    setTimeout(() => setSocialBonusNotice(null), 4000);
  };

  // Direct message / Challenge triggers
  const handleChallengeCreator = (_creatorName: string) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    setActiveTab('create');
  };

  const handleSendDM = (creatorName: string) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    const matched = conversations.find((c) =>
      c.name.toLowerCase().includes(creatorName.toLowerCase())
    );
    if (matched) {
      setActiveConvId(matched.id);
    }
    setActiveTab('messages');
  };

  // Media Handlers
  const handleAddPost = (newPost: MediaPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleDownloadPostFromSearch = (post: MediaPost) => {
    const cost = post.downloadCoinsCost || (post.downloadType === 'paid' ? 5 : 0);
    if (post.downloadType === 'paid') {
      if (!user) {
        handleOpenAuth('login');
        return;
      }
      if (user.coins < cost) {
        setSocialBonusNotice(
          language === 'fr'
            ? `Besoin de ${cost} pièces pour ce téléchargement. Réclamez vos pièces mensuelles dans votre profil !`
            : `Need ${cost} Coins for this download. You have ${user.coins} Coins. Claim monthly allowance in profile!`
        );
        setTimeout(() => setSocialBonusNotice(null), 4000);
        return;
      }
      handleUpdateUserCoins(-cost);
      sounds.playCheer();
      setSocialBonusNotice(`Unlocked ${post.title} (${cost} coins). Simulated download complete.`);
      setTimeout(() => setSocialBonusNotice(null), 4000);
    } else {
      sounds.playVineBoom();
      setSocialBonusNotice(`Downloaded ${post.title} for free!`);
      setTimeout(() => setSocialBonusNotice(null), 4000);
    }
  };

  // Dream Battle Handlers
  const handleUpvoteDreamBattle = (id: string) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    sounds.playCheer();
    setDreamBattles((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              upvotesCount: d.userUpvoted ? d.upvotesCount - 1 : d.upvotesCount + 1,
              userUpvoted: !d.userUpvoted,
            }
          : d
      )
    );
  };

  const handleCreateDreamBattle = (newDream: DreamBattle) => {
    if (user && user.coins >= newDream.bountyPotCoins) {
      handleUpdateUserCoins(-newDream.bountyPotCoins);
    }
    setDreamBattles([newDream, ...dreamBattles]);
    setSocialBonusNotice(`Dream Battle "${newDream.title}" submitted to public crowdfunding pot!`);
    setTimeout(() => setSocialBonusNotice(null), 5000);
  };

  // Social Invite Handler (Pull in friends from WhatsApp, TikTok, Instagram, Facebook)
  const handleSharePlatform = (platform: 'whatsapp' | 'instagram' | 'tiktok' | 'facebook' | 'copy') => {
    const inviteUrl = window.location.origin;
    const shareText = `Join me on ARENA for live dance, open-mic singing, roasts & rap battles! Use my link to claim 500 welcome coins: ${inviteUrl}`;

    sounds.playCheer();

    if (platform === 'whatsapp') {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    } else if (platform === 'facebook') {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}&quote=${encodeURIComponent(shareText)}`;
      window.open(fbUrl, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard?.writeText(shareText);
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2500);
    }

    // Award +100 Coins for pulling in users!
    if (user) {
      handleUpdateUserCoins(100);
      setSocialBonusNotice(`Bonus Awarded: +100 Coins for inviting friends from ${platform.toUpperCase()}!`);
      setTimeout(() => setSocialBonusNotice(null), 5000);
    }
  };

  // Call Handlers
  const handleStartCall = (callType: 'audio' | 'video', targetName: string, isGroup: boolean) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    setActiveCall({ callType, targetName, isGroup });
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col font-sans selection:bg-zinc-900 selection:text-white pb-16 lg:pb-0">
      {/* 3-Zone Navigation Header */}
      <BattleNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => {
          if (!user) handleOpenAuth('login');
          else setShowCreateModal(true);
        }}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onClaimMonthlyCoins={handleClaimMonthlyCoins}
        language={language}
        onSelectLanguage={setLanguage}
      />

      {/* Social Invite / Notification Banner */}
      {socialBonusNotice && (
        <div className="bg-zinc-900 text-white text-xs font-mono py-2.5 px-4 text-center border-b border-zinc-800 flex items-center justify-center gap-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{socialBonusNotice}</span>
          <button
            onClick={() => setSocialBonusNotice(null)}
            className="text-zinc-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Minimal subtle referral link */}
      <div className="bg-zinc-50/80 border-b border-zinc-200/80 py-1 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>{language === 'fr' ? 'Plateforme de compétitions en direct & réseau créateur' : 'Live competitions, interactive judging & creator network'}</span>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="font-medium text-zinc-700 hover:text-zinc-950 flex items-center gap-1 cursor-pointer transition"
          >
            <Share2 className="w-3 h-3" />
            <span>{language === 'fr' ? 'Partager l’invitation' : 'Invite link'}</span>
          </button>
        </div>
      </div>

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            statusRings={statusRings}
            battles={battles}
            selectedBattleId={selectedBattleId}
            onSelectBattle={(id) => {
              setSelectedBattleId(id);
              setActiveTab('battles');
            }}
            posts={posts}
            user={user || INITIAL_USER}
            onUpdateUserCoins={handleUpdateUserCoins}
            onJoinBattle={handleJoinBattle}
            onOpenCreate={() => {
              if (!user) handleOpenAuth('login');
              else setActiveTab('create');
            }}
            onChallengeCreator={handleChallengeCreator}
            onSendDM={handleSendDM}
            onViewProfile={handleViewCreatorProfile}
          />
        )}

        {activeTab === 'battles' && (
          <BattleArenaView
            battles={battles}
            selectedBattleId={selectedBattleId}
            onSelectBattle={setSelectedBattleId}
            user={user}
            onUpdateUserCoins={handleUpdateUserCoins}
            onJoinBattle={handleJoinBattle}
            onOpenAuth={handleOpenAuth}
            language={language}
            onSelectLanguage={setLanguage}
            onAddRewardLog={handleAddRewardLog}
            onViewProfile={handleViewCreatorProfile}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            battles={battles}
            posts={posts}
            dreamBattles={dreamBattles}
            user={user}
            onSelectBattle={(id) => {
              setSelectedBattleId(id);
              setActiveTab('battles');
            }}
            onUpvoteDreamBattle={handleUpvoteDreamBattle}
            onCreateDreamBattle={handleCreateDreamBattle}
            onOpenAuth={handleOpenAuth}
            onDownloadPost={handleDownloadPostFromSearch}
            onToggleFollow={handleToggleFollowCreator}
            onUnlockMedia={handleUnlockMedia}
            language={language}
            onSelectLanguage={setLanguage}
            onViewProfile={handleViewCreatorProfile}
          />
        )}

        {activeTab === 'create' && (
          user ? (
            <CreateView
              user={user}
              onCreateBattle={handleCreateBattle}
              onAddPost={handleAddPost}
              onUpdateStatus={handleUpdateStatus}
              onAddStatusRing={handleAddStatusRing}
              onGoToHome={() => setActiveTab('home')}
              language={language}
            />
          ) : (
            <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono font-bold text-zinc-900">
                HY
              </div>
              <h2 className="text-xl font-bold font-display text-zinc-900">
                {language === 'fr' ? 'Connectez-vous pour Créer & Concourir' : 'Sign In to Create & Compete'}
              </h2>
              <p className="text-xs text-zinc-500">
                {language === 'fr'
                  ? 'Connectez-vous avec votre compte Google ou le formulaire pour lancer des compétitions, monter sur scène ou publier des médias.'
                  : 'Log in with Google or custom form to host competitions, step on stage, upload media, or update your status.'}
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-black transition cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="px-4 py-2 text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-lg hover:bg-zinc-200 transition cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'media' && (
          <MediaFeedView
            posts={posts}
            user={user || INITIAL_USER}
            onAddPost={handleAddPost}
            onUpdateUserCoins={handleUpdateUserCoins}
            onToggleFollow={handleToggleFollowCreator}
            onUnlockMedia={handleUnlockMedia}
            language={language}
            onViewProfile={handleViewCreatorProfile}
          />
        )}

        {activeTab === 'groups' && (
          <GroupsView
            groups={groups}
            onStartCall={handleStartCall}
            onSelectSquadChat={(squadName) => {
              const matched = conversations.find((c) => c.name.includes(squadName.split(' ')[0]));
              if (matched) setActiveConvId(matched.id);
              setActiveTab('messages');
            }}
          />
        )}

        {activeTab === 'messages' && (
          <MessagesCallsView
            conversations={conversations}
            activeConvId={activeConvId}
            onSelectConv={setActiveConvId}
            onStartCall={handleStartCall}
            user={user || INITIAL_USER}
            onViewProfile={handleViewCreatorProfile}
            language={language}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            posts={posts}
            onUpdateStatus={handleUpdateStatus}
            onClaimMonthlyCoins={handleClaimMonthlyCoins}
            onLogout={handleLogout}
            onOpenAuth={handleOpenAuth}
            language={language}
            onSelectLanguage={setLanguage}
            onUpdateUserProfile={handleUpdateUserProfile}
            onAddPost={(newPost) => {
              setPosts((prev) => [newPost, ...prev]);
              setSocialBonusNotice(
                language === 'fr'
                  ? 'Nouveau média publié sur votre profil !'
                  : 'New media posted to your profile!'
              );
              setTimeout(() => setSocialBonusNotice(null), 3000);
            }}
            onShareToProfile={handleShareToProfile}
            onLikePost={(postId) => {
              sounds.playCheer();
              setPosts((prev) =>
                prev.map((p) => (p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p))
              );
            }}
            onAddComment={(postId, text) => {
              const newComment: PostComment = {
                id: `c_${Date.now()}`,
                authorName: user?.name || 'Guest User',
                authorHandle: user?.handle || '@guest',
                authorAvatar: user?.avatar || 'GU',
                text,
                timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
              };
              setPosts((prev) =>
                prev.map((p) =>
                  p.id === postId
                    ? {
                        ...p,
                        commentsCount: p.commentsCount + 1,
                        comments: [newComment, ...(p.comments || [])],
                      }
                    : p
                )
              );
            }}
          />
        )}
      </main>

      {/* User / Creator Profile Modal */}
      {selectedCreatorProfile && (
        <UserProfileModal
          isOpen={Boolean(selectedCreatorProfile)}
          onClose={() => setSelectedCreatorProfile(null)}
          creator={selectedCreatorProfile}
          currentUser={user}
          posts={posts}
          isFollowing={
            (selectedCreatorProfile.handle && user?.followedCreatorHandles?.includes(selectedCreatorProfile.handle)) ||
            (selectedCreatorProfile.name && user?.followedCreatorHandles?.includes(`@${selectedCreatorProfile.name.toLowerCase().replace(/\s+/g, '_')}`)) ||
            false
          }
          onToggleFollow={handleToggleFollowCreator}
          onSendDM={(creatorName) => {
            setSelectedCreatorProfile(null);
            handleSendDM(creatorName);
          }}
          onShareToProfile={handleShareToProfile}
          onLikePost={(postId) => {
            sounds.playCheer();
            setPosts((prev) =>
              prev.map((p) => (p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p))
            );
          }}
          onAddComment={(postId, text) => {
            const newComment: PostComment = {
              id: `c_${Date.now()}`,
              authorName: user?.name || 'Guest User',
              authorHandle: user?.handle || '@guest',
              authorAvatar: user?.avatar || 'GU',
              text,
              timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
            };
            setPosts((prev) =>
              prev.map((p) =>
                p.id === postId
                  ? {
                      ...p,
                      commentsCount: p.commentsCount + 1,
                      comments: [newComment, ...(p.comments || [])],
                    }
                  : p
              )
            );
          }}
          onUnlockMedia={handleUnlockMedia}
          onStartCall={handleStartCall}
          language={language}
        />
      )}

      {/* Launch Battle Modal */}
      <CreateBattleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateBattle={handleCreateBattle}
      />

      {/* Auth Modal (Log in / Sign up) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={(loggedUser) => {
          setUser(loggedUser);
          setAuthModalOpen(false);
        }}
        initialMode={authModalMode}
        language={language}
      />

      {/* Social Pull-in / Referral Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                  INVITE CREATORS & FRIENDS
                </div>
                <h3 className="text-lg font-bold font-display text-zinc-900">
                  Pull In Friends & Earn Coins
                </h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Invite opponents or spectators from your favorite apps with 1-click frictionless deep links. You earn <strong>+100 Coins</strong> every time a friend joins!
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => handleSharePlatform('whatsapp')}
                className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 flex items-center gap-2.5 transition cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                  WA
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">WhatsApp</div>
                  <div className="text-[10px] text-zinc-500">Direct Invite + Chat</div>
                </div>
              </button>

              <button
                onClick={() => handleSharePlatform('tiktok')}
                className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 flex items-center gap-2.5 transition cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs font-mono">
                  TT
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">TikTok</div>
                  <div className="text-[10px] text-zinc-500">Share to Bio / DMs</div>
                </div>
              </button>

              <button
                onClick={() => handleSharePlatform('instagram')}
                className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 flex items-center gap-2.5 transition cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                  IG
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">Instagram</div>
                  <div className="text-[10px] text-zinc-500">Story & Direct Links</div>
                </div>
              </button>

              <button
                onClick={() => handleSharePlatform('facebook')}
                className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 flex items-center gap-2.5 transition cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                  FB
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">Facebook</div>
                  <div className="text-[10px] text-zinc-500">Groups & Feeds</div>
                </div>
              </button>
            </div>

            {/* Direct Copy Link */}
            <div className="pt-2">
              <div className="flex items-center gap-2 p-2 bg-zinc-50 border border-zinc-200 rounded-xl">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/invite?ref=${user ? user.handle.replace('@', '') : 'creator'}`}
                  className="flex-1 bg-transparent text-xs text-zinc-600 outline-none font-mono"
                />
                <button
                  onClick={() => handleSharePlatform('copy')}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  {inviteCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{inviteCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Video / Audio Call Overlay Screen */}
      {activeCall && (
        <CallOverlay
          callType={activeCall.callType}
          targetName={activeCall.targetName}
          isGroup={activeCall.isGroup}
          onEndCall={handleEndCall}
          sharedDocs={
            conversations.find((c) => c.name.toLowerCase().includes(activeCall.targetName.toLowerCase()))?.sharedDocs
          }
        />
      )}

      {/* Clean White & Neutral Footer */}
      <footer className="border-t border-zinc-200 bg-white py-6 text-zinc-500 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display">
            <span className="w-2.5 h-2.5 rounded-sm bg-zinc-900 inline-block" />
            <span className="font-bold text-zinc-900">Hypitt</span>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-600 font-sans">Live Competitions, Media Hub & Creator Network</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-500 text-[11px] font-mono">
            <span>Live Dance</span>
            <span>·</span>
            <span>Open-Mic Singing</span>
            <span>·</span>
            <span>Debates</span>
            <span>·</span>
            <span>Roasting</span>
            <span>·</span>
            <span>Downloads</span>
          </div>

          <div className="text-zinc-600 text-[11px] font-mono flex items-center gap-2">
            {user ? (
              <>
                <span>Account: <strong className="text-zinc-900 font-medium">{user.name}</strong></span>
                <span>·</span>
                <button
                  onClick={handleLogout}
                  className="text-zinc-600 hover:text-zinc-900 underline cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                onClick={() => handleOpenAuth('login')}
                className="text-zinc-900 font-bold hover:underline cursor-pointer"
              >
                Sign In to Hypitt
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
