import React, { useState } from 'react';
import { BattleCategory, BattleMediaMode, BattleEntryType, BattleItem, Contender } from '../../types/battleTypes';
import { PlusCircle, Mic, Video, DollarSign, X } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { checkContentSafety } from '../../utils/contentModeration';

interface CreateBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBattle: (battle: BattleItem) => void;
}

export const CreateBattleModal: React.FC<CreateBattleModalProps> = ({
  isOpen,
  onClose,
  onCreateBattle,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BattleCategory>('roasting');
  const [mode, setMode] = useState<BattleMediaMode>('video');
  const [entryType, setEntryType] = useState<BattleEntryType>('free');
  const [entryFee, setEntryFee] = useState<number>(10);
  const [topic, setTopic] = useState('');
  const [rounds, setRounds] = useState<number>(3);

  const [customTheme, setCustomTheme] = useState('');
  const [useCustomTheme, setUseCustomTheme] = useState(false);
  const [competitorCount, setCompetitorCount] = useState<number>(2);
  const [moderationError, setModerationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Content moderation: Automatically detect and block sexual or violent content
    const titleSafety = checkContentSafety(title);
    if (!titleSafety.isSafe) {
      setModerationError(titleSafety.reasonEn || 'Content blocked: explicit or violent terms prohibited.');
      sounds.playDialup();
      return;
    }
    if (topic.trim()) {
      const topicSafety = checkContentSafety(topic);
      if (!topicSafety.isSafe) {
        setModerationError(topicSafety.reasonEn || 'Content blocked: explicit or violent terms prohibited.');
        sounds.playDialup();
        return;
      }
    }
    setModerationError(null);

    const prizePool = entryType === 'paid' ? entryFee * 20 : 100;

    const contendersList: Contender[] = [
      {
        id: 'user_current',
        name: 'Alex Rivera',
        handle: '@alex_battler',
        avatar: 'AR',
        generation: 'Gen Z' as const,
        score: 50,
        freeVotes: 12,
        paidVotes: 0,
        status: 'Challenger On Stage',
        isSpeaking: true,
        videoActive: mode === 'video',
        audioActive: true,
        isMicMuted: false,
        isCameraOff: false,
        quote: 'Taking all challenges live on Hypitt.',
        followers: '14.2k',
      },
      {
        id: 'contender_pending',
        name: 'Open Seat (Hot Mic)',
        handle: '@challenger_ready',
        avatar: 'OS',
        generation: 'Creator' as const,
        score: 50,
        freeVotes: 10,
        paidVotes: 0,
        status: 'Waiting for Challenger',
        isSpeaking: false,
        videoActive: mode === 'video',
        audioActive: false,
        isMicMuted: false,
        isCameraOff: false,
        quote: 'Click Join Hot Seat to battle Alex live!',
        followers: '0',
      },
    ];

    if (competitorCount >= 3) {
      contendersList.push({
        id: `contender_3_${Date.now()}`,
        name: 'Jordan Beats',
        handle: '@jordan_live',
        avatar: 'JB',
        generation: 'Creator' as const,
        score: 50,
        freeVotes: 8,
        paidVotes: 0,
        status: 'Challenger On Stage',
        isSpeaking: false,
        videoActive: mode === 'video',
        audioActive: true,
        isMicMuted: false,
        isCameraOff: false,
        quote: 'Ready with my live rebuttal.',
        followers: '28k',
      });
    }

    if (competitorCount >= 4) {
      contendersList.push({
        id: `contender_4_${Date.now()}`,
        name: 'Maya Cypher',
        handle: '@maya_moves',
        avatar: 'MC',
        generation: 'Gen Z' as const,
        score: 50,
        freeVotes: 9,
        paidVotes: 0,
        status: 'Challenger On Stage',
        isSpeaking: false,
        videoActive: mode === 'video',
        audioActive: true,
        isMicMuted: false,
        isCameraOff: false,
        quote: 'Four-way clash active.',
        followers: '33k',
      });
    }

    if (competitorCount >= 5) {
      contendersList.push({
        id: `contender_5_${Date.now()}`,
        name: 'Leo Rhymes',
        handle: '@leo_flow',
        avatar: 'LR',
        generation: 'Millennial' as const,
        score: 50,
        freeVotes: 11,
        paidVotes: 0,
        status: 'Challenger On Stage',
        isSpeaking: false,
        videoActive: mode === 'video',
        audioActive: true,
        isMicMuted: false,
        isCameraOff: false,
        quote: 'Fifth contender on screen.',
        followers: '45k',
      });
    }

    const newBattle: BattleItem = {
      id: `battle_${Date.now()}`,
      title: title.trim(),
      category,
      customTheme: useCustomTheme && customTheme.trim() ? customTheme.trim() : undefined,
      mode,
      entryType,
      entryFee: entryType === 'paid' ? entryFee : 0,
      prizePool,
      status: 'live',
      audienceCount: 140,
      round: 1,
      totalRounds: rounds,
      timeRemainingSeconds: 60,
      topic: topic.trim() || (useCustomTheme && customTheme ? customTheme : 'Open Freestyle Rules'),
      commentsCount: 1,
      isHostMicMuted: false,
      isHostCameraOff: false,
      contenderA: contendersList[0],
      contenderB: contendersList[1],
      contenders: contendersList,
    };

    sounds.playVineBoom();
    onCreateBattle(newBattle);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative text-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 className="text-lg font-bold text-zinc-900 font-display flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-zinc-900" />
            <span>Launch a Live Battle</span>
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 transition cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-600 font-mono uppercase tracking-wider mb-1">
              Battle Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gen Z vs Millennial Roast War, Afro-House Dance Clash..."
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 text-zinc-900 rounded-lg px-3 py-2 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-600 font-mono uppercase tracking-wider mb-1">
                Discipline Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BattleCategory)}
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg px-3 py-2 outline-none"
              >
                <option value="roasting">Open-Mic Roasting</option>
                <option value="dance">Live Dance Off</option>
                <option value="singing">Open-Mic Singing</option>
                <option value="debate">Customized Debates</option>
                <option value="genz_vs_millennial">Gen Z vs. Millennials</option>
                <option value="comedy">Standup Comedy</option>
                <option value="clout">Follow / Clout Battle</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-600 font-mono uppercase tracking-wider mb-1">
                Media Format
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as BattleMediaMode)}
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg px-3 py-2 outline-none"
              >
                <option value="video">Live Video Stream</option>
                <option value="audio_openmic">Audio Open-Mic (Auto-Camera Unlock)</option>
              </select>
            </div>
          </div>

          {/* Custom Discipline Theme beside given selection */}
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-zinc-800 font-bold flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomTheme}
                  onChange={(e) => setUseCustomTheme(e.target.checked)}
                  className="rounded border-zinc-300 accent-zinc-900 cursor-pointer"
                />
                <span>Set Custom Discipline Theme</span>
              </label>
              <span className="text-[10px] font-mono text-zinc-500">Beside preset disciplines</span>
            </div>

            {useCustomTheme && (
              <input
                type="text"
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                placeholder="e.g. Freestyle Beatbox, Poetry Slam, Speed Coding, Guitar Duel"
                className="w-full bg-white border border-zinc-300 focus:border-zinc-900 rounded-lg px-3 py-1.5 text-xs text-zinc-900 outline-none"
              />
            )}
          </div>

          {/* Competitors in One Screen (Up to 5) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-zinc-600 font-mono uppercase tracking-wider">
                Competitors in One Screen
              </label>
              <span className="text-zinc-900 font-mono font-bold text-xs">
                {competitorCount} Competitors Live
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 5].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setCompetitorCount(cnt)}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-mono font-bold transition cursor-pointer ${
                    competitorCount === cnt
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {cnt === 2 ? '1v1 Duel' : `${cnt} on Screen`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-600 font-mono uppercase tracking-wider mb-1">
                Entry Type
              </label>
              <select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value as BattleEntryType)}
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg px-3 py-2 outline-none"
              >
                <option value="free">Free Entry for Battlers</option>
                <option value="paid">Paid Buy-in Stakes</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-600 font-mono uppercase tracking-wider mb-1">
                Rounds
              </label>
              <select
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg px-3 py-2 outline-none"
              >
                <option value={1}>1 Sudden Death Round</option>
                <option value={2}>2 Rounds</option>
                <option value={3}>3 Full Rounds</option>
                <option value={5}>5 Championship Rounds</option>
              </select>
            </div>
          </div>

          {entryType === 'paid' && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-center justify-between">
              <div>
                <div className="font-bold">Paid Buy-in Fee ($)</div>
                <div className="text-[10px] text-amber-800">
                  Each contender pays this to enter. 90% goes to the prize pool.
                </div>
              </div>
              <input
                type="number"
                min={5}
                max={500}
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                className="w-20 bg-white border border-amber-300 rounded px-2 py-1 text-right font-mono font-bold text-amber-950"
              />
            </div>
          )}

          <div>
            <label className="block text-zinc-600 font-mono uppercase tracking-wider mb-1">
              Debate Topic / Prompt (Optional)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 90s cartoons were superior to modern brainrot reels"
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 text-zinc-900 rounded-lg px-3 py-2 outline-none transition"
            />
          </div>

          {moderationError && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-300 text-red-800 text-xs font-medium">
              {moderationError}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-600 hover:text-zinc-900 transition font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-900 hover:bg-black text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              Launch Live Competition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
