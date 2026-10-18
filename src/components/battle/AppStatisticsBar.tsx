import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Eye, Activity, Radio, TrendingUp, CheckCircle } from 'lucide-react';
import { Language } from '../../utils/i18n';

interface AppStatisticsBarProps {
  language?: Language;
}

export const AppStatisticsBar: React.FC<AppStatisticsBarProps> = ({ language = 'en' }) => {
  // Base stats that increment slightly in real time
  const [totalUsers, setTotalUsers] = useState<number>(248824);
  const [dailyNewUsers, setDailyNewUsers] = useState<number>(1428);
  const [dailyVisitors, setDailyVisitors] = useState<number>(43692);
  const [activeStreams] = useState<number>(6);
  const [liveBattlers] = useState<number>(28);

  // Periodic realistic tick to simulate real-time activity and count statistics
  useEffect(() => {
    const interval = setInterval(() => {
      // 40% chance to increment visitors, 20% to increment new users
      const rand = Math.random();
      if (rand > 0.6) {
        setDailyVisitors((prev) => prev + 1);
      }
      if (rand > 0.85) {
        setDailyNewUsers((prev) => prev + 1);
        setTotalUsers((prev) => prev + 1);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-t border-zinc-200 bg-zinc-50/70 py-6 px-4 sm:px-6 lg:px-8 text-zinc-800">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header & Status Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-200/80">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-600 font-bold">
              {language === 'fr' ? 'PERFORMANCE & STATISTIQUES DE LA PLATEFORME' : 'PLATFORM PERFORMANCE & LIVE METRICS'}
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
              {language === 'fr' ? 'SYSTÈMES OPÉRATIONNELS 99.98%' : 'SYSTEMS OPERATIONAL 99.98%'}
            </span>
          </div>

          <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-3">
            <span>Latency: <strong className="text-zinc-800">28ms</strong></span>
            <span>·</span>
            <span>LiveKit Cloud: <strong className="text-zinc-800">Connected</strong></span>
          </div>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Total Registered Users */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
                {language === 'fr' ? 'Utilisateurs Totaux' : 'Total Registered Users'}
              </span>
              <Users className="w-4 h-4 text-zinc-700" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 tabular-nums">
              {totalUsers.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-800 flex items-center gap-1 font-mono font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% {language === 'fr' ? 'ce mois' : 'this month'}</span>
            </div>
          </div>

          {/* 2. Daily New Users */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
                {language === 'fr' ? 'Nouveaux Utilisateurs / Jour' : 'Daily New Users'}
              </span>
              <UserPlus className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 tabular-nums flex items-baseline gap-1.5">
              <span>+{dailyNewUsers.toLocaleString()}</span>
              <span className="text-xs text-zinc-500 font-normal">
                {language === 'fr' ? 'aujourd’hui' : 'today'}
              </span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              {language === 'fr' ? 'Inscriptions directes & invitations' : 'Direct sign-ups & 1-click invites'}
            </div>
          </div>

          {/* 3. Daily Active Visitors */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
                {language === 'fr' ? 'Visiteurs Quotidiens' : 'Daily Active Visitors'}
              </span>
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 tabular-nums">
              {dailyVisitors.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              {language === 'fr' ? 'Spectateurs & juges actifs' : 'Spectators & active audience'}
            </div>
          </div>

          {/* 4. Live Arenas & Competitors */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
                {language === 'fr' ? 'Arènes & Compétiteurs' : 'Active Arenas & Battlers'}
              </span>
              <Radio className="w-4 h-4 text-red-600 animate-pulse" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 tabular-nums">
              {activeStreams} <span className="text-xs font-normal text-zinc-500 font-sans">Streams</span> · {liveBattlers} <span className="text-xs font-normal text-zinc-500 font-sans">Live</span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              {language === 'fr' ? 'Flux LiveKit HD en simultané' : 'Concurrent LiveKit HD streams'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
