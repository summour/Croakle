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
    <div className="space-y-3 select-none">
      {/* Clean Filters & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ios-tap whitespace-nowrap border ${
                filterMode === t.id
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Sort buttons */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-full border border-zinc-200/80 dark:border-zinc-700/80">
          <span className="text-[10px] font-medium text-zinc-400 pl-2 pr-1">Sort:</span>
          <button
            type="button"
            onClick={() => {
              setSortBy('rate');
              soundEngine.playTapSound();
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
              sortBy === 'rate' ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950' : 'text-zinc-500 dark:text-zinc-400'
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
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
              sortBy === 'checks' ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950' : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            Checks
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900 rounded-[22px] p-4 border border-zinc-200 dark:border-zinc-800">
            No projects match this filter.
          </div>
        ) : (
          filtered.map((stat, idx) => {
            return (
              <div
                key={stat.project.id}
                className="rounded-[22px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs space-y-2.5 p-3.5"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300 shrink-0">
                      {idx + 1}
                    </div>

                    <div className="min-w-0">
                      <strong className="text-xs font-bold text-zinc-950 dark:text-white truncate block">
                        {stat.project.name}
                      </strong>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                        Goal: {stat.project.goal}d/wk • {stat.monthChecks}/{stat.monthlyTarget} checks
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-24 sm:w-32 flex flex-col items-end gap-1 shrink-0">
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden border border-black/[0.03] dark:border-white/[0.04]">
                      <div
                        className="h-full rounded-full bg-zinc-900 dark:bg-white transition-all duration-300"
                        style={{ width: `${Math.min(100, stat.goalPercent)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-zinc-950 dark:text-white tabular-nums">
                      {stat.goalPercent}%
                    </span>
                  </div>
                </div>

                {/* Direct 31-day activity strip */}
                <div className="pt-1 space-y-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="text-zinc-400 dark:text-zinc-500">
                      Monthly Activity (Days 1–{daysInMonth}):
                    </span>
                    {stat.currentStreak > 0 && (
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {stat.currentStreak} day streak
                      </span>
                    )}
                  </div>

                  {/* Dot matrix */}
                  <div className="flex flex-wrap gap-1 p-2 rounded-[14px] bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80">
                    {Array.from({ length: daysInMonth }, (_, dayIdx) => {
                      const isDone = Boolean(stat.days[dayIdx]);
                      return (
                        <div
                          key={dayIdx}
                          className={`w-5 h-5 rounded-[6px] flex items-center justify-center text-[8.5px] font-bold transition-all ${
                            isDone
                              ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-2xs'
                              : 'bg-zinc-200/60 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                          }`}
                          title={`Day ${dayIdx + 1}: ${isDone ? 'Done' : 'Missed'}`}
                        >
                          {dayIdx + 1}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 pt-0.5">
                    <span>
                      Lifetime: <strong className="text-zinc-950 dark:text-white">{stat.lifetime}</strong>
                    </span>
                    <span>
                      Month rate: <strong className="text-zinc-950 dark:text-white">{stat.actualMonthRate}%</strong>
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
