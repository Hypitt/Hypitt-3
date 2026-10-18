import React, { useState, useRef } from 'react';
import { StatusRing, UserProfile } from '../../types/battleTypes';
import { Plus, X, Heart, Send, Check, Camera, Image as ImageIcon, Sparkles, Radio } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { Language } from '../../utils/i18n';
import { checkContentSafety } from '../../utils/contentModeration';

interface StatusRingsBarProps {
  statusRings: StatusRing[];
  currentUser: UserProfile;
  onOpenUpdateStatus?: () => void;
  onChallengeCreator: (creatorName: string) => void;
  onSendDM?: (creatorName: string) => void;
  onAddStatusStory?: (story: StatusRing) => void;
  language?: Language;
}

const PRESET_STORY_PHOTOS = [
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
];

export const StatusRingsBar: React.FC<StatusRingsBarProps> = ({
  statusRings,
  currentUser,
  onOpenUpdateStatus,
  onChallengeCreator,
  onSendDM,
  onAddStatusStory,
  language = 'en',
}) => {
  const [selectedStory, setSelectedStory] = useState<StatusRing | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replied, setReplied] = useState(false);

  // Add status with picture modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusCaption, setStatusCaption] = useState('');
  const [statusState, setStatusState] = useState<'in_battle' | 'live_stream' | 'rehearsing' | 'open_duel'>('open_duel');
  const [statusPhotoUrl, setStatusPhotoUrl] = useState<string | null>(null);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenStory = (ring: StatusRing) => {
    sounds.playVineBoom();
    setSelectedStory(ring);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sounds.playCheer();
    setReplied(true);
    setTimeout(() => {
      setReplied(false);
      setReplyText('');
      setSelectedStory(null);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setStatusPhotoUrl(url);
    sounds.playVineBoom();
  };

  const handlePublishStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusCaption.trim() && !statusPhotoUrl) return;

    // Content moderation: Automatically detect and block sexual or violent content
    if (statusCaption.trim()) {
      const safety = checkContentSafety(statusCaption);
      if (!safety.isSafe) {
        setModerationError(language === 'fr' ? safety.reasonFr || 'Contenu bloqué' : safety.reasonEn || 'Content blocked');
        sounds.playDialup();
        return;
      }
    }
    setModerationError(null);

    sounds.playCheer();
    const newRing: StatusRing = {
      id: `ring_${Date.now()}`,
      creatorName: currentUser.name,
      creatorHandle: currentUser.handle,
      avatar: currentUser.avatar,
      statusText: statusCaption.trim() || 'Active Story',
      state: statusState,
      hasUnseenStory: true,
      storyMedia: {
        type: 'picture',
        caption: statusCaption.trim() || 'Live picture on status ring.',
        timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
        photoUrl: statusPhotoUrl || PRESET_STORY_PHOTOS[0],
      },
    };

    if (onAddStatusStory) {
      onAddStatusStory(newRing);
    }

    setShowAddModal(false);
    setStatusCaption('');
    setStatusPhotoUrl(null);
  };

  return (
    <div className="py-4 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5 overflow-x-auto scrollbar-none py-1.5 px-0.5">
          {/* User's own status bubble */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer text-left focus:outline-none"
            title={language === 'fr' ? 'Ajouter une photo ou un statut' : 'Add photo or status'}
          >
            <div className="relative w-14 h-14 min-w-[56px] min-h-[56px] shrink-0">
              <div className="w-full h-full rounded-full bg-zinc-50 border-2 border-dashed border-zinc-300 p-0.5 flex items-center justify-center text-xs font-mono font-bold text-zinc-800 group-hover:border-zinc-900 transition shadow-xs overflow-hidden">
                {currentUser.profilePhotoUrl ? (
                  <img src={currentUser.profilePhotoUrl} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span>{currentUser.avatar}</span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs">
                <Plus className="w-2.5 h-2.5" />
              </div>
            </div>
            <span className="text-[11px] font-mono font-medium text-zinc-500 group-hover:text-zinc-900 truncate max-w-[70px] text-center">
              {language === 'fr' ? '+ Statut' : '+ Status'}
            </span>
          </button>

          {/* Creators' status rings */}
          {statusRings.map((ring) => {
            const isBattle = ring.state === 'in_battle';
            const isLive = ring.state === 'live_stream';

            return (
              <button
                key={ring.id}
                onClick={() => handleOpenStory(ring)}
                className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer text-left focus:outline-none"
              >
                <div
                  className={`w-14 h-14 min-w-[56px] min-h-[56px] shrink-0 rounded-full p-[2px] transition group-hover:scale-105 shadow-xs ${
                    isBattle
                      ? 'border-2 border-red-500 ring-2 ring-red-200'
                      : isLive
                      ? 'border-2 border-zinc-950 ring-2 ring-zinc-300'
                      : 'border-2 border-zinc-300'
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center text-xs font-mono font-bold text-zinc-800 overflow-hidden">
                    {ring.storyMedia?.photoUrl ? (
                      <img src={ring.storyMedia.photoUrl} alt={ring.creatorName} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span>{ring.avatar}</span>
                    )}
                  </div>
                </div>

                <div className="text-center w-full max-w-[74px]">
                  <div className="text-[11px] font-semibold text-zinc-800 truncate group-hover:text-black">
                    {ring.creatorName.split(' ')[0]}
                  </div>
                  <div
                    className={`text-[9px] font-mono uppercase truncate ${
                      isBattle ? 'text-red-600 font-bold' : 'text-zinc-500'
                    }`}
                  >
                    {isBattle ? (language === 'fr' ? 'Compète' : 'Battle') : ring.statusText.slice(0, 10)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Photo / Status Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative text-zinc-900 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <h3 className="text-sm font-bold font-display text-zinc-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-zinc-900" />
                <span>{language === 'fr' ? 'Ajouter une Photo sur le Statut' : 'Add Picture on Status Ring'}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishStatus} className="space-y-3 text-xs">
              {/* Image Preview or Selector */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1 font-semibold">
                  {language === 'fr' ? 'Photo du Statut' : 'Story Picture'}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {statusPhotoUrl ? (
                  <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-black border border-zinc-200">
                    <img src={statusPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setStatusPhotoUrl(null)}
                      className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black text-white rounded-lg cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 border-2 border-dashed border-zinc-300 rounded-xl hover:border-zinc-900 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-zinc-600 hover:text-zinc-900 bg-zinc-50"
                    >
                      <ImageIcon className="w-5 h-5 text-zinc-500" />
                      <span className="font-semibold text-[11px]">
                        {language === 'fr' ? 'Choisir une photo de l’appareil' : 'Upload photo from device'}
                      </span>
                    </button>

                    {/* Quick Presets */}
                    <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                      <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                        {language === 'fr' ? 'Exemples :' : 'Presets:'}
                      </span>
                      {PRESET_STORY_PHOTOS.map((p, idx) => (
                        <img
                          key={idx}
                          src={p}
                          alt="Preset"
                          onClick={() => setStatusPhotoUrl(p)}
                          className="w-9 h-9 rounded-lg object-cover border border-zinc-200 hover:border-zinc-900 cursor-pointer transition shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Caption */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1 font-semibold">
                  {language === 'fr' ? 'Légende / Message' : 'Caption / Status Message'}
                </label>
                <input
                  type="text"
                  required
                  value={statusCaption}
                  onChange={(e) => {
                    setStatusCaption(e.target.value);
                    if (moderationError) setModerationError(null);
                  }}
                  placeholder={language === 'fr' ? 'Ex : En échauffement pour la scène live ce soir...' : 'e.g. Warming up footwork for live stage tonight...'}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 text-xs"
                />
              </div>

              {moderationError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-medium">
                  {moderationError}
                </div>
              )}

              {/* Status State */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1 font-semibold">
                  {language === 'fr' ? 'État' : 'Activity State'}
                </label>
                <select
                  value={statusState}
                  onChange={(e) => setStatusState(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 outline-none text-xs"
                >
                  <option value="open_duel">{language === 'fr' ? 'Défi Ouvert (Prêt)' : 'Open Duel (Ready)'}</option>
                  <option value="in_battle">{language === 'fr' ? 'En Compétition' : 'In Live Battle'}</option>
                  <option value="rehearsing">{language === 'fr' ? 'En Répétition' : 'Rehearsing'}</option>
                  <option value="live_stream">{language === 'fr' ? 'En Direct' : 'Live Streaming'}</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-zinc-300 rounded-xl text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                >
                  {language === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white font-bold rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'fr' ? 'Publier au Statut' : 'Post to Status'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Story / Status Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative overflow-hidden text-zinc-900">
            {/* Top progress bar */}
            <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-zinc-900 w-3/4 animate-pulse" />
            </div>

            {/* Creator Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-mono font-bold text-zinc-800 overflow-hidden">
                  {selectedStory.storyMedia?.photoUrl ? (
                    <img src={selectedStory.storyMedia.photoUrl} alt={selectedStory.creatorName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{selectedStory.avatar}</span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">{selectedStory.creatorName}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {selectedStory.creatorHandle} · {selectedStory.storyMedia.timestamp}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStory(null)}
                className="text-zinc-400 hover:text-zinc-900 p-1 rounded-md hover:bg-zinc-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Story Card Surface with Picture */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-center space-y-3">
              {/* Picture on Status Ring */}
              {selectedStory.storyMedia.photoUrl && (
                <div className="relative rounded-xl overflow-hidden aspect-4/3 max-h-56 bg-zinc-100 border border-zinc-200 shadow-xs">
                  <img
                    src={selectedStory.storyMedia.photoUrl}
                    alt={selectedStory.creatorName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-950/75 text-white font-semibold backdrop-blur-xs">
                    {selectedStory.state.replace('_', ' ')}
                  </div>
                </div>
              )}

              <p className="text-xs text-zinc-800 italic leading-relaxed font-medium">
                "{selectedStory.storyMedia.caption}"
              </p>

              <div className="pt-1 flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    sounds.playCheer();
                    onChallengeCreator(selectedStory.creatorName);
                    setSelectedStory(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer"
                >
                  {language === 'fr' ? 'Défier en Compétition' : 'Challenge to Battle'}
                </button>
                <button
                  onClick={() => {
                    sounds.playVineBoom();
                    if (onSendDM) onSendDM(selectedStory.creatorName);
                    setSelectedStory(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-800 hover:bg-zinc-100 text-xs font-semibold transition cursor-pointer"
                >
                  {language === 'fr' ? 'Message Privé' : 'Send DM'}
                </button>
              </div>
            </div>

            {/* Quick reply bar */}
            <form onSubmit={handleSendReply} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={language === 'fr' ? 'Répondre au statut...' : 'Reply to story status...'}
                className="flex-1 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 text-zinc-900 rounded-lg px-3 py-2 text-xs outline-none transition"
              />
              <button
                type="submit"
                disabled={replied}
                className="px-3 py-2 bg-zinc-900 hover:bg-black text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
              >
                {replied ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
