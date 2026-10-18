import React, { useState } from 'react';
import { Copy, Check, Share2, AlertTriangle, Scale, ShieldAlert } from 'lucide-react';

interface ArtifactCardProps {
  ideaId: string;
  data: Record<string, string | number>;
  onUpdateField?: (key: string, value: string) => void;
  editable?: boolean;
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({
  ideaId,
  data,
  onUpdateField,
  editable = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const lines = Object.entries(data)
      .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
      .join('\n');
    navigator.clipboard.writeText(`[${ideaId.toUpperCase()} ARTIFACT]\n${lines}\nGenerated with NicheViral.app`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- 1. CRINGECOURT: GEN Z VS MILLENNIAL ALIGNMENT CARD ---
  if (ideaId === 'cringecourt') {
    return (
      <div className="relative w-full max-w-sm mx-auto bg-[#0c101c] text-white p-6 rounded-2xl border-2 border-violet-500/50 shadow-2xl overflow-hidden font-sans text-xs">
        {/* Split Gen Z neon / Millennial blush gradient header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-violet-500 to-rose-400" />
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-violet-400 font-mono text-[11px]">
            <Scale className="w-3.5 h-3.5" />
            <span>CRINGE COURT // DOCKET #2026-Z</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">VERDICT: GUILTY</span>
        </div>

        <div className="my-4 text-center">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">GENERATIONAL VERDICT</div>
          <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-rose-300 to-emerald-300 mt-1">
            {data.generationalVerdict || '78% Elder Millennial'}
          </div>
          <div className="text-slate-400 text-[11px] mt-1 font-mono">
            Brainrot Index: <span className="text-emerald-400 font-bold">{data.brainrotIndex || '0.4%'}</span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-2 text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Capital Sins Detected:</span>
            <span className="text-rose-300 font-semibold">{data.capitalCrimes || 'Used adulting and 😂 in text'}</span>
          </div>
          <div className="pt-1.5 border-t border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Fashion Alignment:</span>
            <span className="text-slate-200">{data.fashionAlignment || 'Ankle socks and skinny jeans'}</span>
          </div>
          <div className="pt-1.5 border-t border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Court Sentence:</span>
            <span className="text-amber-300 font-medium italic">"{data.tribalSentence || '48h TikTok brainrot rehab'}"</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>AUDIT YOUR CRINGE</span>
          <span className="text-violet-400">CringeCourt.app</span>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-violet-300 hover:text-white px-2.5 py-1 bg-violet-950/40 border border-violet-800/40 rounded transition cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Post to TikTok / Story'}</span>
          </button>
        </div>
      </div>
    );
  }

  // --- 2. FRIDGE FORENSICS: ROOMMATE CRIME SCENE DOSSIER ---
  if (ideaId === 'fridge-forensics') {
    return (
      <div className="relative w-full max-w-sm mx-auto bg-[#1a1813] text-amber-100 p-6 rounded-xl border-2 border-amber-600/60 shadow-2xl font-mono text-xs">
        {/* Crime scene caution strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-black to-amber-500" />
        
        <div className="flex items-center justify-between pb-3 border-b border-amber-800/60">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>FRIDGE INVESTIGATION UNIT</span>
          </div>
          <span className="px-1.5 py-0.5 bg-red-950 text-red-400 text-[9px] font-bold rounded border border-red-800">OPEN FELONY</span>
        </div>

        <div className="my-4">
          <div className="text-[10px] text-amber-400/80 uppercase">STOLEN ITEM / CONTRABAND</div>
          <div className="text-base font-bold text-white font-sans mt-0.5">
            {data.stolenItem || "Trader Joe's Soup Dumplings"}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Scene: <span className="text-amber-200">{data.crimeScene || 'Shelf 2, Behind Sriracha'}</span>
          </div>
        </div>

        <div className="bg-black/60 rounded-lg p-3 border border-amber-900/40 space-y-2 text-[11px]">
          <div>
            <span className="text-zinc-500">Time of Incident:</span>{' '}
            <span className="text-zinc-300">{data.timeOfDeath || 'Between 1:30 AM - 3:15 AM'}</span>
          </div>
          <div>
            <span className="text-zinc-500">Prime Suspect:</span>{' '}
            <span className="text-amber-300 font-bold">{data.primeSuspect || 'Late-night snacker'}</span>
          </div>
          <div>
            <span className="text-zinc-500">Circumstantial Proof:</span>{' '}
            <span className="text-zinc-300">{data.evidenceFound || 'Discarded sauce packet in trash'}</span>
          </div>
          <div className="pt-1.5 border-t border-amber-900/40 flex justify-between items-center">
            <span className="text-red-400 font-bold">Mandated Restitution:</span>
            <span className="text-white font-bold">{data.verdictBounty || '1x DoorDash Replacement'}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-900/40 flex items-center justify-between text-[10px] text-zinc-500">
          <span>SUMMONS ISSUED TO HOUSE CHAT</span>
          <span className="text-amber-400">FridgeForensics.app</span>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-white px-2.5 py-1 bg-amber-950/40 border border-amber-700/50 rounded transition cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Post to House Chat'}</span>
          </button>
        </div>
      </div>
    );
  }

  // --- 3. CORP UNMASK: CORPORATE TO RAW GEN Z TRANSLATOR ---
  if (ideaId === 'corp-unmask') {
    return (
      <div className="relative w-full max-w-sm mx-auto bg-[#111827] text-slate-100 p-6 rounded-2xl border border-slate-700 shadow-2xl font-sans text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-emerald-400 font-mono font-bold text-[11px]">CORP-UNMASK DECRYPTION</span>
          <span className="text-slate-500 text-[10px] font-mono">HR RISK LEVEL: 94%</span>
        </div>

        <div className="my-4 space-y-3">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Corporate Millennial Text:</div>
            <div className="text-xs text-slate-300 italic font-serif">
              {data.incomingEmail || '"Just following up on this to see if you had a chance to review!"'}
            </div>
          </div>

          <div className="p-3 bg-emerald-950/30 rounded-lg border border-emerald-500/40">
            <div className="text-[10px] text-emerald-400 uppercase font-mono font-bold mb-1">Raw Unvarnished Truth:</div>
            <div className="text-xs text-emerald-200 font-bold">
              {data.genZTranslation || '"You have been ignoring me for 4 days and I am ready to quit."'}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-lg p-3 space-y-1.5 text-[11px] border border-slate-800">
          <div className="flex justify-between">
            <span className="text-slate-400">Passive-Aggression:</span>
            <span className="text-red-400 font-bold">{data.passiveAggressiveLevel || '94%'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Recommended Reply:</span>
            <span className="text-amber-300 font-semibold">{data.recommendedReply || '"Respectfully, no."'}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>UNMASK WORKPLACE EMAILS</span>
          <span className="text-emerald-400">CorpUnmask.app</span>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded transition cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Share Translation'}</span>
          </button>
        </div>
      </div>
    );
  }

  // --- 4. FLATMATE DUEL: ROOMMATE RADAR ---
  if (ideaId === 'flatmate-duel') {
    return (
      <div className="relative w-full max-w-sm mx-auto bg-[#0f172a] text-slate-100 p-6 rounded-2xl border border-sky-500/40 shadow-2xl font-sans text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-sky-400 font-mono font-bold text-[11px]">FLATMATE COMPATIBILITY RADAR</span>
          <span className="text-slate-400 text-[10px] font-mono">DUEL CODE: #APT-8</span>
        </div>

        <div className="my-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-mono">OVERALL HARMONY SCORE</div>
          <div className="text-2xl font-black text-sky-300 mt-0.5">
            {data.compatibilityScore || '68% (Friction Risk)'}
          </div>
          <div className="text-rose-400 text-[11px] mt-1 font-semibold">
            {data.biggestFlashpoint || 'Unwashed skillet left overnight'}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-3.5 border border-slate-800 space-y-2 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Cleanliness Delta:</span>
            <span className="text-white font-semibold">{data.cleanlinessDelta || 'Alex: 92% vs Sam: 41%'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Sleep Sync:</span>
            <span className="text-amber-300">{data.sleepScheduleSync || 'Complete mismatch'}</span>
          </div>
          <div className="pt-1.5 border-t border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Court Ruling:</span>
            <span className="text-emerald-400 font-bold">{data.arbitrationVerdict || 'Hire weekly maid'}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>DUEL YOUR ROOMMATE</span>
          <span className="text-sky-400">FlatmateDuel.app</span>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-sky-300 hover:text-white px-2.5 py-1 bg-sky-950/40 border border-sky-800/40 rounded transition cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Challenge Roommate'}</span>
          </button>
        </div>
      </div>
    );
  }

  // --- 5. DECADE DUEL: Y2K NOSTALGIA CERTIFICATE ---
  if (ideaId === 'decade-duel') {
    return (
      <div className="relative w-full max-w-sm mx-auto bg-gradient-to-b from-[#191024] to-[#0a0512] text-pink-100 p-6 rounded-2xl border-2 border-pink-500/50 shadow-2xl font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-pink-900/60">
          <span className="font-bold text-pink-400">★ Y2K NOSTALGIA TRIBUNAL ★</span>
          <span className="text-pink-300 text-[10px]">90s vs 00s</span>
        </div>

        <div className="my-4 text-center font-sans">
          <div className="text-[10px] text-pink-300 uppercase font-mono">DECADE SUPREMACY WINNER</div>
          <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-amber-300 to-cyan-300 mt-1">
            {data.generationWinner || 'Elder Millennial (64% Dominance)'}
          </div>
          <div className="text-xs text-amber-200 mt-1 italic font-serif">
            "{data.superiorCulturePick || 'Vine was objectively funnier than TikTok'}"
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-xl p-3 border border-pink-900/40 space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-pink-300/70">Nostalgia Index:</span>
            <span className="text-white font-bold">{data.nostalgiaScore || '92 / 100'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pink-300/70">Formative Trauma:</span>
            <span className="text-pink-200">{data.traumaPoint || 'Dial-up sound'}</span>
          </div>
          <div className="pt-1.5 border-t border-pink-900/40 text-[10px] text-amber-300 font-medium">
            Verdict: {data.ruling || 'Certified to say "kids don\'t go outside"'}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-pink-900/60 flex items-center justify-between text-[10px] text-pink-400/80 font-mono">
          <span>DEFEND YOUR GENERATION</span>
          <span className="text-pink-300">DecadeDuel.app</span>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-pink-300 hover:text-white px-2.5 py-1 bg-pink-950/40 border border-pink-700/50 rounded transition cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Post to Story'}</span>
          </button>
        </div>
      </div>
    );
  }

  // --- 6. PACESHAME: STRAVA VANITY ---
  if (ideaId === 'paceshame') {
    return (
      <div className="relative w-full max-w-sm mx-auto bg-black text-white p-6 rounded-2xl border border-orange-500/40 shadow-2xl overflow-hidden font-mono text-xs">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-rose-500" />
        
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="font-bold tracking-wider text-orange-400">PACESHAME // RUN-ID #882</span>
          </div>
          <span className="text-zinc-500">GARMIN SYNC</span>
        </div>

        <div className="my-5 text-center">
          <div className="text-3xl font-extrabold text-white tracking-tight font-sans">
            {editable ? (
              <input
                type="text"
                value={String(data.distance || '5.2 mi')}
                onChange={(e) => onUpdateField?.('distance', e.target.value)}
                className="bg-zinc-900 border border-zinc-700 text-center rounded px-2 py-0.5 text-orange-400 w-28"
              />
            ) : (
              <span className="text-orange-400">{data.distance || '5.2 mi'}</span>
            )}
          </div>
          <div className="text-zinc-400 text-[11px] mt-0.5">
            Pace: <span className="text-white font-semibold">{data.pace || '8:42 /mi'}</span>
          </div>
        </div>

        <div className="bg-zinc-900/90 rounded-xl p-3.5 border border-zinc-800 my-4 space-y-2">
          <div className="text-zinc-400 text-[10px] uppercase tracking-wider">OFFICIAL ACTIVITY DIAGNOSIS</div>
          <div className="text-sm font-bold text-amber-300 font-sans leading-snug">
            "{data.title || 'Zone 2 Delusion (Actually Stopped 4 Times)'}"
          </div>
          <div className="text-[11px] text-zinc-300 pt-1 border-t border-zinc-800/80">
            <span className="text-zinc-500">Primary Sin:</span> {data.sin || 'Paced specifically to flex on ex'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 pt-2 border-t border-zinc-800">
          <div>
            <div>EGO PERCENTILE</div>
            <div className="text-white font-bold text-xs">{data.percentile || 'Top 8% Vanity'}</div>
          </div>
          <div className="text-right">
            <div>SHAME RATING</div>
            <div className="text-orange-400 font-bold text-xs">{data.shameRating || '8.4 / 10'}</div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-dashed border-zinc-800 flex items-center justify-between text-[9px] text-zinc-500">
          <span>SCAN TO AUDIT YOUR PACE</span>
          <span className="text-orange-400/80">PaceShame.app</span>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2.5 py-1 bg-zinc-800/80 hover:bg-zinc-800 rounded transition cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Share Card'}</span>
          </button>
        </div>
      </div>
    );
  }

  // --- 7. EXTRACTION POLICE: COFFEE RECEIPT ---
  if (ideaId === 'extraction-police') {
    return (
      <div className="relative w-full max-w-sm mx-auto bg-[#faf8f5] text-zinc-900 p-6 rounded-sm shadow-2xl font-mono text-xs border border-zinc-300">
        <div className="text-center pb-3 border-b-2 border-dashed border-zinc-400">
          <div className="text-base font-extrabold tracking-tight">EXTRACTION POLICE</div>
          <div className="text-[10px] text-zinc-600">THIRD-WAVE DISCIPLINARY RECEIPT</div>
          <div className="text-[9px] text-zinc-500 mt-1">DATE: 2026-10-15 // ORDER #4092</div>
        </div>

        <div className="py-4 space-y-2.5 text-[11px] border-b border-dashed border-zinc-400">
          <div className="flex justify-between">
            <span className="text-zinc-600">GRINDER:</span>
            <span className="font-bold text-right">{data.grinder || 'Niche Zero'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600">METHOD:</span>
            <span className="font-bold text-right">{data.brewMethod || 'V60 4:6 Method'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600">ORIGIN:</span>
            <span className="font-bold text-right">{data.beanOrigin || 'Ethiopia Washed'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600">WATER TDS:</span>
            <span className="font-bold text-right">{data.waterTDS || '75 ppm'}</span>
          </div>
        </div>

        <div className="py-4 text-center bg-zinc-100 rounded my-3 border border-zinc-200">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">PRETENTIOUSNESS SCORE</div>
          <div className="text-3xl font-extrabold text-zinc-900 tracking-tight my-0.5">
            {data.pretentiousnessScore || '94 / 100'}
          </div>
          <div className="text-[11px] font-semibold text-rose-700 px-2 leading-tight">
            "{data.ruling || 'Legally prohibited from drinking diner coffee'}"
          </div>
        </div>

        <div className="pt-2 text-center text-[9px] text-zinc-500 space-y-1">
          <div>||| | |||| | |||||| ||| ||||||| | |||</div>
          <div>BARISTA AUTH: 994-01-SNB</div>
          <div className="font-bold text-zinc-800">AUDIT YOUR CUP: ExtractionPolice.app</div>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-900 px-2 py-0.5 border border-zinc-400 rounded transition cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Share Receipt'}</span>
          </button>
        </div>
      </div>
    );
  }

  // --- 8. PASSIVENOTE: APARTMENT CITATION ---
  if (ideaId === 'passivenote') {
    return (
      <div className="relative w-full max-w-sm mx-auto bg-[#131b2e] text-slate-100 p-6 rounded-xl border-2 border-amber-500/60 shadow-2xl font-sans text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-sm font-bold">⚖️ BUREAU OF DOMESTIC PEACE</span>
          </div>
          <span className="font-mono text-[10px] text-amber-400/80">{data.citationId || 'APT-4B-0941'}</span>
        </div>

        <div className="my-4 text-center">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">MANDATORY CITATION</div>
          <div className="text-base font-extrabold text-white mt-1 leading-snug">
            {data.offense || 'Sink Archaeology (Dishes left unwashed > 48h)'}
          </div>
          <div className="text-[11px] text-rose-400 font-mono mt-0.5 font-bold">
            SEVERITY: {data.severity || 'Class A Felony'}
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-lg p-3 space-y-2 border border-slate-800 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Perpetrator:</span>
            <span className="text-slate-200 font-semibold">{data.perpetrator || 'The "Soaker"'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Mandated Penalty:</span>
            <span className="text-amber-300 font-semibold">{data.mandatedFine || 'Buy 1 Pack of Oat Milk'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Appeal Window:</span>
            <span className="text-slate-300 font-mono">{data.appealDeadline || 'Tonight 11:59 PM'}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>SUMMONS ISSUED TO ROOMMATE</span>
          <span className="text-amber-400">PassiveNote.app</span>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded transition cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Send to Group Chat'}</span>
          </button>
        </div>
      </div>
    );
  }

  // --- 9. GHOST INVOICE ---
  if (ideaId === 'ghost-invoice') {
    return (
      <div className="relative w-full max-w-sm mx-auto bg-[#0f141f] text-slate-100 p-6 rounded-xl border border-red-500/40 shadow-2xl font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="text-red-400 font-bold uppercase tracking-wider">STATEMENT OF DELINQUENCY</div>
          <span className="px-2 py-0.5 bg-red-950/80 text-red-400 text-[10px] font-bold rounded border border-red-800/80">OVERDUE</span>
        </div>

        <div className="my-4">
          <div className="text-zinc-500 text-[10px]">CLIENT STATUS</div>
          <div className="text-base font-bold text-white font-sans mt-0.5">
            {data.unpaidDays || '47 Days Past Due'}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 italic font-sans">
            "{data.auditDiagnosis || 'Client likely on retreat in Joshua Tree'}"
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 space-y-2 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Scope Creep Sins:</span>
            <span className="text-slate-200 font-semibold">{data.scopeCreepItems || '14 Unpaid Tweaks'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Emotional Toll Fee:</span>
            <span className="text-red-400 font-bold">{data.emotionalTollFee || '$750.00'}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-800">
            <span className="text-slate-300 font-bold">Total Claim:</span>
            <span className="text-amber-400 font-bold">{data.totalOutstanding || '$4,250.00'}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
          <span>FREELANCE DEFENSE INVOICE</span>
          <span className="text-red-400">GhostInvoice.app</span>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded transition cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Post to LinkedIn'}</span>
          </button>
        </div>
      </div>
    );
  }

  // --- 10. ROMANTASY MATRIX ---
  if (ideaId === 'romantasy-matrix') {
    return (
      <div className="relative w-full max-w-sm mx-auto bg-gradient-to-b from-[#201026] to-[#120718] text-rose-100 p-6 rounded-2xl border border-rose-500/30 shadow-2xl font-sans text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-rose-900/60">
          <span className="font-serif italic text-rose-300 tracking-wider">BOOKTOK READER DOSSIER</span>
          <span className="text-rose-400 text-xs">✧ ✦ ✧</span>
        </div>

        <div className="my-4 text-center">
          <div className="text-[10px] text-rose-400 uppercase tracking-widest font-mono">PRIMARY ROMANCE TROPE</div>
          <div className="text-lg font-serif font-bold text-white mt-1">
            "{data.primaryTrope || 'Enemies to Lovers (With Daggers)'}"
          </div>
          <div className="text-sm mt-1">{data.spiceIndex || '🌶️🌶️🌶️🌶️ (Thermal Hazard)'}</div>
        </div>

        <div className="bg-purple-950/40 rounded-xl p-3 border border-rose-900/40 space-y-2 text-[11px]">
          <div className="flex justify-between">
            <span className="text-rose-300/70">Damage Index:</span>
            <span className="font-bold text-rose-200">{data.emotionalDamage || '98% Heartbreak'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-rose-300/70">Shadow Daddy Level:</span>
            <span className="font-bold text-amber-300">{data.shadowDaddyLevel || 'Maximum'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-rose-300/70">Holy Grail Book:</span>
            <span className="font-semibold text-rose-100 italic">{data.holyGrailBook || 'ACOMAF'}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-rose-900/60 flex items-center justify-between text-[10px] text-rose-400/80 font-mono">
          <span>SHARE YOUR SPICE PROFILE</span>
          <span className="text-rose-300">TropeMatrix.app</span>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-rose-300 hover:text-white px-2.5 py-1 bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700/40 rounded transition cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Post to Story'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Fallback / ThockRank
  return (
    <div className="relative w-full max-w-sm mx-auto bg-[#0d131f] text-slate-100 p-6 rounded-2xl border border-cyan-500/40 shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-cyan-900/50">
        <span className="text-cyan-400 font-bold">ACOUSTIC AUDIT LAB</span>
        <span className="text-[10px] text-slate-500">SPECTRO-ID #904</span>
      </div>

      <div className="my-4 text-center">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest">CLOUT TIER</div>
        <div className="text-xl font-extrabold text-cyan-300 mt-1 font-sans">
          {data.cloutTier || 'S-Tier Holy Panda Ascendant'}
        </div>
        <div className="text-zinc-400 text-[11px] mt-1 font-mono">
          Resonance: {data.dominantFreq || '142 Hz (Deep Thock)'}
        </div>
      </div>

      <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-400">Score:</span>
          <span className="text-cyan-300 font-semibold">{data.lubingScore || '96% Krytox'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Metric Delta:</span>
          <span className="text-emerald-400 font-semibold">{data.spacebarRattle || '0.02%'}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
        <span>TEST SOUND</span>
        <span className="text-cyan-400">ThockRank.app</span>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 px-2.5 py-1 bg-cyan-950/40 border border-cyan-800/40 rounded transition cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Share Card'}</span>
        </button>
      </div>
    </div>
  );
};
