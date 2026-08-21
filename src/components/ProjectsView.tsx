import React, { useState } from 'react';
import { PageType, Project, PriorityType } from '../types';
import { DAY_SHORT_NAMES, MONTH_NAMES, getWeekDates, getWeekKey, formatIsoDate } from '../utils/dateUtils';
import { Plus, ArrowUpDown, ChevronLeft, ChevronRight, Check, Trash2, X, Archive, CheckCircle, Trophy } from 'lucide-react';
import { BambooScrollDockIcon, HabitCloverDockIcon, BambooProjectDockIcon } from './FrogIcons';
import { SubNavTabs } from './SubNavTabs';
import confetti from 'canvas-confetti';

interface ProjectsViewProps {
  projects: Project[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
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
  selectedDate,
  onSelectDate,
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
  const [isReorderOpen, setIsReorderOpen] = useState(false);
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

  const weekDays = getWeekDates(selectedDate);
  const currentWeekKey = getWeekKey(selectedDate);

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
    if (toIdx < 0 || toIdx >= projects.length) return;
    const copy = [...projects];
    const [moved] = copy.splice(fromIdx, 1);
    copy.splice(toIdx, 0, moved);
    onReorderProjects(copy);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Segmented Sub-Navigation for Habits/Projects/Rankings */}
      {onNavigate && (
        <SubNavTabs
          activePage="project"
          onNavigate={onNavigate}
          tabs={[
            { id: 'track', label: 'Habits', icon: <HabitCloverDockIcon size={15} /> },
            { id: 'project', label: 'Projects', icon: <BambooProjectDockIcon size={15} /> },
            { id: 'best', label: 'Leaderboard', icon: <Trophy size={14} className="text-[#d98236]" /> },
          ]}
        />
      )}

      {/* Week Header Navigation & Actions (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-[#fdfbf7]/90 dark:bg-[#161311]/90 backdrop-blur-xl pt-1 pb-1 space-y-3">
        <div className="ios-glass-card p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onPrevWeek}
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white dark:bg-white/[0.08] dark:hover:bg-white/[0.15] flex items-center justify-center font-bold text-[#4a4036] dark:text-[#e0d6cb] transition border border-black/[0.06] dark:border-white/[0.1] shadow-2xs ios-tap"
              aria-label="Previous Week"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <p className="text-[10.5px] font-bold text-[#8c7e70] dark:text-[#a89b8d] uppercase tracking-wider">
                {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </p>
              <strong id="CroakleProjectMonth" className="text-xl font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8] block">
                Week {currentWeekKey}
              </strong>
            </div>
            <button
              type="button"
              onClick={onNextWeek}
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white dark:bg-white/[0.08] dark:hover:bg-white/[0.15] flex items-center justify-center font-bold text-[#4a4036] dark:text-[#e0d6cb] transition border border-black/[0.06] dark:border-white/[0.1] shadow-2xs ios-tap"
              aria-label="Next Week"
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
                      ? 'bg-[#b86f52] text-white dark:bg-[#d68767] dark:text-[#171513] font-black shadow-[0_4px_12px_rgba(184,111,82,0.3)] scale-[1.04]'
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

        {/* Action Buttons: Add Project, Completed Toggle & Reorder (Locked on a single line) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            id="CroakleOpenAddProject"
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-[22px] bg-[#b86f52] hover:bg-[#a25d43] dark:bg-[#d68767] dark:hover:bg-[#c27656] text-white dark:text-[#171513] font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_6px_20px_rgba(184,111,82,0.3)] transition whitespace-nowrap ios-tap"
          >
            <Plus size={16} className="shrink-0" />
            <span>Add New Project</span>
          </button>
          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className={`py-2.5 sm:py-3 px-2.5 sm:px-3.5 rounded-[22px] border font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition shrink-0 whitespace-nowrap ios-tap ${
              showArchived
                ? 'bg-[#28231d] text-[#fbf8f5] border-[#3d362e]'
                : 'bg-white/80 dark:bg-white/[0.08] text-[#4a4036] dark:text-[#e0d6cb] border-black/[0.06] dark:border-white/[0.1] hover:bg-white dark:hover:bg-white/[0.14]'
            }`}
          >
            <Archive size={14} className="shrink-0" />
            <span>{showArchived ? 'Active' : `Done (${archivedProjects.length})`}</span>
          </button>
          <button
            id="CroakleOpenReorderProject"
            type="button"
            onClick={() => setIsReorderOpen(true)}
            className="py-2.5 sm:py-3 px-2.5 sm:px-3 rounded-[22px] bg-white/80 dark:bg-white/[0.08] hover:bg-white dark:hover:bg-white/[0.14] border border-black/[0.06] dark:border-white/[0.1] text-[#4a4036] dark:text-[#e0d6cb] font-bold text-sm shadow-2xs transition shrink-0 ios-tap"
            title="Reorder"
          >
            <ArrowUpDown size={15} />
          </button>
        </div>
      </div>

      {/* Project List */}
      <div className="ios-glass-card p-4 sm:p-5 space-y-4">
        {displayedProjects.length === 0 ? (
          <div className="text-center py-8 text-[#8c7e70] dark:text-[#a89b8d] space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-[#f5efe6] dark:bg-[#282420] border border-[#e8ded1] dark:border-[#383129] flex items-center justify-center p-2 shadow-xs">
              <BambooScrollDockIcon size={36} className="text-[#b87333]" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#2d2823] dark:text-[#f2eee9]">
                {showArchived ? 'No completed projects yet' : 'No active projects right now'}
              </p>
              <p className="text-xs mt-0.5">
                {showArchived ? 'Finished projects will be archived here' : 'Tap "+ Add New Project" to get started'}
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
                      ? 'border-black/[0.04] dark:border-white/[0.05] bg-white/40 dark:bg-white/[0.02] opacity-70'
                      : 'border-black/[0.05] dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.04]'
                  } space-y-3 shadow-xs`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(originalIndex)}
                      className="text-left group flex items-center gap-2 min-w-0"
                    >
                      <span className={`font-black text-sm text-[#2d2823] dark:text-[#f4efe8] group-hover:underline truncate ${project.completed ? 'line-through text-[#8c7e70]' : ''}`}>
                        {project.name}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#4a4036] dark:text-[#e0d6cb]">
                        {completedCount}/{project.goal} days/week
                      </span>
                    </button>

                    {isGoalMet && (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#f8efe8] dark:bg-[#342721] text-[#b86f52] dark:text-[#d68767] shadow-2xs">
                        Goal Met 🎉
                      </span>
                    )}
                  </div>

                  {project.description && (
                    <p className="text-xs text-[#8c7e70] dark:text-[#a89b8d] line-clamp-1">{project.description}</p>
                  )}

                  {/* 7 Days Checkbox squircle buttons */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {weekDays.map((wd, dayIdx) => {
                      const isDone = Boolean(weekChecks[dayIdx]);

                      return (
                        <button
                          key={`${project.id}-${wd.iso}`}
                          type="button"
                          disabled={project.completed}
                          onClick={() => handleToggleDay(originalIndex, dayIdx)}
                          title={`${wd.iso}: ${isDone ? 'Completed' : 'Not done'}`}
                          className={`h-11 rounded-[16px] flex items-center justify-center transition-all ios-tap ${
                            project.completed
                              ? 'opacity-30 cursor-not-allowed bg-black/[0.03] dark:bg-white/[0.02]'
                              : isDone
                              ? 'bg-[#b86f52] text-white dark:bg-[#d68767] dark:text-[#171513] shadow-[0_4px_12px_rgba(184,111,82,0.3)] scale-[0.98] font-bold'
                              : 'bg-white dark:bg-[#211e1b] border border-black/[0.08] dark:border-white/[0.1] hover:border-[#b86f52]'
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

      {/* Add Project Dialog */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#faf6ef] dark:bg-[#211a14] border-2 border-[#e3d3bd] dark:border-[#382d22] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight text-[#2d2823] dark:text-[#f2eee9]">Add Project</h2>
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
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile App MVP"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ebdccb] dark:border-[#3a3026] bg-white dark:bg-[#2a221b] text-[#2d2823] dark:text-[#f2eee9] font-medium focus:outline-none focus:ring-2 focus:ring-[#b86f52] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">
                  Goal Per Week: {newGoal} sessions/days
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={newGoal}
                  onChange={(e) => setNewGoal(Number(e.target.value))}
                  className="w-full accent-[#b86f52] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Design wireframes and code core endpoints"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#ebdccb] dark:border-[#3a3026] bg-white dark:bg-[#2a221b] text-[#2d2823] dark:text-[#f2eee9] text-sm focus:outline-none focus:ring-2 focus:ring-[#b86f52] resize-none"
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
                          ? 'border-[#b86f52] bg-[#b86f52] text-white shadow-xs'
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
                className="w-full py-3 rounded-2xl bg-[#b86f52] hover:bg-[#a25d43] text-white font-extrabold text-sm shadow-md transition"
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#faf6ef] dark:bg-[#211a14] border-2 border-[#e3d3bd] dark:border-[#382d22] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
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
              <h2 className="text-xl font-black tracking-tight text-[#2d2823] dark:text-[#f2eee9]">Project Details</h2>
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
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ebdccb] dark:border-[#3a3026] bg-white dark:bg-[#2a221b] text-[#2d2823] dark:text-[#f2eee9] font-medium focus:outline-none focus:ring-2 focus:ring-[#b86f52] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">
                  Goal Per Week: {editGoal} sessions/days
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={editGoal}
                  onChange={(e) => setEditGoal(Number(e.target.value))}
                  className="w-full accent-[#b86f52] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#ebdccb] dark:border-[#3a3026] bg-white dark:bg-[#2a221b] text-[#2d2823] dark:text-[#f2eee9] text-sm focus:outline-none focus:ring-2 focus:ring-[#b86f52] resize-none"
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
                          ? 'border-[#b86f52] bg-[#b86f52] text-white shadow-xs'
                          : 'border-[#ebdccb] dark:border-[#3a3026] bg-white dark:bg-[#2a221b] text-[#5c5042] dark:text-[#d4c8bc]'
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
                  className="py-3 rounded-2xl bg-[#b86f52] hover:bg-[#a25d43] text-white font-extrabold text-sm shadow-md transition"
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
                  className="py-3 rounded-2xl bg-[#eee5d8] hover:bg-[#e1d5c4] dark:bg-[#383129] dark:hover:bg-[#473e35] text-[#2d2823] dark:text-[#f2eee9] font-bold text-sm transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={16} />
                  {projects[editingIndex]?.completed ? 'Mark Active' : 'Finished'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reorder Projects Modal */}
      {isReorderOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#faf6ef] dark:bg-[#211a14] border-2 border-[#e3d3bd] dark:border-[#382d22] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight text-[#2d2823] dark:text-[#f2eee9]">Reorder Projects</h2>
              <button
                type="button"
                onClick={() => setIsReorderOpen(false)}
                className="w-8 h-8 rounded-full bg-[#eee5d8] dark:bg-[#383129] flex items-center justify-center text-[#5c5042] hover:text-[#2d2823] dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#2a221b] border border-[#ebdccb] dark:border-[#3a3026]"
                >
                  <span className="font-bold text-sm text-[#2d2823] dark:text-[#f2eee9] truncate">{proj.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveProject(idx, idx - 1)}
                      className="w-8 h-8 rounded-lg bg-[#f5efe6] dark:bg-[#383129] disabled:opacity-30 flex items-center justify-center font-bold"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={idx === projects.length - 1}
                      onClick={() => handleMoveProject(idx, idx + 1)}
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
              className="w-full py-3 rounded-2xl bg-[#b86f52] hover:bg-[#a25d43] text-white font-extrabold text-sm shadow-md transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
