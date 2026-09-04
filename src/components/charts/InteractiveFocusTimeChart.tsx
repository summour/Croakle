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
    focus: { label: 'Focus', color: '#007AFF', bg: 'bg-[#007AFF]', darkBg: 'dark:bg-[#007AFF]' },
    study: { label: 'Study', color: '#FF9500', bg: 'bg-[#FF9500]', darkBg: 'dark:bg-[#FF9500]' },
    work: { label: 'Work', color: '#34C759', bg: 'bg-[#34C759]', darkBg: 'dark:bg-[#34C759]' },
    break: { label: 'Break', color: '#AF52DE', bg: 'bg-[#AF52DE]', darkBg: 'dark:bg-[#AF52DE]' },
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
          <span className="font-semibold text-zinc-950 dark:text-white flex items-center gap-1.5">
            <Clock size={13} className="text-[#007AFF]" />
            <span>Total: {Math.floor(totalRangeMinutes / 60)}h {totalRangeMinutes % 60}m</span>
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
            Past {daysRange} Days
          </span>
        </div>

        {/* Multi-segmented bar */}
        <div className="w-full h-3 rounded-full overflow-hidden bg-[#E5E2DC] dark:bg-[#1D1B18] border-[1.5px] border-[#1F1B1A] flex">
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
              <div key={type} className="flex items-center gap-1 font-bold text-[#1F1B1A]/80 dark:text-[#F8F7F4]/80">
                <span className={`w-2 h-2 rounded-full border border-[#1F1B1A] ${cfg.bg} ${cfg.darkBg}`} />
                <span>{cfg.label}:</span>
                <strong className="text-[#1F1B1A] dark:text-[#F8F7F4]">{mins}m</strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Interactive Stacked Bar Chart */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#252320] border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] shadow-[3px_3px_0px_#1F1B1A]">
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
                className={`flex flex-col items-center gap-1.5 p-1 sm:p-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FEF08A] text-[#1F1B1A] border-[1.5px] border-[#1F1B1A] shadow-[1.5px_1.5px_0px_#1F1B1A]'
                    : 'hover:bg-zinc-100 dark:hover:bg-[#1D1B18]'
                }`}
              >
                {/* Stacked Bar Container */}
                <div className="w-full bg-[#E5E2DC] dark:bg-[#1D1B18] h-24 sm:h-28 rounded-xl flex flex-col justify-end p-1 overflow-hidden border-[1.5px] border-[#1F1B1A]">
                  {st.breakMins > 0 && (
                    <div className="w-full bg-[#AF52DE] rounded-md" style={{ height: `${breakH}%` }} />
                  )}
                  {st.workMins > 0 && (
                    <div className="w-full bg-[#22C55E] rounded-md" style={{ height: `${workH}%` }} />
                  )}
                  {st.studyMins > 0 && (
                    <div className="w-full bg-[#FEF08A] rounded-md" style={{ height: `${studyH}%` }} />
                  )}
                  {st.focusMins > 0 && (
                    <div className="w-full bg-[#E02921] rounded-md" style={{ height: `${focusH}%` }} />
                  )}
                  {st.totalMins === 0 && (
                    <div className="w-full h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                  )}
                </div>

                <span className={`text-xs font-bold ${
                  isSelected ? 'text-[#1F1B1A]' : 'text-[#1F1B1A] dark:text-[#F8F7F4]'
                }`}>
                  {st.dayName}
                </span>
                <span className="text-[11px] font-bold text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70">
                  {st.dayNum}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector Card */}
      {activeStats && (
        <div className="rounded-2xl bg-white dark:bg-[#252320] border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] shadow-[3px_3px_0px_#1F1B1A] p-3.5 flex items-center justify-between animate-in fade-in duration-150">
          <div>
            <strong className="text-xs font-bold text-[#1F1B1A] dark:text-[#F8F7F4] block leading-tight">
              {activeStats.dayName}, Day {activeStats.dayNum} ({activeStats.iso})
            </strong>
            <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60">
              {activeStats.daySessions.length} session{activeStats.daySessions.length !== 1 ? 's' : ''} logged
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-[#FEF08A] text-[#1F1B1A] text-[11px] font-bold border-[1.5px] border-[#1F1B1A] shadow-[1.5px_1.5px_0px_#1F1B1A]">
            {Math.floor(activeStats.totalMins / 60)}h {activeStats.totalMins % 60}m
          </div>
        </div>
      )}
    </div>
  );
};
