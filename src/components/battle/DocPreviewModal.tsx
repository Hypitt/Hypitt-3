import React from 'react';
import { X, Download, FileText, Music, Check, Share2, ShieldCheck } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface DocPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    name: string;
    size: string;
    type: 'doc' | 'audio' | 'image' | 'video';
    description?: string;
  } | null;
}

export const DocPreviewModal: React.FC<DocPreviewModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  const [downloadNotice, setDownloadNotice] = React.useState<string | null>(null);

  if (!isOpen || !document) return null;

  const isAudio = document.type === 'audio' || document.name.endsWith('.wav') || document.name.endsWith('.mp3');

  const handleDownload = () => {
    sounds.playCheer();
    setDownloadNotice(`Downloaded "${document.name}" (${document.size}). File saved.`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative text-zinc-900 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Download toast notification */}
        {downloadNotice && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 bg-zinc-950 text-white text-xs font-mono rounded-lg shadow-lg flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
              {isAudio ? <Music className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                {isAudio ? 'AUDIO STEMS VAULT' : 'LEGAL & BATTLE DOCUMENT'}
              </div>
              <h3 className="text-sm font-bold text-zinc-900 truncate max-w-[260px] font-mono">
                {document.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Viewer */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans flex-1">
          {/* Metadata Card */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 font-mono text-[11px]">
            <div>
              <span className="text-zinc-500">File Size:</span>{' '}
              <strong className="text-zinc-900">{document.size}</strong>
            </div>
            <div>
              <span className="text-zinc-500">Format:</span>{' '}
              <strong className="text-zinc-900">
                {isAudio ? '24-bit 48kHz WAV Stems' : 'Adobe PDF Document (v1.7)'}
              </strong>
            </div>
            <div className="col-span-2">
              <span className="text-zinc-500">Verification:</span>{' '}
              <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically Signed Hypitt Contract
              </span>
            </div>
          </div>

          {/* Document Simulated Page View */}
          <div className="border border-zinc-200 rounded-xl p-5 bg-white shadow-inner space-y-3 font-serif text-zinc-800 leading-relaxed text-[13px]">
            <div className="border-b border-zinc-100 pb-2 flex items-center justify-between font-sans">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                HYPITT NETWORK OFFICIAL RECORD
              </span>
              <span className="text-[10px] font-mono text-zinc-400">PAGE 1 OF 1</span>
            </div>

            <h4 className="font-bold text-base text-zinc-950 font-display">
              {document.name.replace(/_/g, ' ').replace('.pdf', '').replace('.wav', '').replace('.txt', '')}
            </h4>

            {document.description && (
              <p className="text-xs text-zinc-600 italic font-sans bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                Summary: {document.description}
              </p>
            )}

            <p className="text-xs text-zinc-700">
              1. <strong>Terms of Engagement:</strong> Contenders entering this battle agreement abide by standard Hypitt rules. Time limits are enforced strictly (60 seconds per round, 30 seconds rebuttal).
            </p>

            <p className="text-xs text-zinc-700">
              2. <strong>Scoring & Resolution:</strong> Scoring is weighted evenly at 50% from verified judges panel and 50% from active audience votes. In the event of an audio battle, leading contender unlocks camera feed upon vote threshold.
            </p>

            <p className="text-xs text-zinc-700">
              3. <strong>Stakes & Bounty Payouts:</strong> Virtual coin prizes and cash pool pots are disbursed automatically to the winner's creator wallet upon final round bell.
            </p>

            {isAudio && (
              <div className="p-3 bg-zinc-900 text-white rounded-xl font-mono text-xs space-y-2 mt-3">
                <div className="flex justify-between items-center text-[10px] text-zinc-400">
                  <span>Track 1: Drums 140 BPM</span>
                  <span>03:24</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-amber-400" />
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-400">
                  <span>Track 2: Lead Vocal Stems</span>
                  <span>03:24</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-emerald-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-500">
            Encrypted document in chat vault
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
