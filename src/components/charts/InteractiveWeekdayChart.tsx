import React, { useState } from 'react';
import { HabitTemplate, MonthData } from '../../types';
import { DAY_SHORT_NAMES } from '../../utils/dateUtils';
import { soundEngine, triggerHaptic } from '../../utils/audioUtils';

interface InteractiveWeekdayChartProps {
  year: number;
  monthIndex: number;
  habits: HabitTemplate[];
  monthData: MonthData;
}

export const InteractiveWeekdayChart: React.FC<InteractiveWeekdayChartProps> = ({
  year,
  monthIndex,
  habits,
  monthData,
}) => {
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number | null>(() => {
    const now = new Date();
    if (now.getFullYear() === year && now.getMonth() === monthIndex) {
      return (now.getDay() + 6) % 7; // Mon=0, Sun=6
    }
    return 0;
  });

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Active / tracked habits
  const activeOrTrackedHabits = habits.filter((h, idx) => {
    const isArchived = Boolean(h.completed);
    const checks = monthData.habits[idx]?.days?.reduce((acc, d) => acc + (d ? 1 : 0), 0) || 0;
    return !isArchived || checks > 0;
  });

  // Calculate stats for all 7 weekdays
  const weekdayStats = [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
    const dayName = DAY_SHORT_NAMES[dayOfWeek];
    const fullNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const fullName = fullNames[dayOfWeek];

    const matchingDays: number[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, monthIndex, d);
      if ((date.getDay() + 6) % 7 === dayOfWeek) {
        matchingDays.push(d);
      }
    }

    const countOfThisWeekday = matchingDays.length;
    const possibleChecks = activeOrTrackedHabits.length * countOfThisWeekday;

    let actualChecks = 0;
    const habitBreakdowns = activeOrTrackedHabits.map((habit) => {
      const origIdx = habits.findIndex((h) => h.id === habit.id);
      let checksForHabit = 0;
      matchingDays.forEach((dayNum) => {
        if (monthData.habits[origIdx]?.days?.[dayNum - 1]) {
          checksForHabit++;
        }
      });
      const rate = countOfThisWeekday > 0 ? Math.round((checksForHabit / countOfThisWeekday) * 100) : 0;
      return {
        habit,
        checksForHabit,
        totalPossible: countOfThisWeekday,
        rate,
      };
    });

    actualChecks = habitBreakdowns.reduce((acc, h) => acc + h.checksForHabit, 0);
    const overallRate = possibleChecks > 0 ? Math.round((actualChecks / possibleChecks) * 100) : 0;

    habitBreakdowns.sort((a, b) => b.rate - a.rate);

    return {
      dayOfWeek,
      dayName,
      fullName,
      matchingDays,
      countOfThisWeekday,
      possibleChecks,
      actualChecks,
      overallRate,
      habitBreakdowns,
    };
  });

  // Best day index
  let maxRate = -1;
  let bestDayIndex = 0;
  weekdayStats.forEach((w, i) => {
    if (w.overallRate > maxRate) {
      maxRate = w.overallRate;
      bestDayIndex = i;
    }
  });

  const selectedStats = selectedDayOfWeek !== null ? weekdayStats[selectedDayOfWeek] : null;

  const handleSelectDay = (dow: number) => {
    setSelectedDayOfWeek(dow);
    soundEngine.playTapSound();
    triggerHaptic();
  };

  return (
    <div className="space-y-3 select-none">
      {/* 7-Column Interactive Bars Container */}
      <div className="p-3 sm:p-3.5 rounded-[22px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekdayStats.map((st) => {
            const isSelected = selectedDayOfWeek === st.dayOfWeek;
            const isBest = st.dayOfWeek === bestDayIndex && st.overallRate > 0;

            return (
              <button
                key={st.dayName}
                type="button"
                onClick={() => handleSelectDay(st.dayOfWeek)}
                className={`flex flex-col items-center gap-1.5 p-1 sm:p-1.5 rounded-[16px] transition-all duration-150 ios-tap ${
                  isSelected
                    ? 'bg-black/[0.05] dark:bg-white/[0.08]'
                    : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                }`}
              >
                {/* Bar Track & Fill */}
                <div className="w-full bg-[#ede6dc]/70 dark:bg-[#2c2722] h-24 sm:h-28 rounded-[12px] flex flex-col justify-end p-1 overflow-hidden border border-black/[0.02] dark:border-white/[0.03]">
                  <div
                    className={`w-full rounded-[8px] transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#5f7a61] dark:bg-[#7d9d80]'
                        : isBest
                        ? 'bg-[#5f7a61] opacity-90'
                        : 'bg-[#5f7a61]/70 dark:bg-[#7d9d80]/70'
                    }`}
                    style={{ height: `${Math.max(6, st.overallRate)}%` }}
                  />
                </div>

                <span className={`text-xs font-bold ${
                  isSelected ? 'text-[#5f7a61] dark:text-[#8fc493]' : 'text-[#2d2823] dark:text-[#f4efe8]'
                }`}>
                  {st.dayName}
                </span>

                <span className="text-[11px] font-medium text-[#8c7e70] dark:text-[#a89b8d]">
                  {st.overallRate}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector Card */}
      {selectedStats && (
        <div className="rounded-[20px] bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] p-3.5 space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.05]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[10px] bg-[#5f7a61]/12 dark:bg-[#7d9d80]/20 flex items-center justify-center font-bold text-xs text-[#5f7a61] dark:text-[#8fc493]">
                {selectedStats.dayName}
              </div>
              <div>
                <strong className="text-xs font-bold text-[#2d2823] dark:text-[#f4efe8] block leading-tight">
                  {selectedStats.fullName} Average
                </strong>
                <span className="text-[10px] text-[#8c7e70] dark:text-[#a89b8d]">
                  {selectedStats.countOfThisWeekday} {selectedStats.fullName}s in this month
                </span>
              </div>
            </div>

            <div className="px-2 py-0.5 rounded-full bg-[#5f7a61]/10 text-[#5f7a61] dark:text-[#8fc493] text-[11px] font-bold border border-[#5f7a61]/20">
              {selectedStats.overallRate}% <span className="font-normal text-[10px] opacity-75">({selectedStats.actualChecks}/{selectedStats.possibleChecks})</span>
            </div>
          </div>

          {/* Habit breakdown */}
          <div className="space-y-1">
            {selectedStats.habitBreakdowns.length === 0 ? (
              <p className="text-[10.5px] text-[#8c7e70]">No habits tracked.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
                {selectedStats.habitBreakdowns.map(({ habit, checksForHabit, totalPossible, rate }) => (
                  <div
                    key={habit.id}
                    className="p-2 rounded-[14px] bg-white/60 dark:bg-black/20 border border-black/[0.03] dark:border-white/[0.04] flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-[#2d2823] dark:text-[#f4efe8] truncate max-w-[130px]">
                      {habit.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-[#8c7e70] dark:text-[#a89b8d]">
                        {checksForHabit}/{totalPossible}
                      </span>
                      <span className={`font-semibold text-[10px] px-1.5 py-0.2 rounded-md ${
                        rate >= 75
                          ? 'bg-[#5f7a61]/10 text-[#5f7a61] dark:text-[#8fc493]'
                          : rate >= 50
                          ? 'bg-[#d98236]/10 text-[#b56521] dark:text-[#e89b58]'
                          : 'bg-black/[0.03] text-[#8c7e70] dark:bg-white/[0.04]'
                      }`}>
                        {rate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
