import React, { useState } from 'react';
import { RoastResult } from '../types';
import { Flame, Loader2, ArrowRight, Sparkles, Check, Copy, Share2 } from 'lucide-react';

export const IdeaRoaster: React.FC = () => {
  const [idea, setIdea] = useState<string>('A habit tracker app that reminds people to drink 8 glasses of water a day.');
  const [targetAudience, setTargetAudience] = useState<string>('Busy desk workers and remote professionals');
  const [loading, setLoading] = useState<boolean>(false);
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleRoast = async () => {
    if (!idea.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('/api/roast-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, targetAudience }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setRoastResult(data);
    } catch (err) {
      console.error('Roast error:', err);
      // Fallback
      setRoastResult({
        roast: `Right now, this idea is a classic "graveyard utility." Nobody wakes up and shares a water tracker screenshot with their friends. Utilities are chores; viral apps are status symbols or inside jokes.`,
        thePivot: `Pivot it to "HydrationShame" — an app that connects to your Slack or group chat and publicly issues "Dehydration Sins" or calculates how dried-up your brain is based on your daily coffee-to-water ratio. Let them generate a "Shriveled Kidney Warning Certificate" to send to their perpetually dehydrated co-worker.`,
        viralArtifactConcept: `A tongue-in-cheek "Medical Autopsy of Your Hydration Level" graphic formatted for Slack emojis and Instagram Stories.`,
        viralHooks: [
          `"Send this to your friend whose only hydration is cold brew and anxiety..."`,
          `"This app calculates how close your organs are to becoming beef jerky."`,
          `"We put our entire office's water habits into this and everyone got roasted."`
        ],
        viralScore: 86,
        fallback: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!roastResult) return;
    const text = `ROAST: ${roastResult.roast}\n\nTHE VIRAL PIVOT: ${roastResult.thePivot}\n\nARTIFACT: ${roastResult.viralArtifactConcept}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
          <span>03. Viral Multiplier</span>
          <span aria-hidden="true">·</span>
          <span>From Boring Utility to Viral Cult</span>
          <span aria-hidden="true">·</span>
          <span>Tough-Love Strategy</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          The Viral Idea Roaster & Pivot Lab
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          Got a conventional app idea? Most utility apps die because they lack emotional currency. Enter your idea below to receive a brutal critique and the exact viral pivot to engineer organic velocity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form */}
        <div className="lg:col-span-5 bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Your Current App Idea
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={4}
              placeholder="e.g. A budget tracker for students, a dog walking journal, a bookmark organizer..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 rounded-lg p-3 text-xs outline-none transition resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Intended Target Audience
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Remote tech workers, college freshmen, dog owners..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 rounded-lg px-3.5 py-2.5 text-xs outline-none transition"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleRoast}
              disabled={loading || !idea.trim()}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 rounded-lg shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditing Viral Mechanics...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 text-amber-200" />
                  <span>Roast My Idea & Give Me The Viral Pivot</span>
                </>
              )}
            </button>
          </div>

          {/* Quick preset tests */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-2">Try quick examples:</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  setIdea('An app that tracks how much money you spend on dining out.');
                  setTargetAudience('Young professionals living in cities');
                }}
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-slate-400 hover:text-white rounded border border-slate-800 transition cursor-pointer"
              >
                Dining Out Tracker
              </button>
              <button
                onClick={() => {
                  setIdea('A fitness app for tracking daily pushups and pullups.');
                  setTargetAudience('Gym enthusiasts and calisthenics beginners');
                }}
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-slate-400 hover:text-white rounded border border-slate-800 transition cursor-pointer"
              >
                Pushup Log
              </button>
              <button
                onClick={() => {
                  setIdea('A tool for managing open browser tabs so your laptop stops lagging.');
                  setTargetAudience('Engineers and researchers with 100 open tabs');
                }}
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-slate-400 hover:text-white rounded border border-slate-800 transition cursor-pointer"
              >
                Tab Hoarder Tool
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7">
          {roastResult ? (
            <div className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      The Viral Diagnosis
                    </h3>
                    <div className="text-xs text-slate-400">
                      Potential Viral Quotient:{' '}
                      <span className="font-mono font-bold text-amber-400 tabular-nums">
                        {roastResult.viralScore || 88} / 100
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Pivot'}</span>
                </button>
              </div>

              {/* The Brutal Roast */}
              <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4 space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                  <span>The Brutal Roast (Why It Dies as a Utility)</span>
                </div>
                <p className="text-sm text-red-200 leading-relaxed font-sans pt-1">
                  {roastResult.roast}
                </p>
              </div>

              {/* The Viral Pivot */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Viral Multiplier Pivot (How to Make It Spread)</span>
                </div>
                <p className="text-sm text-emerald-200 leading-relaxed font-sans">
                  {roastResult.thePivot}
                </p>
              </div>

              {/* Shareable Artifact Concept */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>The Required Shareable Artifact</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {roastResult.viralArtifactConcept}
                </p>
              </div>

              {/* Viral Hooks */}
              {roastResult.viralHooks && roastResult.viralHooks.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    TikTok & Twitter Launch Hooks
                  </div>
                  <div className="space-y-1.5">
                    {roastResult.viralHooks.map((h, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-200 italic font-serif"
                      >
                        "{h}"
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#0f172a]/40 rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400 space-y-3">
              <Flame className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">
                Transform any idea into an organic growth machine
              </div>
              <p className="text-xs max-w-sm mx-auto text-slate-500 leading-relaxed">
                Enter your conventional app concept on the left and click "Roast My Idea" to find its hidden social currency angle.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
