import React, { useState } from 'react';
import { UserProfile } from '../../types/battleTypes';
import { X, Check, ArrowRight, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { Language, TRANSLATIONS } from '../../utils/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
  language?: Language;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

const DEMO_PROFILES: UserProfile[] = [
  {
    id: 'user_alex',
    name: 'Alex Rivera',
    handle: '@alex_battler',
    avatar: 'AR',
    generation: 'Gen Z',
    status: 'In Live Roast Battle (Round 2)',
    bio: 'Freestyle roaster & beat producer. 18-3 record on Hypitt. Accepting virtual competitions.',
    battlesWon: 18,
    battlesLost: 3,
    winStreak: 6,
    earnings: 1240,
    coins: 100,
    votingCoins: 100,
    creatorRewardCoins: 0,
    followers: 14200,
    following: 380,
    followedCreatorHandles: ['@kai_skates'],
    unlockedMediaIds: ['post_1'],
    tierRank: 'Battle Veteran',
    socialProvider: 'google',
    monthlyCoinsClaimed: true,
    privacy: {
      allowDMsFrom: 'everyone',
      allowCallsFrom: 'everyone',
      allowPaidChallenges: true,
      showOnlineStatus: true,
    },
  },
  {
    id: 'user_sarah',
    name: 'Sarah Chemex',
    handle: '@sarah_pourover',
    avatar: 'SC',
    generation: 'Millennial',
    status: 'Coffee Break · Open Duel',
    bio: 'Millennial cultural essayist and debate finalist. Defending 90s nostalgia with single-origin coffee.',
    battlesWon: 24,
    battlesLost: 5,
    winStreak: 4,
    earnings: 1890,
    coins: 420,
    votingCoins: 100,
    creatorRewardCoins: 320,
    followers: 28400,
    following: 410,
    followedCreatorHandles: ['@malik_steps'],
    unlockedMediaIds: ['post_2'],
    tierRank: 'Hall of Fame Champion',
    socialProvider: 'instagram',
    monthlyCoinsClaimed: true,
    privacy: {
      allowDMsFrom: 'followers',
      allowCallsFrom: 'followers',
      allowPaidChallenges: true,
      showOnlineStatus: true,
    },
  },
  {
    id: 'user_jordan',
    name: 'Jordan Melody',
    handle: '@jordan_vocals',
    avatar: 'JM',
    generation: 'Gen Z',
    status: 'Neo-Soul Vocals Live',
    bio: 'Vocal producer & open-mic singer. Uploading 24-bit raw WAV stems & vocal melodies.',
    battlesWon: 14,
    battlesLost: 2,
    winStreak: 7,
    earnings: 950,
    coins: 210,
    votingCoins: 100,
    creatorRewardCoins: 110,
    followers: 19100,
    following: 240,
    followedCreatorHandles: [],
    unlockedMediaIds: [],
    tierRank: 'Rising Star',
    socialProvider: 'tiktok',
    monthlyCoinsClaimed: true,
    privacy: {
      allowDMsFrom: 'everyone',
      allowCallsFrom: 'everyone',
      allowPaidChallenges: true,
      showOnlineStatus: true,
    },
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  initialMode = 'login',
  language = 'en',
  onOpenTerms,
  onOpenPrivacy,
}) => {
  const t = TRANSLATIONS[language];
  const [tab, setTab] = useState<'login' | 'signup'>(initialMode);
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupHandle, setSignupHandle] = useState('');
  const [signupGeneration, setSignupGeneration] = useState<'Gen Z' | 'Millennial'>('Gen Z');
  const [signupBio, setSignupBio] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // 1-Click Social Sign-in Handler (Google, Instagram, TikTok, Facebook, WhatsApp)
  const handleSocialAuth = (provider: 'google' | 'instagram' | 'tiktok' | 'facebook' | 'whatsapp') => {
    sounds.playCheer();
    
    const providerNames: Record<string, { name: string; handle: string; avatar: string }> = {
      google: { name: 'Google Creator', handle: '@google_creator', avatar: 'GC' },
      instagram: { name: 'Insta Performer', handle: '@insta_live', avatar: 'IP' },
      tiktok: { name: 'TikTok Flow Master', handle: '@tiktok_viral', avatar: 'TT' },
      facebook: { name: 'Meta Champion', handle: '@fb_duelist', avatar: 'MC' },
      whatsapp: { name: 'WhatsApp Caller', handle: '@wa_direct', avatar: 'WA' },
    };

    const details = providerNames[provider];
    const socialUser: UserProfile = {
      id: `user_${provider}_${Date.now()}`,
      name: details.name,
      handle: details.handle,
      avatar: details.avatar,
      generation: 'Gen Z',
      status: 'Active Creator on Hypitt',
      bio: 'Live creator & competitor on Hypitt. Exploring live open-mic challenges and community duels.',
      battlesWon: 3,
      battlesLost: 1,
      winStreak: 2,
      earnings: 120,
      coins: 100, // 100 virtual coins welcome allowance
      votingCoins: 100, // Monthly 100 virtual coins allowance to spend on others
      creatorRewardCoins: 0,
      followers: 2400,
      following: 110,
      followedCreatorHandles: ['@kai_skates'],
      unlockedMediaIds: ['post_1'],
      contentUnlocksCount: 1,
      simulatedSalesCount: 0,
      tierRank: 'Rising Star',
      socialProvider: provider,
      monthlyCoinsClaimed: true,
      rewardHistory: [
        {
          id: `rew_soc_1`,
          date: 'Just now',
          title: `Welcome Allowance (100 Virtual Coins)`,
          type: 'battle_winner_share',
          role: 'battler',
          coins: 100,
          description: 'Welcome virtual reward allowance for joining Hypitt',
        }
      ],
      privacy: {
        allowDMsFrom: 'everyone',
        allowCallsFrom: 'everyone',
        allowPaidChallenges: true,
        showOnlineStatus: true,
      },
    };

    try {
      localStorage.setItem('arena_current_user', JSON.stringify(socialUser));
    } catch {}

    onLogin(socialUser);
    onClose();
  };

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) return;

    sounds.playCheer();
    const cleanHandle = loginIdentifier.startsWith('@')
      ? loginIdentifier
      : `@${loginIdentifier.toLowerCase().replace(/\s+/g, '_')}`;

    const loggedUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: loginIdentifier.replace('@', ''),
      handle: cleanHandle,
      avatar: loginIdentifier.slice(0, 2).toUpperCase(),
      generation: 'Gen Z',
      status: 'Active on Hypitt',
      bio: 'Hypitt creator and competitor.',
      battlesWon: 1,
      battlesLost: 0,
      winStreak: 1,
      earnings: 50,
      coins: 100,
      votingCoins: 100, // Monthly 100 virtual coins to spend on others
      creatorRewardCoins: 0,
      followers: 120,
      following: 45,
      followedCreatorHandles: ['@kai_skates'],
      unlockedMediaIds: ['post_1'],
      contentUnlocksCount: 0,
      simulatedSalesCount: 0,
      tierRank: 'Rookie',
      socialProvider: 'email',
      monthlyCoinsClaimed: true,
      privacy: {
        allowDMsFrom: 'everyone',
        allowCallsFrom: 'everyone',
        allowPaidChallenges: true,
        showOnlineStatus: true,
      },
    };

    onLogin(loggedUser);
    onClose();
  };

  const handleCustomSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim()) return;

    sounds.playCheer();
    const handle = signupHandle.trim()
      ? (signupHandle.startsWith('@') ? signupHandle.trim() : `@${signupHandle.trim()}`)
      : `@${signupName.toLowerCase().replace(/\s+/g, '_')}`;

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: signupName.trim(),
      handle: handle,
      avatar: signupName.trim().slice(0, 2).toUpperCase(),
      generation: signupGeneration,
      status: 'Just Joined Hypitt · Open Competition',
      bio: signupBio.trim() || 'New creator on Hypitt platform.',
      battlesWon: 0,
      battlesLost: 0,
      winStreak: 0,
      earnings: 0,
      coins: 100,
      votingCoins: 100, // Monthly 100 virtual coins to spend on others
      creatorRewardCoins: 0,
      followers: 1,
      following: 5,
      followedCreatorHandles: ['@kai_skates'],
      unlockedMediaIds: [],
      contentUnlocksCount: 0,
      simulatedSalesCount: 0,
      tierRank: 'Rookie',
      socialProvider: 'email',
      monthlyCoinsClaimed: true,
      privacy: {
        allowDMsFrom: 'everyone',
        allowCallsFrom: 'everyone',
        allowPaidChallenges: true,
        showOnlineStatus: true,
      },
    };

    onLogin(newUser);
    onClose();
  };

  const handleSelectDemo = (profile: UserProfile) => {
    sounds.playCheer();
    onLogin(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative text-zinc-900 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header bar */}
        <div className="px-6 pt-5 pb-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">
              {language === 'fr' ? 'ACCÈS IMMÉDIAT · 100 PIÈCES MENSUELLES' : 'INSTANT ACCESS · 100 MONTHLY VIRTUAL COINS'}
            </div>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight font-display">
              {tab === 'login'
                ? (language === 'fr' ? 'Connexion à Hypitt' : 'Sign In to Hypitt')
                : (language === 'fr' ? 'Créer un Compte Hypitt' : 'Create Your Hypitt Account')}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-800 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Google Sign In (Only Google alongside the form per user specification) */}
        <div className="p-6 pb-2 space-y-3">
          <div className="text-[11px] font-mono text-zinc-600 font-semibold uppercase tracking-wider flex items-center justify-between">
            <span>{language === 'fr' ? 'Connexion avec compte Google' : 'Sign In with Google Account'}</span>
            <span className="text-emerald-800 text-[10px] font-bold">
              {language === 'fr' ? '+100 Pièces de Vote' : '+100 Monthly Coins'}
            </span>
          </div>

          <button
            onClick={() => handleSocialAuth('google')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-zinc-200 hover:border-zinc-900 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-900 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{language === 'fr' ? 'Continuer avec Google' : 'Continue with Google Account'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative px-6 py-2">
          <div className="absolute inset-0 flex items-center px-6">
            <div className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase">
            <span className="bg-white px-2 text-zinc-400">
              {language === 'fr' ? 'ou formulaire personnalisé' : 'or use custom form'}
            </span>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="px-6 flex gap-2">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              tab === 'login'
                ? 'bg-zinc-950 text-white font-bold'
                : 'text-zinc-500 hover:text-zinc-800 bg-zinc-100'
            }`}
          >
            {t.nav.login}
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              tab === 'signup'
                ? 'bg-zinc-950 text-white font-bold'
                : 'text-zinc-500 hover:text-zinc-800 bg-zinc-100'
            }`}
          >
            {t.nav.signup}
          </button>
        </div>

        {/* TAB 1: LOG IN */}
        {tab === 'login' && (
          <div className="p-6 pt-4 space-y-4">
            <form onSubmit={handleCustomLogin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-1">
                  {language === 'fr' ? 'Email ou Identifiant' : 'Email or Handle'}
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. @alex_battler or alex@example.com"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-900 text-zinc-900 rounded-lg px-3 py-2 text-xs outline-none transition font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-1">
                  {language === 'fr' ? 'Mot de passe' : 'Password'}
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-900 text-zinc-900 rounded-lg px-3 py-2 text-xs outline-none transition font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold bg-zinc-950 text-white hover:bg-black rounded-xl transition cursor-pointer font-sans shadow-sm mt-1"
              >
                {t.nav.login}
              </button>
            </form>

            {/* Quick Demo Logins */}
            <div className="pt-2 border-t border-zinc-100">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                {language === 'fr' ? 'Ou tester un profil démo' : 'Or switch to a demo profile'}
              </div>
              <div className="space-y-1.5">
                {DEMO_PROFILES.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleSelectDemo(profile)}
                    className="w-full p-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-between text-left transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-[10px]">
                        {profile.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900">{profile.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{profile.handle}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-800">
                      {profile.coins} coins
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SIGN UP */}
        {tab === 'signup' && (
          <form onSubmit={handleCustomSignup} className="p-6 pt-4 space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-1">
                {language === 'fr' ? 'Nom Complet' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="e.g. Jordan River"
                className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-900 text-zinc-900 rounded-lg px-3 py-2 text-xs outline-none transition font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-1">
                {language === 'fr' ? 'Identifiant (@handle)' : 'Handle'}
              </label>
              <input
                type="text"
                value={signupHandle}
                onChange={(e) => setSignupHandle(e.target.value)}
                placeholder="@username"
                className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-900 text-zinc-900 rounded-lg px-3 py-2 text-xs outline-none transition font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-1">
                {language === 'fr' ? 'Génération' : 'Generation Tribe'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Gen Z', 'Millennial'] as const).map((gen) => (
                  <button
                    key={gen}
                    type="button"
                    onClick={() => setSignupGeneration(gen)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                      signupGeneration === gen
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-zinc-50 text-zinc-600 border-zinc-300'
                    }`}
                  >
                    {gen}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-1">
                {language === 'fr' ? 'Biographie / Discipline' : 'Bio / Discipline'}
              </label>
              <input
                type="text"
                value={signupBio}
                onChange={(e) => setSignupBio(e.target.value)}
                placeholder="e.g. Freestyle dancer, debater, beatmaker..."
                className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-900 text-zinc-900 rounded-lg px-3 py-2 text-xs outline-none transition font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-1">
                {language === 'fr' ? 'Mot de passe' : 'Password'}
              </label>
              <input
                type="password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-900 text-zinc-900 rounded-lg px-3 py-2 text-xs outline-none transition font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold bg-zinc-950 text-white hover:bg-black rounded-xl transition cursor-pointer font-sans shadow-sm mt-1"
            >
              {language === 'fr' ? 'Créer un Compte (+100 Pièces de Vote)' : 'Create Account & Claim 100 Voting Coins'}
            </button>
          </form>
        )}

        {/* Accessible Terms of Service and Privacy Policy */}
        <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-100 text-center text-[10px] text-zinc-500 font-mono">
          <span>{language === 'fr' ? 'En continuant, vous acceptez nos ' : 'By continuing, you agree to our '}</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenTerms) onOpenTerms();
            }}
            className="text-zinc-800 font-bold hover:underline cursor-pointer"
          >
            {language === 'fr' ? 'Conditions d’Utilisation' : 'Terms of Service'}
          </button>
          <span> {language === 'fr' ? 'et notre ' : 'and '} </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenPrivacy) onOpenPrivacy();
            }}
            className="text-zinc-800 font-bold hover:underline cursor-pointer"
          >
            {language === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
          </button>
        </div>

      </div>
    </div>
  );
};
