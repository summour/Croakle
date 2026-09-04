import React, { useState } from 'react';
import { Project } from '../../types';
import { getWeekKey } from '../../utils/dateUtils';
import { soundEngine, triggerHaptic } from '../../utils/audioUtils';

interface InteractiveProjectsProgressChartProps {
  year: number;
  monthIndex: number;
  projects: Project[];
}

export const InteractiveProjectsProgressChart: React.FC<InteractiveProjectsProgressChartProps> = ({
  year,
  monthIndex,
  projects,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'top' | 'growing'>('all');
  const [sortBy, setSortBy] = useState<'rate' | 'checks'>('rate');

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const weeksInMonth = Math.ceil(daysInMonth / 7);

  // Process project stats
  const projectStats = projects.map((project, originalIndex) => {
    // Generate daily activity for this month (1 to daysInMonth)
    const days: boolean[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, monthIndex, day);
      const dayOfWeek = dayDate.getDay(); // 0: Sun, 1: Mon...
      const dayIndex = (dayOfWeek + 6) % 7; // 0: Mon, 6: Sun
      const weekKey = getWeekKey(dayDate);
      const isChecked = Boolean(project.weeklyDays?.[weekKey]?.[dayIndex]);
      days.push(isChecked);
    }

    const monthChecks = days.reduce((acc, d) => acc + (d ? 1 : 0), 0);
    const monthlyTarget = Math.min(daysInMonth, (project.goal || 3) * weeksInMonth);
    const goalPercent = monthlyTarget > 0 ? Math.round((monthChecks / monthlyTarget) * 100) : 0;
    const actualMonthRate = daysInMonth > 0 ? Math.round((monthChecks / daysInMonth) * 100) : 0;

    // Lifetime across all tracked weeks
    const lifetime = Object.values(project.weeklyDays || {}).reduce(
      (acc, weekArr) => acc + (Array.isArray(weekArr) ? weekArr.filter(Boolean).length : 0),
      0
    );

    // Current streak
    let currentStreak = 0;
    for (let d = days.length - 1; d >= 0; d--) {
      if (days[d]) {
        currentStreak++;
      } else if (currentStreak > 0) {
        break;
      }
    }

    return {
      project,
      originalIndex,
      days,
      monthChecks,
      monthlyTarget,
      goalPercent,
      actualMonthRate,
      lifetime,
      currentStreak,
      isArchived: Boolean(project.completed),
    };
  });

  const filtered = projectStats.filter((stat) => {
    if (stat.isArchived && stat.monthChecks === 0) return false;
    if (filterMode === 'top') return stat.goalPercent >= 80;
    if (filterMode === 'growing') return stat.goalPercent < 80;
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'rate') return b.goalPercent - a.goalPercent;
    return b.monthChecks - a.monthChecks;
  });

  return (
    <div className="space-y-3 select-none font-mono">
      {/* Clean Filters & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
          {(
            [
              { id: 'all', label: 'All Projects' },
              { id: 'top', label: 'Top (≥80%)' },
              { id: 'growing', label: 'In Progress' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setFilterMode(t.id);
                soundEngine.playTapSound();
                triggerHaptic();
              }}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase transition cursor-pointer border whitespace-nowrap ${
                filterMode === t.id
                  ? 'bg-[#1D1B18] dark:bg-[#F8F7F4] text-[#F8F7F4] dark:text-[#1D1B18] border-[#1D1B18] dark:border-[#F8F7F4]'
                  : 'bg-white dark:bg-[#1D1B18] text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 border-[#1D1B18]/20 dark:border-[#F8F7F4]/20 hover:border-[#1D1B18] dark:hover:border-[#F8F7F4]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Sort buttons */}
        <div className="flex items-center gap-1 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 p-0.5 bg-white dark:bg-[#1D1B18]">
          <span className="text-[9px] font-bold text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 uppercase px-1.5">Sort:</span>
          <button
            type="button"
            onClick={() => {
              setSortBy('rate');
              soundEngine.playTapSound();
            }}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase transition cursor-pointer ${
              sortBy === 'rate' ? 'bg-[#1D1B18] dark:bg-[#F8F7F4] text-[#F8F7F4] dark:text-[#1D1B18]' : 'text-[#1D1B18]/60 dark:text-[#F8F7F4]/60'
            }`}
          >
            % Goal
          </button>
          <button
            type="button"
            onClick={() => {
              setSortBy('checks');
              soundEngine.playTapSound();
            }}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase transition cursor-pointer ${
              sortBy === 'checks' ? 'bg-[#1D1B18] dark:bg-[#F8F7F4] text-[#F8F7F4] dark:text-[#1D1B18]' : 'text-[#1D1B18]/60 dark:text-[#F8F7F4]/60'
            }`}
          >
            Checks
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#1D1B18]/50 dark:text-[#F8F7F4]/50 p-4 border border-[#1D1B18]/20 dark:border-[#F8F7F4]/20">
            No projects match this filter.
          </div>
        ) : (
          filtered.map((stat, idx) => {
            return (
              <div
                key={stat.project.id}
                className="border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] space-y-2 p-3"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-5 h-5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] flex items-center justify-center font-bold text-[10px] text-[#1D1B18] dark:text-[#F8F7F4] shrink-0">
                      {idx + 1}
                    </div>

                    <div className="min-w-0">
                      <strong className="text-xs font-bold font-oswald uppercase text-[#1D1B18] dark:text-[#F8F7F4] truncate block">
                        {stat.project.name}
                      </strong>
                      <span className="text-[9px] text-[#1D1B18]/50 dark:text-[#F8F7F4]/50 block truncate">
                        Goal: {stat.project.goal}d/wk • {stat.monthChecks}/{stat.monthlyTarget} checks
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-24 sm:w-28 flex flex-col items-end gap-1 shrink-0">
                    <div className="w-full bg-[#F8F7F4] dark:bg-[#252320] h-1.5 border border-[#1D1B18] dark:border-[#F8F7F4] overflow-hidden">
                      <div
                        className="h-full bg-[#1D1B18] dark:bg-[#F8F7F4] transition-all duration-300"
                        style={{ width: `${Math.min(100, stat.goalPercent)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#1D1B18] dark:text-[#F8F7F4] tabular-nums">
                      {stat.goalPercent}%
                    </span>
                  </div>
                </div>

                {/* Direct 31-day activity strip */}
                <div className="pt-1.5 space-y-1.5 border-t border-[#1D1B18]/15 dark:border-[#F8F7F4]/15">
                  <div className="flex items-center justify-between text-[9px] text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 uppercase">
                    <span>
                      Days 1–{daysInMonth}:
                    </span>
                    {stat.currentStreak > 0 && (
                      <span className="font-bold text-[#E63946]">
                        {stat.currentStreak} day streak
                      </span>
                    )}
                  </div>

                  {/* Dot matrix */}
                  <div className="flex flex-wrap gap-1 p-1.5 border border-[#1D1B18]/20 dark:border-[#F8F7F4]/20 bg-[#F8F7F4] dark:bg-[#252320]">
                    {Array.from({ length: daysInMonth }, (_, dayIdx) => {
                      const isDone = Boolean(stat.days[dayIdx]);
                      return (
                        <div
                          key={dayIdx}
                          className={`w-4 h-4 flex items-center justify-center text-[7.5px] font-bold border transition-all ${
                            isDone
                              ? 'bg-[#1D1B18] dark:bg-[#F8F7F4] text-[#F8F7F4] dark:text-[#1D1B18] border-[#1D1B18] dark:border-[#F8F7F4]'
                              : 'bg-white dark:bg-[#1D1B18] text-[#1D1B18]/40 dark:text-[#F8F7F4]/40 border-transparent'
                          }`}
                          title={`Day ${dayIdx + 1}: ${isDone ? 'Done' : 'Missed'}`}
                        >
                          {dayIdx + 1}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-[#1D1B18]/50 dark:text-[#F8F7F4]/50 pt-0.5">
                    <span>
                      Lifetime: <strong className="text-[#1D1B18] dark:text-[#F8F7F4]">{stat.lifetime}</strong>
                    </span>
                    <span>
                      Month rate: <strong className="text-[#1D1B18] dark:text-[#F8F7F4]">{stat.actualMonthRate}%</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
