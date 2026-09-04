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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1B18]/50 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#0074DB] dark:bg-[#1D4ED8] text-white border-[3px] border-[#1F1B1A] rounded-3xl shadow-[6px_6px_0px_#1F1B1A] dark:shadow-[6px_6px_0px_#000000] p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-2.5 border-b-[2px] border-[#1F1B1A]/40 dark:border-white/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FEF08A] border-[1.5px] border-[#1F1B1A] flex items-center justify-center shadow-[1px_1px_0px_#1F1B1A]">
              <CalendarIcon size={14} className="text-[#1F1B1A]" />
            </div>
            <h3 className="text-base font-bold font-oswald text-white uppercase tracking-wider">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <button
              type="button"
              onClick={handleJumpToday}
              className="px-2.5 py-1 rounded-xl border-[1.5px] border-[#1F1B1A] bg-[#FEF08A] text-[#1F1B1A] text-[10px] font-bold uppercase transition hover:-translate-y-0.5 shadow-[1.5px_1.5px_0px_#1F1B1A] cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-xl border-[1.5px] border-[#1F1B1A] bg-white dark:bg-[#252320] text-[#1F1B1A] dark:text-[#F8F7F4] hover:bg-[#E02921] hover:text-white transition cursor-pointer flex items-center justify-center shadow-[1.5px_1.5px_0px_#1F1B1A]"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Month / Year Navigator */}
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-xl border-[1.5px] border-[#1F1B1A] bg-white dark:bg-[#252320] flex items-center justify-center text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[1.5px_1.5px_0px_#1F1B1A] transition cursor-pointer hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5 font-bold font-oswald text-base text-white uppercase tracking-tight">
            <span>{MONTH_NAMES[viewMonth]}</span>
            <span className="text-white/70">{viewYear}</span>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-xl border-[1.5px] border-[#1F1B1A] bg-white dark:bg-[#252320] flex items-center justify-center text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[1.5px_1.5px_0px_#1F1B1A] transition cursor-pointer hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Days of Week Header (Mo Tu We Th Fr Sa Su) */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono font-bold text-[10px] text-white/90 uppercase tracking-wider">
          {DAY_SHORT_NAMES.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 font-mono text-xs">
          {cells.map((cell) => {
            const isCurrent = cell.inCurrentMonth;
            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => handleSelectDay(cell.date)}
                className={`aspect-square w-full rounded-xl border-[1.5px] flex flex-col items-center justify-center font-bold text-xs transition-all relative cursor-pointer ${
                  cell.isSelected
                    ? 'bg-[#E02921] text-white border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A] -translate-y-0.5'
                    : cell.isToday
                    ? 'border-[#1F1B1A] text-[#1F1B1A] bg-[#FEF08A] shadow-[1.5px_1.5px_0px_#1F1B1A]'
                    : isCurrent
                    ? 'border-[#1F1B1A] hover:bg-[#FEF08A] text-[#1F1B1A] dark:text-[#F8F7F4] bg-white dark:bg-[#1D1B18] shadow-[1px_1px_0px_#1F1B1A]'
                    : 'border-transparent text-white/30 opacity-30 pointer-events-none'
                }`}
              >
                <span>{cell.dayNum}</span>
                {cell.isToday && !cell.isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E02921] absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
