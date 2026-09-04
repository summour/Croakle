import React, { useState } from 'react';
import { PageType, HabitTemplate, MonthData, PriorityType, MOOD_LEVELS } from '../types';
import { DAY_SHORT_NAMES, MONTH_NAMES, getDaysInMonth, getWeekDates, getMonthWeeks, formatIsoDate } from '../utils/dateUtils';
import { CloverIcon, ThreeLeafCloverIcon, HabitCloverDockIcon, BambooProjectDockIcon, PixelSparkleIcon, PixelCheckIcon, PixelCheckCircleIcon, FrogFaceDockIcon, PixelFrogCrownIcon } from './FrogIcons';
import { Plus, ArrowUpDown, ChevronLeft, ChevronRight, Trash2, X, Tag, ListPlus, Trophy, Calendar, Grid, Archive, GripVertical, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, Sparkles, ArrowDownAZ, Smile, CheckCircle2, FolderKanban } from 'lucide-react';
import { CalendarPickerModal } from './CalendarPickerModal';
import { useSwipeMonth } from '../hooks/useSwipeMonth';
import confetti from 'canvas-confetti';

interface HabitsViewProps {
  habits: HabitTemplate[];
  monthData: MonthData;
  year: number;
  monthIndex: number;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  onToggleHabitDay: (habitIndex: number, dayOfMonth: number) => void;
  onAddHabit: (habit: Omit<HabitTemplate, 'id'>) => void;
  onUpdateHabit: (index: number, habit: HabitTemplate) => void;
  onDeleteHabit: (index: number) => void;
  onToggleCompleteHabit?: (index: number) => void;
  onReorderHabits: (habits: HabitTemplate[]) => void;
  onNavigate?: (page: PageType) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  monthData,
  year,
  monthIndex,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onPrevWeek,
  onNextWeek,
  onToggleHabitDay,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onToggleCompleteHabit,
  onReorderHabits,
  onNavigate,
}) => {
  const [showArchived, setShowArchived] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [draggedHabitIdx, setDraggedHabitIdx] = useState<number | null>(null);
  const [dragOverHabitIdx, setDragOverHabitIdx] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Form states for Add Habit
  const [newName, setNewName] = useState('');
  const [newGoal, setNewGoal] = useState(3);
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityType>('medium');
  const [newSubHabits, setNewSubHabits] = useState<string[]>([]);
  const [subHabitInput, setSubHabitInput] = useState('');

  // Form states for Edit Habit
  const [editName, setEditName] = useState('');
  const [editGoal, setEditGoal] = useState(3);
  const [editDesc, setEditDesc] = useState('');
  const [editPriority, setEditPriority] = useState<PriorityType>('medium');
  const [editSubHabits, setEditSubHabits] = useState<string[]>([]);
  const [editSubInput, setEditSubInput] = useState('');

  const monthWeeks = getMonthWeeks(year, monthIndex);
  const activeWeekIndex = monthWeeks.findIndex((w) =>
    w.days.some((d) => formatIsoDate(d.date) === formatIsoDate(selectedDate))
  );
  const currentWeek = monthWeeks[activeWeekIndex >= 0 ? activeWeekIndex : 0] || monthWeeks[0];
  const weekDays = currentWeek?.days || [];
  const daysInCurrentMonth = getDaysInMonth(year, monthIndex);

  const activeHabits = habits.filter((h) => !h.completed);
  const archivedHabits = habits.filter((h) => h.completed);
  const displayedHabits = showArchived ? archivedHabits : activeHabits;

  const handleOpenAdd = () => {
    setNewName('');
    setNewGoal(3);
    setNewDesc('');
    setNewPriority('medium');
    setNewSubHabits([]);
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddHabit({
      name: newName.trim(),
      goal: Math.max(1, Math.min(7, newGoal)),
      description: newDesc.trim(),
      priority: newPriority,
      subHabits: newSubHabits,
      completed: false,
    });
    setIsAddOpen(false);
  };

  const handleOpenEdit = (index: number) => {
    const h = habits[index];
    if (!h) return;
    setEditingIndex(index);
    setDeleteConfirm(false);
    setEditName(h.name);
    setEditGoal(h.goal);
    setEditDesc(h.description || '');
    setEditPriority(h.priority || 'medium');
    setEditSubHabits(h.subHabits ? [...h.subHabits] : []);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex === null || !editName.trim()) return;
    const current = habits[editingIndex];
    onUpdateHabit(editingIndex, {
      ...current,
      name: editName.trim(),
      goal: Math.max(1, Math.min(7, editGoal)),
      description: editDesc.trim(),
      priority: editPriority,
      subHabits: editSubHabits,
    });
    setEditingIndex(null);
  };

  const handleToggleDay = (habitIdx: number, targetDate: Date) => {
    // Check if targetDate is in the current active month
    if (targetDate.getMonth() === monthIndex && targetDate.getFullYear() === year) {
      const dayOfMonth = targetDate.getDate();
      const isCurrentlyDone = monthData.habits[habitIdx]?.days[dayOfMonth - 1];
      onToggleHabitDay(habitIdx, dayOfMonth);
      if (!isCurrentlyDone) {
        confetti({
          particleCount: 20,
          spread: 45,
          origin: { y: 0.7 },
        });
      }
    }
  };

  const handleMoveHabit = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= habits.length || fromIndex === toIndex) return;
    const copy = [...habits];
    const [moved] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, moved);
    onReorderHabits(copy);
  };

  const handleMoveHabitToTop = (index: number) => {
    handleMoveHabit(index, 0);
  };

  const handleMoveHabitToBottom = (index: number) => {
    handleMoveHabit(index, habits.length - 1);
  };

  const handleSortHabitsAZ = () => {
    const sorted = [...habits].sort((a, b) => a.name.localeCompare(b.name));
    onReorderHabits(sorted);
  };

  const handleSortHabitsByPriority = () => {
    const priorityWeight: Record<PriorityType, number> = { high: 1, medium: 2, low: 3 };
    const sorted = [...habits].sort((a, b) => (priorityWeight[a.priority] || 2) - (priorityWeight[b.priority] || 2));
    onReorderHabits(sorted);
  };

  const handleGoPrevWeek = () => {
    if (onPrevWeek) {
      onPrevWeek();
    } else {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 7);
      onSelectDate(d);
    }
  };

  const handleGoNextWeek = () => {
    if (onNextWeek) {
      onNextWeek();
    } else {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 7);
      onSelectDate(d);
    }
  };

  const handleGoPrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onSelectDate(d);
  };

  const handleGoNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onSelectDate(d);
  };

  const swipeHandlers = useSwipeMonth({
    onPrev: handleGoPrevDay,
    onNext: handleGoNextDay,
  });

  return (
    <div className="space-y-4 pb-28" {...swipeHandlers}>
      {/* Sticky Header with integrated Month & Week navigation */}
      <div className="sticky top-0 z-20 bg-transparent pt-1 pb-1 space-y-2">
        <div className="border-[2.5px] border-[#1F1B1A] bg-[#0074DB] dark:bg-[#1D4ED8] text-white p-3 space-y-2.5 rounded-2xl shadow-[4px_4px_0px_#1F1B1A] dark:shadow-[4px_4px_0px_#000000] touch-pan-y" {...swipeHandlers}>
          {/* Top Row: Week Navigation */}
          <div className="flex items-center justify-between">
            <button
              id="habit-prev-week"
              type="button"
              onClick={handleGoPrevWeek}
              className="w-8 h-8 rounded-xl border-[2px] border-[#1F1B1A] bg-white dark:bg-[#252320] flex items-center justify-center font-bold text-[#1F1B1A] dark:text-[#F8F7F4] transition-all cursor-pointer shadow-[2px_2px_0px_#1F1B1A] hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
              aria-label="Previous Week"
              title="Previous Week"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() => setIsCalendarOpen(true)}
              className="flex flex-col items-center px-2.5 py-1 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer group"
              title="Click to open calendar"
            >
              <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/80">
                Habit Tracker
              </p>
              <div className="flex items-center gap-2">
                <strong id="CroakleTrackMonth" className="text-base sm:text-lg font-bold font-oswald tracking-tight uppercase text-white">
                  {MONTH_NAMES[monthIndex]} {year}
                </strong>
                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border-[1.5px] border-[#1F1B1A] bg-[#FEF08A] text-[#1F1B1A] shadow-[1px_1px_0px_#1F1B1A]">
                  {currentWeek?.label}
                </span>
              </div>
            </button>

            <button
              id="habit-next-week"
              type="button"
              onClick={handleGoNextWeek}
              className="w-8 h-8 rounded-xl border-[2px] border-[#1F1B1A] bg-white dark:bg-[#252320] flex items-center justify-center font-bold text-[#1F1B1A] dark:text-[#F8F7F4] transition-all cursor-pointer shadow-[2px_2px_0px_#1F1B1A] hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
              aria-label="Next Week"
              title="Next Week"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 7-Day Interactive Strip */}
          <div className="grid grid-cols-7 gap-1 pt-1.5 border-t-[2px] border-[#1F1B1A]/40 dark:border-white/30">
            {weekDays.map((wd) => {
              const isSelected = formatIsoDate(wd.date) === formatIsoDate(selectedDate);
              const dayName = DAY_SHORT_NAMES[wd.dayIndex];
              const dayOfMonth = wd.date.getDate();
              const hasActivity =
                wd.inMonth &&
                (monthData.habits?.some((h) => h?.days?.[dayOfMonth - 1]) ||
                  (monthData.moods &&
                    monthData.moods[dayOfMonth - 1] !== undefined &&
                    monthData.moods[dayOfMonth - 1] !== null));

              return (
                <button
                  key={wd.iso}
                  type="button"
                  onClick={() => onSelectDate(wd.date)}
                  className={`py-1.5 px-0.5 text-center flex flex-col items-center justify-center font-mono transition-all duration-100 cursor-pointer rounded-xl border-[2px] ${
                    !wd.inMonth
                      ? 'opacity-35 bg-white/20 border-dashed border-[#1F1B1A]/40 text-white'
                      : isSelected
                      ? 'bg-[#E02921] text-white font-bold border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A] -translate-y-0.5'
                      : wd.isCurrentDay
                      ? 'bg-[#FEF08A] text-[#1F1B1A] font-bold border-[#1F1B1A] shadow-[1.5px_1.5px_0px_#1F1B1A]'
                      : 'bg-white dark:bg-[#1D1B18] text-[#1F1B1A] dark:text-[#F8F7F4] border-[#1F1B1A] shadow-[1.5px_1.5px_0px_#1F1B1A] hover:bg-[#FEF08A]/80'
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold tracking-wider">{dayName}</span>
                  <span className="text-sm font-bold">{dayOfMonth}</span>
                  <span
                    className={`w-1.5 h-1.5 mt-0.5 rounded-full ${
                      hasActivity
                        ? isSelected
                          ? 'bg-white'
                          : 'bg-[#E02921]'
                        : 'invisible'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Bar: Add Habit, Done & Reorder */}
        <div className="grid grid-cols-3 gap-2">
          <button
            id="CroakleOpenAddHabit"
            type="button"
            onClick={handleOpenAdd}
            className="py-2 px-2.5 rounded-xl border-[2px] border-[#1F1B1A] bg-[#FEF08A] hover:bg-[#FED843] text-[#1F1B1A] font-mono font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1F1B1A] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 whitespace-nowrap"
          >
            <Plus size={14} className="shrink-0" />
            <span>ADD</span>
          </button>
          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className={`py-2 px-2.5 rounded-xl border-[2px] border-[#1F1B1A] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer shadow-[2px_2px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5 ${
              showArchived
                ? 'bg-[#FEF08A] text-[#1F1B1A]'
                : 'bg-white dark:bg-[#1D1B18] text-[#1F1B1A] dark:text-[#F8F7F4] hover:bg-[#FEF08A]'
            }`}
          >
            <Archive size={13} className="shrink-0" />
            <span>{showArchived ? 'Active' : `Done (${archivedHabits.length})`}</span>
          </button>
          <button
            id="CroakleOpenReorderHabit"
            type="button"
            onClick={() => setIsReorderOpen(true)}
            className="py-2 px-2.5 rounded-xl bg-white dark:bg-[#1D1B18] text-[#1F1B1A] dark:text-[#F8F7F4] border-[2px] border-[#1F1B1A] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_#1F1B1A] hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 whitespace-nowrap"
            title="Reorder Habits"
          >
            <ArrowUpDown size={13} />
            <span>Order</span>
          </button>
        </div>
      </div>

      {/* Main Habits List Container */}
      <div className="space-y-4">
        {displayedHabits.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border-[2.5px] border-[#1F1B1A] bg-[#FED843] text-[#1F1B1A] shadow-[4px_4px_0px_#1F1B1A] p-6 space-y-3">
            <p className="font-oswald text-lg uppercase font-bold text-[#1F1B1A]">
              {showArchived ? 'No completed habits yet' : 'No active habits right now'}
            </p>
            <p className="text-xs font-mono text-[#1F1B1A]/70">
              {showArchived ? 'Finished habits will be archived here' : 'Tap "Add New Habit" to begin your daily rhythm'}
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="add-btn mt-2 inline-block rounded-xl"
            >
              Add New Habit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedHabits.map((habit) => {
              const originalIndex = habits.findIndex((h) => h.id === habit.id);
              const monthHabit = monthData.habits[originalIndex];
              // calculate this week's completed count
              const completedThisWeek = weekDays.reduce((acc, wd) => {
                if (wd.inMonth) {
                  return acc + (monthHabit?.days[wd.date.getDate() - 1] ? 1 : 0);
                }
                return acc;
              }, 0);

              const isGoalMet = completedThisWeek >= habit.goal;

              return (
                <div
                  key={habit.id || originalIndex}
                  className="habit-card"
                >
                  <div className="habit-title">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(originalIndex)}
                      className="text-left font-bold truncate hover:opacity-80 transition cursor-pointer flex-1 mr-2 flex items-center gap-2 text-[#1F1B1A]"
                    >
                      <span className={`text-[15px] sm:text-base font-bold text-[#1F1B1A] leading-snug ${habit.completed ? 'line-through opacity-50' : ''}`}>
                        {habit.name}
                      </span>
                      {isGoalMet && (
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#22C55E] text-[#1F1B1A] border border-[#1F1B1A] shadow-[1px_1px_0px_#1F1B1A]">
                          Met
                        </span>
                      )}
                    </button>
                    <span className="text-xs sm:text-sm font-mono shrink-0 text-[#1F1B1A]/70 font-bold">
                      {completedThisWeek}/{habit.goal}
                    </span>
                  </div>

                  {habit.description && (
                    <p className="text-xs text-[#1F1B1A]/70 font-mono mb-2 line-clamp-1">
                      {habit.description}
                    </p>
                  )}

                  <div className="day-grid">
                    {weekDays.map((wd) => {
                      const isCurrentMonthDay = wd.inMonth;
                      const dayNumber = wd.date.getDate();
                      const isDone = isCurrentMonthDay && Boolean(monthHabit?.days[dayNumber - 1]);
                      const dayLetter = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][(wd.dayIndex + 6) % 7];

                      return (
                        <button
                          key={`${habit.id}-${wd.iso}`}
                          type="button"
                          disabled={!isCurrentMonthDay || habit.completed}
                          onClick={() => handleToggleDay(originalIndex, wd.date)}
                          title={`${wd.iso}: ${isDone ? 'Completed' : 'Not done'}`}
                          className={`day-cell ${isDone ? 'active' : ''} ${
                            !isCurrentMonthDay || habit.completed
                              ? 'opacity-25 cursor-not-allowed border-dashed'
                              : ''
                          }`}
                        >
                          {dayLetter}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <button
              id="CroakleBottomAddHabit"
              type="button"
              onClick={handleOpenAdd}
              className="add-btn w-full text-center py-3"
            >
              Add New Habit
            </button>
          </div>
        )}
      </div>

      {/* Add Habit Dialog Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-[#1F1B1A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFEF7] dark:bg-[#1D1B18] border-[3px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-3xl shadow-[6px_6px_0px_#1F1B1A] p-5 sm:p-6 w-full max-w-md space-y-4 font-mono animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b-[2px] border-[#1F1B1A]/20 dark:border-[#F8F7F4]/20 pb-2">
              <h2 className="text-base font-bold font-oswald uppercase tracking-tight text-[#1F1B1A] dark:text-[#F8F7F4]">Add Habit</h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="w-7 h-7 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] flex items-center justify-center text-[#1F1B1A] dark:text-[#F8F7F4] bg-white hover:bg-[#FEF08A] shadow-[1.5px_1.5px_0px_#1F1B1A] cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 20 pages"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-[#1F1B1A] dark:text-[#F8F7F4] font-mono text-xs rounded-xl shadow-[2px_2px_0px_#1F1B1A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">
                  Goal Per Week: {newGoal} days
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={newGoal}
                  onChange={(e) => setNewGoal(Number(e.target.value))}
                  className="w-full accent-[#E02921] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Science fiction or philosophy"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-[#1F1B1A] dark:text-[#F8F7F4] font-mono text-xs rounded-xl shadow-[2px_2px_0px_#1F1B1A] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['high', 'medium', 'low'] as PriorityType[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-1.5 border-[2px] rounded-xl text-[10px] font-bold uppercase transition cursor-pointer shadow-[2px_2px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5 ${
                        newPriority === p
                          ? 'border-[#1F1B1A] bg-[#E02921] text-white'
                          : 'border-[#1F1B1A] bg-white dark:bg-[#252320] text-[#1F1B1A] dark:text-[#F8F7F4] hover:bg-[#FEF08A]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#FEF08A] hover:bg-[#FEF08A]/90 text-[#1F1B1A] font-bold font-oswald uppercase text-xs tracking-wider rounded-xl shadow-[3px_3px_0px_#1F1B1A] transition active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Habit Dialog Modal */}
      {editingIndex !== null && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditingIndex(null);
              setDeleteConfirm(false);
            }
          }}
          className="fixed inset-0 z-50 bg-[#1F1B1A]/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#FFFEF7] dark:bg-[#1D1B18] border-[3px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-3xl shadow-[6px_6px_0px_#1F1B1A] p-5 sm:p-6 w-full max-w-md space-y-4 font-mono animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b-[2px] border-[#1F1B1A]/20 dark:border-[#F8F7F4]/20 pb-2">
              <h2 className="text-base font-bold font-oswald uppercase tracking-tight text-[#1F1B1A] dark:text-[#F8F7F4]">Habit Details</h2>
              <div className="flex items-center gap-1.5">
                {deleteConfirm ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteHabit(editingIndex);
                        setEditingIndex(null);
                        setDeleteConfirm(false);
                      }}
                      className="px-2.5 py-1 rounded-xl border-[2px] border-[#E02921] bg-[#E02921] text-white font-bold text-[10px] uppercase flex items-center gap-1 shadow-[1.5px_1.5px_0px_#1F1B1A] cursor-pointer"
                    >
                      <Trash2 size={11} /> Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(false)}
                      className="px-2.5 py-1 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] text-[#1F1B1A] dark:text-[#F8F7F4] font-bold text-[10px] uppercase shadow-[1.5px_1.5px_0px_#1F1B1A] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(true)}
                    className="px-2.5 py-1 rounded-xl border-[2px] border-[#E02921] text-[#E02921] hover:bg-[#E02921]/10 font-bold text-[10px] uppercase flex items-center gap-1 transition shadow-[1.5px_1.5px_0px_#1F1B1A] cursor-pointer"
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setEditingIndex(null);
                    setDeleteConfirm(false);
                  }}
                  className="w-7 h-7 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] flex items-center justify-center text-[#1F1B1A] dark:text-[#F8F7F4] bg-white hover:bg-[#FEF08A] shadow-[1.5px_1.5px_0px_#1F1B1A] cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-[#1F1B1A] dark:text-[#F8F7F4] font-mono text-xs rounded-xl shadow-[2px_2px_0px_#1F1B1A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">
                  Goal Per Week: {editGoal} days
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={editGoal}
                  onChange={(e) => setEditGoal(Number(e.target.value))}
                  className="w-full accent-[#E02921] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-[#1F1B1A] dark:text-[#F8F7F4] font-mono text-xs rounded-xl shadow-[2px_2px_0px_#1F1B1A] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['high', 'medium', 'low'] as PriorityType[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditPriority(p)}
                      className={`py-1.5 border-[2px] rounded-xl text-[10px] font-bold uppercase transition cursor-pointer shadow-[2px_2px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5 ${
                        editPriority === p
                          ? 'border-[#1F1B1A] bg-[#E02921] text-white'
                          : 'border-[#1F1B1A] bg-white dark:bg-[#252320] text-[#1F1B1A] dark:text-[#F8F7F4] hover:bg-[#FEF08A]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="submit"
                  className="py-2.5 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#FEF08A] hover:bg-[#FEF08A]/90 text-[#1F1B1A] font-bold font-oswald uppercase text-xs tracking-wider shadow-[3px_3px_0px_#1F1B1A] transition active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleCompleteHabit) {
                      onToggleCompleteHabit(editingIndex);
                    }
                    setEditingIndex(null);
                    setDeleteConfirm(false);
                  }}
                  className="py-2.5 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-[#1F1B1A] dark:text-[#F8F7F4] hover:bg-[#FEF08A] font-bold font-oswald uppercase text-xs tracking-wider shadow-[3px_3px_0px_#1F1B1A] transition flex items-center justify-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                >
                  <PixelCheckCircleIcon size={14} />
                  {habits[editingIndex]?.completed ? 'Mark Active' : 'Finished'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reorder Habits Dialog */}
      {isReorderOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsReorderOpen(false);
          }}
          className="fixed inset-0 z-50 bg-[#1F1B1A]/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#FFFEF7] dark:bg-[#1D1B18] border-[3px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-3xl shadow-[6px_6px_0px_#1F1B1A] p-5 sm:p-6 w-full max-w-lg space-y-3 font-mono animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b-[2px] border-[#1F1B1A]/20 dark:border-[#F8F7F4]/20 pb-2">
              <div>
                <h2 className="text-base font-bold font-oswald uppercase tracking-tight text-[#1F1B1A] dark:text-[#F8F7F4] flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-[#E02921]" />
                  Reorder Habits
                </h2>
                <p className="text-[10px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 mt-0.5">
                  Drag items or use the buttons to reorder
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReorderOpen(false)}
                className="w-7 h-7 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] flex items-center justify-center text-[#1F1B1A] dark:text-[#F8F7F4] bg-white hover:bg-[#FEF08A] shadow-[1.5px_1.5px_0px_#1F1B1A] transition cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Quick Sort Helpers */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
              <span className="text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 uppercase tracking-wider font-extrabold shrink-0 mr-1">
                Quick Sort:
              </span>
              <button
                type="button"
                onClick={handleSortHabitsAZ}
                className="px-2.5 py-1 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-[#1F1B1A] dark:text-[#F8F7F4] hover:bg-[#FEF08A] transition flex items-center gap-1 shrink-0 uppercase shadow-[1.5px_1.5px_0px_#1F1B1A] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                <ArrowDownAZ size={11} />
                <span>A → Z</span>
              </button>
              <button
                type="button"
                onClick={handleSortHabitsByPriority}
                className="px-2.5 py-1 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-[#1F1B1A] dark:text-[#F8F7F4] hover:bg-[#FEF08A] transition flex items-center gap-1 shrink-0 uppercase shadow-[1.5px_1.5px_0px_#1F1B1A] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                <Sparkles size={11} className="text-[#E02921]" />
                <span>By Priority</span>
              </button>
              <button
                type="button"
                onClick={() => onReorderHabits([...habits].reverse())}
                className="px-2.5 py-1 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-[#1F1B1A] dark:text-[#F8F7F4] hover:bg-[#FEF08A] transition shrink-0 uppercase shadow-[1.5px_1.5px_0px_#1F1B1A] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                Reverse
              </button>
            </div>

            {/* Habits Reorder List with Drag and Drop */}
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {habits.map((habit, idx) => {
                const isDragging = draggedHabitIdx === idx;
                const isDragOver = dragOverHabitIdx === idx && draggedHabitIdx !== idx;

                return (
                  <div
                    key={habit.id || idx}
                    draggable
                    onDragStart={() => setDraggedHabitIdx(idx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverHabitIdx(idx);
                    }}
                    onDragLeave={() => {
                      if (dragOverHabitIdx === idx) setDragOverHabitIdx(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedHabitIdx !== null && draggedHabitIdx !== idx) {
                        handleMoveHabit(draggedHabitIdx, idx);
                      }
                      setDraggedHabitIdx(null);
                      setDragOverHabitIdx(null);
                    }}
                    onDragEnd={() => {
                      setDraggedHabitIdx(null);
                      setDragOverHabitIdx(null);
                    }}
                    className={`flex items-center justify-between p-2.5 border-[2px] rounded-xl transition-all duration-100 select-none shadow-[2px_2px_0px_#1F1B1A] ${
                      isDragging
                        ? 'opacity-40 border-[#E02921] bg-[#E02921]/10'
                        : isDragOver
                        ? 'border-[#E02921] bg-[#E02921]/10'
                        : 'bg-white dark:bg-[#1D1B18] border-[#1F1B1A] dark:border-[#F8F7F4]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      {/* Drag Handle */}
                      <div 
                        className="cursor-grab active:cursor-grabbing p-1 text-[#1F1B1A]/40 dark:text-[#F8F7F4]/40 hover:text-[#1F1B1A] dark:hover:text-[#F8F7F4] transition"
                        title="Drag to reorder"
                      >
                        <GripVertical size={14} />
                      </div>

                      {/* Number Position Badge */}
                      <span className="w-5 h-5 rounded-lg border border-[#1F1B1A] bg-[#FEF08A] text-[#1F1B1A] font-bold text-[10px] flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#1F1B1A]">
                        {idx + 1}
                      </span>

                      <div className="min-w-0">
                        <p className={`font-bold text-xs truncate ${habit.completed ? 'line-through text-[#1F1B1A]/40 dark:text-[#F8F7F4]/40' : 'text-[#1F1B1A] dark:text-[#F8F7F4]'}`}>
                          {habit.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[8.5px] font-bold uppercase px-1.5 py-0.2 rounded-md border border-[#1F1B1A] ${
                              habit.priority === 'high'
                                ? 'bg-[#E02921] text-white'
                                : habit.priority === 'medium'
                                ? 'bg-[#FEF08A] text-[#1F1B1A]'
                                : 'bg-[#F8F7F4] text-[#1F1B1A]'
                            }`}
                          >
                            {habit.priority}
                          </span>
                          <span className="text-[9px] text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 font-mono">
                            {habit.goal || 7}d/wk
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Move Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveHabitToTop(idx)}
                        title="Move to top"
                        className="w-6 h-6 rounded-lg border border-[#1F1B1A] bg-white dark:bg-[#252320] disabled:opacity-20 text-[#1F1B1A] dark:text-[#F8F7F4] flex items-center justify-center transition shadow-[1px_1px_0px_#1F1B1A] cursor-pointer"
                      >
                        <ChevronsUp size={12} />
                      </button>

                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveHabit(idx, idx - 1)}
                        title="Move up"
                        className="w-6 h-6 rounded-lg border border-[#1F1B1A] bg-white dark:bg-[#252320] disabled:opacity-20 text-[#1F1B1A] dark:text-[#F8F7F4] flex items-center justify-center transition shadow-[1px_1px_0px_#1F1B1A] cursor-pointer"
                      >
                        <ChevronUp size={12} />
                      </button>

                      <button
                        type="button"
                        disabled={idx === habits.length - 1}
                        onClick={() => handleMoveHabit(idx, idx + 1)}
                        title="Move down"
                        className="w-6 h-6 rounded-lg border border-[#1F1B1A] bg-white dark:bg-[#252320] disabled:opacity-20 text-[#1F1B1A] dark:text-[#F8F7F4] flex items-center justify-center transition shadow-[1px_1px_0px_#1F1B1A] cursor-pointer"
                      >
                        <ChevronDown size={12} />
                      </button>

                      <button
                        type="button"
                        disabled={idx === habits.length - 1}
                        onClick={() => handleMoveHabitToBottom(idx)}
                        title="Move to bottom"
                        className="w-6 h-6 rounded-lg border border-[#1F1B1A] bg-white dark:bg-[#252320] disabled:opacity-20 text-[#1F1B1A] dark:text-[#F8F7F4] flex items-center justify-center transition shadow-[1px_1px_0px_#1F1B1A] cursor-pointer"
                      >
                        <ChevronsDown size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsReorderOpen(false)}
              className="w-full py-2.5 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#FEF08A] hover:bg-[#FEF08A]/90 text-[#1F1B1A] font-bold font-oswald uppercase text-xs tracking-wider shadow-[3px_3px_0px_#1F1B1A] transition active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Full Month Calendar Picker Modal */}
      <CalendarPickerModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        title="Habit Calendar"
      />
    </div>
  );
};
