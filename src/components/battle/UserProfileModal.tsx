import React, { useState } from 'react';
import { UserProfile, MediaPost, PostComment } from '../../types/battleTypes';
import {
  X,
  UserCheck,
  UserPlus,
  MessageSquare,
  Phone,
  Video,
  Trophy,
  Coins,
  Heart,
  Send,
  Download,
  Check,
  Lock,
  Play,
  Pause,
  Image as ImageIcon,
  Share2,
  Sparkles,
  ShieldCheck,
  Music,
  Repeat
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { Language, TRANSLATIONS } from '../../utils/i18n';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: any | null;
  currentUser: UserProfile | null;
  posts: MediaPost[];
  isFollowing: boolean;
  onToggleFollow: (creatorHandle: string) => void;
  onSendDM: (creatorName: string) => void;
  onLikePost: (postId: string) => void;
  onAddComment?: (postId: string, text: string) => void;
  onUnlockMedia?: (postId: string, costCoins: number, creatorHandle?: string) => void;
  onStartCall?: (type: 'audio' | 'video', name: string, isGroup: boolean) => void;
  onShareToProfile?: (post: MediaPost) => void;
  language?: Language;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  creator,
  currentUser,
  posts,
  isFollowing,
  onToggleFollow,
  onSendDM,
  onLikePost,
  onAddComment,
  onUnlockMedia,
  onStartCall,
  onShareToProfile,
  language = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'record'>('posts');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [localComments, setLocalComments] = useState<Record<string, PostComment[]>>({});
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen || !creator) return null;

  const creatorHandle = creator.handle || `@${creator.name.toLowerCase().replace(/\s+/g, '_')}`;
  const creatorPosts = posts.filter(
    (p) =>
      p.authorHandle?.toLowerCase() === creatorHandle.toLowerCase() ||
      p.authorName?.toLowerCase() === creator.name.toLowerCase()
  );

  const handleFollowClick = () => {
    sounds.playCheer();
    onToggleFollow(creatorHandle);
    setNotice(
      isFollowing
        ? (language === 'fr' ? `Vous ne suivez plus ${creator.name}` : `Unfollowed ${creator.name}`)
        : (language === 'fr' ? `Vous suivez maintenant ${creator.name} !` : `Now following ${creator.name}!`)
    );
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSendPrivateChat = () => {
    sounds.playCheer();
    onSendDM(creator.name);
    onClose();
  };

  const handleSharePostToMyProfile = (post: MediaPost) => {
    sounds.playCheer();
    if (onShareToProfile) {
      onShareToProfile(post);
    }
    setNotice(language === 'fr' ? 'Partagé sur votre profil !' : 'Shared to your profile feed!');
    setTimeout(() => setNotice(null), 3000);
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    sounds.playCheer();
    const newComment: PostComment = {
      id: `c_${Date.now()}`,
      authorName: currentUser?.name || 'Guest User',
      authorHandle: currentUser?.handle || '@guest',
      authorAvatar: currentUser?.avatar || 'GU',
      text,
      timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
    };

    setLocalComments((prev) => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])],
    }));

    if (onAddComment) {
      onAddComment(postId, text);
    }

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setNotice(language === 'fr' ? 'Commentaire publié !' : 'Comment posted!');
    setTimeout(() => setNotice(null), 2500);
  };

  const handleUnlockPost = (post: MediaPost) => {
    const cost = post.downloadCoinsCost || (post.downloadType === 'paid' ? 5 : 0);
    sounds.playCheer();
    if (onUnlockMedia) {
      onUnlockMedia(post.id, cost, post.authorHandle);
    }
    setNotice(
      language === 'fr'
        ? `Débloqué "${post.title}" (5 pièces virtuelles déduites) !`
        : `Unlocked "${post.title}" (5 virtual coins deducted)!`
    );
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden relative text-zinc-900 my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Toast notice */}
        {notice && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 bg-zinc-900 text-white text-xs font-mono rounded-lg shadow-lg">
            {notice}
          </div>
        )}

        {/* Top Header Banner with Cover Photo */}
        <div
          className="h-32 bg-cover bg-center bg-zinc-900 p-4 relative flex items-start justify-between"
          style={{
            backgroundImage: `url(${creator.coverPhotoUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
          <div className="relative z-10 text-[10px] font-mono text-zinc-300 uppercase tracking-widest font-bold">
            {language === 'fr' ? 'PROFIL CRÉATEUR HYPITT' : 'HYPITT CREATOR PROFILE'}
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-1.5 bg-black/50 hover:bg-black/80 text-white rounded-full transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Identity Bar */}
        <div className="px-6 pb-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-3.5">
              <div className="w-20 h-20 rounded-2xl bg-zinc-950 border-4 border-white shadow-lg text-white flex items-center justify-center font-mono font-bold text-2xl shrink-0 overflow-hidden">
                {creator.profilePhotoUrl ? (
                  <img
                    src={creator.profilePhotoUrl}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{creator.avatar || creator.name?.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-display text-zinc-950 leading-tight">
                    {creator.name}
                  </h2>
                  {creator.generation && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 uppercase">
                      {creator.generation}
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-zinc-500 mt-0.5">{creatorHandle}</div>
              </div>
            </div>

            {/* Action Buttons: Follow, Send Private Chat, Call */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleFollowClick}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
                  isFollowing
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-zinc-950 text-white hover:bg-black'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'fr' ? 'Abonné' : 'Following'}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{language === 'fr' ? 'S’abonner' : 'Follow'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSendPrivateChat}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title={language === 'fr' ? 'Envoyer un message privé' : 'Send Private Message'}
              >
                <MessageSquare className="w-3.5 h-3.5 text-zinc-700" />
                <span>{language === 'fr' ? 'Chat Privé' : 'Private Chat'}</span>
              </button>

              {onStartCall && (
                <button
                  onClick={() => onStartCall('video', creator.name, false)}
                  className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition cursor-pointer"
                  title="Video Call"
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bio text */}
          <p className="text-xs text-zinc-600 mt-3 leading-relaxed">
            {creator.bio || 'Hypitt competitor, creator, and performer.'}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-zinc-100 text-center font-mono">
            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="text-sm font-bold text-zinc-950">
                {typeof creator.followers === 'number'
                  ? (creator.followers / 1000).toFixed(1) + 'k'
                  : creator.followers || '12.4k'}
              </div>
              <div className="text-[9px] text-zinc-400 uppercase">{language === 'fr' ? 'Abonnés' : 'Followers'}</div>
            </div>
            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="text-sm font-bold text-zinc-950">
                {creator.battlesWon !== undefined ? creator.battlesWon : 16}W
              </div>
              <div className="text-[9px] text-zinc-400 uppercase">{language === 'fr' ? 'Victoires' : 'Wins'}</div>
            </div>
            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="text-sm font-bold text-amber-700">
                {creator.coins || 450}c
              </div>
              <div className="text-[9px] text-zinc-400 uppercase">Coins</div>
            </div>
            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="text-xs font-bold text-emerald-800 truncate mt-0.5">
                {creator.tierRank || 'Veteran'}
              </div>
              <div className="text-[9px] text-zinc-400 uppercase">Rank</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Posts vs Competition History */}
        <div className="px-6 flex gap-2 border-b border-zinc-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-2 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'posts'
                ? 'border-zinc-950 text-zinc-950 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            {language === 'fr' ? 'Publications & Médias' : 'Posts & Media'} ({creatorPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('record')}
            className={`py-2 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'record'
                ? 'border-zinc-950 text-zinc-950 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            {language === 'fr' ? 'Historique de Compétition' : 'Competition Record'}
          </button>
        </div>

        {/* Tab 1: Creator Posts Stream with Like, Comment, Download */}
        {activeTab === 'posts' && (
          <div className="p-6 space-y-5 max-h-[420px] overflow-y-auto">
            {creatorPosts.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-xs font-mono">
                {language === 'fr'
                  ? 'Aucune publication pour le moment de ce créateur.'
                  : 'No posts uploaded yet by this creator.'}
              </div>
            ) : (
              creatorPosts.map((post) => {
                const comments = [...(localComments[post.id] || []), ...(post.comments || [])];
                const isUnlocked = currentUser?.unlockedMediaIds?.includes(post.id);
                const cost = post.downloadCoinsCost || (post.downloadType === 'paid' ? 5 : 0);

                return (
                  <div
                    key={post.id}
                    className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-zinc-950 text-sm">{post.title}</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">{post.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {post.type === 'video' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                            90s Max
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 font-semibold uppercase">
                          {post.type}
                        </span>
                      </div>
                    </div>

                    {/* Media Thumbnail / Player */}
                    {post.type === 'video' && (post.videoUrl || post.mediaUrl) && (
                      <div className="rounded-xl overflow-hidden bg-black aspect-video border border-zinc-200 relative">
                        <video
                          src={post.videoUrl || post.mediaUrl}
                          controls
                          poster={post.photoUrl}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                          {post.duration || '90s'}
                        </span>
                      </div>
                    )}

                    {post.type === 'picture' && post.photoUrl && (
                      <div className="rounded-xl overflow-hidden max-h-56 bg-zinc-100 border border-zinc-200">
                        <img
                          src={post.photoUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {post.type === 'music' && (
                      <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono text-xs">
                            <Music className="w-3.5 h-3.5 text-zinc-200" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-zinc-900">{post.fileFormat || 'Audio Track'}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">Short Audio</div>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-500">{post.duration || '1:15'}</span>
                      </div>
                    )}

                    {/* Actions: Like, Comment Counter, Share to Profile, Download */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs font-semibold gap-2 flex-wrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            sounds.playCheer();
                            onLikePost(post.id);
                          }}
                          className="flex items-center gap-1.5 text-zinc-600 hover:text-red-600 transition cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5 text-red-500" />
                          <span>{post.likesCount}</span>
                        </button>

                        <span className="text-zinc-500 text-[11px] font-mono">
                          {comments.length} {language === 'fr' ? 'commentaires' : 'comments'}
                        </span>

                        {/* Share to My Profile (Repost) */}
                        <button
                          onClick={() => handleSharePostToMyProfile(post)}
                          className="flex items-center gap-1 text-zinc-600 hover:text-zinc-950 transition cursor-pointer px-2 py-0.5 rounded-lg bg-zinc-100 hover:bg-zinc-200"
                          title={language === 'fr' ? 'Partager sur mon profil' : 'Share to my profile feed'}
                        >
                          <Repeat className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{language === 'fr' ? 'Partager sur mon profil' : 'Share to profile'}</span>
                        </button>
                      </div>

                      {/* Download / Unlock */}
                      <button
                        onClick={() => handleUnlockPost(post)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
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
                            <span>{language === 'fr' ? 'Débloqué' : 'Downloaded'}</span>
                          </>
                        ) : post.downloadType === 'paid' ? (
                          <>
                            <Coins className="w-3.5 h-3.5 text-amber-700" />
                            <span>{language === 'fr' ? `Débloquer (${cost}c)` : `Unlock (${cost}c)`}</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>{language === 'fr' ? 'Téléchargement' : 'Download'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Comment Form */}
                    <form
                      onSubmit={(e) => handleCommentSubmit(post.id, e)}
                      className="flex items-center gap-2 pt-2 border-t border-zinc-100"
                    >
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        placeholder={
                          language === 'fr'
                            ? 'Ajouter un commentaire...'
                            : 'Write a comment...'
                        }
                        className="flex-1 bg-white border border-zinc-200 focus:border-zinc-900 rounded-lg px-3 py-1.5 text-xs text-zinc-900 outline-none"
                      />
                      <button
                        type="submit"
                        className="p-1.5 bg-zinc-950 hover:bg-black text-white rounded-lg transition cursor-pointer"
                        title="Send Comment"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    {/* Existing Comments List */}
                    {comments.length > 0 && (
                      <div className="space-y-1.5 pt-1 text-xs">
                        {comments.slice(0, 3).map((c) => (
                          <div
                            key={c.id}
                            className="p-2 rounded-lg bg-white border border-zinc-100 text-zinc-800 flex items-start gap-2"
                          >
                            <div className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center font-mono font-bold text-[9px] shrink-0">
                              {c.authorAvatar}
                            </div>
                            <div className="flex-1">
                              <span className="font-bold text-[11px] text-zinc-950 mr-1.5">
                                {c.authorName}
                              </span>
                              <span className="text-zinc-600 text-[11px]">{c.text}</span>
                            </div>
                            <span className="text-[9px] text-zinc-400 font-mono shrink-0">{c.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Competition Record */}
        {activeTab === 'record' && (
          <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3 text-xs font-mono">
              <div className="font-bold uppercase text-zinc-700">
                {language === 'fr' ? 'Bilan de Compétition Officiel' : 'Official Performance Ledger'}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white rounded-xl border border-zinc-100">
                  <div className="text-base font-bold text-emerald-700">{creator.battlesWon || 16}</div>
                  <div className="text-[10px] text-zinc-400">Wins</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-zinc-100">
                  <div className="text-base font-bold text-red-600">{creator.battlesLost || 3}</div>
                  <div className="text-[10px] text-zinc-400">Losses</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-zinc-100">
                  <div className="text-base font-bold text-amber-700">{creator.winStreak || 5}</div>
                  <div className="text-[10px] text-zinc-400">Streak</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2 text-xs">
              <div className="font-bold font-display text-zinc-900">
                {language === 'fr' ? 'Statut en Direct sur Hypitt' : 'Live Status on Hypitt'}
              </div>
              <p className="text-zinc-600 italic">"{creator.status || 'Active on Hypitt'}"</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
