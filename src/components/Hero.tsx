import React from 'react';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreCurated: () => void;
  onOpenGenerator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCurated, onOpenGenerator }) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-800/60 overflow-hidden">
      {/* Subtle background ambient mesh */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-30">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-rose-900/40 via-violet-900/20 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Anti-pill metadata kicker */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400 mb-4">
          <span>Micro-Tribe Engineering</span>
          <span aria-hidden="true">·</span>
          <span>Organic Growth Loops</span>
          <span aria-hidden="true">·</span>
          <span>Social Currency Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight [text-wrap:balance]">
          What Makes an App Go{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400">
            Niched & Viral?
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed [text-wrap:balance]">
          The most viral software isn't broad; it targets an obsessive subculture and gives them an irresistible, shareable mirror of their own ego. Explore 6 battle-tested blueprints, test live interactive artifacts, or generate your own with AI.
        </p>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onExploreCurated}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-lg shadow-rose-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Explore 6 Curated Blueprints</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenGenerator}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Open AI Idea Studio</span>
          </button>
        </div>

        {/* Clean proof strip with tabular numbers */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div>
            <div className="text-2xl font-bold text-white tabular-nums">06</div>
            <div className="text-xs text-slate-400 mt-0.5">Deep-Dive Blueprints</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tabular-nums">&lt; 45s</div>
            <div className="text-xs text-slate-400 mt-0.5">Time-to-Artifact Friction</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tabular-nums">$0.00</div>
            <div className="text-xs text-slate-400 mt-0.5">Required Paid Ad Spend</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tabular-nums">1-Tap</div>
            <div className="text-xs text-slate-400 mt-0.5">9:16 Shareable Artifact Loop</div>
          </div>
        </div>
      </div>
    </section>
  );
};
