import React, { useState } from 'react';
import { PageType, HabitTemplate, MonthData, PriorityType, MOOD_LEVELS } from '../types';
import { DAY_SHORT_NAMES, MONTH_NAMES, getDaysInMonth, getWeekDates, getMonthWeeks, formatIsoDate } from '../utils/dateUtils';
import { FrogMoodIcon, CloverIcon, ThreeLeafCloverIcon, HabitCloverDockIcon, BambooProjectDockIcon, PixelSparkleIcon, PixelCheckIcon, PixelCheckCircleIcon, FrogFaceDockIcon } from './FrogIcons';
import { Plus, ArrowUpDown, ChevronLeft, ChevronRight, Trash2, X, Tag, ListPlus, Trophy, Calendar, Grid, Archive, GripVertical, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, Sparkles, ArrowDownAZ } from 'lucide-react';
import { SubNavTabs } from './SubNavTabs';
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

  const swipeHandlers = useSwipeMonth({
    onPrevMonth: handleGoPrevWeek,
    onNextMonth: handleGoNextWeek,
  });

  return (
    <div className="space-y-4 pb-28" {...swipeHandlers}>
      {/* Top Segmented Sub-Navigation for Mood / Habits / Projects */}
      {onNavigate && (
        <SubNavTabs
          activePage="track"
          onNavigate={onNavigate}
          tabs={[
            { id: 'mood', label: 'Mood', icon: <FrogFaceDockIcon size={15} /> },
            { id: 'track', label: 'Habits', icon: <HabitCloverDockIcon size={15} /> },
            { id: 'project', label: 'Projects', icon: <BambooProjectDockIcon size={15} /> },
          ]}
        />
      )}

      {/* Sticky iOS 26 Glass Header with integrated Month & Week navigation */}
      <div className="sticky top-0 z-20 bg-white/85 dark:bg-black/85 backdrop-blur-2xl pt-1 pb-1 space-y-2.5">
        <div className="ios-glass-card p-3.5 sm:p-4 space-y-3">
          {/* Top Row: Week Navigation */}
          <div className="flex items-center justify-between">
            <button
              id="habit-prev-week"
              type="button"
              onClick={handleGoPrevWeek}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center font-bold text-zinc-800 dark:text-zinc-200 transition-all ios-tap"
              aria-label="Previous Week"
              title="Previous Week"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              <strong id="CroakleTrackMonth" className="text-base sm:text-lg font-black tracking-tight text-zinc-950 dark:text-white">
                {MONTH_NAMES[monthIndex]} {year}
              </strong>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {currentWeek?.label}
              </span>
            </div>

            <button
              id="habit-next-week"
              type="button"
              onClick={handleGoNextWeek}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center font-bold text-zinc-800 dark:text-zinc-200 transition-all ios-tap"
              aria-label="Next Week"
              title="Next Week"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Quick Weeks Segment (W1 .. W5) - iOS Segmented Bar */}
          {monthWeeks.length > 1 && (
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-[18px] border border-black/[0.04] dark:border-white/[0.06]">
              {monthWeeks.map((mw, idx) => {
                const isActive = idx === activeWeekIndex;
                return (
                  <button
                    key={`week-tab-${mw.weekNumber}`}
                    type="button"
                    onClick={() => {
                      const target = mw.days.find((d) => d.inMonth)?.date || mw.days[0].date;
                      onSelectDate(target);
                    }}
                    className={`flex-1 py-1 px-1.5 rounded-[14px] text-center transition-all duration-200 ios-tap ${
                      isActive
                        ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-black shadow-[0_2px_8px_rgba(0,0,0,0.06)] scale-[1.02]'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 font-semibold'
                    }`}
                  >
                    <span className="text-[11px] block leading-tight">{mw.label}</span>
                    <span className="text-[9px] opacity-60 block leading-none mt-0.5">{mw.rangeLabel}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 7-Day Interactive Strip */}
          <div className="grid grid-cols-7 gap-1.5 pt-1 border-t border-zinc-100 dark:border-zinc-800">
            {weekDays.map((wd) => {
              const isSelected = formatIsoDate(wd.date) === formatIsoDate(selectedDate);
              const dayName = DAY_SHORT_NAMES[wd.dayIndex];
              return (
                <button
                  key={wd.iso}
                  type="button"
                  onClick={() => onSelectDate(wd.date)}
                  className={`py-1.5 rounded-[16px] text-center flex flex-col items-center gap-0.5 transition-all duration-200 ios-tap ${
                    !wd.inMonth
                      ? 'opacity-25 text-zinc-400'
                      : isSelected
                      ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black shadow-[0_4px_12px_rgba(0,0,0,0.25)] scale-[1.05]'
                      : wd.isCurrentDay
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold border border-zinc-300 dark:border-zinc-700'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 font-semibold'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold opacity-75">{dayName}</span>
                  <span className="text-sm font-black">{wd.date.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Bar: Add Habit, Done & Reorder (Locked on a single line) */}
        <div className="flex items-center gap-2">
          <button
            id="CroakleOpenAddHabit"
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 py-2.5 px-4 rounded-[20px] bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all ios-tap"
          >
            <Plus size={16} className="shrink-0" />
            <span>Add Habit</span>
          </button>
          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className={`py-2.5 px-3 rounded-[20px] border font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all shrink-0 whitespace-nowrap ios-tap ${
              showArchived
                ? 'bg-zinc-900 text-white border-zinc-800'
                : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <Archive size={14} className="shrink-0" />
            <span>{showArchived ? 'Active' : `Done (${archivedHabits.length})`}</span>
          </button>
          <button
            id="CroakleOpenReorderHabit"
            type="button"
            onClick={() => setIsReorderOpen(true)}
            className="py-2.5 px-3 rounded-[20px] bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-all ios-tap shrink-0"
            title="Reorder Habits"
          >
            <ArrowUpDown size={14} />
            <span>Reorder</span>
          </button>
        </div>
      </div>

      {/* Main Habits List Container */}
      <div className="ios-glass-card p-4 sm:p-5 space-y-4">
        {displayedHabits.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 dark:text-zinc-500 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-[24px] bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center p-2 shadow-2xs text-zinc-500 dark:text-zinc-400">
              <CloverIcon size={36} />
            </div>
            <div>
              <p className="font-bold text-sm text-zinc-950 dark:text-white">
                {showArchived ? 'No completed habits yet' : 'No active habits right now'}
              </p>
              <p className="text-xs mt-0.5">
                {showArchived ? 'Finished habits will be archived here' : 'Tap "+ Add Habit" to begin your daily rhythm'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
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

              // calculate month completed count
              const monthCompletedCount = (monthHabit?.days || []).slice(0, daysInCurrentMonth).filter(Boolean).length;
              const isGoalMet = completedThisWeek >= habit.goal;

              return (
                <div
                  key={habit.id || originalIndex}
                  className={`p-4 rounded-[24px] border ${
                    habit.completed
                      ? 'border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 opacity-70'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                  } space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(originalIndex)}
                      className="text-left group flex items-center gap-2 min-w-0"
                    >
                      <span className={`font-black text-sm text-zinc-950 dark:text-white group-hover:underline truncate ${habit.completed ? 'line-through text-zinc-400' : ''}`}>
                        {habit.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {completedThisWeek}/{habit.goal} days
                      </span>
                    </button>

                    {isGoalMet && (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#34C759] dark:text-[#30D158] border border-emerald-200 dark:border-emerald-800/40 shadow-2xs flex items-center gap-1">
                        <span>Goal Met</span>
                        <PixelSparkleIcon size={11} />
                      </span>
                    )}
                  </div>

                  {habit.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{habit.description}</p>
                  )}

                  {/* 7-Day Habit Tracker Buttons */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {weekDays.map((wd) => {
                      const isCurrentMonthDay = wd.inMonth;
                      const dayNumber = wd.date.getDate();
                      const isDone = isCurrentMonthDay && Boolean(monthHabit?.days[dayNumber - 1]);

                      return (
                        <button
                          key={`${habit.id}-${wd.iso}`}
                          type="button"
                          disabled={!isCurrentMonthDay || habit.completed}
                          onClick={() => handleToggleDay(originalIndex, wd.date)}
                          title={`${wd.iso}: ${isDone ? 'Completed' : 'Not done'}`}
                          className={`h-11 rounded-[16px] flex items-center justify-center transition-all duration-200 ios-tap ${
                            !isCurrentMonthDay || habit.completed
                              ? 'opacity-25 cursor-not-allowed bg-zinc-100 dark:bg-zinc-800'
                              : isDone
                              ? 'bg-[#34C759] text-white shadow-[0_4px_12px_rgba(52,199,89,0.35)] scale-[0.98] font-black'
                              : 'bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 hover:border-[#34C759] dark:hover:border-[#34C759]'
                          }`}
                        >
                          {isDone ? <PixelCheckIcon size={18} /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Habit Dialog Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 rounded-[32px] p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloverIcon size={22} className="text-zinc-900 dark:text-white" />
                <h2 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Add Habit</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 20 pages"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-950 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#007AFF] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Goal Per Week: {newGoal} days
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={newGoal}
                  onChange={(e) => setNewGoal(Number(e.target.value))}
                  className="w-full accent-[#007AFF] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Science fiction or philosophy"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'low'] as PriorityType[]).map((p) => {
                    const isSelected = newPriority === p;
                    const colorClasses = 
                      p === 'high'
                        ? isSelected
                          ? 'border-[#FF3B30] bg-[#FF3B30] text-white shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-red-50/40 dark:bg-red-950/20 text-[#FF3B30]'
                        : p === 'medium'
                        ? isSelected
                          ? 'border-[#FF9500] bg-[#FF9500] text-white shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-amber-50/40 dark:bg-amber-950/20 text-[#FF9500]'
                        : isSelected
                        ? 'border-[#007AFF] bg-[#007AFF] text-white shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 bg-blue-50/40 dark:bg-blue-950/20 text-[#007AFF]';

                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`py-2 rounded-xl text-xs font-bold capitalize border transition ${colorClasses}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-extrabold text-sm shadow-md transition"
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 rounded-[32px] p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              {deleteConfirm ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteHabit(editingIndex);
                      setEditingIndex(null);
                      setDeleteConfirm(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FF3B30] hover:bg-red-700 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Trash2 size={13} /> Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(false)}
                    className="px-2 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(true)}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-[#FF3B30] font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              )}
              <h2 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Habit Details</h2>
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setDeleteConfirm(false);
                }}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-950 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#007AFF] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Goal Per Week: {editGoal} days
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={editGoal}
                  onChange={(e) => setNewGoal(Number(e.target.value))}
                  className="w-full accent-[#007AFF] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'low'] as PriorityType[]).map((p) => {
                    const isSelected = editPriority === p;
                    const colorClasses = 
                      p === 'high'
                        ? isSelected
                          ? 'border-[#FF3B30] bg-[#FF3B30] text-white shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-red-50/40 dark:bg-red-950/20 text-[#FF3B30]'
                        : p === 'medium'
                        ? isSelected
                          ? 'border-[#FF9500] bg-[#FF9500] text-white shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-amber-50/40 dark:bg-amber-950/20 text-[#FF9500]'
                        : isSelected
                        ? 'border-[#007AFF] bg-[#007AFF] text-white shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 bg-blue-50/40 dark:bg-blue-950/20 text-[#007AFF]';

                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setEditPriority(p)}
                        className={`py-2 rounded-xl text-xs font-bold capitalize border transition ${colorClasses}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="submit"
                  className="py-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-extrabold text-sm shadow-md transition"
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
                  className="py-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-950 dark:text-white font-bold text-sm transition flex items-center justify-center gap-1.5"
                >
                  <PixelCheckCircleIcon size={16} />
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 rounded-[32px] p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
                  <ArrowUpDown size={20} className="text-[#007AFF]" />
                  Reorder Habits
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Drag items or use the quick buttons to customize order
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReorderOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Sort Helpers */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
              <span className="text-zinc-400 uppercase tracking-wider text-[10px] font-extrabold shrink-0 mr-1">
                Quick Sort:
              </span>
              <button
                type="button"
                onClick={handleSortHabitsAZ}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 transition flex items-center gap-1 shrink-0 ios-tap"
              >
                <ArrowDownAZ size={12} />
                <span>A → Z</span>
              </button>
              <button
                type="button"
                onClick={handleSortHabitsByPriority}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 transition flex items-center gap-1 shrink-0 ios-tap"
              >
                <Sparkles size={12} className="text-[#FF9500]" />
                <span>By Priority</span>
              </button>
              <button
                type="button"
                onClick={() => onReorderHabits([...habits].reverse())}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 transition shrink-0 ios-tap"
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
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all duration-150 select-none ${
                      isDragging
                        ? 'opacity-40 scale-[0.98] border-[#007AFF] bg-[#007AFF]/10'
                        : isDragOver
                        ? 'border-2 border-[#007AFF] bg-[#007AFF]/5 shadow-md'
                        : 'bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      {/* Drag Handle */}
                      <div 
                        className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
                        title="Drag to reorder"
                      >
                        <GripVertical size={16} />
                      </div>

                      {/* Number Position Badge */}
                      <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-black text-[11px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      <div className="min-w-0">
                        <p className={`font-bold text-sm text-zinc-950 dark:text-white truncate ${habit.completed ? 'line-through text-zinc-400' : ''}`}>
                          {habit.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                              habit.priority === 'high'
                                ? 'bg-red-50 text-[#FF3B30] border border-red-200 dark:bg-red-950/40 dark:border-red-900'
                                : habit.priority === 'medium'
                                ? 'bg-amber-50 text-[#FF9500] border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900'
                                : 'bg-blue-50 text-[#007AFF] border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900'
                            }`}
                          >
                            {habit.priority}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {habit.goalDaysPerWeek}d/wk
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Move Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Send to Top */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveHabitToTop(idx)}
                        title="Move to top"
                        className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 text-zinc-700 dark:text-zinc-200 flex items-center justify-center transition"
                      >
                        <ChevronsUp size={13} />
                      </button>

                      {/* Move Up 1 */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveHabit(idx, idx - 1)}
                        title="Move up"
                        className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 text-zinc-700 dark:text-zinc-200 flex items-center justify-center transition"
                      >
                        <ChevronUp size={14} />
                      </button>

                      {/* Move Down 1 */}
                      <button
                        type="button"
                        disabled={idx === habits.length - 1}
                        onClick={() => handleMoveHabit(idx, idx + 1)}
                        title="Move down"
                        className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 text-zinc-700 dark:text-zinc-200 flex items-center justify-center transition"
                      >
                        <ChevronDown size={14} />
                      </button>

                      {/* Send to Bottom */}
                      <button
                        type="button"
                        disabled={idx === habits.length - 1}
                        onClick={() => handleMoveHabitToBottom(idx)}
                        title="Move to bottom"
                        className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 text-zinc-700 dark:text-zinc-200 flex items-center justify-center transition"
                      >
                        <ChevronsDown size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsReorderOpen(false)}
              className="w-full py-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-black text-sm shadow-md transition ios-tap"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
