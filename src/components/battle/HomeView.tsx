import React, { useState } from 'react';
import {
  BattleItem,
  MediaPost,
  UserProfile,
  StatusRing
} from '../../types/battleTypes';
import { StatusRingsBar } from './StatusRingsBar';
import {
  Heart,
  MessageCircle,
  Download,
  Video,
  Music,
  Image as ImageIcon,
  UserPlus,
  Check,
  Lock,
  Share2,
  ArrowRight,
  Radio,
  Flame,
  Users
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

import { Language } from '../../utils/i18n';

interface HomeViewProps {
  statusRings: StatusRing[];
  battles: BattleItem[];
  selectedBattleId: string;
  onSelectBattle: (id: string) => void;
  posts: MediaPost[];
  user: UserProfile;
  onUpdateUserCoins: (delta: number) => void;
  onJoinBattle: (battleId: string) => void;
  onOpenCreate: () => void;
  onChallengeCreator: (creatorName: string) => void;
  onSendDM?: (creatorName: string) => void;
  onOpenSearch?: () => void;
  onViewProfile?: (creator: any) => void;
  onAddStatusRing?: (story: StatusRing) => void;
  language?: Language;
}

export const HomeView: React.FC<HomeViewProps> = ({
  statusRings,
  battles,
  selectedBattleId,
  onSelectBattle,
  posts,
  user,
  onUpdateUserCoins,
  onJoinBattle,
  onOpenCreate,
  onChallengeCreator,
  onSendDM,
  onOpenSearch,
  onViewProfile,
  onAddStatusRing,
  language = 'en',
}) => {
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [downloadedPosts, setDownloadedPosts] = useState<Record<string, boolean>>({});
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const activeBattle = battles.find((b) => b.id === selectedBattleId) || battles[0];

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const toggleFollow = (handle: string, name?: string) => {
    sounds.playCheer();
    const willFollow = !followedCreators[handle];
    setFollowedCreators((prev) => ({ ...prev, [handle]: willFollow }));
    if (willFollow) {
      onUpdateUserCoins(5);
      showToast(`Following ${name || handle}. Earned +5 Coins!`);
    } else {
      showToast(`Unfollowed ${name || handle}`);
    }
  };

  const handleLike = (id: string) => {
    sounds.playCheer();
    const willLike = !likedPosts[id];
    setLikedPosts((prev) => ({ ...prev, [id]: willLike }));
    if (willLike) {
      onUpdateUserCoins(2);
    }
  };

  const handleDownload = (post: MediaPost) => {
    if (post.downloadType === 'paid') {
      const priceCoins = post.downloadCoinsCost || 5;
      if (user.coins < priceCoins) {
        showToast(`Need ${priceCoins} coins. Check your Profile to claim 100 monthly coins.`);
        return;
      }
      onUpdateUserCoins(-priceCoins);
      sounds.playCheer();
      setDownloadedPosts((prev) => ({ ...prev, [post.id]: true }));
      showToast(`Unlocked "${post.title}" (${priceCoins} coins). Ready for download.`);
    } else {
      sounds.playVineBoom();
      setDownloadedPosts((prev) => ({ ...prev, [post.id]: true }));
      showToast(`Downloaded "${post.title}" for free.`);
    }
  };

  const handleCopyInvite = () => {
    sounds.playCheer();
    navigator.clipboard?.writeText(window.location.origin);
    onUpdateUserCoins(25);
    showToast('Invite link copied. Earned +25 Coins!');
  };

  const categories = [
    { id: 'all', label: language === 'fr' ? 'Tous les Flux' : 'All Feeds' },
    { id: 'genz_vs_millennial', label: 'Gen Z vs. Millennials' },
    { id: 'custom_debate', label: language === 'fr' ? 'Débats Personnalisés' : 'Customized Debates' },
    { id: 'dance', label: language === 'fr' ? 'Danse' : 'Dance' },
    { id: 'roasting', label: language === 'fr' ? 'Roast' : 'Roast Competition' },
    { id: 'singing', label: language === 'fr' ? 'Chant & Micro' : 'Vocals & Open Mic' },
    { id: 'comedy', label: language === 'fr' ? 'Comédie' : 'Standup Comedy' },
  ];

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter((p) => p.category === selectedCategory || (selectedCategory === 'custom_debate' && p.category === 'debate'));

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Toast message banner */}
      {toastNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-4 py-2 rounded-xl text-xs font-medium shadow-xl border border-zinc-700 animate-in fade-in duration-200">
          {toastNotice}
        </div>
      )}

      {/* 1. Status Rings Bar with picture support */}
      <StatusRingsBar
        statusRings={statusRings}
        currentUser={user}
        onOpenUpdateStatus={onOpenCreate}
        onChallengeCreator={onChallengeCreator}
        onSendDM={onSendDM}
        onAddStatusStory={onAddStatusRing}
        language={language}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* 2. Featured Live Competition Spotlight Card */}
        {activeBattle && (
          <section className="relative rounded-2xl bg-zinc-950 text-white overflow-hidden border border-zinc-800 shadow-xl">
            {/* Background cover image with subtle gradient overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url(${activeBattle.stageBannerUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />

            <div className="relative p-6 sm:p-8 space-y-6">
              {/* Header metadata */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600/90 text-white text-[11px] font-mono font-bold uppercase tracking-wider">
                    <Radio className="w-3 h-3 animate-pulse" />
                    LIVE STAGE
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 text-[11px] font-mono uppercase">
                    {activeBattle.category}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                    <Users className="w-3 h-3 text-zinc-400" />
                    {activeBattle.audienceCount} watching
                  </span>
                </div>

                <div className="text-xs font-mono text-zinc-400">
                  {activeBattle.hostName ? (
                    <span>Hosted by <strong className="text-white font-medium">{activeBattle.hostName}</strong></span>
                  ) : (
                    <span>Hypitt Official Stage</span>
                  )}
                </div>
              </div>

              {/* Title & Topic */}
              <div className="space-y-1.5 max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
                  {activeBattle.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
                  {activeBattle.topic || 'Live duel on the Hypitt stage. Score is determined by live audience and official judges.'}
                </p>
              </div>

              {/* Contenders Faceoff Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                {/* Contender A */}
                <div
                  onClick={() => onViewProfile && onViewProfile(activeBattle.contenderA)}
                  className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-white shrink-0">
                      {activeBattle.contenderA.avatar}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{activeBattle.contenderA.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono truncate">{activeBattle.contenderA.handle}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-bold font-mono text-zinc-100">{activeBattle.contenderA.score}%</div>
                    <div className="text-[9px] text-zinc-500 uppercase font-mono">Current</div>
                  </div>
                </div>

                {/* Contender B */}
                <div
                  onClick={() => onViewProfile && onViewProfile(activeBattle.contenderB)}
                  className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-white shrink-0">
                      {activeBattle.contenderB.avatar}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{activeBattle.contenderB.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono truncate">{activeBattle.contenderB.handle}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-bold font-mono text-zinc-100">{activeBattle.contenderB.score}%</div>
                    <div className="text-[9px] text-zinc-500 uppercase font-mono">Current</div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectBattle(activeBattle.id)}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <span>Enter Competition Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onOpenCreate}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold transition cursor-pointer"
                >
                  Host a Competition
                </button>

                <button
                  onClick={handleCopyInvite}
                  className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition cursor-pointer ml-auto"
                  title="Share link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 3. Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 4. Trending Creator Content Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-display text-zinc-950">Trending Creator Content</h3>
              <p className="text-xs text-zinc-500">Audio tracks, clips, and visual art from verified community creators.</p>
            </div>
            <button
              onClick={onOpenCreate}
              className="text-xs font-semibold text-zinc-900 hover:underline cursor-pointer"
            >
              + Upload Media
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPosts.map((post) => {
              const isFollowed = Boolean(followedCreators[post.authorHandle]);
              const isLiked = Boolean(likedPosts[post.id]);
              const isDownloaded = Boolean(downloadedPosts[post.id]);

              return (
                <article
                  key={post.id}
                  className="rounded-xl border border-zinc-200 p-4 space-y-3.5 bg-white hover:border-zinc-300 transition shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    {/* Author header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                      <div
                        onClick={() => onViewProfile && onViewProfile({ name: post.authorName, handle: post.authorHandle, avatar: post.authorAvatar })}
                        className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition min-w-0"
                      >
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-mono font-bold text-zinc-800 shrink-0">
                          {post.authorAvatar}
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-zinc-900 text-xs truncate hover:underline">{post.authorName}</div>
                          <div className="text-[10px] text-zinc-400 font-mono truncate">{post.authorHandle}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFollow(post.authorHandle, post.authorName)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1 ${
                          isFollowed
                            ? 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                            : 'bg-zinc-900 text-white hover:bg-black'
                        }`}
                      >
                        {isFollowed ? <Check className="w-3 h-3 text-emerald-600" /> : <UserPlus className="w-3 h-3" />}
                        <span>{isFollowed ? 'Following' : 'Follow'}</span>
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="pt-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-zinc-400 mb-1">
                        {post.type === 'video' && <Video className="w-3 h-3" />}
                        {post.type === 'music' && <Music className="w-3 h-3" />}
                        {post.type === 'picture' && <ImageIcon className="w-3 h-3" />}
                        <span>{post.type}</span>
                        <span>·</span>
                        <span>{post.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 font-display line-clamp-1">{post.title}</h4>
                      <p className="text-xs text-zinc-600 mt-1 line-clamp-2 leading-relaxed font-sans">
                        {post.description}
                      </p>
                    </div>

                    {/* Media specifications badge */}
                    <div className="mt-3 p-2 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                      <span>{post.type === 'picture' ? (language === 'fr' ? 'Photo HD' : 'HD Photo') : post.fileFormat} {post.duration && `· ${post.duration}`}</span>
                      <span className="text-zinc-900 font-medium">
                        {post.downloadType === 'paid' ? `${post.downloadCoinsCost || 5} Coins` : 'Free'}
                      </span>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1 cursor-pointer transition ${
                          isLiked ? 'text-rose-600 font-bold' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                        <span>{post.likesCount + (isLiked ? 1 : 0)}</span>
                      </button>
                      <div className="flex items-center gap-1 text-zinc-400">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.commentsCount}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(post)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                        post.downloadType === 'paid'
                          ? 'bg-zinc-900 hover:bg-black text-white'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200'
                      }`}
                    >
                      {isDownloaded ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Saved</span>
                        </>
                      ) : post.downloadType === 'paid' ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Unlock ({post.downloadCoinsCost || 5}c)</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
