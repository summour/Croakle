import React, { useState } from 'react';
import { PageType, MonthData, MOOD_LEVELS } from '../types';
import { MONTH_NAMES, CALENDAR_HEADER_DAYS, getDaysInMonth } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, X, Smile, CheckCircle2, FolderKanban } from 'lucide-react';
import { FrogMoodIcon } from './FrogIcons';
import { SubNavTabs } from './SubNavTabs';
import { useSwipeMonth } from '../hooks/useSwipeMonth';
import confetti from 'canvas-confetti';

interface MoodViewProps {
  monthData: MonthData;
  year: number;
  monthIndex: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSetMoodDay: (dayOfMonth: number, moodValue: number | null) => void;
  onNavigate?: (page: PageType) => void;
}

export const MoodView: React.FC<MoodViewProps> = ({
  monthData,
  year,
  monthIndex,
  onPrevMonth,
  onNextMonth,
  onSetMoodDay,
  onNavigate,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = getDaysInMonth(year, monthIndex);
  // First day of month (0 = Sun, 1 = Mon...)
  const firstDayIndex = new Date(year, monthIndex, 1).getDay();

  // Mood counts calculation
  const moodCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  monthData.moods.forEach((m) => {
    if (m && moodCounts[m] !== undefined) {
      moodCounts[m]++;
    }
  });

  const handleSelectMood = (value: number | null) => {
    if (selectedDay !== null) {
      onSetMoodDay(selectedDay, value);
      if (value && value >= 4) {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.7 },
        });
      }
      setSelectedDay(null);
    }
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex;

  const swipeHandlers = useSwipeMonth({
    onPrevMonth,
    onNextMonth,
  });

  return (
    <div className="space-y-4 pb-28" {...swipeHandlers}>
      {/* Top Segmented Sub-Navigation for Mood / Habits / Projects */}
      {onNavigate && (
        <SubNavTabs
          activePage="mood"
          onNavigate={onNavigate}
          tabs={[
            { id: 'mood', label: 'Mood' },
            { id: 'track', label: 'Habits' },
            { id: 'project', label: 'Projects' },
          ]}
        />
      )}

      {/* Month Header (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-white/85 dark:bg-black/85 backdrop-blur-2xl pt-1 pb-1">
        <div className="ios-glass-card p-3.5 sm:p-4 flex items-center justify-between">
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
              Mood Check-in
            </p>
            <strong id="CroakleMoodMonth" className="text-base sm:text-lg font-black tracking-tight text-zinc-950 dark:text-white block leading-tight">
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
      </div>

      {/* Clean Calendar Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-4 sm:p-6 shadow-xs select-none touch-pan-y space-y-5">
        {/* Day Headers (Su Mo Tu We Th Fr Sa) */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center font-bold text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          {CALENDAR_HEADER_DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Calendar Squircle Grid (Square Cells) */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty spacer cells before day 1 */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square opacity-0 pointer-events-none" />
          ))}

          {/* Days 1..daysInMonth */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const moodValue = monthData.moods[i];
            const moodObj = MOOD_LEVELS.find((m) => m.value === moodValue);
            const isToday = isCurrentMonth && today.getDate() === dayNum;
            const isChosen = selectedDay === dayNum;

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                onClick={() => setSelectedDay(dayNum)}
                className={`relative aspect-square w-full rounded-[14px] sm:rounded-[18px] flex flex-col justify-between p-1 sm:p-1.5 transition-all duration-150 ios-tap ${
                  isToday || isChosen
                    ? 'border-2 border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800/80 shadow-xs'
                    : 'border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-300'
                }`}
              >
                {/* Day Number in Top-Left Corner */}
                <span
                  className={`text-[10px] sm:text-xs font-bold leading-none pl-0.5 pt-0.5 ${
                    isToday || isChosen
                      ? 'text-zinc-950 dark:text-white'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {dayNum}
                </span>

                {/* Mood Icon in Center */}
                <div className="flex-1 flex items-center justify-center -mt-1.5 sm:-mt-1">
                  {moodValue && moodObj ? (
                    <FrogMoodIcon value={moodValue} size={32} className="w-7 h-7 sm:w-8.5 sm:h-8.5 transition-transform drop-shadow-xs" />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <hr className="border-zinc-200 dark:border-zinc-800 my-2" />

        {/* Bottom 5 Mood Count Cards (Compact & Neat Design) */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
          {MOOD_LEVELS.map((m) => (
            <div
              key={m.value}
              className="py-2 px-1 sm:py-2.5 sm:px-2 rounded-[14px] sm:rounded-[18px] border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 text-center flex flex-col items-center justify-center shadow-2xs transition-all hover:bg-zinc-50 dark:hover:bg-zinc-850"
            >
              {/* Direct Frog Icon */}
              <div className="mb-1 flex items-center justify-center">
                <FrogMoodIcon value={m.value} size={22} className="w-5 h-5 sm:w-6 sm:h-6 transition-transform" />
              </div>
              {/* Label */}
              <span className="text-[10px] sm:text-[11px] font-bold block tracking-tight text-zinc-500 dark:text-zinc-400 leading-none">
                {m.label}
              </span>
              {/* Count */}
              <strong className="text-xs sm:text-sm font-black block mt-1 text-zinc-950 dark:text-white leading-none">
                {moodCounts[m.value] || 0}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Select Mood Modal */}
      {selectedDay !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-6 w-full max-w-sm shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-zinc-950 dark:text-white">
                Mood for {MONTH_NAMES[monthIndex]} {selectedDay}, {year}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2 pt-2">
              {MOOD_LEVELS.map((mood) => {
                const isSelected = monthData.moods[selectedDay - 1] === mood.value;
                return (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => handleSelectMood(mood.value)}
                    className={`py-3.5 px-1 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ios-tap bg-white dark:bg-zinc-850 ${
                      isSelected
                        ? 'border-zinc-950 dark:border-white ring-2 ring-zinc-950/20 dark:ring-white/20 scale-105 shadow-md'
                        : 'border-zinc-200 dark:border-zinc-750 hover:border-zinc-300 dark:hover:border-zinc-600 hover:scale-102'
                    }`}
                  >
                    <FrogMoodIcon value={mood.value} size={30} />
                    <span className="text-[10.5px] font-bold text-zinc-700 dark:text-zinc-300">
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleSelectMood(null)}
              className="w-full py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition ios-tap"
            >
              Clear Mood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
