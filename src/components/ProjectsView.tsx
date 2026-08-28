import React, { useState } from 'react';
import { PageType, Project, PriorityType } from '../types';
import { DAY_SHORT_NAMES, MONTH_NAMES, getWeekDates, getMonthWeeks, getWeekKey, formatIsoDate } from '../utils/dateUtils';
import { Plus, ArrowUpDown, ChevronLeft, ChevronRight, Trash2, X, Archive, Trophy, GripVertical, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, Sparkles, ArrowDownAZ, Smile, CheckCircle2, FolderKanban } from 'lucide-react';
import { BambooScrollDockIcon, HabitCloverDockIcon, BambooProjectDockIcon, PixelPartyPopperIcon, PixelCheckIcon, PixelCheckCircleIcon, FrogFaceDockIcon, PixelFrogCrownIcon } from './FrogIcons';
import { SubNavTabs } from './SubNavTabs';
import { CalendarPickerModal } from './CalendarPickerModal';
import { useSwipeMonth } from '../hooks/useSwipeMonth';
import confetti from 'canvas-confetti';

interface ProjectsViewProps {
  projects: Project[];
  year: number;
  monthIndex: number;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  onToggleProjectDay: (projectIndex: number, dayIndex: number, weekKey: string) => void;
  onAddProject: (project: Omit<Project, 'id' | 'weeklyDays'>) => void;
  onUpdateProject: (index: number, project: Project) => void;
  onDeleteProject: (index: number) => void;
  onToggleCompleteProject: (index: number) => void;
  onReorderProjects: (projects: Project[]) => void;
  onNavigate?: (page: PageType) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  year,
  monthIndex,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onPrevWeek,
  onNextWeek,
  onToggleProjectDay,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onToggleCompleteProject,
  onReorderProjects,
  onNavigate,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [draggedProjectIdx, setDraggedProjectIdx] = useState<number | null>(null);
  const [dragOverProjectIdx, setDragOverProjectIdx] = useState<number | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Add form
  const [newName, setNewName] = useState('');
  const [newGoal, setNewGoal] = useState(3);
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityType>('medium');

  // Edit form
  const [editName, setEditName] = useState('');
  const [editGoal, setEditGoal] = useState(3);
  const [editDesc, setEditDesc] = useState('');
  const [editPriority, setEditPriority] = useState<PriorityType>('medium');

  const monthWeeks = getMonthWeeks(year, monthIndex);
  const activeWeekIndex = monthWeeks.findIndex((w) =>
    w.days.some((d) => formatIsoDate(d.date) === formatIsoDate(selectedDate))
  );
  const currentWeek = monthWeeks[activeWeekIndex >= 0 ? activeWeekIndex : 0] || monthWeeks[0];
  const weekDays = currentWeek?.days || [];
  const currentWeekKey = currentWeek?.weekKey || getWeekKey(selectedDate);

  const activeProjects = projects.filter((p) => !p.completed);
  const archivedProjects = projects.filter((p) => p.completed);
  const displayedProjects = showArchived ? archivedProjects : activeProjects;

  const handleOpenAdd = () => {
    setNewName('');
    setNewGoal(3);
    setNewDesc('');
    setNewPriority('medium');
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddProject({
      name: newName.trim(),
      goal: Math.max(1, Math.min(7, newGoal)),
      description: newDesc.trim(),
      priority: newPriority,
      completed: false,
    });
    setIsAddOpen(false);
  };

  const handleOpenEdit = (originalIndex: number) => {
    const p = projects[originalIndex];
    if (!p) return;
    setEditingIndex(originalIndex);
    setDeleteConfirm(false);
    setEditName(p.name);
    setEditGoal(p.goal);
    setEditDesc(p.description || '');
    setEditPriority(p.priority || 'medium');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex === null || !editName.trim()) return;
    const current = projects[editingIndex];
    onUpdateProject(editingIndex, {
      ...current,
      name: editName.trim(),
      goal: Math.max(1, Math.min(7, editGoal)),
      description: editDesc.trim(),
      priority: editPriority,
    });
    setEditingIndex(null);
  };

  const handleToggleDay = (projOriginalIndex: number, dayIdx: number) => {
    onToggleProjectDay(projOriginalIndex, dayIdx, currentWeekKey);
    const proj = projects[projOriginalIndex];
    const isDone = proj?.weeklyDays?.[currentWeekKey]?.[dayIdx];
    if (!isDone) {
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.7 },
      });
    }
  };

  const handleMoveProject = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= projects.length || fromIdx === toIdx) return;
    const copy = [...projects];
    const [moved] = copy.splice(fromIdx, 1);
    copy.splice(toIdx, 0, moved);
    onReorderProjects(copy);
  };

  const handleMoveProjectToTop = (index: number) => {
    handleMoveProject(index, 0);
  };

  const handleMoveProjectToBottom = (index: number) => {
    handleMoveProject(index, projects.length - 1);
  };

  const handleSortProjectsAZ = () => {
    const sorted = [...projects].sort((a, b) => a.name.localeCompare(b.name));
    onReorderProjects(sorted);
  };

  const handleSortProjectsByPriority = () => {
    const priorityWeight: Record<PriorityType, number> = { high: 1, medium: 2, low: 3 };
    const sorted = [...projects].sort((a, b) => (priorityWeight[a.priority] || 2) - (priorityWeight[b.priority] || 2));
    onReorderProjects(sorted);
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
      {/* Top Segmented Sub-Navigation for Mood / Habits / Projects */}
      {onNavigate && (
        <SubNavTabs
          activePage="project"
          onNavigate={onNavigate}
          tabs={[
            { id: 'mood', label: 'Mood' },
            { id: 'track', label: 'Habits' },
            { id: 'project', label: 'Projects' },
          ]}
        />
      )}

      {/* Sticky iOS 26 Glass Header with integrated Month & Week navigation */}
      <div className="sticky top-0 z-20 bg-white/85 dark:bg-black/85 backdrop-blur-2xl pt-1 pb-1 space-y-2.5">
        <div className="ios-glass-card p-3.5 sm:p-4 space-y-3 touch-pan-y" {...swipeHandlers}>
          {/* Top Row: Week Navigation */}
          <div className="flex items-center justify-between">
            <button
              id="project-prev-week"
              type="button"
              onClick={handleGoPrevWeek}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center font-bold text-zinc-800 dark:text-zinc-200 transition-all ios-tap"
              aria-label="Previous Week"
              title="Previous Week"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => setIsCalendarOpen(true)}
              className="flex flex-col items-center px-2.5 py-0.5 -my-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition active:scale-95 cursor-pointer group"
              title="Click to open calendar"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Projects
              </p>
              <div className="flex items-center gap-2">
                <strong id="CroakleProjectMonth" className="text-base sm:text-lg font-black tracking-tight text-zinc-950 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                  {MONTH_NAMES[monthIndex]} {year}
                </strong>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {currentWeek?.label}
                </span>
              </div>
            </button>

            <button
              id="project-next-week"
              type="button"
              onClick={handleGoNextWeek}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center font-bold text-zinc-800 dark:text-zinc-200 transition-all ios-tap"
              aria-label="Next Week"
              title="Next Week"
            >
              <ChevronRight size={18} />
            </button>
          </div>

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

        {/* Action Buttons: Add Project, Completed Toggle & Reorder (Locked on a single line) */}
        <div className="flex items-center gap-2">
          <button
            id="CroakleOpenAddProject"
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 py-2.5 px-4 rounded-[20px] bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all ios-tap"
          >
            <Plus size={16} className="shrink-0" />
            <span>Add Project</span>
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
            <span>{showArchived ? 'Active' : `Done (${archivedProjects.length})`}</span>
          </button>
          <button
            id="CroakleOpenReorderProject"
            type="button"
            onClick={() => setIsReorderOpen(true)}
            className="py-2.5 px-3 rounded-[20px] bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-all ios-tap shrink-0"
            title="Reorder Projects"
          >
            <ArrowUpDown size={14} />
            <span>Reorder</span>
          </button>
        </div>
      </div>

      {/* Project List */}
      <div className="ios-glass-card p-4 sm:p-5 space-y-4">
        {displayedProjects.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 dark:text-zinc-500 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center p-2 shadow-xs text-zinc-500 dark:text-zinc-400">
              <BambooScrollDockIcon size={36} />
            </div>
            <div>
              <p className="font-bold text-sm text-zinc-950 dark:text-white">
                {showArchived ? 'No completed projects yet' : 'No active projects right now'}
              </p>
              <p className="text-xs mt-0.5">
                {showArchived ? 'Finished projects will be archived here' : 'Tap "+ Add Project" to get started'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {displayedProjects.map((project) => {
              const originalIndex = projects.findIndex((p) => p.id === project.id);
              const weekChecks = project.weeklyDays?.[currentWeekKey] || new Array(7).fill(false);
              const completedCount = weekChecks.reduce((acc, c) => acc + (c ? 1 : 0), 0);
              const isGoalMet = completedCount >= project.goal;

              return (
                <div
                  key={project.id}
                  className={`p-4 rounded-[24px] border ${
                    project.completed
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
                      <span className={`font-black text-sm text-zinc-950 dark:text-white group-hover:underline truncate ${project.completed ? 'line-through text-zinc-400' : ''}`}>
                        {project.name}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {completedCount}/{project.goal} days/week
                      </span>
                    </button>

                    {isGoalMet && (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-2xs">
                        Goal Met
                      </span>
                    )}
                  </div>

                  {project.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{project.description}</p>
                  )}

                  {/* 7 Days Checkbox squircle buttons */}
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {weekDays.map((wd, dayIdx) => {
                      const isDone = Boolean(weekChecks[dayIdx]);

                      return (
                        <button
                          key={`${project.id}-${wd.iso}`}
                          type="button"
                          disabled={project.completed}
                          onClick={() => handleToggleDay(originalIndex, dayIdx)}
                          title={`${wd.iso}: ${isDone ? 'Completed' : 'Not done'}`}
                          className={`aspect-square w-full rounded-[14px] sm:rounded-[16px] flex items-center justify-center transition-all ios-tap ${
                            project.completed
                              ? 'opacity-30 cursor-not-allowed bg-transparent border border-dashed border-zinc-200 dark:border-zinc-800'
                              : isDone
                              ? 'bg-transparent border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 active:scale-95'
                              : 'bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 active:scale-95'
                          }`}
                        >
                          {isDone ? <PixelFrogCrownIcon size={34} className="w-7 h-7 sm:w-8 sm:h-8 animate-in zoom-in-75 duration-150" /> : null}
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

      {/* Add Project Dialog */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Add Project</h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile App MVP"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Goal Per Week: {newGoal} sessions/days
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={newGoal}
                  onChange={(e) => setNewGoal(Number(e.target.value))}
                  className="w-full accent-black dark:accent-white cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Design wireframes and code core endpoints"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'low'] as PriorityType[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize border transition ${
                        newPriority === p
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-black text-sm shadow-md transition"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Dialog */}
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
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              {deleteConfirm ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteProject(editingIndex);
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
                    className="px-2 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs"
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
              <h2 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Project Details</h2>
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setDeleteConfirm(false);
                }}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Goal Per Week: {editGoal} sessions/days
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={editGoal}
                  onChange={(e) => setEditGoal(Number(e.target.value))}
                  className="w-full accent-black dark:accent-white cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'low'] as PriorityType[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditPriority(p)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize border transition ${
                        editPriority === p
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="submit"
                  className="py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-extrabold text-sm shadow-md transition"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleCompleteProject(editingIndex);
                    setEditingIndex(null);
                    setDeleteConfirm(false);
                  }}
                  className="py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-sm transition flex items-center justify-center gap-1.5"
                >
                  <PixelCheckCircleIcon size={16} />
                  {projects[editingIndex]?.completed ? 'Mark Active' : 'Finished'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reorder Projects Modal */}
      {isReorderOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsReorderOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
                  <ArrowUpDown size={20} className="text-[#007AFF]" />
                  Reorder Projects
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Drag items or use the quick buttons to customize order
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReorderOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Sort Helpers */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
              <span className="text-zinc-400 uppercase tracking-wider font-extrabold shrink-0 mr-1 text-[10px]">
                Quick Sort:
              </span>
              <button
                type="button"
                onClick={handleSortProjectsAZ}
                className="px-2.5 py-1 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition flex items-center gap-1 shrink-0 ios-tap"
              >
                <ArrowDownAZ size={12} />
                <span>A → Z</span>
              </button>
              <button
                type="button"
                onClick={handleSortProjectsByPriority}
                className="px-2.5 py-1 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition flex items-center gap-1 shrink-0 ios-tap"
              >
                <Sparkles size={12} className="text-[#FFCC00]" />
                <span>By Priority</span>
              </button>
              <button
                type="button"
                onClick={() => onReorderProjects([...projects].reverse())}
                className="px-2.5 py-1 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition shrink-0 ios-tap"
              >
                Reverse
              </button>
            </div>

            {/* Projects Reorder List with Drag and Drop */}
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {projects.map((proj, idx) => {
                const isDragging = draggedProjectIdx === idx;
                const isDragOver = dragOverProjectIdx === idx && draggedProjectIdx !== idx;

                return (
                  <div
                    key={proj.id || idx}
                    draggable
                    onDragStart={() => setDraggedProjectIdx(idx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverProjectIdx(idx);
                    }}
                    onDragLeave={() => {
                      if (dragOverProjectIdx === idx) setDragOverProjectIdx(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedProjectIdx !== null && draggedProjectIdx !== idx) {
                        handleMoveProject(draggedProjectIdx, idx);
                      }
                      setDraggedProjectIdx(null);
                      setDragOverProjectIdx(null);
                    }}
                    onDragEnd={() => {
                      setDraggedProjectIdx(null);
                      setDragOverProjectIdx(null);
                    }}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all duration-150 select-none ${
                      isDragging
                        ? 'opacity-40 scale-[0.98] border-black dark:border-white bg-zinc-100 dark:bg-zinc-800'
                        : isDragOver
                        ? 'border-2 border-[#007AFF] bg-blue-50 dark:bg-blue-950/20 shadow-md'
                        : 'bg-zinc-50/50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      {/* Drag Handle */}
                      <div 
                        className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
                        title="Drag to reorder"
                      >
                        <GripVertical size={16} />
                      </div>

                      {/* Number Position Badge */}
                      <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-black text-[11px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      <div className="min-w-0">
                        <p className={`font-bold text-sm text-zinc-950 dark:text-white truncate ${proj.completed ? 'line-through text-zinc-400' : ''}`}>
                          {proj.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                              proj.priority === 'high'
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                                : proj.priority === 'medium'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                            }`}
                          >
                            {proj.priority}
                          </span>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                            {proj.targetWeeklyDays}d/wk
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
                        onClick={() => handleMoveProjectToTop(idx)}
                        title="Move to top"
                        className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition"
                      >
                        <ChevronsUp size={13} />
                      </button>

                      {/* Move Up 1 */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveProject(idx, idx - 1)}
                        title="Move up"
                        className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition"
                      >
                        <ChevronUp size={14} />
                      </button>

                      {/* Move Down 1 */}
                      <button
                        type="button"
                        disabled={idx === projects.length - 1}
                        onClick={() => handleMoveProject(idx, idx + 1)}
                        title="Move down"
                        className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition"
                      >
                        <ChevronDown size={14} />
                      </button>

                      {/* Send to Bottom */}
                      <button
                        type="button"
                        disabled={idx === projects.length - 1}
                        onClick={() => handleMoveProjectToBottom(idx)}
                        title="Move to bottom"
                        className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition"
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
              className="w-full py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-black text-sm shadow-md transition ios-tap"
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
        title="Project Calendar"
      />
    </div>
  );
};
