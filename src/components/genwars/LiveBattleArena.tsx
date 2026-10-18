import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Gavel,
  Flame,
  Volume2,
  Users,
  Send,
  Sparkles,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface Comment {
  id: string;
  user: string;
  generation: 'genz' | 'millennial';
  text: string;
  time: string;
}

const DEBATE_TOPICS = [
  'Did TikTok ruin comedy, or is Vine nostalgia pure boomer delusion?',
  'Ankle socks vs Crew socks: Is showing ankle skin an official fashion crime?',
  'Is "Adulting is hard 😂" the most embarrassing sentence in history?',
  'Baggy skater jorts vs Skinny jeans: Which looks worse in 20 years?',
  'Club Penguin & Tamagotchi vs Roblox & Discord: Who had the peak childhood?',
  'Corporate email etiquette: Is "Per my last email" toxic or necessary?'
];

export const LiveBattleArena: React.FC = () => {
  const [topicIdx, setTopicIdx] = useState(0);
  const [genZScore, setGenZScore] = useState(54);
  const [userFaction, setUserFaction] = useState<'genz' | 'millennial'>('genz');
  const [micActive, setMicActive] = useState(false);
  const [camActive, setCamActive] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [judgeVerdict, setJudgeVerdict] = useState<string | null>(null);
  const [flyingEmojis, setFlyingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', user: 'Zoe_Skate', generation: 'genz', text: 'no way she just defended skinny jeans in 2026 💀', time: 'Just now' },
    { id: '2', user: 'Dave_Coffee91', generation: 'millennial', text: 'You guys don’t even know what a 6-second Vine comedic timing is 😂', time: 'Just now' },
    { id: '3', user: 'PixelRizz', generation: 'genz', text: 'Millennials be like: adulting is giving doggo energy 😭', time: '1m ago' },
    { id: '4', user: 'Laura_HR', generation: 'millennial', text: 'Per my last point, we bought houses before the market broke!', time: '2m ago' }
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Toggle webcam preview
  const toggleCamera = async () => {
    if (camActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCamActive(true);
      } catch (err) {
        console.warn('Camera access not available, using animated avatar fallback');
        setCamActive(true);
      }
    }
  };

  const toggleMic = () => {
    setMicActive(!micActive);
    if (!micActive) {
      sounds.playCheer();
    }
  };

  const handleNextTopic = () => {
    setTopicIdx((prev) => (prev + 1) % DEBATE_TOPICS.length);
    setJudgeVerdict(null);
    sounds.playVineBoom();
  };

  const triggerReaction = (emoji: string) => {
    const newId = Date.now() + Math.random();
    const x = Math.floor(Math.random() * 80) + 10;
    setFlyingEmojis((prev) => [...prev, { id: newId, emoji, x }]);

    if (emoji === '💀') {
      sounds.playVineBoom();
      setGenZScore((prev) => Math.min(85, prev + 2));
    } else if (emoji === '😂') {
      sounds.playDialUp();
      setGenZScore((prev) => Math.max(15, prev - 2));
    } else if (emoji === '🔥') {
      sounds.playCheer();
    } else if (emoji === '⚖️') {
      sounds.playGavel();
    }

    setTimeout(() => {
      setFlyingEmojis((prev) => prev.filter((item) => item.id !== newId));
    }, 1800);
  };

  const handleDeliverVerdict = () => {
    sounds.playGavel();
    const isGenZ = genZScore >= 50;
    setJudgeVerdict(
      isGenZ
        ? 'COURT RULING: Gen Z wins this round. Millennial side-part defense fell apart when "adulting" was cited as legitimate vocabulary. Penalty: 24h wearing baggy jorts.'
        : 'COURT RULING: Millennial wins this round. Vine comedic timing remains undefeated compared to 30-part TikTok storytimes. Penalty: Gen Z must speak in complete sentences for 1 week.'
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newComment: Comment = {
      id: String(Date.now()),
      user: userFaction === 'genz' ? 'You_GenZ' : 'You_Millennial',
      generation: userFaction,
      text: chatMessage.trim(),
      time: 'Just now'
    };

    setComments((prev) => [newComment, ...prev.slice(0, 15)]);
    setChatMessage('');
    triggerReaction(userFaction === 'genz' ? '💀' : '😂');
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>LIVE ARENA</span>
            <span aria-hidden="true">·</span>
            <span>OPEN MIC BATTLE #408</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">14.2k Audience</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Gen Wars: Live Open-Mic Showdown</span>
          </h2>
        </div>

        {/* Faction Switcher & Hot Seat CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setUserFaction('genz')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1 ${
                userFaction === 'genz' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⚡ Team Gen Z (💀)</span>
            </button>
            <button
              onClick={() => setUserFaction('millennial')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1 ${
                userFaction === 'millennial' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>☕ Team Millennial (😂)</span>
            </button>
          </div>

          <button
            onClick={() => {
              setInQueue(!inQueue);
              if (!inQueue) sounds.playCheer();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              inQueue
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{inQueue ? 'In Queue (Spot #2)' : 'Hop On Open Mic'}</span>
          </button>
        </div>
      </div>

      {/* Current Topic Banner */}
      <div className="bg-gradient-to-r from-violet-950/40 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Active Clash Question
          </div>
          <div className="text-base sm:text-lg font-bold text-white mt-0.5 font-sans">
            "{DEBATE_TOPICS[topicIdx]}"
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDeliverVerdict}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <Gavel className="w-3.5 h-3.5 text-amber-400" />
            <span>Call Judge Ruling</span>
          </button>
          <button
            onClick={handleNextTopic}
            className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition cursor-pointer"
          >
            Next Topic
          </button>
        </div>
      </div>

      {/* Judge Verdict Box (if called) */}
      {judgeVerdict && (
        <div className="bg-amber-950/30 border-2 border-amber-500/50 rounded-xl p-4 mb-6 text-xs text-amber-200 flex items-start gap-3 shadow-lg">
          <Gavel className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300 font-mono tracking-wider block">OFFICIAL TRIBUNAL VERDICT:</span>
            <p className="leading-relaxed font-sans">{judgeVerdict}</p>
          </div>
        </div>
      )}

      {/* Live Split-Screen Stage + Flying Reactions Container */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Stage Columns (Col 1-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Flying reaction floating emojis */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
              {flyingEmojis.map((item) => (
                <div
                  key={item.id}
                  className="absolute text-2xl transition-all duration-1000 animate-bounce"
                  style={{
                    left: `${item.x}%`,
                    bottom: '20%',
                    transform: 'translateY(-120px)',
                    opacity: 0.9
                  }}
                >
                  {item.emoji}
                </div>
              ))}
            </div>

            {/* LEFT CORNER: GEN Z CHAMPION */}
            <div className="bg-gradient-to-b from-[#131126] to-[#0a0814] rounded-2xl border-2 border-violet-500/60 p-5 relative overflow-hidden flex flex-col justify-between h-[360px] shadow-xl">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                  <span className="text-xs font-mono font-bold text-violet-300">GEN Z CORNER</span>
                </div>
                <span className="text-[10px] font-mono bg-violet-950/80 text-violet-300 px-2 py-0.5 rounded border border-violet-800">
                  ON STAGE · 💀 TEAM
                </span>
              </div>

              {/* Avatar / Video Simulation */}
              <div className="my-auto text-center z-10">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-emerald-400 p-1 mb-3 shadow-lg shadow-violet-900/50">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl font-black text-violet-300">
                    ⚡
                  </div>
                </div>
                <div className="font-extrabold text-white text-base">Kai_21 (Austin, TX)</div>
                <div className="text-xs text-violet-400 font-mono mt-0.5">"Baggy Jorts & Subwoofer"</div>
                <div className="mt-3 bg-violet-950/60 border border-violet-800/60 rounded-lg p-2.5 text-xs text-violet-200 italic font-serif">
                  "Skinny jeans are a sensory nightmare and nobody in history looked cool wearing an ankle sock. Be real."
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-violet-900/40 text-[11px] text-violet-300/80 font-mono z-10">
                <span>MIC: LIVE (SPEAKING)</span>
                <span className="text-emerald-400 font-bold">54% CROWD LEAN</span>
              </div>
            </div>

            {/* RIGHT CORNER: MILLENNIAL CHAMPION / USER STAGE */}
            <div className="bg-gradient-to-b from-[#241a12] to-[#120c06] rounded-2xl border-2 border-amber-500/60 p-5 relative overflow-hidden flex flex-col justify-between h-[360px] shadow-xl">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-xs font-mono font-bold text-amber-300">MILLENNIAL CORNER</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                  ON STAGE · 😂 TEAM
                </span>
              </div>

              {/* Video preview or avatar */}
              <div className="my-auto text-center z-10">
                {camActive ? (
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-amber-400 shadow-lg mb-3">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-orange-400 p-1 mb-3 shadow-lg shadow-amber-900/50">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl font-black text-amber-300">
                      ☕
                    </div>
                  </div>
                )}
                <div className="font-extrabold text-white text-base">Sarah_91 (Seattle, WA)</div>
                <div className="text-xs text-amber-400 font-mono mt-0.5">"Side Part & Americano"</div>
                <div className="mt-3 bg-amber-950/60 border border-amber-800/60 rounded-lg p-2.5 text-xs text-amber-200 italic font-serif">
                  "Six-second Vine format taught an entire generation actual comedic structure. TikTok is just people lip-syncing."
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-amber-900/40 text-[11px] text-amber-300/80 font-mono z-10">
                <span>MIC: {micActive ? 'UNMUTED' : 'MUTED'}</span>
                <span className="text-amber-400 font-bold">46% CROWD LEAN</span>
              </div>
            </div>
          </div>

          {/* Real-time Crowd Tug-of-War Bar */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-violet-400 flex items-center gap-1">
                <span>⚡ Gen Z Favor</span>
                <span className="text-white">({genZScore}%)</span>
              </span>
              <span className="text-slate-400 text-[11px]">LIVE AUDIENCE TUG-OF-WAR</span>
              <span className="text-amber-400 flex items-center gap-1">
                <span>Millennial Favor</span>
                <span className="text-white">({100 - genZScore}%)</span>
              </span>
            </div>

            <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${genZScore}%` }}
              />
              <div
                className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 h-full transition-all duration-300"
                style={{ width: `${100 - genZScore}%` }}
              />
            </div>
          </div>

          {/* Interactive Stage Controls & Live Soundboard */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {/* Camera & Mic toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMic}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                  micActive
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Toggle Mic"
              >
                {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span>{micActive ? 'Mic Active' : 'Unmute Mic'}</span>
              </button>

              <button
                onClick={toggleCamera}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                  camActive
                    ? 'bg-violet-600 text-white border-violet-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Toggle Camera"
              >
                {camActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span>{camActive ? 'Camera On' : 'Preview Cam'}</span>
              </button>
            </div>

            {/* Quick Flying Reaction Triggers */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">React:</span>
              <button
                onClick={() => triggerReaction('💀')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition cursor-pointer active:scale-95"
                title="Gen Z Skull Vote"
              >
                💀
              </button>
              <button
                onClick={() => triggerReaction('😂')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition cursor-pointer active:scale-95"
                title="Millennial Laugh Vote"
              >
                😂
              </button>
              <button
                onClick={() => triggerReaction('🔥')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition cursor-pointer active:scale-95"
                title="Flame Reaction"
              >
                🔥
              </button>
              <button
                onClick={() => triggerReaction('🍅')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition cursor-pointer active:scale-95"
                title="Throw Tomato"
              >
                🍅
              </button>
              <button
                onClick={() => triggerReaction('☕')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition cursor-pointer active:scale-95"
                title="Sip Tea"
              >
                ☕
              </button>
            </div>
          </div>
        </div>

        {/* Live Audience Chat & Hot-Seat Stream (Col 9-12) */}
        <div className="lg:col-span-4 bg-[#0f172a]/90 rounded-2xl border border-slate-800 p-4 flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Live Debate Chat
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Streaming</span>
            </span>
          </div>

          {/* Comment list */}
          <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 text-xs">
            {comments.map((c) => (
              <div
                key={c.id}
                className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        c.generation === 'genz'
                          ? 'bg-violet-950 text-violet-300 border border-violet-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {c.generation === 'genz' ? 'Gen Z' : 'Millennial'}
                    </span>
                    <span>{c.user}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">{c.time}</span>
                </div>
                <p className="text-slate-300 font-sans leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Send comment form */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={`Comment as Team ${userFaction === 'genz' ? 'Gen Z (💀)' : 'Millennial (😂)'}...`}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 rounded-lg px-3 py-2 text-xs outline-none transition"
            />
            <button
              type="submit"
              className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition cursor-pointer shrink-0"
              title="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
