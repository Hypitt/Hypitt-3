import React, { useState } from 'react';
import { ShieldAlert, Scale, Copy, Check, Share2, Sparkles } from 'lucide-react';
import { ArtifactCard } from './ArtifactCard';

export const RoommateTribunalSimulator: React.FC = () => {
  const [tribunalMode, setTribunalMode] = useState<'citation' | 'fridge'>('citation');
  const [offense, setOffense] = useState<string>('Sink Archaeology (Dishes left unwashed > 48h)');
  const [perpetrator, setPerpetrator] = useState<string>('The Roommate Who "Soaks" Pans');
  const [severity, setSeverity] = useState<string>('Class A Domestic Felony');
  const [mandatedFine, setMandatedFine] = useState<string>('Buying 1 Six-Pack of Oat Milk');
  const [stolenFood, setStolenFood] = useState<string>("Trader Joe's Soup Dumplings (6-pack)");
  const [crimeScene, setCrimeScene] = useState<string>('Shelf 2, Behind the Sriracha');
  const [copied, setCopied] = useState<boolean>(false);

  const citationData = {
    offense,
    severity,
    perpetrator,
    mandatedFine,
    appealDeadline: 'Tonight at 11:59 PM',
    citationId: 'APT-4B-0941',
  };

  const fridgeData = {
    stolenItem: stolenFood,
    crimeScene,
    timeOfDeath: 'Estimated between 1:30 AM - 3:15 AM',
    primeSuspect: perpetrator,
    evidenceFound: '1 discarded sauce packet in kitchen trash',
    verdictBounty: mandatedFine,
  };

  const handleCopySummons = () => {
    const text =
      tribunalMode === 'citation'
        ? `⚖️ [OFFICIAL APARTMENT CITATION]\nOffense: ${offense}\nPerpetrator: ${perpetrator}\nSeverity: ${severity}\nMandated Penalty: ${mandatedFine}\nAppeal Deadline: Tonight at 11:59 PM\nIssued via PassiveNote.app`
        : `🚨 [FRIDGE CRIME SCENE BULLETIN]\nStolen Contraband: ${stolenFood}\nCrime Scene: ${crimeScene}\nPrime Suspect: ${perpetrator}\nRestitution Demanded: ${mandatedFine}\nIssued via FridgeForensics.app`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Interactive Viral Tool</span>
          <span aria-hidden="true">·</span>
          <span>Roommate Conflict & Grievance Arbitration</span>
          <span aria-hidden="true">·</span>
          <span>Direct Group Chat Deployment</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <ShieldAlert className="w-7 h-7 text-amber-400" />
          <span>Roommate War Room: Conflict & Citation Generator</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          Roommates hate awkward direct confrontation, but they love shared group chat satire. Issue official municipal citations for unwashed dishes or declare an FBI-style fridge food crime.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl w-fit mb-8">
        <button
          onClick={() => setTribunalMode('citation')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            tribunalMode === 'citation'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Apartment Citation Ticket</span>
        </button>
        <button
          onClick={() => setTribunalMode('fridge')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            tribunalMode === 'fridge'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Fridge Food Theft Dossier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-6 bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 space-y-5">
          {tribunalMode === 'citation' ? (
            <>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Select Roommate Violation
                </label>
                <select
                  value={offense}
                  onChange={(e) => setOffense(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 rounded-lg px-3.5 py-2.5 text-xs outline-none transition cursor-pointer"
                >
                  <option value="Sink Archaeology (Dishes left unwashed > 48h)">
                    Sink Archaeology (Dishes left unwashed &gt; 48h)
                  </option>
                  <option value="Empty Brita Desertification (Left 2 drops in pitcher)">
                    Empty Brita Desertification (Left 2 drops in pitcher)
                  </option>
                  <option value="Unsanctioned 4th Roommate (Partner living here rent-free)">
                    Unsanctioned 4th Roommate (Partner living here rent-free)
                  </option>
                  <option value="Midnight Kitchen Rave (Cooking steak at 2:30 AM)">
                    Midnight Kitchen Rave (Cooking steak at 2:30 AM)
                  </option>
                  <option value="Hairball Ecosystem (Drain unclogging neglected for weeks)">
                    Hairball Ecosystem (Drain unclogging neglected for weeks)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Suspect / Perpetrator
                  </label>
                  <input
                    type="text"
                    value={perpetrator}
                    onChange={(e) => setPerpetrator(e.target.value)}
                    placeholder="e.g. Dave, The Soaker..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 rounded-lg px-3 py-2 text-xs outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Infraction Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 rounded-lg px-3 py-2 text-xs outline-none transition cursor-pointer"
                  >
                    <option value="Class A Domestic Felony">Class A Domestic Felony</option>
                    <option value="Misdemeanor of Passive Aggression">Misdemeanor of Passive Aggression</option>
                    <option value="Civil Code Violation">Civil Code Violation</option>
                    <option value="Severe Lease Treason">Severe Lease Treason</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Designated Mandated Penalty
                </label>
                <input
                  type="text"
                  value={mandatedFine}
                  onChange={(e) => setMandatedFine(e.target.value)}
                  placeholder="e.g. Buy 1 pack of oat milk, take out trash for 2 weeks..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 rounded-lg px-3.5 py-2.5 text-xs outline-none transition"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Missing Food Item / Contraband
                </label>
                <input
                  type="text"
                  value={stolenFood}
                  onChange={(e) => setStolenFood(e.target.value)}
                  placeholder="e.g. Leftover Pad Thai, Ben & Jerry's pint..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 rounded-lg px-3.5 py-2.5 text-xs outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Crime Scene Location
                  </label>
                  <input
                    type="text"
                    value={crimeScene}
                    onChange={(e) => setCrimeScene(e.target.value)}
                    placeholder="e.g. Shelf 2, Crisper drawer..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 rounded-lg px-3 py-2 text-xs outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Prime Suspect
                  </label>
                  <input
                    type="text"
                    value={perpetrator}
                    onChange={(e) => setPerpetrator(e.target.value)}
                    placeholder="e.g. Midnight snacker..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 rounded-lg px-3 py-2 text-xs outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Mandated Restitution Bounty
                </label>
                <input
                  type="text"
                  value={mandatedFine}
                  onChange={(e) => setMandatedFine(e.target.value)}
                  placeholder="e.g. 1x DoorDash Replacement..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 rounded-lg px-3.5 py-2.5 text-xs outline-none transition"
                />
              </div>
            </>
          )}

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Ready to post into apartment WhatsApp or iMessage.
            </span>
            <button
              onClick={handleCopySummons}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Summons' : 'Copy Group Chat Summons'}</span>
            </button>
          </div>
        </div>

        {/* Right: Live Rendered Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 text-center">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              Live Generated Tribunal Artifact
            </div>
            <div className="py-2">
              <ArtifactCard
                ideaId={tribunalMode === 'citation' ? 'passivenote' : 'fridge-forensics'}
                data={tribunalMode === 'citation' ? citationData : fridgeData}
                editable={false}
              />
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-sm mx-auto">
              Notice the high visual impact: dropping this official slip into a roommate chat diffuses tension with humor while effectively enforcing domestic boundaries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
