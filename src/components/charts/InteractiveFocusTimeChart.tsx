import React, { useState } from 'react';
import { TimeSession } from '../../types';
import { DAY_SHORT_NAMES, formatIsoDate } from '../../utils/dateUtils';
import { soundEngine, triggerHaptic } from '../../utils/audioUtils';
import { Clock } from 'lucide-react';

interface InteractiveFocusTimeChartProps {
  sessions: TimeSession[];
  selectedDate?: string;
  onSelectDate?: (isoDate: string) => void;
  daysRange?: number;
}

export const InteractiveFocusTimeChart: React.FC<InteractiveFocusTimeChartProps> = ({
  sessions,
  selectedDate,
  onSelectDate,
  daysRange = 7,
}) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const baseDate = selectedDate ? new Date(selectedDate) : new Date();
  const dateList: { date: Date; iso: string; dayName: string; dayNum: number }[] = [];

  for (let i = daysRange - 1; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const iso = formatIsoDate(d);
    const dayOfWeek = (d.getDay() + 6) % 7;
    dateList.push({
      date: d,
      iso,
      dayName: DAY_SHORT_NAMES[dayOfWeek],
      dayNum: d.getDate(),
    });
  }

  const categoryConfig: Record<string, { label: string; color: string; bg: string; darkBg: string }> = {
    focus: { label: 'Focus', color: '#5f7a61', bg: 'bg-[#5f7a61]', darkBg: 'dark:bg-[#7d9d80]' },
    study: { label: 'Study', color: '#d98236', bg: 'bg-[#d98236]', darkBg: 'dark:bg-[#e89b58]' },
    work: { label: 'Work', color: '#b86f52', bg: 'bg-[#b86f52]', darkBg: 'dark:bg-[#d68767]' },
    break: { label: 'Break', color: '#4a828a', bg: 'bg-[#4a828a]', darkBg: 'dark:bg-[#68a8b1]' },
  };

  const dayStats = dateList.map(({ iso, dayName, dayNum }) => {
    const daySessions = sessions.filter((s) => s.date === iso);
    const focusMins = daySessions.filter((s) => s.type === 'focus').reduce((a, b) => a + b.duration, 0);
    const studyMins = daySessions.filter((s) => s.type === 'study').reduce((a, b) => a + b.duration, 0);
    const workMins = daySessions.filter((s) => s.type === 'work').reduce((a, b) => a + b.duration, 0);
    const breakMins = daySessions.filter((s) => s.type === 'break').reduce((a, b) => a + b.duration, 0);
    const totalMins = focusMins + studyMins + workMins + breakMins;

    return {
      iso,
      dayName,
      dayNum,
      daySessions,
      focusMins,
      studyMins,
      workMins,
      breakMins,
      totalMins,
    };
  });

  const maxDailyMinutes = Math.max(60, ...dayStats.map((d) => d.totalMins));
  const totalRangeMinutes = dayStats.reduce((acc, d) => acc + d.totalMins, 0);

  const categoryTotals: Record<string, number> = {
    focus: dayStats.reduce((acc, d) => acc + d.focusMins, 0),
    study: dayStats.reduce((acc, d) => acc + d.studyMins, 0),
    work: dayStats.reduce((acc, d) => acc + d.workMins, 0),
    break: dayStats.reduce((acc, d) => acc + d.breakMins, 0),
  };

  const activeDate = hoveredDate || selectedDate || (dayStats[dayStats.length - 1]?.iso);
  const activeStats = dayStats.find((d) => d.iso === activeDate);

  const handleBarTap = (iso: string) => {
    setHoveredDate(iso);
    soundEngine.playTapSound();
    triggerHaptic();
    onSelectDate?.(iso);
  };

  return (
    <div className="space-y-3 select-none">
      {/* Category Overview Progress Bar & Legend */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#2d2823] dark:text-[#f4efe8] flex items-center gap-1.5">
            <Clock size={13} className="text-[#5f7a61]" />
            <span>Total: {Math.floor(totalRangeMinutes / 60)}h {totalRangeMinutes % 60}m</span>
          </span>
          <span className="text-[10px] text-[#8c7e70] dark:text-[#a89b8d]">
            Past {daysRange} Days
          </span>
        </div>

        {/* Multi-segmented bar */}
        <div className="w-full h-2 rounded-full overflow-hidden bg-[#ede6dc]/70 dark:bg-[#2c2722] border border-black/[0.02] dark:border-white/[0.04] flex">
          {Object.entries(categoryTotals).map(([type, mins]) => {
            if (mins <= 0 || totalRangeMinutes <= 0) return null;
            const pct = Math.round((mins / totalRangeMinutes) * 100);
            const cfg = categoryConfig[type];
            return (
              <div
                key={type}
                className={`h-full ${cfg.bg} ${cfg.darkBg} transition-all duration-300`}
                style={{ width: `${pct}%` }}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 flex-wrap text-[10px] pt-0.5">
          {Object.entries(categoryConfig).map(([type, cfg]) => {
            const mins = categoryTotals[type] || 0;
            if (mins <= 0 && totalRangeMinutes > 0) return null;
            return (
              <div key={type} className="flex items-center gap-1 text-[#8c7e70] dark:text-[#a89b8d]">
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.bg} ${cfg.darkBg}`} />
                <span>{cfg.label}:</span>
                <strong className="text-[#2d2823] dark:text-[#f4efe8]">{mins}m</strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Interactive Stacked Bar Chart */}
      <div className="p-3 sm:p-3.5 rounded-[22px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {dayStats.map((st) => {
            const isSelected = activeDate === st.iso;
            const focusH = (st.focusMins / maxDailyMinutes) * 100;
            const studyH = (st.studyMins / maxDailyMinutes) * 100;
            const workH = (st.workMins / maxDailyMinutes) * 100;
            const breakH = (st.breakMins / maxDailyMinutes) * 100;

            return (
              <button
                key={st.iso}
                type="button"
                onClick={() => handleBarTap(st.iso)}
                className={`flex flex-col items-center gap-1.5 p-1 sm:p-1.5 rounded-[16px] transition-all duration-150 ios-tap ${
                  isSelected
                    ? 'bg-black/[0.05] dark:bg-white/[0.08]'
                    : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                }`}
              >
                {/* Stacked Bar Container */}
                <div className="w-full bg-[#ede6dc]/70 dark:bg-[#2c2722] h-24 sm:h-28 rounded-[12px] flex flex-col justify-end p-1 overflow-hidden border border-black/[0.02] dark:border-white/[0.03]">
                  {st.breakMins > 0 && (
                    <div className="w-full bg-[#4a828a] dark:bg-[#68a8b1] rounded-[6px]" style={{ height: `${breakH}%` }} />
                  )}
                  {st.workMins > 0 && (
                    <div className="w-full bg-[#b86f52] dark:bg-[#d68767] rounded-[6px]" style={{ height: `${workH}%` }} />
                  )}
                  {st.studyMins > 0 && (
                    <div className="w-full bg-[#d98236] dark:bg-[#e89b58] rounded-[6px]" style={{ height: `${studyH}%` }} />
                  )}
                  {st.focusMins > 0 && (
                    <div className="w-full bg-[#5f7a61] dark:bg-[#7d9d80] rounded-[8px]" style={{ height: `${focusH}%` }} />
                  )}
                  {st.totalMins === 0 && (
                    <div className="w-full h-1 bg-black/[0.06] dark:bg-white/[0.08] rounded-full" />
                  )}
                </div>

                <span className={`text-xs font-bold ${
                  isSelected ? 'text-[#5f7a61] dark:text-[#8fc493]' : 'text-[#2d2823] dark:text-[#f4efe8]'
                }`}>
                  {st.dayName}
                </span>
                <span className="text-[11px] font-medium text-[#8c7e70] dark:text-[#a89b8d]">
                  {st.dayNum}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector Card */}
      {activeStats && (
        <div className="rounded-[20px] bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] p-3.5 flex items-center justify-between animate-in fade-in duration-150">
          <div>
            <strong className="text-xs font-bold text-[#2d2823] dark:text-[#f4efe8] block leading-tight">
              {activeStats.dayName}, Day {activeStats.dayNum} ({activeStats.iso})
            </strong>
            <span className="text-[10px] text-[#8c7e70] dark:text-[#a89b8d]">
              {activeStats.daySessions.length} session{activeStats.daySessions.length !== 1 ? 's' : ''} logged
            </span>
          </div>

          <div className="px-2 py-0.5 rounded-full bg-[#5f7a61]/10 text-[#5f7a61] dark:text-[#8fc493] text-[11px] font-bold border border-[#5f7a61]/20">
            {Math.floor(activeStats.totalMins / 60)}h {activeStats.totalMins % 60}m
          </div>
        </div>
      )}
    </div>
  );
};
