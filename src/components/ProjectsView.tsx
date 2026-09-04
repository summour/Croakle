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
      {/* TOP: DATE / WEEK NAVIGATOR (Minimalist Variation 12) */}
      <div className="sticky top-0 z-20 bg-[#F8F7F4] dark:bg-[#1D1B18] pt-1 pb-1 space-y-2.5">
        <div className="border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] p-3.5 sm:p-4 space-y-3 touch-pan-y" {...swipeHandlers}>
          {/* Top Row: Week Navigation */}
          <div className="flex items-center justify-between">
            <button
              id="project-prev-week"
              type="button"
              onClick={handleGoPrevWeek}
              className="w-7 h-7 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] flex items-center justify-center font-bold text-[#1D1B18] dark:text-[#F8F7F4] transition-all cursor-pointer hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
              aria-label="Previous Week"
              title="Previous Week"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() => setIsCalendarOpen(true)}
              className="flex flex-col items-center px-2.5 py-0.5 border border-transparent hover:border-[#1D1B18] dark:hover:border-[#F8F7F4] transition cursor-pointer group"
              title="Click to open calendar"
            >
              <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#1D1B18]/60 dark:text-[#F8F7F4]/60">
                Project Tracker
              </p>
              <div className="flex items-center gap-2">
                <strong id="CroakleProjectMonth" className="text-base sm:text-lg font-bold font-oswald tracking-tight uppercase text-[#1D1B18] dark:text-[#F8F7F4]">
                  {MONTH_NAMES[monthIndex]} {year}
                </strong>
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4]">
                  {currentWeek?.label}
                </span>
              </div>
            </button>

            <button
              id="project-next-week"
              type="button"
              onClick={handleGoNextWeek}
              className="w-7 h-7 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] flex items-center justify-center font-bold text-[#1D1B18] dark:text-[#F8F7F4] transition-all cursor-pointer hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
              aria-label="Next Week"
              title="Next Week"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 7-Day Interactive Strip */}
          <div className="grid grid-cols-7 gap-1 pt-1 border-t border-[#1D1B18] dark:border-[#F8F7F4]">
            {weekDays.map((wd) => {
              const isSelected = formatIsoDate(wd.date) === formatIsoDate(selectedDate);
              const dayName = DAY_SHORT_NAMES[wd.dayIndex];
              const dayOfMonth = wd.date.getDate();
              const weekKeyForDay = getWeekKey(wd.date);
              const hasActivity =
                wd.inMonth &&
                projects.some(
                  (p) => p.weeklyDays?.[weekKeyForDay]?.[wd.dayIndex] === true
                );

              return (
                <button
                  key={wd.iso}
                  type="button"
                  onClick={() => onSelectDate(wd.date)}
                  className={`py-1.5 px-0.5 text-center flex flex-col items-center justify-center font-mono transition-all duration-100 cursor-pointer border ${
                    !wd.inMonth
                      ? 'opacity-30 border-dashed border-[#1D1B18] dark:border-[#F8F7F4]'
                      : isSelected
                      ? 'bg-[#E63946] text-white font-bold border-[#1D1B18] dark:border-[#F8F7F4]'
                      : wd.isCurrentDay
                      ? 'bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] font-bold border-[#1D1B18] dark:border-[#F8F7F4]'
                      : 'bg-white dark:bg-[#1D1B18] text-[#1D1B18] dark:text-[#F8F7F4] border-[#1D1B18] dark:border-[#F8F7F4] hover:bg-[#F8F7F4] dark:hover:bg-[#252320]'
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold tracking-wider">{dayName}</span>
                  <span className="text-sm font-bold">{dayOfMonth}</span>
                  {hasActivity && (
                    <span
                      className={`w-1.5 h-1.5 mt-0.5 ${
                        isSelected ? 'bg-white' : 'bg-[#E63946]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Bar: Add Project, Done & Order */}
        <div className="flex items-center gap-2">
          <button
            id="CroakleOpenAddProject"
            type="button"
            onClick={handleOpenAdd}
            className="add-btn flex-1 py-2 px-3 flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
          >
            <Plus size={14} className="shrink-0" />
            <span>ADD</span>
          </button>
          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className={`py-2 px-3 border border-[#1D1B18] dark:border-[#F8F7F4] font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              showArchived
                ? 'bg-[#E63946] text-white'
                : 'bg-white dark:bg-[#1D1B18] text-[#1D1B18] dark:text-[#F8F7F4] hover:bg-[#F8F7F4] dark:hover:bg-[#252320]'
            }`}
          >
            <Archive size={13} className="shrink-0" />
            <span>{showArchived ? 'Active' : `Done (${archivedProjects.length})`}</span>
          </button>
          <button
            id="CroakleOpenReorderProject"
            type="button"
            onClick={() => setIsReorderOpen(true)}
            className="py-2 px-2.5 bg-white dark:bg-[#1D1B18] text-[#1D1B18] dark:text-[#F8F7F4] border border-[#1D1B18] dark:border-[#F8F7F4] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0 hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
            title="Reorder Projects"
          >
            <ArrowUpDown size={13} />
            <span>Order</span>
          </button>
        </div>
      </div>

      {/* Main Projects List Container */}
      <div className="space-y-4">
        {displayedProjects.length === 0 ? (
          <div className="text-center py-10 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] p-6 space-y-3">
            <p className="font-oswald text-lg uppercase font-bold text-[#1D1B18] dark:text-[#F8F7F4]">
              {showArchived ? 'No completed projects yet' : 'No active projects right now'}
            </p>
            <p className="text-xs font-mono text-[#1D1B18]/60 dark:text-[#F8F7F4]/60">
              {showArchived ? 'Finished projects will be archived here' : 'Tap "Add New Project" to begin tracking your rhythm'}
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="add-btn mt-2 inline-block"
            >
              Add New Project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedProjects.map((project) => {
              const originalIndex = projects.findIndex((p) => p.id === project.id);
              const weekChecks = project.weeklyDays?.[currentWeekKey] || new Array(7).fill(false);
              const completedCount = weekChecks.reduce((acc, c) => acc + (c ? 1 : 0), 0);
              const isGoalMet = completedCount >= project.goal;

              return (
                <div
                  key={project.id || originalIndex}
                  className="habit-card"
                >
                  <div className="habit-title">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(originalIndex)}
                      className="text-left font-bold truncate hover:opacity-80 transition cursor-pointer flex-1 mr-2 flex items-center gap-2"
                    >
                      <span className={project.completed ? 'line-through opacity-50' : ''}>
                        {project.name}
                      </span>
                      {isGoalMet && (
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 bg-[#E63946] text-white">
                          Met
                        </span>
                      )}
                    </button>
                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }} className="font-mono shrink-0">
                      {completedCount}/{project.goal}
                    </span>
                  </div>

                  {project.description && (
                    <p className="text-xs text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 font-mono mb-2 line-clamp-1">
                      {project.description}
                    </p>
                  )}

                  <div className="day-grid">
                    {weekDays.map((wd, dayIdx) => {
                      const isCurrentMonthDay = wd.inMonth;
                      const isDone = Boolean(weekChecks[dayIdx]);
                      const dayLetter = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][(wd.dayIndex + 6) % 7];

                      return (
                        <button
                          key={`${project.id}-${wd.iso}`}
                          type="button"
                          disabled={!isCurrentMonthDay || project.completed}
                          onClick={() => handleToggleDay(originalIndex, dayIdx)}
                          title={`${wd.iso}: ${isDone ? 'Completed' : 'Not done'}`}
                          className={`day-cell ${isDone ? 'active' : ''} ${
                            !isCurrentMonthDay || project.completed
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
              id="CroakleBottomAddProject"
              type="button"
              onClick={handleOpenAdd}
              className="add-btn w-full text-center py-3 cursor-pointer"
            >
              Add New Project
            </button>
          </div>
        )}
      </div>

      {/* Add Project Dialog */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-[#1D1B18]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1D1B18] border border-[#1D1B18] dark:border-[#F8F7F4] p-5 sm:p-6 w-full max-w-md space-y-4 font-mono animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#1D1B18]/20 dark:border-[#F8F7F4]/20 pb-2">
              <h2 className="text-base font-bold font-oswald uppercase tracking-tight text-[#1D1B18] dark:text-[#F8F7F4]">Add Project</h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="w-6 h-6 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 flex items-center justify-center text-[#1D1B18] dark:text-[#F8F7F4] hover:border-[#1D1B18] dark:hover:border-[#F8F7F4] cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile App MVP"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#1D1B18]/40 dark:border-[#F8F7F4]/40 bg-white dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] font-mono text-xs focus:outline-none focus:border-[#1D1B18] dark:focus:border-[#F8F7F4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">
                  Goal Per Week: {newGoal} days
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={newGoal}
                  onChange={(e) => setNewGoal(Number(e.target.value))}
                  className="w-full accent-[#E63946] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Wireframes and core features"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#1D1B18]/40 dark:border-[#F8F7F4]/40 bg-white dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] font-mono text-xs focus:outline-none focus:border-[#1D1B18] dark:focus:border-[#F8F7F4] resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['high', 'medium', 'low'] as PriorityType[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-1.5 border text-[10px] font-bold uppercase transition cursor-pointer ${
                        newPriority === p
                          ? 'border-[#E63946] bg-[#E63946] text-white'
                          : 'border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#1D1B18] hover:bg-[#1D1B18]/90 dark:bg-[#F8F7F4] dark:hover:bg-[#F8F7F4]/90 text-[#F8F7F4] dark:text-[#1D1B18] font-bold font-oswald uppercase text-xs tracking-wider transition cursor-pointer"
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
          className="fixed inset-0 z-50 bg-[#1D1B18]/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-[#1D1B18] border border-[#1D1B18] dark:border-[#F8F7F4] p-5 sm:p-6 w-full max-w-md space-y-4 font-mono animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#1D1B18]/20 dark:border-[#F8F7F4]/20 pb-2">
              <h2 className="text-base font-bold font-oswald uppercase tracking-tight text-[#1D1B18] dark:text-[#F8F7F4]">Project Details</h2>
              <div className="flex items-center gap-1.5">
                {deleteConfirm ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteProject(editingIndex);
                        setEditingIndex(null);
                        setDeleteConfirm(false);
                      }}
                      className="px-2 py-1 border border-[#E63946] bg-[#E63946] text-white font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={11} /> Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(false)}
                      className="px-2 py-1 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 text-[#1D1B18] dark:text-[#F8F7F4] font-bold text-[10px] uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(true)}
                    className="px-2 py-1 border border-[#E63946]/40 text-[#E63946] hover:border-[#E63946] font-bold text-[10px] uppercase flex items-center gap-1 transition cursor-pointer"
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
                  className="w-6 h-6 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 flex items-center justify-center text-[#1D1B18] dark:text-[#F8F7F4] hover:border-[#1D1B18] dark:hover:border-[#F8F7F4] cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#1D1B18]/40 dark:border-[#F8F7F4]/40 bg-white dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] font-mono text-xs focus:outline-none focus:border-[#1D1B18] dark:focus:border-[#F8F7F4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">
                  Goal Per Week: {editGoal} days
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={editGoal}
                  onChange={(e) => setEditGoal(Number(e.target.value))}
                  className="w-full accent-[#E63946] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#1D1B18]/40 dark:border-[#F8F7F4]/40 bg-white dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] font-mono text-xs focus:outline-none focus:border-[#1D1B18] dark:focus:border-[#F8F7F4] resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['high', 'medium', 'low'] as PriorityType[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditPriority(p)}
                      className={`py-1.5 border text-[10px] font-bold uppercase transition cursor-pointer ${
                        editPriority === p
                          ? 'border-[#E63946] bg-[#E63946] text-white'
                          : 'border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4]'
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
                  className="py-2 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#1D1B18] hover:bg-[#1D1B18]/90 dark:bg-[#F8F7F4] dark:hover:bg-[#F8F7F4]/90 text-[#F8F7F4] dark:text-[#1D1B18] font-bold font-oswald uppercase text-xs tracking-wider transition cursor-pointer"
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
                  className="py-2 border border-[#1D1B18]/40 dark:border-[#F8F7F4]/40 hover:border-[#1D1B18] dark:hover:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] font-bold font-oswald uppercase text-xs tracking-wider transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <PixelCheckCircleIcon size={14} />
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
          <div className="bg-white dark:bg-[#1D1B18] border border-[#1D1B18] dark:border-[#F8F7F4] p-4 sm:p-5 w-full max-w-lg space-y-3 font-mono animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-[#1D1B18]/20 dark:border-[#F8F7F4]/20 pb-2">
              <div>
                <h2 className="text-base font-bold font-oswald uppercase tracking-tight text-[#1D1B18] dark:text-[#F8F7F4] flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-[#E63946]" />
                  Reorder Projects
                </h2>
                <p className="text-[10px] text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mt-0.5">
                  Drag items or use the buttons to reorder
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReorderOpen(false)}
                className="w-6 h-6 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 flex items-center justify-center text-[#1D1B18] dark:text-[#F8F7F4] hover:border-[#1D1B18] dark:hover:border-[#F8F7F4] transition cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Quick Sort Helpers */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
              <span className="text-[#1D1B18]/50 dark:text-[#F8F7F4]/50 uppercase tracking-wider font-extrabold shrink-0 mr-1">
                Quick Sort:
              </span>
              <button
                type="button"
                onClick={handleSortProjectsAZ}
                className="px-2 py-1 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] hover:border-[#1D1B18] dark:hover:border-[#F8F7F4] transition flex items-center gap-1 shrink-0 uppercase cursor-pointer"
              >
                <ArrowDownAZ size={11} />
                <span>A → Z</span>
              </button>
              <button
                type="button"
                onClick={handleSortProjectsByPriority}
                className="px-2 py-1 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] hover:border-[#1D1B18] dark:hover:border-[#F8F7F4] transition flex items-center gap-1 shrink-0 uppercase cursor-pointer"
              >
                <Sparkles size={11} className="text-[#E63946]" />
                <span>By Priority</span>
              </button>
              <button
                type="button"
                onClick={() => onReorderProjects([...projects].reverse())}
                className="px-2 py-1 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] hover:border-[#1D1B18] dark:hover:border-[#F8F7F4] transition shrink-0 uppercase cursor-pointer"
              >
                Reverse
              </button>
            </div>

            {/* Projects Reorder List with Drag and Drop */}
            <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
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
                    className={`flex items-center justify-between p-2 border transition-all duration-100 select-none ${
                      isDragging
                        ? 'opacity-40 border-[#E63946] bg-[#E63946]/10'
                        : isDragOver
                        ? 'border border-[#E63946] bg-[#E63946]/5'
                        : 'bg-white dark:bg-[#1D1B18] border-[#1D1B18]/30 dark:border-[#F8F7F4]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      {/* Drag Handle */}
                      <div 
                        className="cursor-grab active:cursor-grabbing p-1 text-[#1D1B18]/40 dark:text-[#F8F7F4]/40 hover:text-[#1D1B18] dark:hover:text-[#F8F7F4] transition"
                        title="Drag to reorder"
                      >
                        <GripVertical size={14} />
                      </div>

                      {/* Number Position Badge */}
                      <span className="w-5 h-5 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      <div className="min-w-0">
                        <p className={`font-bold text-xs truncate ${proj.completed ? 'line-through text-[#1D1B18]/40 dark:text-[#F8F7F4]/40' : 'text-[#1D1B18] dark:text-[#F8F7F4]'}`}>
                          {proj.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[8.5px] font-bold uppercase px-1 border ${
                              proj.priority === 'high'
                                ? 'bg-[#E63946] text-[#F8F7F4] border-[#E63946]'
                                : proj.priority === 'medium'
                                ? 'bg-[#F8F7F4] text-[#1D1B18] border-[#1D1B18]/40 dark:bg-[#252320] dark:text-[#F8F7F4]'
                                : 'bg-transparent text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 border-[#1D1B18]/20 dark:border-[#F8F7F4]/20'
                            }`}
                          >
                            {proj.priority}
                          </span>
                          <span className="text-[9px] text-[#1D1B18]/50 dark:text-[#F8F7F4]/50">
                            {proj.targetWeeklyDays}d/wk
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Move Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveProjectToTop(idx)}
                        title="Move to top"
                        className="w-6 h-6 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-[#F8F7F4] dark:bg-[#252320] disabled:opacity-20 text-[#1D1B18] dark:text-[#F8F7F4] flex items-center justify-center transition cursor-pointer"
                      >
                        <ChevronsUp size={12} />
                      </button>

                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveProject(idx, idx - 1)}
                        title="Move up"
                        className="w-6 h-6 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-[#F8F7F4] dark:bg-[#252320] disabled:opacity-20 text-[#1D1B18] dark:text-[#F8F7F4] flex items-center justify-center transition cursor-pointer"
                      >
                        <ChevronUp size={12} />
                      </button>

                      <button
                        type="button"
                        disabled={idx === projects.length - 1}
                        onClick={() => handleMoveProject(idx, idx + 1)}
                        title="Move down"
                        className="w-6 h-6 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-[#F8F7F4] dark:bg-[#252320] disabled:opacity-20 text-[#1D1B18] dark:text-[#F8F7F4] flex items-center justify-center transition cursor-pointer"
                      >
                        <ChevronDown size={12} />
                      </button>

                      <button
                        type="button"
                        disabled={idx === projects.length - 1}
                        onClick={() => handleMoveProjectToBottom(idx)}
                        title="Move to bottom"
                        className="w-6 h-6 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-[#F8F7F4] dark:bg-[#252320] disabled:opacity-20 text-[#1D1B18] dark:text-[#F8F7F4] flex items-center justify-center transition cursor-pointer"
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
              className="w-full py-2 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#1D1B18] hover:bg-[#1D1B18]/90 dark:bg-[#F8F7F4] dark:hover:bg-[#F8F7F4]/90 text-[#F8F7F4] dark:text-[#1D1B18] font-bold font-oswald uppercase text-xs tracking-wider transition cursor-pointer"
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
