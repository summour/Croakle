import React from 'react';
import { ActiveTimerState } from '../types';
import { Play, Pause, ChevronRight } from 'lucide-react';
import { PocketTimerDockIcon, PixelCheckIcon } from './FrogIcons';

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
    focus: 'bg-[#5f7a61] text-[#e8f2e9] border-[#7d9d80]/40',
    study: 'bg-[#4f6d85] text-[#e4f0f8] border-[#6b8da8]/40',
    work: 'bg-[#b86f52] text-[#fbeee8] border-[#d68767]/40',
    break: 'bg-[#8a7258] text-[#f7f2ea] border-[#ab9174]/40',
  };

  return (
    <div
      id="croakle-live-timer-activity"
      className="absolute bottom-22 left-1/2 -translate-x-1/2 z-35 w-[92%] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
    >
      <div 
        onClick={onOpenTimer}
        className="cursor-pointer bg-[#221c17]/92 dark:bg-[#120f0d]/94 text-[#f6f1eb] backdrop-blur-2xl border border-white/25 dark:border-white/12 rounded-[28px] p-2.5 sm:p-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.25)] flex items-center justify-between gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] ios-tap group"
      >
        {/* Left: Pulsing Icon & Subject Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative w-9 h-9 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/15 flex items-center justify-center shrink-0 shadow-2xs">
            <PocketTimerDockIcon size={18} className="text-[#8fc493]" />
            {activeTimer.isRunning && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#221c17] dark:border-[#120f0d] animate-ping opacity-75" />
            )}
            <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#221c17] dark:border-[#120f0d] ${
              activeTimer.isRunning ? 'bg-emerald-400' : 'bg-amber-400'
            }`} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs text-white truncate max-w-[120px] sm:max-w-[160px]">
                {activeTimer.subject || 'Focus Session'}
              </span>
              <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md border ${typeColorMap[activeTimer.type] || typeColorMap.focus}`}>
                {activeTimer.type}
              </span>
            </div>
            <p className="text-[10px] text-[#a89b8d] flex items-center gap-1 mt-0.5">
              <span>{activeTimer.isRunning ? 'Active session' : 'Paused'}</span>
              <span>•</span>
              <span className="text-[#d6c7b8] group-hover:underline flex items-center gap-0.5">
                Open Focus <ChevronRight size={10} />
              </span>
            </p>
          </div>
        </div>

        {/* Center/Right: Live Timer Digits */}
        <div className="font-mono font-black text-lg tracking-tight text-[#fbf8f5] px-2 tabular-nums">
          {formattedTime}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Pause / Resume */}
          <button
            type="button"
            onClick={onTogglePlayPause}
            title={activeTimer.isRunning ? 'Pause Timer' : 'Resume Timer'}
            className="w-8 h-8 rounded-full bg-white/12 hover:bg-white/20 text-white flex items-center justify-center transition ios-tap"
          >
            {activeTimer.isRunning ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>

          {/* Quick Save / Finish */}
          {elapsedSeconds >= 10 && (
            <button
              type="button"
              onClick={onFinishSession}
              title="Finish & Save Session"
              className="w-8 h-8 rounded-full bg-[#5f7a61] hover:bg-[#4f6751] text-white flex items-center justify-center shadow-xs transition ios-tap"
            >
              <PixelCheckIcon size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
