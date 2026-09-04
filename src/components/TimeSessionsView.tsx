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
      {/* 1. TOP: DATE / WEEK NAVIGATOR */}
      <div className="border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] p-3 space-y-2.5 touch-pan-y" {...swipeHandlers}>
        {/* Top Row: Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            id="timer-prev-week"
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
              Focus Sessions
            </p>
            <div className="flex items-center gap-2">
              <strong className="text-base sm:text-lg font-bold font-oswald tracking-tight uppercase text-[#1D1B18] dark:text-[#F8F7F4]">
                {MONTH_NAMES[monthIndex]} {year}
              </strong>
              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4]">
                {currentWeek?.label}
              </span>
            </div>
          </button>

          <button
            id="timer-next-week"
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
            const isSelected = formatIsoDate(wd.date) === selectedDate;
            const dayName = DAY_SHORT_NAMES[wd.dayIndex];
            const hasActivity = sessions.some((s) => s.date === wd.iso);

            return (
              <button
                key={wd.iso}
                type="button"
                onClick={() => setSelectedDate(formatIsoDate(wd.date))}
                className={`py-1.5 px-0.5 text-center flex flex-col items-center justify-center border font-mono transition-all duration-100 cursor-pointer ${
                  !wd.inMonth
                    ? 'opacity-30 border-dashed border-[#1D1B18] dark:border-[#F8F7F4]'
                    : isSelected
                    ? 'bg-[#E63946] text-[#F8F7F4] font-bold border border-[#1D1B18] dark:border-[#F8F7F4]'
                    : wd.isCurrentDay
                    ? 'bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] font-bold border border-[#1D1B18] dark:border-[#F8F7F4]'
                    : 'bg-white dark:bg-[#1D1B18] text-[#1D1B18] dark:text-[#F8F7F4] border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 hover:border-[#1D1B18] dark:hover:border-[#F8F7F4]'
                }`}
              >
                <span className="text-[9px] uppercase font-bold tracking-wider">{dayName}</span>
                <span className="text-sm font-extrabold">{wd.date.getDate()}</span>
                <span
                  className={`w-1.5 h-1.5 mt-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] ${
                    hasActivity
                      ? isSelected
                        ? 'bg-[#F8F7F4]'
                        : 'bg-[#E63946]'
                      : 'invisible'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MIDDLE: FOCUS TIMER CARD (Variation 12 Minimalist) */}
      <div className="border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] p-3.5 space-y-3">
        {/* Top: Name Input */}
        <div className="flex items-center justify-between gap-2 border-b border-[#1D1B18] dark:border-[#F8F7F4] pb-2">
          <input
            type="text"
            placeholder="SESSION NAME (E.G. DEEP WORK)"
            value={activeTimer.subject}
            onChange={(e) => onUpdateTimerConfig({ subject: e.target.value })}
            className="w-full bg-transparent text-sm font-mono font-bold text-[#1D1B18] dark:text-[#F8F7F4] placeholder-[#1D1B18]/50 dark:placeholder-[#F8F7F4]/50 focus:outline-none uppercase"
          />
          {activeTimer.isRunning && (
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#F8F7F4] bg-[#E63946] border border-[#1D1B18] dark:border-[#F8F7F4] px-2 py-0.5 shrink-0 uppercase">
              <span className="w-1.5 h-1.5 bg-[#F8F7F4] animate-pulse" />
              FOCUSING
            </span>
          )}
        </div>

        {/* Dropdown Selectors: Category & Duration */}
        <div className="grid grid-cols-2 gap-2">
          {/* Category Dropdown */}
          <div className="relative">
            <label className="block text-[9px] font-mono font-bold text-[#555558] dark:text-[#9E9EA4] uppercase tracking-wider mb-1">
              Category
            </label>
            <div className="relative">
              <select
                value={activeTimer.type}
                onChange={(e) => onUpdateTimerConfig({ type: e.target.value as any })}
                className="w-full appearance-none bg-white dark:bg-[#1D1B18] border border-[#1D1B18] dark:border-[#F8F7F4] text-[#1D1B18] dark:text-[#F8F7F4] font-mono font-bold text-xs rounded-none px-2.5 py-1.5 pr-7 cursor-pointer focus:outline-none"
              >
                <option value="focus">Focus</option>
                <option value="study">Study</option>
                <option value="work">Work</option>
                <option value="break">Break</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1D1B18] dark:text-[#F8F7F4] pointer-events-none" />
            </div>
          </div>

          {/* Duration Dropdown */}
          <div className="relative">
            <label className="block text-[9px] font-mono font-bold text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 uppercase tracking-wider mb-1">
              Duration
            </label>
            <div className="relative">
              <select
                value={activeTimer.targetDurationMinutes}
                onChange={(e) => onUpdateTimerConfig({ targetDurationMinutes: Number(e.target.value) })}
                className="w-full appearance-none bg-white dark:bg-[#1D1B18] border border-[#1D1B18] dark:border-[#F8F7F4] text-[#1D1B18] dark:text-[#F8F7F4] font-mono font-bold text-xs rounded-none px-2.5 py-1.5 pr-7 cursor-pointer focus:outline-none"
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
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1D1B18] dark:text-[#F8F7F4] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Digits Display (Variation 12 .timer-display) */}
        <div className="text-center py-1">
          <div className="timer-display text-4xl sm:text-5xl font-bold font-oswald tracking-tight text-[#1D1B18] dark:text-[#F8F7F4] tabular-nums">
            {formatTimerDisplay(elapsedSeconds)}
          </div>

          {/* Target Progress */}
          {targetSecs > 0 ? (
            <div className="w-full max-w-xs mx-auto pt-2 space-y-1">
              <div className="h-2 bg-[#F8F7F4] dark:bg-[#252320] border border-[#1D1B18] dark:border-[#F8F7F4] overflow-hidden">
                <div
                  className="h-full bg-[#E63946] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] font-mono text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 font-bold">
                TARGET: {activeTimer.targetDurationMinutes}M ({progressPercent}%)
              </p>
            </div>
          ) : (
            <p className="text-[10px] font-mono text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 font-bold pt-1">
              {formattedStartInfo ? `STARTED: ${formattedStartInfo}` : 'READY TO FOCUS'}
            </p>
          )}
        </div>

        {/* Action Controls (Variation 12 .btn) */}
        <div className="space-y-2 pt-1">
          {!activeTimer.isRunning ? (
            <button
              type="button"
              onClick={elapsedSeconds > 0 ? onResumeTimer : onStartTimer}
              className="btn flex items-center justify-center gap-2"
            >
              <Play size={16} className="fill-current ml-0.5" />
              <span>{elapsedSeconds > 0 ? 'RESUME FOCUS' : 'START FOCUS'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onPauseTimer}
              className="btn flex items-center justify-center gap-2 bg-[#E63946] text-white border-[#1D1B18]"
            >
              <Pause size={16} className="fill-current" />
              <span>PAUSE FOCUS</span>
            </button>
          )}

          {elapsedSeconds > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onFinishTimer}
                className="flex-1 py-2 px-3 bg-[#1D1B18] dark:bg-[#F8F7F4] text-[#F8F7F4] dark:text-[#1D1B18] border border-[#1D1B18] dark:border-[#F8F7F4] font-oswald font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90"
                title="Save Session"
              >
                <CheckCircle2 size={15} /> <span>SAVE SESSION</span>
              </button>
              <button
                type="button"
                onClick={onResetTimer}
                className="p-2 bg-white dark:bg-[#1D1B18] text-[#1D1B18] dark:text-[#F8F7F4] border border-[#1D1B18] dark:border-[#F8F7F4] cursor-pointer hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
                title="Reset Timer"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM: LOGGED SESSIONS LIST */}
      <div className="border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] p-4 sm:p-5 space-y-3">
        {/* Header & Add Button */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-oswald text-[#1D1B18] dark:text-[#F8F7F4] uppercase tracking-wider">
            Focus History
          </h3>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="add-btn text-[10px] py-1 px-2.5 flex items-center gap-1"
          >
            <Plus size={12} />
            <span>Add Manual</span>
          </button>
        </div>

        {/* Total Time Summary */}
        <div className="px-3 py-2 bg-[#F8F7F4] dark:bg-[#252320] border border-[#1D1B18] dark:border-[#F8F7F4] flex items-center justify-between text-xs font-mono">
          <span className="text-[#1D1B18]/70 dark:text-[#F8F7F4]/70">
            Total Focus ({daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'}):
          </span>
          <strong className="text-[#1D1B18] dark:text-[#F8F7F4] font-bold">
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
                  className="p-3 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] flex items-start justify-between gap-2.5"
                >
                  <div className="min-w-0 space-y-1 flex-1 font-mono">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs font-oswald uppercase text-[#1D1B18] dark:text-[#F8F7F4] truncate">
                        {session.subject}
                      </span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4]">
                        {typeLabels[session.type] || session.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-[#1D1B18]/70 dark:text-[#F8F7F4]/70">
                      <Clock size={11} className="text-[#1D1B18]/50 dark:text-[#F8F7F4]/50 shrink-0" />
                      <span>{startFormatted}</span>
                      {session.endTimeStr && (
                        <span className="text-[#1D1B18]/50 dark:text-[#F8F7F4]/50">➔ {session.endTimeStr}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-[#1D1B18]/60 dark:text-[#F8F7F4]/60">
                      <span>Duration: <strong className="text-[#1D1B18] dark:text-[#F8F7F4] font-bold">{session.duration}m</strong></span>
                      {session.notes && <span>• {session.notes}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(session)}
                      className="p-1 border border-[#1D1B18]/20 dark:border-[#F8F7F4]/20 text-[#1D1B18]/60 hover:text-[#1D1B18] dark:hover:text-[#F8F7F4] transition cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 size={12} />
                    </button>
                    {deletingSessionId === session.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteSession(session.id);
                            setDeletingSessionId(null);
                          }}
                          className="px-2 py-0.5 border border-[#E63946] bg-[#E63946] text-[#F8F7F4] text-[9px] font-bold uppercase cursor-pointer"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingSessionId(null)}
                          className="px-1.5 py-0.5 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 bg-[#F8F7F4] dark:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] text-[9px] uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeletingSessionId(session.id)}
                        className="p-1 border border-[#1D1B18]/20 dark:border-[#F8F7F4]/20 text-[#1D1B18]/60 hover:text-[#E63946] transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={12} />
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1D1B18] border border-[#1D1B18] dark:border-[#F8F7F4] p-4 sm:p-5 w-full max-w-md space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-[#1D1B18]/20 dark:border-[#F8F7F4]/20 pb-2.5">
              <h2 className="text-sm font-bold font-oswald uppercase text-[#1D1B18] dark:text-[#F8F7F4]">
                {editingSession ? 'Edit Session' : 'Log Focus Session'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingSession(null);
                }}
                className="w-6 h-6 border border-[#1D1B18]/30 dark:border-[#F8F7F4]/30 flex items-center justify-center text-[#1D1B18] dark:text-[#F8F7F4] cursor-pointer hover:border-[#1D1B18] dark:hover:border-[#F8F7F4]"
              >
                <X size={13} />
              </button>
            </div>

            <form onSubmit={editingSession ? handleEditSubmit : handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">
                  Subject / Activity
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Work, Reading"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-xs text-[#1D1B18] dark:text-[#F8F7F4] focus:outline-none uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-xs text-[#1D1B18] dark:text-[#F8F7F4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-xs text-[#1D1B18] dark:text-[#F8F7F4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="720"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-xs text-[#1D1B18] dark:text-[#F8F7F4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">
                    Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-xs text-[#1D1B18] dark:text-[#F8F7F4] uppercase focus:outline-none cursor-pointer"
                  >
                    <option value="focus">Focus</option>
                    <option value="study">Study</option>
                    <option value="work">Work</option>
                    <option value="break">Break</option>
                  </select>
                </div>
              </div>

              {/* Link to habit or project */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">
                    Link To
                  </label>
                  <select
                    value={formSourceType}
                    onChange={(e) => {
                      setFormSourceType(e.target.value as any);
                      setFormSourceId('');
                    }}
                    className="w-full px-2 py-1.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-xs text-[#1D1B18] dark:text-[#F8F7F4] uppercase focus:outline-none cursor-pointer"
                  >
                    <option value="">None (Custom)</option>
                    <option value="habit">Habit</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">
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
                    className="w-full px-2 py-1.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-xs text-[#1D1B18] dark:text-[#F8F7F4] disabled:opacity-30 focus:outline-none cursor-pointer"
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
                <label className="block text-[10px] font-bold uppercase text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes or milestones..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#F8F7F4] dark:bg-[#252320] text-xs text-[#1D1B18] dark:text-[#F8F7F4] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 border border-[#1D1B18] dark:border-[#F8F7F4] bg-[#1D1B18] hover:bg-[#1D1B18]/90 dark:bg-[#F8F7F4] dark:hover:bg-[#F8F7F4]/90 text-[#F8F7F4] dark:text-[#1D1B18] font-bold font-oswald uppercase text-xs tracking-wider cursor-pointer transition"
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
