import React, { useState } from 'react';
import {
  PlusCircle,
  Coins,
  Home,
  Swords,
  Search,
  MessageSquare,
  User as UserIcon,
  LogIn,
  LogOut,
  ChevronDown,
  Gift,
  Globe
} from 'lucide-react';
import { UserProfile } from '../../types/battleTypes';
import { Language, TRANSLATIONS } from '../../utils/i18n';

interface BattleNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreateModal: () => void;
  user: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onClaimMonthlyCoins?: () => void;
  language?: Language;
  onSelectLanguage?: (lang: Language) => void;
}

export const BattleNavbar: React.FC<BattleNavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  user,
  onOpenAuth,
  onLogout,
  onClaimMonthlyCoins,
  language = 'en',
  onSelectLanguage,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const t = TRANSLATIONS[language];

  const toggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'fr' : 'en';
    if (onSelectLanguage) onSelectLanguage(nextLang);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark Brand */}
        <button
          onClick={() => setActiveTab('home')}
          className="text-lg font-bold tracking-tight text-zinc-900 hover:text-black transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer font-display"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-zinc-900 inline-block" />
          <span>Hypitt</span>
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-semibold border border-zinc-200">
            COMPETE
          </span>
        </button>

        {/* Zone 2: Navigation links with exact labels requested by user */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-zinc-600">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-zinc-900 cursor-pointer py-1 ${
              activeTab === 'home' ? 'text-zinc-950 border-b-2 border-zinc-900 font-bold' : ''
            }`}
          >
            {language === 'fr' ? 'Accueil' : 'Home'}
          </button>
          <button
            onClick={() => setActiveTab('battles')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-zinc-900 cursor-pointer py-1 ${
              activeTab === 'battles' ? 'text-zinc-950 border-b-2 border-zinc-900 font-bold' : ''
            }`}
          >
            {language === 'fr' ? 'Compétitions en Direct' : 'Live Competitions'}
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-zinc-900 cursor-pointer py-1 flex items-center gap-1 ${
              activeTab === 'search' ? 'text-zinc-950 border-b-2 border-zinc-900 font-bold' : ''
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Recherche & Flux' : 'Search & Feeds'}</span>
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-zinc-900 cursor-pointer py-1 ${
              activeTab === 'create' ? 'text-zinc-950 border-b-2 border-zinc-900 font-bold' : ''
            }`}
          >
            {language === 'fr' ? 'Créer & Concourir' : 'Host & Compete'}
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-zinc-900 cursor-pointer py-1 ${
              activeTab === 'media' ? 'text-zinc-950 border-b-2 border-zinc-900 font-bold' : ''
            }`}
          >
            {language === 'fr' ? 'Hub Médias' : 'Media Hub'}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-zinc-900 cursor-pointer py-1 flex items-center gap-1 ${
              activeTab === 'messages' ? 'text-zinc-950 border-b-2 border-zinc-900 font-bold' : ''
            }`}
          >
            <span>{language === 'fr' ? 'Messages & Appels' : 'Chats & Calls'}</span>
            <span className="px-1.5 py-0.2 bg-zinc-900 text-white text-[9px] font-bold rounded-full font-mono">
              4
            </span>
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('profile')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-zinc-900 cursor-pointer py-1 ${
                activeTab === 'profile' ? 'text-zinc-950 border-b-2 border-zinc-900 font-bold' : ''
              }`}
            >
              {language === 'fr' ? 'Tableau de Bord' : 'Creator Dashboard'}
            </button>
          )}

          {/* Language Switcher directly alongside nav links */}
          <div className="flex items-center rounded-lg border border-zinc-300 bg-zinc-100 p-0.5 text-[11px] font-mono font-bold ml-2">
            <button
              onClick={() => onSelectLanguage?.('en')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                language === 'en' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => onSelectLanguage?.('fr')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                language === 'fr' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
              }`}
              title="Français"
            >
              FR
            </button>
          </div>
        </nav>

        {/* Zone 3: User actions & mobile language switcher */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Mobile view language switcher */}
          <div className="lg:hidden flex items-center rounded-lg border border-zinc-300 bg-zinc-100 p-0.5 text-[10px] font-mono font-bold">
            <button
              onClick={() => onSelectLanguage?.('en')}
              className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                language === 'en' ? 'bg-zinc-950 text-white' : 'text-zinc-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onSelectLanguage?.('fr')}
              className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                language === 'fr' ? 'bg-zinc-950 text-white' : 'text-zinc-600'
              }`}
            >
              FR
            </button>
          </div>

          {user ? (
            <>
              {/* Monthly Coins Unlock Badge */}
              {!user.monthlyCoinsClaimed && onClaimMonthlyCoins && (
                <button
                  onClick={onClaimMonthlyCoins}
                  className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-mono font-bold hover:bg-amber-100 transition cursor-pointer"
                  title="Claim 100 Monthly Voting Coins"
                >
                  <Gift className="w-3 h-3 text-amber-600" />
                  <span>{t.nav.monthlyCoins}</span>
                </button>
              )}

              {/* Coins Pill */}
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-mono hover:bg-zinc-200 transition cursor-pointer"
                title="Virtual Coins Balance"
              >
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span className="tabular-nums font-bold">{user.coins}c</span>
              </button>

              {/* Create CTA */}
              <button
                onClick={() => setActiveTab('create')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-black rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t.nav.create}</span>
              </button>

              {/* User Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-lg bg-zinc-100 border border-zinc-200 hover:border-zinc-300 transition cursor-pointer"
                >
                  <div className="w-6 h-6 rounded bg-zinc-200 border border-zinc-300 flex items-center justify-center text-[10px] font-bold text-zinc-800 font-mono">
                    {user.avatar}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-zinc-900 max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-500 mr-1" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-zinc-200 rounded-xl shadow-xl py-1 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-zinc-100">
                      <div className="font-bold text-zinc-900 truncate">{user.name}</div>
                      <div className="text-[10px] font-mono text-zinc-500 truncate">{user.handle}</div>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveTab('profile');
                      }}
                      className="w-full text-left px-3 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 flex items-center gap-2 cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{t.nav.profile}</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        toggleLanguage();
                      }}
                      className="w-full text-left px-3 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 flex items-center gap-2 cursor-pointer border-t border-zinc-100"
                    >
                      <Globe className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{language === 'en' ? 'Passer en Français (FR)' : 'Switch to English (EN)'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-zinc-100 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.nav.login}</span>
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-zinc-900 hover:bg-black rounded-lg shadow-xs transition cursor-pointer"
              >
                {t.nav.signup}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile / Tablet Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-zinc-200 py-2 px-3 flex items-center justify-around text-xs">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'home' ? 'text-zinc-900 font-bold' : 'text-zinc-400'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">{t.nav.home}</span>
        </button>
        <button
          onClick={() => setActiveTab('battles')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'battles' ? 'text-zinc-900 font-bold' : 'text-zinc-400'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span className="text-[10px]">{t.nav.battles}</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'search' ? 'text-zinc-900 font-bold' : 'text-zinc-400'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px]">{t.nav.search}</span>
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className="flex flex-col items-center -mt-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-md">
            <PlusCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-zinc-800 font-medium mt-0.5">{t.nav.create}</span>
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center gap-1 cursor-pointer relative ${
            activeTab === 'messages' ? 'text-zinc-900 font-bold' : 'text-zinc-400'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4" />
            <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-zinc-900 text-white text-[8px] font-bold flex items-center justify-center">
              4
            </span>
          </div>
          <span className="text-[10px]">{t.nav.chats}</span>
        </button>
        <button
          onClick={() => {
            if (user) setActiveTab('profile');
            else onOpenAuth('login');
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'profile' ? 'text-zinc-900 font-bold' : 'text-zinc-400'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span className="text-[10px]">{user ? t.nav.profile : t.nav.login}</span>
        </button>
      </div>
    </header>
  );
};
