import React from 'react';
import { Mic, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenArena: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenArena }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('live-arena')}
          className="text-lg font-bold tracking-tight text-white hover:text-rose-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-tr from-violet-500 via-rose-500 to-amber-400 inline-block" />
          <span>GenWars</span>
        </button>

        {/* Zone 2: 4-5 clean single-line text nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('live-arena')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
              activeTab === 'live-arena' ? 'text-white font-semibold' : ''
            }`}
          >
            Live Battles
          </button>
          <button
            onClick={() => setActiveTab('unified-engine')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
              activeTab === 'unified-engine' ? 'text-white font-semibold' : ''
            }`}
          >
            3-in-1 Engine
          </button>
          <button
            onClick={() => setActiveTab('creators-photos')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
              activeTab === 'creators-photos' ? 'text-white font-semibold' : ''
            }`}
          >
            Creators & Photos
          </button>
          <button
            onClick={() => setActiveTab('music-soundboard')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
              activeTab === 'music-soundboard' ? 'text-white font-semibold' : ''
            }`}
          >
            Music & Sounds
          </button>
          <button
            onClick={() => setActiveTab('blueprints')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
              activeTab === 'blueprints' ? 'text-white font-semibold' : ''
            }`}
          >
            Blueprints & Roommates
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenArena}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Hop on Mic</span>
          </button>
        </div>
      </div>
    </header>
  );
};
