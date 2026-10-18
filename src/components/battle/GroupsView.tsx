import React, { useState } from 'react';
import { BattleGroup } from '../../types/battleTypes';
import { Users, Trophy, Video, Phone, Check, PlusCircle, X } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface GroupsViewProps {
  groups: BattleGroup[];
  onStartCall: (type: 'audio' | 'video', name: string, isGroup: boolean) => void;
  onSelectSquadChat: (name: string) => void;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  groups,
  onStartCall,
  onSelectSquadChat,
}) => {
  const [joinedGroups, setJoinedGroups] = useState<Record<string, boolean>>({
    grp_1: true,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSquadName, setNewSquadName] = useState('');
  const [newSquadTagline, setNewSquadTagline] = useState('');
  const [newSquadCategory, setNewSquadCategory] = useState('dance');

  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const toggleJoin = (id: string) => {
    sounds.playCheer();
    setJoinedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative">
      {/* Toast Notice */}
      {toastNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-zinc-950 text-white text-xs font-mono rounded-xl shadow-2xl border border-zinc-700 animate-in fade-in flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastNotice}</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
            <span>BATTLE SQUADS</span>
            <span>·</span>
            <span>CREWS & LEAGUES</span>
            <span>·</span>
            <span>GROUP CALLS & STATUSES</span>
          </div>
          <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight font-display">
            Battle Squads & Communities
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Join elite dance crews, roasting syndicates, and debate leagues. Host squad group calls and coordinated battles.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-zinc-900 hover:bg-black rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create New Squad</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => {
          const isMember = Boolean(joinedGroups[group.id]);

          return (
            <div
              key={group.id}
              className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between space-y-5 shadow-xs relative overflow-hidden text-zinc-900"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 uppercase font-semibold border border-zinc-200">
                    {group.category} CREW
                  </span>

                  {/* Group Status Badge */}
                  <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>{group.status}</span>
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-mono font-bold text-zinc-800 shrink-0">
                    {group.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 font-display">{group.name}</h3>
                    <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed font-sans">
                      {group.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats & Next Clash */}
              <div className="grid grid-cols-3 gap-2 bg-zinc-50 rounded-xl p-3 border border-zinc-100 text-center text-xs">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Members</div>
                  <div className="font-bold text-zinc-800 tabular-nums">
                    {group.membersCount + (isMember ? 1 : 0)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Record</div>
                  <div className="font-bold text-zinc-800 tabular-nums">
                    {group.wins}W - {group.losses}L
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Recruiting</div>
                  <div className="font-bold text-emerald-700">
                    {group.isRecruiting ? 'Open' : 'Invite Only'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                <button
                  onClick={() => toggleJoin(group.id)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isMember
                      ? 'bg-zinc-100 text-zinc-800 border border-zinc-300 hover:bg-zinc-200'
                      : 'bg-zinc-900 text-white hover:bg-black shadow-xs'
                  }`}
                >
                  {isMember ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Joined Squad</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-3.5 h-3.5" />
                      <span>Join Squad</span>
                    </>
                  )}
                </button>

                {isMember && (
                  <>
                    <button
                      onClick={() => onSelectSquadChat(group.name)}
                      className="px-3 py-2 text-xs font-semibold bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 rounded-xl transition cursor-pointer"
                      title="Squad Chat & Documents"
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => onStartCall('video', group.name, true)}
                      className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl transition cursor-pointer border border-zinc-200"
                      title="Start Squad Video Call"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onStartCall('audio', group.name, true)}
                      className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl transition cursor-pointer border border-zinc-200"
                      title="Start Squad Audio Call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Squad Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-bold font-display text-zinc-900">
                Create New Battle Squad
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newSquadName.trim()) return;
                sounds.playCheer();
                setShowCreateModal(false);
                setToastNotice(`Squad "${newSquadName}" created! You can now invite creators.`);
                setTimeout(() => setToastNotice(null), 3500);
                setNewSquadName('');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-zinc-600 font-mono uppercase mb-1">Squad Name</label>
                <input
                  type="text"
                  required
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  placeholder="e.g. Brooklyn Krump Alliance, Gen Z Roast Syndicate..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-mono uppercase mb-1">Tagline</label>
                <input
                  type="text"
                  value={newSquadTagline}
                  onChange={(e) => setNewSquadTagline(e.target.value)}
                  placeholder="e.g. Undefeated in 140 BPM open-mic battles"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-mono uppercase mb-1">Category</label>
                <select
                  value={newSquadCategory}
                  onChange={(e) => setNewSquadCategory(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 outline-none"
                >
                  <option value="dance">Dance Crew</option>
                  <option value="roasting">Roasting Syndicate</option>
                  <option value="singing">Vocal & Acapella Choir</option>
                  <option value="debate">Debate Society</option>
                  <option value="comedy">Standup Collective</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 text-white rounded-lg font-bold hover:bg-black transition cursor-pointer"
                >
                  Form Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
