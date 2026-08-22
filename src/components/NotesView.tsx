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
        return <HabitCloverDockIcon size={14} className="text-[#5f7a61]" />;
      case 'project':
        return <BambooProjectDockIcon size={14} className="text-[#b87333]" />;
      case 'mood':
        return <FrogFaceDockIcon size={14} className="text-[#d98236]" />;
      default:
        return <WashiJournalDockIcon size={14} className="text-[#8c7e70]" />;
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
    <div className="space-y-3 pb-24" {...swipeHandlers}>
      {/* Top Segmented Sub-Navigation for Journal/Mood */}
      {onNavigate && (
        <SubNavTabs
          activePage="notes"
          onNavigate={onNavigate}
          tabs={[
            { id: 'mood', label: 'Mood Tracker', icon: <FrogFaceDockIcon size={15} /> },
            { id: 'notes', label: 'Journal & Notes', icon: <WashiJournalDockIcon size={15} /> },
          ]}
        />
      )}

      {/* Top Controls Header (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-[#fdfbf7]/95 dark:bg-[#161311]/95 backdrop-blur-2xl pt-1 pb-1 space-y-2.5">
        <div className="ios-glass-card p-3.5 sm:p-4 space-y-3 shadow-xs">
          {/* Top Row: Month Navigation & Scope Toggle */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onPrevMonth}
              className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] flex items-center justify-center font-bold text-[#4a4036] dark:text-[#e0d6cb] transition-all ios-tap"
              aria-label="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              <strong id="CroakleNotesMonth" className="text-base sm:text-lg font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
                {MONTH_NAMES[monthIndex]} {year}
              </strong>
              <div className="flex items-center p-0.5 bg-black/[0.04] dark:bg-white/[0.06] rounded-full">
                <button
                  type="button"
                  onClick={() => {
                    setScopeMode('month');
                    setSelectedDayFilter('all');
                  }}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all ios-tap ${
                    scopeMode === 'month'
                      ? 'bg-white dark:bg-[#28231d] text-[#2d2823] dark:text-[#f4efe8] shadow-2xs'
                      : 'text-[#8c7e70] dark:text-[#a89b8d]'
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
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all ios-tap ${
                    scopeMode === 'all'
                      ? 'bg-white dark:bg-[#28231d] text-[#2d2823] dark:text-[#f4efe8] shadow-2xs'
                      : 'text-[#8c7e70] dark:text-[#a89b8d]'
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={onNextMonth}
              className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] flex items-center justify-center font-bold text-[#4a4036] dark:text-[#e0d6cb] transition-all ios-tap"
              aria-label="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-black/[0.04] dark:bg-white/[0.06] rounded-[18px] border border-black/[0.03] dark:border-white/[0.04]">
            {(['all', 'habit', 'project', 'mood'] as const).map((tab) => {
              const tabConfig: Record<string, { label: string; icon: React.ReactNode }> = {
                all: { label: 'All', icon: <WashiJournalDockIcon size={13} className="shrink-0" /> },
                habit: { label: 'Habits', icon: <HabitCloverDockIcon size={13} className="shrink-0" /> },
                project: { label: 'Projects', icon: <BambooProjectDockIcon size={13} className="shrink-0" /> },
                mood: { label: 'Mood', icon: <FrogFaceDockIcon size={13} className="shrink-0" /> },
              };
              const config = tabConfig[tab];
              const isActive = filterType === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterType(tab)}
                  className={`min-w-0 py-1.5 px-1 sm:px-2 rounded-[14px] text-[11px] sm:text-xs font-black capitalize transition-all duration-150 ios-tap flex items-center justify-center gap-1 ${
                    isActive
                      ? 'bg-white dark:bg-[#28231d] text-[#2d2823] dark:text-[#f4efe8] shadow-[0_2px_6px_rgba(0,0,0,0.08)] z-10'
                      : 'text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823]'
                  }`}
                >
                  {config.icon}
                  <span className="truncate">{config.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Layout Density Toggle Bar */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-black/[0.04] dark:border-white/[0.06]">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8c7e70] pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes, habits, moods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-[14px] bg-white/80 dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.1] text-xs text-[#2d2823] dark:text-[#f4efe8] placeholder:text-[#8c7e70] focus:outline-none focus:border-[#5f7a61]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8c7e70] hover:text-[#2d2823]"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Density switch: Comfortable vs Compact */}
            <div className="flex items-center p-0.5 bg-black/[0.04] dark:bg-white/[0.06] rounded-[12px] shrink-0">
              <button
                type="button"
                onClick={() => setViewDensity('comfortable')}
                title="Comfortable Reading Mode"
                className={`p-1.5 rounded-[10px] transition-all ios-tap ${
                  viewDensity === 'comfortable'
                    ? 'bg-white dark:bg-[#28231d] text-[#5f7a61] shadow-2xs'
                    : 'text-[#8c7e70] hover:text-[#2d2823]'
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
                    ? 'bg-white dark:bg-[#28231d] text-[#5f7a61] shadow-2xs'
                    : 'text-[#8c7e70] hover:text-[#2d2823]'
                }`}
              >
                <LayoutList size={14} />
              </button>
            </div>
          </div>

          {/* Quick Date Picker Chips (Horizontal Scroll for Effortless Browsing) */}
          {monthAvailableDays.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar border-t border-black/[0.03] dark:border-white/[0.04]">
              <button
                type="button"
                onClick={() => setSelectedDayFilter('all')}
                className={`px-2.5 py-1 rounded-full text-[10.5px] font-black shrink-0 transition-all ios-tap flex items-center gap-1 ${
                  selectedDayFilter === 'all'
                    ? 'bg-[#5f7a61] text-white dark:bg-[#7d9d80] dark:text-[#161311] shadow-xs'
                    : 'bg-black/[0.03] dark:bg-white/[0.05] text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823]'
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
                        ? 'bg-[#5f7a61] text-white dark:bg-[#7d9d80] dark:text-[#161311] shadow-xs'
                        : 'bg-black/[0.03] dark:bg-white/[0.05] text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823]'
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
          className="w-full py-2.5 px-4 rounded-[20px] bg-[#5f7a61] hover:bg-[#4f6751] dark:bg-[#7d9d80] dark:hover:bg-[#6c8c6f] text-white dark:text-[#171513] font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(95,122,97,0.22)] transition-all ios-tap"
        >
          <Plus size={16} /> New Journal Entry
        </button>
      </div>

      {/* Date-Grouped Notes Timeline */}
      <div className="space-y-4 pt-1">
        {filteredNotes.length === 0 ? (
          <div className="ios-glass-card p-8 text-center text-[#8c7e70] dark:text-[#a89b8d] space-y-3">
            <div className="flex justify-center opacity-60">
              <WashiJournalDockIcon size={40} className="text-[#c45a46]" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#2d2823] dark:text-[#f4efe8]">No entries found</p>
              <p className="text-xs mt-0.5 text-[#8c7e70] dark:text-[#a89b8d]">
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
                    <span className="w-2 h-2 rounded-full bg-[#5f7a61]" />
                    <strong className="text-xs font-black text-[#2d2823] dark:text-[#f4efe8] tracking-tight">
                      {friendlyHeader}
                    </strong>
                  </div>
                  <span className="text-[10px] font-bold text-[#8c7e70] dark:text-[#a89b8d] px-2 py-0.5 rounded-full bg-black/[0.03] dark:bg-white/[0.05]">
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
                        className={`ios-glass-card transition-all relative group border border-[#ebdccb]/60 dark:border-[#383129]/60 hover:border-[#5f7a61]/40 ${
                          viewDensity === 'compact' ? 'p-3' : 'p-3.5 sm:p-4 space-y-2.5'
                        }`}
                      >
                        {/* Header info row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#f5efe6] dark:bg-[#282420] text-[#4a3f33] dark:text-[#d6c9bb] border border-[#e8ded1] dark:border-[#383129] flex items-center gap-1">
                              {getCategoryIcon(note.type)}
                              <span>{note.type}</span>
                            </span>

                            {note.sourceName && (
                              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-[#5f7a61]/10 text-[#5f7a61] dark:bg-[#7d9d80]/20 dark:text-[#a1c4a4] border border-[#5f7a61]/20 truncate max-w-[150px]">
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
                              className="p-1 rounded-lg text-[#8c7e70] hover:text-[#2d2823] dark:hover:text-[#f2eee9] transition-all ios-tap"
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
                                  className="px-1.5 py-0.5 rounded-lg bg-[#eee5d8] dark:bg-[#383129] text-[10px] font-bold transition-all ios-tap"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeletingNoteId(note.id)}
                                className="p-1 rounded-lg text-[#8c7e70] hover:text-[#b86f52] transition-all ios-tap"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Title if present */}
                        {note.title && (
                          <h3 className="font-black text-sm text-[#2d2823] dark:text-[#f2eee9] tracking-tight">
                            {note.title}
                          </h3>
                        )}

                        {/* Body Text / Content */}
                        <div className="pt-0.5">
                          <p
                            className={`text-xs sm:text-[13.5px] leading-relaxed text-[#3d332a] dark:text-[#dfd3c6] font-medium whitespace-pre-wrap ${
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
                              className="mt-1 text-[11px] font-bold text-[#5f7a61] dark:text-[#7d9d80] hover:underline flex items-center gap-0.5 ios-tap"
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
              className="py-2.5 px-6 rounded-full bg-white dark:bg-[#28231d] border border-[#ebdccb] dark:border-[#383129] text-xs font-black text-[#4a3f33] dark:text-[#e0d6cb] hover:border-[#5f7a61] shadow-xs transition-all ios-tap"
            >
              Load More Entries ({visibleLimit} of {filteredNotes.length})
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Note Modal */}
      {(isAddOpen || editingNote) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#211e1b] border border-[#eee5d8] dark:border-[#2f2a24] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WashiJournalDockIcon size={22} className="text-[#c45a46]" />
                <h2 className="text-xl font-black tracking-tight text-[#2d2823] dark:text-[#f2eee9]">
                  {editingNote ? 'Edit Entry' : 'New Journal Entry'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingNote(null);
                }}
                className="w-8 h-8 rounded-full bg-[#f5efe6] dark:bg-[#282420] flex items-center justify-center text-[#8c7e70] hover:text-[#2d2823] dark:hover:text-[#f2eee9]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={editingNote ? handleEditSubmit : handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f5efe6] dark:bg-[#282420] border border-[#e5d8c5] dark:border-[#383129] text-sm text-[#2d2823] dark:text-[#f2eee9] font-bold focus:outline-none focus:border-[#5f7a61]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Category</label>
                  <select
                    value={formType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setFormType(val);
                      setFormSourceId('');
                      setFormSourceName('');
                      if (val !== 'mood') setFormMoodValue(undefined);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#f5efe6] dark:bg-[#282420] border border-[#e5d8c5] dark:border-[#383129] text-sm text-[#2d2823] dark:text-[#f2eee9] font-bold focus:outline-none focus:border-[#5f7a61]"
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
                  <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Related Habit</label>
                  <select
                    value={formSourceId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setFormSourceId(id);
                      const found = habits.find((h) => h.id === id);
                      setFormSourceName(found ? found.name : '');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#f5efe6] dark:bg-[#282420] border border-[#e5d8c5] dark:border-[#383129] text-sm text-[#2d2823] dark:text-[#f2eee9] focus:outline-none focus:border-[#5f7a61]"
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
                  <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Related Project</label>
                  <select
                    value={formSourceId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setFormSourceId(id);
                      const found = projects.find((p) => p.id === id);
                      setFormSourceName(found ? found.name : '');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#f5efe6] dark:bg-[#282420] border border-[#e5d8c5] dark:border-[#383129] text-sm text-[#2d2823] dark:text-[#f2eee9] focus:outline-none focus:border-[#5f7a61]"
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
                  <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1.5">Mood Rating</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {MOOD_LEVELS.map((m) => {
                      const isSelected = formMoodValue === m.value;
                      return (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setFormMoodValue(m.value)}
                          className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all ios-tap ${
                            m.bgLight
                          } ${m.bgDark} ${
                            isSelected
                              ? `ring-2 ring-offset-1 ring-offset-white dark:ring-offset-[#211e1b] ${m.borderLight} ${m.borderDark} scale-105 shadow-xs`
                              : `${m.borderLight} ${m.borderDark} hover:scale-102`
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${m.iconBgLight} ${m.iconBgDark}`}>
                            <FrogMoodIcon value={m.value} size={16} />
                          </div>
                          <span className={`text-[10px] font-black ${m.textColorLight} ${m.textColorDark}`}>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning Reflection, Breakthrough on project..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f5efe6] dark:bg-[#282420] border border-[#e5d8c5] dark:border-[#383129] text-sm text-[#2d2823] dark:text-[#f2eee9] focus:outline-none focus:border-[#5f7a61]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">
                  Journal Content
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="What's on your mind today? Write notes, lessons, or reflections..."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f5efe6] dark:bg-[#282420] border border-[#e5d8c5] dark:border-[#383129] text-sm text-[#2d2823] dark:text-[#f2eee9] focus:outline-none focus:border-[#5f7a61] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingNote(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#f5efe6] dark:bg-[#282420] text-xs font-bold text-[#8c7e70] hover:text-[#2d2823] dark:hover:text-[#f2eee9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5f7a61] hover:bg-[#4f6751] dark:bg-[#7d9d80] dark:hover:bg-[#6c8c6f] text-white dark:text-[#171513] text-xs font-black shadow-md transition"
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
