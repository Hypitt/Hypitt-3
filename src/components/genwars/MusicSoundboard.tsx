import React, { useState } from 'react';
import { Volume2, Play, Pause, Flame, Sparkles, Disc, Radio } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface BattleTrack {
  id: string;
  generation: 'millennial' | 'genz';
  title: string;
  genre: string;
  vibe: string;
  bpm: number;
  votes: number;
}

const BATTLE_TRACKS: BattleTrack[] = [
  {
    id: '1',
    generation: 'millennial',
    title: 'The Great Avocado Toast Anthem',
    genre: '2000s Pop-Punk / Emo Revival',
    vibe: 'Distorted power chords, raw adolescent angst, screaming in a 2004 Honda Civic.',
    bpm: 165,
    votes: 842
  },
  {
    id: '2',
    generation: 'genz',
    title: 'Subwoofer Doomscroll Phonk',
    genre: 'Drift Phonk / Hyperpop 808s',
    vibe: 'Crushed distortion, 3 AM gym edits, drifting Toyota Chaser, pure adrenaline.',
    bpm: 140,
    votes: 1120
  },
  {
    id: '3',
    generation: 'millennial',
    title: 'Indie Sleaze Blog-House Echo',
    genre: '2010s Electro-Indie',
    vibe: 'Four-on-the-floor kick, synth arpeggios, flash photography, retro thrift jacket.',
    bpm: 128,
    votes: 615
  },
  {
    id: '4',
    generation: 'genz',
    title: 'Speed Up Nightcore Skibidi Beat',
    genre: 'Nightcore Glitch',
    vibe: 'High-pitch vocal chops, 1.5x tempo, Subway Surfers gameplay synced perfectly.',
    bpm: 175,
    votes: 940
  }
];

export const MusicSoundboard: React.FC = () => {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [tracks, setTracks] = useState<BattleTrack[]>(BATTLE_TRACKS);
  const [votedTrack, setVotedTrack] = useState<Record<string, boolean>>({});

  const handlePlaySound = (type: 'vine' | 'dialup' | 'bruh' | 'gavel' | 'cheer') => {
    if (type === 'vine') sounds.playVineBoom();
    if (type === 'dialup') sounds.playDialUp();
    if (type === 'bruh') sounds.playBruh();
    if (type === 'gavel') sounds.playGavel();
    if (type === 'cheer') sounds.playCheer();
  };

  const handleToggleTrack = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      sounds.playVineBoom();
      setPlayingTrack(trackId);
    }
  };

  const handleVoteTrack = (id: string) => {
    if (votedTrack[id]) return;
    sounds.playCheer();
    setVotedTrack((prev) => ({ ...prev, [id]: true }));
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, votes: t.votes + 1 } : t))
    );
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400 mb-2">
          <span>Audio & Sonic Warfare</span>
          <span aria-hidden="true">·</span>
          <span>Web Audio Synthesizer</span>
          <span aria-hidden="true">·</span>
          <span>Anthems & Battle Soundboard</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Volume2 className="w-7 h-7 text-rose-400" />
          <span>Generational Soundboard & Music Station</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          Nothing drives live audience engagement like instant sound bites and high-energy battle beats. Test the live soundboard triggers and vote on generational music anthems.
        </p>
      </div>

      {/* Instant Soundboard Triggers */}
      <div className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-6 mb-10">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
          <span>Instant Live Debate Soundboard (Synthesized via Web Audio API)</span>
          <span className="text-emerald-400">Audio Engine Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <button
            onClick={() => handlePlaySound('vine')}
            className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/40 hover:bg-violet-900/50 transition cursor-pointer text-left space-y-1 active:scale-95"
          >
            <div className="text-xl">💥</div>
            <div className="font-bold text-white text-xs">Vine Boom</div>
            <div className="text-[10px] text-violet-300 font-mono">Sub-Bass Drop</div>
          </button>

          <button
            onClick={() => handlePlaySound('dialup')}
            className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 hover:bg-amber-900/50 transition cursor-pointer text-left space-y-1 active:scale-95"
          >
            <div className="text-xl">📠</div>
            <div className="font-bold text-white text-xs">56k Dial-Up</div>
            <div className="text-[10px] text-amber-300 font-mono">AOL Modem Screech</div>
          </button>

          <button
            onClick={() => handlePlaySound('bruh')}
            className="p-4 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 transition cursor-pointer text-left space-y-1 active:scale-95"
          >
            <div className="text-xl">🗿</div>
            <div className="font-bold text-white text-xs">"Bruh" Thud</div>
            <div className="text-[10px] text-slate-400 font-mono">Low Frequency</div>
          </button>

          <button
            onClick={() => handlePlaySound('gavel')}
            className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/50 transition cursor-pointer text-left space-y-1 active:scale-95"
          >
            <div className="text-xl">⚖️</div>
            <div className="font-bold text-white text-xs">Court Gavel</div>
            <div className="text-[10px] text-rose-300 font-mono">Judicial Verdict</div>
          </button>

          <button
            onClick={() => handlePlaySound('cheer')}
            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/50 transition cursor-pointer text-left space-y-1 active:scale-95"
          >
            <div className="text-xl">🎉</div>
            <div className="font-bold text-white text-xs">Victory Chime</div>
            <div className="text-[10px] text-emerald-300 font-mono">Crowd Applause</div>
          </button>
        </div>
      </div>

      {/* Generational Music Anthem Clash */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
          <span>Generational Battle Tracks & Soundtracks</span>
          <span className="text-slate-500">Live Sound Clash</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.map((track) => {
            const isPlaying = playingTrack === track.id;
            const isGenZ = track.generation === 'genz';

            return (
              <div
                key={track.id}
                className={`p-6 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between space-y-4 ${
                  isGenZ
                    ? 'bg-gradient-to-b from-[#131024] to-[#0a0714] border-violet-500/50'
                    : 'bg-gradient-to-b from-[#21160e] to-[#0f0a06] border-amber-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isGenZ
                          ? 'bg-violet-950 text-violet-300 border border-violet-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {isGenZ ? 'GEN Z · ⚡ BASS WAR' : 'MILLENNIAL · ☕ NOSTALGIA'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {track.bpm} BPM
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-sans">
                    {track.title}
                  </h3>
                  <div className="text-xs text-rose-400 font-mono mt-0.5">
                    {track.genre}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {track.vibe}
                  </p>
                </div>

                {/* Simulated Audio Waveform Bar */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 h-6 py-1">
                    {[12, 24, 18, 30, 15, 28, 20, 32, 16, 25, 14, 22, 30, 18, 26].map(
                      (height, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 rounded-full transition-all duration-200 ${
                            isPlaying
                              ? isGenZ
                                ? 'bg-violet-400 animate-pulse'
                                : 'bg-amber-400 animate-pulse'
                              : 'bg-slate-800'
                          }`}
                          style={{
                            height: isPlaying ? `${Math.max(6, Math.round(height * Math.random()))}px` : '4px'
                          }}
                        />
                      )
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => handleToggleTrack(track.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isPlaying
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlaying ? 'Pause Track' : 'Preview Beat'}</span>
                    </button>

                    <button
                      onClick={() => handleVoteTrack(track.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{track.votes} Crowd Votes</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
