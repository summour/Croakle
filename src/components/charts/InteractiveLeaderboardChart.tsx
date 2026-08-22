import React, { useState } from 'react';
import { HabitTemplate, MonthData } from '../../types';
import { soundEngine, triggerHaptic } from '../../utils/audioUtils';
import { Trophy, ChevronDown, ChevronUp } from 'lucide-react';

interface InteractiveLeaderboardChartProps {
  year: number;
  monthIndex: number;
  habits: HabitTemplate[];
  monthData: MonthData;
}

export const InteractiveLeaderboardChart: React.FC<InteractiveLeaderboardChartProps> = ({
  year,
  monthIndex,
  habits,
  monthData,
}) => {
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'top' | 'growing'>('all');
  const [sortBy, setSortBy] = useState<'rate' | 'checks'>('rate');

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const weeksInMonth = Math.ceil(daysInMonth / 7);

  // Process habit stats
  const habitStats = habits.map((habit, originalIndex) => {
    const monthHabit = monthData.habits[originalIndex];
    const days = monthHabit?.days || [];
    const monthChecks = days.reduce((acc, d) => acc + (d ? 1 : 0), 0);
    const monthlyTarget = Math.min(daysInMonth, habit.goal * weeksInMonth);
    const goalPercent = monthlyTarget > 0 ? Math.round((monthChecks / monthlyTarget) * 100) : 0;
    const actualMonthRate = daysInMonth > 0 ? Math.round((monthChecks / daysInMonth) * 100) : 0;
    const lifetime = (monthHabit?.lifetime || 0) + monthChecks;

    // Streak
    let currentStreak = 0;
    for (let d = days.length - 1; d >= 0; d--) {
      if (days[d]) {
        currentStreak++;
      } else if (currentStreak > 0) {
        break;
      }
    }

    return {
      habit,
      originalIndex,
      days,
      monthChecks,
      monthlyTarget,
      goalPercent,
      actualMonthRate,
      lifetime,
      currentStreak,
      isArchived: Boolean(habit.completed),
    };
  });

  const filtered = habitStats.filter((stat) => {
    if (stat.isArchived && stat.monthChecks === 0) return false;
    if (filterMode === 'top') return stat.goalPercent >= 80;
    if (filterMode === 'growing') return stat.goalPercent < 80;
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'rate') return b.goalPercent - a.goalPercent;
    return b.monthChecks - a.monthChecks;
  });

  const handleRowClick = (id: string) => {
    setSelectedHabitId(selectedHabitId === id ? null : id);
    soundEngine.playTapSound();
    triggerHaptic();
  };

  return (
    <div className="space-y-3 select-none">
      {/* Clean Filters & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {(
            [
              { id: 'all', label: 'All Habits' },
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
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ios-tap whitespace-nowrap border ${
                filterMode === t.id
                  ? 'bg-black/[0.06] dark:bg-white/[0.08] text-[#2d2823] dark:text-[#f4efe8] border-black/10 dark:border-white/12'
                  : 'bg-black/[0.02] dark:bg-white/[0.03] text-[#8c7e70] dark:text-[#a89b8d] border-transparent opacity-60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.05] p-0.5 rounded-full border border-black/[0.04] dark:border-white/[0.06]">
          <span className="text-[9.5px] font-medium text-[#8c7e70] pl-2 pr-1">Sort:</span>
          <button
            type="button"
            onClick={() => setSortBy('rate')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition ${
              sortBy === 'rate' ? 'bg-[#5f7a61] text-white' : 'text-[#8c7e70]'
            }`}
          >
            % Goal
          </button>
          <button
            type="button"
            onClick={() => setSortBy('checks')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition ${
              sortBy === 'checks' ? 'bg-[#5f7a61] text-white' : 'text-[#8c7e70]'
            }`}
          >
            Checks
          </button>
        </div>
      </div>

      {/* Habit List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#8c7e70] dark:text-[#a89b8d] bg-black/[0.02] dark:bg-white/[0.02] rounded-[18px] p-4">
            No habits match this filter.
          </div>
        ) : (
          filtered.map((stat, idx) => {
            const isSelected = selectedHabitId === stat.habit.id;
            const isRank1 = idx === 0 && stat.goalPercent > 0;

            return (
              <div
                key={stat.habit.id}
                className={`rounded-[18px] border transition-all duration-150 overflow-hidden ${
                  isSelected
                    ? 'bg-black/[0.03] dark:bg-white/[0.05] border-[#5f7a61]/30 shadow-2xs'
                    : 'bg-black/[0.015] dark:bg-white/[0.02] border-black/[0.04] dark:border-white/[0.05] hover:bg-black/[0.025]'
                }`}
              >
                {/* Main Row */}
                <div
                  onClick={() => handleRowClick(stat.habit.id)}
                  className="p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer ios-tap"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={`w-7 h-7 rounded-[10px] flex items-center justify-center font-bold text-xs shrink-0 ${
                      isRank1
                        ? 'bg-[#c28f3a] text-white'
                        : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#8c7e70]'
                    }`}>
                      {isRank1 ? <Trophy size={13} /> : idx + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs font-bold text-[#2d2823] dark:text-[#f4efe8] truncate">
                          {stat.habit.name}
                        </strong>
                      </div>
                      <span className="text-[10px] text-[#8c7e70] dark:text-[#a89b8d]">
                        Goal: {stat.habit.goal}d/wk • {stat.monthChecks}/{stat.monthlyTarget} checks
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="w-20 sm:w-28 flex flex-col items-end gap-1">
                      <div className="w-full bg-[#ede6dc]/70 dark:bg-[#2c2722] h-2 rounded-full overflow-hidden border border-black/[0.02] dark:border-white/[0.03]">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            stat.goalPercent >= 100
                              ? 'bg-[#c28f3a]'
                              : 'bg-[#5f7a61] dark:bg-[#7d9d80]'
                          }`}
                          style={{ width: `${Math.min(100, stat.goalPercent)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#2d2823] dark:text-[#f4efe8]">
                        {stat.goalPercent}%
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-0.5 text-[#8c7e70]"
                    >
                      {isSelected ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </div>
                </div>

                {/* Expanded 31-day activity strip */}
                {isSelected && (
                  <div className="px-3.5 pb-3.5 pt-1.5 space-y-2.5 border-t border-black/[0.03] dark:border-white/[0.04] bg-white/40 dark:bg-black/20 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[10.5px] pt-1">
                      <span className="text-[#8c7e70] dark:text-[#a89b8d]">
                        Monthly Activity (Days 1–{daysInMonth}):
                      </span>
                      {stat.currentStreak > 0 && (
                        <span className="font-semibold text-[#5f7a61] dark:text-[#8fc493]">
                          🔥 {stat.currentStreak} day streak
                        </span>
                      )}
                    </div>

                    {/* Dot matrix */}
                    <div className="flex flex-wrap gap-1 p-2 rounded-[14px] bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.02] dark:border-white/[0.03]">
                      {Array.from({ length: daysInMonth }, (_, dayIdx) => {
                        const isDone = Boolean(stat.days[dayIdx]);
                        return (
                          <div
                            key={dayIdx}
                            className={`w-5 h-5 rounded-[6px] flex items-center justify-center text-[8.5px] font-bold transition-all ${
                              isDone
                                ? 'bg-[#5f7a61] text-white shadow-2xs'
                                : 'bg-black/[0.04] dark:bg-white/[0.05] text-[#8c7e70] opacity-40'
                            }`}
                            title={`Day ${dayIdx + 1}: ${isDone ? 'Done' : 'Missed'}`}
                          >
                            {dayIdx + 1}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#8c7e70] dark:text-[#a89b8d]">
                      <span>Lifetime: <strong className="text-[#2d2823] dark:text-[#f4efe8]">{stat.lifetime}</strong></span>
                      <span>Month rate: <strong className="text-[#2d2823] dark:text-[#f4efe8]">{stat.actualMonthRate}%</strong></span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
