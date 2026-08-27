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
  Sparkles,
  Target,
  Flame,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { PocketTimerDockIcon, LanternToolIcon, PixelLightbulbIcon, PixelCheckIcon } from './FrogIcons';
import { InteractiveFocusTimeChart } from './charts/InteractiveFocusTimeChart';
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
      {/* Live Focus Timer Card - iOS 26 High Contrast Glass Styling */}
      <div className="pt-1 pb-1">
        <div className="relative overflow-hidden bg-white/90 dark:bg-zinc-900/90 text-zinc-950 dark:text-white rounded-[32px] p-5 sm:p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-4 backdrop-blur-2xl transition-colors">
          
          {/* Header Row */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-black/[0.04] dark:border-white/[0.06] text-zinc-900 dark:text-white">
                <PocketTimerDockIcon size={18} />
              </div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-black text-xs uppercase tracking-wider text-zinc-900 dark:text-white">Continuous Focus Timer</h2>
                {activeTimer.isRunning && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34C759]" />
                  </span>
                )}
              </div>
            </div>

            {/* Type Selector */}
            <select
              value={activeTimer.type}
              onChange={(e) => onUpdateTimerConfig({ type: e.target.value as any })}
              className="bg-zinc-100 dark:bg-zinc-800 text-xs font-black text-zinc-900 dark:text-zinc-100 px-3 py-1.5 rounded-full border border-black/[0.05] dark:border-white/10 focus:outline-none backdrop-blur-md transition hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
            >
              <option value="focus" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Focus</option>
              <option value="study" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Study</option>
              <option value="work" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Work</option>
              <option value="break" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Break</option>
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
                  className={`text-[11px] font-black px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 ios-tap ${
                    isSelected
                      ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm scale-[1.02]'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-black/[0.04] dark:border-white/[0.06] hover:bg-zinc-200 dark:hover:bg-zinc-700'
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
                className="text-center bg-transparent text-sm font-bold text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 border-b border-zinc-200 dark:border-zinc-800 pb-1 focus:outline-none focus:border-zinc-950 dark:focus:border-white w-full transition"
              />
            </div>

            <div className="relative inline-block py-1">
              <div className="text-5xl sm:text-6xl md:text-7xl font-black font-mono tracking-tighter text-zinc-950 dark:text-white tabular-nums">
                {formatTimerDisplay(elapsedSeconds)}
              </div>
              {targetSecs > 0 && (
                <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mt-1">
                  Target: {activeTimer.targetDurationMinutes} mins ({progressPercent}%)
                </p>
              )}
            </div>

            {/* Target Progress Bar */}
            {targetSecs > 0 && (
              <div className="w-full max-w-xs mx-auto h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-black/[0.04] dark:border-white/10">
                <div
                  className="h-full bg-zinc-950 dark:bg-white rounded-full transition-all duration-300 shadow-xs"
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
                className="px-7 py-3 rounded-full bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-black text-sm flex items-center gap-2 shadow-md transition-all transform active:scale-95 ios-tap"
              >
                <Play size={17} className="fill-current ml-0.5" />
                <span>{elapsedSeconds > 0 ? 'Resume Focus' : 'Start Focus'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPauseTimer}
                className="px-7 py-3 rounded-full bg-[#FF9500] hover:bg-[#E08500] text-white font-black text-sm flex items-center gap-2 shadow-md transition-all transform active:scale-95 ios-tap"
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
                  className="px-5 py-3 rounded-full bg-[#34C759] hover:bg-[#2EB04E] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 transition shadow-md ios-tap"
                  title="Finish and log session"
                >
                  <PixelCheckIcon size={16} /> <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={onResetTimer}
                  className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition ios-tap"
                  title="Reset Timer"
                >
                  <RotateCcw size={16} />
                </button>
              </>
            )}
          </div>

          <div className="relative z-10 text-center flex items-center justify-center gap-1.5">
            <PixelLightbulbIcon size={14} className="text-[#FF9500]" />
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
              Continuous background timer tracks accurately even when switching to other pages
            </p>
          </div>
        </div>
      </div>

      {/* Date Selector & Day Summary Card */}
      <div className="ios-glass-card p-5 space-y-4">
        {/* Header with Title and Add Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[14px] bg-zinc-100 dark:bg-zinc-800 border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-center shadow-2xs">
              <PocketTimerDockIcon size={18} className="text-[#007AFF]" />
            </div>
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Time Log
              </p>
              <h3 className="text-lg font-black tracking-tight text-zinc-950 dark:text-white">Sessions Log</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-black transition shadow-xs ios-tap"
            title="Add Session Manually"
          >
            <Plus size={16} />
            <span>Add Session</span>
          </button>
        </div>

        {/* Day Stepper & Quick Date Navigation */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-[20px] bg-zinc-100/70 dark:bg-zinc-800/70 border border-black/[0.04] dark:border-white/[0.06]">
          <button
            type="button"
            onClick={handlePrevDay}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition ios-tap shrink-0"
            title="Previous Day"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2 min-w-0 justify-center flex-1">
            <label className="relative flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition text-center min-w-0">
              <Calendar size={15} className="text-[#007AFF] shrink-0" />
              <span className="text-xs sm:text-sm font-black text-zinc-950 dark:text-white truncate">
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
                className="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[11px] font-black hover:bg-zinc-300 transition shrink-0 ios-tap"
                title="Jump to Today"
              >
                Today
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextDay}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition ios-tap shrink-0"
            title="Next Day"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* 7-Day Interactive Week Strip */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10.5px] font-bold text-zinc-400 dark:text-zinc-500">
              Week View
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevWeek}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition"
              >
                ◀ Prev Week
              </button>
              <button
                type="button"
                onClick={handleNextWeek}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition"
              >
                Next Week ▶
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 p-1.5 rounded-[22px] bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
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
                      ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm font-black scale-[1.02]'
                      : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {isToday && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-white absolute top-1.5" />
                  )}
                  <span
                    className={`text-[10px] uppercase font-bold tracking-tight ${
                      isSelected ? 'text-white/80 dark:text-zinc-950/80 font-black' : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {dayLabel}
                  </span>
                  <span
                    className={`text-sm sm:text-base mt-0.5 leading-none ${
                      isSelected ? 'text-white dark:text-zinc-950 font-black' : 'font-extrabold text-zinc-900 dark:text-zinc-100'
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
                            ? 'bg-white/30 dark:bg-zinc-950/30 text-white dark:text-zinc-950'
                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
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
        <div className="p-3.5 rounded-[20px] bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-2xs">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            Total Focus Time:
          </span>
          <strong className="text-sm font-black text-zinc-950 dark:text-white">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m ({daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'})
          </strong>
        </div>

        {/* Interactive Focus Session & Category Analytics Chart */}
        {sessions.length > 0 && (
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PocketTimerDockIcon size={16} className="text-[#FF9500]" />
                <h3 className="font-black text-sm tracking-tight text-zinc-950 dark:text-white">
                  Focus Activity & Categories
                </h3>
              </div>
              <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500">
                Tap bar to inspect
              </span>
            </div>
            <InteractiveFocusTimeChart
              sessions={sessions}
              selectedDate={selectedDate}
              onSelectDate={(iso) => setSelectedDate(iso)}
            />
          </div>
        )}

        {/* Sessions List */}
        <div className="space-y-3">
          {daySessions.length === 0 ? (
            <div className="text-center py-8 text-zinc-400 dark:text-zinc-500 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-[24px] bg-zinc-100 dark:bg-zinc-800 border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-center p-2 shadow-2xs">
                <LanternToolIcon size={34} />
              </div>
              <div>
                <p className="font-bold text-sm text-zinc-950 dark:text-white">
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
                  className="p-4 rounded-[22px] border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-zinc-950 dark:text-white truncate">
                        {session.subject}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                        {session.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                      <span>
                        {formatTimeMinutes(session.startMinute)} – {formatTimeMinutes(endMin)}
                      </span>
                      <span>•</span>
                      <span>{session.duration} mins</span>
                    </div>
                    {session.notes && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{session.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(session)}
                      className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition ios-tap"
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
                          className="px-1.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeletingSessionId(session.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">
                {editingSession ? 'Edit Session' : 'Add Time Session'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingSession(null);
                }}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={editingSession ? handleEditSubmit : handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Subject / Activity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reading Chapter 3"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Category</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white capitalize"
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
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="720"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Link to habit or project */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Linked Item</label>
                  <select
                    value={formSourceType}
                    onChange={(e) => {
                      setFormSourceType(e.target.value as any);
                      setFormSourceId('');
                    }}
                    className="w-full px-3 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white capitalize"
                  >
                    <option value="">None (Custom)</option>
                    <option value="habit">Habit</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Select Item</label>
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
                    className="w-full px-3 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white disabled:opacity-40"
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
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Session Notes</label>
                <textarea
                  rows={2}
                  placeholder="Summary of what was achieved..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-black text-sm shadow-xs transition"
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
