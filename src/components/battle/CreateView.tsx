import React, { useState } from 'react';
import {
  BattleCategory,
  BattleMediaMode,
  BattleEntryType,
  BattleItem,
  MediaPost,
  UserProfile,
  StatusRing,
  Contender
} from '../../types/battleTypes';
import {
  PlusCircle,
  Flame,
  Radio,
  FileUp,
  Smile,
  Video,
  Mic,
  DollarSign,
  Check,
  Lock,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Gavel,
  Users,
  ShieldCheck,
  Sparkles,
  Camera,
  Music,
  Clock
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { Language, TRANSLATIONS } from '../../utils/i18n';

interface CreateViewProps {
  user: UserProfile;
  onCreateBattle: (battle: BattleItem) => void;
  onAddPost: (post: MediaPost) => void;
  onUpdateStatus: (newStatus: string) => void;
  onAddStatusRing: (ring: StatusRing) => void;
  onGoToHome: () => void;
  language?: Language;
}

const BUILT_IN_COVERS = [
  {
    id: 'cover_1',
    name: 'Neon Glow Stage',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    category: 'dance',
  },
  {
    id: 'cover_2',
    name: 'Underground Cypher Studio',
    url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80',
    category: 'roasting',
  },
  {
    id: 'cover_3',
    name: 'Warm Acoustic Lounge',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    category: 'singing',
  },
  {
    id: 'cover_4',
    name: 'Minimalist Debate Forum',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
    category: 'debate',
  },
  {
    id: 'cover_5',
    name: 'Late Night Comedy Club',
    url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1000&q=80',
    category: 'comedy',
  },
];

export const CreateView: React.FC<CreateViewProps> = ({
  user,
  onCreateBattle,
  onAddPost,
  onUpdateStatus,
  onAddStatusRing,
  onGoToHome,
  language = 'en',
}) => {
  const t = TRANSLATIONS[language];
  const [activeMode, setActiveMode] = useState<'competition' | 'post' | 'live' | 'status'>('competition');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // 1. Competition Hosting & Rules State
  const [compTitle, setCompTitle] = useState('');
  const [compCategory, setCompCategory] = useState<BattleCategory>('roasting');
  const [compMode, setCompMode] = useState<BattleMediaMode>('video');
  const [compEntryType, setCompEntryType] = useState<BattleEntryType>('free');
  const [compFee, setCompFee] = useState(15);
  const [compTopic, setCompTopic] = useState('');
  
  // Host participation: Host only (Observer/Moderator) vs Host & Competitor
  const [isHostParticipant, setIsHostParticipant] = useState<boolean>(false);
  
  // Voting & Judge rules fixed by the host
  const [votingRule, setVotingRule] = useState<'fifty_fifty' | 'public_only' | 'judges_only'>('fifty_fifty');
  const [judgeSelectionMode, setJudgeSelectionMode] = useState<'organizer_elected' | 'auto_elected_public' | 'ai_panel'>('organizer_elected');
  
  // Competitors added by host or open for public
  const [assignedContenderB, setAssignedContenderB] = useState('@dame_speed');
  const [isContenderBOpen, setIsContenderBOpen] = useState(true);
  
  // Customised discipline theme set by host
  const [customTheme, setCustomTheme] = useState('');
  const [useCustomTheme, setUseCustomTheme] = useState(false);

  // Stage Capacity (allow up to 5 competitors on screen!)
  const [stageCapacity, setStageCapacity] = useState<number>(2);

  // Cover Photo (Upload from device OR Pick built-in)
  const [coverSource, setCoverSource] = useState<'device' | 'builtin'>('builtin');
  const [selectedBuiltinCover, setSelectedBuiltinCover] = useState(BUILT_IN_COVERS[0].url);
  const [deviceCoverPreview, setDeviceCoverPreview] = useState<string | null>(null);
  const [deviceCoverFileName, setDeviceCoverFileName] = useState<string | null>(null);

  // Video 90s validation state
  const [postVideoDuration, setPostVideoDuration] = useState<number>(0);
  const [videoDurationError, setVideoDurationError] = useState<string | null>(null);

  // 2. Post Content State (with device upload test)
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postType, setPostType] = useState<'video' | 'picture' | 'music'>('video');
  const [postCategory, setPostCategory] = useState<BattleCategory>('dance');
  const [postDownloadType, setPostDownloadType] = useState<'free' | 'paid'>('paid');
  const [postPriceCoins, setPostPriceCoins] = useState<number>(5);
  const [postRequireFollow, setPostRequireFollow] = useState<boolean>(false);
  const [postDeviceFilePreview, setPostDeviceFilePreview] = useState<string | null>(null);
  const [postDeviceFileName, setPostDeviceFileName] = useState<string | null>(null);
  const [postDeviceFileSize, setPostDeviceFileSize] = useState<string | null>(null);

  // 3. Go Live State
  const [liveTitle, setLiveTitle] = useState('Open Mic Night: Accepting All Callers');
  const [liveCategory, setLiveCategory] = useState<BattleCategory>('singing');
  const [liveMode, setLiveMode] = useState<BattleMediaMode>('video');

  // 4. Status State
  const [statusText, setStatusText] = useState(user.status);
  const [statusCaption, setStatusCaption] = useState('Rehearsing for the next live clash.');
  const [statusState, setStatusState] = useState<'in_battle' | 'live_stream' | 'rehearsing' | 'open_duel'>('open_duel');

  // Device file upload for Competition Cover
  const handleCoverDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playVineBoom();
    const objectUrl = URL.createObjectURL(file);
    setDeviceCoverPreview(objectUrl);
    setDeviceCoverFileName(file.name);
    setCoverSource('device');
    showNotice(
      language === 'fr'
        ? `Photo de couverture chargée depuis l’appareil : ${file.name}`
        : `Cover photo loaded from device: ${file.name}`
    );
  };

  // Device file upload for Media Post
  const handlePostDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playVineBoom();
    const objectUrl = URL.createObjectURL(file);
    setPostDeviceFilePreview(objectUrl);
    setPostDeviceFileName(file.name);
    setPostDeviceFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    
    // Auto-detect type
    if (file.type.startsWith('video/')) {
      setPostType('video');
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = objectUrl;
      tempVideo.onloadedmetadata = () => {
        const sec = Math.round(tempVideo.duration);
        setPostVideoDuration(sec);
        if (sec > 90) {
          setVideoDurationError(
            language === 'fr'
              ? `Vidéo trop longue (${sec}s). La durée maximale autorisée est de 90 secondes.`
              : `Video exceeds limit (${sec}s). Maximum allowed length is 90 seconds.`
          );
        } else {
          setVideoDurationError(null);
        }
      };
    } else if (file.type.startsWith('image/')) {
      setPostType('picture');
      setVideoDurationError(null);
    } else if (file.type.startsWith('audio/')) {
      setPostType('music');
      setVideoDurationError(null);
    }

    showNotice(
      language === 'fr'
        ? `Fichier extrait de l'appareil : ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`
        : `File pulled from device: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`
    );
  };

  // Launch Competition Handler
  const handleLaunchCompetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compTitle.trim()) return;

    const chosenCover = coverSource === 'device' && deviceCoverPreview
      ? deviceCoverPreview
      : selectedBuiltinCover;

    const contenderAObj = isHostParticipant
      ? {
          id: user.id,
          name: user.name,
          handle: user.handle,
          avatar: user.avatar,
          generation: user.generation,
          score: 50,
          freeVotes: 0,
          paidVotes: 0,
          status: 'Host & Contender On Stage',
          isSpeaking: true,
          videoActive: compMode === 'video',
          audioActive: true,
          quote: compTopic.trim() || 'Ready on stage for the challenger.',
          followers: `${(user.followers / 1000).toFixed(1)}k`,
        }
      : {
          id: 'c_slot_1',
          name: 'Stage Contender 1',
          handle: '@contender_one',
          avatar: 'C1',
          generation: 'Gen Z' as const,
          score: 50,
          freeVotes: 0,
          paidVotes: 0,
          status: 'Active Contender',
          isSpeaking: true,
          videoActive: compMode === 'video',
          audioActive: true,
          quote: 'Taking the mic to compete live.',
          followers: '24k',
        };

    const contenderBObj = isContenderBOpen
      ? {
          id: 'open_slot',
          name: 'Open Seat (Hot Mic)',
          handle: '@challenger_ready',
          avatar: '?',
          generation: 'Creator' as const,
          score: 50,
          freeVotes: 0,
          paidVotes: 0,
          status: 'Waiting for Public Join',
          isSpeaking: false,
          videoActive: false,
          audioActive: false,
          quote: 'Click Join Hot Seat to compete live on stage!',
          followers: '—',
        }
      : {
          id: `contender_${Date.now()}`,
          name: assignedContenderB.replace('@', ''),
          handle: assignedContenderB.startsWith('@') ? assignedContenderB : `@${assignedContenderB}`,
          avatar: assignedContenderB.replace('@', '').slice(0, 2).toUpperCase(),
          generation: 'Millennial' as const,
          score: 50,
          freeVotes: 0,
          paidVotes: 0,
          status: 'Added by Host',
          isSpeaking: false,
          videoActive: compMode === 'video',
          audioActive: true,
          quote: 'Invited by host to enter this live duel.',
          followers: '18k',
        };

    const extraContenders: Contender[] = [];
    if (stageCapacity >= 3) {
      extraContenders.push({
        id: `c_slot_3_${Date.now()}`,
        name: 'Stage Contender 3',
        handle: '@contender_three',
        avatar: 'C3',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        generation: 'Creator',
        score: 50,
        freeVotes: 0,
        paidVotes: 0,
        status: 'Active Contender',
        isSpeaking: false,
        videoActive: compMode === 'video',
        audioActive: true,
        quote: 'Taking position on the stage.',
        followers: '31k',
      });
    }
    if (stageCapacity >= 4) {
      extraContenders.push({
        id: `c_slot_4_${Date.now()}`,
        name: 'Stage Contender 4',
        handle: '@contender_four',
        avatar: 'C4',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
        generation: 'Gen Z',
        score: 50,
        freeVotes: 0,
        paidVotes: 0,
        status: 'Active Contender',
        isSpeaking: false,
        videoActive: compMode === 'video',
        audioActive: true,
        quote: 'Hot mic active for the cypher.',
        followers: '19k',
      });
    }
    if (stageCapacity >= 5) {
      extraContenders.push({
        id: `c_slot_5_${Date.now()}`,
        name: 'Stage Contender 5',
        handle: '@contender_five',
        avatar: 'C5',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
        generation: 'Millennial',
        score: 50,
        freeVotes: 0,
        paidVotes: 0,
        status: 'Active Contender',
        isSpeaking: false,
        videoActive: compMode === 'video',
        audioActive: true,
        quote: 'Fifth contender locked in.',
        followers: '42k',
      });
    }

    const allContenders = [contenderAObj, contenderBObj, ...extraContenders];

    const newCompetition: BattleItem = {
      id: `comp_${Date.now()}`,
      title: compTitle.trim(),
      category: compCategory,
      customTheme: useCustomTheme && customTheme.trim() ? customTheme.trim() : undefined,
      mode: compMode,
      entryType: compEntryType,
      entryFee: compEntryType === 'paid' ? compFee : 0,
      prizePool: compEntryType === 'paid' ? compFee * 20 : 180,
      status: 'live',
      audienceCount: 190,
      round: 1,
      totalRounds: 3,
      timeRemainingSeconds: 60,
      topic: compTopic.trim() || 'Open Competition Rules',
      commentsCount: 0,
      stageBannerUrl: chosenCover,
      hostId: user.id,
      hostName: user.name,
      hostHandle: user.handle,
      isHostCompetitor: isHostParticipant,
      votingRule: votingRule,
      judgeSelectionMode: judgeSelectionMode,
      judgeWeightPercent: votingRule === 'fifty_fifty' ? 50 : votingRule === 'judges_only' ? 100 : 0,
      publicWeightPercent: votingRule === 'fifty_fifty' ? 50 : votingRule === 'public_only' ? 100 : 0,
      contenderA: contenderAObj,
      contenderB: contenderBObj,
      contenders: allContenders,
    };

    sounds.playVineBoom();
    onCreateBattle(newCompetition);
    showNotice(
      language === 'fr'
        ? `Compétition "${newCompetition.title}" lancée en direct !`
        : `Competition "${newCompetition.title}" launched live!`
    );
    setTimeout(() => onGoToHome(), 1200);
  };

  // Publish Media Post Handler
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;

    const newPost: MediaPost = {
      id: `post_${Date.now()}`,
      authorName: user.name,
      authorHandle: user.handle,
      authorAvatar: user.avatar,
      authorGeneration: user.generation,
      type: postType,
      title: postTitle.trim(),
      description: postDesc.trim() || 'Uploaded to Hypitt Media Vault.',
      category: postCategory,
      downloadType: postDownloadType,
      downloadPrice: postDownloadType === 'paid' ? 2.99 : undefined,
      downloadCoinsCost: postDownloadType === 'paid' ? postPriceCoins : 0,
      downloadCount: 0,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
      fileSize: postDeviceFileSize || (postType === 'video' ? '65 MB' : postType === 'music' ? '32 MB' : '15 MB'),
      fileFormat: postType === 'video' ? 'MP4 1080p' : postType === 'music' ? '24-bit WAV' : 'PNG High-Res',
      duration: postType !== 'picture' ? '1:45' : undefined,
      requiresFollowToUnlock: postRequireFollow,
      videoUrl: postType === 'video' ? (postDeviceFilePreview || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4') : undefined,
      photoUrl: postType === 'picture' ? (postDeviceFilePreview || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80') : undefined,
    };

    sounds.playCheer();
    onAddPost(newPost);
    showNotice(
      language === 'fr'
        ? `Contenu "${newPost.title}" publié avec succès !`
        : `Post "${newPost.title}" published to Hypitt vault!`
    );
    setTimeout(() => onGoToHome(), 1200);
  };

  // Go Live Handler
  const handleGoLive = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playCheer();
    onUpdateStatus(`Live Stage: ${liveTitle}`);
    showNotice(language === 'fr' ? 'Vous êtes maintenant en direct sur Hypitt !' : 'You are now live on Hypitt Stage.');
    setTimeout(() => onGoToHome(), 1200);
  };

  // Status Handler
  const handlePublishStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusText.trim()) return;

    sounds.playCheer();
    onUpdateStatus(statusText.trim());

    const newRing: StatusRing = {
      id: `ring_${Date.now()}`,
      creatorName: user.name,
      creatorHandle: user.handle,
      avatar: user.avatar,
      statusText: statusText.trim(),
      state: statusState,
      hasUnseenStory: true,
      storyMedia: {
        type: 'picture',
        caption: statusCaption,
        timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
      },
    };
    onAddStatusRing(newRing);

    showNotice(language === 'fr' ? 'Statut mis à jour !' : 'Status ring updated!');
    setTimeout(() => onGoToHome(), 1200);
  };

  const showNotice = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
          <span>{language === 'fr' ? 'STUDIO DE CRÉATION HYPITT' : 'HYPITT CREATION STUDIO'}</span>
          <span>·</span>
          <span>{language === 'fr' ? 'ORGANISER · CONCOURIR · PUBLIER' : 'HOST · COMPETE · BROADCAST'}</span>
        </div>
        <h1 className="text-2xl font-black text-zinc-950 font-display tracking-tight">
          {language === 'fr' ? 'Créer & Diffuser en Direct' : 'Host, Compete & Broadcast'}
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          {language === 'fr'
            ? 'Organisez une compétition en tant qu’hôte (arbitre ou compétiteur), fixez les règles de vote et chargez des fichiers depuis votre appareil.'
            : 'Host a competition (as non-competing organizer or active competitor), set judge rules, and upload files directly from your device.'}
        </p>
      </div>

      {successNotice && (
        <div className="p-3 bg-zinc-950 text-white rounded-xl text-xs font-mono text-center font-bold animate-in fade-in shadow-md">
          {successNotice}
        </div>
      )}

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-zinc-100 border border-zinc-200 rounded-2xl">
        <button
          onClick={() => setActiveMode('competition')}
          className={`py-3 px-3 text-xs font-bold rounded-xl transition cursor-pointer flex flex-col items-center gap-1.5 ${
            activeMode === 'competition'
              ? 'bg-zinc-950 text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>{language === 'fr' ? '1. Organiser une Compétition' : '1. Host Competition'}</span>
        </button>

        <button
          onClick={() => setActiveMode('post')}
          className={`py-3 px-3 text-xs font-bold rounded-xl transition cursor-pointer flex flex-col items-center gap-1.5 ${
            activeMode === 'post'
              ? 'bg-zinc-950 text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
          }`}
        >
          <Upload className="w-4 h-4 text-emerald-600" />
          <span>{language === 'fr' ? '2. Charger depuis l’Appareil' : '2. Device Upload'}</span>
        </button>

        <button
          onClick={() => setActiveMode('live')}
          className={`py-3 px-3 text-xs font-bold rounded-xl transition cursor-pointer flex flex-col items-center gap-1.5 ${
            activeMode === 'live'
              ? 'bg-zinc-950 text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
          }`}
        >
          <Radio className="w-4 h-4 text-rose-500" />
          <span>{language === 'fr' ? '3. Lancer un Direct' : '3. Go Live Stage'}</span>
        </button>

        <button
          onClick={() => setActiveMode('status')}
          className={`py-3 px-3 text-xs font-bold rounded-xl transition cursor-pointer flex flex-col items-center gap-1.5 ${
            activeMode === 'status'
              ? 'bg-zinc-950 text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
          }`}
        >
          <Smile className="w-4 h-4 text-blue-500" />
          <span>{language === 'fr' ? '4. Statut Story' : '4. Status Ring'}</span>
        </button>
      </div>

      {/* TAB 1: HOST A COMPETITION (Full host customization per user requirement) */}
      {activeMode === 'competition' && (
        <form onSubmit={handleLaunchCompetition} className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="border-b border-zinc-100 pb-4">
            <h2 className="text-lg font-bold font-display text-zinc-950 flex items-center gap-2">
              <Gavel className="w-5 h-5 text-zinc-900" />
              <span>{language === 'fr' ? 'Règles & Configuration de la Compétition' : 'Competition Hosting & Judge Rules'}</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {language === 'fr'
                ? 'Vous êtes l’hôte. Définissez si vous participez ou si vous modérez, fixez les permissions des juges et la couverture.'
                : 'As host, configure whether you compete or moderate, decide judge permissions, and select or upload a stage cover.'}
            </p>
          </div>

          {/* REQUIREMENT: HOST ROLE (Observer/Moderator vs Host & Competitor) */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2.5">
            <label className="block text-xs font-mono uppercase text-zinc-700 font-bold">
              {language === 'fr' ? 'Rôle de l’Hôte dans la Compétition' : 'Host Participation Role'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                onClick={() => setIsHostParticipant(false)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                  !isHostParticipant
                    ? 'border-zinc-950 bg-white shadow-xs'
                    : 'border-zinc-200 bg-zinc-100/50 hover:bg-white text-zinc-600'
                }`}
              >
                <input
                  type="radio"
                  name="hostRole"
                  checked={!isHostParticipant}
                  onChange={() => setIsHostParticipant(false)}
                  className="mt-0.5 text-zinc-900"
                />
                <div>
                  <div className="font-bold text-zinc-950">
                    {language === 'fr' ? 'Hôte Uniquement (Non-Participant)' : 'Host Only (Non-Participant / Moderator)'}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {language === 'fr'
                      ? 'Vous supervisez la scène et désignez les juges sans concourir dans l’arène.'
                      : 'You organize the event, fix rules, and invite battlers without competing yourself.'}
                  </div>
                </div>
              </label>

              <label
                onClick={() => setIsHostParticipant(true)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                  isHostParticipant
                    ? 'border-zinc-950 bg-white shadow-xs'
                    : 'border-zinc-200 bg-zinc-100/50 hover:bg-white text-zinc-600'
                }`}
              >
                <input
                  type="radio"
                  name="hostRole"
                  checked={isHostParticipant}
                  onChange={() => setIsHostParticipant(true)}
                  className="mt-0.5 text-zinc-900"
                />
                <div>
                  <div className="font-bold text-zinc-950">
                    {language === 'fr' ? 'Hôte & Compétiteur Actif' : 'Host & Active Competitor'}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {language === 'fr'
                      ? 'Vous prenez le Siège #1 sur scène et défendez votre titre contre les challengers.'
                      : 'You step into Seat #1 and battle live on stage against challengers.'}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Title & Topic */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-700 font-bold mb-1">
                {language === 'fr' ? 'Titre de la Compétition' : 'Competition Title'}
              </label>
              <input
                type="text"
                required
                value={compTitle}
                onChange={(e) => setCompTitle(e.target.value)}
                placeholder={
                  language === 'fr'
                    ? 'ex: Grand Cypher Freestyle, Duel de Danse Urbaine, Clash des Générations...'
                    : 'e.g. Grand Freestyle Cypher, Liquid Krump Dance Duel, Gen Z vs Millennial Roast...'
                }
                className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-950 rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-700 font-bold mb-1">
                  {language === 'fr' ? 'Catégorie' : 'Discipline'}
                </label>
                <select
                  value={compCategory}
                  onChange={(e: any) => setCompCategory(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none"
                >
                  <option value="genz_vs_millennial">Gen Z vs. Millennials</option>
                  <option value="custom_debate">{language === 'fr' ? 'Débats Personnalisés' : 'Customized Debates'}</option>
                  <option value="roasting">{language === 'fr' ? 'Compétition de Roast' : 'Roast Competition'}</option>
                  <option value="dance">{language === 'fr' ? 'Compétition de Danse' : 'Dance Competition'}</option>
                  <option value="singing">{language === 'fr' ? 'Chant Micro Ouvert' : 'Open-Mic Vocals'}</option>
                  <option value="comedy">{language === 'fr' ? 'Comédie Stand-up' : 'Standup Comedy'}</option>
                  <option value="clout">{language === 'fr' ? 'Compétitions de Notoriété' : 'Follow Competitions'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-700 font-bold mb-1">
                  {language === 'fr' ? 'Format Média' : 'Media Format'}
                </label>
                <select
                  value={compMode}
                  onChange={(e: any) => setCompMode(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none"
                >
                  <option value="video">{language === 'fr' ? 'Diffusion Vidéo Direct' : 'Live Video Stream'}</option>
                  <option value="audio_openmic">{language === 'fr' ? 'Micro Audio Ouvert (Caméra au Meneur)' : 'Audio Open-Mic (Auto-Cam)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-700 font-bold mb-1">
                  {language === 'fr' ? 'Accès Public' : 'Entry Access'}
                </label>
                <select
                  value={compEntryType}
                  onChange={(e: any) => setCompEntryType(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none"
                >
                  <option value="free">{language === 'fr' ? 'Entrée Gratuite (Public Libre)' : 'Free Entry (Open Public)'}</option>
                  <option value="paid">{language === 'fr' ? 'Enjeu avec Mise (Pièces)' : 'Stakes Pot Buy-in'}</option>
                </select>
              </div>
            </div>

            {/* Customised Discipline Theme Beside the Given One */}
            <div className="pt-1">
              <div className="flex items-center gap-2 mb-1.5">
                <input
                  type="checkbox"
                  id="customThemeCheckbox"
                  checked={useCustomTheme}
                  onChange={(e) => setUseCustomTheme(e.target.checked)}
                  className="rounded text-zinc-950 cursor-pointer"
                />
                <label htmlFor="customThemeCheckbox" className="text-xs font-bold text-zinc-800 cursor-pointer flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'fr' ? 'Définir un Thème de Discipline Personnalisé' : 'Set a Customised Discipline Theme'}</span>
                </label>
              </div>

              {useCustomTheme && (
                <input
                  type="text"
                  placeholder={
                    language === 'fr'
                      ? 'ex. Beatbox Cypher, Vogue Ballroom, Échecs Rapides Clash, Standup Roasting...'
                      : 'e.g. Freestyle Beatbox, Vogue Ballroom, Speed Chess Roast, DJ Turntablism...'
                  }
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                  className="w-full bg-white border border-zinc-300 focus:border-zinc-950 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                />
              )}
            </div>

            {/* Stage Capacity: Up to 5 Competitors in One Screen */}
            <div className="pt-1">
              <label className="block text-xs font-mono uppercase text-zinc-700 font-bold mb-1.5">
                {language === 'fr' ? 'Capacité de Compétiteurs sur Scène (Jusqu’à 5)' : 'Stage Capacity on Screen (Up to 5 Competitors)'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {[2, 3, 4, 5].map((capacity) => (
                  <button
                    key={capacity}
                    type="button"
                    onClick={() => setStageCapacity(capacity)}
                    className={`py-2 px-3 rounded-xl border transition cursor-pointer font-bold ${
                      stageCapacity === capacity
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {capacity === 2
                      ? '1v1 (2 Contenders)'
                      : `${capacity} Contenders`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* REQUIREMENT: HOST FIXES JUDGE RULES & PERMISSIONS */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-700 font-bold">
                {language === 'fr' ? 'Règles de Vote Fixées par l’Hôte' : 'Voting & Judge Rules Set by Host'}
              </label>
              <p className="text-[11px] text-zinc-500">
                {language === 'fr'
                  ? 'Choisissez si la compétition nécessite des juges avec permissions ou si elle est 100% au vote du public.'
                  : 'Decide if judges score the competition or if the winner is decided 100% by public votes.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <label
                onClick={() => setVotingRule('fifty_fifty')}
                className={`p-3 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  votingRule === 'fifty_fifty'
                    ? 'border-zinc-950 bg-white font-bold shadow-xs'
                    : 'border-zinc-200 bg-zinc-100/60 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>50% Judges / 50% Public</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-normal mt-1">
                  {language === 'fr' ? 'Formule équilibrée officielle' : 'Official balanced tournament formula'}
                </span>
              </label>

              <label
                onClick={() => setVotingRule('public_only')}
                className={`p-3 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  votingRule === 'public_only'
                    ? 'border-zinc-950 bg-white font-bold shadow-xs'
                    : 'border-zinc-200 bg-zinc-100/60 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>{language === 'fr' ? 'Vote Public Uniquement' : '100% Public Votes Only'}</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-normal mt-1">
                  {language === 'fr' ? 'Aucun juge requis, la foule décide' : 'No judges needed, crowd decides winner'}
                </span>
              </label>

              <label
                onClick={() => setVotingRule('judges_only')}
                className={`p-3 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  votingRule === 'judges_only'
                    ? 'border-zinc-950 bg-white font-bold shadow-xs'
                    : 'border-zinc-200 bg-zinc-100/60 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Gavel className="w-4 h-4 text-amber-600" />
                  <span>{language === 'fr' ? 'Tribunal de Juges 100%' : '100% Judges Tribunal'}</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-normal mt-1">
                  {language === 'fr' ? 'Juges professionnels notent' : 'Judges deliberate & cast scores'}
                </span>
              </label>
            </div>

            {/* Judge Permissions Mode */}
            {votingRule !== 'public_only' && (
              <div className="pt-2 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-zinc-600 font-medium">
                  {language === 'fr' ? 'Attribution des permissions aux juges :' : 'Judge Permission Delegation:'}
                </span>
                <select
                  value={judgeSelectionMode}
                  onChange={(e: any) => setJudgeSelectionMode(e.target.value)}
                  className="bg-white border border-zinc-300 rounded-lg px-2.5 py-1 text-xs text-zinc-900 outline-none"
                >
                  <option value="organizer_elected">
                    {language === 'fr' ? 'L’hôte désigne 3 juges en direct' : 'Host designates 3 live judges'}
                  </option>
                  <option value="auto_elected_public">
                    {language === 'fr' ? 'Auto-élection parmi les spectateurs' : 'Auto-elect from active audience'}
                  </option>
                  <option value="ai_panel">
                    {language === 'fr' ? 'Panel IA + Juges du public' : 'AI Judge + Audience Tribunal'}
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* REQUIREMENT: HOST CAN ADD COVER PHOTO FROM DEVICE OR USE BUILT-IN APP PHOTO */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-700 font-bold">
                  {language === 'fr' ? 'Photo de Couverture de la Compétition' : 'Competition Cover Photo'}
                </label>
                <p className="text-[11px] text-zinc-500">
                  {language === 'fr'
                    ? 'Chargez une photo depuis votre appareil ou choisissez une scène intégrée dans l’app.'
                    : 'Pull from device or pick an in-app built-in stage visual.'}
                </p>
              </div>

              {/* Source Toggle */}
              <div className="flex items-center gap-1 bg-zinc-200 p-1 rounded-lg text-xs font-bold font-mono">
                <button
                  type="button"
                  onClick={() => setCoverSource('builtin')}
                  className={`px-2 py-1 rounded-md transition cursor-pointer ${
                    coverSource === 'builtin' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600'
                  }`}
                >
                  {language === 'fr' ? 'Scènes Intégrées' : 'Built-In'}
                </button>
                <button
                  type="button"
                  onClick={() => setCoverSource('device')}
                  className={`px-2 py-1 rounded-md transition cursor-pointer ${
                    coverSource === 'device' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600'
                  }`}
                >
                  {language === 'fr' ? 'Appareil' : 'Device'}
                </button>
              </div>
            </div>

            {/* Option A: Upload from Device */}
            {coverSource === 'device' ? (
              <div className="space-y-3">
                <label className="border-2 border-dashed border-zinc-300 hover:border-zinc-950 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-white group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverDeviceUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-zinc-200 flex items-center justify-center text-zinc-800">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-zinc-900">
                      {deviceCoverFileName || (language === 'fr' ? 'Cliquer pour choisir sur l’appareil' : 'Click to select image from your device')}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">PNG, JPG, WebP up to 25MB</div>
                  </div>
                </label>

                {deviceCoverPreview && (
                  <div className="relative h-32 rounded-xl overflow-hidden border border-zinc-200">
                    <img src={deviceCoverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                      {deviceCoverFileName}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              // Option B: Pick from Built-In App Photos
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {BUILT_IN_COVERS.map((cov) => (
                  <div
                    key={cov.id}
                    onClick={() => setSelectedBuiltinCover(cov.url)}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 cursor-pointer transition group ${
                      selectedBuiltinCover === cov.url
                        ? 'border-zinc-950 ring-2 ring-zinc-950/20'
                        : 'border-zinc-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={cov.url} alt={cov.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                      <span className="text-[9px] text-white font-mono font-bold truncate">{cov.name}</span>
                    </div>
                    {selectedBuiltinCover === cov.url && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-zinc-950 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* REQUIREMENT: HOST CAN SEND/ADD BATTLERS ON LIVE, PUBLIC JOIN ON THEIR OWN */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-700 font-bold">
                {language === 'fr' ? 'Configuration des Compétiteurs sur Scène' : 'Stage Competitors & Battlers'}
              </label>
              <p className="text-[11px] text-zinc-500">
                {language === 'fr'
                  ? 'Assignez un compétiteur invité ou laissez le siège libre pour que le public rejoigne de lui-même.'
                  : 'Assign invited battlers or keep the hot seat open for public audience to step in live.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="p-3 bg-white border border-zinc-200 rounded-xl space-y-1">
                <span className="font-bold text-zinc-950 block">Seat #1 (Contender A)</span>
                <span className="text-[11px] text-zinc-500 font-mono block">
                  {isHostParticipant ? `${user.name} (${user.handle}) · Host` : 'Assigned Contestant 1'}
                </span>
              </label>

              <div className="p-3 bg-white border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-950">Seat #2 (Challenger)</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-zinc-600">
                    <input
                      type="checkbox"
                      checked={isContenderBOpen}
                      onChange={(e) => setIsContenderBOpen(e.target.checked)}
                      className="rounded text-zinc-950"
                    />
                    <span>{language === 'fr' ? 'Public libre de rejoindre' : 'Open seat (Public join)'}</span>
                  </label>
                </div>

                {!isContenderBOpen && (
                  <input
                    type="text"
                    value={assignedContenderB}
                    onChange={(e) => setAssignedContenderB(e.target.value)}
                    placeholder="@creator_handle to invite"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onGoToHome}
              className="px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 rounded-xl transition cursor-pointer"
            >
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-zinc-950 hover:bg-black rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{language === 'fr' ? 'Lancer la Compétition en Direct' : 'Launch Live Competition'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: DEVICE UPLOAD TEST (Pull media directly from device) */}
      {activeMode === 'post' && (
        <form onSubmit={handlePublishPost} className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="border-b border-zinc-100 pb-3">
            <h2 className="text-lg font-bold font-display text-zinc-950 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-600" />
              <span>{language === 'fr' ? 'Chargement de Médias depuis l’Appareil' : 'Device Media Upload Test'}</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {language === 'fr'
                ? 'Sélectionnez des photos, vidéos ou fichiers audio directement depuis votre téléphone ou ordinateur.'
                : 'Pulls genuine photos, videos, or audio stems directly from your local phone or computer storage.'}
            </p>
          </div>

          {/* File Picker from Device */}
          <label className="border-2 border-dashed border-zinc-300 hover:border-zinc-950 rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition bg-zinc-50/50 hover:bg-white group">
            <input
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handlePostDeviceUpload}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 group-hover:bg-zinc-200 flex items-center justify-center text-zinc-800 transition">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-zinc-900 block">
                {postDeviceFileName || (language === 'fr' ? 'Cliquer pour choisir un fichier sur l’appareil' : 'Click to browse files on your device')}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                MP4, MOV, PNG, JPG, WAV, MP3
              </span>
            </div>
          </label>

          {/* Device file preview */}
          {postDeviceFilePreview && (
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-zinc-900 truncate max-w-xs">{postDeviceFileName}</span>
                <span className="text-zinc-500">({postDeviceFileSize})</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 text-[10px] font-bold uppercase">
                {postType}
              </span>
            </div>
          )}

          {postType === 'video' && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-mono">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t.profileSection.videoMaxLimitNotice}</span>
              {postVideoDuration > 0 && (
                <span className={`ml-auto font-bold px-2 py-0.5 rounded ${postVideoDuration > 90 ? 'bg-rose-200 text-rose-950' : 'bg-amber-200 text-amber-950'}`}>
                  {postVideoDuration}s / 90s max
                </span>
              )}
            </div>
          )}

          {videoDurationError && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-mono font-bold">
              {videoDurationError}
            </div>
          )}

          {/* Title & Desc */}
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-700 font-bold mb-1">
              {language === 'fr' ? 'Titre de la Publication' : 'Post Title'}
            </label>
            <input
              type="text"
              required
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="e.g. 1080p 60fps Krump Footwork Breakdown, Uncut Cypher Routine..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-950"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-700 font-bold mb-1">
              {language === 'fr' ? 'Description' : 'Description'}
            </label>
            <textarea
              rows={2}
              value={postDesc}
              onChange={(e) => setPostDesc(e.target.value)}
              placeholder="Description of the video, photo pack, or audio stems..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-950"
            />
          </div>

          {/* Pricing & Follow-to-Unlock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-zinc-800 uppercase text-[11px]">
                  {language === 'fr' ? 'Tarification Virtuelle (5 Pièces)' : 'Simulated 5-Coin Pricing'}
                </span>
                <button
                  type="button"
                  onClick={() => setPostDownloadType(postDownloadType === 'paid' ? 'free' : 'paid')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    postDownloadType === 'paid'
                      ? 'bg-amber-400 text-zinc-950'
                      : 'bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {postDownloadType === 'paid' ? '5 Coins' : 'Free'}
                </button>
              </div>
              <p className="text-[11px] text-zinc-500">
                {language === 'fr'
                  ? 'Les spectateurs dépensent 5 pièces virtuelles pour débloquer le téléchargement simulé.'
                  : 'Viewers spend 5 virtual coins to unlock download in their vault.'}
              </p>
            </div>

            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-mono font-bold text-zinc-800 uppercase text-[11px]">
                  {language === 'fr' ? 'Suivre pour Débloquer' : 'Follow to Unlock'}
                </span>
                <input
                  type="checkbox"
                  checked={postRequireFollow}
                  onChange={(e) => setPostRequireFollow(e.target.checked)}
                  className="rounded text-zinc-950"
                />
              </label>
              <p className="text-[11px] text-zinc-500">
                {language === 'fr'
                  ? 'Verrouille la vidéo complète jusqu’à ce que l’utilisateur s’abonne à votre profil.'
                  : 'Requires viewers to follow your profile to unlock the full video playback.'}
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-zinc-950 hover:bg-black rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'fr' ? 'Publier le Contenu (+30 Pièces)' : 'Publish to Hypitt (+30 Coins)'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: GO LIVE STAGE */}
      {activeMode === 'live' && (
        <form onSubmit={handleGoLive} className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="border-b border-zinc-100 pb-3">
            <h2 className="text-lg font-bold font-display text-zinc-950 flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-500" />
              <span>{language === 'fr' ? 'Lancer une Scène en Direct' : 'Go Live on Stage'}</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {language === 'fr'
                ? 'Ouvrez un direct en continu où les spectateurs peuvent monter sur scène et concourir.'
                : 'Broadcast live and invite audience members to call in and duel.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-700 font-bold mb-1">
              {language === 'fr' ? 'Titre du Direct' : 'Stage Stream Title'}
            </label>
            <input
              type="text"
              required
              value={liveTitle}
              onChange={(e) => setLiveTitle(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-700 font-bold mb-1">Category</label>
              <select
                value={liveCategory}
                onChange={(e: any) => setLiveCategory(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none"
              >
                <option value="singing">Open-Mic Vocals</option>
                <option value="dance">Dance Cypher</option>
                <option value="roasting">Roast Duel</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-700 font-bold mb-1">Mode</label>
              <select
                value={liveMode}
                onChange={(e: any) => setLiveMode(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none"
              >
                <option value="video">Live Video Stream</option>
                <option value="audio_openmic">Audio Stage</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-2 mt-2"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>{language === 'fr' ? 'Démarrer le Direct Maintenant' : 'Start Broadcasting Now'}</span>
          </button>
        </form>
      )}

      {/* TAB 4: STATUS RING */}
      {activeMode === 'status' && (
        <form onSubmit={handlePublishStatus} className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="border-b border-zinc-100 pb-3">
            <h2 className="text-lg font-bold font-display text-zinc-950 flex items-center gap-2">
              <Smile className="w-5 h-5 text-blue-500" />
              <span>{language === 'fr' ? 'Mettre à Jour Votre Anneau de Statut' : 'Update Live Status Ring'}</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {language === 'fr'
                ? 'Affiche votre état en temps réel autour de votre avatar pour tous les utilisateurs.'
                : 'Appears on the home status ring bar for all creators.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-700 font-bold mb-1">
              {language === 'fr' ? 'Texte de Statut' : 'Status Text'}
            </label>
            <input
              type="text"
              required
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              placeholder="e.g. In Live Roast (Round 2), Open for Duels..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-950"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-700 font-bold mb-1">
              {language === 'fr' ? 'État Actuel' : 'Current State'}
            </label>
            <select
              value={statusState}
              onChange={(e: any) => setStatusState(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none"
            >
              <option value="open_duel">Open for Duels</option>
              <option value="in_battle">In Live Competition</option>
              <option value="rehearsing">Rehearsing / Staging</option>
              <option value="live_stream">Live Stream Active</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-zinc-950 hover:bg-black text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-sm"
          >
            {language === 'fr' ? 'Actualiser l’Anneau de Statut' : 'Update Status Ring'}
          </button>
        </form>
      )}

    </div>
  );
};
