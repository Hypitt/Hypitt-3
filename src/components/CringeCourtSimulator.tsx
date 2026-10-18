import React, { useState } from 'react';
import { Scale, Sparkles, Copy, Check, Flame, AlertCircle, RefreshCw } from 'lucide-react';
import { ArtifactCard } from './ArtifactCard';

export const CringeCourtSimulator: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    'Omg I am literally dying right now 😂 adulting is so hard today, need coffee asap!'
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Analysis state
  const analyzeText = (text: string) => {
    const lower = text.toLowerCase();
    
    // Millennial indicators
    const millennialTriggers = ['😂', 'adulting', 'doggo', 'coffee', 'literally', 'fave', 'hubby', 'wine', 'epic', 'side part', 'skinny jeans', 'per my last', 'circle back'];
    let millennialCount = 0;
    millennialTriggers.forEach((word) => {
      if (lower.includes(word)) millennialCount += 1;
    });

    // Gen Z triggers
    const genZTriggers = ['💀', 'cooked', 'delulu', 'fr', 'lowkey', 'giving', 'rizz', 'skibidi', 'bet', 'no cap', 'slay', 'ate', 'ong', 'iykyk', 'idk', 'bruh'];
    let genZCount = 0;
    genZTriggers.forEach((word) => {
      if (lower.includes(word)) genZCount += 1;
    });

    // Punctuation check (Gen Z tends toward no period, all lowercase)
    const isAllLowercase = text === lower && text.length > 5;
    const hasTrailingPeriod = text.trim().endsWith('.');
    if (isAllLowercase) genZCount += 1;
    if (hasTrailingPeriod) millennialCount += 1;

    const total = millennialCount + genZCount;
    let millennialPercent = 65;
    if (total > 0) {
      millennialPercent = Math.min(99, Math.max(1, Math.round((millennialCount / total) * 100)));
    } else {
      millennialPercent = 50;
    }
    const genZPercent = 100 - millennialPercent;

    let verdict = 'Elder Millennial Caught Red-Handed';
    let sentence = 'Sentenced to 72 hours of TikTok slang re-education';
    let sins = 'Used crying-laughing emoji 😂 and adulting in broad daylight';

    if (millennialPercent >= 75) {
      verdict = 'Elder Millennial (Peak 2014 Buzzfeed Era)';
      sins = 'Detected 😂 emoji, overt punctuation, and nostalgic whining';
      sentence = 'Mandatory confiscation of skinny jeans and ankle socks';
    } else if (millennialPercent <= 25) {
      verdict = 'Deep-Fried Gen Z Brainrot Ascendant';
      sins = 'Zero capital letters, excessive 💀 skulls, and slang density';
      sentence = 'Prescribed 1 week of touching grass and speaking in complete sentences';
    } else {
      verdict = 'Zillennial Identity Crisis Limbo';
      sins = 'Switches between 😂 and 💀 depending on who is watching';
      sentence = 'Must choose a side of the part immediately';
    }

    return {
      millennialPercent,
      genZPercent,
      verdict,
      sins,
      sentence,
      brainrotIndex: `${genZPercent}% Brainrot`,
    };
  };

  const results = analyzeText(inputText);

  const cardData = {
    generationalVerdict: `${results.millennialPercent}% Millennial / ${results.genZPercent}% Gen Z`,
    capitalCrimes: results.sins,
    brainrotIndex: results.brainrotIndex,
    fashionAlignment: results.millennialPercent > 50 ? 'Skinny jeans & hidden ankle socks' : 'Baggy carpenter jorts & crew socks',
    tribalSentence: results.sentence,
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(
      `CRINGE COURT VERDICT: ${cardData.generationalVerdict}\nCapital Crimes: ${cardData.capitalCrimes}\nSentence: ${cardData.tribalSentence}\nAudit yourself at CringeCourt.app`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-violet-400 uppercase tracking-wider mb-2">
          <span>Interactive Viral Tool</span>
          <span aria-hidden="true">·</span>
          <span>Gen Z vs Millennial Cultural Duel</span>
          <span aria-hidden="true">·</span>
          <span>Instant Dossier Export</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Scale className="w-7 h-7 text-violet-400" />
          <span>CringeCourt: Emoji, Slang & Generational Auditor</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          The eternal generational war is one of the highest-velocity viral wedges on TikTok and Instagram. Test any text message, email, or bio to see where you land on the Millennial Cringe vs Gen Z Brainrot spectrum.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Console */}
        <div className="lg:col-span-6 bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
              Paste Text Message, Email, or Social Bio
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              placeholder="Paste any text message, Slack message, or tweet..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 text-slate-200 rounded-lg p-3 text-xs outline-none transition resize-none leading-relaxed font-sans"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              Try Viral Test Prompts:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() =>
                  setInputText('Omg I am literally dying right now 😂 adulting is so hard today, need coffee asap!')
                }
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-slate-300 hover:text-white rounded border border-slate-800 transition cursor-pointer"
              >
                😂 Peak Millennial ("Adulting")
              </button>
              <button
                onClick={() =>
                  setInputText('bro is cooked fr fr lowkey giving delulu 💀 ong no cap')
                }
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-slate-300 hover:text-white rounded border border-slate-800 transition cursor-pointer"
              >
                💀 Pure Gen Z Brainrot
              </button>
              <button
                onClick={() =>
                  setInputText('Per my last email, please circle back with the deck by EOD today. Thanks in advance!')
                }
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-slate-300 hover:text-white rounded border border-slate-800 transition cursor-pointer"
              >
                💼 Passive-Aggressive Corporate
              </button>
              <button
                onClick={() =>
                  setInputText('i love harry potter and my side part but i wear baggy pants sometimes idk')
                }
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-slate-300 hover:text-white rounded border border-slate-800 transition cursor-pointer"
              >
                ⚖️ Confused Zillennial
              </button>
            </div>
          </div>

          {/* Real-time Meter Breakdown */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Real-time Generational Barometer
            </div>
            
            {/* Split Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-rose-400">Millennial ({results.millennialPercent}%)</span>
                <span className="text-emerald-400">Gen Z ({results.genZPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300"
                  style={{ width: `${results.millennialPercent}%` }}
                />
                <div
                  className="bg-gradient-to-r from-violet-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${results.genZPercent}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-slate-300 pt-2 border-t border-slate-800 flex items-start gap-2">
              <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Diagnosis:</strong> {results.verdict}.
              </span>
            </div>
          </div>

          {/* Copy Summary */}
          <div className="flex justify-end">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Verdict' : 'Copy Text Verdict'}</span>
            </button>
          </div>
        </div>

        {/* Right: Live Rendered Artifact Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 text-center">
            <div className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-2">
              Live Generated 9:16 Social Artifact
            </div>
            <div className="py-2">
              <ArtifactCard ideaId="cringecourt" data={cardData} editable={false} />
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-sm mx-auto">
              This card is engineered for 9:16 vertical feeds (TikTok reaction videos & Instagram Stories). Its provocative verdict drives friends to comment and test their own text history.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
