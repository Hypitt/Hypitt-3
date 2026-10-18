import React, { useState } from 'react';
import { CURATED_VIRAL_IDEAS } from '../data/curatedIdeas';
import { ArtifactCard } from './ArtifactCard';
import { Sparkles, Copy, Check, Target, TrendingUp, DollarSign, Zap } from 'lucide-react';

export const CuratedShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string>('passivenote');
  const [copiedHook, setCopiedHook] = useState<string | null>(null);

  const filteredIdeas =
    selectedCategory === 'all'
      ? CURATED_VIRAL_IDEAS
      : CURATED_VIRAL_IDEAS.filter((idea) => idea.category === selectedCategory);

  const currentIdea =
    filteredIdeas.find((item) => item.id === selectedId) || filteredIdeas[0] || CURATED_VIRAL_IDEAS[0];

  const [artifactData, setArtifactData] = useState<Record<string, string | number>>(
    currentIdea.theArtifact.defaultData
  );

  const handleSelectIdea = (id: string) => {
    setSelectedId(id);
    const target = CURATED_VIRAL_IDEAS.find((item) => item.id === id);
    if (target) {
      setArtifactData(target.theArtifact.defaultData);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const nextList =
      category === 'all'
        ? CURATED_VIRAL_IDEAS
        : CURATED_VIRAL_IDEAS.filter((idea) => idea.category === category);
    if (nextList.length > 0) {
      setSelectedId(nextList[0].id);
      setArtifactData(nextList[0].theArtifact.defaultData);
    }
  };

  const handleUpdateField = (key: string, value: string) => {
    setArtifactData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopyHook = (hook: string) => {
    navigator.clipboard.writeText(hook);
    setCopiedHook(hook);
    setTimeout(() => setCopiedHook(null), 2000);
  };

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
          <span>01. Proven Blueprints</span>
          <span aria-hidden="true">·</span>
          <span>Tested Cultural Fault Lines</span>
          <span aria-hidden="true">·</span>
          <span>Zero-CAC Viral Loops</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Curated Viral App Blueprints
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          Deep-dive blueprints targeting the most viral fault lines on the internet: Roommate domestic drama, Gen Z vs Millennial cultural debates, and obsessed niche micro-communities.
        </p>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Blueprints ({CURATED_VIRAL_IDEAS.length})
        </button>
        <button
          onClick={() => handleCategoryChange('roommates')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
            selectedCategory === 'roommates'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Roommate Wars (3)
        </button>
        <button
          onClick={() => handleCategoryChange('genz-vs-millennials')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
            selectedCategory === 'genz-vs-millennials'
              ? 'bg-violet-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Gen Z vs Millennials (3)
        </button>
        <button
          onClick={() => handleCategoryChange('subcultures')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
            selectedCategory === 'subcultures'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Niche Subcultures (3)
        </button>
        <button
          onClick={() => handleCategoryChange('freelance-work')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
            selectedCategory === 'freelance-work'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Freelance & Work (1)
        </button>
      </div>

      {/* Segmented Filter Control for individual ideas */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto scrollbar-none mb-8">
        {filteredIdeas.map((idea) => {
          const isActive = idea.id === currentIdea.id;
          return (
            <button
              key={idea.id}
              onClick={() => handleSelectIdea(idea.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {idea.name}
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Split: Deep Dive & Live Artifact Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Deep Dive Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {currentIdea.name}
                </h3>
                <p className="text-sm font-medium text-rose-400 mt-0.5">
                  {currentIdea.tagline}
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                MVP: <span className="text-white font-bold tabular-nums">{currentIdea.mvpBuildDays} Days</span>
              </div>
            </div>

            {/* Unboxed Metadata (NO PILLS) */}
            <div className="py-4 border-b border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <Target className="w-3.5 h-3.5 text-rose-400" />
                <span>{currentIdea.nicheTribe}</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentIdea.viralMultiplier}</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentIdea.estimatedTAM}</span>
              </span>
            </div>

            {/* The Psychological Wedge */}
            <div className="pt-5 space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-rose-400" />
                  <span>The Psychological Viral Wedge</span>
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {currentIdea.whyItSpreads}
                </p>
              </div>

              {/* Step-by-Step Viral Loop */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  The 4-Step Distribution Loop
                </h4>
                <div className="space-y-2">
                  {currentIdea.viralLoopSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="text-rose-400 font-mono font-bold shrink-0">
                        0{idx + 1}.
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* First 10k Users Launch Tactic */}
              <div className="pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  First 10,000 Users Playbook
                </h4>
                <p className="text-xs text-slate-300 bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                  {currentIdea.launchTactic}
                </p>
              </div>

              {/* Monetization Engine */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Monetization Blueprint
                </h4>
                <p className="text-xs text-slate-300 bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                  {currentIdea.monetization}
                </p>
              </div>

              {/* Viral Video Hooks */}
              <div className="pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Short-Form Video Hooks (TikTok / Reels / Shorts)
                </h4>
                <div className="space-y-2">
                  {currentIdea.sampleHooks.map((hook, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-200 hover:border-slate-700 transition"
                    >
                      <span className="italic pr-2 font-serif text-slate-300">"{hook}"</span>
                      <button
                        onClick={() => handleCopyHook(hook)}
                        className="shrink-0 p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition cursor-pointer"
                        title="Copy Hook"
                      >
                        {copiedHook === hook ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Viral Artifact Simulator */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Interactive Viral Artifact Simulator
                </h4>
                <p className="text-xs text-slate-400">
                  {currentIdea.theArtifact.description}
                </p>
              </div>
              <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                LIVE DEMO
              </span>
            </div>

            {/* The Live Rendered Card */}
            <div className="py-2">
              <ArtifactCard
                ideaId={currentIdea.id}
                data={artifactData}
                onUpdateField={handleUpdateField}
                editable={true}
              />
            </div>

            {/* Explanation of the Artifact Mechanism */}
            <div className="mt-5 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-200">
                Why this artifact fuels zero-CAC growth:
              </div>
              <p className="leading-relaxed">
                When a user receives this output, it triggers an irresistible urge to screenshot and broadcast it. Notice the prominent subculture inside-jokes, the status verdict, and the bottom referral link driving the next loop.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
