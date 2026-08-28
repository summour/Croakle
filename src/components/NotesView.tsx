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
  ChevronDown,
  ChevronUp,
  LayoutList,
  Layers,
  Sparkles,
  Calendar,
} from 'lucide-react';
import {
  WashiJournalDockIcon,
  HabitCloverDockIcon,
  BambooProjectDockIcon,
  FrogFaceDockIcon,
  FrogMoodIcon,
} from './FrogIcons';
import { SubNavTabs } from './SubNavTabs';
import { useSwipeMonth } from '../hooks/useSwipeMonth';
import { getTodayIso, MONTH_NAMES, formatFriendlyDate } from '../utils/dateUtils';

interface NotesViewProps {
  notes: NoteItem[];
  habits?: HabitTemplate[];
  projects?: Project[];
  year?: number;
  monthIndex?: number;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
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
  onPrevMonth,
  onNextMonth,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'habit' | 'project' | 'mood'>('all');
  const [scopeMode, setScopeMode] = useState<'month' | 'all'>('month');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [viewDensity, setViewDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNoteIds, setExpandedNoteIds] = useState<Record<string, boolean>>({});
  const [visibleLimit, setVisibleLimit] = useState<number>(35);

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
  const [formDate, setFormDate] = useState(getTodayIso());

  const currentMonthPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // Month scope filter
      if (scopeMode === 'month' && !n.date.startsWith(currentMonthPrefix)) {
        return false;
      }
      // Specific day chip filter
      if (selectedDayFilter !== 'all' && n.date !== selectedDayFilter) {
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
  }, [notes, scopeMode, currentMonthPrefix, selectedDayFilter, filterType, searchQuery]);

  // Extract unique active days for horizontal quick picker
  const monthAvailableDays = useMemo(() => {
    const dayCounts: Record<string, number> = {};
    notes.forEach((n) => {
      if (scopeMode === 'month' && !n.date.startsWith(currentMonthPrefix)) return;
      dayCounts[n.date] = (dayCounts[n.date] || 0) + 1;
    });
    return Object.entries(dayCounts)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, count]) => ({ date, count }));
  }, [notes, scopeMode, currentMonthPrefix]);

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

  const toggleExpand = (id: string) => {
    setExpandedNoteIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAdd = () => {
    const initialType = filterType === 'all' ? 'habit' : filterType;
    setFormType(initialType);
    setFormSourceId('');
    setFormSourceName('');
    setFormMoodValue(undefined);
    setFormTitle('');
    setFormText('');
    const today = getTodayIso();
    if (today.startsWith(currentMonthPrefix)) {
      setFormDate(today);
    } else {
      setFormDate(`${currentMonthPrefix}-01`);
    }
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

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'habit':
        return <HabitCloverDockIcon size={14} className="text-[#007AFF]" />;
      case 'project':
        return <BambooProjectDockIcon size={14} className="text-[#FF9500]" />;
      case 'mood':
        return <FrogFaceDockIcon size={14} className="text-[#FF2D55]" />;
      default:
        return <WashiJournalDockIcon size={14} className="text-zinc-500" />;
    }
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
    onPrevMonth: onPrevMonth || (() => {}),
    onNextMonth: onNextMonth || (() => {}),
  });

  return (
    <div className="space-y-3 pb-28" {...swipeHandlers}>
      {/* Top Controls Header (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-white/85 dark:bg-black/85 backdrop-blur-2xl pt-1 pb-1 space-y-2.5">
        <div className="ios-glass-card p-3.5 sm:p-4 space-y-3 shadow-xs">
          {/* Top Row: Month Navigation & Scope Toggle */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onPrevMonth}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center font-bold text-zinc-800 dark:text-zinc-200 transition-all ios-tap"
              aria-label="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Daily Journal
                </p>
                <strong id="CroakleNotesMonth" className="text-base sm:text-lg font-black tracking-tight text-zinc-950 dark:text-white block leading-tight">
                  {MONTH_NAMES[monthIndex]} {year}
                </strong>
              </div>
              <div className="flex items-center p-0.5 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-black/[0.04] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    setScopeMode('month');
                    setSelectedDayFilter('all');
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black transition-all ios-tap ${
                    scopeMode === 'month'
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs'
                      : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  This Month
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScopeMode('all');
                    setSelectedDayFilter('all');
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black transition-all ios-tap ${
                    scopeMode === 'all'
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs'
                      : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={onNextMonth}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center font-bold text-zinc-800 dark:text-zinc-200 transition-all ios-tap"
              aria-label="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-[18px] border border-black/[0.04] dark:border-white/[0.06]">
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
                  className={`min-w-0 py-2 px-1 sm:px-2 rounded-[14px] text-[11px] sm:text-xs font-black capitalize transition-all duration-150 ios-tap flex items-center justify-center ${
                    isActive
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] z-10'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <span className="truncate">{config.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Layout Density Toggle Bar */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes, habits, moods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-[14px] bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Density switch: Comfortable vs Compact */}
            <div className="flex items-center p-0.5 bg-zinc-100 dark:bg-zinc-900 rounded-[12px] shrink-0 border border-black/[0.04] dark:border-white/[0.06]">
              <button
                type="button"
                onClick={() => setViewDensity('comfortable')}
                title="Comfortable Reading Mode"
                className={`p-1.5 rounded-[10px] transition-all ios-tap ${
                  viewDensity === 'comfortable'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs'
                    : 'text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <Layers size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewDensity('compact')}
                title="Compact List Mode"
                className={`p-1.5 rounded-[10px] transition-all ios-tap ${
                  viewDensity === 'compact'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs'
                    : 'text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <LayoutList size={14} />
              </button>
            </div>
          </div>

          {/* Quick Date Picker Chips (Horizontal Scroll for Effortless Browsing) */}
          {monthAvailableDays.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedDayFilter('all')}
                className={`px-2.5 py-1 rounded-full text-[10.5px] font-black shrink-0 transition-all ios-tap flex items-center gap-1 ${
                  selectedDayFilter === 'all'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950'
                }`}
              >
                <span>All Days</span>
                <span className="opacity-80">({filteredNotes.length})</span>
              </button>

              {monthAvailableDays.map(({ date, count }) => {
                const isSelected = selectedDayFilter === date;
                const dNum = date.split('-')[2];
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDayFilter(isSelected ? 'all' : date)}
                    className={`px-2.5 py-1 rounded-full text-[10.5px] font-black shrink-0 transition-all ios-tap flex items-center gap-1 ${
                      isSelected
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950'
                    }`}
                  >
                    <span>Day {dNum}</span>
                    <span className="opacity-80 font-normal">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Button: Add Note */}
        <button
          type="button"
          onClick={handleOpenAdd}
          className="w-full py-2.5 px-4 rounded-[20px] bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all ios-tap"
        >
          <Plus size={16} /> New Journal Entry
        </button>
      </div>

      {/* Date-Grouped Notes Timeline */}
      <div className="space-y-4 pt-1">
        {filteredNotes.length === 0 ? (
          <div className="ios-glass-card p-8 text-center text-zinc-400 dark:text-zinc-500 space-y-2">
            <div>
              <p className="font-bold text-sm text-zinc-950 dark:text-white">No entries found</p>
              <p className="text-xs mt-0.5 text-zinc-500 dark:text-zinc-400">
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
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-950 dark:bg-white" />
                    <strong className="text-xs font-black text-zinc-950 dark:text-white tracking-tight">
                      {friendlyHeader}
                    </strong>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                    {group.items.length} {group.items.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>

                {/* Group Items */}
                <div className="space-y-2">
                  {group.items.map((note) => {
                    const isExpanded = !!expandedNoteIds[note.id];
                    const content = getResolvedContent(note);
                    const isLong = content.length > 120 || content.includes('\n');

                    return (
                      <div
                        key={note.id}
                        className={`ios-glass-card transition-all relative group border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 ${
                          viewDensity === 'compact' ? 'p-3' : 'p-3.5 sm:p-4 space-y-2.5'
                        }`}
                      >
                        {/* Header info row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                              {getCategoryIcon(note.type)}
                              <span>{note.type}</span>
                            </span>

                            {note.sourceName && (
                              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#007AFF] dark:bg-blue-950/40 dark:text-[#3894FF] border border-blue-200 dark:border-blue-800/40 truncate max-w-[150px]">
                                {note.sourceName}
                              </span>
                            )}

                            {note.moodValue && (() => {
                              const moodObj = MOOD_LEVELS.find((m) => m.value === note.moodValue);
                              if (!moodObj) return null;
                              return (
                                <span className={`text-[10.5px] font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1 shadow-2xs ${moodObj.bgLight} ${moodObj.bgDark} ${moodObj.borderLight} ${moodObj.borderDark} ${moodObj.textColorLight} ${moodObj.textColorDark}`}>
                                  <FrogMoodIcon value={moodObj.value} size={14} />
                                  <span>{moodObj.label}</span>
                                </span>
                              );
                            })()}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(note)}
                              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-all ios-tap"
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
                                  className="px-2 py-0.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-black transition-all ios-tap"
                                >
                                  Delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingNoteId(null)}
                                  className="px-1.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-bold transition-all ios-tap"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeletingNoteId(note.id)}
                                className="p-1 rounded-lg text-zinc-400 hover:text-red-500 transition-all ios-tap"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Title if present */}
                        {note.title && (
                          <h3 className="font-black text-sm text-zinc-950 dark:text-white tracking-tight">
                            {note.title}
                          </h3>
                        )}

                        {/* Body Text / Content */}
                        <div className="pt-0.5">
                          <p
                            className={`text-xs sm:text-[13.5px] leading-relaxed text-zinc-800 dark:text-zinc-200 font-medium whitespace-pre-wrap ${
                              viewDensity === 'compact' && !isExpanded ? 'line-clamp-1' : ''
                            } ${!isExpanded && isLong && viewDensity === 'comfortable' ? 'line-clamp-3' : ''}`}
                          >
                            {content}
                          </p>

                          {/* Read More / Show Less Toggle */}
                          {isLong && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(note.id)}
                              className="mt-1 text-[11px] font-bold text-[#007AFF] hover:underline flex items-center gap-0.5 ios-tap"
                            >
                              <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                          )}
                        </div>
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
              className="py-2.5 px-6 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-black text-zinc-800 dark:text-zinc-200 hover:border-black dark:hover:border-white shadow-xs transition-all ios-tap"
            >
              Load More Entries ({visibleLimit} of {filteredNotes.length})
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Note Modal */}
      {(isAddOpen || editingNote) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WashiJournalDockIcon size={22} className="text-zinc-950 dark:text-white" />
                <h2 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">
                  {editingNote ? 'Edit Entry' : 'New Journal Entry'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingNote(null);
                }}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={editingNote ? handleEditSubmit : handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-950 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Category</label>
                  <select
                    value={formType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setFormType(val);
                      setFormSourceId('');
                      setFormSourceName('');
                      if (val !== 'mood') setFormMoodValue(undefined);
                    }}
                    className="w-full px-3 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-950 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
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
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Related Habit</label>
                  <select
                    value={formSourceId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setFormSourceId(id);
                      const found = habits.find((h) => h.id === id);
                      setFormSourceName(found ? found.name : '');
                    }}
                    className="w-full px-3 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
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
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Related Project</label>
                  <select
                    value={formSourceId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setFormSourceId(id);
                      const found = projects.find((p) => p.id === id);
                      setFormSourceName(found ? found.name : '');
                    }}
                    className="w-full px-3 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
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
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5">Mood Rating</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {MOOD_LEVELS.map((m) => {
                      const isSelected = formMoodValue === m.value;
                      return (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setFormMoodValue(m.value)}
                          className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all ios-tap bg-white dark:bg-zinc-800 ${
                            isSelected
                              ? 'border-zinc-950 dark:border-white ring-2 ring-zinc-950/20 dark:ring-white/20 scale-105 shadow-xs'
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:scale-102'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-full flex items-center justify-center">
                            <FrogMoodIcon value={m.value} size={22} />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning Reflection, Breakthrough on project..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Journal Content
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="What's on your mind today? Write notes, lessons, or reflections..."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingNote(null);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-black shadow-md transition"
                >
                  {editingNote ? 'Save Changes' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
