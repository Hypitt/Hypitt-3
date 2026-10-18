import React, { useState } from 'react';
import { MediaPost, UserProfile, BattleCategory } from '../../types/battleTypes';
import {
  Download,
  Heart,
  Share2,
  Video,
  Music,
  Image as ImageIcon,
  PlusCircle,
  Coins,
  Play,
  Pause,
  Check,
  Lock,
  Sparkles,
  X,
  UserPlus,
  UserCheck,
  Eye,
  AlertCircle,
  MessageCircle,
  Send
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { Language, TRANSLATIONS } from '../../utils/i18n';

interface MediaFeedViewProps {
  posts: MediaPost[];
  user: UserProfile;
  onAddPost: (post: MediaPost) => void;
  onUpdateUserCoins: (delta: number) => void;
  onToggleFollow?: (creatorHandle: string) => void;
  onUnlockMedia?: (postId: string, costCoins: number, creatorHandle?: string) => void;
  language?: Language;
  onViewProfile?: (creator: any) => void;
}

export const MediaFeedView: React.FC<MediaFeedViewProps> = ({
  posts,
  user,
  onAddPost,
  onUpdateUserCoins,
  onToggleFollow,
  onUnlockMedia,
  language = 'en',
  onViewProfile,
}) => {
  const t = TRANSLATIONS[language];
  const [filterType, setFilterType] = useState<string>('all');
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [localComments, setLocalComments] = useState<Record<string, Array<{ id: string; authorName: string; text: string; timestamp: string }>>>({});

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    sounds.playCheer();
    const newC = {
      id: `c_${Date.now()}`,
      authorName: user.name,
      text,
      timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
    };
    setLocalComments((prev) => ({
      ...prev,
      [postId]: [newC, ...(prev[postId] || [])],
    }));
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setFeedbackNotice(language === 'fr' ? 'Commentaire publié !' : 'Comment posted!');
    setTimeout(() => setFeedbackNotice(null), 2500);
  };

  // Upload modal state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadType, setUploadType] = useState<'video' | 'music' | 'picture'>('video');
  const [uploadCategory, setUploadCategory] = useState<BattleCategory>('dance');
  const [uploadDownloadType, setUploadDownloadType] = useState<'free' | 'paid'>('paid');
  const [uploadCoinsCost, setUploadCoinsCost] = useState<number>(5);
  const [uploadRequireFollow, setUploadRequireFollow] = useState<boolean>(false);

  const filteredPosts =
    filterType === 'all' ? posts : posts.filter((p) => p.type === filterType);

  const handleLike = (id: string) => {
    sounds.playCheer();
    const willLike = !likedPosts[id];
    setLikedPosts((prev) => ({ ...prev, [id]: willLike }));
    if (willLike) {
      onUpdateUserCoins(2); // +2 coins for engaging
    }
  };

  const handleFollowCreator = (authorHandle: string) => {
    sounds.playCheer();
    if (onToggleFollow) {
      onToggleFollow(authorHandle);
    }
    setFeedbackNotice(
      language === 'fr'
        ? `Vous suivez désormais ${authorHandle} ! Vidéo complète débloquée.`
        : `You are now following ${authorHandle}! Full video unlocked.`
    );
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleDownload = (post: MediaPost) => {
    const cost = post.downloadCoinsCost || (post.downloadType === 'paid' ? 5 : 0);
    const availableCoins = user.votingCoins !== undefined ? user.votingCoins : user.coins;

    if (post.downloadType === 'paid') {
      if (availableCoins < cost) {
        setFeedbackNotice(
          language === 'fr'
            ? `Vous avez besoin de ${cost} pièces de vote. Vous avez ${availableCoins} pièces. Réclamez vos 100 pièces mensuelles dans votre profil !`
            : `Need ${cost} Coins for this download. You have ${availableCoins} Coins. Claim your 100 monthly coins in profile!`
        );
        setTimeout(() => setFeedbackNotice(null), 4000);
        return;
      }

      sounds.playCheer();
      if (onUnlockMedia) {
        onUnlockMedia(post.id, cost, post.authorHandle);
      } else {
        onUpdateUserCoins(-cost);
      }

      setFeedbackNotice(
        language === 'fr'
          ? `"${post.title}" débloqué pour ${cost} pièces virtuelles ! (Simulation sans argent réel)`
          : `Unlocked "${post.title}" for ${cost} Coins! Simulated download ready.`
      );
      setTimeout(() => setFeedbackNotice(null), 4000);
    } else {
      sounds.playVineBoom();
      setFeedbackNotice(
        language === 'fr'
          ? `Téléchargement gratuit de ${post.title} [${post.fileFormat}] effectué !`
          : `Downloading ${post.title} [${post.fileFormat}] for Free!`
      );
      setTimeout(() => setFeedbackNotice(null), 4000);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newPost: MediaPost = {
      id: `post_${Date.now()}`,
      authorName: user.name,
      authorHandle: user.handle,
      authorAvatar: user.avatar,
      authorGeneration: user.generation,
      type: uploadType,
      title: uploadTitle.trim(),
      description: uploadDesc.trim() || 'Uploaded to Arena Media Hub.',
      category: uploadCategory,
      downloadType: uploadDownloadType,
      downloadPrice: uploadDownloadType === 'paid' ? 2.99 : undefined,
      downloadCoinsCost: uploadDownloadType === 'paid' ? uploadCoinsCost : 0,
      downloadCount: 0,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
      fileSize: uploadType === 'video' ? '65 MB' : uploadType === 'music' ? '45 MB' : '14 MB',
      fileFormat: uploadType === 'video' ? 'MP4 1080p' : uploadType === 'music' ? '24-bit WAV' : 'High-Res PNG',
      duration: uploadType !== 'picture' ? '1:45' : undefined,
      requiresFollowToUnlock: uploadRequireFollow,
      videoUrl: uploadType === 'video' ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' : undefined,
      photoUrl: uploadType === 'picture' ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' : undefined,
    };

    onAddPost(newPost);
    onUpdateUserCoins(30); // Gamification: +30 Coins rewarded for publishing new content
    sounds.playCheer();
    setShowUploadModal(false);
    setUploadTitle('');
    setUploadDesc('');
    setFeedbackNotice(
      language === 'fr'
        ? 'Contenu publié avec succès ! +30 pièces de récompense créditées.'
        : 'Uploaded successfully! Earned +30 creator coins.'
    );
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Toast notice */}
      {feedbackNotice && (
        <div className="p-3 bg-zinc-900 text-white text-xs font-mono rounded-xl shadow-lg border border-zinc-700 flex items-center justify-between animate-in fade-in">
          <span>{feedbackNotice}</span>
          <button onClick={() => setFeedbackNotice(null)} className="text-zinc-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Feed Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
            <span>{language === 'fr' ? 'MÉDIATHÈQUE' : 'MEDIA HUB'}</span>
            <span>·</span>
            <span>{language === 'fr' ? 'PHOTOS · VIDÉOS · PISTES AUDIO' : 'PICTURES · VIDEOS · AUDIO'}</span>
            <span>·</span>
            <span>{language === 'fr' ? 'TÉLÉCHARGEMENTS SIMULÉS À 5 PIÈCES' : '5-COIN SIMULATED DOWNLOADS'}</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight font-display">
            {language === 'fr' ? 'Contenus des Créateurs & Téléchargements' : 'Creator Media & Download Vault'}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {language === 'fr'
              ? 'Dépensez vos pièces mensuelles pour débloquer les photos et vidéos (5 pièces), ou suivez les créateurs pour débloquer les vidéos complètes.'
              : 'Spend monthly coins on simulated photo/video unlocks (5 coins), or follow creators to unlock full video playback.'}
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-zinc-950 hover:bg-black rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? 'Publier (+30 Pièces)' : 'Upload Content (+30 Coins)'}</span>
        </button>
      </div>

      {/* Media Type Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-100 border border-zinc-200 rounded-xl w-fit">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
            filterType === 'all' ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          {t.searchFeeds.allContent}
        </button>
        <button
          onClick={() => setFilterType('picture')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            filterType === 'picture' ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          <ImageIcon className="w-3 h-3" />
          <span>{t.searchFeeds.picturesFeed}</span>
        </button>
        <button
          onClick={() => setFilterType('video')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            filterType === 'video' ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          <Video className="w-3 h-3" />
          <span>{t.searchFeeds.videosFeed}</span>
        </button>
        <button
          onClick={() => setFilterType('music')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            filterType === 'music' ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          <Music className="w-3 h-3" />
          <span>Music & Stems</span>
        </button>
      </div>

      {/* Posts Stream */}
      <div className="space-y-6">
        {filteredPosts.map((post) => {
          const isLiked = Boolean(likedPosts[post.id]);
          const isUnlocked = Boolean(user.unlockedMediaIds?.includes(post.id));
          const isFollowing = Boolean(user.followedCreatorHandles?.includes(post.authorHandle));
          const isLockedByFollow = post.requiresFollowToUnlock && !isFollowing;
          const isPlaying = playingMusicId === post.id;
          const costCoins = post.downloadCoinsCost || (post.downloadType === 'paid' ? 5 : 0);

          return (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4 shadow-xs"
            >
              {/* Post Author Strip */}
              <div className="flex items-center justify-between">
                <div
                  onClick={() => onViewProfile && onViewProfile({
                    name: post.authorName,
                    handle: post.authorHandle,
                    avatar: post.authorAvatar,
                    generation: post.authorGeneration,
                  })}
                  className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition"
                  title="View Creator Profile"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-mono font-bold">
                    {post.authorAvatar}
                  </div>
                  <div>
                    <div className="font-bold text-zinc-950 text-sm flex items-center gap-1.5 hover:underline">
                      <span>{post.authorName}</span>
                      {post.authorGeneration && (
                        <span className="text-[10px] font-mono text-zinc-500">
                          ({post.authorGeneration})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 font-mono">
                      {post.authorHandle} · {post.timestamp}
                    </div>
                  </div>
                </div>

                {/* Follow status / Download Status Badge */}
                <div className="flex items-center gap-2">
                  {post.requiresFollowToUnlock && (
                    isFollowing ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-emerald-600" />
                        <span>{language === 'fr' ? 'Abonné · Débloqué' : 'Following · Unlocked'}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleFollowCreator(post.authorHandle)}
                        className="text-[10px] font-mono font-black px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-950 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>{language === 'fr' ? 'Suivre pour Débloquer' : 'Follow to Unlock'}</span>
                      </button>
                    )
                  )}

                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                      post.downloadType === 'paid'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {post.downloadType === 'paid'
                      ? `${costCoins} Coins (Simulated)`
                      : 'Free Download'}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-base font-bold text-zinc-950">{post.title}</h2>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{post.description}</p>
              </div>

              {/* Visual Media Display: Video / Photo / Music */}
              {post.type === 'video' && (
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-zinc-200">
                  {isLockedByFollow ? (
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
                            ? `Abonnez-vous à ${post.authorName} pour regarder la vidéo complète.`
                            : `Follow ${post.authorName} to unlock full video playback.`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleFollowCreator(post.authorHandle)}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold font-mono rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{language === 'fr' ? `Suivre ${post.authorHandle}` : `Follow ${post.authorHandle}`}</span>
                      </button>
                    </div>
                  ) : (
                    <video
                      src={post.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                      controls
                      poster={post.photoUrl}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}

              {post.type === 'picture' && (
                <div className="relative max-h-96 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                  <img
                    src={post.photoUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover max-h-96"
                  />
                  {isUnlocked && (
                    <span className="absolute bottom-3 left-3 px-2 py-1 bg-emerald-600 text-white font-mono text-[10px] font-bold rounded flex items-center gap-1 shadow-sm">
                      <Check className="w-3 h-3" />
                      <span>{language === 'fr' ? 'Débloqué pour Téléchargement' : 'Unlocked for Download'}</span>
                    </span>
                  )}
                </div>
              )}

              {/* Audio Stems Viewport */}
              {post.type === 'music' && (
                <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900">
                        {post.fileFormat} {post.duration && `· ${post.duration}`}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        File Size: {post.fileSize} · {post.downloadCount + (isUnlocked ? 1 : 0)} Total Downloads
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playVineBoom();
                      setPlayingMusicId(isPlaying ? null : post.id);
                    }}
                    className="p-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-900 rounded-lg transition cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause' : 'Listen'}</span>
                  </button>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 transition cursor-pointer ${
                      isLiked ? 'text-red-600 font-bold' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-600' : ''}`} />
                    <span>{post.likesCount + (isLiked ? 1 : 0)}</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playVineBoom();
                      setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }));
                    }}
                    className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition cursor-pointer"
                    title={language === 'fr' ? 'Commentaires' : 'Comments'}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount + (localComments[post.id]?.length || 0)}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Share2 className="w-4 h-4" />
                    <span>{post.sharesCount}</span>
                  </div>
                </div>

                {/* Download / Unlock Button */}
                <button
                  onClick={() => handleDownload(post)}
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
                      <span>{language === 'fr' ? 'Téléchargé' : 'Downloaded'}</span>
                    </>
                  ) : post.downloadType === 'paid' ? (
                    <>
                      <Coins className="w-3.5 h-3.5 text-amber-700" />
                      <span>{language === 'fr' ? `Débloquer (${costCoins} Pièces)` : `Unlock (${costCoins} Coins)`}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Téléchargement Gratuit' : 'Free Download'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Expandable Comments Drawer */}
              {openComments[post.id] && (
                <div className="mt-3 pt-3 border-t border-zinc-100 space-y-2.5 animate-in fade-in">
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {/* Pre-existing comments */}
                    {(post.comments || []).map((c) => (
                      <div key={c.id} className="text-xs p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                          <span className="font-bold text-zinc-800">{c.authorName}</span>
                          <span>{c.timestamp}</span>
                        </div>
                        <div className="text-zinc-700 mt-0.5">{c.text}</div>
                      </div>
                    ))}

                    {/* Locally added comments */}
                    {(localComments[post.id] || []).map((c) => (
                      <div key={c.id} className="text-xs p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                          <span className="font-bold text-zinc-800">{c.authorName}</span>
                          <span>{c.timestamp}</span>
                        </div>
                        <div className="text-zinc-700 mt-0.5">{c.text}</div>
                      </div>
                    ))}

                    {(!post.comments?.length && !localComments[post.id]?.length) && (
                      <div className="text-[11px] text-zinc-400 italic text-center py-2 font-mono">
                        {language === 'fr' ? 'Aucun commentaire. Soyez le premier à commenter !' : 'No comments yet. Be the first to comment!'}
                      </div>
                    )}
                  </div>

                  {/* Add comment form */}
                  <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder={language === 'fr' ? 'Ajouter un commentaire...' : 'Add a comment on this media...'}
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                    />
                    <button
                      type="submit"
                      disabled={!commentInputs[post.id]?.trim()}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-40 transition flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>{language === 'fr' ? 'Publier' : 'Post'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-bold font-display text-zinc-900">
                {language === 'fr' ? 'Publier du Contenu & Gagner des Pièces' : 'Publish Media & Earn Coins'}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-600 mb-1">
                  {language === 'fr' ? 'Titre' : 'Title'}
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. 60-Sec High-Definition Battle Footwork"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-600 mb-1">
                  {language === 'fr' ? 'Description' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="Description of the video or picture..."
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-600 mb-1">
                    {language === 'fr' ? 'Type de média' : 'Media Type'}
                  </label>
                  <select
                    value={uploadType}
                    onChange={(e: any) => setUploadType(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 outline-none"
                  >
                    <option value="picture">{language === 'fr' ? 'Photo' : 'Picture / Photo'}</option>
                    <option value="video">{language === 'fr' ? 'Vidéo' : 'Video'}</option>
                    <option value="music">Music & Stems</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-600 mb-1">
                    {language === 'fr' ? 'Catégorie' : 'Category'}
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e: any) => setUploadCategory(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 outline-none"
                  >
                    <option value="dance">Live Dance</option>
                    <option value="roasting">Roast Arena</option>
                    <option value="singing">Open-Mic Vocals</option>
                    <option value="debate">Debates</option>
                    <option value="comedy">Comedy</option>
                    <option value="clout">Clout</option>
                  </select>
                </div>
              </div>

              {/* Virtual 5 Coin Pricing Option */}
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase font-bold text-zinc-700">
                    {language === 'fr' ? 'Tarification Virtuelle (5 Pièces)' : 'Simulated 5-Coin Price'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUploadDownloadType('free')}
                      className={`px-2 py-1 rounded text-[11px] font-bold ${
                        uploadDownloadType === 'free' ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {language === 'fr' ? 'Gratuit' : 'Free'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadDownloadType('paid');
                        setUploadCoinsCost(5);
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-bold ${
                        uploadDownloadType === 'paid' ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      5 Coins
                    </button>
                  </div>
                </div>

                {uploadType === 'video' && (
                  <label className="flex items-center gap-2 pt-2 border-t border-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uploadRequireFollow}
                      onChange={(e) => setUploadRequireFollow(e.target.checked)}
                      className="rounded text-zinc-900"
                    />
                    <span className="text-[11px] text-zinc-700 font-semibold">
                      {language === 'fr' ? 'Condition : Suivre pour débloquer la vidéo complète' : 'Require viewers to follow you to unlock full video'}
                    </span>
                  </label>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-zinc-300 rounded-xl text-zinc-700 hover:bg-zinc-100"
                >
                  {t.judgeMode.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 text-white rounded-xl hover:bg-black font-bold"
                >
                  {language === 'fr' ? 'Publier le Média (+30 Pièces)' : 'Publish Media (+30 Coins)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
