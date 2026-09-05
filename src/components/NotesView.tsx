import React, { useState, useMemo } from 'react';
import { PageType, NoteItem, HabitTemplate, Project, MOOD_LEVELS } from '../types';
import { MOOD_THEMES, getMoodTheme } from '../utils/moodConfig';
import {
  Plus,
  Trash2,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  Search,
  LayoutList,
  Layers,
  Calendar,
} from 'lucide-react';
import {
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
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [isWeekStripOpen, setIsWeekStripOpen] = useState(true);

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
    <div className="flex flex-col gap-3.5 pb-2" {...swipeHandlers}>
      {/* Header with Week Navigation */}
      <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] bg-[#0074DB] dark:bg-[#1D4ED8] text-white shadow-[4px_4px_0px_#1F1B1A] dark:shadow-[4px_4px_0px_#000000] p-3 space-y-2 touch-pan-y" {...swipeHandlers}>
        {/* Top Row: Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            id="notes-prev-week"
            type="button"
            onClick={handleGoPrevWeek}
            className="w-8 h-8 rounded-xl border-[2px] border-[#1F1B1A] bg-white dark:bg-[#252320] shadow-[2px_2px_0px_#1F1B1A] flex items-center justify-center font-bold text-[#1F1B1A] dark:text-[#F8F7F4] transition-all cursor-pointer hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
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
              Daily Journal
            </p>
            <div className="flex items-center gap-2">
              <strong id="CroakleNotesMonth" className="text-base sm:text-lg font-bold font-oswald tracking-tight uppercase text-white">
                {MONTH_NAMES[monthIndex]} {year}
              </strong>
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border-[1.5px] border-[#1F1B1A] bg-[#FEF08A] text-[#1F1B1A] shadow-[1px_1px_0px_#1F1B1A]">
                {currentWeek?.label}
              </span>
            </div>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              id="notes-next-week"
              type="button"
              onClick={handleGoNextWeek}
              className="w-8 h-8 rounded-xl border-[2px] border-[#1F1B1A] bg-white dark:bg-[#252320] shadow-[2px_2px_0px_#1F1B1A] flex items-center justify-center font-bold text-[#1F1B1A] dark:text-[#F8F7F4] transition-all cursor-pointer hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
              aria-label="Next Week"
              title="Next Week"
            >
              <ChevronRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => setIsWeekStripOpen(!isWeekStripOpen)}
              className="w-8 h-8 rounded-xl border-[2px] border-[#1F1B1A] bg-white dark:bg-[#252320] shadow-[2px_2px_0px_#1F1B1A] flex items-center justify-center font-bold text-[#1F1B1A] dark:text-[#F8F7F4] transition-all cursor-pointer hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
              aria-label={isWeekStripOpen ? 'Collapse Week Strip' : 'Expand Week Strip'}
              title={isWeekStripOpen ? 'Collapse Week Strip' : 'Expand Week Strip'}
            >
              {isWeekStripOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {/* 7-Day Interactive Strip */}
        {isWeekStripOpen && (
          <div className="grid grid-cols-7 gap-1 pt-1.5 border-t-[2px] border-[#1F1B1A]/40 dark:border-white/30 animate-in fade-in duration-150">
            {weekDays.map((wd) => {
              const isSelected = formatIsoDate(wd.date) === selectedDateIso;
              const dayName = DAY_SHORT_NAMES[wd.dayIndex];
              const dayOfMonth = wd.date.getDate();
              const noteCount = notesCountByDate[wd.iso] || 0;

              return (
                <button
                  key={wd.iso}
                  type="button"
                  onClick={() => {
                    if (onSelectDate) onSelectDate(wd.date);
                  }}
                  className={`py-1.5 px-0.5 text-center flex flex-col items-center justify-center font-mono rounded-xl border-[2px] transition-all duration-100 cursor-pointer ${
                    !wd.inMonth
                      ? 'opacity-35 bg-white/20 border-dashed border-[#1F1B1A]/40 text-white'
                      : isSelected
                      ? 'bg-[#E02921] text-white font-bold border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A] -translate-y-0.5'
                      : wd.isCurrentDay
                      ? 'bg-[#FEF08A] text-[#1F1B1A] font-bold border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A]'
                      : 'bg-white dark:bg-[#1D1B18] text-[#1F1B1A] dark:text-[#F8F7F4] border-[#1F1B1A] shadow-[1.5px_1.5px_0px_#1F1B1A] hover:bg-[#FEF08A]/80'
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold tracking-wider">{dayName}</span>
                  <span className="text-sm font-extrabold">{dayOfMonth}</span>
                  <span
                    className={`w-1.5 h-1.5 mt-0.5 rounded-full ${
                      noteCount > 0
                        ? isSelected
                          ? 'bg-white'
                          : 'bg-[#FEF08A]'
                        : 'invisible'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Controls: Action Bar (Always visible in normal document flow) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <button
            id="CroakleOpenAddNote"
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 py-2 px-3 rounded-xl border-[2px] border-[#1F1B1A] bg-[#FEF08A] hover:bg-[#FED843] text-[#1F1B1A] font-mono font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1F1B1A] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 whitespace-nowrap"
          >
            <Plus size={14} className="shrink-0" />
            <span className="whitespace-nowrap">ADD</span>
          </button>

          {/* Scope Segment: Day / Week / Month / All */}
          <div className="flex items-center p-1 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[2px_2px_0px_#1F1B1A] shrink-0 font-mono gap-1">
            {(['day', 'week', 'month', 'all'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScopeMode(s)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  scopeMode === s
                    ? 'bg-[#E02921] text-white border border-[#1F1B1A] shadow-[1px_1px_0px_#1F1B1A]'
                    : 'text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 hover:bg-[#FEF08A] hover:text-[#1F1B1A]'
                }`}
              >
                {s === 'day' ? 'Day' : s === 'week' ? 'Week' : s === 'month' ? 'Mon' : 'All'}
              </button>
            ))}
          </div>

          {/* Collapsible Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFilterBarOpen(!isFilterBarOpen)}
            title={isFilterBarOpen ? 'Collapse filters & search' : 'Expand filters & search'}
            className={`py-2 px-2.5 rounded-xl border-[2px] border-[#1F1B1A] font-mono text-xs font-bold transition-all cursor-pointer shadow-[2px_2px_0px_#1F1B1A] flex items-center gap-1.5 shrink-0 ${
              isFilterBarOpen || filterType !== 'all' || searchQuery
                ? 'bg-[#E02921] text-white'
                : 'bg-[#FFFEF7] dark:bg-[#1D1B18] text-[#1F1B1A] dark:text-[#F8F7F4] hover:bg-[#FEF08A] hover:text-[#1F1B1A]'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span className="text-[10px] uppercase font-bold hidden sm:inline">
              {isFilterBarOpen ? 'Hide' : 'Filter'}
            </span>
            {isFilterBarOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {/* Collapsed Active Filter Summary Bar */}
        {!isFilterBarOpen && (filterType !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#FEF08A] text-[#1F1B1A] border-[2px] border-[#1F1B1A] rounded-xl font-mono text-[11px] font-bold shadow-[2px_2px_0px_#1F1B1A] animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 truncate">
              <span className="uppercase text-[9px] px-1.5 py-0.5 bg-[#1F1B1A] text-[#FEF08A] rounded">Active Filter</span>
              <span className="truncate">
                {filterType !== 'all' && `Type: ${filterType}`}
                {filterType !== 'all' && searchQuery && ' • '}
                {searchQuery && `"${searchQuery}"`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setFilterType('all');
                setSearchQuery('');
              }}
              className="text-[#E02921] hover:underline uppercase text-[10px] shrink-0 ml-2"
            >
              Clear
            </button>
          </div>
        )}

        {/* Expandable Filter & Search Section */}
        {isFilterBarOpen && (
          <div className="space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Category Filter Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#FFFEF7] dark:bg-[#1D1B18] shadow-[3px_3px_0px_#1F1B1A]">
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
                    className={`min-w-0 py-1.5 px-1 rounded-lg font-mono text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center justify-center ${
                      isActive
                        ? 'bg-[#E02921] text-white border border-[#1F1B1A] shadow-[1px_1px_0px_#1F1B1A]'
                        : 'text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 hover:bg-[#FEF08A] hover:text-[#1F1B1A]'
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
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1F1B1A]/40 dark:text-[#F8F7F4]/40 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] font-mono text-xs text-[#1F1B1A] dark:text-[#F8F7F4] placeholder:text-[#1F1B1A]/40 dark:placeholder:text-[#F8F7F4]/40 rounded-xl shadow-[2.5px_2.5px_0px_#1F1B1A] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1F1B1A]/60 dark:text-[#F8F7F4]/60 hover:text-[#1F1B1A] dark:hover:text-[#F8F7F4]"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Density switch: Comfortable vs Compact */}
              <div className="flex items-center border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] shrink-0 p-1 rounded-xl shadow-[2.5px_2.5px_0px_#1F1B1A] gap-1">
                <button
                  type="button"
                  onClick={() => setViewDensity('comfortable')}
                  title="Comfortable Reading Mode"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewDensity === 'comfortable'
                      ? 'bg-[#FEF08A] text-[#1F1B1A] border border-[#1F1B1A]'
                      : 'text-[#1F1B1A]/50 dark:text-[#F8F7F4]/50 hover:text-[#1F1B1A] dark:hover:text-[#F8F7F4]'
                  }`}
                >
                  <Layers size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewDensity('compact')}
                  title="Compact List Mode"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewDensity === 'compact'
                      ? 'bg-[#FEF08A] text-[#1F1B1A] border border-[#1F1B1A]'
                      : 'text-[#1F1B1A]/50 dark:text-[#F8F7F4]/50 hover:text-[#1F1B1A] dark:hover:text-[#F8F7F4]'
                  }`}
                >
                  <LayoutList size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Date-Grouped Notes Timeline */}
      <div className="flex flex-col gap-3.5">
        {filteredNotes.length === 0 ? (
          <div className="rounded-2xl border-[2.5px] border-dashed border-[#1F1B1A]/50 bg-[#FED843] text-[#1F1B1A] shadow-[4px_4px_0px_#1F1B1A] p-8 text-center space-y-2">
            <div>
              <p className="font-bold font-oswald text-base text-[#1F1B1A] uppercase tracking-wide">No entries found</p>
              <p className="text-xs font-mono mt-1 text-[#1F1B1A]/70">
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
              <div key={group.date} className="flex flex-col gap-2.5">
                {/* Date Group Header */}
                <div className="flex items-center justify-between px-1 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FEF08A] border-[1.5px] border-[#1F1B1A]" />
                    <strong className="text-base sm:text-lg font-bold font-oswald text-white uppercase tracking-tight drop-shadow-[1px_1px_0px_#1F1B1A]">
                      {friendlyHeader}
                    </strong>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1F1B1A] px-3 py-0.5 rounded-full border-[1.5px] border-[#1F1B1A] bg-[#FEF08A] shadow-[2px_2px_0px_#1F1B1A]">
                    {group.items.length} {group.items.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>

                {/* Group Items */}
                <div className="flex flex-col gap-3">
                  {group.items.map((note) => {
                    const content = getResolvedContent(note);

                    return (
                      <div
                        key={note.id}
                        className={`rounded-2xl border-[2.5px] border-[#1F1B1A] bg-[#FED843] text-[#1F1B1A] shadow-[4px_4px_0px_#1F1B1A] transition-all hover:translate-x-0.5 hover:translate-y-0.5 ${
                          viewDensity === 'compact' ? 'p-4 space-y-2.5' : 'p-5 space-y-3.5'
                        }`}
                      >
                        {/* Header info row */}
                        <div className="flex items-center justify-between gap-2 pb-2.5 border-b-[2px] border-[#1F1B1A]/20">
                          <div className="flex flex-wrap items-center gap-2 font-mono">
                            <span className="text-[11px] sm:text-xs font-bold uppercase px-3 py-1 rounded-full border-[1.5px] border-[#1F1B1A] bg-white text-[#1F1B1A] shadow-[1.5px_1.5px_0px_#1F1B1A]">
                              {note.type}
                            </span>

                            {note.sourceName && (
                              <span className="text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border-[1.5px] border-[#1F1B1A] bg-white text-[#1F1B1A] shadow-[1.5px_1.5px_0px_#1F1B1A] truncate max-w-[200px]">
                                {note.sourceName}
                              </span>
                            )}

                            {note.moodValue && (() => {
                              const moodTheme = getMoodTheme(note.moodValue);
                              if (!moodTheme) return null;
                              return (
                                <span className={`text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border-[1.5px] border-[#1F1B1A] ${moodTheme.cellBg} ${moodTheme.cellTextColor} shadow-[1.5px_1.5px_0px_#1F1B1A] flex items-center gap-1.5`}>
                                  <span className="font-mono font-black">{moodTheme.abbr}</span>
                                  <span>•</span>
                                  <span>{moodTheme.label}</span>
                                </span>
                              );
                            })()}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(note)}
                              className="p-2 rounded-xl border border-transparent hover:border-[#1F1B1A] hover:bg-white/60 text-[#1F1B1A] transition cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 size={18} />
                            </button>
                            {deletingNoteId === note.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteNote(note.id);
                                    setDeletingNoteId(null);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-[#E02921] text-white text-xs font-mono font-bold uppercase border border-[#1F1B1A] shadow-[1px_1px_0px_#1F1B1A] cursor-pointer"
                                >
                                  Delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingNoteId(null)}
                                  className="px-3 py-1.5 rounded-xl border border-[#1F1B1A] bg-white text-xs font-mono font-bold uppercase cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeletingNoteId(note.id)}
                                className="p-2 rounded-xl border border-transparent hover:border-[#E02921] hover:bg-[#E02921]/15 text-[#1F1B1A] hover:text-[#E02921] transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Title if present */}
                        {note.title && (
                          <h4 className="font-bold font-sans text-lg sm:text-xl text-[#1F1B1A] leading-snug tracking-tight">
                            {note.title}
                          </h4>
                        )}

                        {/* Note text content */}
                        <p className="text-base sm:text-[17px] font-sans text-[#1F1B1A] leading-relaxed sm:leading-loose whitespace-pre-wrap">
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
              className="py-2.5 px-5 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#FEF08A] text-[#1F1B1A] shadow-[3px_3px_0px_#1F1B1A] font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              Load More ({visibleLimit} of {filteredNotes.length})
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Note Modal */}
      {(isAddOpen || editingNote) && (
        <div className="fixed inset-0 z-50 bg-[#1F1B1A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFEF7] dark:bg-[#1D1B18] rounded-3xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] shadow-[8px_8px_0px_#1F1B1A] p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b-[2px] border-[#1F1B1A] pb-3">
              <h2 className="text-xl font-bold font-oswald uppercase tracking-tight text-[#1F1B1A] dark:text-[#F8F7F4]">
                {editingNote ? 'Edit Entry' : 'New Journal Entry'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingNote(null);
                }}
                className="w-8 h-8 rounded-xl border-[2px] border-[#1F1B1A] bg-white flex items-center justify-center text-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A] cursor-pointer hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={editingNote ? handleEditSubmit : handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#1F1B1A]/80 dark:text-[#F8F7F4]/80 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 border-[2px] border-[#1F1B1A] rounded-xl bg-white dark:bg-[#1D1B18] text-xs font-mono text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[2px_2px_0px_#1F1B1A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#1F1B1A]/80 dark:text-[#F8F7F4]/80 mb-1">Category</label>
                  <select
                    value={formType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setFormType(val);
                      setFormSourceId('');
                      setFormSourceName('');
                      if (val !== 'mood') setFormMoodValue(undefined);
                    }}
                    className="w-full px-3 py-2 border-[2px] border-[#1F1B1A] rounded-xl bg-white dark:bg-[#1D1B18] text-xs font-mono text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[2px_2px_0px_#1F1B1A] focus:outline-none"
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
                  <label className="block text-xs font-mono font-bold uppercase text-[#1F1B1A]/80 dark:text-[#F8F7F4]/80 mb-1">Related Habit</label>
                  <select
                    value={formSourceId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setFormSourceId(id);
                      const found = habits.find((h) => h.id === id);
                      setFormSourceName(found ? found.name : '');
                    }}
                    className="w-full px-3 py-2 border-[2px] border-[#1F1B1A] rounded-xl bg-white dark:bg-[#1D1B18] text-xs font-mono text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[2px_2px_0px_#1F1B1A] focus:outline-none"
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
                  <label className="block text-xs font-mono font-bold uppercase text-[#1F1B1A]/80 dark:text-[#F8F7F4]/80 mb-1">Related Project</label>
                  <select
                    value={formSourceId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setFormSourceId(id);
                      const found = projects.find((p) => p.id === id);
                      setFormSourceName(found ? found.name : '');
                    }}
                    className="w-full px-3 py-2 border-[2px] border-[#1F1B1A] rounded-xl bg-white dark:bg-[#1D1B18] text-xs font-mono text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[2px_2px_0px_#1F1B1A] focus:outline-none"
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
                  <label className="block text-xs font-mono font-bold uppercase text-[#1F1B1A]/80 dark:text-[#F8F7F4]/80 mb-1.5">Mood Rating</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {MOOD_THEMES.map((theme) => {
                      const isSelected = formMoodValue === theme.value;
                      return (
                        <button
                          key={theme.value}
                          type="button"
                          onClick={() => setFormMoodValue(isSelected ? undefined : theme.value)}
                          className={`py-2 px-1 rounded-xl border-[2px] flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? `border-[#1F1B1A] ${theme.cellBg} ${theme.cellTextColor} shadow-[2px_2px_0px_#1F1B1A] translate-x-0.5 translate-y-0.5 ring-2 ring-[#1F1B1A]`
                              : 'border-[#1F1B1A]/40 bg-white dark:bg-[#1D1B18] text-[#1F1B1A] dark:text-[#F8F7F4] hover:-translate-y-0.5 shadow-[1px_1px_0px_#1F1B1A]'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-md border-[1.5px] border-[#1F1B1A] flex items-center justify-center font-black font-mono text-xs shadow-[1px_1px_0px_#1F1B1A] ${
                              isSelected ? 'bg-white text-[#1F1B1A]' : `${theme.cellBg} ${theme.cellTextColor}`
                            }`}
                          >
                            {theme.letter || theme.abbr[0]}
                          </div>
                          <span className="text-[9px] font-mono font-bold uppercase">{theme.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#1F1B1A]/80 dark:text-[#F8F7F4]/80 mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning Reflection..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border-[2px] border-[#1F1B1A] rounded-xl bg-white dark:bg-[#1D1B18] text-sm sm:text-base font-sans text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[2px_2px_0px_#1F1B1A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#1F1B1A]/80 dark:text-[#F8F7F4]/80 mb-1">
                  Journal Content
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="What's on your mind today?..."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full px-3 py-2.5 border-[2px] border-[#1F1B1A] rounded-xl bg-white dark:bg-[#1D1B18] text-sm sm:text-base font-sans text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[2px_2px_0px_#1F1B1A] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t-[2px] border-[#1F1B1A]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingNote(null);
                  }}
                  className="px-4 py-2 rounded-xl border-[2px] border-[#1F1B1A] text-xs font-mono font-bold uppercase text-[#1F1B1A] hover:bg-[#FEF08A] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E02921] text-white border-[2px] border-[#1F1B1A] text-xs font-mono font-bold uppercase shadow-[2.5px_2.5px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
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
