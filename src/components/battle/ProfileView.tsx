import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, MediaPost, BattleRewardLog, PostComment } from '../../types/battleTypes';
import {
  Trophy,
  Coins,
  Check,
  Edit2,
  Lock,
  Download,
  Music,
  Video,
  Settings,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  TrendingUp,
  Gift,
  Heart,
  Share2,
  Camera,
  Upload,
  Image as ImageIcon,
  MessageCircle,
  Play,
  Pause,
  Clock,
  Sparkles,
  Repeat,
  Trash2,
  Shield
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { Language, TRANSLATIONS } from '../../utils/i18n';
import { checkContentSafety } from '../../utils/contentModeration';

interface ProfileViewProps {
  user: UserProfile | null;
  posts?: MediaPost[];
  onUpdateStatus: (newStatus: string) => void;
  onClaimMonthlyCoins?: () => void;
  onLogout?: () => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  language?: Language;
  onSelectLanguage?: (lang: Language) => void;
  onUpdateUserProfile?: (updatedUser: Partial<UserProfile>) => void;
  onAddPost?: (post: MediaPost) => void;
  onShareToProfile?: (post: MediaPost) => void;
  onLikePost?: (postId: string) => void;
  onAddComment?: (postId: string, text: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
  onOpenPolicies?: () => void;
}

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=80',
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  posts = [],
  onUpdateStatus,
  onClaimMonthlyCoins,
  onLogout,
  onOpenAuth,
  language = 'en',
  onUpdateUserProfile,
  onAddPost,
  onShareToProfile,
  onLikePost,
  onAddComment,
  onDeleteComment,
  onLikeComment,
  onOpenPolicies,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'profile' | 'dashboard' | 'history' | 'settings'>('profile');
  const [profileFeedTab, setProfileFeedTab] = useState<'uploads' | 'reposts'>('uploads');
  
  // Status editing
  const [editingStatus, setEditingStatus] = useState(false);
  const [statusInput, setStatusInput] = useState(user?.status || 'Active on Hypitt');

  // Name and Generation Badge editing
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [generationInput, setGenerationInput] = useState<string>(user?.generation || 'Gen Z');

  // Bio editing
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(user?.bio || '');

  // Synchronize identity inputs whenever user prop changes
  useEffect(() => {
    if (user) {
      setNameInput(user.name || '');
      setGenerationInput(user.generation || 'Gen Z');
      setStatusInput(user.status || 'Active on Hypitt');
      setBioInput(user.bio || '');
    }
  }, [user?.name, user?.generation, user?.status, user?.bio]);

  // Notifications
  const [notice, setNotice] = useState<string | null>(null);

  // Post Creator State on Profile (Supports ANY content type per user request)
  const [newPostType, setNewPostType] = useState<'picture' | 'music' | 'video'>('picture');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDesc, setNewPostDesc] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<string>('general');
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');
  const [newPostPreview, setNewPostPreview] = useState<string | null>(null);
  const [newPostDuration, setNewPostDuration] = useState<number>(0); // in seconds
  const [videoDurationError, setVideoDurationError] = useState<string | null>(null);
  const [isUploadingPost, setIsUploadingPost] = useState(false);

  // Local comments state (for instant addition, deletion, and likes)
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [localPostComments, setLocalPostComments] = useState<Record<string, PostComment[]>>({});
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [playingMediaId, setPlayingMediaId] = useState<string | null>(null);

  // Hidden file input refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const postFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  if (!user) {
    return (
      <div className="py-16 max-w-lg mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 shadow-sm">
          <UserIcon className="w-8 h-8 text-zinc-900" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900 font-display tracking-tight">
            {t.dashboard.title}
          </h2>
          <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
            {language === 'fr'
              ? 'Connectez-vous pour personnaliser votre profil, ajouter vos photos, vidéos de 90s, audios et gérer votre portefeuille.'
              : 'Sign in to customize your profile, upload photos, 90s videos, short audio, and manage your wallet.'}
          </p>
        </div>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => onOpenAuth?.('login')}
            className="px-5 py-2.5 text-xs font-bold bg-zinc-900 text-white rounded-xl hover:bg-black transition cursor-pointer shadow-xs"
          >
            {t.nav.login}
          </button>
          <button
            onClick={() => onOpenAuth?.('signup')}
            className="px-5 py-2.5 text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-xl hover:bg-zinc-200 transition cursor-pointer"
          >
            {t.nav.signup}
          </button>
        </div>
      </div>
    );
  }

  // Handle Profile Picture Upload from Device
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    sounds.playVineBoom();
    if (onUpdateUserProfile) {
      onUpdateUserProfile({ profilePhotoUrl: url });
    }
    showToast(language === 'fr' ? 'Photo de profil mise à jour !' : 'Profile photo updated!');
  };

  // Handle Cover Picture Upload from Device
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    sounds.playVineBoom();
    if (onUpdateUserProfile) {
      onUpdateUserProfile({ coverPhotoUrl: url });
    }
    showToast(language === 'fr' ? 'Photo de couverture mise à jour !' : 'Cover picture updated!');
  };

  // Handle Post File Selection (Pictures, Short Audio, Short Video up to 90s)
  const handlePostFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoDurationError(null);
    const objectUrl = URL.createObjectURL(file);
    setNewPostPreview(objectUrl);

    if (file.type.startsWith('video/')) {
      setNewPostType('video');
      // Validate video length (max 90 seconds)
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = objectUrl;
      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        const duration = Math.round(videoElement.duration);
        setNewPostDuration(duration);
        if (duration > 90) {
          setVideoDurationError(
            language === 'fr'
              ? `Vidéo trop longue (${duration}s). La limite maximale est de 90 secondes.`
              : `Video too long (${duration}s). Maximum allowed length is 90 seconds.`
          );
        } else {
          showToast(language === 'fr' ? `Vidéo validée (${duration}s / 90s max)` : `Video verified (${duration}s / 90s max)`);
        }
      };
    } else if (file.type.startsWith('audio/')) {
      setNewPostType('music');
      showToast(language === 'fr' ? 'Fichier audio sélectionné' : 'Short audio file selected');
    } else {
      setNewPostType('picture');
      showToast(language === 'fr' ? 'Photo sélectionnée' : 'Picture selected');
    }
  };

  // Handle Publish Post directly from profile (any content type supported)
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    // Content moderation: Automatically detect and block sexual or violent content
    const titleSafety = checkContentSafety(newPostTitle);
    if (!titleSafety.isSafe) {
      showToast(language === 'fr' ? titleSafety.reasonFr || 'Contenu bloqué' : titleSafety.reasonEn || 'Content blocked');
      sounds.playDialup();
      return;
    }
    if (newPostDesc.trim()) {
      const descSafety = checkContentSafety(newPostDesc);
      if (!descSafety.isSafe) {
        showToast(language === 'fr' ? descSafety.reasonFr || 'Contenu bloqué' : descSafety.reasonEn || 'Content blocked');
        sounds.playDialup();
        return;
      }
    }

    if (newPostType === 'video' && newPostDuration > 90) {
      showToast(language === 'fr' ? 'Veuillez choisir une vidéo de 90s maximum.' : 'Please select a video under 90 seconds.');
      return;
    }

    const assignedCategory = newPostCategory === 'other' && customCategoryInput.trim()
      ? customCategoryInput.trim()
      : (newPostCategory as any) || 'general';

    const newPost: MediaPost = {
      id: `post_${Date.now()}`,
      authorName: user.name,
      authorHandle: user.handle,
      authorAvatar: user.avatar,
      authorGeneration: user.generation,
      type: newPostType,
      title: newPostTitle.trim(),
      description: newPostDesc.trim() || 'Uploaded to profile feed on Hypitt.',
      category: assignedCategory,
      downloadType: 'free',
      downloadCount: 0,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
      photoUrl: newPostType === 'picture' ? (newPostPreview || undefined) : undefined,
      videoUrl: newPostType === 'video' ? (newPostPreview || undefined) : undefined,
      mediaUrl: newPostType === 'music' ? (newPostPreview || undefined) : undefined,
      duration: newPostType === 'video' ? `${newPostDuration}s` : newPostType === 'music' ? '1:15' : undefined,
      durationSeconds: newPostDuration,
      fileFormat: newPostType === 'video' ? 'MP4 1080p' : newPostType === 'music' ? 'WAV Audio' : 'High-Res PNG',
      comments: [],
    };

    sounds.playVineBoom();
    if (onAddPost) {
      onAddPost(newPost);
    }

    setNewPostTitle('');
    setNewPostDesc('');
    setNewPostPreview(null);
    setNewPostDuration(0);
    setCustomCategoryInput('');
    setIsUploadingPost(false);
    showToast(language === 'fr' ? 'Publication ajoutée à votre profil !' : 'Published to your profile feed!');
  };

  // Add Comment handler with content moderation
  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    // Content moderation: Automatically detect and block sexual or violent content
    const safety = checkContentSafety(text);
    if (!safety.isSafe) {
      showToast(language === 'fr' ? safety.reasonFr || 'Commentaire bloqué' : safety.reasonEn || 'Comment blocked');
      sounds.playDialup();
      return;
    }

    const newCommentObj: PostComment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      authorName: user.name,
      authorHandle: user.handle,
      authorAvatar: user.avatar,
      text,
      timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
      likes: 0,
    };

    setLocalPostComments((prev) => ({
      ...prev,
      [postId]: [newCommentObj, ...(prev[postId] || [])],
    }));

    if (onAddComment) {
      onAddComment(postId, text);
    }
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    sounds.playCheer();
    showToast(language === 'fr' ? 'Commentaire publié !' : 'Comment posted!');
  };

  // Delete Comment handler (delete own comments OR remove comments on own content)
  const handleDeleteCommentLocal = (postId: string, commentId: string) => {
    sounds.playVineBoom();
    setLocalPostComments((prev) => ({
      ...prev,
      [postId]: (prev[postId] || []).filter((c) => c.id !== commentId),
    }));
    if (onDeleteComment) {
      onDeleteComment(postId, commentId);
    }
    showToast(language === 'fr' ? 'Commentaire supprimé.' : 'Comment deleted.');
  };

  // Like Comment handler
  const handleToggleLikeComment = (postId: string, commentId: string) => {
    sounds.playCheer();
    setLikedComments((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    if (onLikeComment) {
      onLikeComment(postId, commentId);
    }
  };

  // Share/Repost handler
  const handleSharePost = (post: MediaPost) => {
    sounds.playCheer();
    if (onShareToProfile) {
      onShareToProfile(post);
    }
    showToast(language === 'fr' ? 'Partagé sur votre profil !' : 'Shared to your profile feed!');
  };

  // Filter posts for this user's profile
  const userUploads = posts.filter(
    (p) => p.authorHandle === user.handle && !p.isRepost
  );

  const userReposts = posts.filter(
    (p) => (p.isRepost && p.repostedByHandle === user.handle) || (user.repostedPostIds?.includes(p.id))
  );

  const displayedPosts = profileFeedTab === 'uploads' ? userUploads : userReposts;

  const votingCoins = user.votingCoins ?? 100;
  const creatorRewardCoins = user.creatorRewardCoins ?? Math.max(0, user.coins - votingCoins);
  const rewardLogs: BattleRewardLog[] = user.rewardHistory || [];

  return (
    <div className="py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Toast Notification */}
      {notice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-zinc-950 text-white text-xs font-mono rounded-xl shadow-2xl border border-zinc-700 animate-in fade-in flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Mode Tabs: [ My Profile ] vs [ Creator Dashboard & Wallet ] */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{t.profileSection.myProfile}</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t.profileSection.creatorDashboard}</span>
          </button>
        </div>

        <button
          onClick={onLogout}
          className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer font-medium flex items-center gap-1 border border-rose-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t.nav.logout}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MY PROFILE (Cover, Avatar, Direct Post, Feeds)    */}
      {/* ======================================================== */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          
          {/* Profile Header Card */}
          <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-xs relative">
            
            {/* Cover Picture */}
            <div
              className="h-44 sm:h-56 w-full bg-cover bg-center relative bg-zinc-900 group"
              style={{
                backgroundImage: `url(${user.coverPhotoUrl || PRESET_COVERS[0]})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              {/* Cover change CTA */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-white/20 transition shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{t.profileSection.changeCover}</span>
                </button>
              </div>
            </div>

            {/* Profile Avatar & Info Strip */}
            <div className="px-6 pb-6 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
                <div className="flex items-end gap-4">
                  
                  {/* Avatar with change button */}
                  <div className="relative group shrink-0">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-950 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center font-mono font-bold text-3xl text-white">
                      {user.profilePhotoUrl ? (
                        <img
                          src={user.profilePhotoUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{user.avatar}</span>
                      )}
                    </div>
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-zinc-900 hover:bg-black text-white shadow-md border border-white cursor-pointer transition"
                      title={t.profileSection.changeAvatar}
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-1">
                    {editingIdentity ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!nameInput.trim()) return;

                          // Content safety check on name
                          const nameSafety = checkContentSafety(nameInput);
                          if (!nameSafety.isSafe) {
                            showToast(language === 'fr' ? 'Nom non autorisé.' : 'Name violates safety guidelines.');
                            sounds.playDialup();
                            return;
                          }

                          const initials = nameInput
                            .trim()
                            .split(' ')
                            .map((p) => p[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase() || user.avatar;

                          if (onUpdateUserProfile) {
                            onUpdateUserProfile({
                              name: nameInput.trim(),
                              generation: generationInput,
                              avatar: initials,
                            });
                          }
                          setEditingIdentity(false);
                          sounds.playCheer();
                          showToast(language === 'fr' ? 'Nom et badge mis à jour avec succès !' : 'Creator name and badge updated successfully!');
                        }}
                        className="space-y-2 bg-zinc-50 border border-zinc-200 rounded-xl p-3 shadow-2xs max-w-sm"
                      >
                        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                          {language === 'fr' ? 'Modifier le Nom de Créateur' : 'Edit Creator Name & Badge'}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            required
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            placeholder="Creator Name"
                            className="flex-1 px-2.5 py-1 text-xs border border-zinc-300 rounded-lg outline-none bg-white font-bold text-zinc-950"
                          />
                          <select
                            value={generationInput}
                            onChange={(e) => setGenerationInput(e.target.value)}
                            className="px-2 py-1 text-xs border border-zinc-300 rounded-lg outline-none bg-white font-mono font-bold"
                          >
                            <option value="Gen Z">Gen Z</option>
                            <option value="Millennial">Millennial</option>
                            <option value="Gen X">Gen X</option>
                            <option value="Boomer">Boomer</option>
                            <option value="Creator">Creator</option>
                            <option value="Pro Battler">Pro Battler</option>
                          </select>
                        </div>
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setNameInput(user.name);
                              setGenerationInput(user.generation);
                              setEditingIdentity(false);
                            }}
                            className="px-2.5 py-1 text-[11px] text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-md cursor-pointer"
                          >
                            {language === 'fr' ? 'Annuler' : 'Cancel'}
                          </button>
                          <button
                            type="submit"
                            className="px-3.5 py-1 text-[11px] bg-zinc-950 hover:bg-black text-white font-bold rounded-md cursor-pointer shadow-xs"
                          >
                            {language === 'fr' ? 'Enregistrer' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-950">
                            {user.name}
                          </h2>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-bold uppercase border border-zinc-200">
                            {user.generation}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setNameInput(user.name);
                              setGenerationInput(user.generation);
                              setEditingIdentity(true);
                            }}
                            className="px-2 py-1 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                            title={language === 'fr' ? 'Modifier le nom de créateur' : 'Change creator name'}
                          >
                            <Edit2 className="w-3 h-3 text-zinc-600" />
                            <span>{language === 'fr' ? 'Changer Nom' : 'Change Name'}</span>
                          </button>
                        </div>
                        <div className="text-xs font-mono text-zinc-500 mt-0.5">{user.handle}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status indicator */}
                <div className="text-xs">
                  {editingStatus ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (statusInput.trim()) {
                          onUpdateStatus(statusInput.trim());
                          setEditingStatus(false);
                          showToast(language === 'fr' ? 'Statut mis à jour !' : 'Status updated!');
                        }
                      }}
                      className="flex items-center gap-1.5"
                    >
                      <input
                        type="text"
                        value={statusInput}
                        onChange={(e) => setStatusInput(e.target.value)}
                        className="px-2.5 py-1 text-xs border border-zinc-300 rounded-lg outline-none bg-zinc-50"
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-zinc-900 text-white rounded-lg text-xs font-bold"
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-zinc-700 font-medium text-xs truncate max-w-xs">{user.status}</span>
                      <button
                        onClick={() => setEditingStatus(true)}
                        className="text-zinc-400 hover:text-zinc-800 p-0.5 cursor-pointer ml-1"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio & Stats */}
              <div className="space-y-3 pt-2">
                <p className="text-xs text-zinc-600 leading-relaxed font-sans max-w-3xl">
                  {user.bio || 'Hypitt competitor and creator.'}
                </p>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-3 border-t border-zinc-100 font-mono text-center">
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                    <div className="text-sm font-bold text-zinc-950">{(user.followers / 1000).toFixed(1)}k</div>
                    <div className="text-[10px] text-zinc-400 uppercase">{t.common.followers}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                    <div className="text-sm font-bold text-zinc-950">{user.following}</div>
                    <div className="text-[10px] text-zinc-400 uppercase">{language === 'fr' ? 'Abonnements' : 'Following'}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                    <div className="text-sm font-bold text-zinc-950">{user.battlesWon}W</div>
                    <div className="text-[10px] text-zinc-400 uppercase">{t.common.wins}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                    <div className="text-sm font-bold text-amber-700">{user.coins}c</div>
                    <div className="text-[10px] text-zinc-400 uppercase">{t.common.coins}</div>
                  </div>
                  {onOpenPolicies ? (
                    <button
                      type="button"
                      onClick={onOpenPolicies}
                      className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100 transition cursor-pointer flex flex-col items-center justify-center text-zinc-700"
                      title={language === 'fr' ? 'Conditions d’utilisation & Confidentialité' : 'Terms of Service & Privacy Policy'}
                    >
                      <Shield className="w-4 h-4 text-zinc-600 mb-0.5" />
                      <span className="text-[10px] uppercase font-mono font-bold">{language === 'fr' ? 'Légal' : 'Policies'}</span>
                    </button>
                  ) : (
                    <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 hidden sm:block">
                      <div className="text-xs font-bold text-emerald-800 truncate mt-0.5">{user.tierRank || 'Veteran'}</div>
                      <div className="text-[10px] text-zinc-400 uppercase">Rank</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Post Creator Box on Profile */}
          <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-display text-zinc-950">
                  {language === 'fr' ? 'Publier sur Votre Profil' : 'Post Directly to Your Profile'}
                </h3>
                <p className="text-xs text-zinc-500">
                  {language === 'fr'
                    ? 'Ajoutez des photos, des audios courts ou des vidéos de 90 secondes max.'
                    : 'Share pictures, short audio tracks, or short videos up to 90s max.'}
                </p>
              </div>

              {/* Type Switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setNewPostType('picture')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    newPostType === 'picture' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewPostType('music')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    newPostType === 'music' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <Music className="w-3 h-3" />
                  <span>Audio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewPostType('video')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    newPostType === 'video' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <Video className="w-3 h-3" />
                  <span>Video (90s)</span>
                </button>
              </div>
            </div>

            {/* Post Form */}
            <form onSubmit={handlePublishPost} className="space-y-3">
              <input
                ref={postFileInputRef}
                type="file"
                accept={newPostType === 'picture' ? 'image/*' : newPostType === 'video' ? 'video/*' : 'audio/*'}
                onChange={handlePostFileSelect}
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={language === 'fr' ? 'Titre de la publication...' : 'Post title...'}
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-zinc-300 focus:border-zinc-950 rounded-xl outline-none font-sans"
                />

                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-zinc-300 focus:border-zinc-950 rounded-xl outline-none font-sans bg-white font-medium text-zinc-900"
                >
                  <option value="general">{language === 'fr' ? '🌟 Général & Style de Vie (Tout Contenu)' : '🌟 General & Lifestyle (Any Content)'}</option>
                  <option value="art">{language === 'fr' ? '🎨 Art Visuel, Design & Photo' : '🎨 Visual Art, Design & Photo'}</option>
                  <option value="music_creative">{language === 'fr' ? '🎵 Musique, Beats & Instruments' : '🎵 Music, Beats & Instruments'}</option>
                  <option value="tech_gaming">{language === 'fr' ? '🎮 Gaming, Tech & Culture' : '🎮 Gaming, Tech & Web Culture'}</option>
                  <option value="fitness_sports">{language === 'fr' ? '⚡ Sport, Fitness & Cascades' : '⚡ Fitness, Sports & Action'}</option>
                  <option value="storytelling">{language === 'fr' ? '📖 Récits, Poésie & Pensées' : '📖 Storytelling, Poetry & Thoughts'}</option>
                  <option value="dance">{language === 'fr' ? '💃 Danse & Chorégraphie' : '💃 Dance & Movement'}</option>
                  <option value="roasting">{language === 'fr' ? '🔥 Clash & Roasting' : '🔥 Roast & Open-Mic Clash'}</option>
                  <option value="singing">{language === 'fr' ? '🎤 Chant & Voix Open-Mic' : '🎤 Open-Mic Singing'}</option>
                  <option value="debate">{language === 'fr' ? '⚖️ Débats Personnalisés' : '⚖️ Customized Debates'}</option>
                  <option value="comedy">{language === 'fr' ? '😂 Stand-up Comedy' : '😂 Standup Comedy'}</option>
                  <option value="other">{language === 'fr' ? '✨ Autre Sujet Personnalisé' : '✨ Other Custom Topic'}</option>
                </select>
              </div>

              {newPostCategory === 'other' && (
                <input
                  type="text"
                  placeholder={language === 'fr' ? 'Précisez votre sujet ou catégorie...' : 'Specify your custom topic or category...'}
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 focus:border-zinc-950 rounded-xl outline-none font-sans"
                />
              )}

              <textarea
                rows={2}
                placeholder={language === 'fr' ? 'Description ou légende...' : 'Description or punchline notes...'}
                value={newPostDesc}
                onChange={(e) => setNewPostDesc(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-zinc-300 focus:border-zinc-950 rounded-xl outline-none font-sans resize-none"
              />

              {/* 90s Video Warning / Verification Badge */}
              {newPostType === 'video' && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-mono">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t.profileSection.videoMaxLimitNotice}</span>
                  {newPostDuration > 0 && (
                    <span className="ml-auto font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-950">
                      {newPostDuration}s / 90s
                    </span>
                  )}
                </div>
              )}

              {videoDurationError && (
                <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-mono font-bold">
                  {videoDurationError}
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => postFileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-zinc-600" />
                  <span>
                    {newPostPreview
                      ? (language === 'fr' ? 'Fichier Sélectionné' : 'File Loaded')
                      : (language === 'fr' ? 'Choisir Fichier' : 'Choose File from Device')}
                  </span>
                </button>

                <button
                  type="submit"
                  disabled={Boolean(videoDurationError)}
                  className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {language === 'fr' ? 'Publier sur le Profil' : 'Post to Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Profile Feeds: [ My Uploads ] vs [ Shared to Profile / Reposts ] */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  onClick={() => setProfileFeedTab('uploads')}
                  className={`py-1.5 px-3 rounded-lg transition cursor-pointer ${
                    profileFeedTab === 'uploads'
                      ? 'bg-zinc-950 text-white'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {language === 'fr' ? 'Mes Publications' : 'My Uploads'} ({userUploads.length})
                </button>

                <button
                  onClick={() => setProfileFeedTab('reposts')}
                  className={`py-1.5 px-3 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    profileFeedTab === 'reposts'
                      ? 'bg-zinc-950 text-white'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <Repeat className="w-3 h-3" />
                  <span>{t.profileSection.reposts} ({userReposts.length})</span>
                </button>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedPosts.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-zinc-400 text-xs font-mono">
                  {profileFeedTab === 'uploads'
                    ? (language === 'fr' ? 'Aucune publication pour le moment. Utilisez le formulaire ci-dessus pour publier.' : 'No posts uploaded yet. Use the composer above to publish.')
                    : (language === 'fr' ? 'Aucun partage sur votre profil. Visitez d’autres profils et cliquez sur Partager !' : 'No shared posts yet. Visit creator profiles to share content here!')}
                </div>
              ) : (
                displayedPosts.map((post) => {
                  const isPlaying = playingMediaId === post.id;

                  return (
                    <article
                      key={post.id}
                      className="rounded-2xl border border-zinc-200 p-4 space-y-3 bg-white shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        {/* Repost Badge if shared */}
                        {post.isRepost && (
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 pb-2 mb-2 border-b border-zinc-100">
                            <Repeat className="w-3 h-3 text-emerald-600" />
                            <span>
                              {language === 'fr' ? 'Partagé par vous' : `Reposted by ${post.repostedBy || 'you'}`}
                            </span>
                          </div>
                        )}

                        {/* Author info */}
                        <div className="flex items-center justify-between pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs">
                              {post.authorAvatar}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-zinc-900">{post.authorName}</div>
                              <div className="text-[10px] text-zinc-400 font-mono">{post.authorHandle}</div>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 uppercase font-semibold">
                            {post.type}
                          </span>
                        </div>

                        {/* Title & Desc */}
                        <div className="space-y-1 pt-1">
                          <h4 className="text-sm font-bold text-zinc-950 font-display">{post.title}</h4>
                          <p className="text-xs text-zinc-600 line-clamp-2">{post.description}</p>
                        </div>

                        {/* Media Display */}
                        {post.type === 'picture' && (post.photoUrl || post.mediaUrl) && (
                          <div className="mt-3 rounded-xl overflow-hidden max-h-56 bg-zinc-100 border border-zinc-200">
                            <img
                              src={post.photoUrl || post.mediaUrl}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {post.type === 'video' && (post.videoUrl || post.mediaUrl) && (
                          <div className="mt-3 rounded-xl overflow-hidden aspect-video bg-black border border-zinc-800 relative">
                            <video
                              src={post.videoUrl || post.mediaUrl}
                              controls
                              className="w-full h-full object-cover"
                            />
                            {post.duration && (
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                                {post.duration}
                              </span>
                            )}
                          </div>
                        )}

                        {post.type === 'music' && (
                          <div className="mt-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <button
                                onClick={() => setPlayingMediaId(isPlaying ? null : post.id)}
                                className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center cursor-pointer hover:bg-black transition"
                              >
                                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                              </button>
                              <div>
                                <div className="text-xs font-bold text-zinc-900">{post.fileFormat}</div>
                                <div className="text-[10px] text-zinc-500 font-mono">Short Audio Stem</div>
                              </div>
                            </div>
                            <span className="text-[11px] font-mono text-zinc-500">{post.duration || '1:15'}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions: Like, Comment, Repost */}
                      <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => onLikePost && onLikePost(post.id)}
                              className="flex items-center gap-1.5 text-zinc-600 hover:text-rose-600 transition cursor-pointer"
                            >
                              <Heart className="w-3.5 h-3.5 text-rose-500" />
                              <span>{post.likesCount}</span>
                            </button>

                            <div className="flex items-center gap-1 text-zinc-400">
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{post.commentsCount || post.comments?.length || 0}</span>
                            </div>
                          </div>

                          {/* Share / Repost button */}
                          <button
                            onClick={() => handleSharePost(post)}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition cursor-pointer flex items-center gap-1"
                            title={t.profileSection.shareToMyProfile}
                          >
                            <Repeat className="w-3 h-3 text-emerald-600" />
                            <span>{language === 'fr' ? 'Partager' : 'Repost'}</span>
                          </button>
                        </div>

                        {/* Inline comment form */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder={language === 'fr' ? 'Ajouter un commentaire...' : 'Add comment...'}
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCommentSubmit(post.id);
                              }
                            }}
                            className="flex-1 px-3 py-1.5 text-xs border border-zinc-200 rounded-lg outline-none bg-zinc-50 focus:border-zinc-900"
                          />
                          <button
                            onClick={() => handleCommentSubmit(post.id)}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white rounded-lg text-xs font-semibold cursor-pointer transition shadow-2xs"
                          >
                            {language === 'fr' ? 'Publier' : 'Post'}
                          </button>
                        </div>

                        {/* Comments List with Viewing, Liking, and Deletion */}
                        {(() => {
                          const allComments = [
                            ...(localPostComments[post.id] || []),
                            ...(post.comments || []),
                          ];

                          if (allComments.length === 0) return null;

                          return (
                            <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pt-2 border-t border-zinc-100">
                              {allComments.map((c) => {
                                const isMyComment = c.authorName === user.name;
                                const isMyPost = post.authorHandle === user.handle || post.authorName === user.name;
                                const canDelete = isMyComment || isMyPost;
                                const isLiked = Boolean(likedComments[c.id]);
                                const commentLikes = (c.likes || 0) + (isLiked ? 1 : 0);

                                return (
                                  <div
                                    key={c.id}
                                    className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 flex items-start justify-between gap-2 text-xs"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                                        <span className="font-bold text-zinc-900">{c.authorName}</span>
                                        <span>·</span>
                                        <span>{c.timestamp}</span>
                                      </div>
                                      <div className="text-zinc-800 text-xs mt-0.5 break-words">
                                        {c.text}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {/* Like Comment */}
                                      <button
                                        type="button"
                                        onClick={() => handleToggleLikeComment(post.id, c.id)}
                                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                                          isLiked
                                            ? 'text-rose-600 font-bold bg-rose-50'
                                            : 'text-zinc-400 hover:text-zinc-700'
                                        }`}
                                        title={language === 'fr' ? 'Aimer ce commentaire' : 'Like comment'}
                                      >
                                        <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                                        <span>{commentLikes > 0 ? commentLikes : ''}</span>
                                      </button>

                                      {/* Delete Comment (Own or on Own content) */}
                                      {canDelete && (
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteCommentLocal(post.id, c.id)}
                                          className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                          title={
                                            isMyComment
                                              ? (language === 'fr' ? 'Supprimer mon commentaire' : 'Delete my comment')
                                              : (language === 'fr' ? 'Supprimer ce commentaire de ma publication' : 'Remove comment on my content')
                                          }
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CREATOR DASHBOARD & WALLET                       */}
      {/* ======================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-950 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
                  {language === 'fr' ? 'PORTEFEUILLE VIRTUEL HYPITT' : 'HYPITT VIRTUAL ECONOMY'}
                </span>
                <h3 className="text-xl font-bold font-display text-white mt-0.5">
                  {t.dashboard.title}
                </h3>
              </div>

              {!user.monthlyCoinsClaimed && onClaimMonthlyCoins && (
                <button
                  onClick={onClaimMonthlyCoins}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-md"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>{t.economy.claimMonthlyStipend}</span>
                </button>
              )}
            </div>

            {/* Dual Wallet Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>{t.economy.votingCoinsTitle}</span>
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">{votingCoins} Coins</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {t.economy.votingCoinsDesc}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>{t.economy.creatorRewardCoinsTitle}</span>
                  <Trophy className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">{creatorRewardCoins} Coins</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {t.economy.creatorRewardCoinsDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Reward History */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
            <h4 className="text-sm font-bold font-display text-zinc-950">
              {t.dashboard.rewardHistoryTitle}
            </h4>

            <div className="space-y-2">
              {rewardLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-zinc-900">{log.title}</div>
                    <div className="text-[11px] text-zinc-500">{log.description}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-emerald-800">+{log.coins}c</span>
                    <div className="text-[10px] text-zinc-400 font-mono">{log.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
