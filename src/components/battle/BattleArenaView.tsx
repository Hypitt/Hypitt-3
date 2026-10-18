import React, { useState, useEffect } from 'react';
import {
  BattleItem,
  BattleCategory,
  BattleMediaMode,
  UserProfile,
  BattleJudge,
  Contender,
  PredictionBet
} from '../../types/battleTypes';
import {
  Flame,
  Mic,
  Video,
  Volume2,
  Users,
  Coins,
  Send,
  Trophy,
  Sparkles,
  Check,
  Share2,
  Eye,
  Sliders,
  DollarSign,
  TrendingUp,
  Award,
  VideoOff,
  UserCheck,
  Play,
  Pause,
  X,
  Globe,
  Gavel,
  ShieldCheck,
  AlertCircle,
  Settings,
  UserPlus,
  User,
  Radio,
  FileCheck,
  MicOff,
  Lock,
  Unlock,
  Plus,
  Heart,
  Trash2
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { Language, TRANSLATIONS } from '../../utils/i18n';
import { checkContentSafety } from '../../utils/contentModeration';

interface BattleArenaViewProps {
  battles: BattleItem[];
  selectedBattleId: string;
  onSelectBattle: (id: string) => void;
  user: UserProfile | null;
  onUpdateUserCoins: (delta: number) => void;
  onJoinBattle: (battleId: string) => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  language?: Language;
  onSelectLanguage?: (lang: Language) => void;
  onAddRewardLog?: (log: any) => void;
  onViewProfile?: (creator: any) => void;
}

// Live audience spectator pool available for host / organizer designation
interface AudienceSpectator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  photoUrl: string;
  role: string;
  preferredCategory: string;
}

const AUDIENCE_POOL: AudienceSpectator[] = [
  {
    id: 'aud_1',
    name: 'Marcus Vance',
    handle: '@marcus_judge',
    avatar: 'MV',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    role: 'Pro MC / Cypher Judge',
    preferredCategory: 'roasting',
  },
  {
    id: 'aud_2',
    name: 'Elena Drake',
    handle: '@elena_critique',
    avatar: 'ED',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    role: 'Comedy Club Critic',
    preferredCategory: 'comedy',
  },
  {
    id: 'aud_3',
    name: 'Jax Harlem',
    handle: '@jax_steps',
    avatar: 'JH',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    role: 'Brooklyn Krump Pioneer',
    preferredCategory: 'dance',
  },
  {
    id: 'aud_4',
    name: 'Kiran Debater',
    handle: '@kiran_live',
    avatar: 'KD',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    role: 'Debate League Finalist',
    preferredCategory: 'debate',
  },
  {
    id: 'aud_5',
    name: 'Chloe Vance',
    handle: '@chloe_beats',
    avatar: 'CV',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    role: 'Studio Audio Engineer',
    preferredCategory: 'singing',
  },
  {
    id: 'aud_6',
    name: 'Nico Krump',
    handle: '@nico_moves',
    avatar: 'NM',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    role: 'Street Choreographer',
    preferredCategory: 'dance',
  },
];

export const BattleArenaView: React.FC<BattleArenaViewProps> = ({
  battles,
  selectedBattleId,
  onSelectBattle,
  user,
  onUpdateUserCoins,
  onJoinBattle,
  onOpenAuth,
  language = 'en',
  onSelectLanguage,
  onAddRewardLog,
  onViewProfile,
}) => {
  const [currentLang, setCurrentLang] = useState<Language>(language);

  // Sync language with parent if updated
  useEffect(() => {
    setCurrentLang(language);
  }, [language]);

  const handleLangChange = (newLang: Language) => {
    setCurrentLang(newLang);
    if (onSelectLanguage) onSelectLanguage(newLang);
  };

  const t = TRANSLATIONS[currentLang];

  // Active Battle
  const activeBattle = battles.find((b) => b.id === selectedBattleId) || battles[0];

  // Host and Rules State
  const [hostVotingRule, setHostVotingRule] = useState<'fifty_fifty' | 'public_only' | 'judges_only'>(
    activeBattle.votingRule || 'fifty_fifty'
  );
  const [isHostParticipant, setIsHostParticipant] = useState<boolean>(
    Boolean(activeBattle.isHostCompetitor)
  );
  const [showHostRulesModal, setShowHostRulesModal] = useState<boolean>(false);
  const [hostAssignedBattler, setHostAssignedBattler] = useState<string>('@dame_speed');
  const [isSeatTwoOpenToPublic, setIsSeatTwoOpenToPublic] = useState<boolean>(true);

  // Host Media Controls (Microphone & Camera)
  const [isHostMicMuted, setIsHostMicMuted] = useState<boolean>(Boolean(activeBattle.isHostMicMuted));
  const [isHostCameraOff, setIsHostCameraOff] = useState<boolean>(Boolean(activeBattle.isHostCameraOff));

  // Customised Discipline Theme
  const [activeCustomTheme, setActiveCustomTheme] = useState<string>(activeBattle.customTheme || '');
  const [customThemeInput, setCustomThemeInput] = useState<string>(activeBattle.customTheme || '');
  const [showCustomThemeModal, setShowCustomThemeModal] = useState<boolean>(false);

  // Selected Judge Status & Identity Selector
  // Options: 'j1' (Marcus Vance), 'j2' (Elena Drake), 'j3' (Jax Harlem), 'custom_user' (Logged in Judge), 'audience' (Regular non-judge spectator)
  const [activeJudgeIdentity, setActiveJudgeIdentity] = useState<string>('j1');

  // Battle Like Boost state
  const [battleLikes, setBattleLikes] = useState<number>(340);
  const [likeBoostNotice, setLikeBoostNotice] = useState<string | null>(null);

  // Rewards Distribution state (20% Host, 80% Battlers according to eligible votes)
  const [rewardsDistributed, setRewardsDistributed] = useState<boolean>(false);
  const [rewardsNotice, setRewardsNotice] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; user: string; text: string; time: string; likes?: number }>>([
    { id: '1', user: 'Zoe Skate', text: 'Kai brought relentless pace with that cultural rebuttal.', time: 'Just now', likes: 2 },
    { id: '2', user: 'David Corporate', text: 'Sarah single-origin analogy was surprisingly sharp.', time: '1m ago', likes: 5 },
    { id: '3', user: 'Elena Roast', text: 'Judges just scored Round 2. Public votes are dead tied 50/50.', time: '2m ago', likes: 1 },
  ]);
  const [likedChatCommentIds, setLikedChatCommentIds] = useState<Record<string, boolean>>({});

  const handleToggleLikeChatComment = (commentId: string) => {
    sounds.playVineBoom();
    setLikedChatCommentIds((prev) => {
      const isLiked = !prev[commentId];
      setComments((cList) =>
        cList.map((c) =>
          c.id === commentId
            ? { ...c, likes: Math.max(0, (c.likes || 0) + (isLiked ? 1 : -1)) }
            : c
        )
      );
      return { ...prev, [commentId]: isLiked };
    });
  };

  const handleDeleteChatComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const [paidGiftNotice, setPaidGiftNotice] = useState<string | null>(null);
  const [cameraUnlockNotice, setCameraUnlockNotice] = useState<string | null>(null);

  // Contenders (supports 2 to 5 competitors in one screen)
  const [activeContenders, setActiveContenders] = useState<Contender[]>(
    activeBattle.contenders && activeBattle.contenders.length > 0
      ? activeBattle.contenders
      : [activeBattle.contenderA, activeBattle.contenderB]
  );

  // In competition: 'spectator' (regular user), 'judge' (selected judge), 'host' (host moderator)
  const [competitionUserRole, setCompetitionUserRole] = useState<'spectator' | 'judge' | 'host'>(
    user && (user.name === activeBattle.hostName || user.handle === activeBattle.hostHandle) ? 'host' : 'spectator'
  );

  const isSelectedJudge = competitionUserRole === 'judge' || activeJudgeIdentity !== 'audience';

  // Active contender on the mic (featured in the bigger window)
  const [activeMicContenderId, setActiveMicContenderId] = useState<string>(
    activeBattle.contenders?.[0]?.id || activeBattle.contenderA?.id || 'c_1'
  );

  // Single-screen competitor layout: 'featured_spotlight' (one bigger window on mic + smaller windows) vs 'equal_grid'
  const [stageLayoutMode, setStageLayoutMode] = useState<'featured_spotlight' | 'equal_grid'>('featured_spotlight');

  // Video playback simulation per contender
  const [videoPlaying, setVideoPlaying] = useState<Record<string, boolean>>({});

  // 3 Judges State (Organizer elected or auto elected by app among public)
  const [judges, setJudges] = useState<BattleJudge[]>([
    {
      id: 'j1',
      name: 'Marcus Vance',
      handle: '@marcus_judge',
      avatar: 'MV',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      type: 'organizer_elected',
      scoreA: 55,
      scoreB: 45,
      notes: 'Cadence and rhythm remained sharp during crowd reaction.',
      designatedByOrganizer: true,
    },
    {
      id: 'j2',
      name: 'Elena Drake',
      handle: '@elena_critique',
      avatar: 'ED',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      type: 'organizer_elected',
      scoreA: 52,
      scoreB: 48,
      notes: 'Punchline timing was razor-sharp in the final 15 seconds.',
      designatedByOrganizer: true,
    },
    {
      id: 'j3',
      name: 'Jax Harlem',
      handle: '@jax_steps',
      avatar: 'JH',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      type: 'organizer_elected',
      scoreA: 54,
      scoreB: 46,
      notes: 'Stage presence and counter-rebuttal swayed the round.',
      designatedByOrganizer: true,
    },
  ]);

  // Dedicated Judge Casting Vote Pad Modal
  const [showJudgeVotePadModal, setShowJudgeVotePadModal] = useState<boolean>(false);
  const [selectedJudgeVoterId, setSelectedJudgeVoterId] = useState<string>('j1');
  const [judgeTechScoreA, setJudgeTechScoreA] = useState<number>(27);
  const [judgeFlowScoreA, setJudgeFlowScoreA] = useState<number>(26);
  const [judgeTechScoreB, setJudgeTechScoreB] = useState<number>(24);
  const [judgeFlowScoreB, setJudgeFlowScoreB] = useState<number>(23);
  const [judgeDeliberationText, setJudgeDeliberationText] = useState<string>('Dominant technical cadence with sharp stage rebuttal.');
  const [judgeBroadcastNotice, setJudgeBroadcastNotice] = useState<string | null>(null);

  // Judge Mode Organizer Designation Modal state
  const [showDesignateModal, setShowDesignateModal] = useState<boolean>(false);
  const [judgeInviteInput, setJudgeInviteInput] = useState<string>('');
  const [selectedAudienceIds, setSelectedAudienceIds] = useState<string[]>([
    'aud_1',
    'aud_2',
    'aud_3',
  ]);

  // Prediction Betting State
  const [betAmount, setBetAmount] = useState<number>(50);
  const [activeBets, setActiveBets] = useState<PredictionBet[]>([]);
  const [betSuccessNotice, setBetSuccessNotice] = useState<string | null>(null);

  // AI Judge Analysis State
  const [isAiJudging, setIsAiJudging] = useState(false);
  const [aiVerdict, setAiVerdict] = useState<{
    verdict: string;
    winnerName: string;
    rhymesAndRoastsScore: number;
    flowAndDeliveryScore: number;
    crowdImpactScore: number;
    rebuttalSharpness: number;
    highlights: string[];
  } | null>(null);

  // Camera unlock state for audio battles
  const [unlockedCameraId, setUnlockedCameraId] = useState<string | null>(
    activeBattle.cameraUnlockedContenderId || null
  );

  // Synchronize when active battle changes
  useEffect(() => {
    const list = activeBattle.contenders && activeBattle.contenders.length > 0
      ? activeBattle.contenders
      : [activeBattle.contenderA, activeBattle.contenderB];

    setActiveContenders(list);
    const initialPlayState: Record<string, boolean> = {};
    list.forEach((c) => {
      initialPlayState[c.id] = true;
    });
    setVideoPlaying(initialPlayState);
    setCategoryFilter(activeBattle.category);
    setActiveCustomTheme(activeBattle.customTheme || '');
    setCustomThemeInput(activeBattle.customTheme || '');
    setIsHostMicMuted(Boolean(activeBattle.isHostMicMuted));
    setIsHostCameraOff(Boolean(activeBattle.isHostCameraOff));
    setUnlockedCameraId(activeBattle.cameraUnlockedContenderId || null);
    if (activeBattle.votingRule) setHostVotingRule(activeBattle.votingRule);
    if (activeBattle.isHostCompetitor !== undefined) setIsHostParticipant(activeBattle.isHostCompetitor);
    const unmutedContender = list.find((c) => !c.isMicMuted) || list[0];
    if (unmutedContender) {
      setActiveMicContenderId(unmutedContender.id);
    }
    if (user && (user.name === activeBattle.hostName || user.handle === activeBattle.hostHandle)) {
      setCompetitionUserRole('host');
    }
  }, [activeBattle.id]);

  // Host Media Controls Handlers
  const handleToggleHostMic = () => {
    sounds.playCheer();
    setIsHostMicMuted((prev) => {
      const next = !prev;
      setPaidGiftNotice(
        next
          ? (currentLang === 'fr' ? 'Micro de l’hôte coupé.' : 'Host microphone muted.')
          : (currentLang === 'fr' ? 'Micro de l’hôte activé en direct !' : 'Host microphone unmuted & broadcasting!')
      );
      setTimeout(() => setPaidGiftNotice(null), 2500);
      return next;
    });
  };

  const handleToggleHostCamera = () => {
    sounds.playVineBoom();
    setIsHostCameraOff((prev) => {
      const next = !prev;
      setPaidGiftNotice(
        next
          ? (currentLang === 'fr' ? 'Caméra de l’hôte désactivée.' : 'Host camera turned off.')
          : (currentLang === 'fr' ? 'Caméra de l’hôte activée en direct !' : 'Host camera broadcasting live!')
      );
      setTimeout(() => setPaidGiftNotice(null), 2500);
      return next;
    });
  };

  // Direct Stage Step-In (Hot Mic & Step on Stage button handler)
  const handleJoinStageDirectly = () => {
    if (!user) {
      onOpenAuth?.('login');
      return;
    }
    if (activeContenders.length >= 5) {
      setPaidGiftNotice(
        currentLang === 'fr'
          ? 'La scène a atteint sa capacité maximale (5 compétiteurs sur un seul écran).'
          : 'Stage is at maximum capacity (5 competitors on screen).'
      );
      setTimeout(() => setPaidGiftNotice(null), 3500);
      return;
    }
    const alreadyOnStage = activeContenders.some(
      (c) => c.id === user.id || (user.handle && c.handle.toLowerCase() === user.handle.toLowerCase())
    );
    if (alreadyOnStage) {
      setPaidGiftNotice(
        currentLang === 'fr'
          ? 'Vous êtes déjà installé sur la scène !'
          : 'You are already on stage!'
      );
      setTimeout(() => setPaidGiftNotice(null), 3000);
      return;
    }

    const nextIdx = activeContenders.length + 1;
    const userContender: Contender = {
      id: user.id,
      name: user.name,
      handle: user.handle,
      avatar: user.avatar,
      generation: user.generation,
      score: 50,
      freeVotes: 0,
      paidVotes: 0,
      status: 'Live on Stage · Hot Mic',
      isSpeaking: true,
      videoActive: true,
      audioActive: true,
      isMicMuted: false,
      isCameraOff: false,
      photoUrl: user.profilePhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
      quote: 'Stepped onto the live stage ready to compete!',
      followers: `${(user.followers / 1000).toFixed(1)}k`,
    };

    sounds.playCheer();
    setActiveContenders((prev) => [...prev, userContender]);
    onJoinBattle(activeBattle.id);
    setPaidGiftNotice(
      currentLang === 'fr'
        ? `Vous êtes monté sur scène (Micro Ouvert) ! Compétiteur #${nextIdx}/5`
        : `You stepped on stage with a live Hot Mic! (Competitor #${nextIdx}/5)`
    );
    setTimeout(() => setPaidGiftNotice(null), 3500);
  };

  // Host Moderator Microphone Override Handler
  const handleHostModeratorMute = (contenderId: string) => {
    sounds.playVineBoom();
    setActiveContenders((prev) =>
      prev.map((c) => {
        if (c.id === contenderId) {
          const nextState = !c.isMicMuted;
          setPaidGiftNotice(
            nextState
              ? (currentLang === 'fr' ? `L’hôte modérateur a coupé le micro de ${c.name}.` : `Host moderator muted ${c.name}.`)
              : (currentLang === 'fr' ? `L’hôte modérateur a réactivé le micro de ${c.name}.` : `Host moderator unmuted ${c.name}.`)
          );
          setTimeout(() => setPaidGiftNotice(null), 2500);
          return { ...c, isMicMuted: nextState, audioActive: !nextState, mutedByHost: nextState };
        }
        return c;
      })
    );
  };

  // Host Capacity to Add / Invite any Competitor
  const handleHostAddOrInviteCompetitor = (rawHandle: string) => {
    const handle = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle.toLowerCase().replace(/\s+/g, '_')}`;
    const name = rawHandle.replace('@', '');
    if (!name.trim()) return;

    if (activeContenders.length >= 5) {
      setPaidGiftNotice(
        currentLang === 'fr'
          ? 'Capacité maximale atteinte (5 compétiteurs max sur scène).'
          : 'Maximum stage capacity reached (5 competitors max on screen).'
      );
      setTimeout(() => setPaidGiftNotice(null), 3000);
      return;
    }

    const alreadyOnStage = activeContenders.some(
      (c) => c.handle.toLowerCase() === handle.toLowerCase()
    );
    if (alreadyOnStage) {
      setPaidGiftNotice(
        currentLang === 'fr'
          ? `${handle} est déjà présent sur scène !`
          : `${handle} is already seated on stage!`
      );
      setTimeout(() => setPaidGiftNotice(null), 3000);
      return;
    }

    const nextIdx = activeContenders.length + 1;
    const samplePhotos = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    ];

    const newC: Contender = {
      id: `c_host_added_${Date.now()}`,
      name,
      handle,
      avatar: handle.slice(1, 3).toUpperCase() || 'CR',
      photoUrl: samplePhotos[(nextIdx - 1) % samplePhotos.length],
      generation: nextIdx % 2 === 0 ? 'Gen Z' : 'Millennial',
      score: 50,
      freeVotes: 10,
      paidVotes: 0,
      status: 'Live on Stage · Invited',
      isSpeaking: false,
      videoActive: true,
      audioActive: true,
      isMicMuted: false,
      isCameraOff: false,
      quote: `${name} invited to live arena stage!`,
      followers: `${15 + nextIdx * 5}k`,
    };

    sounds.playVineBoom();
    setActiveContenders((prev) => [...prev, newC]);
    setHostAssignedBattler('');
    setPaidGiftNotice(
      currentLang === 'fr'
        ? `${handle} invité et ajouté sur scène (${nextIdx}/5 compétiteurs) !`
        : `Invited and added ${handle} to live stage (${nextIdx}/5 competitors)!`
    );
    setTimeout(() => setPaidGiftNotice(null), 3500);
  };

  // Host Capacity to Invite any Judge
  const handleHostAddOrInviteJudge = (rawHandle: string) => {
    const handle = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle.toLowerCase().replace(/\s+/g, '_')}`;
    const name = rawHandle.replace('@', '');
    if (!name.trim()) return;

    const alreadyJudge = judges.some((j) => j.handle.toLowerCase() === handle.toLowerCase());
    if (alreadyJudge) {
      setPaidGiftNotice(
        currentLang === 'fr' ? `${handle} est déjà juge officiel !` : `${handle} is already an official judge!`
      );
      setTimeout(() => setPaidGiftNotice(null), 3000);
      return;
    }

    const newJ: BattleJudge = {
      id: `judge_invited_${Date.now()}`,
      name,
      handle,
      avatar: handle.slice(1, 3).toUpperCase() || 'JD',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      type: 'organizer_elected',
      scoreA: 50,
      scoreB: 50,
      notes: 'Invited by host organizer to live judging tribunal.',
      designatedByOrganizer: true,
    };

    sounds.playCheer();
    setJudges((prev) => [...prev, newJ]);
    setPaidGiftNotice(
      currentLang === 'fr' ? `${handle} invité comme Juge Officiel !` : `Invited ${handle} as Official Judge!`
    );
    setTimeout(() => setPaidGiftNotice(null), 3500);
  };

  // Competitor Microphone Mute/Unmute Handler
  const handleToggleContenderMic = (contenderId: string) => {
    sounds.playCheer();
    setActiveContenders((prev) =>
      prev.map((c) => {
        if (c.id === contenderId) {
          const nextState = !c.isMicMuted;
          if (!nextState) {
            // Unmuting mic: automatically pass the mic to this competitor and display on bigger window
            setActiveMicContenderId(contenderId);
          }
          const statusText = nextState
            ? (currentLang === 'fr' ? `Micro de ${c.name} coupé.` : `Microphone for ${c.name} muted.`)
            : (currentLang === 'fr' ? `Micro de ${c.name} activé ! Affiché sur la scène principale.` : `Microphone for ${c.name} unmuted! Now featured on the mic.`);
          setPaidGiftNotice(statusText);
          setTimeout(() => setPaidGiftNotice(null), 2500);
          return { ...c, isMicMuted: nextState, audioActive: !nextState };
        }
        return c;
      })
    );
  };

  // Explicit Pass Mic Handler (passes the mic to chosen competitor and features them on the bigger window)
  const handlePassMic = (contenderId: string) => {
    sounds.playCheer();
    setActiveMicContenderId(contenderId);
    setActiveContenders((prev) =>
      prev.map((c) => (c.id === contenderId ? { ...c, isMicMuted: false, audioActive: true } : c))
    );
    const target = activeContenders.find((c) => c.id === contenderId);
    setPaidGiftNotice(
      currentLang === 'fr'
        ? `🎤 Micro passé à ${target?.name || 'compétiteur'} ! Il est désormais sur la scène principale.`
        : `🎤 Mic passed to ${target?.name || 'competitor'}! Now on the featured big stage window.`
    );
    setTimeout(() => setPaidGiftNotice(null), 3000);
  };

  // Competitor Camera On/Off Handler
  const handleToggleContenderCamera = (contenderId: string) => {
    sounds.playVineBoom();
    setActiveContenders((prev) =>
      prev.map((c) => {
        if (c.id === contenderId) {
          const nextState = !c.isCameraOff;
          const statusText = nextState
            ? (currentLang === 'fr' ? `Caméra de ${c.name} éteinte.` : `Camera for ${c.name} turned off.`)
            : (currentLang === 'fr' ? `Caméra de ${c.name} allumée en direct !` : `Camera for ${c.name} turned on!`);
          setPaidGiftNotice(statusText);
          setTimeout(() => setPaidGiftNotice(null), 2500);
          return { ...c, isCameraOff: nextState, videoActive: !nextState, cameraUnlocked: !nextState };
        }
        return c;
      })
    );
  };

  // Stage Capacity Handlers (Allows up to 5 competitors in one screen)
  const handleAddCompetitorToStage = () => {
    if (activeContenders.length >= 5) {
      setPaidGiftNotice(
        currentLang === 'fr'
          ? 'Capacité maximale atteinte : 5 compétiteurs sur un seul écran.'
          : 'Maximum capacity reached: 5 competitors in one screen.'
      );
      setTimeout(() => setPaidGiftNotice(null), 3000);
      return;
    }
    const nextIdx = activeContenders.length + 1;
    const samplePhotos = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80'
    ];
    const newContender: Contender = {
      id: `contender_${nextIdx}_${Date.now()}`,
      name: `Competitor #${nextIdx}`,
      handle: `@challenger_${nextIdx}`,
      avatar: `C${nextIdx}`,
      photoUrl: samplePhotos[(nextIdx - 3) % samplePhotos.length] || samplePhotos[0],
      generation: nextIdx % 2 === 0 ? 'Gen Z' : 'Millennial',
      score: 50,
      freeVotes: 12 + nextIdx * 2,
      paidVotes: 0,
      status: 'Live on Stage',
      isSpeaking: false,
      videoActive: true,
      audioActive: true,
      isMicMuted: false,
      isCameraOff: false,
      quote: `Challenger #${nextIdx} locked in on stage!`,
      followers: `${18 + nextIdx * 4}k`,
    };
    sounds.playVineBoom();
    setActiveContenders([...activeContenders, newContender]);
    setPaidGiftNotice(
      currentLang === 'fr'
        ? `Nouveau compétiteur #${nextIdx} ajouté sur scène (Total: ${activeContenders.length + 1}/5) !`
        : `Added Competitor #${nextIdx} to screen (Total: ${activeContenders.length + 1}/5)!`
    );
    setTimeout(() => setPaidGiftNotice(null), 3500);
  };

  const handleRemoveCompetitorFromStage = (contenderId: string) => {
    if (activeContenders.length <= 2) {
      setPaidGiftNotice(
        currentLang === 'fr'
          ? 'Une compétition requiert au minimum 2 compétiteurs sur scène.'
          : 'A live competition requires at least 2 competitors on screen.'
      );
      setTimeout(() => setPaidGiftNotice(null), 3000);
      return;
    }
    sounds.playCheer();
    setActiveContenders(activeContenders.filter((c) => c.id !== contenderId));
    setPaidGiftNotice(
      currentLang === 'fr'
        ? `Compétiteur retiré de la scène. (${activeContenders.length - 1} restants)`
        : `Competitor removed from screen. (${activeContenders.length - 1} remaining)`
    );
    setTimeout(() => setPaidGiftNotice(null), 3000);
  };

  // Custom Discipline Theme Handler
  const handleSaveCustomTheme = () => {
    const trimmed = customThemeInput.trim();
    setActiveCustomTheme(trimmed);
    activeBattle.customTheme = trimmed || undefined;
    sounds.playCheer();
    setShowCustomThemeModal(false);
    setPaidGiftNotice(
      currentLang === 'fr'
        ? `Thème personnalisé défini : "${trimmed}" !`
        : `Custom discipline theme updated: "${trimmed}"!`
    );
    setTimeout(() => setPaidGiftNotice(null), 3500);
  };

  // Selected Judges Click to Vote Handler (available to selected judges only)
  const handleJudgeClickToVote = (contenderIdx: number) => {
    if (!isSelectedJudge) {
      setPaidGiftNotice(
        currentLang === 'fr'
          ? 'Accès refusé : Le clic pour voter est réservé exclusivement aux juges sélectionnés.'
          : 'Access denied: Click to vote is available to selected judges only.'
      );
      setTimeout(() => setPaidGiftNotice(null), 4000);
      return;
    }

    sounds.playCheer();
    const targetContender = activeContenders[contenderIdx];
    const currentJudgeObj = judges.find((j) => j.id === activeJudgeIdentity);
    const judgeName = currentJudgeObj?.name || user?.name || 'Selected Judge';

    setJudges((prev) =>
      prev.map((j) => {
        if (j.id === activeJudgeIdentity || (activeJudgeIdentity === 'custom_user' && j.id === 'j1')) {
          return {
            ...j,
            scoreA: contenderIdx === 0 ? Math.min(100, j.scoreA + 6) : Math.max(0, j.scoreA - 6),
            scoreB: contenderIdx === 1 ? Math.min(100, j.scoreB + 6) : Math.max(0, j.scoreB - 6),
            notes: `Click-to-vote point awarded to ${targetContender.name} for razor-sharp execution.`,
          };
        }
        return j;
      })
    );

    setJudgeBroadcastNotice(
      currentLang === 'fr'
        ? `VOTE DU JUGE ENREGISTRÉ : ${judgeName} (Juge Sélectionné) a cliqué pour voter pour ${targetContender.name} ! (+6 pts)`
        : `OFFICIAL JUDGE VOTE: Selected judge ${judgeName} clicked to vote for ${targetContender.name}! (+6 pts)`
    );
    setTimeout(() => setJudgeBroadcastNotice(null), 5000);
  };

  // 50/50 Scoring Calculation for 2 or multiple battlers
  const isMultiBattler = activeContenders.length > 2;
  const contenderA = activeContenders[0];
  const contenderB = activeContenders[1] || activeContenders[0];

  // Public Votes for all contenders (1 vote per free, 5 per supervote)
  const contenderPublicPoints = activeContenders.map(
    (c) => (c.freeVotes || 0) * 1 + (c.paidVotes || 0) * 5
  );
  const totalPublicPoints = contenderPublicPoints.reduce((sum, p) => sum + p, 0);

  // Total raw votes cast by audience
  const totalPublicVotesCast = activeContenders.reduce((sum, c) => sum + (c.freeVotes || 0), 0);
  const totalSuperVotesCast = activeContenders.reduce((sum, c) => sum + (c.paidVotes || 0), 0);
  const totalPublicSum = totalPublicVotesCast + totalSuperVotesCast;

  const contenderPublicPercents = activeContenders.map((_, idx) =>
    totalPublicPoints > 0
      ? Math.round((contenderPublicPoints[idx] / totalPublicPoints) * 100)
      : Math.round(100 / activeContenders.length)
  );

  // Average Judges score for Contender A and B
  const avgJudgeA = Math.round(judges.reduce((acc, j) => acc + j.scoreA, 0) / (judges.length || 1));
  const avgJudgeB = 100 - avgJudgeA;

  // Real-time calculation of exact weighted percentages
  const rawPercentages = activeContenders.map((c, idx) => {
    const publicFraction = totalPublicPoints > 0 ? (contenderPublicPoints[idx] / totalPublicPoints) : (1 / activeContenders.length);
    let judgeFraction = 0;
    if (activeContenders.length === 2) {
      judgeFraction = idx === 0 ? avgJudgeA / 100 : avgJudgeB / 100;
    } else {
      if (idx === 0) judgeFraction = avgJudgeA / 100;
      else if (idx === 1) judgeFraction = (avgJudgeB * 0.55) / 100;
      else judgeFraction = ((avgJudgeB * 0.45) / Math.max(1, activeContenders.length - 2)) / 100;
    }

    if (hostVotingRule === 'public_only') return publicFraction * 100;
    if (hostVotingRule === 'judges_only') return judgeFraction * 100;
    return (publicFraction * 0.5 + judgeFraction * 0.5) * 100;
  });

  // Largest-remainder distribution (Hare-Niemeyer method) to ensure percentages strictly sum to 100%
  const flooredScores = rawPercentages.map(Math.floor);
  const currentSum = flooredScores.reduce((a, b) => a + b, 0);
  const remainder = Math.max(0, 100 - currentSum);
  const diffs = rawPercentages.map((val, i) => ({ idx: i, diff: val - flooredScores[i] })).sort((a, b) => b.diff - a.diff);
  for (let i = 0; i < remainder; i++) {
    flooredScores[diffs[i % diffs.length].idx] += 1;
  }
  const finalScores = flooredScores;

  const finalScoreA = finalScores[0] || 50;
  const finalScoreB = finalScores[1] || 50;

  // Automatically calculate current leader
  let highestScore = -1;
  let leaderIdx = 0;
  finalScores.forEach((sc, idx) => {
    if (sc > highestScore) {
      highestScore = sc;
      leaderIdx = idx;
    }
  });
  const currentLeader = activeContenders[leaderIdx] || contenderA;

  // Auto-unlock camera in Audio battles when a competitor reaches vote lead
  const checkAudioCameraUnlock = (newContenders: Contender[]) => {
    if (activeBattle.mode === 'audio_openmic') {
      const sorted = [...newContenders].sort(
        (a, b) => (b.freeVotes + b.paidVotes * 5) - (a.freeVotes + a.paidVotes * 5)
      );
      const top1 = sorted[0];
      const top2 = sorted[1];
      const total1 = top1.freeVotes + top1.paidVotes * 5;
      const total2 = top2 ? top2.freeVotes + top2.paidVotes * 5 : 0;

      // Threshold: first to reach lead of >= 5 votes
      if (!unlockedCameraId && total1 >= total2 + 5) {
        setUnlockedCameraId(top1.id);
        top1.cameraUnlocked = true;
        top1.videoActive = true;
        sounds.playCheer();
        setCameraUnlockNotice(
          currentLang === 'fr'
            ? `CAMÉRA DÉBLOQUÉE ! ${top1.name} prend la tête avec ${total1} votes — sa caméra est désormais visible en direct par le public !`
            : `CAMERA UNLOCKED! ${top1.name} takes the lead with ${total1} votes — live camera is now broadcasting to audience!`
        );
        setTimeout(() => setCameraUnlockNotice(null), 5000);
      }
    }
  };

  // Regular vote handler (costs 1 voting coin) - No window.alert
  const handleFreeVote = (contenderIndex: number) => {
    if (!user) {
      if (onOpenAuth) onOpenAuth('login');
      else {
        setPaidGiftNotice(currentLang === 'fr' ? 'Veuillez vous connecter pour voter.' : 'Please sign in to vote.');
        setTimeout(() => setPaidGiftNotice(null), 3000);
      }
      return;
    }

    const availableVotingCoins = user.votingCoins !== undefined ? user.votingCoins : user.coins;
    if (availableVotingCoins < 1) {
      setPaidGiftNotice(
        currentLang === 'fr'
          ? 'Vous n’avez plus de pièces de vote. Réclamez vos 100 pièces mensuelles dans votre profil !'
          : 'You are out of Voting Coins. Claim your 100 monthly coins in your Creator Profile!'
      );
      setTimeout(() => setPaidGiftNotice(null), 3500);
      return;
    }

    sounds.playCheer();
    onUpdateUserCoins(-1);
    activeBattle.prizePool += 1;

    const updated = [...activeContenders];
    updated[contenderIndex].freeVotes += 1;
    setActiveContenders(updated);
    checkAudioCameraUnlock(updated);

    setPaidGiftNotice(
      currentLang === 'fr'
        ? `Vote enregistré (-1 pièce de vote) pour ${updated[contenderIndex].name} !`
        : `Vote cast (-1 voting coin) for ${updated[contenderIndex].name}!`
    );
    setTimeout(() => setPaidGiftNotice(null), 3000);
  };

  // Paid SuperVote handler (5 Coins or 10 Coins) - No window.alert
  const handlePaidSuperVote = (contenderIndex: number, cost: number, giftName: string) => {
    if (!user) {
      if (onOpenAuth) onOpenAuth('login');
      else {
        setPaidGiftNotice(currentLang === 'fr' ? 'Veuillez vous connecter pour faire un SuperVote.' : 'Please sign in to cast a SuperVote.');
        setTimeout(() => setPaidGiftNotice(null), 3000);
      }
      return;
    }

    const availableCoins = user.votingCoins !== undefined ? user.votingCoins : user.coins;
    if (availableCoins < cost) {
      setPaidGiftNotice(
        currentLang === 'fr'
          ? `Vous avez besoin de ${cost} pièces de vote pour ce SuperVote. Réclamez vos 100 pièces mensuelles !`
          : `You need ${cost} Voting Coins for this SuperVote. Claim your 100 monthly coins!`
      );
      setTimeout(() => setPaidGiftNotice(null), 3500);
      return;
    }

    sounds.playCheer();
    onUpdateUserCoins(-cost);
    activeBattle.prizePool += cost;

    const updated = [...activeContenders];
    updated[contenderIndex].paidVotes += cost;
    setActiveContenders(updated);
    checkAudioCameraUnlock(updated);

    setPaidGiftNotice(
      currentLang === 'fr'
        ? `SuperVote de ${cost} pièces envoyé à ${updated[contenderIndex].name} ! Ajouté à la cagnotte de compétition.`
        : `Sent ${cost} Coin SuperVote to ${updated[contenderIndex].name}! Added to competition prize pot.`
    );
    setTimeout(() => setPaidGiftNotice(null), 3500);
  };

  // Like Boost handler (boosts competition score & prize pool)
  const handleLikeBoost = () => {
    sounds.playCheer();
    setBattleLikes((prev) => prev + 1);
    activeBattle.prizePool += 2;
    setLikeBoostNotice(
      currentLang === 'fr'
        ? 'Like Boost activé ! +1 à la compétition et +2 pièces virtuelles à la cagnotte !'
        : 'Like Boost activated! +1 to competition and +2 virtual coins added to pot!'
    );
    setTimeout(() => setLikeBoostNotice(null), 3500);
  };

  // Virtual Competition Rewards Calculation (20% Host / 80% Battlers according to eligible votes)
  const hostCutCoins = Math.round(activeBattle.prizePool * 0.2);
  const battlersPoolCoins = activeBattle.prizePool - hostCutCoins;
  const battlerAPercent = contenderPublicPercents[0] || 50;
  const battlerACutCoins = Math.round(battlersPoolCoins * (battlerAPercent / 100));
  const battlerBCutCoins = battlersPoolCoins - battlerACutCoins;

  const handleDistributeRewards = () => {
    sounds.playCheer();
    setRewardsDistributed(true);
    
    if (onAddRewardLog) {
      onAddRewardLog({
        id: `rew_${Date.now()}`,
        date: 'Just now',
        title: `${activeBattle.title} (Settled)`,
        type: 'battle_host_share',
        role: 'host',
        coins: hostCutCoins,
        percentage: 20,
        description: `Host / Organizer 20% cut of ${activeBattle.prizePool} Coin virtual prize pot`,
      });
    }

    setRewardsNotice(
      currentLang === 'fr'
        ? `Récompenses distribuées : 20% à l'hôte (${hostCutCoins}c), ${contenderA.name} (${battlerACutCoins}c), ${contenderB.name} (${battlerBCutCoins}c).`
        : `Rewards automatically settled: 20% to host (${hostCutCoins}c), ${contenderA.name} (${battlerACutCoins}c), ${contenderB.name} (${battlerBCutCoins}c).`
    );
    setTimeout(() => setRewardsNotice(null), 6000);
  };

  // Prediction Betting handler
  const handlePlaceBet = (contender: Contender, odds: number) => {
    if (!user) {
      onOpenAuth?.('login');
      return;
    }

    if (user.coins < betAmount) {
      setBetSuccessNotice(
        currentLang === 'fr'
          ? `Solde insuffisant (${user.coins} pièces). Vous avez besoin de ${betAmount} pièces.`
          : `Insufficient balance (${user.coins} Coins). You need ${betAmount} Coins.`
      );
      setTimeout(() => setBetSuccessNotice(null), 3500);
      return;
    }

    sounds.playCheer();
    onUpdateUserCoins(-betAmount);

    const potential = Math.round(betAmount * odds);
    const newBet: PredictionBet = {
      id: `bet_${Date.now()}`,
      userId: user.id,
      battleId: activeBattle.id,
      chosenContenderId: contender.id,
      amount: betAmount,
      odds: odds,
      potentialPayout: potential,
      status: 'pending',
      timestamp: 'Just now',
    };

    setActiveBets([newBet, ...activeBets]);
    setBetSuccessNotice(
      currentLang === 'fr'
        ? `Pari de ${betAmount} pièces verrouillé sur ${contender.name} à ${odds}x ! Gain potentiel : ${potential} pièces.`
        : `Locked in ${betAmount} Coin prediction on ${contender.name} at ${odds}x! Potential win: ${potential} Coins.`
    );
    setTimeout(() => setBetSuccessNotice(null), 4000);
  };

  // Organizer Designate 3 Audience Judges Handler
  const handleConfirmDesignation = () => {
    if (selectedAudienceIds.length !== 3) {
      setPaidGiftNotice(
        currentLang === 'fr'
          ? 'Veuillez sélectionner exactement 3 juges du public.'
          : 'Please designate exactly 3 audience judges.'
      );
      setTimeout(() => setPaidGiftNotice(null), 3500);
      return;
    }

    sounds.playCheer();
    const chosenSpectators = AUDIENCE_POOL.filter((p) => selectedAudienceIds.includes(p.id));
    const newJudges: BattleJudge[] = chosenSpectators.map((p, idx) => ({
      id: `j_designated_${p.id}_${idx}`,
      name: p.name,
      handle: p.handle,
      avatar: p.avatar,
      photoUrl: p.photoUrl,
      type: 'organizer_elected',
      scoreA: Math.floor(Math.random() * 12) + 48,
      scoreB: 50,
      notes: currentLang === 'fr'
        ? 'Désigné en direct par l’hôte organisateur pour délibérer officiellement.'
        : 'Designated live by competition host to deliberate officially.',
      designatedByOrganizer: true,
    }));

    newJudges.forEach((j) => (j.scoreB = 100 - j.scoreA));
    setJudges(newJudges);
    setShowDesignateModal(false);
  };

  // Auto-elect 3 judges among public spectators
  const handleAutoElectJudges = () => {
    sounds.playCheer();
    const shuffled = [...AUDIENCE_POOL].sort(() => 0.5 - Math.random()).slice(0, 3);
    const newJudges: BattleJudge[] = shuffled.map((p, idx) => ({
      id: `j_elected_${idx}`,
      name: p.name,
      handle: p.handle,
      avatar: p.avatar,
      photoUrl: p.photoUrl,
      type: 'public_elected',
      scoreA: Math.floor(Math.random() * 14) + 46,
      scoreB: 50,
      notes: currentLang === 'fr'
        ? 'Auto-élu en direct parmi la file des spectateurs de l’arène.'
        : 'Auto-elected from active spectator audience queue.',
      designatedByOrganizer: false,
    }));
    newJudges.forEach((j) => (j.scoreB = 100 - j.scoreA));
    setJudges(newJudges);
    setSelectedAudienceIds(shuffled.map((s) => s.id));
  };

  // Submit official score from Judge Voting Pad
  const handleBroadcastJudgeVote = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playVineBoom();

    const totalRawA = judgeTechScoreA + judgeFlowScoreA;
    const totalRawB = judgeTechScoreB + judgeFlowScoreB;
    const sum = totalRawA + totalRawB || 100;
    const normalizedA = Math.round((totalRawA / sum) * 100);
    const normalizedB = 100 - normalizedA;

    const judgeName = selectedJudgeVoterId === 'custom_user'
      ? (user?.name || 'Designated Judge')
      : judges.find((j) => j.id === selectedJudgeVoterId)?.name || 'Judge';

    // Update the targeted judge in tribunal
    setJudges((prev) =>
      prev.map((j) => {
        if (j.id === selectedJudgeVoterId || (selectedJudgeVoterId === 'custom_user' && j.id === 'j1')) {
          return {
            ...j,
            scoreA: normalizedA,
            scoreB: normalizedB,
            notes: judgeDeliberationText.trim() || j.notes,
          };
        }
        return j;
      })
    );

    setJudgeBroadcastNotice(
      currentLang === 'fr'
        ? `SCORE OFFICIEL DIFFUSÉ EN DIRECT : ${judgeName} a voté ${contenderA.name} [${normalizedA}%] vs ${contenderB.name} [${normalizedB}%] ! Le tableau public a été mis à jour.`
        : `OFFICIAL JUDGE SCORE BROADCAST LIVE: ${judgeName} scored ${contenderA.name} [${normalizedA}%] vs ${contenderB.name} [${normalizedB}%]! Public scoreboard updated.`
    );
    setShowJudgeVotePadModal(false);
    setTimeout(() => setJudgeBroadcastNotice(null), 6000);
  };

  // Switch competition category and immediately load matching competition
  const handleSelectCategory = (catId: string) => {
    setCategoryFilter(catId);
    if (catId === 'all') return;
    const matched = battles.find((b) => b.category === catId);
    if (matched) {
      onSelectBattle(matched.id);
    }
  };

  // Trigger Gemini AI Judge Evaluation
  const handleRequestAiJudging = async () => {
    setIsAiJudging(true);
    try {
      const res = await fetch('/api/ai/judge-battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battleTitle: activeBattle.title,
          category: activeBattle.category,
          topic: activeBattle.topic,
          round: activeBattle.round,
          contenderA: contenderA,
          contenderB: contenderB,
        }),
      });
      const data = await res.json();
      const chosenWinner = data.winnerId === contenderA.id ? contenderA.name : contenderB.name;
      setAiVerdict({
        verdict: data.verdict || (
          currentLang === 'fr'
            ? `${chosenWinner} a dominé cette manche avec une cadence impeccable et des arguments incisifs.`
            : `${chosenWinner} commanded the round with sharp delivery.`
        ),
        winnerName: chosenWinner,
        rhymesAndRoastsScore: data.rhymesAndRoastsScore || 92,
        flowAndDeliveryScore: data.flowAndDeliveryScore || 89,
        crowdImpactScore: data.crowdImpactScore || 95,
        rebuttalSharpness: data.rebuttalSharpness || 91,
        highlights: data.highlights || [
          currentLang === 'fr' ? 'Timing de riposte acéré' : 'Sharp rebuttal timing',
          currentLang === 'fr' ? 'Présence scénique imposante' : 'Dominant presence on stage'
        ],
      });

      if (data.scoreA && data.scoreB) {
        setJudges((prev) =>
          prev.map((j, idx) =>
            idx === 0
              ? { ...j, scoreA: data.scoreA, scoreB: data.scoreB, notes: data.verdict }
              : j
          )
        );
      }
    } catch {
      setAiVerdict({
        verdict: currentLang === 'fr'
          ? `${contenderA.name} a imposé un tempo dominant et une grande maîtrise, remportant la manche ${activeBattle.round}.`
          : `${contenderA.name} displayed dominant rhythm and timing, taking Round ${activeBattle.round} with high crowd impact.`,
        winnerName: contenderA.name,
        rhymesAndRoastsScore: 94,
        flowAndDeliveryScore: 90,
        crowdImpactScore: 96,
        rebuttalSharpness: 92,
        highlights: [
          currentLang === 'fr' ? 'Rythme scénique impitoyable' : 'Relentless rhythm on stage',
          currentLang === 'fr' ? 'Punchline décisive connectée proprement' : 'Decisive punchline connected cleanly'
        ],
      });
    } finally {
      setIsAiJudging(false);
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    // Content moderation: Automatically detect and block sexual or violent content
    const safety = checkContentSafety(commentInput);
    if (!safety.isSafe) {
      setPaidGiftNotice(
        currentLang === 'fr'
          ? safety.reasonFr || 'Commentaire bloqué : contenu inapproprié.'
          : safety.reasonEn || 'Comment blocked: explicit or violent terms prohibited.'
      );
      sounds.playDialup();
      setTimeout(() => setPaidGiftNotice(null), 4000);
      return;
    }

    setComments([
      {
        id: String(Date.now()),
        user: user ? user.name : 'Guest Spectator',
        text: commentInput.trim(),
        time: currentLang === 'fr' ? 'À l’instant' : 'Just now',
        likes: 0,
      },
      ...comments,
    ]);
    setCommentInput('');
    sounds.playCheer();
  };

  const handleDeleteComment = (commentId: string) => {
    sounds.playVineBoom();
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setPaidGiftNotice(currentLang === 'fr' ? 'Commentaire supprimé.' : 'Comment deleted.');
    setTimeout(() => setPaidGiftNotice(null), 2500);
  };

  const handleLikeComment = (commentId: string) => {
    sounds.playCheer();
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c))
    );
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Bar: Category Filter Pills + Language Selector (EN / FR) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'all', label: t.categories.all },
            { id: 'roasting', label: t.categories.roasting },
            { id: 'dance', label: t.categories.dance },
            { id: 'singing', label: t.categories.singing },
            { id: 'debate', label: currentLang === 'fr' ? 'Débats Personnalisés' : 'Customized Debates' },
            { id: 'genz_vs_millennial', label: 'Gen Z vs. Millennials' },
            { id: 'comedy', label: t.categories.comedy },
            { id: 'clout', label: t.categories.clout },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-zinc-900 text-white font-bold shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:bg-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Custom Theme Pill if active */}
          {activeCustomTheme && (
            <button
              onClick={() => setShowCustomThemeModal(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition cursor-pointer bg-amber-400 text-zinc-950 font-mono font-bold shadow-xs flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>{activeCustomTheme}</span>
            </button>
          )}

          {/* Button to set/edit custom discipline theme */}
          <button
            onClick={() => setShowCustomThemeModal(true)}
            className="px-3 py-1.5 text-xs font-mono font-semibold rounded-lg whitespace-nowrap shrink-0 transition cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 flex items-center gap-1"
          >
            <Plus className="w-3 h-3 text-zinc-600" />
            <span>{currentLang === 'fr' ? '+ Thème Personnalisé' : '+ Custom Discipline'}</span>
          </button>

          {/* Quick Category Jump to 4-Way Multi-Battler Arena */}
          <button
            onClick={() => onSelectBattle('battle_7')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition cursor-pointer border ${
              activeBattle.id === 'battle_7'
                ? 'bg-zinc-900 text-white font-bold border-zinc-900 shadow-xs'
                : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
            }`}
          >
            <span>{currentLang === 'fr' ? 'Cypher 4-Compétiteurs' : '4-Way Cypher'}</span>
          </button>

          {/* Dynamic 5-Competitor Stage Jump / Expansion */}
          <button
            onClick={() => {
              if (activeContenders.length < 5) {
                while (activeContenders.length < 5) {
                  handleAddCompetitorToStage();
                }
              }
            }}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg whitespace-nowrap shrink-0 transition cursor-pointer border ${
              activeContenders.length === 5
                ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                : 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100'
            }`}
          >
            <span>{currentLang === 'fr' ? '★ Scène 5-Compétiteurs' : '★ 5-Way Arena (5 on Screen)'}</span>
          </button>
        </div>

        {/* Language Switcher Button (English / Français) */}
        <div className="flex items-center gap-1.5 shrink-0 bg-zinc-100 border border-zinc-200 p-1 rounded-xl">
          <Globe className="w-3.5 h-3.5 text-zinc-500 ml-1.5" />
          <button
            onClick={() => handleLangChange('en')}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition cursor-pointer ${
              currentLang === 'en' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => handleLangChange('fr')}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition cursor-pointer ${
              currentLang === 'fr' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            FR
          </button>
        </div>
      </div>

      {/* Main Live Competition Room */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-sm space-y-6 relative overflow-hidden">
        
        {/* Stage Cover Photo / Banner Backdrop Image */}
        {activeBattle.stageBannerUrl && (
          <div className="relative -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 h-36 sm:h-44 overflow-hidden border-b border-zinc-200 bg-zinc-900">
            <img
              src={activeBattle.stageBannerUrl}
              alt="Stage Cover"
              className="w-full h-full object-cover opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
            <div className="absolute top-4 left-6 flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded bg-black/75 text-white text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                <span>{t.battleArena.liveStage}</span>
              </span>
              <span className="px-2.5 py-1 rounded bg-white/95 text-zinc-900 text-[10px] font-mono font-bold uppercase border border-zinc-200">
                {activeBattle.category.toUpperCase()}
              </span>
              {activeCustomTheme && (
                <span className="px-2.5 py-1 rounded bg-amber-400 text-zinc-950 text-[10px] font-mono font-black uppercase shadow-xs">
                  THEME: {activeCustomTheme}
                </span>
              )}
              <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold border border-amber-300">
                {activeBattle.mode === 'audio_openmic' ? 'AUDIO OPEN-MIC' : 'HD VIDEO STREAM'}
              </span>
              <span className="px-2.5 py-1 rounded bg-zinc-900 text-white text-[10px] font-mono font-bold">
                {activeContenders.length} {currentLang === 'fr' ? 'Compétiteurs en direct' : 'Live Competitors on Screen'}
              </span>
            </div>
          </div>
        )}

        {/* Competition Title & Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                {t.battleArena.round} {activeBattle.round} / {activeBattle.totalRounds}
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                <Users className="w-3 h-3 text-zinc-400" />
                <span>{activeBattle.audienceCount.toLocaleString()} {currentLang === 'fr' ? 'Spectateurs' : 'Viewers'}</span>
              </span>
              {activeCustomTheme && (
                <>
                  <span className="text-zinc-300">·</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold border border-amber-300 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                    <span>{currentLang === 'fr' ? 'Thème personnalisé :' : 'Custom Discipline:'} {activeCustomTheme}</span>
                  </span>
                </>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 font-display">
              {activeBattle.title}
            </h1>
            <p className="text-xs text-zinc-600 mt-1 flex items-center gap-2">
              <span className="font-semibold">{currentLang === 'fr' ? 'Sujet du duel :' : 'Competition Topic:'}</span>
              <span className="text-zinc-800 font-mono italic">"{activeBattle.topic}"</span>
            </p>
          </div>

          {/* Quick Actions Header: Prize Pot, AI Score, Step on stage */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Prize Pot */}
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-mono text-xs flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-[10px] uppercase block font-bold text-amber-700 leading-none">
                  {t.battleArena.prizePot}
                </span>
                <span className="font-black text-sm text-zinc-950">${activeBattle.prizePool}</span>
              </div>
            </div>

            {/* Like Boost Button (Boosts competition score and rewards pot) */}
            <button
              onClick={handleLikeBoost}
              className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Like Boost: adds +1 to competition and +2 virtual coins to pot"
            >
              <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" />
              <span>{t.battleArena.likeBoostButton} ({battleLikes})</span>
            </button>

            {/* AI Judge Official Scorecard Trigger */}
            <button
              onClick={handleRequestAiJudging}
              disabled={isAiJudging}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAiJudging ? t.battleArena.aiJudgingInProgress : t.battleArena.aiJudgeButton}</span>
            </button>

            {/* Step On Stage CTA */}
            <button
              onClick={handleJoinStageDirectly}
              className="px-3 py-2 rounded-xl bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-900 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Mic className="w-3.5 h-3.5 text-zinc-700" />
              <span>{t.battleArena.stepOnStage}</span>
            </button>
          </div>
        </div>

        {/* HOST RULES & PERMISSIONS STRIP (Per user specifications) */}
        <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div
              onClick={() => onViewProfile && onViewProfile({ name: activeBattle.hostName || 'Alex Rivera', handle: activeBattle.hostHandle || '@alex_battler', avatar: 'AR' })}
              className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 cursor-pointer hover:opacity-80"
              title="View Host Profile"
            >
              {activeBattle.hostName ? activeBattle.hostName.slice(0, 2).toUpperCase() : 'AR'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-900">
                  {currentLang === 'fr' ? 'Hôte :' : 'Host:'} {activeBattle.hostName || 'Alex Rivera'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {activeBattle.hostHandle || '@alex_battler'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isHostParticipant
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-zinc-200 text-zinc-700'
                }`}>
                  {isHostParticipant
                    ? (currentLang === 'fr' ? 'Hôte & Compétiteur sur Scène' : 'Host & Stage Competitor')
                    : (currentLang === 'fr' ? 'Hôte Arbitre (Non-participant)' : 'Host & Moderator (Non-participant)')}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-600 font-mono">
                <span>
                  {currentLang === 'fr' ? 'Règle de Vote :' : 'Voting Rule:'}{' '}
                  <strong>
                    {hostVotingRule === 'fifty_fifty'
                      ? '50% Juges / 50% Public'
                      : hostVotingRule === 'public_only'
                      ? (currentLang === 'fr' ? '100% Vote Public Seul' : '100% Public Votes Only')
                      : (currentLang === 'fr' ? '100% Juges Seuls' : '100% Official Judges Only')}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Host Action Controls & Media Mute Toggles */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Host Microphone Mute / Unmute Control */}
            <button
              onClick={handleToggleHostMic}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isHostMicMuted
                  ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              }`}
              title={isHostMicMuted ? 'Host mic is muted. Click to unmute.' : 'Host mic is live. Click to mute.'}
            >
              {isHostMicMuted ? <MicOff className="w-3.5 h-3.5 text-red-600" /> : <Mic className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isHostMicMuted ? (currentLang === 'fr' ? 'Micro Hôte : Coupé' : 'Host Mic: Muted') : (currentLang === 'fr' ? 'Micro Hôte : Actif' : 'Host Mic: Live')}</span>
            </button>

            {/* Host Camera On / Off Control */}
            <button
              onClick={handleToggleHostCamera}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isHostCameraOff
                  ? 'bg-zinc-100 border-zinc-300 text-zinc-600 hover:bg-zinc-200'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              }`}
              title={isHostCameraOff ? 'Host camera is off. Click to turn on.' : 'Host camera is live. Click to turn off.'}
            >
              {isHostCameraOff ? <VideoOff className="w-3.5 h-3.5 text-zinc-500" /> : <Video className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isHostCameraOff ? (currentLang === 'fr' ? 'Cam Hôte : Off' : 'Host Cam: Off') : (currentLang === 'fr' ? 'Cam Hôte : Live' : 'Host Cam: Live')}</span>
            </button>

            {/* Host Rules & Setup Modal trigger */}
            <button
              onClick={() => setShowHostRulesModal(true)}
              className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-800 font-mono font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Settings className="w-3.5 h-3.5 text-zinc-600" />
              <span>{currentLang === 'fr' ? 'Gérer Règles & Compétiteurs' : 'Host Rules & Contenders'}</span>
            </button>

            {isSeatTwoOpenToPublic && (
              <button
                onClick={handleJoinStageDirectly}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{currentLang === 'fr' ? 'Rejoindre la Scène (Micro Ouvert)' : 'Join Hot Mic Seat'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Public Judge Vote Broadcast Notice */}
        {judgeBroadcastNotice && (
          <div className="p-3.5 bg-zinc-950 text-white rounded-xl text-xs font-mono text-center font-bold flex items-center justify-center gap-2 animate-in fade-in shadow-md">
            <Gavel className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{judgeBroadcastNotice}</span>
          </div>
        )}

        {/* Like Boost Banner */}
        {likeBoostNotice && (
          <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-900 text-center font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <Flame className="w-4 h-4 text-red-600 fill-red-600" />
            <span>{likeBoostNotice}</span>
          </div>
        )}

        {/* Battle Rewards Settlement Banner */}
        {rewardsNotice && (
          <div className="p-3.5 bg-purple-50 border border-purple-300 rounded-xl text-xs text-purple-900 text-center font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <Trophy className="w-4 h-4 text-purple-700" />
            <span>{rewardsNotice}</span>
          </div>
        )}

        {/* Audio Camera Unlock Notification Banner */}
        {cameraUnlockNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 text-center font-bold flex items-center justify-center gap-2 animate-bounce">
            <Video className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{cameraUnlockNotice}</span>
          </div>
        )}

        {paidGiftNotice && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-800 text-center font-bold flex items-center justify-center gap-2">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>{paidGiftNotice}</span>
          </div>
        )}

        {betSuccessNotice && (
          <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-xl text-xs text-zinc-900 text-center font-bold flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>{betSuccessNotice}</span>
          </div>
        )}

        {/* Contenders Stage Grid (Supports up to 5 competitors in one screen) */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${activeContenders.length >= 5 ? 'lg:grid-cols-5' : activeContenders.length >= 4 ? 'lg:grid-cols-4' : activeContenders.length >= 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
          {activeContenders.map((contender, idx) => {
            const isWinnerLeading = currentLeader.id === contender.id;
            const isCameraOn = !contender.isCameraOff && (activeBattle.mode === 'video' || contender.cameraUnlocked || unlockedCameraId === contender.id);
            const betOdds = idx === 0 ? (activeBattle.betOddsA || 1.85) : (activeBattle.betOddsB || 2.10);
            const isPlayingVid = Boolean(videoPlaying[contender.id]);
            const combinedScore = finalScores[idx] || 50;

            return (
              <div
                key={contender.id}
                className={`bg-zinc-50 rounded-2xl border p-3 sm:p-4 flex flex-col justify-between min-h-[460px] shadow-xs relative transition overflow-hidden ${
                  isWinnerLeading ? 'border-zinc-900 bg-white ring-2 ring-zinc-900/10' : 'border-zinc-200'
                }`}
              >
                {/* Header tag with individual Mute/Unmute Mic and Camera controls */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200 flex-wrap gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <span className="text-[10px] font-mono font-bold text-zinc-700 uppercase">
                      Seat #{idx + 1}
                    </span>
                  </div>

                  {/* Competitor Media Controls: Mic Mute/Unmute & Camera On/Off */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleContenderMic(contender.id)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border flex items-center gap-1 transition cursor-pointer ${
                        contender.isMicMuted
                          ? 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      }`}
                      title={contender.isMicMuted ? 'Mic is muted. Click to unmute.' : 'Mic is live. Click to mute.'}
                    >
                      {contender.isMicMuted ? <MicOff className="w-2.5 h-2.5 text-red-600" /> : <Mic className="w-2.5 h-2.5 text-emerald-600" />}
                      <span>{contender.isMicMuted ? 'Muted' : 'Mic'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleContenderCamera(contender.id)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border flex items-center gap-1 transition cursor-pointer ${
                        contender.isCameraOff
                          ? 'bg-zinc-200 text-zinc-600 border-zinc-300 hover:bg-zinc-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      }`}
                      title={contender.isCameraOff ? 'Camera is off. Click to turn on.' : 'Camera is live. Click to turn off.'}
                    >
                      {contender.isCameraOff ? <VideoOff className="w-2.5 h-2.5 text-zinc-600" /> : <Video className="w-2.5 h-2.5 text-emerald-600" />}
                      <span>{contender.isCameraOff ? 'Cam Off' : 'Cam'}</span>
                    </button>
                  </div>
                </div>

                {/* Staging Photo / Video Player Stage */}
                <div className="my-2 relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-zinc-300 shadow-inner group">
                  {isCameraOn && contender.videoUrl && isPlayingVid ? (
                    <video
                      src={contender.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={contender.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                      alt={contender.name}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Stage overlay bar with clickable creator identity */}
                  <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between text-white text-xs">
                    <div
                      onClick={() => onViewProfile && onViewProfile(contender)}
                      className="flex items-center gap-2 cursor-pointer hover:opacity-90 min-w-0"
                      title="View Creator Profile"
                    >
                      <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/40 flex items-center justify-center font-bold font-mono text-[9px] shrink-0">
                        {contender.avatar}
                      </div>
                      <div className="min-w-0 truncate">
                        <div className="font-bold leading-tight hover:underline flex items-center gap-1 truncate text-[11px]">
                          <span className="truncate">{contender.name}</span>
                          <User className="w-2.5 h-2.5 text-zinc-300 shrink-0" />
                        </div>
                        <div className="text-[9px] text-zinc-300 font-mono truncate">{contender.handle}</div>
                      </div>
                    </div>

                    {/* Video toggle button */}
                    {isCameraOn && contender.videoUrl && (
                      <button
                        onClick={() =>
                          setVideoPlaying((prev) => ({ ...prev, [contender.id]: !prev[contender.id] }))
                        }
                        className="px-2 py-1 bg-black/60 hover:bg-black text-white text-[10px] font-mono rounded-lg border border-white/20 flex items-center gap-1 transition cursor-pointer shrink-0"
                      >
                        {isPlayingVid ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isPlayingVid ? (currentLang === 'fr' ? 'Pause' : 'Pause') : (currentLang === 'fr' ? 'Lire' : 'Play')}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Performer Quote & Predictions */}
                <div className="space-y-2 text-center">
                  <div className="bg-white border border-zinc-200 rounded-lg p-2 text-xs text-zinc-700 leading-relaxed shadow-2xs line-clamp-2">
                    "{contender.quote}"
                  </div>

                  {/* Prediction Bet Button */}
                  <button
                    onClick={() => handlePlaceBet(contender, betOdds)}
                    className="px-2.5 py-1 text-[10px] font-mono font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition cursor-pointer flex items-center gap-1 mx-auto"
                  >
                    <Coins className="w-3 h-3 text-amber-600" />
                    <span>
                      {currentLang === 'fr' ? 'Parier' : 'Bet'} {betAmount}c ({betOdds}x)
                    </span>
                  </button>
                </div>

                {/* Public Voting & SuperVotes */}
                <div className="space-y-2 pt-2.5 border-t border-zinc-200">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-zinc-900">
                      {combinedScore}% {currentLang === 'fr' ? 'Total' : 'Total'}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {contender.freeVotes}v · {contender.paidVotes}sv
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Regular Vote button */}
                    <button
                      onClick={() => handleFreeVote(idx)}
                      className="flex-1 py-1.5 px-2 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-semibold rounded-lg border border-zinc-300 transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                      title={t.battleArena.freeVote}
                    >
                      <Check className="w-3.5 h-3.5 text-zinc-600" />
                      <span>{t.battleArena.freeVote}</span>
                    </button>

                    {/* Paid SuperVote buttons */}
                    <button
                      onClick={() => handlePaidSuperVote(idx, 5, '5 Coin SuperVote')}
                      className="py-1.5 px-2 bg-zinc-900 hover:bg-black text-white text-xs font-mono font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                      title="5 Coins SuperVote"
                    >
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>5c</span>
                    </button>

                    <button
                      onClick={() => handlePaidSuperVote(idx, 10, '10 Coin SuperVote Boost')}
                      className="py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-mono font-black rounded-lg transition cursor-pointer flex items-center gap-1 shadow-xs"
                      title="10 Coins SuperVote Boost"
                    >
                      <Trophy className="w-3 h-3" />
                      <span>10c</span>
                    </button>
                  </div>

                  {/* Dedicated Selected Judge Click-to-Vote Row (Available to selected judges only) */}
                  <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">
                      {currentLang === 'fr' ? 'Vote Juge' : 'Judge Vote'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleJudgeClickToVote(idx)}
                      className={`px-2 py-1 text-[11px] font-mono font-bold rounded-lg flex items-center gap-1 transition cursor-pointer ${
                        isSelectedJudge
                          ? 'bg-amber-400 hover:bg-amber-500 text-zinc-950 shadow-xs'
                          : 'bg-zinc-100 text-zinc-400 border border-zinc-200 hover:bg-zinc-200'
                      }`}
                      title={
                        isSelectedJudge
                          ? `Official Judge Click to Vote: Award point to ${contender.name} (+6 pts)`
                          : 'Judge voting is restricted to selected judges only'
                      }
                    >
                      {isSelectedJudge ? <Gavel className="w-3 h-3 text-zinc-950" /> : <Lock className="w-3 h-3 text-zinc-400" />}
                      <span>{isSelectedJudge ? (currentLang === 'fr' ? 'Vote Juge (+6)' : 'Judge Vote (+6)') : (currentLang === 'fr' ? 'Réservé aux Juges' : 'Judges Only')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 JUDGES & TRIBUNAL SCORING SECTION (With Dedicated Cast Vote as Judge Button) */}
        <div className="p-4 sm:p-5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4">
          
          {/* JUDGE SEAT SELECTOR / SWITCHER: Allows testing and proves Click-to-Vote is restricted to judges only */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-bold text-zinc-900 font-mono text-[11px]">
                {currentLang === 'fr' ? 'STATUT JUGE :' : 'JUDGE ACCESS :'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isSelectedJudge ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
              }`}>
                {isSelectedJudge
                  ? (currentLang === 'fr' ? '✓ Juge Sélectionné Actif (Vote Débloqué)' : '✓ Selected Judge Active (Vote Unlocked)')
                  : (currentLang === 'fr' ? '🔒 Spectateur Public (Vote Réservé aux Juges)' : '🔒 Audience Spectator (Judge Vote Restricted)')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
              <span className="text-zinc-500 text-[10px]">{currentLang === 'fr' ? 'Siège :' : 'Role:'}</span>
              {judges.map((j) => (
                <button
                  key={j.id}
                  onClick={() => {
                    setActiveJudgeIdentity(j.id);
                    setSelectedJudgeVoterId(j.id);
                    sounds.playCheer();
                  }}
                  className={`px-2 py-1 rounded-md transition cursor-pointer ${
                    activeJudgeIdentity === j.id
                      ? 'bg-zinc-900 text-white font-bold shadow-xs'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {j.name.split(' ')[0]} (Juge)
                </button>
              ))}
              <button
                onClick={() => {
                  setActiveJudgeIdentity('audience');
                  sounds.playCheer();
                }}
                className={`px-2 py-1 rounded-md transition cursor-pointer ${
                  activeJudgeIdentity === 'audience'
                    ? 'bg-zinc-900 text-white font-bold shadow-xs'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                {currentLang === 'fr' ? 'Spectateur (Non-Juge)' : 'Spectator (Non-Judge)'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                {currentLang === 'fr' ? 'TRIBUNAL DES JUGES & SCORES PUBLICS' : 'JUDGES TRIBUNAL & PUBLIC SCORING'}
              </div>
              <h3 className="text-base font-bold text-zinc-900 font-display flex items-center gap-2 mt-0.5">
                <Gavel className="w-4 h-4 text-zinc-900" />
                <span>
                  {hostVotingRule === 'public_only'
                    ? (currentLang === 'fr' ? 'Vote Public Exclusif (100% Foule)' : '100% Public Votes Only Mode')
                    : hostVotingRule === 'judges_only'
                    ? (currentLang === 'fr' ? 'Juges Officiels Exclusifs (100% Tribunal)' : '100% Judges Only Mode')
                    : t.judgeMode.title}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 text-white font-bold ml-1">
                  {currentLang === 'fr' ? 'Meneur :' : 'Leader:'} {currentLeader.name} ({highestScore}%)
                </span>
              </h3>
            </div>

            {/* Judge Action Buttons: Cast Vote as Judge & Designate Judges */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* PRIMARY ACTION: Cast Vote as Official Judge (Available to Selected Judges Only) */}
              {isSelectedJudge ? (
                <button
                  onClick={() => setShowJudgeVotePadModal(true)}
                  className="px-3.5 py-1.5 text-xs font-bold font-mono rounded-lg bg-amber-400 hover:bg-amber-500 text-zinc-950 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Gavel className="w-3.5 h-3.5 text-zinc-950" />
                  <span>{currentLang === 'fr' ? 'Voter en tant que Juge' : 'Cast Vote as Judge'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setPaidGiftNotice(
                      currentLang === 'fr'
                        ? 'Le vote est réservé aux juges sélectionnés. Sélectionnez un siège de juge ci-dessus pour voter.'
                        : 'Judge voting is restricted to selected judges only. Switch to a judge seat above to vote.'
                    );
                    setTimeout(() => setPaidGiftNotice(null), 3500);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold font-mono rounded-lg bg-zinc-200 text-zinc-500 transition cursor-pointer flex items-center gap-1.5 opacity-80"
                  title="Restricted to selected judges only"
                >
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{currentLang === 'fr' ? 'Vote Réservé aux Juges' : 'Judges Only (Locked)'}</span>
                </button>
              )}

              <button
                onClick={() => setShowDesignateModal(true)}
                className="px-3 py-1.5 text-xs font-bold font-mono rounded-lg bg-zinc-900 hover:bg-black text-white transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{t.judgeMode.designateButton}</span>
              </button>

              <button
                onClick={handleAutoElectJudges}
                className="px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-800 transition cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.judgeMode.autoElectButton}</span>
              </button>
            </div>
          </div>

          {/* Side-by-side Score Breakdown Formula Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Public Vote Box */}
            <div className="p-3.5 bg-white border border-zinc-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-zinc-600" />
                  <span>{t.judgeMode.publicWeightLabel}</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {totalPublicSum} {currentLang === 'fr' ? 'Votes Publics' : 'Audience Votes'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-emerald-800 font-bold">{contenderA.name}: {contenderPublicPercents[0]}%</span>
                <span className="text-red-800 font-bold">{contenderB.name}: {contenderPublicPercents[1] || 0}%</span>
              </div>

              <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden flex border border-zinc-200">
                <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${contenderPublicPercents[0]}%` }} />
                <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${contenderPublicPercents[1] || 0}%` }} />
              </div>
            </div>

            {/* Judges Score Box */}
            <div className="p-3.5 bg-white border border-zinc-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                  <Gavel className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.judgeMode.judgesWeightLabel}</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {judges.length} {currentLang === 'fr' ? 'Juges Officiels Actifs' : 'Official Judges Active'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-emerald-800 font-bold">{contenderA.name}: {avgJudgeA}%</span>
                <span className="text-red-800 font-bold">{contenderB.name}: {avgJudgeB}%</span>
              </div>

              <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden flex border border-zinc-200">
                <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${avgJudgeA}%` }} />
                <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${avgJudgeB}%` }} />
              </div>
            </div>
          </div>

          {/* Combined Visual Tug-of-War Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs font-mono font-semibold">
              <span className="text-emerald-800 font-bold">
                {contenderA.name}: {finalScoreA}% {currentLang === 'fr' ? 'Score Final' : 'Final Score'}
              </span>
              <span className="text-red-800 font-bold">
                {contenderB.name}: {finalScoreB}% {currentLang === 'fr' ? 'Score Final' : 'Final Score'}
              </span>
            </div>

            <div className="w-full h-3.5 bg-zinc-200 rounded-full overflow-hidden flex shadow-inner border border-zinc-300">
              <div
                className="bg-emerald-600 h-full transition-all duration-300 flex items-center justify-center text-[9px] text-white font-mono font-bold"
                style={{ width: `${finalScoreA}%` }}
              >
                {finalScoreA}%
              </div>
              <div
                className="bg-red-600 h-full transition-all duration-300 flex items-center justify-center text-[9px] text-white font-mono font-bold"
                style={{ width: `${finalScoreB}%` }}
              >
                {finalScoreB}%
              </div>
            </div>
          </div>

          {/* The 3 Official Judges Live Public Scorecards */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono uppercase text-zinc-500 font-bold">
                {t.judgeMode.activeJudges} ({judges.length}) · {currentLang === 'fr' ? 'Scores Publiquement Affichés' : 'Scores Publicly Shown'}
              </div>
              <button
                onClick={() => setShowJudgeVotePadModal(true)}
                className="text-xs font-mono font-bold text-zinc-900 underline hover:text-black cursor-pointer"
              >
                + {currentLang === 'fr' ? 'Saisir un Vote de Juge' : 'Cast Vote as Judge'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {judges.map((judge, jIdx) => (
                <div key={judge.id} className="bg-white border border-zinc-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 border border-zinc-300 shrink-0">
                        {judge.photoUrl ? (
                          <img src={judge.photoUrl} alt={judge.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-mono font-bold text-zinc-800">
                            {judge.avatar}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-zinc-900 truncate">{judge.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono truncate">{judge.handle}</div>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-semibold border border-zinc-200">
                      {judge.designatedByOrganizer
                        ? t.judgeMode.designatedBadge
                        : t.judgeMode.publicElectedBadge}
                    </span>
                  </div>

                  {/* Official public score breakdown */}
                  <div className="flex items-center justify-between text-xs font-mono px-1">
                    <span className="text-emerald-800 font-bold">{contenderA.name.split(' ')[0]}: {judge.scoreA}%</span>
                    <span className="text-[10px] text-zinc-400">vs</span>
                    <span className="text-red-800 font-bold">{contenderB.name.split(' ')[0]}: {judge.scoreB}%</span>
                  </div>

                  {/* Public Visual Slider */}
                  <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-600 h-full" style={{ width: `${judge.scoreA}%` }} />
                    <div className="bg-red-600 h-full" style={{ width: `${judge.scoreB}%` }} />
                  </div>

                  <p className="text-[10px] text-zinc-600 italic bg-zinc-50 p-1.5 rounded-lg border border-zinc-100 truncate">
                    "{judge.notes}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Judge Official Verdict Breakdown */}
        {aiVerdict && (
          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-900">
                  {currentLang === 'fr' ? 'Décision Officielle du Juge IA' : 'Official AI Judge Decision & Analytical Breakdown'}
                </h4>
              </div>
              <button
                onClick={() => setAiVerdict(null)}
                className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-800 leading-relaxed font-mono bg-white p-3 rounded-lg border border-zinc-200">
              "{aiVerdict.verdict}"
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
              <div className="p-2 bg-white rounded-lg border border-zinc-200">
                <div className="text-[10px] text-zinc-500 uppercase">{currentLang === 'fr' ? 'Rimes & Wordplay' : 'Rhymes & Roasts'}</div>
                <div className="text-sm font-bold text-zinc-900">{aiVerdict.rhymesAndRoastsScore}/100</div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-zinc-200">
                <div className="text-[10px] text-zinc-500 uppercase">{currentLang === 'fr' ? 'Flow & Cadence' : 'Flow & Delivery'}</div>
                <div className="text-sm font-bold text-zinc-900">{aiVerdict.flowAndDeliveryScore}/100</div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-zinc-200">
                <div className="text-[10px] text-zinc-500 uppercase">{currentLang === 'fr' ? 'Impact Foule' : 'Crowd Impact'}</div>
                <div className="text-sm font-bold text-zinc-900">{aiVerdict.crowdImpactScore}/100</div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-zinc-200">
                <div className="text-[10px] text-zinc-500 uppercase">{currentLang === 'fr' ? 'Vivacité Riposte' : 'Rebuttal Sharpness'}</div>
                <div className="text-sm font-bold text-zinc-900">{aiVerdict.rebuttalSharpness}/100</div>
              </div>
            </div>
          </div>
        )}

        {/* Live Audience Queue & Comment Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-zinc-200">
          
          {/* Audience Spectator Pool */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                {t.battleArena.liveAudienceQueue}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {AUDIENCE_POOL.length} {currentLang === 'fr' ? 'en attente' : 'in pool'}
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {AUDIENCE_POOL.map((spec) => (
                <div
                  key={spec.id}
                  onClick={() => onViewProfile && onViewProfile({ name: spec.name, handle: spec.handle, avatar: spec.avatar })}
                  className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between hover:bg-zinc-100 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={spec.photoUrl} alt={spec.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-xs text-zinc-900">{spec.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{spec.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-zinc-600 border border-zinc-200">
                    {spec.preferredCategory}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Crowd Reaction Chat */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                {t.battleArena.liveChatTitle}
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-bold">
                ● Live Feed Active
              </span>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 h-48 overflow-y-auto space-y-2">
              {comments.map((cm) => {
                const isMyComment = cm.user === user?.name;
                const isHost = competitionUserRole === 'host';
                const canDelete = isMyComment || isHost;
                const isLiked = Boolean(likedChatCommentIds[cm.id]);

                return (
                  <div key={cm.id} className="text-xs leading-relaxed flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white border border-zinc-100 hover:bg-zinc-50 transition group">
                    <div className="flex items-start gap-1.5 min-w-0 flex-1">
                      <span className="font-bold text-zinc-900 font-mono text-[11px] shrink-0">{cm.user}:</span>
                      <span className="text-zinc-700 break-words">{cm.text}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-zinc-400 font-mono">{cm.time}</span>
                      {/* Like Comment button for all users */}
                      <button
                        type="button"
                        onClick={() => handleToggleLikeChatComment(cm.id)}
                        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                          isLiked ? 'text-rose-600 font-bold bg-rose-50' : 'text-zinc-400 hover:text-rose-600'
                        }`}
                        title={currentLang === 'fr' ? 'Aimer ce commentaire' : 'Like comment'}
                      >
                        <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{cm.likes && cm.likes > 0 ? cm.likes : ''}</span>
                      </button>
                      {/* Delete comment (own or host moderator) */}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDeleteChatComment(cm.id)}
                          className="p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                          title={isMyComment ? (currentLang === 'fr' ? 'Supprimer votre commentaire' : 'Delete your comment') : (currentLang === 'fr' ? 'Supprimer (Modérateur)' : 'Remove as host moderator')}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendComment} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={t.battleArena.typeComment}
                className="flex-1 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-40"
              >
                {t.battleArena.sendComment}
              </button>
            </form>
          </div>
        </div>

        {/* Automatic Virtual Rewards Distribution Panel */}
        <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-700 shrink-0" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-purple-950 font-mono">
                {t.battleArena.battleRewardsTitle}
              </h4>
            </div>
            <p className="text-xs text-purple-900 mt-1">
              Host receives <strong>20% ({hostCutCoins} Coins)</strong> virtual share. Battlers share <strong>80% ({battlersPoolCoins} Coins)</strong> based on vote proportion: {contenderA.name} ({battlerACutCoins}c) & {contenderB.name} ({battlerBCutCoins}c).
            </p>
          </div>

          <button
            onClick={handleDistributeRewards}
            disabled={rewardsDistributed}
            className="px-4 py-2 bg-purple-950 hover:bg-black text-white text-xs font-mono font-bold rounded-xl transition cursor-pointer disabled:opacity-40 shrink-0"
          >
            {rewardsDistributed
              ? (currentLang === 'fr' ? 'Récompenses Distribuées' : 'Rewards Settled')
              : t.battleArena.distributeRewardsBtn}
          </button>
        </div>
      </div>

      {/* DEDICATED JUDGE CASTING VOTE PAD MODAL (Per User Prompt) */}
      {showJudgeVotePadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-zinc-900 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                  {currentLang === 'fr' ? 'ACCÈS AU VOTE DES JUGES' : 'OFFICIAL JUDGE SCORING ACCESS'}
                </div>
                <h3 className="text-lg font-bold font-display text-zinc-900 flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-amber-600" />
                  <span>{currentLang === 'fr' ? 'Attribuer une Note de Juge en Direct' : 'Cast Vote as Official Judge'}</span>
                </h3>
              </div>
              <button onClick={() => setShowJudgeVotePadModal(false)} className="text-zinc-400 hover:text-zinc-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBroadcastJudgeVote} className="space-y-4 text-xs">
              {/* Select Judge Persona */}
              <div>
                <label className="block text-zinc-600 font-mono uppercase mb-1 font-bold">
                  {currentLang === 'fr' ? 'Sélectionnez votre Siège de Juge' : 'Select Your Judge Seat / Persona'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {judges.map((j) => (
                    <button
                      key={j.id}
                      type="button"
                      onClick={() => setSelectedJudgeVoterId(j.id)}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition cursor-pointer text-left ${
                        selectedJudgeVoterId === j.id
                          ? 'border-zinc-900 bg-zinc-900 text-white font-bold'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-zinc-700 text-white flex items-center justify-center font-bold font-mono text-[10px]">
                        {j.avatar}
                      </div>
                      <div className="truncate">
                        <div className="text-xs truncate">{j.name}</div>
                        <div className="text-[9px] opacity-70 font-mono">{j.handle}</div>
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedJudgeVoterId('custom_user')}
                    className={`p-2 rounded-xl border flex items-center gap-2 transition cursor-pointer text-left ${
                      selectedJudgeVoterId === 'custom_user'
                        ? 'border-zinc-900 bg-zinc-900 text-white font-bold'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-bold font-mono text-[10px]">
                      {user?.avatar || 'ME'}
                    </div>
                    <div className="truncate">
                      <div className="text-xs truncate">{user?.name || 'My Judge Seat'}</div>
                      <div className="text-[9px] opacity-70 font-mono">Designated Judge</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Scoring for Contender A */}
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between font-bold text-zinc-900">
                  <span className="text-emerald-800">{contenderA.name}</span>
                  <span className="font-mono">{judgeTechScoreA + judgeFlowScoreA} / 100 pts</span>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Technical Skill & Bars: {judgeTechScoreA} pts</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={judgeTechScoreA}
                    onChange={(e) => setJudgeTechScoreA(parseInt(e.target.value))}
                    className="w-full accent-zinc-900 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Flow & Stage Presence: {judgeFlowScoreA} pts</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={judgeFlowScoreA}
                    onChange={(e) => setJudgeFlowScoreA(parseInt(e.target.value))}
                    className="w-full accent-zinc-900 cursor-pointer"
                  />
                </div>
              </div>

              {/* Scoring for Contender B */}
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between font-bold text-zinc-900">
                  <span className="text-red-800">{contenderB.name}</span>
                  <span className="font-mono">{judgeTechScoreB + judgeFlowScoreB} / 100 pts</span>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Technical Skill & Bars: {judgeTechScoreB} pts</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={judgeTechScoreB}
                    onChange={(e) => setJudgeTechScoreB(parseInt(e.target.value))}
                    className="w-full accent-zinc-900 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Flow & Stage Presence: {judgeFlowScoreB} pts</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={judgeFlowScoreB}
                    onChange={(e) => setJudgeFlowScoreB(parseInt(e.target.value))}
                    className="w-full accent-zinc-900 cursor-pointer"
                  />
                </div>
              </div>

              {/* Deliberation Notes */}
              <div>
                <label className="block text-zinc-600 font-mono uppercase mb-1 font-bold">
                  {currentLang === 'fr' ? 'Critique & Notes de Délibération' : 'Judge Deliberation Notes (Publicly Shown)'}
                </label>
                <input
                  type="text"
                  required
                  value={judgeDeliberationText}
                  onChange={(e) => setJudgeDeliberationText(e.target.value)}
                  placeholder="e.g. Crisp cadence, dominant second verse rebuttal..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowJudgeVotePadModal(false)}
                  className="px-4 py-2 border border-zinc-300 rounded-xl text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                >
                  {currentLang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-950 text-white rounded-xl font-bold font-mono hover:bg-black cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentLang === 'fr' ? 'Diffuser le Score Officiel' : 'Broadcast Official Score'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HOST RULES & CONTENDERS MANAGEMENT MODAL */}
      {showHostRulesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-zinc-900 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                  {currentLang === 'fr' ? 'PARAMÈTRES DE L’HÔTE' : 'HOST RULES & SETUP'}
                </div>
                <h3 className="text-base font-bold font-display text-zinc-900 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-zinc-900" />
                  <span>{currentLang === 'fr' ? 'Fixer les Règles & Compétiteurs' : 'Fix Rules & Contender Seats'}</span>
                </h3>
              </div>
              <button onClick={() => setShowHostRulesModal(false)} className="text-zinc-400 hover:text-zinc-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Host Participation Option */}
              <div>
                <label className="block text-zinc-600 font-mono uppercase mb-1 font-bold">
                  {currentLang === 'fr' ? 'Rôle de l’Hôte' : 'Host Participation Role'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsHostParticipant(false)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer font-semibold ${
                      !isHostParticipant
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {currentLang === 'fr' ? 'Hôte Arbitre Seul' : 'Host / Moderator Only'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsHostParticipant(true)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer font-semibold ${
                      isHostParticipant
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {currentLang === 'fr' ? 'Hôte & Compétiteur' : 'Host & Stage Competitor'}
                  </button>
                </div>
              </div>

              {/* Voting Rule Fixed by Host */}
              <div>
                <label className="block text-zinc-600 font-mono uppercase mb-1 font-bold">
                  {currentLang === 'fr' ? 'Règle de Jugement Fixée par l’Hôte' : 'Voting Rules Fixed by Host'}
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'fifty_fifty', label: '50% Juges Officiels / 50% Vote Public', desc: 'Combines tribunal scores and live audience votes' },
                    { id: 'public_only', label: '100% Vote Public Uniquement', desc: 'No judges required; crowd votes determine 100% of winner' },
                    { id: 'judges_only', label: '100% Juges Officiels Seuls', desc: 'Designated judges determine 100% of the score' },
                  ].map((rule) => (
                    <div
                      key={rule.id}
                      onClick={() => setHostVotingRule(rule.id as any)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition ${
                        hostVotingRule === rule.id
                          ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                          : 'border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="font-bold text-zinc-900">{rule.label}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{rule.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Seat 2 Assignment / Open Public Slot */}
              <div>
                <label className="block text-zinc-600 font-mono uppercase mb-1 font-bold">
                  {currentLang === 'fr' ? 'Compétiteur Siège #2' : 'Contender Seat #2 Assignment'}
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hostAssignedBattler}
                      onChange={(e) => setHostAssignedBattler(e.target.value)}
                      placeholder="@handle of competitor to add"
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playVineBoom();
                        const updated = [...activeContenders];
                        if (updated[1]) {
                          updated[1].name = hostAssignedBattler.replace('@', '');
                          updated[1].handle = hostAssignedBattler;
                          updated[1].avatar = hostAssignedBattler.slice(1, 3).toUpperCase();
                          setActiveContenders(updated);
                        }
                        setIsSeatTwoOpenToPublic(false);
                        setPaidGiftNotice(
                          currentLang === 'fr'
                            ? `${hostAssignedBattler} assigné au Siège #2 !`
                            : `Assigned ${hostAssignedBattler} to Seat #2!`
                        );
                        setTimeout(() => setPaidGiftNotice(null), 3000);
                      }}
                      className="px-3 py-2 bg-zinc-900 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSeatTwoOpenToPublic(true);
                      sounds.playCheer();
                    }}
                    className={`w-full py-2 rounded-xl border font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSeatTwoOpenToPublic
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentLang === 'fr' ? 'Siège Ouvert au Public (Micro Ouvert)' : 'Open Slot for Public to Join Live'}</span>
                  </button>
                </div>
              </div>

              {/* Customised Discipline Theme input beside preset */}
              <div>
                <label className="block text-zinc-600 font-mono uppercase mb-1 font-bold">
                  {currentLang === 'fr' ? 'Thème / Discipline Personnalisée' : 'Customised Discipline Theme'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customThemeInput}
                    onChange={(e) => setCustomThemeInput(e.target.value)}
                    placeholder="e.g. Freestyle Beatbox, Poetry Slam, Speed Coding"
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
                  />
                  <button
                    type="button"
                    onClick={handleSaveCustomTheme}
                    className="px-3 py-2 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-mono font-bold rounded-xl cursor-pointer"
                  >
                    Set
                  </button>
                </div>
              </div>

              {/* Live Screen Competitors (Allows up to 5 competitors in one screen) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-600 font-mono uppercase font-bold">
                    {currentLang === 'fr' ? 'Compétiteurs sur Scène (Max 5)' : 'Stage Competitors (Max 5 on Screen)'}
                  </label>
                  <span className="font-mono font-bold text-zinc-900">
                    {activeContenders.length} / 5
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddCompetitorToStage}
                    disabled={activeContenders.length >= 5}
                    className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-black text-white font-mono font-bold transition cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{currentLang === 'fr' ? '+ Ajouter Compétiteur' : '+ Add Competitor'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveCompetitorFromStage(activeContenders[activeContenders.length - 1].id)}
                    disabled={activeContenders.length <= 2}
                    className="py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-mono font-bold transition cursor-pointer disabled:opacity-40"
                  >
                    {currentLang === 'fr' ? 'Retirer' : 'Remove'}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowHostRulesModal(false)}
                  className="px-4 py-2 bg-zinc-950 text-white rounded-xl font-bold font-mono cursor-pointer"
                >
                  {currentLang === 'fr' ? 'Appliquer les Règles' : 'Apply Rules'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK CUSTOM THEME MODAL (Accessible by host and users) */}
      {showCustomThemeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative text-zinc-900 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h3 className="text-sm font-bold font-display text-zinc-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{currentLang === 'fr' ? 'Définir un Thème Personnalisé' : 'Set Custom Discipline Theme'}</span>
              </h3>
              <button onClick={() => setShowCustomThemeModal(false)} className="text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600">
              {currentLang === 'fr'
                ? 'Personnalisez le thème de la discipline de compétition en direct en plus des catégories par défaut.'
                : 'Customize the live competition discipline theme alongside preset categories.'}
            </p>

            <input
              type="text"
              value={customThemeInput}
              onChange={(e) => setCustomThemeInput(e.target.value)}
              placeholder="e.g. Freestyle Beatbox, Comedy Roast, Afro-House"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setShowCustomThemeModal(false)}
                className="px-3 py-1.5 border border-zinc-300 rounded-xl text-xs text-zinc-700 cursor-pointer"
              >
                {currentLang === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveCustomTheme}
                className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold font-mono rounded-xl cursor-pointer"
              >
                {currentLang === 'fr' ? 'Enregistrer' : 'Save Theme'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Organizer Designate 3 Audience Judges Modal */}
      {showDesignateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-zinc-900 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-base font-bold font-display text-zinc-900">
                  {t.judgeMode.designateModalTitle}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {t.judgeMode.designateModalDesc}
                </p>
              </div>
              <button onClick={() => setShowDesignateModal(false)} className="text-zinc-400 hover:text-zinc-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono font-semibold text-zinc-700">
              {t.judgeMode.pickThreePrompt}
            </div>

            {/* Audience Pool Checkbox List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {AUDIENCE_POOL.map((spec) => {
                const isSelected = selectedAudienceIds.includes(spec.id);
                return (
                  <div
                    key={spec.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAudienceIds(selectedAudienceIds.filter((id) => id !== spec.id));
                      } else {
                        if (selectedAudienceIds.length < 3) {
                          setSelectedAudienceIds([...selectedAudienceIds, spec.id]);
                        } else {
                          setSelectedAudienceIds([selectedAudienceIds[0], selectedAudienceIds[1], spec.id]);
                        }
                      }
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={spec.photoUrl} alt={spec.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-xs text-zinc-900">{spec.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{spec.role}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                        {spec.preferredCategory}
                      </span>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                        isSelected ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] font-mono text-zinc-500 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
              {t.judgeMode.deliberationNotice}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
              <button
                onClick={() => setShowDesignateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                {t.judgeMode.cancel}
              </button>
              <button
                onClick={handleConfirmDesignation}
                disabled={selectedAudienceIds.length !== 3}
                className="px-4 py-2 text-xs font-bold font-mono text-white bg-zinc-900 hover:bg-black rounded-xl transition cursor-pointer disabled:opacity-40"
              >
                {t.judgeMode.confirmDesignation} ({selectedAudienceIds.length}/3)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
