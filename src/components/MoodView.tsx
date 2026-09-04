import React, { useState } from 'react';
import { PageType, MonthData } from '../types';
import { MONTH_NAMES, getDaysInMonth } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, X, Trash2, Check } from 'lucide-react';
import { useSwipeMonth } from '../hooks/useSwipeMonth';
import confetti from 'canvas-confetti';
import { MOOD_THEMES, getMoodTheme } from '../utils/moodConfig';

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
      {/* Month Header Card (Blue like the other views) */}
      <div className="border-[2.5px] border-[#1F1B1A] bg-[#0074DB] dark:bg-[#1D4ED8] text-white rounded-2xl shadow-[4px_4px_0px_#1F1B1A] dark:shadow-[4px_4px_0px_#000000] p-3.5 sm:p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          className="w-8 h-8 sm:w-9 sm:h-9 border-[2px] border-[#1F1B1A] bg-white dark:bg-[#252320] rounded-xl shadow-[2px_2px_0px_#1F1B1A] flex items-center justify-center font-bold text-[#1F1B1A] dark:text-[#F8F7F4] transition-all cursor-pointer hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
          aria-label="Previous Month"
          title="Previous Month"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-center">
          <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/80">
            Daily Mood Log
          </p>
          <strong id="CroakleMoodMonth" className="text-lg sm:text-xl font-bold font-oswald tracking-tight uppercase text-white block leading-tight mt-0.5">
            {MONTH_NAMES[monthIndex]} {year}
          </strong>
        </div>
        <button
          type="button"
          onClick={onNextMonth}
          className="w-8 h-8 sm:w-9 sm:h-9 border-[2px] border-[#1F1B1A] bg-white dark:bg-[#252320] rounded-xl shadow-[2px_2px_0px_#1F1B1A] flex items-center justify-center font-bold text-[#1F1B1A] dark:text-[#F8F7F4] transition-all cursor-pointer hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
          aria-label="Next Month"
          title="Next Month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Clean Calendar Card (Yellow) */}
      <div className="bg-[#FED843] text-[#1F1B1A] border-[2.5px] border-[#1F1B1A] rounded-2xl shadow-[4px_4px_0px_#1F1B1A] dark:shadow-[4px_4px_0px_#000000] p-4 select-none touch-pan-y space-y-3">
        {/* Day Headers (SU MO TU WE TH FR SA) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-bold font-mono text-[10px] sm:text-xs text-[#1F1B1A]/80 uppercase tracking-wider">
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
            const moodTheme = getMoodTheme(moodValue);
            const isToday = isCurrentMonth && today.getDate() === dayNum;
            const isChosen = selectedDay === dayNum;
            const hasMood = Boolean(moodValue && moodTheme);

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                onClick={() => setSelectedDay(dayNum)}
                className={`relative aspect-square w-full flex flex-col items-center justify-between p-1 rounded-xl transition-all duration-100 cursor-pointer border-[2px] border-[#1F1B1A] ${
                  hasMood && moodTheme
                    ? `${moodTheme.cellBg} ${moodTheme.cellTextColor} shadow-[2px_2px_0px_#1F1B1A] ${
                        isChosen ? 'ring-2 ring-[#1F1B1A] -translate-y-0.5' : ''
                      }`
                    : isChosen
                    ? 'bg-[#1F1B1A] text-white shadow-[2px_2px_0px_#1F1B1A] -translate-y-0.5'
                    : isToday
                    ? 'bg-white text-[#1F1B1A] font-extrabold shadow-[2px_2px_0px_#1F1B1A] ring-2 ring-[#E02921]'
                    : 'bg-white dark:bg-[#1D1B18] text-[#1F1B1A] dark:text-[#F8F7F4] hover:bg-white/80 shadow-[1px_1px_0px_#1F1B1A]'
                }`}
              >
                {/* Day Number Header */}
                <div className="w-full flex items-center justify-between px-0.5 leading-none">
                  <span
                    className={`font-mono font-bold leading-none ${
                      hasMood
                        ? 'text-[10px] sm:text-xs'
                        : 'text-xs sm:text-sm'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {isToday && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        hasMood ? 'bg-white ring-1 ring-[#1F1B1A]' : 'bg-[#E02921]'
                      }`}
                      title="Today"
                    />
                  )}
                </div>

                {/* Mood Tag: Single letter without translucent background */}
                {hasMood && moodTheme ? (
                  <div className="w-full flex items-center justify-center my-auto">
                    <span
                      className={`text-sm sm:text-base font-black font-mono leading-none ${moodTheme.cellTextColor}`}
                    >
                      {moodTheme.letter || moodTheme.abbr[0]}
                    </span>
                  </div>
                ) : (
                  <div className="h-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <hr className="border-[#1F1B1A]/25 my-2" />

        {/* Bottom 5 Mood Count Cards (Solid Color Cards with Abbreviations, No Pale Colors) */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
          {MOOD_THEMES.map((theme) => {
            const count = moodCounts[theme.value] || 0;
            return (
              <div
                key={theme.value}
                className={`py-2 px-1 sm:py-2.5 sm:px-1.5 border-[2px] border-[#1F1B1A] rounded-xl shadow-[2.5px_2.5px_0px_#1F1B1A] ${theme.cellBg} ${theme.cellTextColor} text-center flex flex-col items-center justify-center transition-all hover:-translate-y-0.5`}
              >
                {/* Mood Abbreviation */}
                <span className="text-[10px] sm:text-xs font-black font-mono tracking-wider uppercase leading-none mb-1">
                  {theme.abbr}
                </span>
                {/* Count */}
                <span className="font-mono text-sm sm:text-base font-black leading-none">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Select Mood Modal */}
      {selectedDay !== null && (
        <div className="fixed inset-0 z-50 bg-[#1F1B1A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFEF7] dark:bg-[#1D1B18] border-[3px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-3xl shadow-[6px_6px_0px_#1F1B1A] p-5 sm:p-6 w-full max-w-sm space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b-[2px] border-[#1F1B1A]/20 pb-2">
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#1F1B1A] dark:text-[#F8F7F4]">
                Mood: {MONTH_NAMES[monthIndex]} {selectedDay}, {year}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] flex items-center justify-center text-[#1F1B1A] dark:text-[#F8F7F4] bg-white hover:bg-[#FEF08A] shadow-[2px_2px_0px_#1F1B1A] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2 pt-2">
              {MOOD_THEMES.map((theme) => {
                const isSelected = monthData.moods[selectedDay - 1] === theme.value;

                return (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => handleSelectMood(isSelected ? null : theme.value)}
                    title={isSelected ? 'Click to remove' : `${theme.label} (${theme.abbr})`}
                    className={`py-2.5 px-1 border-[2px] rounded-xl flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? `border-[#1F1B1A] ${theme.cellBg} ${theme.cellTextColor} shadow-[3px_3px_0px_#1F1B1A] -translate-y-1 ring-2 ring-[#1F1B1A]`
                        : 'border-[#1F1B1A] bg-white dark:bg-[#252320] text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[2px_2px_0px_#1F1B1A] hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Color Swatch Badge: 1 letter abbreviation */}
                    <div
                      className={`w-7 h-7 rounded-lg border-[1.5px] border-[#1F1B1A] flex items-center justify-center font-black font-mono text-xs shadow-[1px_1px_0px_#1F1B1A] ${
                        isSelected ? 'bg-white text-[#1F1B1A]' : `${theme.cellBg} ${theme.cellTextColor}`
                      }`}
                    >
                      {isSelected ? <Check size={14} className="stroke-[3]" /> : (theme.letter || theme.abbr[0])}
                    </div>

                    <span className="text-[10px] font-bold uppercase leading-none">
                      {theme.label}
                    </span>

                    {isSelected && (
                      <span className="text-[8px] font-bold bg-black/20 text-white px-1 py-0.5 rounded leading-none">
                        Remove
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-center text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70">
              {monthData.moods[selectedDay - 1] 
                ? 'Tap selected mood again to remove, or use button below'
                : 'Select mood for this day'}
            </p>

            {monthData.moods[selectedDay - 1] ? (
              <button
                type="button"
                onClick={() => handleSelectMood(null)}
                className="w-full py-2.5 rounded-xl border-[2px] border-[#1F1B1A] text-xs font-bold uppercase text-white bg-[#E02921] hover:bg-[#C8231B] shadow-[2px_2px_0px_#1F1B1A] transition cursor-pointer flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5"
              >
                <Trash2 size={15} />
                <span>Clear Mood</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="w-full py-2.5 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] text-xs font-bold uppercase text-[#1F1B1A] dark:text-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] hover:bg-white dark:hover:bg-[#1D1B18] shadow-[2px_2px_0px_#1F1B1A] transition cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
