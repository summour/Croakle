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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Tag,
  AlignLeft,
  Search,
} from 'lucide-react';
import { PocketTimerDockIcon, LanternToolIcon } from './FrogIcons';
import { InteractiveFocusTimeChart } from './charts/InteractiveFocusTimeChart';
import { CalendarPickerModal } from './CalendarPickerModal';
import { useSwipeMonth } from '../hooks/useSwipeMonth';
import {
  getTodayIso,
  formatTimeMinutes,
  addDaysIso,
  formatFriendlyDate,
  getWeekDates,
  getMonthWeeks,
  parseIsoDate,
  formatIsoDate,
  formatTimeWithSeconds,
  formatDateTimeWithSeconds,
  DAY_SHORT_NAMES,
  MONTH_NAMES,
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TimeSession | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for manual add / edit
  const [formSubject, setFormSubject] = useState('');
  const [formDate, setFormDate] = useState(getTodayIso());
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formDuration, setFormDuration] = useState(25);
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
    const now = new Date();
    const currentH = String(now.getHours()).padStart(2, '0');
    const currentM = String(now.getMinutes()).padStart(2, '0');

    setFormSubject('');
    setFormDate(selectedDate);
    setFormStartTime(`${currentH}:${currentM}`);
    setFormDuration(25);
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

    const [y, mon, d] = formDate.split('-').map(Number);
    const startDt = new Date(y, (mon || 1) - 1, d, h || 0, m || 0, 0);
    const endDt = new Date(startDt.getTime() + (Number(formDuration) || 25) * 60000);

    const startTimeStr = formatTimeWithSeconds(startDt);
    const endTimeStr = formatTimeWithSeconds(endDt);
    const startedAtFormatted = formatDateTimeWithSeconds(startDt);

    onAddSession({
      subject: formSubject.trim(),
      date: formDate,
      startMinute: startMin,
      duration: Number(formDuration) || 25,
      type: formType,
      sourceType: formSourceType,
      sourceId: formSourceId,
      notes: formNotes.trim(),
      startedAtTimestamp: startDt.getTime(),
      startedAtFormatted,
      startTimeStr,
      startDateStr: formDate,
      endTimeStr,
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

    const [y, mon, d] = formDate.split('-').map(Number);
    const startDt = new Date(y, (mon || 1) - 1, d, h || 0, m || 0, 0);
    const endDt = new Date(startDt.getTime() + (Number(formDuration) || 25) * 60000);

    const startTimeStr = formatTimeWithSeconds(startDt);
    const endTimeStr = formatTimeWithSeconds(endDt);
    const startedAtFormatted = formatDateTimeWithSeconds(startDt);

    onUpdateSession(editingSession.id, {
      subject: formSubject.trim(),
      date: formDate,
      startMinute: startMin,
      duration: Number(formDuration) || 25,
      type: formType,
      sourceType: formSourceType,
      sourceId: formSourceId,
      notes: formNotes.trim(),
      startedAtTimestamp: startDt.getTime(),
      startedAtFormatted,
      startTimeStr,
      startDateStr: formDate,
      endTimeStr,
    });

    setEditingSession(null);
  };

  // Filter sessions for selected date & search query
  const daySessions = sessions
    .filter((s) => s.date === selectedDate)
    .filter((s) => !searchQuery.trim() || s.subject.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (b.startedAtTimestamp || (b.startMinute * 60000)) - (a.startedAtTimestamp || (a.startMinute * 60000)));

  const totalMinutes = daySessions.reduce((acc, s) => acc + s.duration, 0);

  const todayIso = getTodayIso();
  const isSelectedToday = selectedDate === todayIso;
  const selectedDateObj = parseIsoDate(selectedDate);
  const monthIndex = selectedDateObj.getMonth();
  const year = selectedDateObj.getFullYear();
  const monthWeeks = getMonthWeeks(year, monthIndex);
  const activeWeekIndex = monthWeeks.findIndex((w) =>
    w.days.some((d) => formatIsoDate(d.date) === selectedDate)
  );
  const currentWeek = monthWeeks[activeWeekIndex >= 0 ? activeWeekIndex : 0] || monthWeeks[0];
  const weekDays = currentWeek?.days || [];

  const handleGoPrevWeek = () => {
    const d = parseIsoDate(selectedDate);
    d.setDate(d.getDate() - 7);
    setSelectedDate(formatIsoDate(d));
  };

  const handleGoNextWeek = () => {
    const d = parseIsoDate(selectedDate);
    d.setDate(d.getDate() + 7);
    setSelectedDate(formatIsoDate(d));
  };

  const handleGoPrevDay = () => {
    const d = parseIsoDate(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(formatIsoDate(d));
  };

  const handleGoNextDay = () => {
    const d = parseIsoDate(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(formatIsoDate(d));
  };

  const swipeHandlers = useSwipeMonth({
    onPrev: handleGoPrevDay,
    onNext: handleGoNextDay,
  });

  // Target duration calculation for progress bar
  const targetSecs = (activeTimer.targetDurationMinutes || 0) * 60;
  const progressPercent = targetSecs > 0 ? Math.min(100, Math.round((elapsedSeconds / targetSecs) * 100)) : 0;

  const timerPresets = [
    { label: '15m', mins: 15 },
    { label: '25m', mins: 25 },
    { label: '45m', mins: 45 },
    { label: '60m', mins: 60 },
    { label: 'Stopwatch', mins: 0 },
  ];

  // Start Date & Time Display String for active timer
  const initialStartTimestamp = activeTimer.initialStartedAt;
  const formattedStartInfo = initialStartTimestamp
    ? formatDateTimeWithSeconds(initialStartTimestamp)
    : null;

  const typeLabels = {
    focus: 'Focus',
    study: 'Study',
    work: 'Work',
    break: 'Break',
  };

  return (
    <div className="space-y-3.5 pb-24 max-w-lg mx-auto" {...swipeHandlers}>
      {/* 1. TOP: DATE / WEEK NAVIGATOR (Unified iOS 26 Glass UI) */}
      <div className="ios-glass-card p-3.5 sm:p-4 space-y-3 touch-pan-y" {...swipeHandlers}>
        {/* Top Row: Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            id="timer-prev-week"
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
              Focus Sessions
            </p>
            <div className="flex items-center gap-2">
              <strong className="text-base sm:text-lg font-black tracking-tight text-zinc-950 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                {MONTH_NAMES[monthIndex]} {year}
              </strong>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {currentWeek?.label}
              </span>
            </div>
          </button>

          <button
            id="timer-next-week"
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
            const isSelected = formatIsoDate(wd.date) === selectedDate;
            const dayName = DAY_SHORT_NAMES[wd.dayIndex];
            return (
              <button
                key={wd.iso}
                type="button"
                onClick={() => setSelectedDate(formatIsoDate(wd.date))}
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

      {/* 2. MIDDLE: COMPACT FOCUS TIMER CARD */}
      <div className="ios-glass-card p-3.5 sm:p-4 space-y-3">
        {/* Top: Name Input */}
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200/70 dark:border-zinc-800 pb-2">
          <input
            type="text"
            placeholder="Session Name (e.g. Deep Work)"
            value={activeTimer.subject}
            onChange={(e) => onUpdateTimerConfig({ subject: e.target.value })}
            className="w-full bg-transparent text-sm font-bold text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none truncate"
          />
          {activeTimer.isRunning && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Focusing
            </span>
          )}
        </div>

        {/* Dropdown Selectors: Category & Duration */}
        <div className="grid grid-cols-2 gap-2">
          {/* Category Dropdown */}
          <div className="relative">
            <label className="block text-[9.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <div className="relative">
              <select
                value={activeTimer.type}
                onChange={(e) => onUpdateTimerConfig({ type: e.target.value as any })}
                className="w-full appearance-none bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/80 border border-zinc-200/70 dark:border-zinc-700/70 text-zinc-900 dark:text-zinc-100 font-bold text-xs rounded-xl px-2.5 py-1.5 pr-7 transition cursor-pointer focus:outline-none"
              >
                <option value="focus">Focus</option>
                <option value="study">Study</option>
                <option value="work">Work</option>
                <option value="break">Break</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Duration Dropdown */}
          <div className="relative">
            <label className="block text-[9.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
              Duration
            </label>
            <div className="relative">
              <select
                value={activeTimer.targetDurationMinutes}
                onChange={(e) => onUpdateTimerConfig({ targetDurationMinutes: Number(e.target.value) })}
                className="w-full appearance-none bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/80 border border-zinc-200/70 dark:border-zinc-700/70 text-zinc-900 dark:text-zinc-100 font-bold text-xs rounded-xl px-2.5 py-1.5 pr-7 transition cursor-pointer focus:outline-none"
              >
                <option value={15}>15 mins</option>
                <option value={25}>25 mins (Pomodoro)</option>
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins (1 hr)</option>
                <option value={90}>90 mins</option>
                <option value={120}>120 mins (2 hrs)</option>
                <option value={0}>Stopwatch (Count up)</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Digits Display (Compact) */}
        <div className="text-center py-1 space-y-1">
          <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-zinc-950 dark:text-white tabular-nums">
            {formatTimerDisplay(elapsedSeconds)}
          </div>

          {/* Target Progress */}
          {targetSecs > 0 ? (
            <div className="w-full max-w-xs mx-auto pt-0.5 space-y-1">
              <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">
                Target: {activeTimer.targetDurationMinutes}m ({progressPercent}%)
              </p>
            </div>
          ) : (
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">
              {formattedStartInfo ? `Started: ${formattedStartInfo}` : 'Ready to focus'}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-2 pt-0.5">
          {!activeTimer.isRunning ? (
            <button
              type="button"
              onClick={elapsedSeconds > 0 ? onResumeTimer : onStartTimer}
              className="flex-1 max-w-[170px] py-2 rounded-xl bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-98"
            >
              <Play size={13} className="fill-current ml-0.5" />
              <span>{elapsedSeconds > 0 ? 'Resume' : 'Start Focus'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onPauseTimer}
              className="flex-1 max-w-[170px] py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-98"
            >
              <Pause size={13} className="fill-current" />
              <span>Pause</span>
            </button>
          )}

          {elapsedSeconds > 0 && (
            <>
              <button
                type="button"
                onClick={onFinishTimer}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-xs active:scale-98"
                title="Save Session"
              >
                <CheckCircle2 size={13} /> <span>Save</span>
              </button>
              <button
                type="button"
                onClick={onResetTimer}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition"
                title="Reset Timer"
              >
                <RotateCcw size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3. BOTTOM: LOGGED SESSIONS LIST */}
      <div className="ios-glass-card p-4 sm:p-5 space-y-3">
        {/* Header & Add Button */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider">
            Focus History
          </h3>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-[11px] font-bold transition active:scale-95"
          >
            <Plus size={12} />
            <span>Add Manual</span>
          </button>
        </div>

        {/* Total Time Summary */}
        <div className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between text-xs">
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">
            Total Focus ({daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'}):
          </span>
          <strong className="text-zinc-950 dark:text-white font-bold">
            {Math.floor(totalMinutes / 60) > 0 ? `${Math.floor(totalMinutes / 60)}h ` : ''}{totalMinutes % 60}m
          </strong>
        </div>

        {/* Sessions List */}
        <div className="space-y-2 pt-1">
          {daySessions.length === 0 ? (
            <div className="text-center py-6 text-zinc-400 dark:text-zinc-500">
              <p className="text-xs font-medium">
                {isSelectedToday ? 'No sessions logged today' : `No sessions for ${formatFriendlyDate(selectedDate)}`}
              </p>
            </div>
          ) : (
            daySessions.map((session) => {
              const startFormatted = session.startedAtFormatted || (
                session.startTimeStr
                  ? `${session.date} at ${session.startTimeStr}`
                  : `${session.date} at ${formatTimeMinutes(session.startMinute)}`
              );

              return (
                <div
                  key={session.id}
                  className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start justify-between gap-2.5 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                >
                  <div className="min-w-0 space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-zinc-950 dark:text-white truncate">
                        {session.subject}
                      </span>
                      <span className="text-[9.5px] font-bold uppercase px-1.5 py-0.2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        {typeLabels[session.type] || session.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">
                      <Clock size={11} className="text-zinc-400 shrink-0" />
                      <span>{startFormatted}</span>
                      {session.endTimeStr && (
                        <span className="text-zinc-400">➔ {session.endTimeStr}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
                      <span>Duration: <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">{session.duration}m</strong></span>
                      {session.notes && <span>• {session.notes}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(session)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      title="Edit"
                    >
                      <Edit3 size={13} />
                    </button>
                    {deletingSessionId === session.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteSession(session.id);
                            setDeletingSessionId(null);
                          }}
                          className="px-2 py-0.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingSessionId(null)}
                          className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeletingSessionId(session.id)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. ADD / EDIT SESSION MODAL */}
      {(isAddOpen || editingSession) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 w-full max-w-md shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-950 dark:text-white">
                {editingSession ? 'Edit Session' : 'Log Focus Session'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingSession(null);
                }}
                className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={editingSession ? handleEditSubmit : handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Subject / Activity
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Work, Reading"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="720"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white capitalize"
                  >
                    <option value="focus">Focus</option>
                    <option value="study">Study</option>
                    <option value="work">Work</option>
                    <option value="break">Break</option>
                  </select>
                </div>
              </div>

              {/* Link to habit or project */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    Link To
                  </label>
                  <select
                    value={formSourceType}
                    onChange={(e) => {
                      setFormSourceType(e.target.value as any);
                      setFormSourceId('');
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white"
                  >
                    <option value="">None (Custom)</option>
                    <option value="habit">Habit</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    Select Item
                  </label>
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
                    className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white disabled:opacity-40"
                  >
                    <option value="">Select...</option>
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
                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes or milestones..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs shadow-xs transition"
              >
                {editingSession ? 'Update Session' : 'Save Session'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Full Month Calendar Picker Modal */}
      <CalendarPickerModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDateObj}
        onSelectDate={(d) => setSelectedDate(formatIsoDate(d))}
        title="Timer Calendar"
      />
    </div>
  );
};
