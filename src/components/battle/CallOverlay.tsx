import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  FileText,
  Users,
  Check,
  Send,
  MessageSquare,
  Maximize2,
  Minimize2,
  Volume2,
  Sparkles,
  Download,
  X
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface CallOverlayProps {
  callType: 'audio' | 'video';
  targetName: string;
  isGroup: boolean;
  onEndCall: () => void;
  sharedDocs?: Array<{ name: string; size: string; type: 'doc' | 'audio' }>;
}

export const CallOverlay: React.FC<CallOverlayProps> = ({
  callType,
  targetName,
  isGroup,
  onEndCall,
  sharedDocs = [
    { name: 'Battle_Schedule_and_Rules.pdf', size: '1.2 MB', type: 'doc' },
    { name: 'Cypher_Beat_140BPM_Stems.wav', size: '18.4 MB', type: 'audio' },
  ],
}) => {
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected'>('connecting');
  
  // In-call document viewer
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [showDocPicker, setShowDocPicker] = useState(false);

  // In-call messaging drawer
  const [showInCallChat, setShowInCallChat] = useState(false);
  const [inCallComment, setInCallComment] = useState('');
  const [callNotice, setCallNotice] = useState<string | null>(null);
  const [inCallMessages, setInCallMessages] = useState<Array<{ id: string; user: string; text: string }>>([
    { id: '1', user: targetName.split(' ')[0], text: 'Audio and video stream locked in.' },
  ]);

  // Connect simulation
  useEffect(() => {
    sounds.playVineBoom();
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
      sounds.playCheer();
    }, 1800);

    return () => clearTimeout(connectTimer);
  }, []);

  // Duration timer
  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleMic = () => {
    setMicMuted(!micMuted);
    sounds.playBruh();
  };

  const toggleCam = () => {
    setCamOff(!camOff);
    sounds.playVineBoom();
  };

  const handleSendInCallMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inCallComment.trim()) return;
    sounds.playCheer();
    setInCallMessages([
      ...inCallMessages,
      { id: String(Date.now()), user: 'You', text: inCallComment.trim() },
    ]);
    setInCallComment('');
  };

  // Group participants simulation
  const groupParticipants = [
    { name: 'Alex Rivera (You)', avatar: 'AR', isSpeaking: !micMuted, micMuted, camOff },
    { name: 'Kai Skater', avatar: 'KS', isSpeaking: true, micMuted: false, camOff: false },
    { name: 'Malik Moves', avatar: 'MM', isSpeaking: false, micMuted: false, camOff: false },
    { name: 'Elena Roast', avatar: 'ER', isSpeaking: false, micMuted: true, camOff: false },
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-4xl w-full h-[90vh] max-h-[700px] flex flex-col justify-between shadow-2xl relative overflow-hidden text-white">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between z-20 bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-zinc-100 font-display">
                  {targetName}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase">
                  {isGroup ? 'Group Call' : 'Direct Call'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400">
                {callStatus === 'connecting' ? 'Ringing and establishing encrypted connection...' : `Connected · ${formatTime(callDuration)}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInCallChat(!showInCallChat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                showInCallChat
                  ? 'bg-zinc-100 text-zinc-950 border-white'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">In-Call Chat</span>
            </button>

            <button
              onClick={() => setShowDocPicker(!showDocPicker)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                activeDoc || showDocPicker
                  ? 'bg-amber-400 text-zinc-950 border-amber-300 font-bold'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{activeDoc ? 'Doc Open' : 'Share Doc'}</span>
            </button>
          </div>
        </div>

        {/* Call Center Area: Video Grid or Audio Room */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Stage Grid */}
          <div className="flex-1 p-4 flex flex-col justify-center items-center overflow-y-auto">
            {callStatus === 'connecting' ? (
              <div className="text-center space-y-4 py-12">
                <div className="w-24 h-24 mx-auto rounded-full bg-zinc-900 border-2 border-emerald-500 flex items-center justify-center text-2xl font-bold font-mono text-emerald-400 animate-pulse">
                  {targetName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-bold font-display">{targetName}</h4>
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    {callType === 'video' ? 'Outgoing Video Call...' : 'Outgoing Audio Call...'}
                  </p>
                </div>
              </div>
            ) : isGroup ? (
              /* Group Call: 4-Participant Grid */
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl">
                {groupParticipants.map((p, idx) => (
                  <div
                    key={idx}
                    className="h-40 sm:h-48 bg-zinc-900/90 rounded-2xl border border-zinc-800 flex flex-col items-center justify-between p-4 relative overflow-hidden shadow-lg"
                  >
                    <div className="w-full flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span className="truncate">{p.name}</span>
                      {p.isSpeaking && (
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Speaking
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold font-mono shadow-md ${
                        p.isSpeaking
                          ? 'bg-zinc-800 border-2 border-emerald-400 text-white shadow-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}>
                        {p.avatar}
                      </div>
                      {p.micMuted && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white">
                          <MicOff className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div className="w-full text-center">
                      <div className="text-[11px] text-zinc-400">
                        {callType === 'video' ? (p.camOff ? 'Camera Off' : 'HD Video Live') : 'Audio Live'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Direct 1-on-1 Call: 2 Split Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {/* Remote Peer */}
                <div className="h-52 sm:h-64 bg-zinc-900/90 rounded-2xl border border-zinc-800 flex flex-col items-center justify-between p-4 relative overflow-hidden shadow-lg">
                  <div className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="font-bold text-zinc-200">{targetName}</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Remote Mic
                    </span>
                  </div>

                  <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-2xl font-bold font-mono text-zinc-100 shadow-md">
                    {targetName.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="text-xs text-zinc-400 font-mono">
                    {callType === 'video' ? 'Camera Live (1080p 60fps)' : 'Crystal HD Audio Encrypted'}
                  </div>
                </div>

                {/* You */}
                <div className="h-52 sm:h-64 bg-zinc-900/90 rounded-2xl border border-zinc-800 flex flex-col items-center justify-between p-4 relative overflow-hidden shadow-lg">
                  <div className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="font-bold text-zinc-200">You (Alex Rivera)</span>
                    <span className={`text-[10px] font-mono ${micMuted ? 'text-red-400' : 'text-emerald-400'}`}>
                      {micMuted ? 'Muted' : 'Mic Active'}
                    </span>
                  </div>

                  <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-2xl font-bold font-mono text-zinc-100 shadow-md">
                    AR
                  </div>

                  <div className="text-xs text-zinc-400 font-mono">
                    {camOff ? 'Camera Muted' : 'Front Facing Camera'}
                  </div>
                </div>
              </div>
            )}

            {/* Active Shared Document Inside Call Banner */}
            {activeDoc && (
              <div className="w-full max-w-2xl mt-4 bg-zinc-900 border border-zinc-700 rounded-2xl p-4 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                      SHARED DOC IN CALL
                    </div>
                    <div className="text-xs font-bold font-mono text-zinc-100">{activeDoc}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sounds.playCheer();
                      setCallNotice(`Reviewing "${activeDoc}" with call members.`);
                      setTimeout(() => setCallNotice(null), 3000);
                    }}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setActiveDoc(null)}
                    className="p-1.5 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* In-call notice banner */}
            {callNotice && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 bg-zinc-950/90 text-white text-xs font-mono rounded-lg shadow-xl border border-zinc-700 animate-in fade-in flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{callNotice}</span>
              </div>
            )}
          </div>

          {/* In-Call Shared Docs Picker Drawer */}
          {showDocPicker && (
            <div className="w-72 bg-zinc-900 border-l border-zinc-800 p-4 flex flex-col justify-between z-30 animate-in slide-in-from-right duration-150">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase font-mono">
                    Share Doc Into Call
                  </h4>
                  <button onClick={() => setShowDocPicker(false)} className="text-zinc-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-zinc-400">
                  Select a document or stems file to review together live during the call:
                </p>

                <div className="space-y-2">
                  {sharedDocs.map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.playCheer();
                        setActiveDoc(doc.name);
                        setShowDocPicker(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 transition cursor-pointer text-xs"
                    >
                      <div className="font-bold text-zinc-100 truncate">{doc.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{doc.size} · Click to Share</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* In-Call Live Chat Drawer */}
          {showInCallChat && (
            <div className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col z-30 animate-in slide-in-from-right duration-150">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-200 uppercase font-mono">In-Call Messages</h4>
                <button onClick={() => setShowInCallChat(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                {inCallMessages.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                    <span className="font-bold text-zinc-300 font-mono text-[10px]">{m.user}: </span>
                    <span className="text-zinc-200">{m.text}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendInCallMessage} className="p-3 border-t border-zinc-800 flex gap-2">
                <input
                  type="text"
                  value={inCallComment}
                  onChange={(e) => setInCallComment(e.target.value)}
                  placeholder="Comment in call..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-zinc-100 text-zinc-950 rounded-lg font-bold text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Call Controls Footer */}
        <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-center gap-4 z-20">
          <button
            onClick={toggleMic}
            className={`p-3.5 rounded-full border transition cursor-pointer ${
              micMuted
                ? 'bg-red-950 text-red-400 border-red-800'
                : 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700'
            }`}
            title="Mute / Unmute Mic"
          >
            {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {callType === 'video' && (
            <button
              onClick={toggleCam}
              className={`p-3.5 rounded-full border transition cursor-pointer ${
                camOff
                  ? 'bg-red-950 text-red-400 border-red-800'
                  : 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700'
              }`}
              title="Camera On / Off"
            >
              {camOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={() => setShowDocPicker(!showDocPicker)}
            className="p-3.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 transition cursor-pointer"
            title="Share Document into Call"
          >
            <FileText className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              sounds.playDialUp();
              onEndCall();
            }}
            className="p-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50 transition cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
