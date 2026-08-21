import React, { useState } from 'react';
import { PageType, MonthData, MOOD_LEVELS } from '../types';
import { MONTH_NAMES, CALENDAR_HEADER_DAYS, getDaysInMonth, formatIsoDate } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { FrogMoodIcon, FrogMoodRad, FrogFaceDockIcon, WashiJournalDockIcon } from './FrogIcons';
import { SubNavTabs } from './SubNavTabs';
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

  // Determine top mood(s)
  let maxCount = 0;
  Object.values(moodCounts).forEach((c) => {
    if (c > maxCount) maxCount = c;
  });

  const topMoods = maxCount > 0
    ? Object.keys(moodCounts)
        .map(Number)
        .filter((k) => moodCounts[k] === maxCount)
        .map((k) => MOOD_LEVELS.find((m) => m.value === k)!)
        .filter(Boolean)
    : [];

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

  return (
    <div className="space-y-4 pb-24">
      {/* Top Segmented Sub-Navigation for Journal/Mood */}
      {onNavigate && (
        <SubNavTabs
          activePage="mood"
          onNavigate={onNavigate}
          tabs={[
            { id: 'mood', label: 'Mood Tracker', icon: <FrogFaceDockIcon size={15} /> },
            { id: 'notes', label: 'Journal & Notes', icon: <WashiJournalDockIcon size={15} /> },
          ]}
        />
      )}

      {/* Month Header (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-[#fdfbf7]/90 dark:bg-[#161311]/90 backdrop-blur-2xl pt-1 pb-1">
        <div className="ios-glass-card p-3.5 sm:p-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrevMonth}
            className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] flex items-center justify-center font-bold text-[#4a4036] dark:text-[#e0d6cb] transition-all ios-tap"
            aria-label="Previous Month"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <strong id="CroakleMoodMonth" className="text-base sm:text-lg font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
              {MONTH_NAMES[monthIndex]} {year}
            </strong>
          </div>
          <button
            type="button"
            onClick={onNextMonth}
            className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] flex items-center justify-center font-bold text-[#4a4036] dark:text-[#e0d6cb] transition-all ios-tap"
            aria-label="Next Month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar Grid Card */}
      <div className="ios-glass-card p-5 space-y-3">
        {/* Day Headers (Su Mo Tu We Th Fr Sa) */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-[#8c7e70] dark:text-[#a89b8d] uppercase tracking-wider">
          {CALENDAR_HEADER_DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {/* Empty spacer cells before day 1 */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 opacity-0 pointer-events-none" />
          ))}

          {/* Days 1..daysInMonth */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const moodValue = monthData.moods[i];
            const moodObj = MOOD_LEVELS.find((m) => m.value === moodValue);
            const isToday = isCurrentMonth && today.getDate() === dayNum;

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                onClick={() => setSelectedDay(dayNum)}
                className={`h-14 rounded-[16px] flex flex-col items-center justify-between p-1.5 border transition-all ios-tap ${
                  moodObj
                    ? `${moodObj.bgLight} ${moodObj.bgDark} ${moodObj.borderLight} ${moodObj.borderDark} shadow-xs`
                    : 'border-black/[0.05] dark:border-white/[0.06] hover:border-[#5f7a61]/40 bg-white/40 dark:bg-white/[0.02]'
                } ${isToday ? 'ring-2 ring-[#5f7a61] dark:ring-[#7d9d80] font-black' : ''}`}
              >
                <span className={`text-[10px] font-black self-start leading-none ${
                  moodObj ? `${moodObj.textColorLight} ${moodObj.textColorDark}` : 'text-[#8c7e70] dark:text-[#a89b8d]'
                }`}>
                  {dayNum}
                </span>
                <div className="my-auto">
                  {moodValue ? (
                    <div className={`p-1 rounded-full ${moodObj?.iconBgLight || ''} ${moodObj?.iconBgDark || ''}`}>
                      <FrogMoodIcon value={moodValue} size={22} />
                    </div>
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                </div>
                <div className="w-1 h-1" />
              </button>
            );
          })}
        </div>

        {/* Top Moods Summary */}
        <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#b86f52] dark:text-[#d68767]" />
            <strong className="text-xs font-black uppercase tracking-wider text-[#4a4036] dark:text-[#e0d6cb]">
              Most Frequent Mood:
            </strong>
          </div>

          <div className="flex items-center gap-2">
            {topMoods.length === 0 ? (
              <span className="text-xs font-medium text-[#8c7e70]">No mood entries recorded yet</span>
            ) : (
              topMoods.map((tm) => (
                <span
                  key={tm.value}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border shadow-xs ${tm.bgLight} ${tm.bgDark} ${tm.borderLight} ${tm.borderDark} ${tm.textColorLight} ${tm.textColorDark}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tm.iconBgLight} ${tm.iconBgDark}`}>
                    <FrogMoodIcon value={tm.value} size={15} />
                  </div>
                  <span>{tm.label}</span>
                  <span className="opacity-75 font-bold">({maxCount} {maxCount === 1 ? 'day' : 'days'})</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Mood Breakdown Row - Colored Background Cards for Clear Differentiation */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          {MOOD_LEVELS.map((m) => (
            <div
              key={m.value}
              className={`p-2.5 rounded-[18px] border text-center flex flex-col items-center shadow-xs transition-all ${m.bgLight} ${m.bgDark} ${m.borderLight} ${m.borderDark}`}
            >
              {/* Circular Themed Icon Backdrop */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 shadow-2xs ${m.iconBgLight} ${m.iconBgDark}`}>
                <FrogMoodIcon value={m.value} size={22} />
              </div>
              <span className={`text-[10.5px] font-black block tracking-tight ${m.textColorLight} ${m.textColorDark}`}>
                {m.label}
              </span>
              <strong className={`text-xs sm:text-sm font-black block mt-0.5 ${m.textColorLight} ${m.textColorDark}`}>
                {moodCounts[m.value] || 0}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Select Mood Modal */}
      {selectedDay !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#211e1b] border border-[#eee5d8] dark:border-[#2f2a24] rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black tracking-tight text-[#2d2823] dark:text-[#f2eee9]">
                Mood for {MONTH_NAMES[monthIndex]} {selectedDay}, {year}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-full bg-[#f5efe6] dark:bg-[#282420] flex items-center justify-center text-[#8c7e70] hover:text-[#2d2823] dark:hover:text-[#f2eee9]"
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
                    className={`py-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ios-tap ${
                      mood.bgLight
                    } ${mood.bgDark} ${
                      isSelected
                        ? `ring-2 ring-offset-1 ring-offset-white dark:ring-offset-[#211e1b] ${mood.borderLight} ${mood.borderDark} scale-105 shadow-md`
                        : `${mood.borderLight} ${mood.borderDark} hover:scale-102`
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${mood.iconBgLight} ${mood.iconBgDark}`}>
                      <FrogMoodIcon value={mood.value} size={22} />
                    </div>
                    <span className={`text-[10px] font-black ${mood.textColorLight} ${mood.textColorDark}`}>
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleSelectMood(null)}
              className="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
            >
              Clear Mood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
