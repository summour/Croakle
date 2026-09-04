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
      <div className="border-[2.5px] border-[#1F1B1A] bg-[#0074DB] dark:bg-[#1D4ED8] text-white rounded-2xl shadow-[4px_4px_0px_#1F1B1A] dark:shadow-[4px_4px_0px_#000000] p-3 space-y-2.5 touch-pan-y" {...swipeHandlers}>
        {/* Top Row: Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            id="timer-prev-week"
            type="button"
            onClick={handleGoPrevWeek}
            className="w-8 h-8 rounded-xl border-[2px] border-[#1F1B1A] bg-white dark:bg-[#252320] flex items-center justify-center font-bold text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[2px_2px_0px_#1F1B1A] transition-all cursor-pointer hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
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
              Focus Sessions
            </p>
            <div className="flex items-center gap-2">
              <strong className="text-base sm:text-lg font-bold font-oswald tracking-tight uppercase text-white">
                {MONTH_NAMES[monthIndex]} {year}
              </strong>
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border-[1.5px] border-[#1F1B1A] bg-[#FEF08A] text-[#1F1B1A] shadow-[1px_1px_0px_#1F1B1A]">
                {currentWeek?.label}
              </span>
            </div>
          </button>

          <button
            id="timer-next-week"
            type="button"
            onClick={handleGoNextWeek}
            className="w-8 h-8 rounded-xl border-[2px] border-[#1F1B1A] bg-white dark:bg-[#252320] flex items-center justify-center font-bold text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[2px_2px_0px_#1F1B1A] transition-all cursor-pointer hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Next Week"
            title="Next Week"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* 7-Day Interactive Strip */}
        <div className="grid grid-cols-7 gap-1 pt-1.5 border-t-[2px] border-[#1F1B1A]/40 dark:border-white/30">
          {weekDays.map((wd) => {
            const isSelected = formatIsoDate(wd.date) === selectedDate;
            const dayName = DAY_SHORT_NAMES[wd.dayIndex];
            const hasActivity = sessions.some((s) => s.date === wd.iso);

            return (
              <button
                key={wd.iso}
                type="button"
                onClick={() => setSelectedDate(formatIsoDate(wd.date))}
                className={`py-1.5 px-0.5 text-center flex flex-col items-center justify-center font-mono rounded-xl transition-all duration-100 cursor-pointer border-[2px] ${
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
                <span className="text-sm font-extrabold">{wd.date.getDate()}</span>
                <span
                  className={`w-1.5 h-1.5 mt-0.5 rounded-full border border-[#1F1B1A] ${
                    hasActivity
                      ? isSelected
                        ? 'bg-white'
                        : 'bg-[#E02921]'
                      : 'invisible'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MIDDLE: FOCUS TIMER CARD (Electric Blue Neo-Pop Card) */}
      <div className="border-[2.5px] border-[#1F1B1A] bg-[#0074DB] dark:bg-[#1D4ED8] text-white rounded-3xl shadow-[5px_5px_0px_#1F1B1A] dark:shadow-[5px_5px_0px_#000000] p-4 sm:p-5 space-y-3.5">
        {/* Top: Name Input & Active Badge */}
        <div className="flex items-center justify-between gap-2 border-b-[2px] border-[#1F1B1A] pb-3.5">
          <input
            type="text"
            placeholder="SESSION NAME (E.G. DEEP FOCUS)"
            value={activeTimer.subject}
            onChange={(e) => onUpdateTimerConfig({ subject: e.target.value })}
            className="w-full bg-[#FFFEF7] dark:bg-[#1D1B18] text-[#1F1B1A] dark:text-[#F8F7F4] placeholder-[#1F1B1A]/40 dark:placeholder-[#F8F7F4]/40 border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none uppercase shadow-[2px_2px_0px_#1F1B1A]"
          />
          {activeTimer.isRunning ? (
            <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-white bg-[#E02921] border-[2px] border-[#1F1B1A] rounded-full px-3 py-1.5 shrink-0 uppercase shadow-[2px_2px_0px_#1F1B1A]">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              FOCUSING
            </span>
          ) : (
            <span className="text-[10px] font-mono font-bold text-[#1F1B1A] bg-[#FEF08A] border-[2px] border-[#1F1B1A] rounded-full px-3 py-1.5 shrink-0 uppercase shadow-[2px_2px_0px_#1F1B1A]">
              {activeTimer.targetDurationMinutes ? `${activeTimer.targetDurationMinutes} MIN` : 'TIMER'}
            </span>
          )}
        </div>

        {/* Presets Quick Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {timerPresets.map((preset) => {
            const isPresetActive = activeTimer.targetDurationMinutes === preset.mins;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onUpdateTimerConfig({ targetDurationMinutes: preset.mins })}
                className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border-[2px] border-[#1F1B1A] transition shrink-0 cursor-pointer ${
                  isPresetActive
                    ? 'bg-[#FEF08A] text-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A] font-extrabold'
                    : 'bg-[#FFFEF7] dark:bg-[#1D1B18] text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[1.5px_1.5px_0px_#1F1B1A] hover:bg-[#FEF08A] hover:text-[#1F1B1A]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Dropdown Selectors: Category & Duration */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Category Dropdown */}
          <div className="relative">
            <label className="block text-[10px] font-mono font-extrabold text-white uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="relative">
              <select
                value={activeTimer.type}
                onChange={(e) => onUpdateTimerConfig({ type: e.target.value as any })}
                className="w-full appearance-none bg-[#FFFEF7] dark:bg-[#1D1B18] border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] text-[#1F1B1A] dark:text-[#F8F7F4] font-mono font-bold text-xs rounded-xl px-3 py-2 pr-7 cursor-pointer focus:outline-none shadow-[2px_2px_0px_#1F1B1A]"
              >
                <option value="focus">Focus</option>
                <option value="study">Study</option>
                <option value="work">Work</option>
                <option value="break">Break</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1F1B1A] dark:text-[#F8F7F4] pointer-events-none" />
            </div>
          </div>

          {/* Duration Dropdown */}
          <div className="relative">
            <label className="block text-[10px] font-mono font-extrabold text-white uppercase tracking-wider mb-1.5">
              Duration
            </label>
            <div className="relative">
              <select
                value={activeTimer.targetDurationMinutes}
                onChange={(e) => onUpdateTimerConfig({ targetDurationMinutes: Number(e.target.value) })}
                className="w-full appearance-none bg-[#FFFEF7] dark:bg-[#1D1B18] border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] text-[#1F1B1A] dark:text-[#F8F7F4] font-mono font-bold text-xs rounded-xl px-3 py-2 pr-7 cursor-pointer focus:outline-none shadow-[2px_2px_0px_#1F1B1A]"
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
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1F1B1A] dark:text-[#F8F7F4] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Inset Screen / Main Digits Display */}
        <div className="bg-[#FFFEF7] dark:bg-[#1D1B18] rounded-2xl border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] shadow-[4px_4px_0px_#1F1B1A] p-4 text-center my-2 space-y-2">
          <div className="text-4xl sm:text-5xl font-extrabold font-oswald tracking-tight text-[#1F1B1A] dark:text-[#F8F7F4] tabular-nums">
            {formatTimerDisplay(elapsedSeconds)}
          </div>

          {/* Target Progress */}
          {targetSecs > 0 ? (
            <div className="w-full max-w-xs mx-auto pt-1 space-y-1.5">
              <div className="h-3 bg-[#E5E2DC] dark:bg-[#252320] rounded-full border-[1.5px] border-[#1F1B1A] overflow-hidden">
                <div
                  className="h-full bg-[#E02921] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] font-mono text-[#1F1B1A]/80 dark:text-[#F8F7F4]/80 font-bold uppercase">
                GOAL: {activeTimer.targetDurationMinutes}M • {progressPercent}% COMPLETED
              </p>
            </div>
          ) : (
            <p className="text-[10px] font-mono text-[#1F1B1A]/80 dark:text-[#F8F7F4]/80 font-bold pt-1 uppercase">
              {formattedStartInfo ? `STARTED: ${formattedStartInfo}` : 'READY TO FOCUS'}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-1">
          {!activeTimer.isRunning ? (
            <button
              type="button"
              onClick={elapsedSeconds > 0 ? onResumeTimer : onStartTimer}
              className="w-full py-2.5 px-4 bg-[#E02921] hover:bg-[#C9221B] text-white rounded-xl border-[2px] border-[#1F1B1A] shadow-[3px_3px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1F1B1A] font-oswald font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Play size={16} className="fill-current ml-0.5" />
              <span>{elapsedSeconds > 0 ? 'RESUME FOCUS' : 'START FOCUS'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onPauseTimer}
              className="w-full py-2.5 px-4 bg-[#E02921] hover:bg-[#C9221B] text-white rounded-xl border-[2px] border-[#1F1B1A] shadow-[3px_3px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1F1B1A] font-oswald font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
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
                className="flex-1 py-2.5 px-3 bg-[#22C55E] hover:bg-[#16A34A] text-[#1F1B1A] rounded-xl border-[2px] border-[#1F1B1A] shadow-[2.5px_2.5px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5 font-oswald font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                title="Save Session"
              >
                <CheckCircle2 size={15} /> <span>SAVE SESSION</span>
              </button>
              <button
                type="button"
                onClick={onResetTimer}
                className="p-2.5 bg-[#FFFEF7] hover:bg-[#FEF08A] text-[#1F1B1A] rounded-xl border-[2px] border-[#1F1B1A] shadow-[2.5px_2.5px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
                title="Reset Timer"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM: LOGGED SESSIONS LIST */}
      <div className="border-[2.5px] border-[#1F1B1A] bg-[#FED843] text-[#1F1B1A] rounded-2xl shadow-[4px_4px_0px_#1F1B1A] p-4 sm:p-5 space-y-3">
        {/* Header & Add Button */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-oswald text-[#1F1B1A] uppercase tracking-wider">
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
        <div className="px-3.5 py-2.5 bg-white text-[#1F1B1A] border-[2px] border-[#1F1B1A] rounded-xl shadow-[2px_2px_0px_#1F1B1A] flex items-center justify-between text-xs font-mono">
          <span className="font-bold">
            Total Focus ({daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'}):
          </span>
          <strong className="font-extrabold text-sm">
            {Math.floor(totalMinutes / 60) > 0 ? `${Math.floor(totalMinutes / 60)}h ` : ''}{totalMinutes % 60}m
          </strong>
        </div>

        {/* Sessions List */}
        <div className="space-y-2.5 pt-1">
          {daySessions.length === 0 ? (
            <div className="text-center py-6 text-[#1F1B1A]/70">
              <p className="text-xs font-medium font-mono">
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
                  className="p-3.5 border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] rounded-xl shadow-[2.5px_2.5px_0px_#1F1B1A] dark:shadow-[2.5px_2.5px_0px_#000000] flex items-start justify-between gap-2.5 transition hover:-translate-y-0.5"
                >
                  <div className="min-w-0 space-y-1 flex-1 font-mono">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs font-oswald uppercase text-[#1F1B1A] dark:text-[#F8F7F4] truncate">
                        {session.subject}
                      </span>
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border-[1.5px] border-[#1F1B1A] bg-[#BAE6FD] text-[#005BAF] shadow-[1px_1px_0px_#1F1B1A]">
                        {typeLabels[session.type] || session.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70">
                      <Clock size={11} className="text-[#1F1B1A]/50 dark:text-[#F8F7F4]/50 shrink-0" />
                      <span>{startFormatted}</span>
                      {session.endTimeStr && (
                        <span className="text-[#1F1B1A]/50 dark:text-[#F8F7F4]/50">➔ {session.endTimeStr}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70">
                      <span>Duration: <strong className="text-[#1F1B1A] dark:text-[#F8F7F4] font-bold">{session.duration}m</strong></span>
                      {session.notes && <span>• {session.notes}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(session)}
                      className="w-7 h-7 rounded-lg border-[1.5px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] flex items-center justify-center text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[1px_1px_0px_#1F1B1A] hover:bg-[#FEF08A] transition cursor-pointer"
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
                          className="px-2 py-1 rounded-lg border-[1.5px] border-[#1F1B1A] bg-[#E02921] text-white text-[9px] font-bold uppercase cursor-pointer shadow-[1px_1px_0px_#1F1B1A]"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingSessionId(null)}
                          className="px-1.5 py-1 rounded-lg border-[1.5px] border-[#1F1B1A] bg-white text-[#1F1B1A] text-[9px] uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeletingSessionId(session.id)}
                        className="w-7 h-7 rounded-lg border-[1.5px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] flex items-center justify-center text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[1px_1px_0px_#1F1B1A] hover:bg-[#E02921] hover:text-white transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-[#1F1B1A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFEF7] dark:bg-[#1D1B18] border-[3px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-3xl shadow-[6px_6px_0px_#1F1B1A] p-5 w-full max-w-md space-y-3 font-mono">
            <div className="flex items-center justify-between border-b-[2px] border-[#1F1B1A]/20 dark:border-[#F8F7F4]/20 pb-2.5">
              <h2 className="text-sm font-bold font-oswald uppercase text-[#1F1B1A] dark:text-[#F8F7F4]">
                {editingSession ? 'Edit Session' : 'Log Focus Session'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingSession(null);
                }}
                className="w-7 h-7 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] flex items-center justify-center text-[#1F1B1A] dark:text-[#F8F7F4] shadow-[1.5px_1.5px_0px_#1F1B1A] cursor-pointer hover:bg-[#FEF08A]"
              >
                <X size={13} />
              </button>
            </div>

            <form onSubmit={editingSession ? handleEditSubmit : handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">
                  Subject / Activity
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Work, Reading"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-xs text-[#1F1B1A] dark:text-[#F8F7F4] focus:outline-none uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-xs text-[#1F1B1A] dark:text-[#F8F7F4] focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-xs text-[#1F1B1A] dark:text-[#F8F7F4] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="720"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-xs text-[#1F1B1A] dark:text-[#F8F7F4] focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">
                    Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-xs text-[#1F1B1A] dark:text-[#F8F7F4] uppercase focus:outline-none cursor-pointer font-bold"
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
                  <label className="block text-[10px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">
                    Link To
                  </label>
                  <select
                    value={formSourceType}
                    onChange={(e) => {
                      setFormSourceType(e.target.value as any);
                      setFormSourceId('');
                    }}
                    className="w-full px-3 py-2 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-xs text-[#1F1B1A] dark:text-[#F8F7F4] uppercase focus:outline-none cursor-pointer font-bold"
                  >
                    <option value="">None (Custom)</option>
                    <option value="habit">Habit</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">
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
                    className="w-full px-3 py-2 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-xs text-[#1F1B1A] dark:text-[#F8F7F4] disabled:opacity-30 focus:outline-none cursor-pointer font-bold"
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
                <label className="block text-[10px] font-bold uppercase text-[#1F1B1A]/70 dark:text-[#F8F7F4]/70 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes or milestones..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-[2px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-white dark:bg-[#252320] text-xs text-[#1F1B1A] dark:text-[#F8F7F4] focus:outline-none resize-none font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl border-[2px] border-[#1F1B1A] bg-[#FEF08A] hover:bg-[#FEF08A]/90 text-[#1F1B1A] font-bold font-oswald uppercase text-xs tracking-wider cursor-pointer transition shadow-[2px_2px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
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
