import React, { useState } from 'react';
import { NICHE_PRESETS } from '../data/codexData';
import { GeneratedIdeaBlueprint } from '../types';
import { Sparkles, Loader2, Copy, Check, Target, Zap, ShieldAlert, ArrowRight, Share2 } from 'lucide-react';

export const IdeaGenerator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('Sourdough Bakers & Wild Yeast Obsessives');
  const [customNiche, setCustomNiche] = useState<string>('');
  const [viralHookType, setViralHookType] = useState<string>('Ego Receipt & Status Index');
  const [vibe, setVibe] = useState<string>('Brutally honest, perceptive, aesthetically elite');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [blueprint, setBlueprint] = useState<GeneratedIdeaBlueprint | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeNiche = customNiche.trim() ? customNiche.trim() : selectedPreset;

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-viral-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: activeNiche,
          viralHookType,
          vibe,
          notes: customNotes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setBlueprint(data);
    } catch (err: any) {
      console.error('Generation error:', err);
      // Fallback in case of server failure
      setBlueprint({
        name: `Cult${activeNiche.replace(/[^a-zA-Z]/g, '').slice(0, 7)}`,
        oneLiner: `The high-status ego index and shareable receipt tailored for ${activeNiche}.`,
        targetTribe: `${activeNiche} obsessives with high internal jargon and pride in their craft.`,
        theViralArtifact: 'A thermal printer receipt graphic itemizing their gear, technique sins, and percentile rank.',
        theWedge: 'People never share generic tools; they share exaggerated trophies of their own identity.',
        theLoop: [
          'User inputs their hyper-specific gear, routine, or metrics',
          'App computes an aesthetic 9:16 score card with sharp diagnosis and clout tier',
          'User posts to social feeds with caption "I feel called out"',
          'Peers click the bottom watermarked link to challenge their score'
        ],
        hooks: [
          `"If you are into ${activeNiche}, this app just exposed your entire setup..."`,
          `"I entered my stats into this tool and got an F for pretentiousness."`,
          `"Send this to that one friend who refuses to stop talking about their hobby."`
        ],
        monetizationPlan: '$3.99/mo for Pro Custom Card themes + high-ticket gear affiliate links.',
        brutalTruth: 'If the output doesn’t make the user feel either deeply validated or hilariously roasted, it will not spread.',
        mvpFeatures: [
          'Instant 30-second audit input form',
          'One-click high-res PNG export formatted for Instagram Stories',
          'Direct Versus duel link for friends to compare',
          'Hall of Fame leaderboard'
        ],
        fallback: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!blueprint) return;
    const text = `# ${blueprint.name} - Viral Niche App Blueprint
**One-Liner**: ${blueprint.oneLiner}
**Target Tribe**: ${blueprint.targetTribe}

## The Viral Artifact
${blueprint.theViralArtifact}

## The Psychological Viral Wedge
${blueprint.theWedge}

## 4-Step Viral Loop
${blueprint.theLoop.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Short-Form Video Hooks
${blueprint.hooks.map((h) => `- "${h}"`).join('\n')}

## Monetization Plan
${blueprint.monetizationPlan}

## The Brutal Truth
${blueprint.brutalTruth}

## 48-Hour MVP Scope
${blueprint.mvpFeatures.map((f) => `- ${f}`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
          <span>02. AI Viral Engine</span>
          <span aria-hidden="true">·</span>
          <span>Powered by Gemini 3.8 Flash</span>
          <span aria-hidden="true">·</span>
          <span>Instant Full Blueprint</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI Viral Niche App Studio
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          Pick an obsessive subculture, configure the viral trigger mechanism, and let AI architect an end-to-end viral product blueprint with built-in social currency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 space-y-6">
          {/* Preset Niches */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
              Select Obsessive Micro-Tribe
            </label>
            <div className="flex flex-wrap gap-1.5">
              {NICHE_PRESETS.map((p) => {
                const isSelected = selectedPreset === p.niche && !customNiche;
                return (
                  <button
                    key={p.label}
                    onClick={() => {
                      setSelectedPreset(p.niche);
                      setCustomNiche('');
                    }}
                    className={`px-2.5 py-1 text-xs rounded-md border transition cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600/20 text-rose-300 border-rose-500/50 font-medium'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Or custom niche */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Or Enter Custom Niche
            </label>
            <input
              type="text"
              value={customNiche}
              onChange={(e) => setCustomNiche(e.target.value)}
              placeholder="e.g. Competitive Scrabble players, Bonsai tree sculptors..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 rounded-lg px-3.5 py-2.5 text-xs outline-none transition"
            />
          </div>

          {/* Viral Trigger Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Viral Trigger Mechanism
            </label>
            <select
              value={viralHookType}
              onChange={(e) => setViralHookType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 rounded-lg px-3.5 py-2.5 text-xs outline-none transition cursor-pointer"
            >
              <option value="Ego Receipt & Status Index">Ego Receipt & Status Index (Spotify Wrapped / Strava)</option>
              <option value="Brutal Truth & Pretentiousness Auditor">Brutal Truth & Pretentiousness Auditor (Tough-Love Roast)</option>
              <option value="Official Satirical Citation & Fine Ticket">Official Satirical Citation & Fine Ticket (Passive-Aggressive)</option>
              <option value="Secret In-Group Dossier & Spice Rating">Secret In-Group Dossier & Spice Rating (BookTok / Cult Pride)</option>
              <option value="Versus Duel & Head-to-Head Battle">Versus Duel & Head-to-Head Battle (Multiplayer Clout)</option>
              <option value="Audio Spectrogram & Sensory Clout">Audio Spectrogram & Sensory Clout (ASMR / Keyboard / Car sound)</option>
            </select>
          </div>

          {/* Tone / Vibe */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Tone & Aesthetic
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 rounded-lg px-3.5 py-2.5 text-xs outline-none transition cursor-pointer"
            >
              <option value="Brutally honest, perceptive, aesthetically elite">Brutally honest, perceptive & aesthetically elite</option>
              <option value="Hilarious satirical bureaucracy">Hilarious satirical bureaucracy</option>
              <option value="High-contrast minimalist streetwear">High-contrast minimalist streetwear</option>
              <option value="Dark Gothic romance / moody aesthetic">Dark Gothic romance / moody aesthetic</option>
              <option value="Wholesome cozy self-care flex">Wholesome cozy self-care flex</option>
            </select>
          </div>

          {/* Optional notes */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Additional Context / Constraints (Optional)
            </label>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Must be buildable as a 1-page React SPA with localStorage, no complex backend..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 rounded-lg p-3 text-xs outline-none transition resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 rounded-lg shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Architecting Viral Blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Viral Niche Blueprint</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Generated Blueprint Output */}
        <div className="lg:col-span-7">
          {blueprint ? (
            <div className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">
                      {blueprint.name}
                    </h3>
                    {blueprint.fallback && (
                      <span className="text-[10px] text-amber-400 font-mono">
                        (Offline Blueprint)
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-rose-400 mt-0.5">
                    {blueprint.oneLiner}
                  </p>
                </div>
                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Markdown</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Blueprint</span>
                    </>
                  )}
                </button>
              </div>

              {/* Target Tribe */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-rose-400" />
                  <span>The Target Tribe & Psychology</span>
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                  {blueprint.targetTribe}
                </p>
              </div>

              {/* The Viral Artifact & The Wedge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>The Shareable Artifact</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {blueprint.theViralArtifact}
                  </p>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>The Psychological Wedge</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {blueprint.theWedge}
                  </p>
                </div>
              </div>

              {/* Step-by-Step Loop */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  4-Step Organic Loop
                </h4>
                <div className="space-y-2">
                  {blueprint.theLoop.map((step, idx) => (
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

              {/* TikTok / Shorts Hooks */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  3-Second Short-Form Hooks
                </h4>
                <div className="space-y-1.5">
                  {blueprint.hooks.map((hook, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-200 italic font-serif"
                    >
                      "{hook}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Monetization & Defensibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                    Monetization Plan
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {blueprint.monetizationPlan}
                  </p>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>The Brutal Truth</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {blueprint.brutalTruth}
                  </p>
                </div>
              </div>

              {/* 48-Hour MVP Scope */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  48-Hour MVP Feature Scope
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {blueprint.mvpFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-3 h-3 text-rose-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0f172a]/40 rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">
                Ready to architect a new viral sensation
              </div>
              <p className="text-xs max-w-sm mx-auto text-slate-500 leading-relaxed">
                Choose a subculture on the left and click "Generate Viral Niche Blueprint" to see complete product mechanics, artifacts, and viral loops.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
