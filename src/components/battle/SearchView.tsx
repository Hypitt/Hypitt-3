import React, { useState, useMemo } from 'react';
import {
  BattleItem,
  MediaPost,
  UserProfile,
  DreamBattle,
  BattleCategory
} from '../../types/battleTypes';
import {
  Search,
  Flame,
  Trophy,
  Coins,
  Video,
  Music,
  Image as ImageIcon,
  Users,
  Check,
  PlusCircle,
  ThumbsUp,
  Share2,
  Lock,
  Unlock,
  Download,
  Sparkles,
  ArrowRight,
  UserPlus,
  UserCheck,
  Heart,
  Play,
  Pause,
  Radio,
  Eye,
  Globe,
  X
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { Language, TRANSLATIONS } from '../../utils/i18n';

interface SearchViewProps {
  battles: BattleItem[];
  posts: MediaPost[];
  dreamBattles: DreamBattle[];
  user: UserProfile | null;
  onSelectBattle: (id: string) => void;
  onUpvoteDreamBattle: (id: string) => void;
  onCreateDreamBattle: (dream: DreamBattle) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onDownloadPost: (post: MediaPost) => void;
  onToggleFollow?: (creatorHandle: string) => void;
  onUnlockMedia?: (postId: string, costCoins: number, creatorHandle?: string) => void;
  language?: Language;
  onSelectLanguage?: (lang: Language) => void;
  onViewProfile?: (creator: any) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  battles,
  posts,
  dreamBattles,
  user,
  onSelectBattle,
  onUpvoteDreamBattle,
  onCreateDreamBattle,
  onOpenAuth,
  onDownloadPost,
  onToggleFollow,
  onUnlockMedia,
  language = 'en',
  onSelectLanguage,
  onViewProfile,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'free_battles' | 'pictures' | 'videos' | 'dream' | 'creators'>('all');
  const [showCreateDream, setShowCreateDream] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Dream battle creation state
  const [dreamTitle, setDreamTitle] = useState('');
  const [dreamCat, setDreamCat] = useState<BattleCategory>('roasting');
  const [dreamC1, setDreamC1] = useState('');
  const [dreamC2, setDreamC2] = useState('');
  const [dreamBounty, setDreamBounty] = useState(100);

  // Top creators with multidimensional ranking (Followers, Wins, Coins Generated)
  const topCreators = useMemo(() => [
    {
      name: 'Sarah Chemex',
      handle: '@sarah_pourover',
      avatar: 'SC',
      generation: 'Millennial',
      wins: 24,
      winRate: '83%',
      followers: 28400,
      coinsGenerated: 3450,
      badge: language === 'fr' ? 'Championne aux Plus de Victoires' : 'Most Wins Champion',
    },
    {
      name: 'Kai Skater',
      handle: '@kai_skates',
      avatar: 'KS',
      generation: 'Gen Z',
      wins: 18,
      winRate: '86%',
      followers: 84200,
      coinsGenerated: 4890,
      badge: language === 'fr' ? 'Meilleur Gagnant de Pièces' : 'Top Coin Earner (Patronage)',
    },
    {
      name: 'Malik Moves',
      handle: '@malik_steps',
      avatar: 'MM',
      generation: 'Creator',
      wins: 21,
      winRate: '91%',
      followers: 110000,
      coinsGenerated: 5120,
      badge: language === 'fr' ? 'Record d’Abonnés' : 'Most Followers',
    },
    {
      name: 'Jordan Melody',
      handle: '@jordan_vocals',
      avatar: 'JM',
      generation: 'Gen Z',
      wins: 14,
      winRate: '88%',
      followers: 19100,
      coinsGenerated: 2890,
      badge: language === 'fr' ? 'Champion Vocal Émergent' : 'Rising Vocals Champion',
    },
  ], [language]);

  // Filtered battles (All)
  const filteredBattles = useMemo(() => {
    return battles.filter((b) => {
      const matchQuery =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.contenderA.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.contenderB.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchQuery;
    });
  }, [battles, searchQuery]);

  // Filtered Free Live Battles
  const freeLiveBattles = useMemo(() => {
    return filteredBattles.filter((b) => b.entryType === 'free' || b.entryFee === 0);
  }, [filteredBattles]);

  // Filtered media
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchQuery =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchQuery;
    });
  }, [posts, searchQuery]);

  // Separate Pictures Feed and Videos Feed
  const picturesPosts = useMemo(() => {
    return filteredPosts.filter((p) => p.type === 'picture');
  }, [filteredPosts]);

  const videoPosts = useMemo(() => {
    return filteredPosts.filter((p) => p.type === 'video');
  }, [filteredPosts]);

  // Filtered dream battles
  const filteredDreamBattles = useMemo(() => {
    return dreamBattles.filter((d) => {
      const matchQuery =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.contender1Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.contender2Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchQuery;
    });
  }, [dreamBattles, searchQuery]);

  const handleLaunchDreamBattle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamTitle.trim() || !dreamC1.trim() || !dreamC2.trim()) return;

    if (!user) {
      onOpenAuth('login');
      return;
    }

    sounds.playCheer();
    const newDream: DreamBattle = {
      id: `dream_${Date.now()}`,
      title: dreamTitle.trim(),
      category: dreamCat,
      mode: 'video',
      contender1Name: dreamC1.trim(),
      contender1Avatar: dreamC1.trim().slice(0, 2).toUpperCase(),
      contender2Name: dreamC2.trim(),
      contender2Avatar: dreamC2.trim().slice(0, 2).toUpperCase(),
      bountyPotCoins: dreamBounty,
      upvotesCount: 1,
      proposedBy: user.name,
      userUpvoted: true,
      status: 'crowdfunding',
    };

    onCreateDreamBattle(newDream);
    setShowCreateDream(false);
    setDreamTitle('');
    setDreamC1('');
    setDreamC2('');
    setFeedbackNotice(
      language === 'fr'
        ? `Compétition de rêve "${newDream.title}" proposée avec ${dreamBounty} pièces de cagnotte !`
        : `Dream competition "${newDream.title}" proposed with ${dreamBounty} coin bounty!`
    );
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleLikePost = (postId: string) => {
    sounds.playCheer();
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
    setFeedbackNotice(
      language === 'fr'
        ? 'Like envoyé ! Le créateur gagne en notoriété.'
        : 'Liked! Creator gained clout boost.'
    );
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // Follow-to-unlock handler
  const handleFollowCreator = (authorHandle: string) => {
    if (!user) {
      onOpenAuth('login');
      return;
    }
    sounds.playCheer();
    if (onToggleFollow) {
      onToggleFollow(authorHandle);
    }
    setFeedbackNotice(
      language === 'fr'
        ? `Vous suivez désormais ${authorHandle} ! Le contenu vidéo complet est maintenant débloqué.`
        : `You are now following ${authorHandle}! Full video playback is unlocked.`
    );
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  // 5-Coin Simulated Download Handler
  const handleUnlockFiveCoinMedia = (post: MediaPost) => {
    if (!user) {
      onOpenAuth('login');
      return;
    }

    const cost = post.downloadCoinsCost || (post.downloadType === 'paid' ? 5 : 0);
    const availableCoins = user.votingCoins !== undefined ? user.votingCoins : user.coins;

    if (cost > 0 && availableCoins < cost) {
      setFeedbackNotice(
        language === 'fr'
          ? `Vous avez besoin de ${cost} pièces virtuelles. Solde actuel : ${availableCoins} pièces. Réclamez vos 100 pièces mensuelles !`
          : `Need ${cost} virtual coins. Current balance: ${availableCoins} coins. Claim your 100 monthly coins!`
      );
      setTimeout(() => setFeedbackNotice(null), 4500);
      return;
    }

    sounds.playCheer();
    if (onUnlockMedia) {
      onUnlockMedia(post.id, cost, post.authorHandle);
    } else {
      onDownloadPost(post);
    }

    setFeedbackNotice(
      language === 'fr'
        ? `Contenu "${post.title}" débloqué avec succès pour ${cost} pièces virtuelles ! (Simulation sans argent réel)`
        : `Unlocked "${post.title}" for ${cost} virtual coins! (Simulated download, no real money)`
    );
    setTimeout(() => setFeedbackNotice(null), 4500);
  };

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Toast Notice */}
      {feedbackNotice && (
        <div className="p-3 bg-zinc-900 text-white text-xs font-mono rounded-xl shadow-lg border border-zinc-700 flex items-center justify-between animate-in fade-in">
          <span>{feedbackNotice}</span>
          <button onClick={() => setFeedbackNotice(null)} className="text-zinc-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Search Bar & Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
              <span>EXPLORER & DÉCOUVRIR</span>
              <span>·</span>
              <span>PHOTOS · VIDÉOS · COMPÉTITIONS GRATUITES</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-950 font-display tracking-tight">
              {language === 'fr' ? 'Recherche & Flux Multimédia' : 'Search & Multimedia Feeds'}
            </h1>
          </div>

          {/* Language indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500">
              {language === 'fr' ? 'Mode Langue :' : 'Language Mode:'}
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
              {language.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchFeeds.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 text-zinc-900 rounded-xl text-xs outline-none transition font-sans shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Navigation Tabs (specifically requested: feed of pictures, videos, and ongoing free live battle) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-zinc-950 text-white font-bold'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            {t.searchFeeds.allContent}
          </button>

          <button
            onClick={() => setActiveFilter('free_battles')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'free_battles'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>{t.searchFeeds.freeBattles} ({freeLiveBattles.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('pictures')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'pictures'
                ? 'bg-zinc-950 text-white font-bold'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-zinc-600" />
            <span>{t.searchFeeds.picturesFeed} ({picturesPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('videos')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'videos'
                ? 'bg-zinc-950 text-white font-bold'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-zinc-600" />
            <span>{t.searchFeeds.videosFeed} ({videoPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('dream')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'dream'
                ? 'bg-zinc-950 text-white font-bold'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.searchFeeds.dreamBattles} ({filteredDreamBattles.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('creators')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'creators'
                ? 'bg-zinc-950 text-white font-bold'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.searchFeeds.topCreators}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: ONGOING FREE LIVE BATTLES FEED */}
      {(activeFilter === 'all' || activeFilter === 'free_battles') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold tracking-wider">
                  {language === 'fr' ? 'DIFFUSION EN DIRECT · ENTRÉE GRATUITE' : 'LIVE STREAMING · FREE TO ENTER & VOTE'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-zinc-900 font-display">
                {t.searchFeeds.freeBattles}
              </h2>
            </div>
            <span className="text-xs font-mono font-semibold text-zinc-500">
              {freeLiveBattles.length} {language === 'fr' ? 'compétitions en cours' : 'live now'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeLiveBattles.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl overflow-hidden shadow-xs transition flex flex-col justify-between"
              >
                {/* Battle stage visual preview banner */}
                <div className="relative h-36 bg-zinc-900 overflow-hidden">
                  <img
                    src={b.stageBannerUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'}
                    alt={b.title}
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-emerald-500 text-white font-mono text-[9px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>{b.status.toUpperCase()}</span>
                    </span>
                    <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white font-mono text-[9px] font-bold rounded uppercase">
                      {b.category}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-amber-500/90 text-black font-mono text-[10px] font-black rounded flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    <span>{b.prizePool}c Pot</span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <Users className="w-3.5 h-3.5 text-zinc-300" />
                      <span>{b.audienceCount.toLocaleString()} {language === 'fr' ? 'spectateurs' : 'watching'}</span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">
                      {language === 'fr' ? 'Vote Gratuit (1 Pièce)' : 'Vote Cost: 1 Coin'}
                    </span>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-950 font-display line-clamp-1">
                      {b.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                      {b.topic || b.title}
                    </p>
                  </div>

                  {/* Contenders Face-Off */}
                  <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-100 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs">
                        {b.contenderA.avatar}
                      </div>
                      <div className="truncate max-w-[85px]">
                        <div className="font-bold text-zinc-900 truncate">{b.contenderA.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{b.contenderA.score}%</div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-black text-zinc-400">VS</span>

                    <div className="flex items-center gap-2">
                      <div className="truncate max-w-[85px] text-right">
                        <div className="font-bold text-zinc-900 truncate">{b.contenderB.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{b.contenderB.score}%</div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-mono font-bold text-xs">
                        {b.contenderB.avatar}
                      </div>
                    </div>
                  </div>

                  {/* CTA button to enter arena */}
                  <button
                    onClick={() => onSelectBattle(b.id)}
                    className="w-full py-2 bg-zinc-950 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'fr' ? 'Rejoindre & Voter (1 Pièce)' : 'Enter Battle & Vote (1 Coin)'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: PICTURES FEED (High-Res Photos, Staging Packs, 5-Coin Simulated Downloads) */}
      {(activeFilter === 'all' || activeFilter === 'pictures') && (
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                {language === 'fr' ? 'GALERIE PHOTOS DE CRÉATEURS' : 'CREATOR PHOTOGRAPHY VAULT'}
              </div>
              <h2 className="text-lg font-bold text-zinc-900 font-display flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-zinc-800" />
                <span>{t.searchFeeds.picturesFeed}</span>
                <span className="text-xs font-mono font-normal bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                  {picturesPosts.length} {language === 'fr' ? 'photos' : 'items'}
                </span>
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              {language === 'fr' ? 'Prix Virtuel : 5 Pièces / Téléchargement' : 'Virtual Price: 5 Coins / Unlock'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {picturesPosts.map((post) => {
              const isLiked = Boolean(likedPosts[post.id]);
              const isUnlocked = user?.unlockedMediaIds?.includes(post.id);
              const cost = post.downloadCoinsCost || 5;

              return (
                <div
                  key={post.id}
                  className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-zinc-400 transition"
                >
                  {/* Photo Display Card */}
                  <div className="relative h-56 bg-zinc-100 overflow-hidden">
                    <img
                      src={post.photoUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                    />
                    
                    {/* Format pill */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white font-mono text-[9px] font-bold rounded uppercase">
                      {post.fileFormat || 'High-Res PNG'}
                    </span>

                    {/* Price pill */}
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-400 text-zinc-950 font-mono text-[10px] font-bold rounded flex items-center gap-1 shadow-xs">
                      <Coins className="w-3 h-3" />
                      <span>{post.downloadType === 'free' ? 'FREE' : `${cost}c`}</span>
                    </span>

                    {/* Unlocked overlay badge if applicable */}
                    {isUnlocked && (
                      <span className="absolute bottom-3 left-3 px-2 py-1 bg-emerald-600 text-white font-mono text-[10px] font-bold rounded flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>{language === 'fr' ? 'Débloqué' : 'Unlocked'}</span>
                      </span>
                    )}
                  </div>

                  {/* Metadata and Controls */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Author */}
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center font-mono font-bold text-[10px] text-zinc-800">
                            {post.authorAvatar}
                          </div>
                          <span className="text-xs font-bold text-zinc-800 truncate max-w-[120px]">
                            {post.authorName}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {post.fileSize || '14 MB'}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-zinc-950 font-display line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                        {post.description}
                      </p>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg transition cursor-pointer ${
                          isLiked ? 'text-red-600 bg-red-50' : 'text-zinc-500 hover:text-zinc-900 bg-zinc-50'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-600' : ''}`} />
                        <span>{post.likesCount + (isLiked ? 1 : 0)}</span>
                      </button>

                      {/* Download / Unlock Button */}
                      <button
                        onClick={() => handleUnlockFiveCoinMedia(post)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isUnlocked
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : post.downloadType === 'paid'
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                            : 'bg-zinc-950 hover:bg-black text-white'
                        }`}
                      >
                        {isUnlocked ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{language === 'fr' ? 'Télécharger' : 'Download'}</span>
                          </>
                        ) : post.downloadType === 'paid' ? (
                          <>
                            <Coins className="w-3.5 h-3.5 text-amber-700" />
                            <span>{language === 'fr' ? `Débloquer (${cost} Pièces)` : `Unlock (${cost} Coins)`}</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>{language === 'fr' ? 'Téléchargement Gratuit' : 'Free Download'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: VIDEOS FEED (Playable Staging Videos, Previews, Follow-to-Unlock, 5-Coin Downloads) */}
      {(activeFilter === 'all' || activeFilter === 'videos') && (
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                {language === 'fr' ? 'VIDÉOS EN LIGNE & CONDITIONS DE DÉBLOCAGE' : 'STREAMING PERFORMANCES & PREVIEWS'}
              </div>
              <h2 className="text-lg font-bold text-zinc-900 font-display flex items-center gap-2">
                <Video className="w-5 h-5 text-zinc-800" />
                <span>{t.searchFeeds.videosFeed}</span>
                <span className="text-xs font-mono font-normal bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                  {videoPosts.length} {language === 'fr' ? 'vidéos' : 'videos'}
                </span>
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {language === 'fr' ? 'Suivre pour débloquer les extraits complets' : 'Follow creator to unlock exclusive clips'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {videoPosts.map((post) => {
              const isFollowing = user?.followedCreatorHandles?.includes(post.authorHandle);
              const isLockedByFollow = post.requiresFollowToUnlock && !isFollowing;
              const isPlaying = playingVideoId === post.id;
              const isDownloaded = user?.unlockedMediaIds?.includes(post.id);
              const cost = post.downloadCoinsCost || 5;

              return (
                <div
                  key={post.id}
                  className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs space-y-3 p-4 hover:border-zinc-300 transition"
                >
                  {/* Author Strip */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs">
                        {post.authorAvatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                          <span>{post.authorName}</span>
                          {post.authorGeneration && (
                            <span className="text-[9px] font-mono text-zinc-400">({post.authorGeneration})</span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          {post.authorHandle} · {post.timestamp}
                        </div>
                      </div>
                    </div>

                    {/* Follow-to-unlock state badge */}
                    {post.requiresFollowToUnlock ? (
                      isFollowing ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          <span>{language === 'fr' ? 'Abonné · Débloqué' : 'Following · Unlocked'}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleFollowCreator(post.authorHandle)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-950 text-[10px] font-mono font-black transition cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>{language === 'fr' ? 'Suivre pour Débloquer' : 'Follow to Unlock'}</span>
                        </button>
                      )
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px] font-mono font-bold uppercase">
                        {post.downloadType === 'paid' ? `${cost} Coins` : 'Free'}
                      </span>
                    )}
                  </div>

                  {/* Playable Video Player / Follow Barrier */}
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-zinc-200">
                    {isLockedByFollow ? (
                      // Lock Screen when follow condition isn't met
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/90 text-white space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                          <Lock className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
                            {language === 'fr' ? 'Vidéo Réservée aux Abonnés' : 'Follow-To-Unlock Enforced'}
                          </div>
                          <p className="text-xs text-zinc-300 mt-1 max-w-xs">
                            {language === 'fr'
                              ? `Abonnez-vous à ${post.authorName} (${post.authorHandle}) pour débloquer immédiatement la lecture complète de la vidéo.`
                              : `Follow ${post.authorName} (${post.authorHandle}) to automatically unlock full video playback.`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleFollowCreator(post.authorHandle)}
                          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold font-mono rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{language === 'fr' ? `Suivre ${post.authorHandle}` : `Follow ${post.authorHandle}`}</span>
                        </button>
                      </div>
                    ) : (
                      // Video Player when unlocked
                      <video
                        src={post.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                        controls
                        poster={post.photoUrl}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Duration badge */}
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white font-mono text-[9px] rounded">
                      {post.duration || '1:15'}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-sm font-bold text-zinc-950 font-display line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                      {post.description}
                    </p>
                  </div>

                  {/* Bottom Strip: Download (5 Coins) / Like */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 font-semibold px-2 py-1 rounded-lg transition cursor-pointer ${
                        likedPosts[post.id] ? 'text-red-600 bg-red-50' : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedPosts[post.id] ? 'fill-red-600' : ''}`} />
                      <span>{post.likesCount + (likedPosts[post.id] ? 1 : 0)}</span>
                    </button>

                    <button
                      onClick={() => handleUnlockFiveCoinMedia(post)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isDownloaded
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : post.downloadType === 'paid'
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                          : 'bg-zinc-950 hover:bg-black text-white'
                      }`}
                    >
                      {isDownloaded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{language === 'fr' ? 'Téléchargé' : 'Downloaded'}</span>
                        </>
                      ) : post.downloadType === 'paid' ? (
                        <>
                          <Coins className="w-3.5 h-3.5 text-amber-700" />
                          <span>{language === 'fr' ? `Débloquer (${cost} Coins)` : `Unlock (${cost} Coins)`}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>{language === 'fr' ? 'Télécharger' : 'Download'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: PUBLIC DREAM BATTLES */}
      {(activeFilter === 'all' || activeFilter === 'dream') && (
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                {language === 'fr' ? 'FINANCÉ PAR LA COMMUNAUTÉ' : 'COMMUNITY PROPOSED & CROWDFUNDED'}
              </div>
              <h2 className="text-lg font-bold text-zinc-900 font-display flex items-center gap-2">
                <span>{t.searchFeeds.dreamBattles}</span>
                <span className="text-xs font-mono font-normal bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                  {filteredDreamBattles.length} {language === 'fr' ? 'actifs' : 'active'}
                </span>
              </h2>
            </div>

            <button
              onClick={() => {
                if (!user) onOpenAuth('login');
                else setShowCreateDream(true);
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded-xl transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Proposer une Compétition de Rêve' : 'Propose a Dream Battle'}</span>
            </button>
          </div>

          {/* Dream Battle Creation Form */}
          {showCreateDream && (
            <form
              onSubmit={handleLaunchDreamBattle}
              className="bg-zinc-50 border border-zinc-300 rounded-2xl p-5 space-y-4 shadow-sm animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <h3 className="text-xs font-bold font-mono uppercase text-zinc-800">
                  {language === 'fr' ? 'Lancer un Duel pour Vote Public' : 'Set Up Matchup for Public Upvoting'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateDream(false)}
                  className="text-xs text-zinc-400 hover:text-zinc-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
                    {language === 'fr' ? 'Titre de la compétition' : 'Battle Title'}
                  </label>
                  <input
                    type="text"
                    required
                    value={dreamTitle}
                    onChange={(e) => setDreamTitle(e.target.value)}
                    placeholder="e.g. Kai Skater vs Malik Moves Clash"
                    className="w-full bg-white border border-zinc-300 text-zinc-900 rounded-lg px-3 py-2 text-xs outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
                    {language === 'fr' ? 'Compétiteur 1' : 'Contender 1'}
                  </label>
                  <input
                    type="text"
                    required
                    value={dreamC1}
                    onChange={(e) => setDreamC1(e.target.value)}
                    placeholder="e.g. Kai Skater"
                    className="w-full bg-white border border-zinc-300 text-zinc-900 rounded-lg px-3 py-2 text-xs outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
                    {language === 'fr' ? 'Compétiteur 2' : 'Contender 2'}
                  </label>
                  <input
                    type="text"
                    required
                    value={dreamC2}
                    onChange={(e) => setDreamC2(e.target.value)}
                    placeholder="e.g. Malik Moves"
                    className="w-full bg-white border border-zinc-300 text-zinc-900 rounded-lg px-3 py-2 text-xs outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
                  <span>{language === 'fr' ? 'Cagnotte de Pièces :' : 'Bounty Coins:'}</span>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={dreamBounty}
                    onChange={(e) => setDreamBounty(parseInt(e.target.value) || 100)}
                    className="w-20 bg-white border border-zinc-300 rounded px-2 py-1 text-xs font-bold text-amber-700"
                  />
                  <span>coins</span>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-zinc-950 text-white hover:bg-black rounded-xl transition cursor-pointer"
                >
                  {language === 'fr' ? 'Publier la Cagnotte' : 'Publish Bounty'}
                </button>
              </div>
            </form>
          )}

          {/* Dream Battles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDreamBattles.map((dream) => (
              <div
                key={dream.id}
                className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-bold uppercase">
                      {dream.category}
                    </span>
                    <span className="text-amber-800 font-bold flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-600" />
                      <span>{dream.bountyPotCoins} Bounty Pot</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-950 font-display line-clamp-2">
                    {dream.title}
                  </h3>

                  {/* Versus Box */}
                  <div className="flex items-center justify-between bg-zinc-50 rounded-xl p-2.5 mt-3 border border-zinc-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-zinc-200 flex items-center justify-center text-xs font-mono font-bold text-zinc-800">
                        {dream.contender1Avatar}
                      </div>
                      <span className="text-xs font-semibold text-zinc-800 truncate max-w-[90px]">
                        {dream.contender1Name}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-black text-zinc-400">VS</span>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-800 truncate max-w-[90px]">
                        {dream.contender2Name}
                      </span>
                      <div className="w-7 h-7 rounded bg-zinc-200 flex items-center justify-center text-xs font-mono font-bold text-zinc-800">
                        {dream.contender2Avatar}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {language === 'fr' ? 'Proposé par ' : 'Proposed by '}
                    <span className="font-semibold text-zinc-700">{dream.proposedBy}</span>
                  </div>

                  <button
                    onClick={() => onUpvoteDreamBattle(dream.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                      dream.userUpvoted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{dream.upvotesCount} {language === 'fr' ? 'Votes' : 'Backers'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: TOP CREATORS */}
      {(activeFilter === 'all' || activeFilter === 'creators') && (
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                {language === 'fr' ? 'CLASSEMENT OFFICIEL DES DUÉLISTES' : 'OFFICIAL ARENA LEADERBOARD'}
              </div>
              <h2 className="text-lg font-bold text-zinc-900 font-display flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>{t.searchFeeds.topCreators}</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topCreators.map((creator, i) => (
              <div
                key={creator.handle}
                className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-3 shadow-xs hover:border-zinc-400 transition"
              >
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => onViewProfile && onViewProfile({
                      name: creator.name,
                      handle: creator.handle,
                      avatar: creator.avatar,
                      bio: creator.badge,
                      battlesWon: creator.wins,
                      coins: creator.coinsGenerated,
                      followers: creator.followers,
                    })}
                    className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition"
                    title="View Creator Profile"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs">
                      {creator.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900 text-xs hover:underline">{creator.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">{creator.handle}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-black text-amber-600">#{i + 1}</span>
                </div>

                <div className="px-2 py-1 rounded bg-zinc-50 border border-zinc-100 text-[10px] font-mono text-zinc-700 font-semibold truncate">
                  {creator.badge}
                </div>

                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-zinc-100 text-center font-mono text-xs">
                  <div>
                    <div className="font-bold text-emerald-800">{creator.wins}W</div>
                    <div className="text-[9px] text-zinc-500">{t.common.wins}</div>
                  </div>
                  <div>
                    <div className="font-bold text-amber-800">{creator.coinsGenerated}c</div>
                    <div className="text-[9px] text-zinc-500">{t.common.coins}</div>
                  </div>
                  <div>
                    <div className="font-bold text-zinc-800">{(creator.followers / 1000).toFixed(0)}k</div>
                    <div className="text-[9px] text-zinc-500">{t.common.followers}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
