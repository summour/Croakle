import React, { useState, useRef } from 'react';
import { HabitTemplate, MonthData, TimeSession, MOOD_LEVELS } from '../../types';
import { MONTH_NAMES, DAY_SHORT_NAMES } from '../../utils/dateUtils';
import { FrogMoodIcon, CloverIcon, PocketTimerDockIcon } from '../FrogIcons';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { soundEngine, triggerHaptic } from '../../utils/audioUtils';

interface InteractiveMomentumChartProps {
  year: number;
  monthIndex: number;
  habits: HabitTemplate[];
  monthData: MonthData;
  sessions?: TimeSession[];
  onSelectDay?: (dayNumber: number) => void;
}

export const InteractiveMomentumChart: React.FC<InteractiveMomentumChartProps> = ({
  year,
  monthIndex,
  habits,
  monthData,
  sessions = [],
  onSelectDay,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(() => {
    const now = new Date();
    if (now.getFullYear() === year && now.getMonth() === monthIndex) {
      return now.getDate();
    }
    return null;
  });

  const [showHabits, setShowHabits] = useState(true);
  const [showMood, setShowMood] = useState(true);
  const [showFocus, setShowFocus] = useState(true);
  const [showAverage, setShowAverage] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Active / tracked habits
  const activeOrTrackedHabits = habits.filter((h, idx) => {
    const isArchived = Boolean(h.completed);
    const checks = monthData.habits[idx]?.days?.reduce((acc, d) => acc + (d ? 1 : 0), 0) || 0;
    return !isArchived || checks > 0;
  });

  // Calculate daily data
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, monthIndex, day);
    const dayOfWeek = (date.getDay() + 6) % 7; // Mon=0, Sun=6
    const isoString = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Habit completion
    let completedHabitsCount = 0;
    const completedList: string[] = [];
    const missedList: string[] = [];

    activeOrTrackedHabits.forEach((habit) => {
      const origIdx = habits.findIndex((h) => h.id === habit.id);
      const isDone = Boolean(monthData.habits[origIdx]?.days?.[i]);
      if (isDone) {
        completedHabitsCount++;
        completedList.push(habit.name);
      } else {
        missedList.push(habit.name);
      }
    });

    const habitRate = activeOrTrackedHabits.length > 0
      ? Math.round((completedHabitsCount / activeOrTrackedHabits.length) * 100)
      : 0;

    // Mood
    const moodValue = monthData.moods[i] || null;
    const moodObj = moodValue ? MOOD_LEVELS.find((m) => m.value === moodValue) : null;

    // Focus Sessions
    const daySessions = sessions.filter((s) => s.date === isoString);
    const totalFocusMinutes = daySessions.reduce((acc, s) => acc + s.duration, 0);

    return {
      day,
      date,
      dayOfWeek,
      dayName: DAY_SHORT_NAMES[dayOfWeek],
      habitRate,
      completedHabitsCount,
      totalHabitsCount: activeOrTrackedHabits.length,
      completedList,
      missedList,
      moodValue,
      moodObj,
      totalFocusMinutes,
      hasData: habitRate > 0 || moodValue !== null || totalFocusMinutes > 0,
    };
  });

  // Month averages
  const totalChecks = dailyData.reduce((acc, d) => acc + d.completedHabitsCount, 0);
  const possibleChecks = activeOrTrackedHabits.length * daysInMonth;
  const overallMonthRate = possibleChecks > 0 ? Math.round((totalChecks / possibleChecks) * 100) : 0;

  // Max focus minutes for scaling focus bars
  const maxFocusMinutes = Math.max(60, ...dailyData.map((d) => d.totalFocusMinutes));

  // Chart dimensions
  const svgWidth = 720;
  const svgHeight = 180;
  const padLeft = 32;
  const padRight = 32;
  const padTop = 22;
  const padBottom = 28;

  const innerW = svgWidth - padLeft - padRight;
  const innerH = svgHeight - padTop - padBottom;

  const getX = (index: number) => {
    if (daysInMonth <= 1) return padLeft + innerW / 2;
    return padLeft + (index / (daysInMonth - 1)) * innerW;
  };

  const getYHabit = (rate: number) => {
    return padTop + innerH - (rate / 100) * innerH;
  };

  const getYMood = (val: number) => {
    const normalized = (val - 1) / 4;
    return padTop + innerH - normalized * innerH;
  };

  // Build Mood Path for valid points
  const validMoodPoints = dailyData
    .map((d, i) => ({
      x: getX(i),
      y: d.moodValue !== null ? getYMood(d.moodValue) : null,
      ...d,
    }))
    .filter((p): p is typeof p & { y: number; moodValue: number } => p.y !== null);

  const moodLinePath = validMoodPoints.length > 1
    ? `M ${validMoodPoints[0].x} ${validMoodPoints[0].y} ` + validMoodPoints.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ')
    : '';

  // Build Habit Path
  const habitPoints = dailyData.map((d, i) => ({
    x: getX(i),
    y: getYHabit(d.habitRate),
    ...d,
  }));

  const habitLinePath = habitPoints.length > 0
    ? `M ${habitPoints[0].x} ${habitPoints[0].y} ` + habitPoints.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const habitAreaPath = habitPoints.length > 0
    ? `${habitLinePath} L ${habitPoints[habitPoints.length - 1].x} ${padTop + innerH} L ${habitPoints[0].x} ${padTop + innerH} Z`
    : '';

  const avgY = getYHabit(overallMonthRate);

  // Handle Chart Interaction
  const handleSvgPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const relativeX = (clientX / rect.width) * svgWidth;

    let closestIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < daysInMonth; i++) {
      const x = getX(i);
      const diff = Math.abs(x - relativeX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    const targetDay = closestIndex + 1;
    if (selectedDay !== targetDay) {
      setSelectedDay(targetDay);
      soundEngine.playTapSound();
      triggerHaptic();
      onSelectDay?.(targetDay);
    }
  };

  const selectedData = selectedDay ? dailyData[selectedDay - 1] : null;

  return (
    <div className="space-y-3 select-none">
      {/* Chart Interactive Controls & Minimalist Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowHabits(!showHabits)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all ios-tap border ${
              showHabits
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-black/[0.02] dark:bg-white/[0.03] border-transparent text-zinc-400 dark:text-zinc-500 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Habits</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMood(!showMood)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all ios-tap border ${
              showMood
                ? 'bg-pink-500/10 border-pink-500/30 text-pink-700 dark:text-pink-300'
                : 'bg-black/[0.02] dark:bg-white/[0.03] border-transparent text-zinc-400 dark:text-zinc-500 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FF2A85]" />
            <span>Mood</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFocus(!showFocus)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all ios-tap border ${
              showFocus
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300'
                : 'bg-black/[0.02] dark:bg-white/[0.03] border-transparent text-zinc-400 dark:text-zinc-500 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-xs bg-[#007AFF]" />
            <span>Focus</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAverage(!showAverage)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all ios-tap border ${
              showAverage
                ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                : 'bg-black/[0.02] dark:bg-white/[0.03] border-transparent text-zinc-400 dark:text-zinc-500 opacity-60'
            }`}
          >
            <span className="w-2 h-0.5 bg-zinc-500 dark:bg-zinc-400 rounded-full" />
            <span>Avg {overallMonthRate}%</span>
          </button>
        </div>

        {/* Minimal Stepper */}
        {selectedDay && (
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-full border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200">
            <button
              type="button"
              onClick={() => {
                const next = Math.max(1, selectedDay - 1);
                setSelectedDay(next);
                soundEngine.playTapSound();
              }}
              disabled={selectedDay <= 1}
              className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 transition"
              title="Previous Day"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-[11px] font-bold px-1.5 tabular-nums text-zinc-800 dark:text-zinc-200">
              Day {selectedDay}
            </span>
            <button
              type="button"
              onClick={() => {
                const next = Math.min(daysInMonth, selectedDay + 1);
                setSelectedDay(next);
                soundEngine.playTapSound();
              }}
              disabled={selectedDay >= daysInMonth}
              className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 transition"
              title="Next Day"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Main SVG Flow Canvas */}
      <div
        ref={containerRef}
        className="relative w-full rounded-[22px] bg-black/[0.02] dark:bg-white/[0.02] p-3 border border-black/[0.04] dark:border-white/[0.05] overflow-hidden cursor-crosshair touch-none"
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-36 sm:h-44 overflow-visible"
          onPointerDown={handleSvgPointer}
          onPointerMove={(e) => {
            if (e.buttons === 1) handleSvgPointer(e);
          }}
        >
          <defs>
            <linearGradient id="momentumHabitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
            </linearGradient>

            <linearGradient id="momentumFocusGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#007AFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#007AFF" stopOpacity="0.06" />
            </linearGradient>

            {/* Neon Mood Glow Filter */}
            <filter id="neonMoodGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Vibrant Neon Mood Line Gradient */}
            <linearGradient id="neonMoodLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B026FF" />
              <stop offset="25%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#00E676" />
              <stop offset="75%" stopColor="#FF2A85" />
              <stop offset="100%" stopColor="#FFE500" />
            </linearGradient>
          </defs>

          {/* Minimalist Grid lines */}
          {[100, 50, 0].map((pct) => {
            const y = getYHabit(pct);
            return (
              <g key={pct}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-black/[0.04] dark:text-white/[0.05]"
                  strokeDasharray={pct === 0 ? undefined : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[8.5px] font-semibold fill-[#8c7e70] dark:fill-[#a89b8d]"
                >
                  {pct}%
                </text>
              </g>
            );
          })}

          {/* Monthly Average Benchmark Line */}
          {showAverage && overallMonthRate > 0 && (
            <g>
              <line
                x1={padLeft}
                y1={avgY}
                x2={svgWidth - padRight}
                y2={avgY}
                stroke="#10B981"
                strokeOpacity="0.6"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
            </g>
          )}

          {/* Focus Background Bars */}
          {showFocus &&
            dailyData.map((d, i) => {
              if (d.totalFocusMinutes <= 0) return null;
              const x = getX(i);
              const barH = (d.totalFocusMinutes / maxFocusMinutes) * (innerH * 0.7);
              const barY = padTop + innerH - barH;
              const barW = Math.max(4, innerW / (daysInMonth * 2.4));
              return (
                <rect
                  key={`focus-${d.day}`}
                  x={x - barW / 2}
                  y={barY}
                  width={barW}
                  height={barH}
                  rx={2}
                  fill="url(#momentumFocusGrad)"
                />
              );
            })}

          {/* Habit Area Fill */}
          {showHabits && habitAreaPath && (
            <path d={habitAreaPath} fill="url(#momentumHabitGrad)" />
          )}

          {/* Habit Smooth Line */}
          {showHabits && habitLinePath && (
            <path
              d={habitLinePath}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Mood Neon Connecting Line */}
          {showMood && moodLinePath && (
            <>
              <path
                d={moodLinePath}
                fill="none"
                stroke="url(#neonMoodLineGrad)"
                strokeWidth="3.5"
                strokeOpacity="0.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#neonMoodGlow)"
              />
              <path
                d={moodLinePath}
                fill="none"
                stroke="url(#neonMoodLineGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Mood Neon Points */}
          {showMood &&
            dailyData.map((d, i) => {
              if (!d.moodValue || !d.moodObj) return null;
              const x = getX(i);
              const y = getYMood(d.moodValue);
              const isSelected = selectedDay === d.day;
              return (
                <g key={`mood-point-${d.day}`}>
                  {/* Subtle glowing halo */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 9 : 6}
                    fill={d.moodObj.color}
                    fillOpacity={isSelected ? 0.45 : 0.25}
                    filter="url(#neonMoodGlow)"
                  />
                  {/* Core neon point */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 5.5 : 3.8}
                    fill={d.moodObj.color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2.2 : 1.2}
                    className="transition-all"
                  />
                </g>
              );
            })}

          {/* Habit Points */}
          {showHabits &&
            habitPoints.map((p) => {
              if (p.habitRate === 0 && !p.hasData) return null;
              const isSelected = selectedDay === p.day;
              return (
                <circle
                  key={`habit-point-${p.day}`}
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? 5 : 2.5}
                  fill="#ffffff"
                  stroke="#5f7a61"
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-all"
                />
              );
            })}

          {/* Crosshair & Active Day Indicator */}
          {selectedDay && (
            <g>
              {(() => {
                const selX = getX(selectedDay - 1);
                return (
                  <>
                    <line
                      x1={selX}
                      y1={padTop - 4}
                      x2={selX}
                      y2={padTop + innerH}
                      stroke="currentColor"
                      className="text-[#2d2823]/30 dark:text-[#f4efe8]/40"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                    />

                    {/* Day Pill */}
                    <rect
                      x={selX - 12}
                      y={padTop + innerH + 3}
                      width={24}
                      height={16}
                      rx={5}
                      className="fill-[#2d2823] dark:fill-[#f4efe8]"
                    />
                    <text
                      x={selX}
                      y={padTop + innerH + 14.5}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-[#f4efe8] dark:fill-[#2d2823]"
                    >
                      {selectedDay}
                    </text>
                  </>
                );
              })()}
            </g>
          )}

          {/* Day Numbers on X-Axis */}
          {dailyData.map((d, i) => {
            if (d.day % 5 !== 0 && d.day !== 1 && d.day !== daysInMonth) return null;
            const x = getX(i);
            if (selectedDay === d.day) return null;

            return (
              <text
                key={`day-num-${d.day}`}
                x={x}
                y={padTop + innerH + 13}
                textAnchor="middle"
                className="text-[9px] font-medium fill-[#8c7e70] dark:fill-[#a89b8d]"
              >
                {d.day}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Selected Day Inspector Card */}
      {selectedData && (
        <div className="rounded-[20px] bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] p-3.5 space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.05]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[10px] bg-[#5f7a61]/12 dark:bg-[#7d9d80]/20 flex items-center justify-center font-bold text-xs text-[#455c47] dark:text-[#8fc493]">
                {selectedData.day}
              </div>
              <div>
                <strong className="text-xs font-bold text-[#2d2823] dark:text-[#f4efe8] block leading-tight">
                  {selectedData.dayName}, {MONTH_NAMES[monthIndex]} {selectedData.day}, {year}
                </strong>
              </div>
            </div>

            {/* Metric chips */}
            <div className="flex items-center gap-2">
              {selectedData.moodObj && (
                <div
                  className="px-2.5 py-0.5 rounded-full flex items-center gap-1.5 text-[11px] font-bold border transition-all"
                  style={{
                    backgroundColor: `${selectedData.moodObj.color}15`,
                    borderColor: `${selectedData.moodObj.color}40`,
                    color: selectedData.moodObj.color,
                    boxShadow: `0 0 10px ${selectedData.moodObj.color}25`,
                  }}
                >
                  <FrogMoodIcon value={selectedData.moodObj.value} size={14} />
                  <span>{selectedData.moodObj.label}</span>
                </div>
              )}

              <div className="px-2 py-0.5 rounded-full bg-[#5f7a61]/10 text-[#5f7a61] dark:text-[#8fc493] text-[11px] font-bold border border-[#5f7a61]/20">
                {selectedData.habitRate}%
              </div>
            </div>
          </div>

          {/* Habit & Focus Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Habits list */}
            <div className="p-2.5 rounded-[14px] bg-white/60 dark:bg-black/20 border border-black/[0.03] dark:border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between text-[10.5px] font-medium text-[#8c7e70] dark:text-[#a89b8d]">
                <span className="font-bold">
                  Habits ({selectedData.completedHabitsCount}/{selectedData.totalHabitsCount})
                </span>
                {selectedData.completedHabitsCount === selectedData.totalHabitsCount && selectedData.totalHabitsCount > 0 && (
                  <span className="text-[#5f7a61] dark:text-[#8fc493] font-semibold">100% Done</span>
                )}
              </div>

              {selectedData.completedList.length > 0 || selectedData.missedList.length > 0 ? (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {selectedData.completedList.map((hName) => (
                    <span
                      key={hName}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#5f7a61]/10 text-[#3e5640] dark:text-[#8fc493] text-[10px] font-medium"
                    >
                      <CheckCircle size={9} className="text-[#5f7a61]" />
                      <span className="truncate max-w-[110px]">{hName}</span>
                    </span>
                  ))}
                  {selectedData.missedList.map((hName) => (
                    <span
                      key={hName}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/[0.03] dark:bg-white/[0.04] text-[#8c7e70] dark:text-[#a89b8d] text-[10px]"
                    >
                      <XCircle size={9} className="opacity-40" />
                      <span className="truncate max-w-[110px]">{hName}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10.5px] text-[#8c7e70] dark:text-[#a89b8d]">
                  No habits tracked for this day.
                </p>
              )}
            </div>

            {/* Focus time */}
            <div className="p-2.5 rounded-[14px] bg-white/60 dark:bg-black/20 border border-black/[0.03] dark:border-white/[0.04] flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">
                Focus Duration
              </span>
              <strong className="text-xs font-bold text-[#c28f3a]">
                {selectedData.totalFocusMinutes > 0
                  ? `${Math.floor(selectedData.totalFocusMinutes / 60)}h ${selectedData.totalFocusMinutes % 60}m`
                  : '0m'}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
