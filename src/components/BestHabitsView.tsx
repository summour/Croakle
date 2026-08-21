import React from 'react';
import { PageType, HabitTemplate, MonthData } from '../types';
import { MONTH_NAMES, getDaysInMonth } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import { HabitCloverDockIcon, BambooProjectDockIcon } from './FrogIcons';
import { SubNavTabs } from './SubNavTabs';

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
  const habitStats = habits.map((habit, idx) => {
    const monthHabit = monthData.habits[idx];
    const monthChecks = monthHabit?.days.reduce((acc, d) => acc + (d ? 1 : 0), 0) || 0;
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
  });

  // Sort by goal percentage descending
  habitStats.sort((a, b) => b.goalPercent - a.goalPercent);

  return (
    <div className="space-y-4 pb-24">
      {/* Top Segmented Sub-Navigation for Habits/Projects/Rankings */}
      {onNavigate && (
        <SubNavTabs
          activePage="best"
          onNavigate={onNavigate}
          tabs={[
            { id: 'track', label: 'Habits', icon: <HabitCloverDockIcon size={15} /> },
            { id: 'project', label: 'Projects', icon: <BambooProjectDockIcon size={15} /> },
            { id: 'best', label: 'Leaderboard', icon: <Trophy size={14} className="text-[#d98236]" /> },
          ]}
        />
      )}

      {/* Month Header Navigation (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-[#fdfbf7]/90 dark:bg-[#161311]/90 backdrop-blur-xl pt-1 pb-1">
        <div className="ios-glass-card p-4 sm:p-5 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrevMonth}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white dark:bg-white/[0.08] dark:hover:bg-white/[0.15] flex items-center justify-center font-bold text-[#4a4036] dark:text-[#e0d6cb] transition border border-black/[0.06] dark:border-white/[0.1] shadow-2xs ios-tap"
            aria-label="Previous Month"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <p className="text-[10.5px] font-bold text-[#8c7e70] dark:text-[#a89b8d] uppercase tracking-wider">
              Leaderboard & Rankings
            </p>
            <strong id="CroakleBestMonth" className="text-xl font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
              {MONTH_NAMES[monthIndex]} {year}
            </strong>
          </div>
          <button
            type="button"
            onClick={onNextMonth}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white dark:bg-white/[0.08] dark:hover:bg-white/[0.15] flex items-center justify-center font-bold text-[#4a4036] dark:text-[#e0d6cb] transition border border-black/[0.06] dark:border-white/[0.1] shadow-2xs ios-tap"
            aria-label="Next Month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="ios-glass-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-[#b86f52]" />
          <h2 className="font-black text-base tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
            Habit Consistency Leaderboard
          </h2>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 text-[11px] font-black text-[#8c7e70] dark:text-[#a89b8d] uppercase tracking-wider pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
          <span className="col-span-5">Habit</span>
          <span className="col-span-3 text-center">Progress</span>
          <span className="col-span-2 text-center">Month</span>
          <span className="col-span-2 text-center">Total</span>
        </div>

        {/* Habits List */}
        <div className="space-y-2.5">
          {habitStats.map((stat, idx) => {
            const isTop = idx === 0 && stat.goalPercent > 0;
            return (
              <div
                key={stat.habit.id}
                className={`grid grid-cols-12 gap-2 items-center p-3 rounded-[18px] border transition ${
                  isTop
                    ? 'border-[#5f7a61]/30 bg-[#5f7a61]/10 dark:bg-[#5f7a61]/15 shadow-2xs'
                    : 'border-black/[0.04] dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]'
                }`}
              >
                <div className="col-span-5 min-w-0 flex items-center gap-1.5">
                  {isTop && <Sparkles size={14} className="text-[#5f7a61] shrink-0" />}
                  <span className="font-black text-sm text-[#2d2823] dark:text-[#f4efe8] truncate">
                    {stat.habit.name}
                  </span>
                </div>

                <div className="col-span-3 flex flex-col items-center">
                  <div className="w-full bg-black/[0.06] dark:bg-white/[0.08] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5f7a61] dark:bg-[#7d9d80] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, stat.goalPercent)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black mt-1 text-[#4a4036] dark:text-[#d4c8bc]">
                    {stat.goalPercent}%
                  </span>
                </div>

                <div className="col-span-2 text-center font-black text-sm text-[#2d2823] dark:text-[#f4efe8]">
                  {stat.monthChecks}
                </div>

                <div className="col-span-2 text-center font-bold text-xs text-[#8c7e70] dark:text-[#a89b8d]">
                  {stat.lifetime}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
