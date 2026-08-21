import React, { useState, useEffect } from 'react';
import { TimeSession, HabitTemplate, Project } from '../types';
import { Play, Pause, RotateCcw, Plus, Trash2, Edit3, X, Check } from 'lucide-react';
import { PocketTimerDockIcon, LanternToolIcon } from './FrogIcons';
import { getTodayIso, formatTimeMinutes } from '../utils/dateUtils';
import confetti from 'canvas-confetti';

interface TimeSessionsViewProps {
  sessions: TimeSession[];
  habits: HabitTemplate[];
  projects: Project[];
  onAddSession: (session: Omit<TimeSession, 'id'>) => void;
  onUpdateSession: (id: string, session: Partial<TimeSession>) => void;
  onDeleteSession: (id: string) => void;
}

export const TimeSessionsView: React.FC<TimeSessionsViewProps> = ({
  sessions,
  habits,
  projects,
  onAddSession,
  onUpdateSession,
  onDeleteSession,
}) => {
  const [selectedDate, setSelectedDate] = useState(getTodayIso());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TimeSession | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  // Live Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerSubject, setTimerSubject] = useState('Deep Work');
  const [timerType, setTimerType] = useState<'focus' | 'study' | 'break' | 'work'>('focus');

  // Form state
  const [formSubject, setFormSubject] = useState('');
  const [formDate, setFormDate] = useState(getTodayIso());
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formDuration, setFormDuration] = useState(45);
  const [formType, setFormType] = useState<'focus' | 'study' | 'break' | 'work'>('focus');
  const [formSourceType, setFormSourceType] = useState<'habit' | 'project' | ''>('');
  const [formSourceId, setFormSourceId] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Live Timer tick
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleFinishTimer = () => {
    if (timerSeconds < 30) {
      alert('Session too short to record (less than 30s).');
      setTimerRunning(false);
      setTimerSeconds(0);
      return;
    }

    const durationMinutes = Math.max(1, Math.round(timerSeconds / 60));
    const now = new Date();
    const startMinutes = now.getHours() * 60 + now.getMinutes() - durationMinutes;

    onAddSession({
      subject: timerSubject || 'Focus Session',
      date: getTodayIso(),
      startMinute: Math.max(0, startMinutes),
      duration: durationMinutes,
      type: timerType,
      notes: `Recorded with Croakle Focus Timer (${durationMinutes} mins)`,
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });

    setTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleOpenAdd = () => {
    setFormSubject('');
    setFormDate(selectedDate);
    setFormStartTime('09:00');
    setFormDuration(45);
    setFormType('focus');
    setFormSourceType('');
    setFormSourceId('');
    setFormNotes('');
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim()) return;

    const [h, m] = formStartTime.split(':').map(Number);
    const startMin = (h || 0) * 60 + (m || 0);

    onAddSession({
      subject: formSubject.trim(),
      date: formDate,
      startMinute: startMin,
      duration: Number(formDuration) || 30,
      type: formType,
      sourceType: formSourceType,
      sourceId: formSourceId,
      notes: formNotes.trim(),
    });

    setIsAddOpen(false);
  };

  const handleOpenEdit = (session: TimeSession) => {
    setEditingSession(session);
    setFormSubject(session.subject);
    setFormDate(session.date);
    setFormStartTime(formatTimeMinutes(session.startMinute));
    setFormDuration(session.duration);
    setFormType(session.type);
    setFormSourceType(session.sourceType || '');
    setFormSourceId(session.sourceId || '');
    setFormNotes(session.notes || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession || !formSubject.trim()) return;

    const [h, m] = formStartTime.split(':').map(Number);
    const startMin = (h || 0) * 60 + (m || 0);

    onUpdateSession(editingSession.id, {
      subject: formSubject.trim(),
      date: formDate,
      startMinute: startMin,
      duration: Number(formDuration) || 30,
      type: formType,
      sourceType: formSourceType,
      sourceId: formSourceId,
      notes: formNotes.trim(),
    });

    setEditingSession(null);
  };

  // Filter sessions for selected date
  const daySessions = sessions
    .filter((s) => s.date === selectedDate)
    .sort((a, b) => a.startMinute - b.startMinute);

  const totalMinutes = daySessions.reduce((acc, s) => acc + s.duration, 0);

  const formatTimerDisplay = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Live Focus Timer Card (Sticky Locked) */}
      <div className="sticky top-0 z-20 bg-[#fdfbf7]/90 dark:bg-[#161311]/90 backdrop-blur-xl pt-1 pb-1">
        <div className="relative overflow-hidden bg-[#1c1916]/90 dark:bg-black/70 text-[#fbf8f5] rounded-[32px] p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-white/10 space-y-3 sm:space-y-4 backdrop-blur-2xl">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PocketTimerDockIcon size={20} className="text-[#8fc493]" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-[#d4c8bc]">Focus Timer</h2>
            </div>
            <select
              value={timerType}
              onChange={(e) => setTimerType(e.target.value as any)}
              className="bg-white/10 text-xs font-bold text-[#e0d6cb] px-3.5 py-1.5 rounded-full border border-white/15 focus:outline-none backdrop-blur-md"
            >
              <option value="focus" className="bg-[#24201c] text-white">Focus</option>
              <option value="study" className="bg-[#24201c] text-white">Study</option>
              <option value="work" className="bg-[#24201c] text-white">Work</option>
              <option value="break" className="bg-[#24201c] text-white">Break</option>
            </select>
          </div>

          <div className="relative z-10 text-center py-1 sm:py-2 space-y-1.5 sm:space-y-2">
            <input
              type="text"
              placeholder="What are you focusing on?"
              value={timerSubject}
              onChange={(e) => setTimerSubject(e.target.value)}
              className="text-center bg-transparent text-sm font-semibold text-[#e0d6cb] placeholder-[#8c7e70] border-b border-white/15 pb-1 focus:outline-none focus:border-white/40 w-full max-w-xs mx-auto transition"
            />
            <div className="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-tighter text-[#fbf8f5] drop-shadow-sm">
              {formatTimerDisplay(timerSeconds)}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setTimerRunning(!timerRunning)}
              className="px-6 py-2.5 rounded-full bg-white text-[#1c1916] hover:bg-white/90 font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_16px_rgba(255,255,255,0.2)] transition ios-tap"
            >
              {timerRunning ? <Pause size={16} /> : <Play size={16} />}
              {timerRunning ? 'Pause' : 'Start Focus'}
            </button>
            {timerSeconds > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleFinishTimer}
                  className="px-4 py-2.5 rounded-full bg-[#5f7a61] hover:bg-[#4f6751] text-white font-black text-xs flex items-center gap-1.5 transition shadow-[0_4px_16px_rgba(95,122,97,0.3)] ios-tap"
                >
                  <Check size={16} /> Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(0);
                  }}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#c9bea7] hover:text-white transition ios-tap"
                  title="Reset"
                >
                  <RotateCcw size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Date Selector & Day Summary Card */}
      <div className="ios-glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[14px] bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.1] flex items-center justify-center shadow-2xs">
              <PocketTimerDockIcon size={18} className="text-[#b86f52]" />
            </div>
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#8c7e70] dark:text-[#a89b8d]">
                Time Log
              </p>
              <h3 className="text-lg font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8]">Sessions Log</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-[14px] border border-black/[0.08] dark:border-white/[0.1] bg-white/70 dark:bg-white/[0.06] text-xs font-bold text-[#2d2823] dark:text-[#f4efe8] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleOpenAdd}
              className="p-2 rounded-[14px] bg-[#5f7a61] hover:bg-[#4f6751] dark:bg-[#7d9d80] dark:hover:bg-[#6c8c6f] text-white dark:text-[#171513] font-bold transition shadow-xs ios-tap"
              title="Add Session Manually"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Total Time Badge */}
        <div className="p-3.5 rounded-[20px] bg-white/60 dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08] flex items-center justify-between shadow-2xs">
          <span className="text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d]">Total Focus Time:</span>
          <strong className="text-sm font-black text-[#2d2823] dark:text-[#f4efe8]">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m ({daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'})
          </strong>
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          {daySessions.length === 0 ? (
            <div className="text-center py-8 text-[#8c7e70] dark:text-[#a89b8d] space-y-3">
              <div className="w-16 h-16 mx-auto rounded-[24px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center p-2 shadow-2xs">
                <LanternToolIcon size={34} />
              </div>
              <div>
                <p className="font-bold text-sm text-[#2d2823] dark:text-[#f4efe8]">No sessions recorded today</p>
                <p className="text-xs mt-0.5">Start the focus timer above or manually log a session.</p>
              </div>
            </div>
          ) : (
            daySessions.map((session) => {
              const endMin = session.startMinute + session.duration;
              return (
                <div
                  key={session.id}
                  className="p-4 rounded-[22px] border border-black/[0.05] dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.04] flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[#2d2823] dark:text-[#f4efe8] truncate">
                        {session.subject}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#5f7a61] dark:text-[#8fc493] border border-black/[0.04] dark:border-white/[0.06]">
                        {session.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#8c7e70] dark:text-[#a89b8d] font-medium">
                      <span>
                        {formatTimeMinutes(session.startMinute)} – {formatTimeMinutes(endMin)}
                      </span>
                      <span>•</span>
                      <span>{session.duration} mins</span>
                    </div>
                    {session.notes && (
                      <p className="text-xs text-[#8c7e70] dark:text-[#a89b8d]">{session.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(session)}
                      className="p-2 rounded-full text-[#8c7e70] hover:text-[#2d2823] dark:hover:text-[#f4efe8] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition ios-tap"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    {deletingSessionId === session.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteSession(session.id);
                            setDeletingSessionId(null);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-black"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingSessionId(null)}
                          className="px-1.5 py-0.5 rounded-lg bg-[#eee5d8] dark:bg-[#383129] text-[11px] font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeletingSessionId(session.id)}
                        className="p-1.5 rounded-lg text-[#8c7e70] hover:text-[#b86f52]"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add / Edit Session Modal */}
      {(isAddOpen || editingSession) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#211e1b] border border-[#eee5d8] dark:border-[#2f2a24] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight text-[#2d2823] dark:text-[#f2eee9]">
                {editingSession ? 'Edit Session' : 'Add Time Session'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingSession(null);
                }}
                className="w-8 h-8 rounded-full bg-[#f5efe6] dark:bg-[#282420] flex items-center justify-center text-[#8c7e70] hover:text-[#2d2823] dark:hover:text-[#f2eee9]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={editingSession ? handleEditSubmit : handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Subject / Activity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reading Chapter 3"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#e8ded1] dark:border-[#383129] bg-[#faf7f2] dark:bg-[#282420] text-sm text-[#2d2823] dark:text-[#f2eee9] focus:outline-none focus:border-[#5f7a61]"
                />
              </div>

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
                    <option value="focus">Focus</option>
                    <option value="study">Study</option>
                    <option value="work">Work</option>
                    <option value="break">Break</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e8ded1] dark:border-[#383129] bg-[#faf7f2] dark:bg-[#282420] text-xs text-[#2d2823] dark:text-[#f2eee9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="720"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#e8ded1] dark:border-[#383129] bg-[#faf7f2] dark:bg-[#282420] text-xs text-[#2d2823] dark:text-[#f2eee9]"
                  />
                </div>
              </div>

              {/* Link to habit or project */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Linked Item</label>
                  <select
                    value={formSourceType}
                    onChange={(e) => {
                      setFormSourceType(e.target.value as any);
                      setFormSourceId('');
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#e8ded1] dark:border-[#383129] bg-[#faf7f2] dark:bg-[#282420] text-xs text-[#2d2823] dark:text-[#f2eee9] capitalize"
                  >
                    <option value="">None (Custom)</option>
                    <option value="habit">Habit</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Select Item</label>
                  <select
                    disabled={!formSourceType}
                    value={formSourceId}
                    onChange={(e) => {
                      setFormSourceId(e.target.value);
                      if (formSourceType === 'habit') {
                        const h = habits.find((item) => item.id === e.target.value);
                        if (h && !formSubject) setFormSubject(h.name);
                      } else if (formSourceType === 'project') {
                        const p = projects.find((item) => item.id === e.target.value);
                        if (p && !formSubject) setFormSubject(p.name);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#e8ded1] dark:border-[#383129] bg-[#faf7f2] dark:bg-[#282420] text-xs text-[#2d2823] dark:text-[#f2eee9] disabled:opacity-40"
                  >
                    <option value="">Choose item...</option>
                    {formSourceType === 'habit' &&
                      habits.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name}
                        </option>
                      ))}
                    {formSourceType === 'project' &&
                      projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] mb-1">Session Notes</label>
                <textarea
                  rows={2}
                  placeholder="Summary of what was achieved..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#e8ded1] dark:border-[#383129] bg-[#faf7f2] dark:bg-[#282420] text-sm text-[#2d2823] dark:text-[#f2eee9] focus:outline-none focus:border-[#5f7a61] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#5f7a61] hover:bg-[#4f6751] dark:bg-[#7d9d80] dark:hover:bg-[#6c8c6f] text-white dark:text-[#171513] font-black text-sm shadow-xs transition"
              >
                {editingSession ? 'Save Changes' : 'Save Session'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
