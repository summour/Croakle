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
      className="absolute bottom-22 left-1/2 -translate-x-1/2 z-35 w-[92%] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
    >
      <div 
        onClick={onOpenTimer}
        className="cursor-pointer bg-white/85 dark:bg-zinc-900/90 text-zinc-900 dark:text-white backdrop-blur-2xl border border-white/80 dark:border-white/15 rounded-[28px] p-2.5 sm:p-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_48px_rgba(0,0,0,0.7)] flex items-center justify-between gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] ios-tap group"
      >
        {/* Left: Pulsing Icon & Subject Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative w-9 h-9 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/15 flex items-center justify-center shrink-0 shadow-2xs">
            <Timer size={18} className="text-[#007AFF] dark:text-[#0A84FF]" />
            {activeTimer.isRunning && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-zinc-900 animate-ping opacity-75" />
            )}
            <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
              activeTimer.isRunning ? 'bg-emerald-500' : 'bg-amber-400'
            }`} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-zinc-900 dark:text-white truncate max-w-[120px] sm:max-w-[160px]">
                {activeTimer.subject || 'Focus Session'}
              </span>
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-md border ${typeColorMap[activeTimer.type] || typeColorMap.focus}`}>
                {activeTimer.type}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
              <span>{activeTimer.isRunning ? 'Focusing' : 'Paused'}</span>
              {activeTimer.initialStartedAt && (
                <>
                  <span>•</span>
                  <span>Started {new Date(activeTimer.initialStartedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </>
              )}
              <span>•</span>
              <span className="text-[#007AFF] dark:text-[#0A84FF] group-hover:underline flex items-center gap-0.5 font-medium">
                Open <ChevronRight size={10} />
              </span>
            </p>
          </div>
        </div>

        {/* Center/Right: Live Timer Digits */}
        <div className="font-mono font-bold text-lg tracking-tight text-zinc-900 dark:text-white px-2 tabular-nums">
          {formattedTime}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Pause / Resume */}
          <button
            type="button"
            onClick={onTogglePlayPause}
            title={activeTimer.isRunning ? 'Pause Timer' : 'Resume Timer'}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center transition ios-tap"
          >
            {activeTimer.isRunning ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>

          {/* Quick Save / Finish */}
          {elapsedSeconds >= 10 && (
            <button
              type="button"
              onClick={onFinishSession}
              title="Finish & Save Session"
              className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xs transition ios-tap"
            >
              <Check size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
