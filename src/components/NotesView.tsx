import React, { useState } from 'react';
import { PageType, NoteItem, HabitTemplate, Project, MOOD_LEVELS } from '../types';
import { Plus, Copy, Trash2, Edit3, X, Check } from 'lucide-react';
import {
  WashiJournalDockIcon,
  HabitCloverDockIcon,
  BambooProjectDockIcon,
  FrogFaceDockIcon,
} from './FrogIcons';
import { SubNavTabs } from './SubNavTabs';
import { getTodayIso } from '../utils/dateUtils';

interface NotesViewProps {
  notes: NoteItem[];
  habits?: HabitTemplate[];
  projects?: Project[];
  onAddNote: (note: Omit<NoteItem, 'id' | 'createdAt'>) => void;
  onUpdateNote: (id: string, note: Partial<NoteItem>) => void;
  onDeleteNote: (id: string) => void;
  onNavigate?: (page: PageType) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  habits = [],
  projects = [],
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'habit' | 'project' | 'mood'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // Form states
  const [formType, setFormType] = useState<'habit' | 'project' | 'mood' | 'general'>('habit');
  const [formSourceId, setFormSourceId] = useState('');
  const [formSourceName, setFormSourceName] = useState('');
  const [formMoodValue, setFormMoodValue] = useState<number | undefined>(undefined);
  const [formTitle, setFormTitle] = useState('');
  const [formText, setFormText] = useState('');
  const [formDate, setFormDate] = useState(getTodayIso());

  const filteredNotes = notes.filter((n) => {
    if (filterType !== 'all' && n.type !== filterType) return false;
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

  const handleOpenAdd = () => {
    const initialType = filterType === 'all' ? 'habit' : filterType;
    setFormType(initialType);
    setFormSourceId('');
    setFormSourceName('');
    setFormMoodValue(undefined);
    setFormTitle('');
    setFormText('');
    setFormDate(getTodayIso());
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

  const handleCopyAll = () => {
    if (filteredNotes.length === 0) return;
    const formatted = filteredNotes
      .map((n) => `[${n.date}] (${n.type.toUpperCase()}${n.sourceName ? ` - ${n.sourceName}` : ''}) ${n.title ? `${n.title}: ` : ''}${n.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="space-y-4 pb-24">
      {/* Top Segmented Sub-Navigation for Journal/Mood */}
      {onNavigate && (
        <SubNavTabs
          activePage="notes"
          onNavigate={onNavigate}
          tabs={[
            { id: 'notes', label: 'Journal & Notes', icon: <WashiJournalDockIcon size={15} /> },
            { id: 'mood', label: 'Mood Tracker', icon: <FrogFaceDockIcon size={15} /> },
          ]}
        />
      )}

      {/* Header & Copy Button (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-[#fdfbf7]/90 dark:bg-[#161311]/90 backdrop-blur-xl pt-1 pb-1">
        <div className="ios-glass-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[16px] bg-[#f4ece0] dark:bg-[#2d2720] border border-[#e5d8c5] dark:border-[#3d342a] flex items-center justify-center p-1 shrink-0 shadow-2xs">
                <WashiJournalDockIcon size={22} className="text-[#c45a46]" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#8c7e70] dark:text-[#a89b8d]">
                  Daily Journal & Reflections
                </p>
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8]">Notes & Journal</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyAll}
              className="px-3.5 py-1.5 rounded-full text-xs font-black bg-white/80 dark:bg-white/[0.08] hover:bg-white dark:hover:bg-white/[0.14] text-[#4a4036] dark:text-[#e0d6cb] flex items-center gap-1.5 transition border border-black/[0.06] dark:border-white/[0.1] shadow-2xs ios-tap"
            >
              {copied ? <Check size={14} className="text-[#5f7a61]" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </div>

          {/* Filter Tabs (iOS 26 Segmented Control) */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-black/[0.04] dark:bg-white/[0.06] rounded-[20px] border border-black/[0.04] dark:border-white/[0.06]">
            {(['all', 'habit', 'project', 'mood'] as const).map((tab) => {
              const tabConfig: Record<string, { label: string; icon: React.ReactNode }> = {
                all: { label: 'All', icon: <WashiJournalDockIcon size={14} /> },
                habit: { label: 'Habits', icon: <HabitCloverDockIcon size={14} /> },
                project: { label: 'Projects', icon: <BambooProjectDockIcon size={14} /> },
                mood: { label: 'Mood', icon: <FrogFaceDockIcon size={14} /> },
              };
              const config = tabConfig[tab];
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterType(tab)}
                  className={`py-1.5 px-2 rounded-[16px] text-xs font-black capitalize transition flex items-center justify-center gap-1.5 ios-tap ${
                    filterType === tab
                      ? 'bg-white dark:bg-[#28231d] text-[#2d2823] dark:text-[#f4efe8] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                      : 'text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823] dark:hover:text-[#f4efe8]'
                  }`}
                >
                  {config.icon}
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search / Summary */}
          <div className="flex items-center justify-between text-xs text-[#8c7e70] dark:text-[#a89b8d] font-bold">
            <span>{filteredNotes.length} {filteredNotes.length === 1 ? 'Entry' : 'Entries'}</span>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-1.5 rounded-[14px] bg-white/70 dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.1] text-xs text-[#2d2823] dark:text-[#f4efe8] focus:outline-none focus:border-[#5f7a61]"
            />
          </div>
        </div>
      </div>

      {/* Add Note Button */}
      <button
        type="button"
        onClick={handleOpenAdd}
        className="w-full py-3 px-4 rounded-[22px] bg-[#5f7a61] hover:bg-[#4f6751] dark:bg-[#7d9d80] dark:hover:bg-[#6c8c6f] text-white dark:text-[#171513] font-black text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(95,122,97,0.3)] transition ios-tap"
      >
        <Plus size={18} /> New Journal Entry
      </button>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="ios-glass-card p-8 text-center text-[#8c7e70] dark:text-[#a89b8d] space-y-3">
            <div className="flex justify-center opacity-70">
              <WashiJournalDockIcon size={44} className="text-[#c45a46]" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#2d2823] dark:text-[#f4efe8]">No entries found</p>
              <p className="text-xs mt-0.5">Begin writing your thoughts, daily observations, or reflections.</p>
            </div>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="ios-glass-card p-5 space-y-2.5 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#f5efe6] dark:bg-[#282420] text-[#4a3f33] dark:text-[#d6c9bb] border border-[#e8ded1] dark:border-[#383129] flex items-center gap-1.5">
                    {getCategoryIcon(note.type)}
                    <span>{note.type}</span>
                  </span>
                  {note.sourceName && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#5f7a61]/10 text-[#5f7a61] dark:bg-[#7d9d80]/20 dark:text-[#a1c4a4] border border-[#5f7a61]/20 truncate max-w-[150px]">
                      {note.sourceName}
                    </span>
                  )}
                  {note.moodValue && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d98236]/10 text-[#d98236] border border-[#d98236]/20 flex items-center gap-1">
                      <span>{MOOD_LEVELS.find((m) => m.value === note.moodValue)?.emoji}</span>
                      <span>{MOOD_LEVELS.find((m) => m.value === note.moodValue)?.label}</span>
                    </span>
                  )}
                  <span className="text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] ml-1">{note.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(note)}
                    className="p-1.5 rounded-lg text-[#8c7e70] hover:text-[#2d2823] dark:hover:text-[#f2eee9]"
                    title="Edit"
                  >
                    <Edit3 size={15} />
                  </button>
                  {deletingNoteId === note.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteNote(note.id);
                          setDeletingNoteId(null);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-black"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingNoteId(null)}
                        className="px-1.5 py-0.5 rounded-lg bg-[#eee5d8] dark:bg-[#383129] text-[11px] font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeletingNoteId(note.id)}
                      className="p-1.5 rounded-lg text-[#8c7e70] hover:text-[#b86f52]"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {note.title && (
                <h3 className="font-black text-base text-[#2d2823] dark:text-[#f2eee9]">{note.title}</h3>
              )}
              <p className="text-sm text-[#4a4036] dark:text-[#d4c8bc] whitespace-pre-wrap leading-relaxed">
                {note.text}
              </p>
            </div>
          ))
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
                    className="w-full px-3 py-2 rounded-xl border border-[#e8ded1] dark:border-[#383129] bg-[#faf7f2] dark:bg-[#282420] text-xs text-[#2d2823] dark:text-[#f2eee9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Category</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e8ded1] dark:border-[#383129] bg-[#faf7f2] dark:bg-[#282420] text-xs text-[#2d2823] dark:text-[#f2eee9] capitalize"
                  >
                    <option value="habit">Habit</option>
                    <option value="project">Project</option>
                    <option value="mood">Mood</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Linked Item or Mood Selection */}
              {formType === 'habit' && (
                <div>
                  <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">
                    Linked Habit
                  </label>
                  <select
                    value={formSourceId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setFormSourceId(id);
                      const found = habits.find((h) => h.id === id);
                      if (found) {
                        setFormSourceName(found.name);
                        if (!formTitle) setFormTitle(found.name);
                      } else {
                        setFormSourceName('');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#e8ded1] dark:border-[#383129] bg-[#faf7f2] dark:bg-[#282420] text-xs text-[#2d2823] dark:text-[#f2eee9]"
                  >
                    <option value="">Choose a habit (Optional)...</option>
                    {habits.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formType === 'project' && (
                <div>
                  <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">
                    Linked Project
                  </label>
                  <select
                    value={formSourceId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setFormSourceId(id);
                      const found = projects.find((p) => p.id === id);
                      if (found) {
                        setFormSourceName(found.name);
                        if (!formTitle) setFormTitle(found.name);
                      } else {
                        setFormSourceName('');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#e8ded1] dark:border-[#383129] bg-[#faf7f2] dark:bg-[#282420] text-xs text-[#2d2823] dark:text-[#f2eee9]"
                  >
                    <option value="">Choose a project (Optional)...</option>
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
                  <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1.5">
                    Select Mood Rating
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {MOOD_LEVELS.map((ml) => {
                      const isSelected = formMoodValue === ml.value;
                      return (
                        <button
                          key={ml.value}
                          type="button"
                          onClick={() => {
                            setFormMoodValue(isSelected ? undefined : ml.value);
                            if (!isSelected && !formTitle) {
                              setFormTitle(`Feeling ${ml.label}`);
                            }
                          }}
                          className={`py-2 px-1 rounded-xl text-xs font-black flex flex-col items-center gap-1 transition border ${
                            isSelected
                              ? 'bg-white dark:bg-[#2e2720] border-[#5f7a61] shadow-xs ring-2 ring-[#5f7a61]/30'
                              : 'bg-[#faf7f2] dark:bg-[#282420] border-[#e8ded1] dark:border-[#383129] opacity-75 hover:opacity-100'
                          }`}
                        >
                          <span className="text-lg">{ml.emoji}</span>
                          <span className="text-[10px] text-[#4a4036] dark:text-[#d6c9bb]">{ml.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Morning thoughts & matcha tea"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#e8ded1] dark:border-[#383129] bg-[#faf7f2] dark:bg-[#282420] text-sm text-[#2d2823] dark:text-[#f2eee9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Journal Body</label>
                <textarea
                  rows={4}
                  placeholder="Write your reflections (optional)..."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8ded1] dark:border-[#383129] bg-[#faf7f2] dark:bg-[#282420] text-sm text-[#2d2823] dark:text-[#f2eee9] focus:outline-none focus:border-[#5f7a61] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#5f7a61] hover:bg-[#4f6751] dark:bg-[#7d9d80] dark:hover:bg-[#6c8c6f] text-white dark:text-[#171513] font-black text-sm shadow-xs transition"
              >
                {editingNote ? 'Save Changes' : 'Create Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

