import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react';
import { MONTH_NAMES, DAY_SHORT_NAMES, formatIsoDate, getTodayIso } from '../utils/dateUtils';

interface CalendarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  title?: string;
}

export const CalendarPickerModal: React.FC<CalendarPickerModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  title = 'Calendar',
}) => {
  const [viewYear, setViewYear] = useState<number>(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(selectedDate.getMonth());

  // Sync view when modal opens with new selectedDate
  useEffect(() => {
    if (isOpen) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  const todayIso = getTodayIso();
  const selectedIso = formatIsoDate(selectedDate);

  // Month navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleJumpToday = () => {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    onSelectDate(today);
    onClose();
  };

  // Generate calendar grid dates for viewMonth & viewYear (Monday-first)
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Day of week for 1st of month: 0=Sun, 1=Mon, ..., 6=Sat
  // In Monday-first system: Monday=0, Tuesday=1, ..., Sunday=6
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7;

  interface CalendarCell {
    date: Date;
    iso: string;
    dayNum: number;
    inCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
  }

  const cells: CalendarCell[] = [];

  // 1. Previous month trailing days
  for (let i = startDayOffset - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const d = new Date(viewYear, viewMonth - 1, dayNum);
    const iso = formatIsoDate(d);
    cells.push({
      date: d,
      iso,
      dayNum,
      inCurrentMonth: false,
      isToday: iso === todayIso,
      isSelected: iso === selectedIso,
    });
  }

  // 2. Current month days
  for (let dNum = 1; dNum <= daysInMonth; dNum++) {
    const d = new Date(viewYear, viewMonth, dNum);
    const iso = formatIsoDate(d);
    cells.push({
      date: d,
      iso,
      dayNum: dNum,
      inCurrentMonth: true,
      isToday: iso === todayIso,
      isSelected: iso === selectedIso,
    });
  }

  // 3. Next month leading days to complete the row
  const remainingCells = (7 - (cells.length % 7)) % 7;
  for (let nextDay = 1; nextDay <= remainingCells; nextDay++) {
    const d = new Date(viewYear, viewMonth + 1, nextDay);
    const iso = formatIsoDate(d);
    cells.push({
      date: d,
      iso,
      dayNum: nextDay,
      inCurrentMonth: false,
      isToday: iso === todayIso,
      isSelected: iso === selectedIso,
    });
  }

  const handleSelectDay = (cellDate: Date) => {
    onSelectDate(cellDate);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4 animate-scale-in select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-zinc-700 dark:text-zinc-300" />
            <h3 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-wider">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleJumpToday}
              className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition"
            >
              Today
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Month / Year Navigator */}
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200 transition active:scale-95"
            aria-label="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5 font-black text-base text-zinc-950 dark:text-white">
            <span>{MONTH_NAMES[viewMonth]}</span>
            <span className="text-zinc-400 dark:text-zinc-500">{viewYear}</span>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200 transition active:scale-95"
            aria-label="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Days of Week Header (Mo Tu We Th Fr Sa Su) */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          {DAY_SHORT_NAMES.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell) => {
            const isCurrent = cell.inCurrentMonth;
            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => handleSelectDay(cell.date)}
                className={`aspect-square w-full rounded-xl flex flex-col items-center justify-center font-bold text-xs transition-all relative ${
                  cell.isSelected
                    ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md scale-105 z-10'
                    : isCurrent
                    ? 'text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    : 'text-zinc-300 dark:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <span>{cell.dayNum}</span>
                {cell.isToday && !cell.isSelected && (
                  <span className="w-1 h-1 rounded-full bg-zinc-950 dark:bg-white absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
