import React from 'react';
import { PageType, HabitTemplate, MonthData } from '../types';
import { MONTH_NAMES, getDaysInMonth } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import { HabitCloverDockIcon, BambooProjectDockIcon } from './FrogIcons';
import { useSwipeMonth } from '../hooks/useSwipeMonth';
import { InteractiveLeaderboardChart } from './charts/InteractiveLeaderboardChart';

interface BestHabitsViewProps {
  habits: HabitTemplate[];
  monthData: MonthData;
  year: number;
  monthIndex: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onNavigate?: (page: PageType) => void;
}

export const BestHabitsView: React.FC<BestHabitsViewProps> = ({
  habits,
  monthData,
  year,
  monthIndex,
  onPrevMonth,
  onNextMonth,
  onNavigate,
}) => {
  const daysInMonth = getDaysInMonth(year, monthIndex);
  const weeksInMonth = Math.ceil(daysInMonth / 7);

  // Calculate monthly goal and percentage for each habit
  const habitStats = habits
    .map((habit, idx) => {
      const monthHabit = monthData.habits[idx];
      const monthChecks = monthHabit?.days ? monthHabit.days.reduce((acc, d) => acc + (d ? 1 : 0), 0) : 0;
      const monthlyTarget = Math.min(daysInMonth, habit.goal * weeksInMonth);
      const goalPercent = monthlyTarget > 0 ? Math.round((monthChecks / monthlyTarget) * 100) : 0;
      const lifetime = (monthHabit?.lifetime || 0) + monthChecks;

      return {
        habit,
        monthChecks,
        monthlyTarget,
        goalPercent,
        lifetime,
      };
    })
    .filter((stat) => {
      // If habit is marked as completed (Done) and has 0 activity in this specific month, hide it
      if (stat.habit.completed && stat.monthChecks === 0) {
        return false;
      }
      return true;
    });

  // Sort by goal percentage descending
  habitStats.sort((a, b) => b.goalPercent - a.goalPercent);

  const swipeHandlers = useSwipeMonth({
    onPrevMonth,
    onNextMonth,
  });

  return (
    <div className="space-y-4 pb-24" {...swipeHandlers}>
      {/* Month Header Navigation (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-transparent pt-1 pb-1">
        <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] bg-[#0074DB] dark:bg-[#1D4ED8] text-white shadow-[4px_4px_0px_#1F1B1A] dark:shadow-[4px_4px_0px_#000000] p-3.5 sm:p-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrevMonth}
            className="w-8 h-8 rounded-xl border-[2px] border-[#1F1B1A] bg-white dark:bg-[#252320] shadow-[2px_2px_0px_#1F1B1A] flex items-center justify-center font-bold text-[#1F1B1A] dark:text-[#F8F7F4] transition-all cursor-pointer hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-center">
            <p className="text-[9px] font-mono font-bold text-white/80 uppercase tracking-widest">
              Leaderboard & Rankings
            </p>
            <strong id="CroakleBestMonth" className="text-lg font-bold font-oswald tracking-tight uppercase text-white">
              {MONTH_NAMES[monthIndex]} {year}
            </strong>
          </div>
          <button
            type="button"
            onClick={onNextMonth}
            className="w-8 h-8 rounded-xl border-[2px] border-[#1F1B1A] bg-white dark:bg-[#252320] shadow-[2px_2px_0px_#1F1B1A] flex items-center justify-center font-bold text-[#1F1B1A] dark:text-[#F8F7F4] transition-all cursor-pointer hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Interactive Leaderboard Visualizer */}
      <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] bg-[#FED843] text-[#1F1B1A] shadow-[4px_4px_0px_#1F1B1A] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-[#E02921]" />
            <h3 className="font-bold font-oswald text-sm uppercase tracking-tight text-[#1F1B1A]">
              Consistency Chart
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#1F1B1A]/70 uppercase">
            Tap habit for breakdown
          </span>
        </div>

        <InteractiveLeaderboardChart
          year={year}
          monthIndex={monthIndex}
          habits={habits}
          monthData={monthData}
        />
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] bg-[#FED843] text-[#1F1B1A] shadow-[4px_4px_0px_#1F1B1A] p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-[#E02921]" />
          <h2 className="font-bold font-oswald text-base uppercase tracking-tight text-[#1F1B1A]">
            Habit Consistency Leaderboard
          </h2>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 text-[10px] font-mono font-bold text-[#1F1B1A]/70 uppercase tracking-wider pb-2 border-b-[2px] border-[#1F1B1A]/20">
          <span className="col-span-5">Habit</span>
          <span className="col-span-3 text-center">Progress</span>
          <span className="col-span-2 text-center">Month</span>
          <span className="col-span-2 text-center">Total</span>
        </div>

        {/* Habits List */}
        <div className="space-y-2.5">
          {habitStats.length === 0 ? (
            <div className="py-8 text-center text-[#1F1B1A]/70 space-y-1">
              <p className="font-bold font-oswald text-sm uppercase text-[#1F1B1A]">
                No active habit data for this month
              </p>
              <p className="text-xs font-mono">
                Active habits or habits logged during {MONTH_NAMES[monthIndex]} {year} will appear here
              </p>
            </div>
          ) : (
            habitStats.map((stat, idx) => {
              const isTop = idx === 0 && stat.goalPercent > 0;
              return (
                <div
                  key={stat.habit.id}
                  className={`grid grid-cols-12 gap-2 items-center p-3 rounded-xl border-[2px] transition shadow-[2px_2px_0px_#1F1B1A] ${
                    isTop
                      ? 'border-[#1F1B1A] bg-white text-[#1F1B1A]'
                      : 'border-[#1F1B1A] bg-white/90 text-[#1F1B1A]'
                  }`}
                >
                  <div className="col-span-5 min-w-0 flex items-center gap-1.5">
                    {isTop && <Sparkles size={13} className="text-[#E02921] shrink-0 fill-current" />}
                    <span className="font-mono font-bold text-xs text-[#1F1B1A] truncate">
                      {stat.habit.name}
                    </span>
                    {stat.habit.completed && (
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full border border-[#1F1B1A] bg-white text-[#1F1B1A]/70 shrink-0 uppercase">
                        Done
                      </span>
                    )}
                  </div>

                  <div className="col-span-3 flex flex-col items-center">
                    <div className="w-full bg-[#EAE8E3] dark:bg-[#252320] border-[1.5px] border-[#1F1B1A] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#E02921] transition-all duration-300 rounded-full"
                        style={{ width: `${Math.min(100, stat.goalPercent)}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono font-bold mt-1 text-[#1F1B1A] dark:text-[#F8F7F4]">
                      {stat.goalPercent}%
                    </span>
                  </div>

                  <div className="col-span-2 text-center font-mono font-bold text-xs text-[#1F1B1A] dark:text-[#F8F7F4]">
                    {stat.monthChecks}
                  </div>

                  <div className="col-span-2 text-center font-mono text-[10px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60">
                    {stat.lifetime}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
