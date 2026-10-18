import React from 'react';
import { Layers, ShieldCheck, Zap, DollarSign, Users, Sparkles, TrendingUp, Radio } from 'lucide-react';

export const AppArchitectureGuide: React.FC = () => {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400 mb-2">
          <span>Product Architecture Teardown</span>
          <span aria-hidden="true">·</span>
          <span>Zero-CAC Social Graph</span>
          <span aria-hidden="true">·</span>
          <span>High-Retention Live Media Platform</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-7 h-7 text-rose-400" />
          <span>How This Merged App Works as a Scalable Social Ecosystem</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          By uniting the 3 micro-utilities (CringeCourt, CorpUnmask, DecadeDuel) with live streaming battles, open mics, games, and music, the app operates as a self-sustaining viral media powerhouse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Pillar 1 */}
        <div className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            1. Asynchronous Top-of-Funnel (Zero-CAC)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Users don’t start in live rooms—they discover the app via shared screenshot receipts from <strong>CringeCourt</strong>, <strong>CorpUnmask</strong>, or <strong>DecadeDuel</strong> posted on Instagram Stories and TikTok. Time-to-artifact is under 45 seconds.
          </p>
          <div className="text-[11px] font-mono text-violet-400 pt-2 border-t border-slate-800">
            Metric: Viral Coefficient K &gt; 1.4
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            2. Synchronous Live Battles & Open Mics
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Once inside, users are funnelled into the <strong>Live Arena</strong>. Two creators or audience members take the split-screen stage to debate spicy cultural topics. Audience voting triggers live soundboard hits (Vine booms, dial-up screeches) and shifts the real-time Tug-of-War meter.
          </p>
          <div className="text-[11px] font-mono text-rose-400 pt-2 border-t border-slate-800">
            Metric: Daily Session Time &gt; 28 Minutes
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            3. Live Economy & Virtual Gifting
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Audience members buy coins to trigger premium battle effects: dropping a digital "Giant Avocado" (Millennial tip) or "Golden Skull" (Gen Z tip), buying priority in the Open Mic Hot Seat queue, or calling an AI Judge ruling.
          </p>
          <div className="text-[11px] font-mono text-amber-400 pt-2 border-t border-slate-800">
            Revenue: In-App Coins + Creator Split (70/30)
          </div>
        </div>
      </div>

      {/* Flywheel diagram */}
      <div className="bg-gradient-to-r from-violet-950/30 via-slate-900 to-amber-950/30 rounded-2xl border border-slate-800 p-6 md:p-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>The End-to-End Retention Flywheel</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-mono text-rose-400 font-bold">STAGE 1: DISCOVERY</div>
            <div className="font-bold text-white text-sm">Cringe/Corp Receipts</div>
            <p className="text-slate-400 leading-relaxed">
              Friend shares "I am 84% Elder Millennial" on IG Stories with link.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-mono text-violet-400 font-bold">STAGE 2: ENGAGEMENT</div>
            <div className="font-bold text-white text-sm">Decade Duel Mini-Game</div>
            <p className="text-slate-400 leading-relaxed">
              User tests their texts and plays the 8-round nostalgia showdown game.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-mono text-amber-400 font-bold">STAGE 3: RETENTION</div>
            <div className="font-bold text-white text-sm">Live Open Mic Battles</div>
            <p className="text-slate-400 leading-relaxed">
              User enters live room to watch creators clash on video, throws flying emojis.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-mono text-emerald-400 font-bold">STAGE 4: ADVOCACY</div>
            <div className="font-bold text-white text-sm">Hot Seat & Creator Tips</div>
            <p className="text-slate-400 leading-relaxed">
              User hops on live stage, clips highlights, and reposts to TikTok.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
