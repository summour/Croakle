import React from 'react';
import { PageType, HabitTemplate, MonthData } from '../types';
import { MONTH_NAMES, getDaysInMonth } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import { HabitCloverDockIcon, BambooProjectDockIcon } from './FrogIcons';
import { SubNavTabs } from './SubNavTabs';
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
      {/* Top Segmented Sub-Navigation for Habits/Projects/Rankings */}
      {onNavigate && (
        <SubNavTabs
          activePage="best"
          onNavigate={onNavigate}
          tabs={[
            { id: 'track', label: 'Habits' },
            { id: 'project', label: 'Projects' },
            { id: 'best', label: 'Leaderboard' },
          ]}
        />
      )}

      {/* Month Header Navigation (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-[#F8F7F4] dark:bg-[#1D1B18] pt-1 pb-1">
        <div className="border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] p-3.5 sm:p-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrevMonth}
            className="w-7 h-7 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] flex items-center justify-center font-bold text-[#1D1B18] dark:text-[#F8F7F4] transition cursor-pointer hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
            aria-label="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-center">
            <p className="text-[9px] font-mono font-bold text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 uppercase tracking-widest">
              Leaderboard & Rankings
            </p>
            <strong id="CroakleBestMonth" className="text-lg font-bold font-oswald tracking-tight uppercase text-[#1D1B18] dark:text-[#F8F7F4]">
              {MONTH_NAMES[monthIndex]} {year}
            </strong>
          </div>
          <button
            type="button"
            onClick={onNextMonth}
            className="w-7 h-7 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] flex items-center justify-center font-bold text-[#1D1B18] dark:text-[#F8F7F4] transition cursor-pointer hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
            aria-label="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Interactive Leaderboard Visualizer */}
      <div className="card p-4 space-y-3 bg-white dark:bg-[#1D1B18]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-[#E63946]" />
            <h3 className="font-bold font-oswald text-sm uppercase tracking-tight text-[#1D1B18] dark:text-[#F8F7F4]">
              Consistency Chart
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 uppercase">
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
      <div className="card p-4 space-y-3 bg-white dark:bg-[#1D1B18]">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-[#E63946]" />
          <h2 className="font-bold font-oswald text-base uppercase tracking-tight text-[#1D1B18] dark:text-[#F8F7F4]">
            Habit Consistency Leaderboard
          </h2>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 text-[10px] font-mono font-bold text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 uppercase tracking-wider pb-2 border-b border-[#1D1B18] dark:border-[#F8F7F4]">
          <span className="col-span-5">Habit</span>
          <span className="col-span-3 text-center">Progress</span>
          <span className="col-span-2 text-center">Month</span>
          <span className="col-span-2 text-center">Total</span>
        </div>

        {/* Habits List */}
        <div className="space-y-2">
          {habitStats.length === 0 ? (
            <div className="py-8 text-center text-[#1D1B18]/50 dark:text-[#F8F7F4]/50 space-y-1">
              <p className="font-bold font-oswald text-sm uppercase text-[#1D1B18] dark:text-[#F8F7F4]">
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
                  className={`grid grid-cols-12 gap-2 items-center p-2.5 border transition ${
                    isTop
                      ? 'border-[#E63946] bg-white dark:bg-[#1D1B18]'
                      : 'border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-white dark:bg-[#1D1B18]'
                  }`}
                >
                  <div className="col-span-5 min-w-0 flex items-center gap-1.5">
                    {isTop && <Sparkles size={12} className="text-[#E63946] shrink-0" />}
                    <span className="font-mono font-bold text-xs text-[#1D1B18] dark:text-[#F8F7F4] truncate">
                      {stat.habit.name}
                    </span>
                    {stat.habit.completed && (
                      <span className="text-[8px] font-mono font-bold px-1 py-0.2 border border-[#1D1B18] dark:border-[#F8F7F4] text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 shrink-0 uppercase">
                        Done
                      </span>
                    )}
                  </div>

                  <div className="col-span-3 flex flex-col items-center">
                    <div className="w-full bg-[#F8F7F4] dark:bg-[#252320] border border-[#1D1B18] dark:border-[#F8F7F4] h-2 overflow-hidden">
                      <div
                        className="h-full bg-[#1D1B18] dark:bg-[#F8F7F4] transition-all duration-300"
                        style={{ width: `${Math.min(100, stat.goalPercent)}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono font-bold mt-1 text-[#1D1B18] dark:text-[#F8F7F4]">
                      {stat.goalPercent}%
                    </span>
                  </div>

                  <div className="col-span-2 text-center font-mono font-bold text-xs text-[#1D1B18] dark:text-[#F8F7F4]">
                    {stat.monthChecks}
                  </div>

                  <div className="col-span-2 text-center font-mono text-[10px] text-[#1D1B18]/60 dark:text-[#F8F7F4]/60">
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
