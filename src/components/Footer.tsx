import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#090d14] py-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-gradient-to-tr from-rose-500 to-amber-400 inline-block" />
          <span className="font-bold text-slate-300">NicheViral</span>
          <span className="text-slate-600">·</span>
          <span>The Viral Niche App Playbook & Lab</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <span>Obsessive Micro-Tribes</span>
          <span>·</span>
          <span>Shareable Artifacts</span>
          <span>·</span>
          <span>Status Mechanics</span>
        </div>

        <div className="text-slate-600">
          Built for founders and indie engineers seeking zero-CAC distribution.
        </div>
      </div>
    </footer>
  );
};
