import React, { useState } from 'react';
import { PageType, HabitTemplate, MonthData, Project, NoteItem, TimeSession, MOOD_LEVELS } from '../types';
import { MONTH_NAMES, CALENDAR_HEADER_DAYS, DAY_SHORT_NAMES, getDaysInMonth, getMonthWeeks, formatIsoDate } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, CheckCircle2, Trophy, Sparkles, TrendingUp, Calendar, Clock, BookOpen, Flame, Heart } from 'lucide-react';
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
  // Habit Calculations
  // ----------------------------------------------------
  const dailyHabitRates = Array.from({ length: daysInMonth }, (_, dayIdx) => {
    if (habits.length === 0) return 0;
    const completed = monthData.habits.reduce((acc, h) => acc + (h.days[dayIdx] ? 1 : 0), 0);
    return Math.round((completed / habits.length) * 100);
  });

  const totalPossibleChecks = habits.length * daysInMonth;
  const actualHabitChecks = monthData.habits.reduce(
    (acc, h) => acc + (h.days ? h.days.reduce((dAcc, d) => dAcc + (d ? 1 : 0), 0) : 0),
    0
  );
  const overallMonthPercent = totalPossibleChecks > 0 ? Math.round((actualHabitChecks / totalPossibleChecks) * 100) : 0;

  // Best Habit
  let bestHabitName = 'None';
  let bestHabitCount = -1;
  habits.forEach((h, idx) => {
    const checks = monthData.habits[idx]?.days ? monthData.habits[idx].days.reduce((acc, d) => acc + (d ? 1 : 0), 0) : 0;
    if (checks > bestHabitCount) {
      bestHabitCount = checks;
      bestHabitName = h.name;
    }
  });

  // Weekday Productivity (Monday to Sunday)
  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);
    const dayOfWeek = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    weekdayCounts[dayOfWeek]++;
    const dayChecks = monthData.habits.reduce((acc, h) => acc + (h.days?.[day - 1] ? 1 : 0), 0);
    weekdayTotals[dayOfWeek] += dayChecks;
  }
  const weekdayRates = weekdayTotals.map((tot, i) => {
    const possible = habits.length * Math.max(1, weekdayCounts[i]);
    return possible > 0 ? Math.round((tot / possible) * 100) : 0;
  });

  // Weekly Habit Adherence
  const weeklyHabitRates = monthWeeks.map((week) => {
    let weekPossible = 0;
    let weekActual = 0;
    week.days.forEach((d) => {
      if (d.inMonth) {
        weekPossible += habits.length;
        weekActual += monthData.habits.reduce((acc, h) => acc + (h.days?.[d.dayOfMonth - 1] ? 1 : 0), 0);
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
    const checks = monthData.habits.reduce((acc, h) => acc + (h.days?.[day - 1] ? 1 : 0), 0);
    if (mood && mood >= 4) {
      positiveDayHabitChecks += checks;
      positiveDayCount++;
    } else if (mood && mood < 4) {
      normalDayHabitChecks += checks;
      normalDayCount++;
    }
  }

  const positiveDayAvgHabitRate = positiveDayCount > 0 && habits.length > 0
    ? Math.round((positiveDayHabitChecks / (positiveDayCount * habits.length)) * 100)
    : null;
  const normalDayAvgHabitRate = normalDayCount > 0 && habits.length > 0
    ? Math.round((normalDayHabitChecks / (normalDayCount * habits.length)) * 100)
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
    };
  });

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
    <div className="space-y-4 pb-24" {...swipeHandlers}>
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
      <div className="sticky top-0 z-20 bg-[#fdfbf7]/90 dark:bg-[#161311]/90 backdrop-blur-2xl pt-1 pb-1 space-y-3">
        <div className="ios-glass-card p-3.5 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onPrevMonth}
              className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.15] flex items-center justify-center font-bold text-[#4a4036] dark:text-[#e0d6cb] transition-all ios-tap"
              aria-label="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8c7e70] dark:text-[#a89b8d]">
                Journey Analytics
              </p>
              <strong className="text-base sm:text-lg font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8] block">
                {MONTH_NAMES[monthIndex]} {year}
              </strong>
            </div>
            <button
              type="button"
              onClick={onNextMonth}
              className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.15] flex items-center justify-center font-bold text-[#4a4036] dark:text-[#e0d6cb] transition-all ios-tap"
              aria-label="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Segmented Filter Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-black/[0.04] dark:bg-white/[0.06] rounded-[18px] border border-black/[0.03] dark:border-white/[0.04]">
            {(
              [
                { id: 'overview', label: 'Overview', icon: <ToriiStatsDockIcon size={13} className="shrink-0" /> },
                { id: 'habits', label: 'Habits', icon: <HabitCloverDockIcon size={13} className="shrink-0" /> },
                { id: 'moods', label: 'Moods', icon: <FrogFaceDockIcon size={13} className="shrink-0" /> },
                { id: 'projects', label: 'Projects', icon: <BambooProjectDockIcon size={13} className="shrink-0" /> },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-w-0 py-1.5 px-1 sm:px-2 rounded-[14px] text-[11px] sm:text-xs font-black capitalize transition-all duration-150 ios-tap flex items-center justify-center gap-1 ${
                    isActive
                      ? 'bg-white dark:bg-[#28231d] text-[#2d2823] dark:text-[#f4efe8] shadow-[0_2px_6px_rgba(0,0,0,0.08)] z-10'
                      : 'text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823] dark:hover:text-[#f4efe8]'
                  }`}
                >
                  {tab.icon}
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
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Habit Rate</span>
                <CloverIcon size={15} />
              </div>
              <strong className="text-2xl font-black text-[#5f7a61] dark:text-[#7d9d80] block">
                {overallMonthPercent}%
              </strong>
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] block truncate">
                {actualHabitChecks} / {totalPossibleChecks} checks
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Avg Mood</span>
                <FrogMoodIcon value={4} size={15} />
              </div>
              <strong className="text-2xl font-black text-[#b86f52] dark:text-[#d68767] block">
                {avgMoodStr} <span className="text-xs text-[#8c7e70] font-bold">/ 5</span>
              </strong>
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] block truncate">
                {recordedMoodsCount} days recorded
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Active Projects</span>
                <BambooScrollDockIcon size={15} className="text-[#849b5c]" />
              </div>
              <strong className="text-2xl font-black text-[#2d2823] dark:text-[#f4efe8] block">
                {activeProjects.length}
              </strong>
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] block truncate">
                {totalProjectMonthChecks} check-ins
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Focus Time</span>
                <PocketTimerDockIcon size={15} className="text-[#c28f3a]" />
              </div>
              <strong className="text-2xl font-black text-[#c28f3a] block">
                {totalFocusHours}h
              </strong>
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] block truncate">
                {monthSessions.length} sessions logged
              </span>
            </div>
          </div>

          {/* Combined Momentum Curve */}
          <div className="ios-glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ToriiStatsDockIcon size={18} className="text-[#5f7a61]" />
                <h3 className="font-black text-sm tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
                  Monthly Habit & Mood Flow
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">
                {MONTH_NAMES[monthIndex]} 1–{daysInMonth}
              </span>
            </div>

            {actualHabitChecks === 0 && recordedMoodsCount === 0 ? (
              <div className="py-8 text-center space-y-2 bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl border border-dashed border-black/[0.08] dark:border-white/[0.08]">
                <p className="text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d]">
                  No habit or mood records yet for {MONTH_NAMES[monthIndex]} {year}.
                </p>
                <p className="text-[11px] text-[#a89b8d] dark:text-[#706456]">
                  Check off habits in the Habits tab or log your daily mood to generate your momentum graph.
                </p>
              </div>
            ) : (
              <div className="w-full overflow-hidden rounded-[18px] bg-black/[0.02] dark:bg-white/[0.02] p-2 border border-black/[0.04] dark:border-white/[0.06]">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-36 sm:h-40">
                  {/* Grid Guidelines */}
                  <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="currentColor" className="text-[#ebdccb]/50 dark:text-[#383129]" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1={paddingX} y1={paddingY + innerHeight / 2} x2={svgWidth - paddingX} y2={paddingY + innerHeight / 2} stroke="currentColor" className="text-[#ebdccb]/50 dark:text-[#383129]" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="currentColor" className="text-[#ebdccb]/80 dark:text-[#383129]" strokeWidth="1.5" />

                  {/* Area fill under habit curve */}
                  {areaPath && <path d={areaPath} fill="#5f7a61" fillOpacity="0.14" />}

                  {/* Habit line curve */}
                  {linePath && <path d={linePath} fill="none" stroke="#5f7a61" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                  {/* Data Points */}
                  {points.map((p) => {
                    if (p.rate === 0 && !p.mood) return null;
                    return (
                      <g key={p.day}>
                        {p.rate > 0 && (
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="3"
                            fill="#ffffff"
                            stroke="#5f7a61"
                            strokeWidth="2"
                          >
                            <title>Day {p.day}: {p.rate}% Habits</title>
                          </circle>
                        )}
                        {p.mood && (
                          <circle
                            cx={p.x}
                            cy={paddingY + innerHeight - ((p.mood - 1) / 4) * innerHeight}
                            r="2.5"
                            fill="#d98236"
                          >
                            <title>Day {p.day}: Mood {p.mood}/5</title>
                          </circle>
                        )}
                      </g>
                    );
                  })}
                </svg>
                <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-1 bg-[#5f7a61] rounded-full inline-block" /> Habit Completion %
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#d98236] rounded-full inline-block" /> Mood Rating (1-5)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Weekday Productivity Heatmap */}
          <div className="ios-glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
                Weekday Habit Consistency
              </h3>
              <span className="text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Mon – Sun</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {DAY_SHORT_NAMES.map((name, i) => {
                const rate = weekdayRates[i];
                return (
                  <div key={name} className="flex flex-col items-center gap-1.5">
                    <div className="w-full bg-[#f5efe6] dark:bg-[#282420] h-20 rounded-xl flex flex-col justify-end p-1 overflow-hidden border border-black/[0.04] dark:border-white/[0.06]">
                      <div
                        className="w-full rounded-lg transition-all duration-500 bg-[#5f7a61] dark:bg-[#7d9d80]"
                        style={{ height: `${Math.max(6, rate)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-black text-[#2d2823] dark:text-[#f4efe8]">{name}</span>
                    <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">{rate}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Highlights Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="ios-glass-card p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#2d2823] dark:text-[#f4efe8]">
                <Trophy size={16} className="text-[#c28f3a]" />
                <span>Top Habit this Month</span>
              </div>
              <p className="text-sm font-black text-[#5f7a61] dark:text-[#7d9d80] truncate">
                {bestHabitName}
              </p>
              <p className="text-xs text-[#8c7e70] dark:text-[#a89b8d]">
                {bestHabitCount > 0 ? `Completed on ${bestHabitCount} days (${Math.round((bestHabitCount / daysInMonth) * 100)}%)` : 'No checks logged yet'}
              </p>
            </div>

            <div className="ios-glass-card p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#2d2823] dark:text-[#f4efe8]">
                <Sparkles size={16} className="text-[#b86f52]" />
                <span>Mood Balance</span>
              </div>
              <p className="text-sm font-black text-[#2d2823] dark:text-[#f4efe8] flex items-center gap-1.5">
                {dominantMoodObj ? (
                  <>
                    <span>{dominantMoodObj.emoji}</span>
                    <span>Mostly {dominantMoodObj.label}</span>
                  </>
                ) : (
                  <span>No mood entries yet</span>
                )}
              </p>
              <p className="text-xs text-[#8c7e70] dark:text-[#a89b8d]">
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
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Overall Rate</span>
              <strong className="text-2xl font-black text-[#5f7a61] dark:text-[#7d9d80] block">
                {overallMonthPercent}%
              </strong>
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] block truncate">
                {actualHabitChecks} checks
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Active Habits</span>
              <strong className="text-2xl font-black text-[#2d2823] dark:text-[#f4efe8] block">
                {habits.length}
              </strong>
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] block truncate">
                templates tracked
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Top Habit</span>
              <strong className="text-sm font-black text-[#5f7a61] dark:text-[#7d9d80] block truncate mt-1">
                {bestHabitName}
              </strong>
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] block truncate">
                {bestHabitCount > 0 ? `${bestHabitCount} days` : '—'}
              </span>
            </div>
          </div>

          {/* Weekly Adherence Breakdown */}
          <div className="ios-glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
                Weekly Completion Rates
              </h3>
              <span className="text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">
                {monthWeeks.length} Weeks
              </span>
            </div>

            <div className="space-y-2.5">
              {weeklyHabitRates.map((wk, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#2d2823] dark:text-[#f4efe8]">
                      {wk.label} <span className="text-[10px] font-normal text-[#8c7e70]">({wk.range})</span>
                    </span>
                    <span className="text-[#5f7a61] dark:text-[#7d9d80] font-black">{wk.rate}%</span>
                  </div>
                  <div className="w-full bg-[#f5efe6] dark:bg-[#282420] h-2 rounded-full overflow-hidden border border-black/[0.04] dark:border-white/[0.06]">
                    <div
                      className="h-full bg-[#5f7a61] dark:bg-[#7d9d80] rounded-full transition-all duration-500"
                      style={{ width: `${wk.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Habit by Habit Detailed Cards */}
          <div className="ios-glass-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
                Detailed Habit Performance
              </h3>
              <span className="text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">{habits.length} Habits</span>
            </div>

            <div className="space-y-3">
              {habits.map((habit, idx) => {
                const habitData = monthData.habits[idx];
                const days = habitData?.days || [];
                const checks = days.reduce((acc, d) => acc + (d ? 1 : 0), 0);
                const percent = daysInMonth > 0 ? Math.round((checks / daysInMonth) * 100) : 0;

                return (
                  <div
                    key={habit.id}
                    className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#5f7a61]" />
                        <strong className="text-sm font-black text-[#2d2823] dark:text-[#f4efe8]">{habit.name}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#f5efe6] dark:bg-[#282420] text-[#8c7e70] dark:text-[#a89b8d]">
                          {habit.priority}
                        </span>
                        <span className="text-xs font-black text-[#5f7a61] dark:text-[#7d9d80]">{percent}%</span>
                      </div>
                    </div>

                    <div className="w-full bg-[#f5efe6] dark:bg-[#282420] h-2 rounded-full overflow-hidden border border-black/[0.04] dark:border-white/[0.06]">
                      <div
                        className="h-full bg-[#5f7a61] dark:bg-[#7d9d80] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Mini Day Dots Strip (1..31) */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
                        {Array.from({ length: daysInMonth }, (_, dayI) => {
                          const isDone = !!days[dayI];
                          return (
                            <span
                              key={dayI}
                              title={`Day ${dayI + 1}: ${isDone ? 'Done' : 'Missed'}`}
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isDone ? 'bg-[#5f7a61]' : 'bg-black/[0.08] dark:bg-white/[0.1]'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-[10.5px] font-bold text-[#8c7e70] dark:text-[#a89b8d] shrink-0 ml-2">
                        {checks} / {daysInMonth} d
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
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
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Avg Mood Score</span>
              <strong className="text-2xl font-black text-[#b86f52] dark:text-[#d68767] block">
                {avgMoodStr} <span className="text-xs text-[#8c7e70] font-bold">/ 5</span>
              </strong>
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] block truncate">
                {recordedMoodsCount} days logged
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Positivity Rate</span>
              <strong className="text-2xl font-black text-[#5f7a61] dark:text-[#7d9d80] block">
                {positivityRate}%
              </strong>
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] block truncate">
                Rad & Good days
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Dominant Mood</span>
              <div className="flex items-center gap-1.5 mt-1">
                {dominantMoodObj ? (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black border ${dominantMoodObj.bgLight} ${dominantMoodObj.bgDark} ${dominantMoodObj.borderLight} ${dominantMoodObj.borderDark} ${dominantMoodObj.textColorLight} ${dominantMoodObj.textColorDark}`}>
                    <FrogMoodIcon value={dominantMoodObj.value} size={15} />
                    <span>{dominantMoodObj.label}</span>
                  </span>
                ) : (
                  <strong className="text-xs font-black text-[#2d2823] dark:text-[#f4efe8]">None</strong>
                )}
              </div>
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] block truncate">
                {maxMoodCount > 0 ? `${maxMoodCount} days` : 'No logs'}
              </span>
            </div>
          </div>

          {/* Mood Distribution Breakdown */}
          <div className="ios-glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
                Mood Distribution
              </h3>
              <span className="text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">
                {recordedMoodsCount} Total Entries
              </span>
            </div>

            <div className="space-y-2">
              {MOOD_LEVELS.map((ml) => {
                const count = moodCounts[ml.value] || 0;
                const percent = recordedMoodsCount > 0 ? Math.round((count / recordedMoodsCount) * 100) : 0;
                return (
                  <div key={ml.value} className={`p-2 rounded-xl border space-y-1.5 ${ml.bgLight} ${ml.bgDark} ${ml.borderLight} ${ml.borderDark}`}>
                    <div className="flex items-center justify-between text-xs font-black">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${ml.iconBgLight} ${ml.iconBgDark}`}>
                          <FrogMoodIcon value={ml.value} size={16} />
                        </div>
                        <span className={`${ml.textColorLight} ${ml.textColorDark}`}>{ml.label}</span>
                      </div>
                      <span className={`text-[11px] font-black ${ml.textColorLight} ${ml.textColorDark}`}>
                        {count} days ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/60 dark:bg-black/20 h-2 rounded-full overflow-hidden border border-black/[0.04] dark:border-white/[0.06]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: ml.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mood Calendar Matrix */}
          <div className="ios-glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
                Monthly Mood Calendar
              </h3>
              <span className="text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">
                {MONTH_NAMES[monthIndex]} {year}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {CALENDAR_HEADER_DAYS.map((d) => (
                <span key={d} className="text-[10px] font-black text-[#8c7e70] dark:text-[#a89b8d] py-1">
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
                        : 'bg-black/[0.02] dark:bg-white/[0.02] border-transparent text-[#8c7e70] dark:text-[#a89b8d]'
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
            <div className="flex items-center gap-2 text-xs font-black text-[#2d2823] dark:text-[#f4efe8]">
              <Heart size={16} className="text-[#c45a46]" />
              <span>Habit & Mood Synergy</span>
            </div>
            {positiveDayAvgHabitRate !== null && normalDayAvgHabitRate !== null ? (
              <p className="text-xs text-[#4a4036] dark:text-[#d4c8bc] leading-relaxed">
                On <strong className="text-[#5f7a61]">Rad/Good</strong> mood days, your habit completion was{' '}
                <strong className="text-[#5f7a61]">{positiveDayAvgHabitRate}%</strong>, compared to{' '}
                <strong className="text-[#b86f52]">{normalDayAvgHabitRate}%</strong> on lower mood days.
              </p>
            ) : (
              <p className="text-xs text-[#8c7e70] dark:text-[#a89b8d] leading-relaxed">
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
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Active Projects</span>
              <strong className="text-2xl font-black text-[#5f7a61] dark:text-[#7d9d80] block">
                {activeProjects.length}
              </strong>
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] block truncate">
                in progress
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Completed</span>
              <strong className="text-2xl font-black text-[#c28f3a] block">
                {completedProjects.length}
              </strong>
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] block truncate">
                milestones reached
              </span>
            </div>

            <div className="ios-glass-card p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Total Check-ins</span>
              <strong className="text-2xl font-black text-[#2d2823] dark:text-[#f4efe8] block">
                {totalProjectMonthChecks}
              </strong>
              <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] block truncate">
                this month
              </span>
            </div>
          </div>

          {/* Project by Project In-Depth Breakdown */}
          <div className="ios-glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
                Projects Progress & Weekly Adherence
              </h3>
              <span className="text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">
                {projects.length} Total Projects
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8c7e70] dark:text-[#a89b8d]">
                No projects found. Create a project in the Projects tab to start tracking progress.
              </div>
            ) : (
              <div className="space-y-3">
                {projectStats.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BambooProjectDockIcon size={16} className="text-[#b86f52]" />
                        <strong className="text-sm font-black text-[#2d2823] dark:text-[#f4efe8]">{p.name}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          p.completed
                            ? 'bg-[#5f7a61]/15 text-[#5f7a61] dark:bg-[#7d9d80]/20 dark:text-[#7d9d80]'
                            : 'bg-[#f5efe6] dark:bg-[#282420] text-[#8c7e70] dark:text-[#a89b8d]'
                        }`}>
                          {p.completed ? 'Completed' : p.priority}
                        </span>
                        <span className="text-xs font-black text-[#5f7a61] dark:text-[#7d9d80]">
                          {p.goalAdherence}% Goal Met
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-[#f5efe6] dark:bg-[#282420] h-2 rounded-full overflow-hidden border border-black/[0.04] dark:border-white/[0.06]">
                      <div
                        className="h-full bg-[#b86f52] dark:bg-[#d68767] rounded-full transition-all duration-500"
                        style={{ width: `${p.goalAdherence}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#8c7e70] dark:text-[#a89b8d] pt-1">
                      <span>Goal: {p.goal} days/week</span>
                      <span className="font-bold text-[#2d2823] dark:text-[#f4efe8]">
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
