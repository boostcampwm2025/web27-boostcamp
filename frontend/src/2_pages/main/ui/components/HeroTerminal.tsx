import { useEffect, useState } from 'react';

const LOGS = [
  { text: 'connecting to boostad_network...', color: 'text-gray-400' },
  { text: 'analyzing_context...', color: 'text-blue-400' },
  { text: '> keywords: [React, Vite, Performance]', color: 'text-gray-300' },
  { text: 'measuring_user_intent...', color: 'text-purple-400' },
  { text: '> scroll_depth: 85% (High)', color: 'text-gray-300' },
  { text: '> dwell_time: 142s', color: 'text-gray-300' },
  { text: 'calculating_bid_score...', color: 'text-yellow-400' },
  { text: 'match_found: campaign_id_8291', color: 'text-emerald-400' },
  { text: 'rendering_ad_slot...', color: 'text-gray-400' },
] as const;

export function HeroTerminal() {
  const [lines, setLines] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prev) => (prev < LOGS.length ? prev + 1 : 0));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto mt-16 w-full max-w-2xl rounded-xl bg-[#1E1E1E] shadow-2xl ring-1 ring-white/10 sm:mt-24">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="flex-1 text-center text-xs font-medium text-gray-500 font-mono">
          boostad-engine — zsh — 80x24
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-6 font-mono text-xs sm:text-sm">
        <div className="flex flex-col gap-2">
          {LOGS.slice(0, lines + 1).map((log, index) => (
            <div key={index} className="flex gap-2">
              <span className="shrink-0 text-gray-600">➜</span>
              <span className={`${log.color}`}>{log.text}</span>
            </div>
          ))}
          <div className="flex gap-2 animate-pulse">
            <span className="shrink-0 text-gray-600">➜</span>
            <span className="h-5 w-2.5 bg-gray-500" />
          </div>
        </div>
      </div>

      {/* Glossy Reflection Effect */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 bg-[linear-gradient(rgba(255,255,255,0.03),transparent)]" />
    </div>
  );
}
