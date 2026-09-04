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
      className="absolute bottom-16 left-1/2 -translate-x-1/2 z-35 w-[94%] max-w-[470px] pointer-events-auto"
    >
      <div 
        onClick={onOpenTimer}
        className="cursor-pointer bg-white dark:bg-[#1D1B18] text-[#1D1B18] dark:text-[#F8F7F4] border border-[#1D1B18] dark:border-[#F8F7F4] p-2 sm:p-2.5 flex items-center justify-between gap-2 transition-all group"
      >
        {/* Left: Pulsing Icon & Subject Info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="relative w-8 h-8 bg-[#F8F7F4] dark:bg-[#252320] border border-[#1D1B18] dark:border-[#F8F7F4] flex items-center justify-center shrink-0">
            <Timer size={16} className="text-[#E63946]" />
            {activeTimer.isRunning && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E63946] animate-ping opacity-75" />
            )}
            <span className={`absolute -top-1 -right-1 w-1.5 h-1.5 ${
              activeTimer.isRunning ? 'bg-[#2A9D8F]' : 'bg-[#E9C46A]'
            }`} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-xs text-[#1D1B18] dark:text-[#F8F7F4] truncate max-w-[120px] sm:max-w-[160px] uppercase">
                {activeTimer.subject || 'Focus Session'}
              </span>
              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4]">
                {activeTimer.type}
              </span>
            </div>
            <p className="text-[9px] text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 flex items-center gap-1 mt-0.5 font-mono uppercase">
              <span>{activeTimer.isRunning ? 'Focusing' : 'Paused'}</span>
              <span>•</span>
              <span className="text-[#E63946] group-hover:underline flex items-center gap-0.5 font-bold">
                Open <ChevronRight size={10} />
              </span>
            </p>
          </div>
        </div>

        {/* Center/Right: Live Timer Digits */}
        <div className="font-oswald font-bold text-base sm:text-lg tracking-tight text-[#1D1B18] dark:text-[#F8F7F4] px-1.5 tabular-nums">
          {formattedTime}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Pause / Resume */}
          <button
            type="button"
            onClick={onTogglePlayPause}
            title={activeTimer.isRunning ? 'Pause Timer' : 'Resume Timer'}
            className="w-7 h-7 bg-[#1D1B18] text-[#F8F7F4] dark:bg-[#F8F7F4] dark:text-[#1D1B18] border border-[#1D1B18] dark:border-[#F8F7F4] flex items-center justify-center transition cursor-pointer"
          >
            {activeTimer.isRunning ? <Pause size={12} /> : <Play size={12} className="ml-0.5 fill-current" />}
          </button>

          {/* Quick Save / Finish */}
          {elapsedSeconds >= 10 && (
            <button
              type="button"
              onClick={onFinishSession}
              title="Finish & Save Session"
              className="w-7 h-7 bg-[#2A9D8F] text-white border border-[#1D1B18] dark:border-[#F8F7F4] flex items-center justify-center transition font-bold cursor-pointer"
            >
              <Check size={12} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
