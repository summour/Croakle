import React, { useState } from 'react';
import { PageType, HabitTemplate, MonthData, PriorityType, MOOD_LEVELS } from '../types';
import { DAY_SHORT_NAMES, MONTH_NAMES, getDaysInMonth, getWeekDates, formatIsoDate } from '../utils/dateUtils';
import { FrogMoodIcon, CloverIcon, ThreeLeafCloverIcon, HabitCloverDockIcon, BambooProjectDockIcon } from './FrogIcons';
import { Plus, ArrowUpDown, ChevronLeft, ChevronRight, Check, Trash2, X, Tag, ListPlus, Trophy } from 'lucide-react';
import { SubNavTabs } from './SubNavTabs';
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
  onToggleHabitDay: (habitIndex: number, dayOfMonth: number) => void;
  onAddHabit: (habit: Omit<HabitTemplate, 'id'>) => void;
  onUpdateHabit: (index: number, habit: HabitTemplate) => void;
  onDeleteHabit: (index: number) => void;
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
  onToggleHabitDay,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onReorderHabits,
  onNavigate,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isReorderOpen, setIsReorderOpen] = useState(false);
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

  const weekDays = getWeekDates(selectedDate);
  const daysInCurrentMonth = getDaysInMonth(year, monthIndex);

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
    if (toIndex < 0 || toIndex >= habits.length) return;
    const copy = [...habits];
    const [moved] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, moved);
    onReorderHabits(copy);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Segmented Sub-Navigation for Habits/Projects/Rankings */}
      {onNavigate && (
        <SubNavTabs
          activePage="track"
          onNavigate={onNavigate}
          tabs={[
            { id: 'track', label: 'Habits', icon: <HabitCloverDockIcon size={15} /> },
            { id: 'project', label: 'Projects', icon: <BambooProjectDockIcon size={15} /> },
            { id: 'best', label: 'Leaderboard', icon: <Trophy size={14} className="text-[#d98236]" /> },
          ]}
        />
      )}

      {/* Month Header Navigation & Actions (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-[#fdfbf7]/90 dark:bg-[#161311]/90 backdrop-blur-xl pt-1 pb-1 space-y-3">
        <div className="ios-glass-card p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <button
              id="habit-prev-month"
              type="button"
              onClick={onPrevMonth}
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white dark:bg-white/[0.08] dark:hover:bg-white/[0.15] flex items-center justify-center font-bold text-[#4a4036] dark:text-[#e0d6cb] transition border border-black/[0.06] dark:border-white/[0.1] shadow-2xs ios-tap"
              aria-label="Previous Month"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <p className="text-[10.5px] font-bold text-[#8c7e70] dark:text-[#a89b8d] uppercase tracking-wider">
                Habit Calendar
              </p>
              <strong id="CroakleTrackMonth" className="text-xl font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
                {MONTH_NAMES[monthIndex]} {year}
              </strong>
            </div>
            <button
              id="habit-next-month"
              type="button"
              onClick={onNextMonth}
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white dark:bg-white/[0.08] dark:hover:bg-white/[0.15] flex items-center justify-center font-bold text-[#4a4036] dark:text-[#e0d6cb] transition border border-black/[0.06] dark:border-white/[0.1] shadow-2xs ios-tap"
              aria-label="Next Month"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* 7-Day Header */}
          <div className="grid grid-cols-7 gap-1.5 text-center font-bold text-xs text-[#8c7e70] dark:text-[#a89b8d] uppercase tracking-wider">
            {DAY_SHORT_NAMES.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          {/* 7-Day Dates Row */}
          <div className="grid grid-cols-7 gap-1.5">
            {weekDays.map((wd) => {
              const isSelected = formatIsoDate(wd.date) === formatIsoDate(selectedDate);
              return (
                <button
                  key={wd.iso}
                  type="button"
                  onClick={() => onSelectDate(wd.date)}
                  className={`py-2 rounded-[18px] text-center flex flex-col items-center transition-all ios-tap ${
                    isSelected
                      ? 'bg-[#5f7a61] text-white dark:bg-[#7d9d80] dark:text-[#171513] font-black shadow-[0_4px_12px_rgba(95,122,97,0.3)] scale-[1.04]'
                      : wd.isCurrentDay
                      ? 'bg-[#f5efe6] dark:bg-[#2c2722] text-[#2d2823] dark:text-[#f4efe8] font-bold border border-[#d8cbbb] dark:border-[#423930]'
                      : 'text-[#574d42] dark:text-[#d4c8bc] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] font-semibold'
                  }`}
                >
                  <span className="text-sm">{wd.date.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons: Add Habit & Reorder (Locked) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            id="CroakleOpenAddHabit"
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 py-2.5 sm:py-3 px-4 rounded-[22px] bg-[#5f7a61] hover:bg-[#4f6751] dark:bg-[#7d9d80] dark:hover:bg-[#6c8c6f] text-white dark:text-[#171513] font-black text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(95,122,97,0.3)] transition ios-tap"
          >
            <Plus size={18} /> Add New Habit
          </button>
          <button
            id="CroakleOpenReorderHabit"
            type="button"
            onClick={() => setIsReorderOpen(true)}
            className="py-2.5 sm:py-3 px-3.5 rounded-[22px] bg-white/80 dark:bg-white/[0.08] hover:bg-white dark:hover:bg-white/[0.14] text-[#4a4036] dark:text-[#e0d6cb] border border-black/[0.06] dark:border-white/[0.1] font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition ios-tap"
            title="Reorder Habits"
          >
            <ArrowUpDown size={16} /> Reorder
          </button>
        </div>
      </div>

      {/* Main Habits List Container */}
      <div className="ios-glass-card p-4 sm:p-5 space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-8 text-[#8c7e70] dark:text-[#a89b8d] space-y-3">
            <div className="w-16 h-16 mx-auto rounded-[24px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center p-2 shadow-2xs">
              <CloverIcon size={36} />
            </div>
            <div>
              <p className="font-bold text-sm text-[#2d2823] dark:text-[#f4efe8]">No habits created yet</p>
              <p className="text-xs mt-0.5">Tap "+ Add New Habit" to begin your daily rhythm</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {habits.map((habit, hIdx) => {
              const monthHabit = monthData.habits[hIdx];
              // calculate this week's completed count
              const completedThisWeek = weekDays.reduce((acc, wd) => {
                if (wd.date.getMonth() === monthIndex && wd.date.getFullYear() === year) {
                  return acc + (monthHabit?.days[wd.date.getDate() - 1] ? 1 : 0);
                }
                return acc;
              }, 0);

              const isGoalMet = completedThisWeek >= habit.goal;

              return (
                <div
                  key={habit.id || hIdx}
                  className="p-4 rounded-[24px] border border-black/[0.05] dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.04] space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(hIdx)}
                      className="text-left group flex items-center gap-2 min-w-0"
                    >
                      <span className="font-black text-sm text-[#2d2823] dark:text-[#f4efe8] group-hover:underline truncate">
                        {habit.name}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#4a4036] dark:text-[#e0d6cb]">
                        {completedThisWeek}/{habit.goal} days/week
                      </span>
                    </button>

                    {isGoalMet && (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#e8f2e9] dark:bg-[#223324] text-[#466948] dark:text-[#8fc493] shadow-2xs">
                        Goal Met ✨
                      </span>
                    )}
                  </div>

                  {habit.description && (
                    <p className="text-xs text-[#8c7e70] dark:text-[#a89b8d] line-clamp-1">{habit.description}</p>
                  )}

                  {/* 7 Days Checkbox squircle buttons */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {weekDays.map((wd) => {
                      const isCurrentMonthDay = wd.date.getMonth() === monthIndex && wd.date.getFullYear() === year;
                      const dayNumber = wd.date.getDate();
                      const isDone = isCurrentMonthDay && Boolean(monthHabit?.days[dayNumber - 1]);

                      return (
                        <button
                          key={`${habit.id}-${wd.iso}`}
                          type="button"
                          disabled={!isCurrentMonthDay}
                          onClick={() => handleToggleDay(hIdx, wd.date)}
                          title={`${wd.iso}: ${isDone ? 'Completed' : 'Not done'}`}
                          className={`h-11 rounded-[16px] flex items-center justify-center transition-all ios-tap ${
                            !isCurrentMonthDay
                              ? 'opacity-20 cursor-not-allowed bg-black/[0.03] dark:bg-white/[0.02]'
                              : isDone
                              ? 'bg-[#5f7a61] text-white dark:bg-[#7d9d80] dark:text-[#171513] shadow-[0_4px_12px_rgba(95,122,97,0.3)] scale-[0.98] font-bold'
                              : 'bg-white dark:bg-[#211e1b] border border-black/[0.08] dark:border-white/[0.1] hover:border-[#5f7a61]'
                          }`}
                        >
                          {isDone ? <Check size={18} strokeWidth={3} /> : null}
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#faf6ef] dark:bg-[#211a14] border-2 border-[#e3d3bd] dark:border-[#382d22] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloverIcon size={22} />
                <h2 className="text-xl font-black tracking-tight text-[#2d2823] dark:text-[#f2eee9]">Add Habit</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-[#eee5d8] dark:bg-[#383129] flex items-center justify-center text-[#5c5042] hover:text-[#2d2823] dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 20 pages"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ebdccb] dark:border-[#3a3026] bg-white dark:bg-[#2a221b] text-[#2d2823] dark:text-[#f2eee9] font-medium focus:outline-none focus:ring-2 focus:ring-[#5f7a61] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">
                  Goal Per Week: {newGoal} days
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={newGoal}
                  onChange={(e) => setNewGoal(Number(e.target.value))}
                  className="w-full accent-[#5f7a61] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Science fiction or philosophy"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#ebdccb] dark:border-[#3a3026] bg-white dark:bg-[#2a221b] text-[#2d2823] dark:text-[#f2eee9] text-sm focus:outline-none focus:ring-2 focus:ring-[#5f7a61] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'low'] as PriorityType[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize border transition ${
                        newPriority === p
                          ? 'border-[#5f7a61] bg-[#5f7a61] text-white shadow-xs'
                          : 'border-[#ebdccb] dark:border-[#3a3026] bg-white dark:bg-[#2a221b] text-[#5c5042] dark:text-[#d4c8bc]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#5f7a61] hover:bg-[#4f6751] text-white font-extrabold text-sm shadow-md transition"
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#faf6ef] dark:bg-[#211a14] border-2 border-[#e3d3bd] dark:border-[#382d22] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
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
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Trash2 size={13} /> Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(false)}
                    className="px-2 py-1.5 rounded-xl bg-[#eee5d8] dark:bg-[#383129] text-[#4a4036] dark:text-[#e0d6cb] font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(true)}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              )}
              <h2 className="text-xl font-black tracking-tight text-[#2d2823] dark:text-[#f2eee9]">Habit Details</h2>
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setDeleteConfirm(false);
                }}
                className="w-8 h-8 rounded-full bg-[#eee5d8] dark:bg-[#383129] flex items-center justify-center text-[#5c5042] hover:text-[#2d2823] dark:hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ebdccb] dark:border-[#3a3026] bg-white dark:bg-[#2a221b] text-[#2d2823] dark:text-[#f2eee9] font-medium focus:outline-none focus:ring-2 focus:ring-[#5f7a61] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">
                  Goal Per Week: {editGoal} days
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={editGoal}
                  onChange={(e) => setEditGoal(Number(e.target.value))}
                  className="w-full accent-[#5f7a61] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#ebdccb] dark:border-[#3a3026] bg-white dark:bg-[#2a221b] text-[#2d2823] dark:text-[#f2eee9] text-sm focus:outline-none focus:ring-2 focus:ring-[#5f7a61] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'low'] as PriorityType[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditPriority(p)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize border transition ${
                        editPriority === p
                          ? 'border-[#5f7a61] bg-[#5f7a61] text-white shadow-xs'
                          : 'border-[#ebdccb] dark:border-[#3a3026] bg-white dark:bg-[#2a221b] text-[#5c5042] dark:text-[#d4c8bc]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#5f7a61] hover:bg-[#4f6751] text-white font-extrabold text-sm shadow-md transition"
              >
                Update Habit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reorder Habits Dialog */}
      {isReorderOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#faf6ef] dark:bg-[#211a14] border-2 border-[#e3d3bd] dark:border-[#382d22] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight text-[#2d2823] dark:text-[#f2eee9]">Reorder Habits</h2>
              <button
                type="button"
                onClick={() => setIsReorderOpen(false)}
                className="w-8 h-8 rounded-full bg-[#eee5d8] dark:bg-[#383129] flex items-center justify-center text-[#5c5042] hover:text-[#2d2823] dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {habits.map((habit, idx) => (
                <div
                  key={habit.id || idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#2a221b] border border-[#ebdccb] dark:border-[#3a3026]"
                >
                  <span className="font-bold text-sm text-[#2d2823] dark:text-[#f2eee9] truncate">{habit.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveHabit(idx, idx - 1)}
                      className="w-8 h-8 rounded-lg bg-[#f5efe6] dark:bg-[#383129] disabled:opacity-30 flex items-center justify-center font-bold"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={idx === habits.length - 1}
                      onClick={() => handleMoveHabit(idx, idx + 1)}
                      className="w-8 h-8 rounded-lg bg-[#f5efe6] dark:bg-[#383129] disabled:opacity-30 flex items-center justify-center font-bold"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsReorderOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#5f7a61] hover:bg-[#4f6751] text-white font-extrabold text-sm shadow-md transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
