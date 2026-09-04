import React, { useState, useMemo } from 'react';
import { PageType, NoteItem, HabitTemplate, Project, MOOD_LEVELS } from '../types';
import {
  Plus,
  Trash2,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  LayoutList,
  Layers,
  Calendar,
} from 'lucide-react';
import {
  WashiJournalDockIcon,
  HabitCloverDockIcon,
  BambooProjectDockIcon,
  FrogFaceDockIcon,
  FrogMoodIcon,
} from './FrogIcons';
import { CalendarPickerModal } from './CalendarPickerModal';
import { useSwipeMonth } from '../hooks/useSwipeMonth';
import {
  DAY_SHORT_NAMES,
  MONTH_NAMES,
  getMonthWeeks,
  getWeekKey,
  formatIsoDate,
  getTodayIso,
  formatFriendlyDate,
} from '../utils/dateUtils';

interface NotesViewProps {
  notes: NoteItem[];
  habits?: HabitTemplate[];
  projects?: Project[];
  year?: number;
  monthIndex?: number;
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  onAddNote: (note: Omit<NoteItem, 'id' | 'createdAt'>) => void;
  onUpdateNote: (id: string, note: Partial<NoteItem>) => void;
  onDeleteNote: (id: string) => void;
  onNavigate?: (page: PageType) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  habits = [],
  projects = [],
  year = new Date().getFullYear(),
  monthIndex = new Date().getMonth(),
  selectedDate = new Date(),
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onPrevWeek,
  onNextWeek,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'habit' | 'project' | 'mood'>('all');
  const [scopeMode, setScopeMode] = useState<'week' | 'month' | 'day' | 'all'>('month');
  const [viewDensity, setViewDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleLimit, setVisibleLimit] = useState<number>(35);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // Form states
  const [formType, setFormType] = useState<'habit' | 'project' | 'mood' | 'general'>('habit');
  const [formSourceId, setFormSourceId] = useState('');
  const [formSourceName, setFormSourceName] = useState('');
  const [formMoodValue, setFormMoodValue] = useState<number | undefined>(undefined);
  const [formTitle, setFormTitle] = useState('');
  const [formText, setFormText] = useState('');
  const [formDate, setFormDate] = useState(formatIsoDate(selectedDate));

  const currentMonthPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  const selectedDateIso = formatIsoDate(selectedDate);

  // Calculate weeks in month for calendar strip
  const monthWeeks = useMemo(() => getMonthWeeks(year, monthIndex), [year, monthIndex]);
  const activeWeekIndex = useMemo(() => {
    const idx = monthWeeks.findIndex((w) =>
      w.days.some((d) => formatIsoDate(d.date) === selectedDateIso)
    );
    return idx >= 0 ? idx : 0;
  }, [monthWeeks, selectedDateIso]);

  const currentWeek = monthWeeks[activeWeekIndex] || monthWeeks[0];
  const weekDays = currentWeek?.days || [];

  // Map notes count per ISO date
  const notesCountByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach((n) => {
      counts[n.date] = (counts[n.date] || 0) + 1;
    });
    return counts;
  }, [notes]);

  const handleGoPrevWeek = () => {
    if (onPrevWeek) {
      onPrevWeek();
    } else if (onSelectDate) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 7);
      onSelectDate(d);
    }
  };

  const handleGoNextWeek = () => {
    if (onNextWeek) {
      onNextWeek();
    } else if (onSelectDate) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 7);
      onSelectDate(d);
    }
  };

  const handleGoPrevDay = () => {
    if (onSelectDate) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 1);
      onSelectDate(d);
    }
  };

  const handleGoNextDay = () => {
    if (onSelectDate) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 1);
      onSelectDate(d);
    }
  };

  // Filter notes
  const filteredNotes = useMemo(() => {
    const weekIsoSet = new Set(weekDays.map((wd) => wd.iso));

    return notes.filter((n) => {
      // Scope filter
      if (scopeMode === 'day' && n.date !== selectedDateIso) {
        return false;
      }
      if (scopeMode === 'week' && !weekIsoSet.has(n.date)) {
        return false;
      }
      if (scopeMode === 'month' && !n.date.startsWith(currentMonthPrefix)) {
        return false;
      }
      // Category filter
      if (filterType !== 'all' && n.type !== filterType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          n.text.toLowerCase().includes(q) ||
          (n.title && n.title.toLowerCase().includes(q)) ||
          (n.sourceName && n.sourceName.toLowerCase().includes(q)) ||
          n.date.includes(q)
        );
      }
      return true;
    });
  }, [notes, scopeMode, selectedDateIso, weekDays, currentMonthPrefix, filterType, searchQuery]);

  // Group filtered notes by date
  const groupedNotes = useMemo(() => {
    const groups: { date: string; items: NoteItem[] }[] = [];
    const map = new Map<string, NoteItem[]>();

    const sliced = filteredNotes.slice(0, visibleLimit);
    sliced.forEach((note) => {
      const list = map.get(note.date) || [];
      list.push(note);
      map.set(note.date, list);
    });

    // Keep chronological desc
    Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .forEach(([date, items]) => {
        groups.push({ date, items });
      });

    return groups;
  }, [filteredNotes, visibleLimit]);

  const handleOpenAdd = () => {
    const initialType = filterType === 'all' ? 'habit' : filterType;
    setFormType(initialType);
    setFormSourceId('');
    setFormSourceName('');
    setFormMoodValue(undefined);
    setFormTitle('');
    setFormText('');
    setFormDate(selectedDateIso);
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedText =
      formText.trim() ||
      formTitle.trim() ||
      (formMoodValue ? `Feeling ${MOOD_LEVELS.find((m) => m.value === formMoodValue)?.label || 'Good'}` : '') ||
      (formSourceName ? `Notes for ${formSourceName}` : '') ||
      'Reflection note';

    onAddNote({
      date: formDate,
      type: formType,
      title: formTitle.trim() || (formType === 'mood' && formMoodValue ? `Feeling ${MOOD_LEVELS.find((m) => m.value === formMoodValue)?.label || 'Good'}` : ''),
      text: resolvedText,
      sourceId: formSourceId || undefined,
      sourceName: formSourceName || undefined,
      moodValue: formMoodValue,
    });
    setIsAddOpen(false);
  };

  const handleOpenEdit = (note: NoteItem) => {
    setEditingNote(note);
    setFormType(note.type);
    setFormSourceId(note.sourceId || '');
    setFormSourceName(note.sourceName || '');
    setFormMoodValue(note.moodValue);
    setFormTitle(note.title || '');
    setFormText(note.text);
    setFormDate(note.date);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    const resolvedText =
      formText.trim() ||
      formTitle.trim() ||
      (formMoodValue ? `Feeling ${MOOD_LEVELS.find((m) => m.value === formMoodValue)?.label || 'Good'}` : '') ||
      (formSourceName ? `Notes for ${formSourceName}` : '') ||
      'Reflection note';

    onUpdateNote(editingNote.id, {
      date: formDate,
      type: formType,
      title: formTitle.trim(),
      text: resolvedText,
      sourceId: formSourceId || undefined,
      sourceName: formSourceName || undefined,
      moodValue: formMoodValue,
    });
    setEditingNote(null);
  };

  const getResolvedContent = (note: NoteItem) => {
    if (note.text && note.text.trim().length > 0) {
      return note.text;
    }
    if (note.title && note.title.trim().length > 0) {
      return note.title;
    }
    // Informative contextual fallback
    if (note.type === 'habit') {
      return note.sourceName
        ? `Completed habit: "${note.sourceName}"`
        : 'Daily habit check-in recorded';
    }
    if (note.type === 'mood') {
      const mObj = MOOD_LEVELS.find((m) => m.value === note.moodValue);
      return mObj
        ? `Mood recorded: ${mObj.label} (${mObj.value}/5)`
        : 'Daily mood rating logged';
    }
    if (note.type === 'project') {
      return note.sourceName
        ? `Project milestone update: "${note.sourceName}"`
        : 'Project task progression logged';
    }
    return 'Daily journal reflection note';
  };

  const swipeHandlers = useSwipeMonth({
    onPrev: handleGoPrevDay,
    onNext: handleGoNextDay,
  });

  return (
    <div className="space-y-4 pb-28" {...swipeHandlers}>
      {/* Sticky iOS Glass Header with Week Navigation & 7-Day Strip */}
      {/* Sticky Header with Week Navigation & 7-Day Strip */}
      <div className="sticky top-0 z-20 bg-[#F8F7F4] dark:bg-[#1D1B18] pt-1 pb-1 space-y-2.5">
        <div className="border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] p-3.5 sm:p-4 space-y-3 touch-pan-y" {...swipeHandlers}>
          {/* Top Row: Week Navigation */}
          <div className="flex items-center justify-between">
            <button
              id="notes-prev-week"
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
                Daily Journal
              </p>
              <div className="flex items-center gap-2">
                <strong id="CroakleNotesMonth" className="text-base sm:text-lg font-bold font-oswald tracking-tight uppercase text-[#1D1B18] dark:text-[#F8F7F4]">
                  {MONTH_NAMES[monthIndex]} {year}
                </strong>
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4]">
                  {currentWeek?.label}
                </span>
              </div>
            </button>

            <button
              id="notes-next-week"
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
              const isSelected = formatIsoDate(wd.date) === selectedDateIso;
              const dayName = DAY_SHORT_NAMES[wd.dayIndex];
              const noteCount = notesCountByDate[wd.iso] || 0;

              return (
                <button
                  key={wd.iso}
                  type="button"
                  onClick={() => {
                    if (onSelectDate) onSelectDate(wd.date);
                  }}
                  className={`py-1.5 text-center flex flex-col items-center gap-0.5 border transition-all duration-100 font-mono text-xs cursor-pointer ${
                    !wd.inMonth
                      ? 'opacity-25 border-transparent text-[#1D1B18]/40 dark:text-[#F8F7F4]/40'
                      : isSelected
                      ? 'bg-[#1D1B18] dark:bg-[#F8F7F4] text-[#F8F7F4] dark:text-[#1D1B18] border-[#1D1B18] dark:border-[#F8F7F4] font-bold'
                      : wd.isCurrentDay
                      ? 'bg-white dark:bg-[#1D1B18] text-[#1D1B18] dark:text-[#F8F7F4] border-[#E63946] font-bold'
                      : 'bg-white dark:bg-[#1D1B18] text-[#1D1B18] dark:text-[#F8F7F4] border-transparent hover:border-[#1D1B18] dark:hover:border-[#F8F7F4]'
                  }`}
                >
                  <span className="text-[9px] uppercase opacity-70">{dayName}</span>
                  <span className="font-bold">{wd.date.getDate()}</span>
                  {noteCount > 0 && (
                    <span
                      className={`w-1 h-1 ${
                        isSelected
                          ? 'bg-[#F8F7F4] dark:bg-[#1D1B18]'
                          : 'bg-[#E63946]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Bar: New Entry & Scope Selector */}
        <div className="flex items-center gap-2">
          <button
            id="CroakleOpenAddNote"
            type="button"
            onClick={handleOpenAdd}
            className="add-btn flex-1 py-2 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 font-bold"
          >
            <Plus size={14} className="shrink-0" />
            <span>New Entry</span>
          </button>

          {/* Scope Segment: Day / Week / Month / All */}
          <div className="flex items-center p-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] shrink-0 font-mono">
            {(['day', 'week', 'month', 'all'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScopeMode(s)}
                className={`px-2 py-1 text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  scopeMode === s
                    ? 'bg-[#1D1B18] text-[#F8F7F4] dark:bg-[#F8F7F4] dark:text-[#1D1B18]'
                    : 'text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 hover:text-[#1D1B18] dark:hover:text-[#F8F7F4]'
                }`}
              >
                {s === 'day' ? 'Day' : s === 'week' ? 'Week' : s === 'month' ? 'Mon' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="grid grid-cols-4 gap-1 p-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18]">
          {(['all', 'mood', 'habit', 'project'] as const).map((tab) => {
            const tabConfig: Record<string, { label: string }> = {
              all: { label: 'All' },
              mood: { label: 'Mood' },
              habit: { label: 'Habits' },
              project: { label: 'Projects' },
            };
            const config = tabConfig[tab];
            const isActive = filterType === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterType(tab)}
                className={`min-w-0 py-1.5 px-1 font-mono text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center justify-center ${
                  isActive
                    ? 'bg-[#1D1B18] text-[#F8F7F4] dark:bg-[#F8F7F4] dark:text-[#1D1B18]'
                    : 'text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 hover:text-[#1D1B18] dark:hover:text-[#F8F7F4]'
                }`}
              >
                <span className="truncate">{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Layout Density Toggle Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#1D1B18]/40 dark:text-[#F8F7F4]/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] font-mono text-xs text-[#1D1B18] dark:text-[#F8F7F4] placeholder:text-[#1D1B18]/40 dark:placeholder:text-[#F8F7F4]/40 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 hover:text-[#1D1B18] dark:hover:text-[#F8F7F4]"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Density switch: Comfortable vs Compact */}
          <div className="flex items-center border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] shrink-0 p-0.5">
            <button
              type="button"
              onClick={() => setViewDensity('comfortable')}
              title="Comfortable Reading Mode"
              className={`p-1.5 transition-all cursor-pointer ${
                viewDensity === 'comfortable'
                  ? 'bg-[#1D1B18] text-[#F8F7F4] dark:bg-[#F8F7F4] dark:text-[#1D1B18]'
                  : 'text-[#1D1B18]/40 hover:text-[#1D1B18]'
              }`}
            >
              <Layers size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewDensity('compact')}
              title="Compact List Mode"
              className={`p-1.5 transition-all cursor-pointer ${
                viewDensity === 'compact'
                  ? 'bg-[#1D1B18] text-[#F8F7F4] dark:bg-[#F8F7F4] dark:text-[#1D1B18]'
                  : 'text-[#1D1B18]/40 hover:text-[#1D1B18]'
              }`}
            >
              <LayoutList size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Date-Grouped Notes Timeline */}
      <div className="space-y-4 pt-1">
        {filteredNotes.length === 0 ? (
          <div className="border border-dashed border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 p-8 text-center text-[#1D1B18]/50 dark:text-[#F8F7F4]/50 space-y-2">
            <div>
              <p className="font-bold font-oswald text-sm text-[#1D1B18] dark:text-[#F8F7F4] uppercase">No entries found</p>
              <p className="text-xs font-mono mt-0.5 text-[#1D1B18]/60 dark:text-[#F8F7F4]/60">
                {scopeMode === 'month'
                  ? `No journal entries matching filter for ${MONTH_NAMES[monthIndex]} ${year}.`
                  : 'Begin writing your thoughts, daily observations, or reflections.'}
              </p>
            </div>
          </div>
        ) : (
          groupedNotes.map((group) => {
            const friendlyHeader = formatFriendlyDate(group.date);
            return (
              <div key={group.date} className="space-y-2">
                {/* Date Group Header */}
                <div className="flex items-center justify-between px-1 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#E63946]" />
                    <strong className="text-sm sm:text-base font-bold font-oswald text-[#1D1B18] dark:text-[#F8F7F4] uppercase tracking-tight">
                      {friendlyHeader}
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 px-2 py-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18]">
                    {group.items.length} {group.items.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>

                {/* Group Items */}
                <div className="space-y-2.5">
                  {group.items.map((note) => {
                    const content = getResolvedContent(note);

                    return (
                      <div
                        key={note.id}
                        className={`card bg-white dark:bg-[#1D1B18] ${
                          viewDensity === 'compact' ? 'p-3 space-y-2' : 'p-4 space-y-2.5'
                        }`}
                      >
                        {/* Header info row */}
                        <div className="flex items-center justify-between gap-2 pb-1 border-b border-[#1D1B18]/15 dark:border-[#F8F7F4]/20">
                          <div className="flex flex-wrap items-center gap-1.5 font-mono">
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4]">
                              {note.type}
                            </span>

                            {note.sourceName && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] text-[#1D1B18] dark:text-[#F8F7F4] truncate max-w-[180px]">
                                {note.sourceName}
                              </span>
                            )}

                            {note.moodValue && (() => {
                              const moodObj = MOOD_LEVELS.find((m) => m.value === note.moodValue);
                              if (!moodObj) return null;
                              return (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] flex items-center gap-1 text-[#1D1B18] dark:text-[#F8F7F4]">
                                  <FrogMoodIcon value={moodObj.value} size={13} />
                                  <span>{moodObj.label}</span>
                                </span>
                              );
                            })()}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(note)}
                              className="p-1 text-[#1D1B18]/50 hover:text-[#1D1B18] dark:text-[#F8F7F4]/50 dark:hover:text-[#F8F7F4] cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 size={14} />
                            </button>
                            {deletingNoteId === note.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteNote(note.id);
                                    setDeletingNoteId(null);
                                  }}
                                  className="px-2 py-0.5 bg-[#E63946] text-white text-[10px] font-mono font-bold uppercase cursor-pointer"
                                >
                                  Delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingNoteId(null)}
                                  className="px-2 py-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] text-[10px] font-mono font-bold uppercase cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeletingNoteId(note.id)}
                                className="p-1 text-[#1D1B18]/50 hover:text-[#E63946] dark:text-[#F8F7F4]/50 dark:hover:text-[#E63946] cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Title if present */}
                        {note.title && (
                          <h4 className="font-bold font-oswald text-base text-[#1D1B18] dark:text-[#F8F7F4] uppercase tracking-tight">
                            {note.title}
                          </h4>
                        )}

                        {/* Note text content */}
                        <p className="text-xs font-mono text-[#1D1B18] dark:text-[#F8F7F4] leading-relaxed whitespace-pre-wrap">
                          {content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {/* Load More Pagination Button */}
        {filteredNotes.length > visibleLimit && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setVisibleLimit((prev) => prev + 35)}
              className="py-2 px-4 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] font-mono text-xs font-bold uppercase tracking-wider text-[#1D1B18] dark:text-[#F8F7F4] hover:bg-[#1D1B18] hover:text-[#F8F7F4] dark:hover:bg-[#F8F7F4] dark:hover:text-[#1D1B18] transition-all cursor-pointer"
            >
              Load More ({visibleLimit} of {filteredNotes.length})
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Note Modal */}
      {(isAddOpen || editingNote) && (
        <div className="fixed inset-0 z-50 bg-[#1D1B18]/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1D1B18] border border-[#1D1B18] dark:border-[#F8F7F4] p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#1D1B18] dark:border-[#F8F7F4] pb-3">
              <div className="flex items-center gap-2">
                <WashiJournalDockIcon size={20} className="text-[#1D1B18] dark:text-[#F8F7F4]" />
                <h2 className="text-xl font-bold font-oswald uppercase tracking-tight text-[#1D1B18] dark:text-[#F8F7F4]">
                  {editingNote ? 'Edit Entry' : 'New Journal Entry'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingNote(null);
                }}
                className="w-7 h-7 border border-[#1D1B18] dark:border-[#F8F7F4] flex items-center justify-center text-[#1D1B18] dark:text-[#F8F7F4] cursor-pointer hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={editingNote ? handleEditSubmit : handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#1D1B18]/70 dark:text-[#F8F7F4]/70 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] text-xs font-mono text-[#1D1B18] dark:text-[#F8F7F4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#1D1B18]/70 dark:text-[#F8F7F4]/70 mb-1">Category</label>
                  <select
                    value={formType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setFormType(val);
                      setFormSourceId('');
                      setFormSourceName('');
                      if (val !== 'mood') setFormMoodValue(undefined);
                    }}
                    className="w-full px-3 py-2 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] text-xs font-mono text-[#1D1B18] dark:text-[#F8F7F4] focus:outline-none"
                  >
                    <option value="habit">Habit Note</option>
                    <option value="project">Project Note</option>
                    <option value="mood">Mood Reflection</option>
                    <option value="general">General Journal</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Target Picker based on category */}
              {formType === 'habit' && habits.length > 0 && (
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#1D1B18]/70 dark:text-[#F8F7F4]/70 mb-1">Related Habit</label>
                  <select
                    value={formSourceId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setFormSourceId(id);
                      const found = habits.find((h) => h.id === id);
                      setFormSourceName(found ? found.name : '');
                    }}
                    className="w-full px-3 py-2 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] text-xs font-mono text-[#1D1B18] dark:text-[#F8F7F4] focus:outline-none"
                  >
                    <option value="">-- Select Habit (Optional) --</option>
                    {habits.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formType === 'project' && projects.length > 0 && (
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#1D1B18]/70 dark:text-[#F8F7F4]/70 mb-1">Related Project</label>
                  <select
                    value={formSourceId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setFormSourceId(id);
                      const found = projects.find((p) => p.id === id);
                      setFormSourceName(found ? found.name : '');
                    }}
                    className="w-full px-3 py-2 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] text-xs font-mono text-[#1D1B18] dark:text-[#F8F7F4] focus:outline-none"
                  >
                    <option value="">-- Select Project (Optional) --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formType === 'mood' && (
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#1D1B18]/70 dark:text-[#F8F7F4]/70 mb-1.5">Mood Rating</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {MOOD_LEVELS.map((m) => {
                      const isSelected = formMoodValue === m.value;
                      return (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setFormMoodValue(m.value)}
                          className={`py-2 px-1 border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#1D1B18] dark:border-[#F8F7F4] bg-[#1D1B18] text-[#F8F7F4] dark:bg-[#F8F7F4] dark:text-[#1D1B18]'
                              : 'border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-white dark:bg-[#1D1B18] text-[#1D1B18] dark:text-[#F8F7F4] hover:border-[#1D1B18] dark:hover:border-[#F8F7F4]'
                          }`}
                        >
                          <div className="w-6 h-6 flex items-center justify-center">
                            <FrogMoodIcon value={m.value} size={20} />
                          </div>
                          <span className="text-[9px] font-mono font-bold uppercase">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#1D1B18]/70 dark:text-[#F8F7F4]/70 mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning Reflection..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] text-xs font-mono text-[#1D1B18] dark:text-[#F8F7F4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#1D1B18]/70 dark:text-[#F8F7F4]/70 mb-1">
                  Journal Content
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="What's on your mind today?..."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full px-3 py-2 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] text-xs font-mono text-[#1D1B18] dark:text-[#F8F7F4] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1D1B18] dark:border-[#F8F7F4]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingNote(null);
                  }}
                  className="px-3 py-2 border border-[#1D1B18] dark:border-[#F8F7F4] text-xs font-mono font-bold uppercase text-[#1D1B18] dark:text-[#F8F7F4] hover:bg-[#F8F7F4] dark:hover:bg-[#252320] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1D1B18] text-[#F8F7F4] dark:bg-[#F8F7F4] dark:text-[#1D1B18] border border-[#1D1B18] dark:border-[#F8F7F4] text-xs font-mono font-bold uppercase hover:bg-black dark:hover:bg-white transition cursor-pointer"
                >
                  {editingNote ? 'Save Changes' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Month Calendar Picker Modal */}
      <CalendarPickerModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={(date) => {
          if (onSelectDate) onSelectDate(date);
          setIsCalendarOpen(false);
        }}
        title="Journal Calendar"
      />
    </div>
  );
};
