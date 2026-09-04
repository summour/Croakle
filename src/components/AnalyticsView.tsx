import React, { useState } from 'react';
import { PageType, HabitTemplate, MonthData, Project, NoteItem, TimeSession, MOOD_LEVELS } from '../types';
import { getMoodTheme } from '../utils/moodConfig';
import { MONTH_NAMES, CALENDAR_HEADER_DAYS, DAY_SHORT_NAMES, getDaysInMonth, getMonthWeeks, formatIsoDate } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Trophy, Sparkles, TrendingUp, Calendar, Clock, BookOpen, Flame, Heart, BarChart3, Settings } from 'lucide-react';
import {
  ToriiStatsDockIcon,
  EmaTabIcon,
  FrogMoodIcon,
  CloverIcon,
  BambooScrollDockIcon,
  WoodGearDockIcon,
  HabitCloverDockIcon,
  FrogFaceDockIcon,
  BambooProjectDockIcon,
  PocketTimerDockIcon,
  WashiJournalDockIcon,
} from './FrogIcons';
import { useSwipeMonth } from '../hooks/useSwipeMonth';
import { InteractiveMomentumChart } from './charts/InteractiveMomentumChart';
import { InteractiveMoodTrendChart } from './charts/InteractiveMoodTrendChart';
import { InteractiveLeaderboardChart } from './charts/InteractiveLeaderboardChart';
import { InteractiveProjectsProgressChart } from './charts/InteractiveProjectsProgressChart';

interface AnalyticsViewProps {
  habits: HabitTemplate[];
  monthData: MonthData;
  projects: Project[];
  notes?: NoteItem[];
  sessions?: TimeSession[];
  year: number;
  monthIndex: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onNavigate?: (page: PageType) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  habits,
  monthData,
  projects,
  notes = [],
  sessions = [],
  year,
  monthIndex,
  onPrevMonth,
  onNextMonth,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'habits' | 'moods' | 'projects'>('overview');

  const daysInMonth = getDaysInMonth(year, monthIndex);
  const currentMonthPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  const monthWeeks = getMonthWeeks(year, monthIndex);

  // ----------------------------------------------------
  // Habit Filtering for Selected Month
  // Exclude archived/completed habits that have 0 checks in this specific month
  // ----------------------------------------------------
  const habitMonthStats = habits.map((habit, originalIndex) => {
    const monthHabit = monthData.habits[originalIndex];
    const days = monthHabit?.days || [];
    const checks = days.reduce((acc, d) => acc + (d ? 1 : 0), 0);
    const isArchived = Boolean(habit.completed);
    const isRelevantForMonth = !isArchived || checks > 0;
    return {
      habit,
      originalIndex,
      monthHabit,
      days,
      checks,
      isArchived,
      isRelevantForMonth,
    };
  });

  // Active habits or archived habits that were tracked in this month
  const activeOrTrackedHabits = habitMonthStats.filter((h) => h.isRelevantForMonth);

  // ----------------------------------------------------
  // Habit Calculations (using active/tracked habits)
  // ----------------------------------------------------
  const dailyHabitRates = Array.from({ length: daysInMonth }, (_, dayIdx) => {
    if (activeOrTrackedHabits.length === 0) return 0;
    const completed = activeOrTrackedHabits.reduce((acc, h) => acc + (h.days[dayIdx] ? 1 : 0), 0);
    return Math.round((completed / activeOrTrackedHabits.length) * 100);
  });

  const totalPossibleChecks = activeOrTrackedHabits.length * daysInMonth;
  const actualHabitChecks = activeOrTrackedHabits.reduce((acc, h) => acc + h.checks, 0);
  const overallMonthPercent = totalPossibleChecks > 0 ? Math.round((actualHabitChecks / totalPossibleChecks) * 100) : 0;

  // Best Habit
  let bestHabitName = 'None';
  let bestHabitCount = -1;
  activeOrTrackedHabits.forEach((h) => {
    if (h.checks > bestHabitCount) {
      bestHabitCount = h.checks;
      bestHabitName = h.habit.name;
    }
  });

  // Weekday Productivity (Monday to Sunday)
  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);
    const dayOfWeek = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    weekdayCounts[dayOfWeek]++;
    const dayChecks = activeOrTrackedHabits.reduce((acc, h) => acc + (h.days?.[day - 1] ? 1 : 0), 0);
    weekdayTotals[dayOfWeek] += dayChecks;
  }
  const weekdayRates = weekdayTotals.map((tot, i) => {
    const possible = activeOrTrackedHabits.length * Math.max(1, weekdayCounts[i]);
    return possible > 0 ? Math.round((tot / possible) * 100) : 0;
  });

  // Weekly Habit Adherence
  const weeklyHabitRates = monthWeeks.map((week) => {
    let weekPossible = 0;
    let weekActual = 0;
    week.days.forEach((d) => {
      if (d.inMonth) {
        weekPossible += activeOrTrackedHabits.length;
        weekActual += activeOrTrackedHabits.reduce((acc, h) => acc + (h.days?.[d.dayOfMonth - 1] ? 1 : 0), 0);
      }
    });
    return {
      label: week.label,
      range: week.rangeLabel,
      rate: weekPossible > 0 ? Math.round((weekActual / weekPossible) * 100) : 0,
      actual: weekActual,
      possible: weekPossible,
    };
  });

  // ----------------------------------------------------
  // Mood Calculations
  // ----------------------------------------------------
  const moodCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let recordedMoodsCount = 0;
  let totalMoodScore = 0;

  monthData.moods.forEach((m) => {
    if (m && moodCounts[m] !== undefined) {
      moodCounts[m]++;
      recordedMoodsCount++;
      totalMoodScore += m;
    }
  });

  const avgMoodNum = recordedMoodsCount > 0 ? totalMoodScore / recordedMoodsCount : 0;
  const avgMoodStr = recordedMoodsCount > 0 ? avgMoodNum.toFixed(1) : '—';

  // Dominant Mood
  let maxMoodCount = 0;
  let dominantMoodVal: number | null = null;
  Object.entries(moodCounts).forEach(([val, cnt]) => {
    if (cnt > maxMoodCount) {
      maxMoodCount = cnt;
      dominantMoodVal = Number(val);
    }
  });
  const dominantMoodObj = dominantMoodVal ? MOOD_LEVELS.find((m) => m.value === dominantMoodVal) : null;

  // Positivity Rate (Rad 5 + Good 4)
  const positiveMoodCount = (moodCounts[5] || 0) + (moodCounts[4] || 0);
  const positivityRate = recordedMoodsCount > 0 ? Math.round((positiveMoodCount / recordedMoodsCount) * 100) : 0;

  // Mood vs Habit Correlation
  let positiveDayHabitChecks = 0;
  let positiveDayCount = 0;
  let normalDayHabitChecks = 0;
  let normalDayCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const mood = monthData.moods[day - 1];
    const checks = activeOrTrackedHabits.reduce((acc, h) => acc + (h.days?.[day - 1] ? 1 : 0), 0);
    if (mood && mood >= 4) {
      positiveDayHabitChecks += checks;
      positiveDayCount++;
    } else if (mood && mood < 4) {
      normalDayHabitChecks += checks;
      normalDayCount++;
    }
  }

  const positiveDayAvgHabitRate = positiveDayCount > 0 && activeOrTrackedHabits.length > 0
    ? Math.round((positiveDayHabitChecks / (positiveDayCount * activeOrTrackedHabits.length)) * 100)
    : null;
  const normalDayAvgHabitRate = normalDayCount > 0 && activeOrTrackedHabits.length > 0
    ? Math.round((normalDayHabitChecks / (normalDayCount * activeOrTrackedHabits.length)) * 100)
    : null;

  // ----------------------------------------------------
  // Projects Calculations
  // ----------------------------------------------------
  const activeProjects = projects.filter((p) => !p.completed);
  const completedProjects = projects.filter((p) => p.completed);

  // Month project check-ins
  let totalProjectMonthChecks = 0;
  const projectStats = projects.map((p) => {
    let checkCount = 0;
    let weeksHitGoal = 0;
    monthWeeks.forEach((w) => {
      const days = p.weeklyDays?.[w.weekKey] || [];
      const countInWeek = days.filter(Boolean).length;
      checkCount += countInWeek;
      if (countInWeek >= p.goal) {
        weeksHitGoal++;
      }
    });
    totalProjectMonthChecks += checkCount;
    return {
      ...p,
      monthChecks: checkCount,
      weeksHitGoal,
      totalWeeks: monthWeeks.length,
      goalAdherence: monthWeeks.length > 0 ? Math.round((weeksHitGoal / monthWeeks.length) * 100) : 0,
      isRelevantForMonth: !p.completed || checkCount > 0,
    };
  });

  const activeOrTrackedProjects = projectStats.filter((p) => p.isRelevantForMonth);

  // ----------------------------------------------------
  // Notes & Focus Time
  // ----------------------------------------------------
  const monthNotes = notes.filter((n) => n.date.startsWith(currentMonthPrefix));
  const monthSessions = sessions.filter((s) => s.date.startsWith(currentMonthPrefix));
  const totalFocusMinutes = monthSessions.reduce((acc, s) => acc + s.duration, 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  // ----------------------------------------------------
  // SVG Habit Completion Curve Calculation
  // ----------------------------------------------------
  const svgWidth = 600;
  const svgHeight = 160;
  const paddingX = 24;
  const paddingY = 24;
  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingY * 2;

  const points = dailyHabitRates.map((rate, i) => {
    const x = paddingX + (i / Math.max(1, daysInMonth - 1)) * innerWidth;
    const y = paddingY + innerHeight - (rate / 100) * innerHeight;
    return { x, y, rate, day: i + 1, mood: monthData.moods[i] };
  });

  const linePath = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : '';

  const swipeHandlers = useSwipeMonth({
    onPrevMonth,
    onNextMonth,
  });

  return (
    <div className="space-y-4 pb-28 font-mono" {...swipeHandlers}>
      {/* Header & Month Navigator (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-transparent pt-1 pb-1 space-y-2">
        <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] bg-[#0074DB] dark:bg-[#1D4ED8] text-white shadow-[4px_4px_0px_#1F1B1A] dark:shadow-[4px_4px_0px_#000000] p-3.5 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onPrevMonth}
              className="w-8 h-8 rounded-xl border-[2px] border-[#1F1B1A] bg-white dark:bg-[#252320] shadow-[2px_2px_0px_#1F1B1A] flex items-center justify-center font-bold text-[#1F1B1A] dark:text-[#F8F7F4] transition-all cursor-pointer hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
              aria-label="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-center">
              <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/80">
                Journey Analytics
              </p>
              <strong className="text-base sm:text-lg font-bold font-oswald tracking-tight uppercase text-white block">
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

          {/* Segmented Filter Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-white/20 dark:bg-black/25 border-[2px] border-[#1F1B1A] rounded-xl shadow-[2px_2px_0px_#1F1B1A]">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'moods', label: 'Mood' },
                { id: 'habits', label: 'Habits' },
                { id: 'projects', label: 'Projects' },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-w-0 py-1.5 px-1 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer flex items-center justify-center ${
                    isActive
                      ? 'bg-[#FEF08A] text-[#1F1B1A] border-[1.5px] border-[#1F1B1A] shadow-[1px_1px_0px_#1F1B1A]'
                      : 'text-white/90 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW TAB */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Key KPI Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-3.5 space-y-1 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block uppercase">Habit Rate</span>
              <strong className="text-xl font-bold font-oswald text-[#1F1B1A] dark:text-[#F8F7F4] block">
                {overallMonthPercent}%
              </strong>
              <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block truncate">
                {actualHabitChecks} / {totalPossibleChecks} checks
              </span>
            </div>

            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-3.5 space-y-1 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block uppercase">Avg Mood</span>
              <strong className="text-xl font-bold font-oswald text-[#1F1B1A] dark:text-[#F8F7F4] block">
                {avgMoodStr} <span className="text-xs text-[#1F1B1A]/40 dark:text-[#F8F7F4]/40 font-mono">/ 5</span>
              </strong>
              <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block truncate">
                {recordedMoodsCount} days logged
              </span>
            </div>

            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-3.5 space-y-1 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block uppercase">Projects</span>
              <strong className="text-xl font-bold font-oswald text-[#1F1B1A] dark:text-[#F8F7F4] block">
                {activeProjects.length}
              </strong>
              <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block truncate">
                {totalProjectMonthChecks} check-ins
              </span>
            </div>

            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-3.5 space-y-1 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block uppercase">Focus Time</span>
              <strong className="text-xl font-bold font-oswald text-[#1F1B1A] dark:text-[#F8F7F4] block">
                {totalFocusHours}h
              </strong>
              <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block truncate">
                {monthSessions.length} sessions
              </span>
            </div>
          </div>

          {/* Combined Interactive Momentum Curve */}
          <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-4 space-y-3 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[4px_4px_0px_#1F1B1A]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-oswald text-sm uppercase tracking-tight text-[#1F1B1A] dark:text-[#F8F7F4]">
                Habit, Mood & Focus Flow
              </h3>
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 uppercase">
                {MONTH_NAMES[monthIndex]} 1–{daysInMonth}
              </span>
            </div>

            <InteractiveMomentumChart
              year={year}
              monthIndex={monthIndex}
              habits={habits}
              monthData={monthData}
              sessions={sessions}
            />
          </div>

          {/* Monthly Highlights Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-4 space-y-1.5 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <div className="text-[10px] font-bold uppercase text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60">
                <span>Top Habit this Month</span>
              </div>
              <p className="text-sm font-bold font-oswald uppercase text-[#1F1B1A] dark:text-[#F8F7F4] truncate">
                {bestHabitName}
              </p>
              <p className="text-xs text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70">
                {bestHabitCount > 0 ? `Completed on ${bestHabitCount} days (${Math.round((bestHabitCount / daysInMonth) * 100)}%)` : 'No checks logged yet'}
              </p>
            </div>

            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-4 space-y-1.5 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <div className="text-[10px] font-bold uppercase text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60">
                <span>Mood Balance</span>
              </div>
              <p className="text-sm font-bold font-oswald uppercase text-[#1F1B1A] dark:text-[#F8F7F4] flex items-center gap-1.5">
                {dominantMoodObj ? (
                  <span>Mostly {dominantMoodObj.label}</span>
                ) : (
                  <span>No mood entries yet</span>
                )}
              </p>
              <p className="text-xs text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70">
                {positivityRate}% positive rating days ({positiveMoodCount} of {recordedMoodsCount} recorded)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HABITS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'habits' && (
        <div className="space-y-4">
          {/* Habits Summary Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-3.5 space-y-1 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 uppercase">Overall Rate</span>
              <strong className="text-xl font-bold font-oswald text-[#1F1B1A] dark:text-[#F8F7F4] block">
                {overallMonthPercent}%
              </strong>
              <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block truncate">
                {actualHabitChecks} checks
              </span>
            </div>

            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-3.5 space-y-1 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 uppercase">Active</span>
              <strong className="text-xl font-bold font-oswald text-[#1F1B1A] dark:text-[#F8F7F4] block">
                {activeOrTrackedHabits.length}
              </strong>
              <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block truncate">
                habits tracked
              </span>
            </div>

            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-3.5 space-y-1 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 uppercase">Top Habit</span>
              <strong className="text-sm font-bold font-oswald text-[#1F1B1A] dark:text-[#F8F7F4] block truncate mt-1">
                {bestHabitName}
              </strong>
              <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block truncate">
                {bestHabitCount > 0 ? `${bestHabitCount} days` : '—'}
              </span>
            </div>
          </div>

          {/* Interactive Leaderboard & Performance Chart */}
          <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-4 space-y-3 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[4px_4px_0px_#1F1B1A]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-oswald text-sm uppercase tracking-tight text-[#1F1B1A] dark:text-[#F8F7F4]">
                Consistency & Performance
              </h3>
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 uppercase">
                Tap habit to inspect
              </span>
            </div>

            <InteractiveLeaderboardChart
              year={year}
              monthIndex={monthIndex}
              habits={habits}
              monthData={monthData}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MOODS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'moods' && (
        <div className="space-y-4">
          {/* Mood KPIs */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-3.5 space-y-1 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block uppercase">Avg Score</span>
              <strong className="text-xl font-bold font-oswald text-[#1F1B1A] dark:text-[#F8F7F4] block">
                {avgMoodStr} <span className="text-xs text-[#1F1B1A]/40 dark:text-[#F8F7F4]/40 font-mono">/ 5</span>
              </strong>
              <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block truncate">
                {recordedMoodsCount} days logged
              </span>
            </div>

            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-3.5 space-y-1 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block uppercase">Positivity</span>
              <strong className="text-xl font-bold font-oswald text-[#1F1B1A] dark:text-[#F8F7F4] block">
                {positivityRate}%
              </strong>
              <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block truncate">
                Rad & Good days
              </span>
            </div>

            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-3.5 space-y-1 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block uppercase">Dominant</span>
              <div className="flex items-center gap-1 mt-1">
                {dominantMoodObj ? (
                  <span className="text-xs font-bold font-oswald uppercase text-[#1F1B1A] dark:text-[#F8F7F4]">
                    {dominantMoodObj.label}
                  </span>
                ) : (
                  <strong className="text-xs font-bold font-oswald text-[#1F1B1A] dark:text-[#F8F7F4]">None</strong>
                )}
              </div>
              <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block truncate">
                {maxMoodCount > 0 ? `${maxMoodCount} days` : 'No logs'}
              </span>
            </div>
          </div>

          {/* Interactive Mood Trend & Flow Curve */}
          <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-4 space-y-3 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[4px_4px_0px_#1F1B1A]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-oswald text-sm uppercase tracking-tight text-[#1F1B1A] dark:text-[#F8F7F4]">
                Monthly Mood Trend
              </h3>
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 uppercase">
                Tap point to inspect
              </span>
            </div>

            <InteractiveMoodTrendChart
              year={year}
              monthIndex={monthIndex}
              monthData={monthData}
            />
          </div>

          {/* Mood Calendar Matrix */}
          <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-4 space-y-3 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[4px_4px_0px_#1F1B1A]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-oswald text-sm uppercase tracking-tight text-[#1F1B1A] dark:text-[#F8F7F4]">
                Monthly Mood Calendar
              </h3>
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 uppercase">
                {MONTH_NAMES[monthIndex]} {year}
              </span>
            </div>

            {/* Natural Fit Calendar Grid */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-7 gap-1 text-center">
                {CALENDAR_HEADER_DAYS.map((d) => (
                  <span key={d} className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 uppercase py-0.5">
                    {d}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {/* Offset for first day of month */}
                {Array.from({ length: new Date(year, monthIndex, 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-9 sm:h-11 pointer-events-none opacity-0" />
                ))}

                {/* Month Days */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const dayNum = i + 1;
                  const moodVal = monthData.moods[i];
                  const moodTheme = getMoodTheme(moodVal);
                  return (
                    <div
                      key={dayNum}
                      className={`h-9 sm:h-11 rounded-xl border-[1.5px] border-[#1F1B1A] shadow-[1px_1px_0px_#1F1B1A] flex flex-col items-center justify-between p-1 select-none ${
                        moodTheme ? `${moodTheme.cellBg} ${moodTheme.cellTextColor}` : 'bg-white dark:bg-[#1D1B18] text-[#1F1B1A] dark:text-[#F8F7F4]'
                      }`}
                    >
                      {/* Day Number */}
                      <span className={`text-[9px] font-bold leading-none ${moodTheme ? 'opacity-90' : 'text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60'}`}>
                        {dayNum}
                      </span>

                      {/* Mood Abbreviation */}
                      <div
                        className="flex-1 w-full flex items-center justify-center min-h-0"
                        title={moodTheme ? `Day ${dayNum}: ${moodTheme.label}` : `Day ${dayNum}`}
                      >
                        {moodTheme ? (
                          <span className={`text-[8.5px] font-black uppercase leading-none ${moodTheme.cellTextColor}`}>
                            {moodTheme.letter || moodTheme.abbr[0]}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Habit & Mood Correlation Card */}
          <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-4 space-y-1.5 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
            <div className="flex items-center gap-2 text-xs font-bold font-oswald uppercase text-[#1F1B1A] dark:text-[#F8F7F4]">
              <Heart size={14} className="text-[#E02921]" />
              <span>Habit & Mood Synergy</span>
            </div>
            {positiveDayAvgHabitRate !== null && normalDayAvgHabitRate !== null ? (
              <p className="text-xs text-[#1F1B1A] dark:text-[#F8F7F4] leading-relaxed">
                On <strong className="text-[#E02921]">Rad/Good</strong> mood days, your habit completion was{' '}
                <strong className="text-[#E02921]">{positiveDayAvgHabitRate}%</strong>, compared to{' '}
                <strong className="text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60">{normalDayAvgHabitRate}%</strong> on lower mood days.
              </p>
            ) : (
              <p className="text-xs text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 leading-relaxed">
                Log both your habits and daily mood for a few days to discover personal productivity and mood correlations.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PROJECTS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {/* Projects KPI Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-3.5 space-y-1 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 uppercase">Active</span>
              <strong className="text-xl font-bold font-oswald text-[#1F1B1A] dark:text-[#F8F7F4] block">
                {activeProjects.length}
              </strong>
              <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block truncate">
                in progress
              </span>
            </div>

            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-3.5 space-y-1 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 uppercase">Completed</span>
              <strong className="text-xl font-bold font-oswald text-[#1F1B1A] dark:text-[#F8F7F4] block">
                {completedProjects.length}
              </strong>
              <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block truncate">
                milestones
              </span>
            </div>

            <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-3.5 space-y-1 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 uppercase">Check-ins</span>
              <strong className="text-xl font-bold font-oswald text-[#1F1B1A] dark:text-[#F8F7F4] block">
                {totalProjectMonthChecks}
              </strong>
              <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 block truncate">
                this month
              </span>
            </div>
          </div>

          {/* Project by Project In-Depth Breakdown */}
          <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] p-4 space-y-3 bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[4px_4px_0px_#1F1B1A]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-oswald text-sm uppercase tracking-tight text-[#1F1B1A] dark:text-[#F8F7F4]">
                Projects Progress & Performance
              </h3>
              <span className="text-[10px] font-bold text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 uppercase">
                {projects.length} Projects Tracked
              </span>
            </div>

            <InteractiveProjectsProgressChart
              year={year}
              monthIndex={monthIndex}
              projects={projects}
            />
          </div>
        </div>
      )}
    </div>
  );
};
