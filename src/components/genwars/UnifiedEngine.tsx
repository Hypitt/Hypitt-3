import React, { useState } from 'react';
import { Scale, Briefcase, Trophy, Sparkles, Copy, Check, ArrowRight, Share2, Flame } from 'lucide-react';
import { ArtifactCard } from '../ArtifactCard';
import { sounds } from '../../utils/soundEffects';

const DECADE_MATCHUPS = [
  { id: 1, title: 'Short-Form Comedy', millennial: 'Vine (6-sec timing)', genz: 'TikTok (Infinite scroll)' },
  { id: 2, title: 'Denim Aesthetic', millennial: 'Skinny Jeans', genz: 'Baggy Carpenter Jorts' },
  { id: 3, title: 'Virtual Hangout', millennial: 'Club Penguin & Habbo', genz: 'Roblox & Discord' },
  { id: 4, title: 'Laughter Notation', millennial: 'Crying-Laughing 😂', genz: 'Skull of Death 💀' },
  { id: 5, title: 'Hair Part', millennial: 'Side Part Volume', genz: 'Middle Part Sleek' },
  { id: 6, title: 'Music Discovery', millennial: 'LimeWire (Computer virus)', genz: 'Spotify / TikTok Audio' },
  { id: 7, title: 'Casual Footwear', millennial: 'Hidden Ankle Socks', genz: 'High Crew Tube Socks' },
  { id: 8, title: 'Identity Label', millennial: 'Harry Potter House', genz: 'Co-Star Astrology Birth Chart' },
];

export const UnifiedEngine: React.FC = () => {
  const [activeEngine, setActiveEngine] = useState<'court' | 'corp' | 'duel'>('court');

  // --- CringeCourt State ---
  const [courtInput, setCourtInput] = useState(
    'Omg I am literally dying right now 😂 adulting is so hard today, need coffee asap!'
  );
  const [courtCopied, setCourtCopied] = useState(false);

  // --- CorpUnmask State ---
  const [corpInput, setCorpInput] = useState(
    'Just following up on this to see if you had a chance to review the deck. Happy to jump on a quick sync!'
  );
  const [corpTranslation, setCorpTranslation] = useState(
    'You have ghosted me for 4 business days and I am ready to clock out early.'
  );
  const [corpCopied, setCorpCopied] = useState(false);

  // --- DecadeDuel Game State ---
  const [duelRound, setDuelRound] = useState(0);
  const [duelVotes, setDuelVotes] = useState<Record<number, 'millennial' | 'genz'>>({});
  const [duelFinished, setDuelFinished] = useState(false);
  const [duelCopied, setDuelCopied] = useState(false);

  // Handle CringeCourt Calculation
  const analyzeCourt = (text: string) => {
    const lower = text.toLowerCase();
    const millennialTokens = ['😂', 'adulting', 'doggo', 'coffee', 'literally', 'fave', 'hubby', 'wine', 'side part', 'skinny'];
    const genZTokens = ['💀', 'cooked', 'delulu', 'fr', 'lowkey', 'giving', 'rizz', 'skibidi', 'bet', 'no cap'];
    
    let mCount = 0;
    let zCount = 0;
    millennialTokens.forEach((t) => { if (lower.includes(t)) mCount++; });
    genZTokens.forEach((t) => { if (lower.includes(t)) zCount++; });

    if (text === lower && text.length > 5) zCount += 1;
    if (text.trim().endsWith('.')) mCount += 1;

    const total = mCount + zCount;
    const mPercent = total > 0 ? Math.round((mCount / total) * 100) : 60;
    const zPercent = 100 - mPercent;

    return {
      generationalVerdict: `${mPercent}% Millennial / ${zPercent}% Gen Z`,
      capitalCrimes: mPercent > 50 ? 'Used 😂 and adulting in broad daylight' : 'Excessive skull emojis 💀 and all-lowercase',
      brainrotIndex: `${zPercent}% Brainrot Score`,
      fashionAlignment: mPercent > 50 ? 'Skinny jeans & ankle socks detected' : 'Baggy carpenter jorts & crew socks',
      tribalSentence: mPercent > 50 ? 'Sentenced to 48 hours of TikTok brainrot rehab' : 'Prescribed 1 week of touching grass and speaking in full sentences',
    };
  };

  const courtData = analyzeCourt(courtInput);

  // Handle CorpUnmask Translation
  const handleTranslateCorp = (sample?: string) => {
    sounds.playDialUp();
    const target = sample || corpInput;
    if (target.includes('sync') || target.includes('following up')) {
      setCorpTranslation('You have been ignoring my emails for 4 days and I am ready to resign.');
    } else if (target.includes('Per my last') || target.includes('per my last')) {
      setCorpTranslation('Can you literally just read the words I wrote previously with your eyes?');
    } else if (target.includes('circle back')) {
      setCorpTranslation('I do not want to do this task and I hope we both forget about it by next month.');
    } else {
      setCorpTranslation('Respectfully, I am not doing that unpaid work.');
    }
  };

  // Handle DecadeDuel Vote
  const handleVoteDuel = (choice: 'millennial' | 'genz') => {
    if (choice === 'genz') sounds.playVineBoom();
    else sounds.playDialUp();

    setDuelVotes((prev) => ({ ...prev, [duelRound]: choice }));
    if (duelRound < DECADE_MATCHUPS.length - 1) {
      setDuelRound((prev) => prev + 1);
    } else {
      setDuelFinished(true);
      sounds.playCheer();
    }
  };

  const mWins = Object.values(duelVotes).filter((v) => v === 'millennial').length;
  const zWins = Object.values(duelVotes).filter((v) => v === 'genz').length;
  const winner = mWins >= zWins ? 'Elder Millennial' : 'Gen Z Ascendant';

  const duelCardData = {
    generationWinner: `${winner} (${Math.round((Math.max(mWins, zWins) / 8) * 100)}% Dominance)`,
    superiorCulturePick: mWins >= zWins ? 'Vine & 2000s Pop Punk Supremacy' : 'TikTok & Baggy Jorts Supremacy',
    traumaPoint: mWins >= zWins ? 'LimeWire viruses & dial-up screech' : 'TikTok screen time reports & doomscrolling',
    nostalgiaScore: `${mWins * 12 + 10} / 100`,
    ruling: 'Legally certified to debate internet culture on social media',
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400 mb-2">
          <span>Unified Engine</span>
          <span aria-hidden="true">·</span>
          <span>3-in-1 Generational Suite</span>
          <span aria-hidden="true">·</span>
          <span>Court + Corporate + Decade Duel</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          How the 3 Apps Merge into One High-Retention Ecosystem
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          By combining the <strong>Cringe Court</strong> (text auditor), <strong>CorpUnmask</strong> (workplace translator), and <strong>Decade Duel</strong> (game), users stay in a self-reinforcing viral loop that feeds into the live battle arena.
        </p>
      </div>

      {/* Segmented Control to switch between the 3 sub-apps */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl w-fit mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveEngine('court')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeEngine === 'court'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-violet-300" />
          <span>App 1: CringeCourt (Slang Auditor)</span>
        </button>

        <button
          onClick={() => setActiveEngine('corp')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeEngine === 'corp'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-emerald-300" />
          <span>App 2: CorpUnmask (Email Decoder)</span>
        </button>

        <button
          onClick={() => setActiveEngine('duel')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeEngine === 'duel'
              ? 'bg-pink-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-pink-300" />
          <span>App 3: DecadeDuel (Head-to-Head Game)</span>
        </button>
      </div>

      {/* SUB-APP 1: CRINGE COURT */}
      {activeEngine === 'court' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Paste Any Text Message or Bio
              </label>
              <textarea
                value={courtInput}
                onChange={(e) => setCourtInput(e.target.value)}
                rows={4}
                className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 text-slate-200 rounded-lg p-3 text-xs outline-none transition resize-none font-sans"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCourtInput('Omg I am literally dying right now 😂 adulting is so hard today, need coffee asap!')}
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-slate-300 hover:text-white rounded border border-slate-800 transition cursor-pointer"
              >
                😂 "Adulting & Coffee"
              </button>
              <button
                onClick={() => setCourtInput('nah that is actually cooked fr fr lowkey giving delulu 💀')}
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-slate-300 hover:text-white rounded border border-slate-800 transition cursor-pointer"
              >
                💀 "Cooked & Delulu"
              </button>
              <button
                onClick={() => setCourtInput('i love my side part and skinny jeans, sorry not sorry!')}
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-slate-300 hover:text-white rounded border border-slate-800 transition cursor-pointer"
              >
                👖 "Side Part & Skinny Jeans"
              </button>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between font-mono font-bold">
                <span className="text-rose-400">Millennial Index</span>
                <span className="text-emerald-400">Gen Z Index</span>
              </div>
              <div className="text-slate-300 font-sans leading-relaxed">
                <strong>Verdict:</strong> {courtData.generationalVerdict}. {courtData.capitalCrimes}.
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`CRINGE COURT VERDICT: ${courtData.generationalVerdict}\n${courtData.tribalSentence}`);
                  setCourtCopied(true);
                  setTimeout(() => setCourtCopied(false), 2000);
                }}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
              >
                {courtCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{courtCopied ? 'Copied' : 'Copy Verdict'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 text-center">
            <div className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-2">
              Auto-Generated Social Artifact
            </div>
            <ArtifactCard ideaId="cringecourt" data={courtData} editable={false} />
          </div>
        </div>
      )}

      {/* SUB-APP 2: CORP UNMASK */}
      {activeEngine === 'corp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Corporate Millennial Email Input
              </label>
              <textarea
                value={corpInput}
                onChange={(e) => setCorpInput(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 text-slate-200 rounded-lg p-3 text-xs outline-none transition resize-none font-sans"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  const s = 'Per my last email, please circle back with the updated numbers by EOD.';
                  setCorpInput(s);
                  handleTranslateCorp(s);
                }}
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-slate-300 hover:text-white rounded border border-slate-800 transition cursor-pointer"
              >
                "Per my last email..."
              </button>
              <button
                onClick={() => {
                  const s = 'Happy to jump on a quick sync to align on synergies!';
                  setCorpInput(s);
                  handleTranslateCorp(s);
                }}
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-slate-300 hover:text-white rounded border border-slate-800 transition cursor-pointer"
              >
                "Quick sync on synergies..."
              </button>
              <button
                onClick={() => {
                  const s = 'Let us take this offline and circle back next quarter.';
                  setCorpInput(s);
                  handleTranslateCorp(s);
                }}
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-slate-300 hover:text-white rounded border border-slate-800 transition cursor-pointer"
              >
                "Take this offline..."
              </button>
            </div>

            <button
              onClick={() => handleTranslateCorp()}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Translate to Raw Gen Z Honesty</span>
            </button>

            <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-500/40 space-y-1">
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                Raw Decoded Subtext:
              </div>
              <div className="text-xs text-emerald-200 font-bold font-sans">
                "{corpTranslation}"
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 text-center">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
              Slack / LinkedIn Shareable Slip
            </div>
            <ArtifactCard
              ideaId="corp-unmask"
              data={{
                incomingEmail: `"${corpInput}"`,
                genZTranslation: `"${corpTranslation}"`,
                passiveAggressiveLevel: '94% (Hazardous)',
                recommendedReply: '"Respectfully, I am not doing that."',
              }}
              editable={false}
            />
          </div>
        </div>
      )}

      {/* SUB-APP 3: DECADE DUEL */}
      {activeEngine === 'duel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-xs font-mono text-pink-400 uppercase tracking-wider">
                Round {duelRound + 1} of {DECADE_MATCHUPS.length}
              </div>
              <div className="text-xs font-mono text-slate-400">
                Score: <span className="text-amber-400">{mWins} Millennial</span> vs{' '}
                <span className="text-violet-400">{zWins} Gen Z</span>
              </div>
            </div>

            {!duelFinished ? (
              <div className="space-y-4">
                <div className="text-center py-2">
                  <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                    Category: {DECADE_MATCHUPS[duelRound].title}
                  </div>
                  <div className="text-lg font-bold text-white mt-1">
                    Which was objectively superior?
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleVoteDuel('millennial')}
                    className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/50 hover:bg-amber-950/60 text-left transition cursor-pointer space-y-1"
                  >
                    <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                      ☕ Millennial Pick
                    </div>
                    <div className="text-sm font-bold text-white">
                      {DECADE_MATCHUPS[duelRound].millennial}
                    </div>
                  </button>

                  <button
                    onClick={() => handleVoteDuel('genz')}
                    className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/50 hover:bg-violet-950/60 text-left transition cursor-pointer space-y-1"
                  >
                    <div className="text-[10px] font-mono text-violet-400 uppercase font-bold">
                      ⚡ Gen Z Pick
                    </div>
                    <div className="text-sm font-bold text-white">
                      {DECADE_MATCHUPS[duelRound].genz}
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
                <div className="text-xl font-black text-white">
                  Showdown Concluded!
                </div>
                <div className="text-sm text-pink-300">
                  {winner} takes the crown with {Math.max(mWins, zWins)} out of 8 matchups!
                </div>
                <button
                  onClick={() => {
                    setDuelRound(0);
                    setDuelVotes({});
                    setDuelFinished(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition cursor-pointer"
                >
                  Play Showdown Again
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 text-center">
            <div className="text-xs font-mono text-pink-400 uppercase tracking-wider mb-2">
              Y2K Nostalgia Certificate
            </div>
            <ArtifactCard ideaId="decade-duel" data={duelCardData} editable={false} />
          </div>
        </div>
      )}
    </section>
  );
};
