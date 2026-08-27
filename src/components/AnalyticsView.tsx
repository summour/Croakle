import React, { useState } from 'react';
import { PageType, HabitTemplate, MonthData, Project, NoteItem, TimeSession, MOOD_LEVELS } from '../types';
import { MONTH_NAMES, CALENDAR_HEADER_DAYS, DAY_SHORT_NAMES, getDaysInMonth, getMonthWeeks, formatIsoDate } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Trophy, Sparkles, TrendingUp, Calendar, Clock, BookOpen, Flame, Heart } from 'lucide-react';
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
import { SubNavTabs } from './SubNavTabs';
import { useSwipeMonth } from '../hooks/useSwipeMonth';
import { InteractiveMomentumChart } from './charts/InteractiveMomentumChart';
import { InteractiveMoodTrendChart } from './charts/InteractiveMoodTrendChart';
import { InteractiveLeaderboardChart } from './charts/InteractiveLeaderboardChart';

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
    <div className="space-y-4 pb-28" {...swipeHandlers}>
      {/* Top Segmented Sub-Navigation for Analytics/Settings */}
      {onNavigate && (
        <SubNavTabs
          activePage="analysis"
          onNavigate={onNavigate}
          tabs={[
            { id: 'analysis', label: 'Analytics', icon: <ToriiStatsDockIcon size={15} /> },
            { id: 'settings', label: 'Settings', icon: <WoodGearDockIcon size={15} /> },
          ]}
        />
      )}

      {/* Header & Month Navigator (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-white/85 dark:bg-black/85 backdrop-blur-2xl pt-1 pb-1 space-y-3">
        <div className="ios-glass-card p-3.5 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onPrevMonth}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center font-bold text-zinc-800 dark:text-zinc-200 transition-all ios-tap"
              aria-label="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Journey Analytics
              </p>
              <strong className="text-base sm:text-lg font-black tracking-tight text-zinc-950 dark:text-white block">
                {MONTH_NAMES[monthIndex]} {year}
              </strong>
            </div>
            <button
              type="button"
              onClick={onNextMonth}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center font-bold text-zinc-800 dark:text-zinc-200 transition-all ios-tap"
              aria-label="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Segmented Filter Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-[18px] border border-black/[0.04] dark:border-white/[0.06]">
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
                  className={`min-w-0 py-2 px-1 sm:px-2 rounded-[14px] text-[11px] sm:text-xs font-black capitalize transition-all duration-150 ios-tap flex items-center justify-center ${
                    isActive
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] z-10'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10.5px] font-bold text-zinc-500 dark:text-zinc-400 block">Habit Rate</span>
              <strong className="text-2xl font-black text-zinc-950 dark:text-white block">
                {overallMonthPercent}%
              </strong>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block truncate">
                {actualHabitChecks} / {totalPossibleChecks} checks
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10.5px] font-bold text-zinc-500 dark:text-zinc-400 block">Avg Mood</span>
              <strong className="text-2xl font-black text-zinc-950 dark:text-white block">
                {avgMoodStr} <span className="text-xs text-zinc-400 font-bold">/ 5</span>
              </strong>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block truncate">
                {recordedMoodsCount} days recorded
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10.5px] font-bold text-zinc-500 dark:text-zinc-400 block">Active Projects</span>
              <strong className="text-2xl font-black text-zinc-950 dark:text-white block">
                {activeProjects.length}
              </strong>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block truncate">
                {totalProjectMonthChecks} check-ins
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10.5px] font-bold text-zinc-500 dark:text-zinc-400 block">Focus Time</span>
              <strong className="text-2xl font-black text-zinc-950 dark:text-white block">
                {totalFocusHours}h
              </strong>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block truncate">
                {monthSessions.length} sessions logged
              </span>
            </div>
          </div>

          {/* Combined Interactive Momentum Curve */}
          <div className="ios-glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm tracking-tight text-zinc-950 dark:text-white">
                Interactive Habit, Mood & Focus Flow
              </h3>
              <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
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
            <div className="ios-glass-card p-4 space-y-2">
              <div className="text-xs font-black text-zinc-950 dark:text-white">
                <span>Top Habit this Month</span>
              </div>
              <p className="text-sm font-black text-zinc-950 dark:text-white truncate">
                {bestHabitName}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {bestHabitCount > 0 ? `Completed on ${bestHabitCount} days (${Math.round((bestHabitCount / daysInMonth) * 100)}%)` : 'No checks logged yet'}
              </p>
            </div>

            <div className="ios-glass-card p-4 space-y-2">
              <div className="text-xs font-black text-zinc-950 dark:text-white">
                <span>Mood Balance</span>
              </div>
              <p className="text-sm font-black text-zinc-950 dark:text-white flex items-center gap-1.5">
                {dominantMoodObj ? (
                  <span>Mostly {dominantMoodObj.label}</span>
                ) : (
                  <span>No mood entries yet</span>
                )}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
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
          <div className="grid grid-cols-3 gap-3">
            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Overall Rate</span>
              <strong className="text-2xl font-black text-zinc-950 dark:text-white block">
                {overallMonthPercent}%
              </strong>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block truncate">
                {actualHabitChecks} checks
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Active Habits</span>
              <strong className="text-2xl font-black text-zinc-950 dark:text-white block">
                {activeOrTrackedHabits.length}
              </strong>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block truncate">
                tracked this month
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Top Habit</span>
              <strong className="text-sm font-black text-zinc-950 dark:text-white block truncate mt-1">
                {bestHabitName}
              </strong>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block truncate">
                {bestHabitCount > 0 ? `${bestHabitCount} days` : '—'}
              </span>
            </div>
          </div>

          {/* Interactive Leaderboard & Performance Chart */}
          <div className="ios-glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm tracking-tight text-zinc-950 dark:text-white">
                Habit Consistency & Performance
              </h3>
              <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                Tap habit to inspect activity
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
          <div className="grid grid-cols-3 gap-3">
            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Avg Mood Score</span>
              <strong className="text-2xl font-black text-zinc-950 dark:text-white block">
                {avgMoodStr} <span className="text-xs text-zinc-400 font-bold">/ 5</span>
              </strong>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block truncate">
                {recordedMoodsCount} days logged
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Positivity Rate</span>
              <strong className="text-2xl font-black text-zinc-950 dark:text-white block">
                {positivityRate}%
              </strong>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block truncate">
                Rad & Good days
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Dominant Mood</span>
              <div className="flex items-center gap-1.5 mt-1">
                {dominantMoodObj ? (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black border ${dominantMoodObj.bgLight} ${dominantMoodObj.bgDark} ${dominantMoodObj.borderLight} ${dominantMoodObj.borderDark} ${dominantMoodObj.textColorLight} ${dominantMoodObj.textColorDark}`}>
                    <FrogMoodIcon value={dominantMoodObj.value} size={15} />
                    <span>{dominantMoodObj.label}</span>
                  </span>
                ) : (
                  <strong className="text-xs font-black text-zinc-950 dark:text-white">None</strong>
                )}
              </div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block truncate">
                {maxMoodCount > 0 ? `${maxMoodCount} days` : 'No logs'}
              </span>
            </div>
          </div>

          {/* Interactive Mood Trend & Flow Curve */}
          <div className="ios-glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm tracking-tight text-zinc-950 dark:text-white">
                Monthly Mood Trend & Flow
              </h3>
              <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
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
          <div className="ios-glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm tracking-tight text-zinc-950 dark:text-white">
                Monthly Mood Calendar
              </h3>
              <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                {MONTH_NAMES[monthIndex]} {year}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {CALENDAR_HEADER_DAYS.map((d) => (
                <span key={d} className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 py-1">
                  {d}
                </span>
              ))}

              {/* Offset for first day of month */}
              {Array.from({ length: new Date(year, monthIndex, 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dayNum = i + 1;
                const moodVal = monthData.moods[i];
                const moodObj = moodVal ? MOOD_LEVELS.find((m) => m.value === moodVal) : null;
                return (
                  <div
                    key={dayNum}
                    className={`h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all border ${
                      moodObj
                        ? `${moodObj.bgLight} ${moodObj.bgDark} ${moodObj.borderLight} ${moodObj.borderDark} shadow-2xs`
                        : 'bg-zinc-100 dark:bg-zinc-800/50 border-transparent text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {moodObj ? (
                      <div className="flex items-center justify-center" title={`Day ${dayNum}: ${moodObj.label}`}>
                        <FrogMoodIcon value={moodObj.value} size={18} />
                      </div>
                    ) : (
                      <span className="text-[10px] opacity-60 font-medium">{dayNum}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Habit & Mood Correlation Card */}
          <div className="ios-glass-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-zinc-950 dark:text-white">
              <Heart size={16} className="text-[#FF2D55]" />
              <span>Habit & Mood Synergy</span>
            </div>
            {positiveDayAvgHabitRate !== null && normalDayAvgHabitRate !== null ? (
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                On <strong className="text-[#007AFF]">Rad/Good</strong> mood days, your habit completion was{' '}
                <strong className="text-[#007AFF]">{positiveDayAvgHabitRate}%</strong>, compared to{' '}
                <strong className="text-zinc-500">{normalDayAvgHabitRate}%</strong> on lower mood days.
              </p>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
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
          <div className="grid grid-cols-3 gap-3">
            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Active Projects</span>
              <strong className="text-2xl font-black text-zinc-950 dark:text-white block">
                {activeProjects.length}
              </strong>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block truncate">
                in progress
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Completed</span>
              <strong className="text-2xl font-black text-zinc-950 dark:text-white block">
                {completedProjects.length}
              </strong>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block truncate">
                milestones reached
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Total Check-ins</span>
              <strong className="text-2xl font-black text-zinc-950 dark:text-white block">
                {totalProjectMonthChecks}
              </strong>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block truncate">
                this month
              </span>
            </div>
          </div>

          {/* Project by Project In-Depth Breakdown */}
          <div className="ios-glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm tracking-tight text-zinc-950 dark:text-white">
                Projects Progress & Weekly Adherence
              </h3>
              <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                {activeOrTrackedProjects.length} Projects Tracked
              </span>
            </div>

            {activeOrTrackedProjects.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
                No active projects tracked for {MONTH_NAMES[monthIndex]} {year}.
              </div>
            ) : (
              <div className="space-y-3">
                {activeOrTrackedProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BambooProjectDockIcon size={16} className="text-[#FF9500]" />
                        <strong className="text-sm font-black text-zinc-950 dark:text-white">{p.name}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          p.completed
                            ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}>
                          {p.completed ? 'Completed' : p.priority}
                        </span>
                        <span className="text-xs font-black text-[#007AFF]">
                          {p.goalAdherence}% Goal Met
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-950 dark:bg-white rounded-full transition-all duration-500"
                        style={{ width: `${p.goalAdherence}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                      <span>Goal: {p.goal} days/week</span>
                      <span className="font-bold text-zinc-950 dark:text-white">
                        {p.monthChecks} check-ins across {p.totalWeeks} weeks
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
