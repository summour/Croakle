import React, { useState } from 'react';
import { TimeSession, HabitTemplate, Project, ActiveTimerState } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  Sparkles,
  Target,
  Flame,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { PocketTimerDockIcon, LanternToolIcon } from './FrogIcons';
import {
  getTodayIso,
  formatTimeMinutes,
  addDaysIso,
  formatFriendlyDate,
  getWeekDates,
  parseIsoDate,
  DAY_SHORT_NAMES,
} from '../utils/dateUtils';

interface TimeSessionsViewProps {
  sessions: TimeSession[];
  habits: HabitTemplate[];
  projects: Project[];
  activeTimer: ActiveTimerState;
  elapsedSeconds: number;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onResetTimer: () => void;
  onFinishTimer: () => void;
  onUpdateTimerConfig: (patch: Partial<ActiveTimerState>) => void;
  onAddSession: (session: Omit<TimeSession, 'id'>) => void;
  onUpdateSession: (id: string, session: Partial<TimeSession>) => void;
  onDeleteSession: (id: string) => void;
}

export const TimeSessionsView: React.FC<TimeSessionsViewProps> = ({
  sessions,
  habits,
  projects,
  activeTimer,
  elapsedSeconds,
  onStartTimer,
  onPauseTimer,
  onResumeTimer,
  onResetTimer,
  onFinishTimer,
  onUpdateTimerConfig,
  onAddSession,
  onUpdateSession,
  onDeleteSession,
}) => {
  const [selectedDate, setSelectedDate] = useState(getTodayIso());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TimeSession | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  // Form state for manual add / edit
  const [formSubject, setFormSubject] = useState('');
  const [formDate, setFormDate] = useState(getTodayIso());
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formDuration, setFormDuration] = useState(45);
  const [formType, setFormType] = useState<'focus' | 'study' | 'break' | 'work'>('focus');
  const [formSourceType, setFormSourceType] = useState<'habit' | 'project' | ''>('');
  const [formSourceId, setFormSourceId] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const formatTimerDisplay = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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

  const todayIso = getTodayIso();
  const isSelectedToday = selectedDate === todayIso;
  const selectedDateObj = parseIsoDate(selectedDate);
  const weekDays = getWeekDates(selectedDateObj);

  const getDaySessionStats = (iso: string) => {
    const dayList = sessions.filter((s) => s.date === iso);
    const totalMins = dayList.reduce((acc, s) => acc + s.duration, 0);
    return { count: dayList.length, totalMins };
  };

  const handlePrevDay = () => {
    setSelectedDate((curr) => addDaysIso(curr, -1));
  };

  const handleNextDay = () => {
    setSelectedDate((curr) => addDaysIso(curr, 1));
  };

  const handlePrevWeek = () => {
    setSelectedDate((curr) => addDaysIso(curr, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate((curr) => addDaysIso(curr, 7));
  };

  const handleJumpToday = () => {
    setSelectedDate(todayIso);
  };

  // Target duration calculation for progress ring if set
  const targetSecs = (activeTimer.targetDurationMinutes || 0) * 60;
  const progressPercent = targetSecs > 0 ? Math.min(100, Math.round((elapsedSeconds / targetSecs) * 100)) : 0;

  const timerPresets = [
    { label: '15m Short', mins: 15 },
    { label: '25m Pomodoro', mins: 25 },
    { label: '45m Deep Work', mins: 45 },
    { label: '60m Flow', mins: 60 },
    { label: 'Stopwatch', mins: 0 },
  ];

  return (
    <div className="space-y-5 pb-28">
      {/* Live Focus Timer Card - Naturally Scrolling & Styled in App's Warm Sage Aesthetic */}
      <div className="pt-1 pb-1">
        <div className="relative overflow-hidden bg-white/80 dark:bg-[#201c18]/90 text-[#2d2823] dark:text-[#f4efe8] rounded-[36px] p-5 sm:p-6 shadow-[0_14px_40px_rgba(95,122,97,0.12),0_2px_8px_rgba(0,0,0,0.04)] border border-[#5f7a61]/20 dark:border-[#5f7a61]/30 space-y-4 backdrop-blur-2xl transition-colors">
          
          {/* Header Row */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#5f7a61]/10 dark:bg-[#7d9d80]/15 flex items-center justify-center border border-[#5f7a61]/20 text-[#5f7a61] dark:text-[#8fc493]">
                <PocketTimerDockIcon size={18} />
              </div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-black text-xs uppercase tracking-wider text-[#5f7a61] dark:text-[#8fc493]">Continuous Focus Timer</h2>
                {activeTimer.isRunning && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
              </div>
            </div>

            {/* Type Selector */}
            <select
              value={activeTimer.type}
              onChange={(e) => onUpdateTimerConfig({ type: e.target.value as any })}
              className="bg-[#5f7a61]/10 dark:bg-white/[0.08] text-xs font-black text-[#3b332a] dark:text-[#e8ded1] px-3 py-1.5 rounded-full border border-[#5f7a61]/20 dark:border-white/15 focus:outline-none backdrop-blur-md transition hover:bg-[#5f7a61]/15 cursor-pointer"
            >
              <option value="focus" className="bg-[#fdfbf7] dark:bg-[#24201c] text-[#2d2823] dark:text-white">Focus</option>
              <option value="study" className="bg-[#fdfbf7] dark:bg-[#24201c] text-[#2d2823] dark:text-white">Study</option>
              <option value="work" className="bg-[#fdfbf7] dark:bg-[#24201c] text-[#2d2823] dark:text-white">Work</option>
              <option value="break" className="bg-[#fdfbf7] dark:bg-[#24201c] text-[#2d2823] dark:text-white">Break</option>
            </select>
          </div>

          {/* Preset Buttons */}
          <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {timerPresets.map((p) => {
              const isSelected = activeTimer.targetDurationMinutes === p.mins;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onUpdateTimerConfig({ targetDurationMinutes: p.mins })}
                  className={`text-[11px] font-black px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 ios-tap ${
                    isSelected
                      ? 'bg-[#5f7a61] text-white shadow-[0_4px_12px_rgba(95,122,97,0.3)] scale-[1.02]'
                      : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#6e6052] dark:text-[#c2b5a5] border border-black/[0.05] dark:border-white/[0.08] hover:bg-[#5f7a61]/10'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Subject Input & Giant Timer Display */}
          <div className="relative z-10 text-center py-2 space-y-2">
            <div className="flex items-center justify-center gap-1.5 max-w-xs mx-auto">
              <input
                type="text"
                placeholder="What are you focusing on?"
                value={activeTimer.subject}
                onChange={(e) => onUpdateTimerConfig({ subject: e.target.value })}
                className="text-center bg-transparent text-sm font-bold text-[#2d2823] dark:text-[#f5eee6] placeholder-[#8c7e70] dark:placeholder-[#8c7e70] border-b border-[#5f7a61]/25 pb-1 focus:outline-none focus:border-[#5f7a61] w-full transition"
              />
            </div>

            <div className="relative inline-block py-1">
              <div className="text-5xl sm:text-6xl md:text-7xl font-black font-mono tracking-tighter text-[#2d2823] dark:text-[#fbf8f5] tabular-nums">
                {formatTimerDisplay(elapsedSeconds)}
              </div>
              {targetSecs > 0 && (
                <p className="text-[11px] font-bold text-[#8c7e70] dark:text-[#c9bfae] mt-1">
                  Target: {activeTimer.targetDurationMinutes} mins ({progressPercent}%)
                </p>
              )}
            </div>

            {/* Target Progress Bar */}
            {targetSecs > 0 && (
              <div className="w-full max-w-xs mx-auto h-2 bg-black/[0.06] dark:bg-white/10 rounded-full overflow-hidden border border-black/[0.04] dark:border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#5f7a61] to-[#8fc493] rounded-full transition-all duration-300 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="relative z-10 flex items-center justify-center gap-3">
            {!activeTimer.isRunning ? (
              <button
                type="button"
                onClick={elapsedSeconds > 0 ? onResumeTimer : onStartTimer}
                className="px-7 py-3 rounded-full bg-[#5f7a61] hover:bg-[#4f6751] text-white font-black text-sm flex items-center gap-2 shadow-[0_8px_24px_rgba(95,122,97,0.35)] transition-all transform active:scale-95 ios-tap"
              >
                <Play size={17} className="fill-current ml-0.5" />
                <span>{elapsedSeconds > 0 ? 'Resume Focus' : 'Start Focus'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPauseTimer}
                className="px-7 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-black text-sm flex items-center gap-2 shadow-[0_8px_24px_rgba(245,158,11,0.35)] transition-all transform active:scale-95 ios-tap"
              >
                <Pause size={17} className="fill-current" />
                <span>Pause</span>
              </button>
            )}

            {elapsedSeconds > 0 && (
              <>
                <button
                  type="button"
                  onClick={onFinishTimer}
                  className="px-5 py-3 rounded-full bg-[#4a6b4d] hover:bg-[#3d5940] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 transition shadow-[0_6px_20px_rgba(74,107,77,0.35)] ios-tap"
                  title="Finish and log session"
                >
                  <Check size={17} /> <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={onResetTimer}
                  className="p-3 rounded-full bg-black/[0.05] dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#6e6052] dark:text-[#c9bea7] transition ios-tap"
                  title="Reset Timer"
                >
                  <RotateCcw size={16} />
                </button>
              </>
            )}
          </div>

          <div className="relative z-10 text-center">
            <p className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d] font-medium">
              💡 Continuous background timer tracks accurately even when switching to other pages
            </p>
          </div>
        </div>
      </div>

      {/* Date Selector & Day Summary Card */}
      <div className="ios-glass-card p-5 space-y-4">
        {/* Header with Title and Add Button */}
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
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-2 rounded-[14px] bg-[#5f7a61] hover:bg-[#4f6751] dark:bg-[#7d9d80] dark:hover:bg-[#6c8c6f] text-white dark:text-[#171513] text-xs font-bold transition shadow-xs ios-tap"
            title="Add Session Manually"
          >
            <Plus size={16} />
            <span>Add Session</span>
          </button>
        </div>

        {/* Day Stepper & Quick Date Navigation */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-[20px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08]">
          <button
            type="button"
            onClick={handlePrevDay}
            className="p-2 rounded-xl text-[#6e6052] dark:text-[#c9bea7] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition ios-tap shrink-0"
            title="Previous Day"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2 min-w-0 justify-center flex-1">
            <label className="relative flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition text-center min-w-0">
              <Calendar size={15} className="text-[#5f7a61] dark:text-[#7d9d80] shrink-0" />
              <span className="text-xs sm:text-sm font-black text-[#2d2823] dark:text-[#f4efe8] truncate">
                {formatFriendlyDate(selectedDate)}
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                className="sr-only"
              />
            </label>

            {!isSelectedToday && (
              <button
                type="button"
                onClick={handleJumpToday}
                className="px-2.5 py-1 rounded-lg bg-[#5f7a61]/15 dark:bg-[#7d9d80]/20 text-[#5f7a61] dark:text-[#8fc493] text-[11px] font-black hover:bg-[#5f7a61]/25 transition shrink-0 ios-tap"
                title="Jump to Today"
              >
                Today
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextDay}
            className="p-2 rounded-xl text-[#6e6052] dark:text-[#c9bea7] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition ios-tap shrink-0"
            title="Next Day"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* 7-Day Interactive Week Strip */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10.5px] font-bold text-[#8c7e70] dark:text-[#a89b8d]">
              Week View
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevWeek}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-[#8c7e70] dark:text-[#a89b8d] transition"
              >
                ◀ Prev Week
              </button>
              <button
                type="button"
                onClick={handleNextWeek}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-[#8c7e70] dark:text-[#a89b8d] transition"
              >
                Next Week ▶
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 p-1.5 rounded-[22px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06]">
            {weekDays.map((wd) => {
              const isSelected = wd.iso === selectedDate;
              const isToday = wd.iso === todayIso;
              const stats = getDaySessionStats(wd.iso);
              const dayLabel = DAY_SHORT_NAMES[wd.dayIndex];
              const dayNum = wd.date.getDate();

              return (
                <button
                  key={wd.iso}
                  type="button"
                  onClick={() => setSelectedDate(wd.iso)}
                  className={`py-2 px-1 rounded-[16px] flex flex-col items-center justify-center transition-all duration-200 ios-tap relative select-none ${
                    isSelected
                      ? 'bg-[#5f7a61] dark:bg-[#6c8c6f] text-white shadow-md font-black ring-2 ring-[#5f7a61]/30 dark:ring-[#7d9d80]/30 scale-[1.02]'
                      : 'hover:bg-black/[0.05] dark:hover:bg-white/[0.06] text-[#6e6052] dark:text-[#c9bea7]'
                  }`}
                >
                  {isToday && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5f7a61] dark:bg-[#7d9d80] absolute top-1.5" />
                  )}
                  <span
                    className={`text-[10px] uppercase font-bold tracking-tight ${
                      isSelected ? 'text-white/85 font-black' : 'text-[#8c7e70] dark:text-[#a89b8d]'
                    }`}
                  >
                    {dayLabel}
                  </span>
                  <span
                    className={`text-sm sm:text-base mt-0.5 leading-none ${
                      isSelected ? 'text-white font-black' : 'font-extrabold text-[#2d2823] dark:text-[#f4efe8]'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {/* Activity Indicator: Session count / dots */}
                  <div className="h-3 flex items-center justify-center mt-0.5">
                    {stats.count > 0 ? (
                      <span
                        className={`text-[9px] font-black px-1 rounded-full leading-tight ${
                          isSelected
                            ? 'bg-white/30 text-white'
                            : 'bg-[#5f7a61]/15 dark:bg-[#7d9d80]/20 text-[#5f7a61] dark:text-[#8fc493]'
                        }`}
                      >
                        {stats.totalMins}m
                      </span>
                    ) : (
                      <span className="w-1 h-1 rounded-full opacity-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Total Time Badge */}
        <div className="p-3.5 rounded-[20px] bg-white/60 dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08] flex items-center justify-between shadow-2xs">
          <span className="text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d]">
            Total Focus Time:
          </span>
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
                <p className="font-bold text-sm text-[#2d2823] dark:text-[#f4efe8]">
                  {isSelectedToday ? 'No sessions recorded today' : `No sessions recorded for ${formatFriendlyDate(selectedDate)}`}
                </p>
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
