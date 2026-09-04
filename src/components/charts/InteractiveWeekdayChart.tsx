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
      <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#252320] border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] shadow-[3px_3px_0px_#1F1B1A]">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekdayStats.map((st) => {
            const isSelected = selectedDayOfWeek === st.dayOfWeek;
            const isBest = st.dayOfWeek === bestDayIndex && st.overallRate > 0;

            return (
              <button
                key={st.dayName}
                type="button"
                onClick={() => handleSelectDay(st.dayOfWeek)}
                className={`flex flex-col items-center gap-1.5 p-1 sm:p-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FEF08A] text-[#1F1B1A] border-[1.5px] border-[#1F1B1A] shadow-[1.5px_1.5px_0px_#1F1B1A]'
                    : 'hover:bg-zinc-100 dark:hover:bg-[#1D1B18]'
                }`}
              >
                {/* Bar Track & Fill */}
                <div className="w-full bg-[#E5E2DC] dark:bg-[#1D1B18] h-24 sm:h-28 rounded-xl flex flex-col justify-end p-1 overflow-hidden border-[1.5px] border-[#1F1B1A]">
                  <div
                    className={`w-full rounded-lg transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#E02921]'
                        : isBest
                        ? 'bg-[#0074DB]'
                        : 'bg-[#0074DB]/80 dark:bg-[#0074DB]'
                    }`}
                    style={{ height: `${Math.max(6, st.overallRate)}%` }}
                  />
                </div>

                <span className={`text-xs font-bold ${
                  isSelected ? 'text-[#1F1B1A]' : 'text-[#1F1B1A] dark:text-[#F8F7F4]'
                }`}>
                  {st.dayName}
                </span>

                <span className="text-[11px] font-bold text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70">
                  {st.overallRate}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector Card */}
      {selectedStats && (
        <div className="rounded-2xl bg-white dark:bg-[#252320] border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] shadow-[3px_3px_0px_#1F1B1A] p-3.5 space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b-[2px] border-[#1F1B1A]/20 dark:border-[#F8F7F4]/20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#FEF08A] border-[1.5px] border-[#1F1B1A] flex items-center justify-center font-bold text-xs text-[#1F1B1A]">
                {selectedStats.dayName}
              </div>
              <div>
                <strong className="text-xs font-bold text-[#1F1B1A] dark:text-[#F8F7F4] block leading-tight">
                  {selectedStats.fullName} Average
                </strong>
                <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60">
                  {selectedStats.countOfThisWeekday} {selectedStats.fullName}s in this month
                </span>
              </div>
            </div>

            <div className="px-2.5 py-0.5 rounded-lg bg-[#FEF08A] text-[#1F1B1A] text-[11px] font-bold border-[1.5px] border-[#1F1B1A] shadow-[1px_1px_0px_#1F1B1A]">
              {selectedStats.overallRate}% <span className="font-normal text-[10px] opacity-75">({selectedStats.actualChecks}/{selectedStats.possibleChecks})</span>
            </div>
          </div>

          {/* Habit breakdown */}
          <div className="space-y-1">
            {selectedStats.habitBreakdowns.length === 0 ? (
              <p className="text-[10.5px] text-[#1F1B1A]/60 font-bold">No habits tracked.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
                {selectedStats.habitBreakdowns.map(({ habit, checksForHabit, totalPossible, rate }) => (
                  <div
                    key={habit.id}
                    className="p-2.5 rounded-xl bg-[#FFFEF7] dark:bg-[#1D1B18] border-[1.5px] border-[#1F1B1A] dark:border-[#F8F7F4] shadow-[1.5px_1.5px_0px_#1F1B1A] flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-[#1F1B1A] dark:text-[#F8F7F4] truncate max-w-[130px]">
                      {habit.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70">
                        {checksForHabit}/{totalPossible}
                      </span>
                      <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded-lg border border-[#1F1B1A] ${
                        rate >= 75
                          ? 'bg-[#22C55E] text-[#1F1B1A]'
                          : rate >= 50
                          ? 'bg-[#FEF08A] text-[#1F1B1A]'
                          : 'bg-zinc-200 text-[#1F1B1A]'
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
