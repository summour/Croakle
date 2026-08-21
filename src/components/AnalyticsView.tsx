import React, { useState } from 'react';
import { PageType, HabitTemplate, MonthData, Project, MOOD_LEVELS } from '../types';
import { MONTH_NAMES, getDaysInMonth } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ToriiStatsDockIcon, EmaTabIcon, FrogMoodIcon, CloverIcon, BambooScrollDockIcon, WoodGearDockIcon } from './FrogIcons';
import { SubNavTabs } from './SubNavTabs';

interface AnalyticsViewProps {
  habits: HabitTemplate[];
  monthData: MonthData;
  projects: Project[];
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
  year,
  monthIndex,
  onPrevMonth,
  onNextMonth,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'habits' | 'moods' | 'projects'>('overview');

  const daysInMonth = getDaysInMonth(year, monthIndex);

  // Daily habit completion rate array (0 to 100 for each day 1..daysInMonth)
  const dailyRates = Array.from({ length: daysInMonth }, (_, dayIdx) => {
    if (habits.length === 0) return 0;
    const completed = monthData.habits.reduce((acc, h) => acc + (h.days[dayIdx] ? 1 : 0), 0);
    return Math.round((completed / habits.length) * 100);
  });

  const totalPossibleChecks = habits.length * daysInMonth;
  const actualChecks = monthData.habits.reduce(
    (acc, h) => acc + h.days.reduce((dAcc, d) => dAcc + (d ? 1 : 0), 0),
    0
  );
  const overallMonthPercent = totalPossibleChecks > 0 ? Math.round((actualChecks / totalPossibleChecks) * 100) : 0;

  // Best Habit
  let bestHabitName = 'None';
  let bestHabitCount = -1;
  habits.forEach((h, idx) => {
    const checks = monthData.habits[idx]?.days.reduce((acc, d) => acc + (d ? 1 : 0), 0) || 0;
    if (checks > bestHabitCount) {
      bestHabitCount = checks;
      bestHabitName = h.name;
    }
  });

  // Mood averages
  const recordedMoods = monthData.moods.filter((m): m is number => m !== null);
  const avgMood = recordedMoods.length > 0
    ? (recordedMoods.reduce((acc, m) => acc + m, 0) / recordedMoods.length).toFixed(1)
    : 'N/A';

  // SVG Line Path Calculation for Daily Habits
  const svgWidth = 600;
  const svgHeight = 160;
  const paddingX = 20;
  const paddingY = 20;
  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingY * 2;

  const points = dailyRates.map((rate, i) => {
    const x = paddingX + (i / Math.max(1, daysInMonth - 1)) * innerWidth;
    const y = paddingY + innerHeight - (rate / 100) * innerHeight;
    return { x, y, rate, day: i + 1 };
  });

  const linePath = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : '';

  return (
    <div className="space-y-4 pb-24">
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
      <div className="sticky top-0 z-20 bg-[#fdfbf7]/90 dark:bg-[#161311]/90 backdrop-blur-xl pt-1 pb-1">
        <div className="ios-glass-card p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onPrevMonth}
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white dark:bg-white/[0.08] dark:hover:bg-white/[0.15] flex items-center justify-center font-bold text-[#4a4036] dark:text-[#e0d6cb] transition border border-black/[0.06] dark:border-white/[0.1] shadow-2xs ios-tap"
              aria-label="Previous Month"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#8c7e70] dark:text-[#a89b8d]">Journey Analytics</p>
              <strong className="text-xl font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8] block">
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

          {/* Filter Navigation Tabs (iOS 26 Segmented Control) */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-black/[0.04] dark:bg-white/[0.06] rounded-[20px] border border-black/[0.04] dark:border-white/[0.06]">
            {(['overview', 'habits', 'moods', 'projects'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 rounded-[16px] text-xs font-extrabold capitalize transition ios-tap ${
                  activeTab === tab
                    ? 'bg-white dark:bg-[#28231d] text-[#2d2823] dark:text-[#f4efe8] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                    : 'text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823] dark:hover:text-[#f4efe8]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="ios-glass-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Monthly Rate</span>
            <CloverIcon size={16} />
          </div>
          <strong className="text-2xl font-black text-[#5f7a61] dark:text-[#7d9d80] block">
            {overallMonthPercent}%
          </strong>
        </div>

        <div className="ios-glass-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Total Done</span>
            <ToriiStatsDockIcon size={16} className="text-[#b86f52]" />
          </div>
          <strong className="text-2xl font-black text-[#2d2823] dark:text-[#f4efe8] block">
            {actualChecks}
          </strong>
        </div>

        <div className="ios-glass-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Avg Mood</span>
            <FrogMoodIcon value={4} size={16} />
          </div>
          <strong className="text-2xl font-black text-[#b86f52] dark:text-[#d68767] block">
            {avgMood} <span className="text-xs text-[#8c7e70]">/ 5</span>
          </strong>
        </div>

        <div className="ios-glass-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">Active Projects</span>
            <BambooScrollDockIcon size={16} className="text-[#849b5c]" />
          </div>
          <strong className="text-2xl font-black text-[#2d2823] dark:text-[#f4efe8] block">
            {projects.filter((p) => !p.completed).length}
          </strong>
        </div>
      </div>

      {/* SVG Completion Curve Chart */}
      <div className="ios-glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ToriiStatsDockIcon size={20} className="text-[#5f7a61] dark:text-[#7d9d80]" />
            <h3 className="font-extrabold text-sm tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
              Daily Habit Completion Curve
            </h3>
          </div>
          <span className="text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d]">{MONTH_NAMES[monthIndex]} 1–{daysInMonth}</span>
        </div>

        <div className="w-full overflow-hidden rounded-[20px] bg-black/[0.02] dark:bg-white/[0.02] p-2 border border-black/[0.04] dark:border-white/[0.06]">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-40">
            {/* Grid lines */}
            <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="currentColor" className="text-[#ebdccb]/60 dark:text-[#383129]" strokeDasharray="3 3" strokeWidth="1" />
            <line x1={paddingX} y1={paddingY + innerHeight / 2} x2={svgWidth - paddingX} y2={paddingY + innerHeight / 2} stroke="currentColor" className="text-[#ebdccb]/60 dark:text-[#383129]" strokeDasharray="3 3" strokeWidth="1" />
            <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="currentColor" className="text-[#ebdccb]/80 dark:text-[#383129]" strokeWidth="1.5" />

            {/* Area Fill */}
            {areaPath && (
              <path d={areaPath} fill="#5f7a61" fillOpacity="0.15" />
            )}

            {/* Curve Line */}
            {linePath && (
              <path d={linePath} fill="none" stroke="#5f7a61" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            )}

            {/* Points */}
            {points.map((p) => (
              <circle
                key={p.day}
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#ffffff"
                stroke="#5f7a61"
                strokeWidth="2"
              >
                <title>Day {p.day}: {p.rate}%</title>
              </circle>
            ))}
          </svg>
        </div>
      </div>

      {/* Individual Habits Performance */}
      <div className="ios-glass-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <EmaTabIcon size={18} />
          <h3 className="font-extrabold text-sm tracking-tight text-[#2d2823] dark:text-[#f2eee9]">
            Habits Breakdown
          </h3>
        </div>

        <div className="space-y-3">
          {habits.map((habit, idx) => {
            const checks = monthData.habits[idx]?.days.reduce((acc, d) => acc + (d ? 1 : 0), 0) || 0;
            const percent = daysInMonth > 0 ? Math.round((checks / daysInMonth) * 100) : 0;

            return (
              <div key={habit.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#2d2823] dark:text-[#f2eee9]">{habit.name}</span>
                  <span className="text-[#8c7e70] dark:text-[#a89b8d]">{checks}/{daysInMonth} days ({percent}%)</span>
                </div>
                <div className="w-full bg-[#f5efe6] dark:bg-[#282420] h-2 rounded-full overflow-hidden border border-[#eee5d8] dark:border-[#383129]">
                  <div
                    className="h-full bg-[#5f7a61] dark:bg-[#7d9d80] rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
