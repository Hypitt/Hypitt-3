import React, { useState } from 'react';
import { Camera, Heart, MessageCircle, Sparkles, Trophy, Users, Flame, Check } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface PhotoClashItem {
  id: string;
  category: string;
  title: string;
  millennialLabel: string;
  millennialDetails: string;
  genZLabel: string;
  genZDetails: string;
  mVotes: number;
  zVotes: number;
}

const PHOTO_CLASHES: PhotoClashItem[] = [
  {
    id: 'ootd',
    category: 'Fashion & OOTD',
    title: 'The Daily Fit Check',
    millennialLabel: 'Indie Sleaze / Skinny & Chelsea Boots',
    millennialDetails: 'Dark-wash skinny jeans, distressed leather jacket, ankle boots, oversized knit scarf.',
    genZLabel: 'Y2K Cyber Skate / Baggy Cargo',
    genZDetails: 'Wide-leg skater jorts, chunky platform sneakers, oversized vintage racing tee, chrome chain.',
    mVotes: 432,
    zVotes: 618
  },
  {
    id: 'workspace',
    category: 'Interior & Desk Setup',
    title: 'The Remote Work Sanctuary',
    millennialLabel: 'The Botanical Coffee Loft',
    millennialDetails: 'Monstera plant in terracotta pot, Chemex pour-over, natural walnut desk, Edison bulb.',
    genZLabel: 'The Cyber Battlestation',
    genZDetails: 'Dual curved OLED monitors, neon purple/cyan RGB strips, lubed mechanical keyboard, anime deskmat.',
    mVotes: 589,
    zVotes: 512
  },
  {
    id: 'nightout',
    category: 'Nightlife & Parties',
    title: 'The Friday Night Vibe',
    millennialLabel: 'Craft Beer & Speakeasy Booth',
    millennialDetails: 'Dim candle-lit cocktail lounge, ordering an artisanal Mezcal Negroni, asking for the Wi-Fi.',
    genZLabel: 'Warehouse Rave & Fast Shades',
    genZDetails: 'Sunglasses indoors at 2 AM, silver metallic parachute pants, filming 5-second 0.5x camera TikToks.',
    mVotes: 390,
    zVotes: 721
  }
];

export const CreatorPhotoClash: React.FC = () => {
  const [clashes, setClashes] = useState<PhotoClashItem[]>(PHOTO_CLASHES);
  const [voted, setVoted] = useState<Record<string, 'm' | 'z'>>({});
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  const handleVote = (clashId: string, side: 'm' | 'z') => {
    if (voted[clashId]) return;
    if (side === 'z') sounds.playVineBoom();
    else sounds.playDialUp();

    setVoted((prev) => ({ ...prev, [clashId]: side }));
    setClashes((prev) =>
      prev.map((c) => {
        if (c.id === clashId) {
          return {
            ...c,
            mVotes: side === 'm' ? c.mVotes + 1 : c.mVotes,
            zVotes: side === 'z' ? c.zVotes + 1 : c.zVotes
          };
        }
        return c;
      })
    );
  };

  const toggleFollow = (creatorId: string) => {
    sounds.playCheer();
    setFollowed((prev) => ({ ...prev, [creatorId]: !prev[creatorId] }));
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400 mb-2">
          <span>Creators & Visual Aesthetics</span>
          <span aria-hidden="true">·</span>
          <span>Side-by-Side Photo Clashes</span>
          <span aria-hidden="true">·</span>
          <span>Community Voting</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Camera className="w-7 h-7 text-rose-400" />
          <span>Creator Arena & Visual Photo Clashes</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          Generational culture isn't just words—it is defined by photography, workspace aesthetics, and streetwear fits. Vote on live side-by-side aesthetic matchups and connect with top generational creators.
        </p>
      </div>

      {/* Top Creators Row */}
      <div className="mb-12">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
          <span>Featured Debate Creators On Stage</span>
          <span className="text-slate-500">Live Profiles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Creator 1: Gen Z */}
          <div className="bg-[#100f24] border border-violet-500/40 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800">
                GEN Z · 💀 TEAM
              </span>
              <span className="text-xs text-slate-400 font-mono">1.4M Fans</span>
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-500 to-emerald-400 p-0.5 mb-2">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xl font-black text-violet-300">
                  ⚡
                </div>
              </div>
              <div className="font-bold text-white text-sm">Aura_Kai</div>
              <div className="text-xs text-violet-400">@kai_baggyfits</div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                "Baggy jorts, 808 bass, and no periods in sentences. Defending Gen Z on stage."
              </p>
            </div>
            <button
              onClick={() => toggleFollow('kai')}
              className={`w-full py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                followed['kai']
                  ? 'bg-slate-800 text-slate-300'
                  : 'bg-violet-600 hover:bg-violet-500 text-white'
              }`}
            >
              {followed['kai'] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Users className="w-3.5 h-3.5" />}
              <span>{followed['kai'] ? 'Following' : 'Follow Creator'}</span>
            </button>
          </div>

          {/* Creator 2: Millennial */}
          <div className="bg-[#1f170e] border border-amber-500/40 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                MILLENNIAL · 😂 TEAM
              </span>
              <span className="text-xs text-slate-400 font-mono">890k Fans</span>
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-rose-400 p-0.5 mb-2">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xl font-black text-amber-300">
                  ☕
                </div>
              </div>
              <div className="font-bold text-white text-sm">Elder_Sarah</div>
              <div className="text-xs text-amber-400">@sarah_pour_over</div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                "Plant mom, Chemex purist, and proud side-part defender. Vine was cinema."
              </p>
            </div>
            <button
              onClick={() => toggleFollow('sarah')}
              className={`w-full py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                followed['sarah']
                  ? 'bg-slate-800 text-slate-300'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {followed['sarah'] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Users className="w-3.5 h-3.5" />}
              <span>{followed['sarah'] ? 'Following' : 'Follow Creator'}</span>
            </button>
          </div>

          {/* Creator 3: Gen Z */}
          <div className="bg-[#100f24] border border-violet-500/40 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800">
                GEN Z · 💀 TEAM
              </span>
              <span className="text-xs text-slate-400 font-mono">2.1M Fans</span>
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 p-0.5 mb-2">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xl font-black text-emerald-300">
                  🛹
                </div>
              </div>
              <div className="font-bold text-white text-sm">Max_Brainrot</div>
              <div className="text-xs text-emerald-400">@max_storytimes</div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                "Subway Surfers split-screen debater and professional lowkey hater."
              </p>
            </div>
            <button
              onClick={() => toggleFollow('max')}
              className={`w-full py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                followed['max']
                  ? 'bg-slate-800 text-slate-300'
                  : 'bg-violet-600 hover:bg-violet-500 text-white'
              }`}
            >
              {followed['max'] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Users className="w-3.5 h-3.5" />}
              <span>{followed['max'] ? 'Following' : 'Follow Creator'}</span>
            </button>
          </div>

          {/* Creator 4: Millennial */}
          <div className="bg-[#1f170e] border border-amber-500/40 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                MILLENNIAL · 😂 TEAM
              </span>
              <span className="text-xs text-slate-400 font-mono">640k Fans</span>
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 mb-2">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xl font-black text-amber-300">
                  💼
                </div>
              </div>
              <div className="font-bold text-white text-sm">Ben_Corporate</div>
              <div className="text-xs text-amber-400">@per_my_last_email</div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                "Decoding LinkedIn humblebrags and keeping adulting humor alive since 2012."
              </p>
            </div>
            <button
              onClick={() => toggleFollow('ben')}
              className={`w-full py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                followed['ben']
                  ? 'bg-slate-800 text-slate-300'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {followed['ben'] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Users className="w-3.5 h-3.5" />}
              <span>{followed['ben'] ? 'Following' : 'Follow Creator'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Photo Clashes */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
          <span>Visual Aesthetic Clashes & Community Verdicts</span>
          <span className="text-slate-500">Vote Below</span>
        </div>

        <div className="space-y-6">
          {clashes.map((item) => {
            const hasVoted = Boolean(voted[item.id]);
            const total = item.mVotes + item.zVotes;
            const mPct = Math.round((item.mVotes / total) * 100);
            const zPct = 100 - mPct;

            return (
              <div
                key={item.id}
                className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-rose-400 tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Total Crowd Votes: <span className="text-white font-bold tabular-nums">{total}</span>
                  </div>
                </div>

                {/* The 2 Aesthetic Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Millennial Aesthetic Side */}
                  <div
                    className={`p-4 rounded-xl border transition ${
                      voted[item.id] === 'm'
                        ? 'bg-amber-950/40 border-amber-500'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                        ☕ Millennial Vision
                      </span>
                      {hasVoted && (
                        <span className="text-xs font-bold text-amber-300 font-mono">
                          {mPct}%
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-white text-sm mb-1">
                      {item.millennialLabel}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                      {item.millennialDetails}
                    </p>
                    <button
                      onClick={() => handleVote(item.id, 'm')}
                      disabled={hasVoted}
                      className={`w-full py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        voted[item.id] === 'm'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : hasVoted
                          ? 'bg-slate-800 text-slate-500'
                          : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{voted[item.id] === 'm' ? 'Your Vote' : 'Vote Millennial Vibe'}</span>
                    </button>
                  </div>

                  {/* Gen Z Aesthetic Side */}
                  <div
                    className={`p-4 rounded-xl border transition ${
                      voted[item.id] === 'z'
                        ? 'bg-violet-950/40 border-violet-500'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-violet-400 font-bold uppercase">
                        ⚡ Gen Z Vision
                      </span>
                      {hasVoted && (
                        <span className="text-xs font-bold text-violet-300 font-mono">
                          {zPct}%
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-white text-sm mb-1">
                      {item.genZLabel}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                      {item.genZDetails}
                    </p>
                    <button
                      onClick={() => handleVote(item.id, 'z')}
                      disabled={hasVoted}
                      className={`w-full py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        voted[item.id] === 'z'
                          ? 'bg-violet-600 text-white font-bold'
                          : hasVoted
                          ? 'bg-slate-800 text-slate-500'
                          : 'bg-violet-500/20 text-violet-300 hover:bg-violet-600 hover:text-white border border-violet-500/30'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{voted[item.id] === 'z' ? 'Your Vote' : 'Vote Gen Z Vibe'}</span>
                    </button>
                  </div>
                </div>

                {/* Progress bar if voted */}
                {hasVoted && (
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-amber-400 h-full transition-all duration-300"
                      style={{ width: `${mPct}%` }}
                    />
                    <div
                      className="bg-violet-500 h-full transition-all duration-300"
                      style={{ width: `${zPct}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
