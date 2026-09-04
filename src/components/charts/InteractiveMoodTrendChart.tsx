import React, { useState } from 'react';
import { MonthData, MOOD_LEVELS } from '../../types';
import { MONTH_NAMES } from '../../utils/dateUtils';
import { FrogMoodIcon } from '../FrogIcons';
import { soundEngine, triggerHaptic } from '../../utils/audioUtils';
import { X } from 'lucide-react';

interface InteractiveMoodTrendChartProps {
  year: number;
  monthIndex: number;
  monthData: MonthData;
  onSelectDay?: (dayNumber: number) => void;
  compact?: boolean;
}

export const InteractiveMoodTrendChart: React.FC<InteractiveMoodTrendChartProps> = ({
  year,
  monthIndex,
  monthData,
  onSelectDay,
  compact = false,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(() => {
    const now = new Date();
    if (now.getFullYear() === year && now.getMonth() === monthIndex) {
      return now.getDate();
    }
    return null;
  });
  const [activeMoodFilter, setActiveMoodFilter] = useState<number | null>(null);

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Mood counts calculation
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

  const avgScore = recordedMoodsCount > 0 ? (totalMoodScore / recordedMoodsCount).toFixed(1) : '—';
  const positiveCount = (moodCounts[5] || 0) + (moodCounts[4] || 0);
  const positivityRate = recordedMoodsCount > 0 ? Math.round((positiveCount / recordedMoodsCount) * 100) : 0;

  // Chart dimensions
  const svgWidth = 720;
  const svgHeight = compact ? 160 : 210;
  const padLeft = 32;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 22;

  const innerW = svgWidth - padLeft - padRight;
  const innerH = svgHeight - padTop - padBottom;

  const points = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const moodValue = monthData.moods[i] || null;
    const x = padLeft + (i / Math.max(1, daysInMonth - 1)) * innerW;
    const y = moodValue !== null
      ? padTop + innerH - ((moodValue - 1) / 4) * innerH
      : null;

    const moodObj = moodValue ? MOOD_LEVELS.find((m) => m.value === moodValue) : null;

    return { day, moodValue, moodObj, x, y };
  });

  const validPoints = points.filter((p): p is typeof p & { y: number; moodValue: number } => p.y !== null);

  const moodLinePath = validPoints.length > 1
    ? `M ${validPoints[0].x} ${validPoints[0].y} ` + validPoints.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const handlePointTap = (day: number) => {
    setSelectedDay(day);
    soundEngine.playTapSound();
    triggerHaptic();
    onSelectDay?.(day);
  };

  const handleMoodFilterToggle = (val: number) => {
    const next = activeMoodFilter === val ? null : val;
    setActiveMoodFilter(next);
    soundEngine.playTapSound();
    triggerHaptic();
  };

  const selectedPoint = selectedDay ? points[selectedDay - 1] : null;

  return (
    <div className="space-y-3 select-none font-mono">
      {/* Minimalist Summary & Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          <div className="px-2 py-0.5 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 text-[10px] font-bold uppercase bg-white dark:bg-[#1D1B18] text-[#1D1B18] dark:text-[#F8F7F4]">
            Avg <strong className="text-[#E63946]">{avgScore}</strong> / 5
          </div>
          <div className="px-2 py-0.5 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 text-[10px] font-bold uppercase bg-white dark:bg-[#1D1B18] text-[#1D1B18]/60 dark:text-[#F8F7F4]/60">
            {positivityRate}% Positive
          </div>
        </div>

        {/* Filter by mood level */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
          {MOOD_LEVELS.map((ml) => {
            const count = moodCounts[ml.value] || 0;
            const isFilterActive = activeMoodFilter === ml.value;

            return (
              <button
                key={ml.value}
                type="button"
                onClick={() => handleMoodFilterToggle(ml.value)}
                className={`px-2 py-0.5 text-[9px] font-bold uppercase flex items-center gap-1 transition cursor-pointer border ${
                  isFilterActive
                    ? 'bg-[#1D1B18] dark:bg-[#F8F7F4] text-[#F8F7F4] dark:text-[#1D1B18] border-[#1D1B18] dark:border-[#F8F7F4]'
                    : 'bg-white dark:bg-[#1D1B18] border-[#1D1B18]/20 dark:border-[#F8F7F4]/20 text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 hover:border-[#1D1B18] dark:hover:border-[#F8F7F4]'
                }`}
                title={`Filter by ${ml.label}`}
              >
                <span
                  className="w-1.5 h-1.5 shrink-0"
                  style={{ backgroundColor: ml.color }}
                />
                <span className="truncate">{ml.label}</span>
                <span className="opacity-60">({count})</span>
              </button>
            );
          })}
          {activeMoodFilter !== null && (
            <button
              type="button"
              onClick={() => setActiveMoodFilter(null)}
              className="p-1 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 text-[#1D1B18]/60 hover:text-[#1D1B18] dark:hover:text-[#F8F7F4] bg-white dark:bg-[#1D1B18]"
              title="Clear Filter"
            >
              <X size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Main SVG Mood Canvas */}
      <div className="w-full bg-white dark:bg-[#1D1B18] p-2 sm:p-2.5 border border-[#1D1B18] dark:border-[#F8F7F4] overflow-hidden relative">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className={`w-full h-auto ${compact ? 'aspect-[720/160]' : 'aspect-[720/210]'} overflow-visible`}
        >
          {/* Level Grid Lines */}
          {[5, 4, 3, 2, 1].map((lvl) => {
            const y = padTop + innerH - ((lvl - 1) / 4) * innerH;
            const moodObj = MOOD_LEVELS.find((m) => m.value === lvl);

            return (
              <g key={lvl}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-black/[0.08] dark:text-white/[0.08]"
                  strokeDasharray="2 3"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[8px] font-bold fill-[#1D1B18]/60 dark:fill-[#F8F7F4]/60"
                >
                  {moodObj?.label.slice(0, 3).toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Connected Mood Line */}
          {moodLinePath && (
            <path
              d={moodLinePath}
              fill="none"
              stroke="#E63946"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Mood Points */}
          {points.map((p) => {
            if (!p.moodValue || p.y === null || !p.moodObj) return null;
            const isSelected = selectedDay === p.day;
            const isDimmed = activeMoodFilter !== null && activeMoodFilter !== p.moodValue;

            return (
              <g
                key={p.day}
                onClick={() => handlePointTap(p.day)}
                className="cursor-pointer"
              >
                {/* Core point */}
                <rect
                  x={p.x - (isSelected ? 4 : 2.5)}
                  y={p.y - (isSelected ? 4 : 2.5)}
                  width={isSelected ? 8 : 5}
                  height={isSelected ? 8 : 5}
                  fill={isSelected ? '#E63946' : p.moodObj.color}
                  stroke="#1D1B18"
                  strokeWidth="1"
                  className={`transition-all duration-150 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                />
              </g>
            );
          })}

          {/* Day Numbers on X-Axis */}
          {points.map((p) => {
            if (p.day % 5 !== 0 && p.day !== 1 && p.day !== daysInMonth) return null;
            return (
              <text
                key={`day-num-${p.day}`}
                x={p.x}
                y={padTop + innerH + 13}
                textAnchor="middle"
                className="text-[8.5px] font-bold font-mono fill-[#1D1B18]/60 dark:fill-[#F8F7F4]/60"
              >
                {p.day}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Selected Day Inspector Card */}
      {selectedPoint && selectedPoint.moodObj && (
        <div className="border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] p-3 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 border border-[#1D1B18] dark:border-[#F8F7F4] flex items-center justify-center"
              style={{
                backgroundColor: `${selectedPoint.moodObj.color}20`,
              }}
            >
              <FrogMoodIcon value={selectedPoint.moodObj.value} size={16} />
            </div>
            <div>
              <strong className="text-xs font-bold font-oswald uppercase text-[#1D1B18] dark:text-[#F8F7F4] block leading-tight">
                Day {selectedPoint.day} — {selectedPoint.moodObj.label} ({selectedPoint.moodValue}/5)
              </strong>
              <span className="text-[10px] text-[#1D1B18]/60 dark:text-[#F8F7F4]/60">
                {MONTH_NAMES[monthIndex]} {selectedPoint.day}, {year}
              </span>
            </div>
          </div>

          <div
            className="px-2 py-0.5 text-[10px] font-bold font-oswald uppercase border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4]"
          >
            {selectedPoint.moodObj.label}
          </div>
        </div>
      )}
    </div>
  );
};
