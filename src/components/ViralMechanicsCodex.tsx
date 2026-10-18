import React, { useState } from 'react';
import { VIRAL_LAWS } from '../data/codexData';
import { CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const ViralMechanicsCodex: React.FC = () => {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    artifact: true,
    subculture: true,
    ego: true,
    friction: false,
    watermark: true,
    duel: false,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const viralScore = Math.round((checkedCount / 6) * 100);

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
          <span>04. The Playbook</span>
          <span aria-hidden="true">·</span>
          <span>Growth Engineering Codex</span>
          <span aria-hidden="true">·</span>
          <span>Zero Paid CAC</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
          The 6 Iron Laws of Viral Micro-Software
        </h2>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed [text-wrap:balance]">
          Why do 99% of utility apps languish with zero downloads, while a 1-page side project reaches 1,000,000 users over a weekend? Every viral software follows these exact cognitive mechanics.
        </p>
      </div>

      {/* Grid of the 6 Laws */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {VIRAL_LAWS.map((law) => (
          <div
            key={law.number}
            className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <div className="text-xs font-mono text-rose-400 font-bold tracking-widest mb-1">
                LAW {law.number}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {law.title}
              </h3>
              <p className="text-xs font-semibold text-slate-300 mb-3">
                {law.summary}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {law.theSecret}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
              <span className="text-slate-400 font-medium">Real-World Case:</span>{' '}
              {law.realWorldExample}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Virality Audit Checklist */}
      <div className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 md:p-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
              <span>Interactive Viral Readiness Audit</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Check off the viral traits your proposed app embodies:
            </p>
          </div>
          <div className="text-right sm:text-right">
            <div className="text-xs font-mono text-slate-400">VIRAL POTENTIAL SCORE</div>
            <div className="text-3xl font-extrabold text-rose-400 tabular-nums">
              {viralScore}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <label
            onClick={() => toggleCheck('artifact')}
            className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
              checklist.artifact
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <input
              type="checkbox"
              checked={checklist.artifact}
              onChange={() => {}}
              className="mt-0.5 accent-rose-500 rounded"
            />
            <div className="text-xs">
              <span className="font-bold block text-white">Generates a Shareable Visual Asset</span>
              The output is a 9:16 high-contrast image (receipt, badge, card), not plain text.
            </div>
          </label>

          <label
            onClick={() => toggleCheck('subculture')}
            className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
              checklist.subculture
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <input
              type="checkbox"
              checked={checklist.subculture}
              onChange={() => {}}
              className="mt-0.5 accent-rose-500 rounded"
            />
            <div className="text-xs">
              <span className="font-bold block text-white">Targets an Obsessive Micro-Tribe</span>
              Focused on an intense subculture (runners, coffee snobs, BookTok) with its own slang.
            </div>
          </label>

          <label
            onClick={() => toggleCheck('ego')}
            className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
              checklist.ego
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <input
              type="checkbox"
              checked={checklist.ego}
              onChange={() => {}}
              className="mt-0.5 accent-rose-500 rounded"
            />
            <div className="text-xs">
              <span className="font-bold block text-white">Social Status or Ego Vehicle</span>
              Gives users an excuse to humblebrag, roast themselves, or signal high taste.
            </div>
          </label>

          <label
            onClick={() => toggleCheck('friction')}
            className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
              checklist.friction
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <input
              type="checkbox"
              checked={checklist.friction}
              onChange={() => {}}
              className="mt-0.5 accent-rose-500 rounded"
            />
            <div className="text-xs">
              <span className="font-bold block text-white">Under 45 Seconds to First Output</span>
              Zero signup walls, credit cards, or passwords before generating the asset.
            </div>
          </label>

          <label
            onClick={() => toggleCheck('watermark')}
            className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
              checklist.watermark
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <input
              type="checkbox"
              checked={checklist.watermark}
              onChange={() => {}}
              className="mt-0.5 accent-rose-500 rounded"
            />
            <div className="text-xs">
              <span className="font-bold block text-white">Built-in Referral Watermark</span>
              Every shared screenshot has a clean watermark or URL directing viewers to try it.
            </div>
          </label>

          <label
            onClick={() => toggleCheck('duel')}
            className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
              checklist.duel
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <input
              type="checkbox"
              checked={checklist.duel}
              onChange={() => {}}
              className="mt-0.5 accent-rose-500 rounded"
            />
            <div className="text-xs">
              <span className="font-bold block text-white">Multiplayer / Versus Duel Mechanism</span>
              The viewer can immediately click to compare, counter-audit, or challenge a friend.
            </div>
          </label>
        </div>

        {/* Verdict message based on score */}
        <div className="pt-4 border-t border-slate-800 flex items-start gap-3">
          {viralScore >= 80 ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-emerald-400">Explosive Viral Velocity:</span> Your concept possesses the core psychological catalysts needed for organic wildfire spread without paid advertising.
              </div>
            </>
          ) : viralScore >= 50 ? (
            <>
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-amber-400">Moderate Velocity:</span> Add a clearer shareable artifact or reduce time-to-output under 45 seconds to unlock full organic distribution.
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-rose-400">High Churn Utility Risk:</span> This idea behaves like a generic utility. Pivot toward identity signaling, status receipts, or in-group satire.
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
