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
  const svgHeight = compact ? 130 : 160;
  const padLeft = 32;
  const padRight = 32;
  const padTop = 20;
  const padBottom = 26;

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
    <div className="space-y-3 select-none">
      {/* Minimalist Summary & Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/[0.03] dark:bg-white/[0.04] text-[#2d2823] dark:text-[#f4efe8]">
            Avg <strong className="text-[#d98236]">{avgScore}</strong> / 5
          </div>
          <div className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/[0.03] dark:bg-white/[0.04] text-[#8c7e70] dark:text-[#a89b8d]">
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
                className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold flex items-center gap-1 transition-all ios-tap border ${
                  isFilterActive
                    ? 'bg-[#d98236]/12 border-[#d98236]/30 text-[#b56521] dark:text-[#e89b58]'
                    : 'bg-black/[0.02] dark:bg-white/[0.03] border-transparent text-[#8c7e70] dark:text-[#a89b8d] opacity-60'
                }`}
                title={`Filter by ${ml.label}`}
              >
                <FrogMoodIcon value={ml.value} size={12} />
                <span className="truncate">{ml.label}</span>
                <span className="opacity-60 text-[9px]">({count})</span>
              </button>
            );
          })}
          {activeMoodFilter !== null && (
            <button
              type="button"
              onClick={() => setActiveMoodFilter(null)}
              className="p-1 rounded-full text-[#8c7e70] hover:text-[#2d2823] dark:hover:text-white"
              title="Clear Filter"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Main SVG Mood Canvas */}
      <div className="w-full rounded-[22px] bg-black/[0.02] dark:bg-white/[0.02] p-3 border border-black/[0.04] dark:border-white/[0.05] overflow-hidden relative">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-32 sm:h-40 overflow-visible">
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
                  className="text-black/[0.04] dark:text-white/[0.05]"
                  strokeDasharray="2 3"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[8px] font-semibold fill-[#8c7e70] dark:fill-[#a89b8d]"
                >
                  {moodObj?.label.slice(0, 3)}
                </text>
              </g>
            );
          })}

          {/* Connected Mood Line */}
          {moodLinePath && (
            <path
              d={moodLinePath}
              fill="none"
              stroke="#d98236"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-75"
            />
          )}

          {/* Interactive Mood Points */}
          {points.map((p) => {
            if (!p.moodValue || p.y === null) return null;
            const isSelected = selectedDay === p.day;
            const isDimmed = activeMoodFilter !== null && activeMoodFilter !== p.moodValue;

            return (
              <g
                key={p.day}
                onClick={() => handlePointTap(p.day)}
                className="cursor-pointer"
              >
                {isSelected && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={8}
                    fill={p.moodObj?.color || '#d98236'}
                    fillOpacity="0.2"
                    stroke={p.moodObj?.color || '#d98236'}
                    strokeWidth="1.2"
                  />
                )}

                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? 5.5 : isDimmed ? 2.5 : 4}
                  fill={p.moodObj?.color || '#d98236'}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 2 : 1}
                  className={`transition-all duration-150 ${isDimmed ? 'opacity-25' : 'opacity-100'}`}
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
                className="text-[8.5px] font-medium fill-[#8c7e70] dark:fill-[#a89b8d]"
              >
                {p.day}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Selected Day Inspector Card */}
      {selectedPoint && selectedPoint.moodObj && (
        <div className="rounded-[20px] bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] p-3.5 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[10px] bg-[#d98236]/12 dark:bg-[#d98236]/20 flex items-center justify-center">
              <FrogMoodIcon value={selectedPoint.moodObj.value} size={18} />
            </div>
            <div>
              <strong className="text-xs font-bold text-[#2d2823] dark:text-[#f4efe8] block leading-tight">
                Day {selectedPoint.day} — {selectedPoint.moodObj.label} ({selectedPoint.moodValue}/5)
              </strong>
              <span className="text-[10px] text-[#8c7e70] dark:text-[#a89b8d]">
                {MONTH_NAMES[monthIndex]} {selectedPoint.day}, {year}
              </span>
            </div>
          </div>

          <div className="px-2.5 py-0.5 rounded-full bg-[#d98236]/10 text-[#b56521] dark:text-[#e89b58] text-[11px] font-bold border border-[#d98236]/20">
            {selectedPoint.moodObj.label}
          </div>
        </div>
      )}
    </div>
  );
};
