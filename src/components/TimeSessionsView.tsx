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
import {
  getTodayIso,
  formatTimeMinutes,
  addDaysIso,
  formatFriendlyDate,
  getWeekDates,
  parseIsoDate,
  formatTimeWithSeconds,
  formatDateTimeWithSeconds,
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
    <div className="space-y-4 pb-28 max-w-lg mx-auto">
      {/* 1. SIMPLE & MINIMALIST FOCUS TIMER CARD */}
      <div className="pt-1">
        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/95 text-zinc-950 dark:text-white rounded-[28px] p-5 sm:p-6 shadow-sm border border-zinc-200/80 dark:border-zinc-800 space-y-4 transition-all">
          
          {/* Top Bar: Subject Name & Type Selector */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="ชื่อกิจกรรม / What are you working on?"
                value={activeTimer.subject}
                onChange={(e) => onUpdateTimerConfig({ subject: e.target.value })}
                className="w-full bg-transparent text-base sm:text-lg font-bold text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none truncate"
              />
            </div>

            {/* Type selector */}
            <div className="flex items-center gap-1.5 shrink-0">
              {(['focus', 'study', 'work', 'break'] as const).map((t) => {
                const isActive = activeTimer.type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onUpdateTimerConfig({ type: t })}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all capitalize ${
                      isActive
                        ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {typeLabels[t]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {timerPresets.map((p) => {
              const isSelected = activeTimer.targetDurationMinutes === p.mins;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onUpdateTimerConfig({ targetDurationMinutes: p.mins })}
                  className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold'
                      : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Main Clean Digits Display */}
          <div className="text-center py-2 space-y-1">
            <div className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tight text-zinc-950 dark:text-white tabular-nums">
              {formatTimerDisplay(elapsedSeconds)}
            </div>

            {/* Target Progress Bar */}
            {targetSecs > 0 && (
              <div className="w-full max-w-xs mx-auto pt-2 space-y-1">
                <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                  เป้าหมาย: {activeTimer.targetDurationMinutes} นาที ({progressPercent}%)
                </p>
              </div>
            )}
          </div>

          {/* RECORDED START TIME & DATE BANNER */}
          <div className="rounded-xl px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Clock size={14} className="text-zinc-500 dark:text-zinc-400 shrink-0" />
              <div className="truncate">
                {formattedStartInfo ? (
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                    เริ่มเมื่อ: <strong className="font-bold text-zinc-950 dark:text-white">{formattedStartInfo}</strong>
                  </span>
                ) : (
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {formatFriendlyDate(todayIso)} • พร้อมเริ่มจับเวลา
                  </span>
                )}
              </div>
            </div>

            {activeTimer.isRunning && (
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                กำลังจับเวลา
              </span>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-center gap-2.5 pt-1">
            {!activeTimer.isRunning ? (
              <button
                type="button"
                onClick={elapsedSeconds > 0 ? onResumeTimer : onStartTimer}
                className="flex-1 max-w-[200px] py-3 rounded-full bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-98"
              >
                <Play size={16} className="fill-current ml-0.5" />
                <span>{elapsedSeconds > 0 ? 'จับเวลาต่อ' : 'เริ่มจับเวลา'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPauseTimer}
                className="flex-1 max-w-[200px] py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-98"
              >
                <Pause size={16} className="fill-current" />
                <span>พักชั่วคราว</span>
              </button>
            )}

            {elapsedSeconds > 0 && (
              <>
                <button
                  type="button"
                  onClick={onFinishTimer}
                  className="px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-1.5 transition shadow-xs active:scale-98"
                  title="บันทึกข้อมูลเวลาและวันที่"
                >
                  <CheckCircle2 size={16} /> <span>บันทึก</span>
                </button>
                <button
                  type="button"
                  onClick={onResetTimer}
                  className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition"
                  title="รีเซ็ตตัวจับเวลา"
                >
                  <RotateCcw size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. DATE SELECTOR & SESSION LOGS */}
      <div className="bg-white dark:bg-zinc-900/95 text-zinc-950 dark:text-white rounded-[28px] p-5 shadow-sm border border-zinc-200/80 dark:border-zinc-800 space-y-4">
        
        {/* Header & Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-zinc-950 dark:text-white">
              ประวัติการจับเวลา (History Log)
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              บันทึกเวลาและวันที่เริ่มต้นของแต่ละเซสชัน
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold transition"
          >
            <Plus size={14} />
            <span>เพิ่มเอง</span>
          </button>
        </div>

        {/* Day Navigation Bar */}
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800">
          <button
            type="button"
            onClick={handlePrevDay}
            className="p-1.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition shrink-0"
            title="Previous Day"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2 min-w-0 justify-center flex-1">
            <label className="relative flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition text-center min-w-0">
              <Calendar size={14} className="text-zinc-600 dark:text-zinc-300 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white truncate">
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
                className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[11px] font-bold hover:bg-zinc-300 transition shrink-0"
              >
                วันนี้
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextDay}
            className="p-1.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition shrink-0"
            title="Next Day"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* 7-Day Compact Week Bar */}
        <div className="grid grid-cols-7 gap-1 p-1 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/50">
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
                className={`py-1.5 px-0.5 rounded-xl flex flex-col items-center justify-center transition-all relative select-none ${
                  isSelected
                    ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold shadow-xs'
                    : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {isToday && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-zinc-950 dark:bg-white absolute top-1" />
                )}
                <span className={`text-[10px] ${isSelected ? 'opacity-80' : 'text-zinc-400'}`}>
                  {dayLabel}
                </span>
                <span className="text-xs font-bold leading-tight">
                  {dayNum}
                </span>
                {stats.count > 0 && (
                  <span
                    className={`text-[9px] mt-0.5 px-1 rounded-full ${
                      isSelected
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-zinc-950'
                        : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {stats.totalMins}m
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Total Time Summary */}
        <div className="px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">
            รวมเวลาโฟกัส ({daySessions.length} เซสชัน):
          </span>
          <strong className="text-zinc-950 dark:text-white font-bold">
            {Math.floor(totalMinutes / 60)} ชม. {totalMinutes % 60} นาที ({totalMinutes}m)
          </strong>
        </div>

        {/* Sessions List */}
        <div className="space-y-2.5 pt-1">
          {daySessions.length === 0 ? (
            <div className="text-center py-8 text-zinc-400 dark:text-zinc-500 space-y-2">
              <LanternToolIcon size={28} className="mx-auto opacity-50" />
              <p className="text-xs font-medium">
                {isSelectedToday ? 'ยังไม่มีข้อมูลการจับเวลาสำหรับวันนี้' : `ยังไม่มีข้อมูลสำหรับ ${formatFriendlyDate(selectedDate)}`}
              </p>
              <p className="text-[11px] opacity-75">
                กดเริ่มจับเวลาด้านบนเพื่อบันทึกวันและเวลาแบบอัตโนมัติ
              </p>
            </div>
          ) : (
            daySessions.map((session) => {
              const startFormatted = session.startedAtFormatted || (
                session.startTimeStr
                  ? `${session.date} เวลา ${session.startTimeStr}`
                  : `${session.date} เวลา ${formatTimeMinutes(session.startMinute)}`
              );

              return (
                <div
                  key={session.id}
                  className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start justify-between gap-3 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                >
                  <div className="min-w-0 space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-zinc-950 dark:text-white truncate">
                        {session.subject}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        {typeLabels[session.type] || session.type}
                      </span>
                    </div>

                    {/* Prominent Start Date & Time Record Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                      <Clock size={13} className="text-zinc-400 shrink-0" />
                      <span>
                        เริ่ม: <strong className="text-zinc-900 dark:text-white">{startFormatted}</strong>
                      </span>
                      {session.endTimeStr && (
                        <span className="text-zinc-400">➔ {session.endTimeStr}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                      <span>ระยะเวลา: <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">{session.duration} นาที</strong></span>
                      {session.notes && <span>• {session.notes}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(session)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      title="แก้ไข"
                    >
                      <Edit3 size={14} />
                    </button>
                    {deletingSessionId === session.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteSession(session.id);
                            setDeletingSessionId(null);
                          }}
                          className="px-2 py-0.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold"
                        >
                          ลบ
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingSessionId(null)}
                          className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px]"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeletingSessionId(session.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                        title="ลบ"
                      >
                        <Trash2 size={14} />
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
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                {editingSession ? 'แก้ไขข้อมูลเซสชัน' : 'บันทึกเซสชันเวลา'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingSession(null);
                }}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={editingSession ? handleEditSubmit : handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  ชื่อกิจกรรม (Subject)
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น อ่านหนังสือ, ทบทวนบทเรียน"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                    วันที่เริ่ม
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                    เวลาที่เริ่ม (Start Time)
                  </label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                    ระยะเวลา (นาที)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="720"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                    ประเภท
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white capitalize"
                  >
                    <option value="focus">Focus</option>
                    <option value="study">Study</option>
                    <option value="work">Work</option>
                    <option value="break">Break</option>
                  </select>
                </div>
              </div>

              {/* Link to habit or project */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                    เชื่อมโยงกับ
                  </label>
                  <select
                    value={formSourceType}
                    onChange={(e) => {
                      setFormSourceType(e.target.value as any);
                      setFormSourceId('');
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white"
                  >
                    <option value="">ไม่มี (กำหนดเอง)</option>
                    <option value="habit">นิสัย (Habit)</option>
                    <option value="project">โปรเจกต์ (Project)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                    เลือกรายการ
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
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white disabled:opacity-40"
                  >
                    <option value="">เลือกรายการ...</option>
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
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  บันทึกเพิ่มเติม (Notes)
                </label>
                <textarea
                  rows={2}
                  placeholder="รายละเอียดสิ่งที่ทำสำเร็จ..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-sm shadow-xs transition"
              >
                {editingSession ? 'บันทึกการแก้ไข' : 'บันทึกเซสชัน'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
