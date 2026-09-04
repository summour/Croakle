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

      {/* Month Header Card */}
      <div className="border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] p-3 sm:p-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          className="w-7 h-7 sm:w-8 sm:h-8 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] flex items-center justify-center font-bold text-[#1D1B18] dark:text-[#F8F7F4] transition-all cursor-pointer hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
          aria-label="Previous Month"
          title="Previous Month"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-center">
          <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#1D1B18]/60 dark:text-[#F8F7F4]/60">
            Daily Mood Log
          </p>
          <strong id="CroakleMoodMonth" className="text-lg sm:text-xl font-bold font-oswald tracking-tight uppercase text-[#1D1B18] dark:text-[#F8F7F4] block leading-tight mt-0.5">
            {MONTH_NAMES[monthIndex]} {year}
          </strong>
        </div>
        <button
          type="button"
          onClick={onNextMonth}
          className="w-7 h-7 sm:w-8 sm:h-8 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] flex items-center justify-center font-bold text-[#1D1B18] dark:text-[#F8F7F4] transition-all cursor-pointer hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
          aria-label="Next Month"
          title="Next Month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Clean Calendar Card */}
      <div className="bg-white dark:bg-[#1D1B18] border border-[#1D1B18] dark:border-[#F8F7F4] p-3.5 sm:p-4 select-none touch-pan-y space-y-3">
        {/* Day Headers (SU MO TU WE TH FR SA) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-bold font-mono text-[10px] sm:text-xs text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 uppercase tracking-wider">
          {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Calendar Grid */}
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
            const hasMood = Boolean(moodValue && moodObj);

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                onClick={() => setSelectedDay(dayNum)}
                className={`relative aspect-square w-full flex flex-col items-center justify-center p-1 transition-all duration-100 cursor-pointer border ${
                  hasMood
                    ? isChosen
                      ? 'bg-[#E63946] text-white border-[#1D1B18] dark:border-[#F8F7F4] ring-1 ring-[#1D1B18] dark:ring-[#F8F7F4]'
                      : isToday
                      ? 'bg-[#E63946] text-white border-[#1D1B18] dark:border-white'
                      : 'bg-[#E63946] text-white border-[#E63946]'
                    : isToday
                    ? 'border border-[#E63946] bg-white dark:bg-[#1D1B18]'
                    : isChosen
                    ? 'border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320]'
                    : 'border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-white dark:bg-[#1D1B18] hover:border-[#1D1B18] dark:hover:border-[#F8F7F4]'
                }`}
              >
                {/* Day Number */}
                <span
                  className={`font-mono font-bold leading-none ${
                    hasMood
                      ? 'text-white text-[9px] sm:text-[10px] mb-0.5'
                      : 'text-[#1D1B18] dark:text-[#F8F7F4] text-xs sm:text-sm'
                  }`}
                >
                  {dayNum}
                </span>

                {/* Mood Icon in Center */}
                {hasMood && moodObj && (
                  <div className="flex items-center justify-center">
                    <FrogMoodIcon
                      value={moodValue!}
                      size={20}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <hr className="border-[#1D1B18]/15 dark:border-[#F8F7F4]/20 my-2" />

        {/* Bottom 5 Mood Count Cards */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
          {MOOD_LEVELS.map((m) => (
            <div
              key={m.value}
              className="py-2 px-1 sm:py-2 sm:px-1.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] text-center flex flex-col items-center justify-center transition-all hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
            >
              <FrogMoodIcon value={m.value} size={20} className="w-5 h-5 mb-1" />
              <span className="font-mono text-[9px] font-bold text-[#1D1B18]/70 dark:text-[#F8F7F4]/70">
                {moodCounts[m.value] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Select Mood Modal */}
      {selectedDay !== null && (
        <div className="fixed inset-0 z-50 bg-[#1D1B18]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1D1B18] border border-[#1D1B18] dark:border-[#F8F7F4] p-5 sm:p-6 w-full max-w-sm space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold font-oswald uppercase tracking-tight text-[#1D1B18] dark:text-[#F8F7F4]">
                Mood for {MONTH_NAMES[monthIndex]} {selectedDay}, {year}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="w-7 h-7 border border-[#1D1B18] dark:border-[#F8F7F4] flex items-center justify-center text-[#1D1B18] dark:text-[#F8F7F4] hover:bg-[#F8F7F4] dark:hover:bg-[#252320] cursor-pointer"
              >
                <X size={16} />
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
                    className={`py-3 px-1 border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? 'border-[#E63946] bg-[#E63946] text-[#F8F7F4]'
                        : 'border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] text-[#1D1B18] dark:text-[#F8F7F4] hover:bg-[#F8F7F4] dark:hover:bg-[#252320]'
                    }`}
                  >
                    <FrogMoodIcon value={mood.value} size={28} />
                    <span className="text-[10px] font-bold font-oswald uppercase">
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleSelectMood(null)}
              className="w-full py-2 border border-[#1D1B18] dark:border-[#F8F7F4] text-xs font-bold font-oswald uppercase text-[#1D1B18]/70 dark:text-[#F8F7F4]/70 bg-[#F8F7F4] dark:bg-[#252320] hover:bg-white dark:hover:bg-[#1D1B18] transition cursor-pointer"
            >
              Clear Mood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
