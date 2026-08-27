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
            { id: 'track', label: 'Habits', icon: <HabitCloverDockIcon size={15} /> },
            { id: 'project', label: 'Projects', icon: <BambooProjectDockIcon size={15} /> },
            { id: 'best', label: 'Leaderboard', icon: <Trophy size={14} className="text-[#FF9500]" /> },
          ]}
        />
      )}

      {/* Month Header Navigation (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-white/85 dark:bg-black/85 backdrop-blur-xl pt-1 pb-1">
        <div className="ios-glass-card p-4 sm:p-5 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrevMonth}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center font-bold text-zinc-800 dark:text-zinc-200 transition border border-black/[0.04] dark:border-white/[0.06] shadow-2xs ios-tap"
            aria-label="Previous Month"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <p className="text-[10.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Leaderboard & Rankings
            </p>
            <strong id="CroakleBestMonth" className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">
              {MONTH_NAMES[monthIndex]} {year}
            </strong>
          </div>
          <button
            type="button"
            onClick={onNextMonth}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center font-bold text-zinc-800 dark:text-zinc-200 transition border border-black/[0.04] dark:border-white/[0.06] shadow-2xs ios-tap"
            aria-label="Next Month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Interactive Leaderboard Visualizer */}
      <div className="ios-glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-[#FF9500]" />
            <h3 className="font-black text-sm tracking-tight text-zinc-950 dark:text-white">
              Interactive Consistency Chart
            </h3>
          </div>
          <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
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
      <div className="ios-glass-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-[#FF9500]" />
          <h2 className="font-black text-base tracking-tight text-zinc-950 dark:text-white">
            Habit Consistency Leaderboard
          </h2>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <span className="col-span-5">Habit</span>
          <span className="col-span-3 text-center">Progress</span>
          <span className="col-span-2 text-center">Month</span>
          <span className="col-span-2 text-center">Total</span>
        </div>

        {/* Habits List */}
        <div className="space-y-2.5">
          {habitStats.length === 0 ? (
            <div className="py-8 text-center text-zinc-400 dark:text-zinc-500 space-y-1">
              <p className="font-bold text-sm text-zinc-950 dark:text-white">
                No active habit data for this month
              </p>
              <p className="text-xs">
                Active habits or habits logged during {MONTH_NAMES[monthIndex]} {year} will appear here
              </p>
            </div>
          ) : (
            habitStats.map((stat, idx) => {
              const isTop = idx === 0 && stat.goalPercent > 0;
              return (
                <div
                  key={stat.habit.id}
                  className={`grid grid-cols-12 gap-2 items-center p-3 rounded-[18px] border transition ${
                    isTop
                      ? 'border-[#007AFF]/30 bg-[#007AFF]/5 dark:bg-[#007AFF]/10 shadow-2xs'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60'
                  }`}
                >
                  <div className="col-span-5 min-w-0 flex items-center gap-1.5">
                    {isTop && <Sparkles size={14} className="text-[#007AFF] shrink-0" />}
                    <span className="font-black text-sm text-zinc-950 dark:text-white truncate">
                      {stat.habit.name}
                    </span>
                    {stat.habit.completed && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 shrink-0">
                        Done
                      </span>
                    )}
                  </div>

                  <div className="col-span-3 flex flex-col items-center">
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-950 dark:bg-white rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, stat.goalPercent)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black mt-1 text-zinc-700 dark:text-zinc-300">
                      {stat.goalPercent}%
                    </span>
                  </div>

                  <div className="col-span-2 text-center font-black text-sm text-zinc-950 dark:text-white">
                    {stat.monthChecks}
                  </div>

                  <div className="col-span-2 text-center font-bold text-xs text-zinc-400 dark:text-zinc-500">
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
