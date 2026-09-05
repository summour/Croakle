import React from 'react';
import { ActiveTimerState } from '../types';
import { Play, Pause, ChevronRight, Timer, Check } from 'lucide-react';

interface LiveTimerBarProps {
  activeTimer: ActiveTimerState;
  elapsedSeconds: number;
  onTogglePlayPause: () => void;
  onFinishSession: () => void;
  onOpenTimer: () => void;
}

export const LiveTimerBar: React.FC<LiveTimerBarProps> = ({
  activeTimer,
  elapsedSeconds,
  onTogglePlayPause,
  onFinishSession,
  onOpenTimer,
}) => {
  if (!activeTimer.isRunning && elapsedSeconds === 0) return null;

  const hours = Math.floor(elapsedSeconds / 3600);
  const mins = Math.floor((elapsedSeconds % 3600) / 60);
  const secs = elapsedSeconds % 60;

  const formattedTime = hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const typeColorMap = {
    focus: 'bg-blue-500/10 text-[#007AFF] border-blue-500/20',
    study: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    work: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    break: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  };

  return (
    <div
      id="croakle-live-timer-activity"
      style={{
        bottom: 'calc(3.75rem + max(1.25rem, calc(0.85rem + env(safe-area-inset-bottom, 0px))))',
      }}
      className="absolute left-1/2 -translate-x-1/2 z-35 w-[92%] max-w-[460px] pointer-events-auto animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div 
        onClick={onOpenTimer}
        className="cursor-pointer bg-[#FFFEF7] dark:bg-[#1D1B18] text-[#1F1B1A] dark:text-[#F8F7F4] border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-2xl shadow-[4px_4px_0px_#1F1B1A] dark:shadow-[4px_4px_0px_#000000] p-2 sm:p-2.5 flex items-center justify-between gap-2 transition-all group hover:-translate-y-0.5"
      >
        {/* Left: Pulsing Icon & Subject Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative w-8 h-8 rounded-xl bg-[#FEF08A] border-[2px] border-[#1F1B1A] flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#1F1B1A]">
            <Timer size={16} className="text-[#E02921]" />
            {activeTimer.isRunning && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E02921] animate-ping opacity-75" />
            )}
            <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-[#1F1B1A] ${
              activeTimer.isRunning ? 'bg-[#22C55E]' : 'bg-[#EAB308]'
            }`} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-xs text-[#1F1B1A] dark:text-[#F8F7F4] truncate max-w-[120px] sm:max-w-[160px] uppercase">
                {activeTimer.subject || 'Focus Session'}
              </span>
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border-[1.5px] border-[#1F1B1A] bg-[#BAE6FD] text-[#005BAF]">
                {activeTimer.type}
              </span>
            </div>
            <p className="text-[9px] text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 flex items-center gap-1 mt-0.5 font-mono uppercase font-bold">
              <span>{activeTimer.isRunning ? 'Focusing' : 'Paused'}</span>
              <span>•</span>
              <span className="text-[#E02921] group-hover:underline flex items-center gap-0.5">
                Open <ChevronRight size={10} />
              </span>
            </p>
          </div>
        </div>

        {/* Center/Right: Live Timer Digits */}
        <div className="font-oswald font-bold text-base sm:text-lg tracking-tight text-[#1F1B1A] dark:text-[#F8F7F4] px-1.5 tabular-nums">
          {formattedTime}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Pause / Resume */}
          <button
            type="button"
            onClick={onTogglePlayPause}
            title={activeTimer.isRunning ? 'Pause Timer' : 'Resume Timer'}
            className="w-7 h-7 rounded-xl bg-[#E02921] text-white border-[1.5px] border-[#1F1B1A] shadow-[1.5px_1.5px_0px_#1F1B1A] flex items-center justify-center transition cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            {activeTimer.isRunning ? <Pause size={12} /> : <Play size={12} className="ml-0.5 fill-current" />}
          </button>

          {/* Quick Save / Finish */}
          {elapsedSeconds >= 10 && (
            <button
              type="button"
              onClick={onFinishSession}
              title="Finish & Save Session"
              className="w-7 h-7 rounded-xl bg-[#22C55E] text-[#1F1B1A] border-[1.5px] border-[#1F1B1A] shadow-[1.5px_1.5px_0px_#1F1B1A] flex items-center justify-center transition font-bold cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <Check size={12} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
