import React, { useState, useEffect } from 'react';
import {
  PageType,
  HabitTemplate,
  MonthData,
  Project,
  NoteItem,
  TimeSession,
  AppSettings,
  ActiveTimerState,
  PixelSceneConfig,
  DEFAULT_HABITS,
  DEFAULT_PROJECTS,
  DEFAULT_ACTIVE_TIMER,
  DEFAULT_PIXEL_SCENE,
} from './types';
import {
  loadHabitsState,
  saveHabitsState,
  getOrCreateMonthData,
  loadProjectsState,
  saveProjectsState,
  loadNotesState,
  saveNotesState,
  loadSessionsState,
  saveSessionsState,
  loadSettingsState,
  saveSettingsState,
  loadActiveTimerState,
  saveActiveTimerState,
  loadPixelSceneState,
  savePixelSceneState,
} from './utils/storage';
import {
  getTodayIso,
  getDaysInMonth,
  formatIsoDate,
  formatTimeWithSeconds,
  formatDateTimeWithSeconds,
} from './utils/dateUtils';
import { BottomDock } from './components/BottomDock';
import { HabitsView } from './components/HabitsView';
import { ProjectsView } from './components/ProjectsView';
import { MoodView } from './components/MoodView';
import { NotesView } from './components/NotesView';
import { TimeSessionsView } from './components/TimeSessionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { LiveTimerBar } from './components/LiveTimerBar';
import { soundEngine, triggerHaptic } from './utils/audioUtils';
import confetti from 'canvas-confetti';

export function App() {
  const [activePage, setActivePage] = useState<PageType>('mood');

  // Today Date & Active View Dates
  const [todayDate] = useState(new Date());
  const [trackYear, setTrackYear] = useState(todayDate.getFullYear());
  const [trackMonth, setTrackMonth] = useState(todayDate.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayDate);

  // Core Data States
  const [habitStore, setHabitStore] = useState(loadHabitsState);
  const [projects, setProjects] = useState<Project[]>(loadProjectsState);
  const [notes, setNotes] = useState<NoteItem[]>(loadNotesState);
  const [sessions, setSessions] = useState<TimeSession[]>(loadSessionsState);
  const [settings, setSettings] = useState<AppSettings>(loadSettingsState);
  const [pixelScene, setPixelScene] = useState<PixelSceneConfig>(loadPixelSceneState);

  // Persist Pixel Scene Config whenever changed
  useEffect(() => {
    savePixelSceneState(pixelScene);
  }, [pixelScene]);

  const handleUpdatePixelScene = (patch: Partial<PixelSceneConfig>) => {
    setPixelScene((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  // Persistent Live Focus Timer State
  const [activeTimer, setActiveTimer] = useState<ActiveTimerState>(loadActiveTimerState);
  const [nowTimestamp, setNowTimestamp] = useState(Date.now());

  // Continuous accurate background ticker
  useEffect(() => {
    let interval: any = null;
    if (activeTimer.isRunning) {
      interval = setInterval(() => {
        setNowTimestamp(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer.isRunning]);

  // Persist Active Timer whenever it changes
  useEffect(() => {
    saveActiveTimerState(activeTimer);
  }, [activeTimer]);

  // Calculate live elapsed seconds based on timestamp diff + previous accumulated time
  const elapsedSeconds = activeTimer.accumulatedSeconds + (
    activeTimer.isRunning && activeTimer.startedAt
      ? Math.max(0, Math.floor((nowTimestamp - activeTimer.startedAt) / 1000))
      : 0
  );

  // Sync theme to root html element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'dim');
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'dim') {
      root.classList.add('dim', 'dark');
    } else {
      root.classList.add('light');
    }
  }, [settings.theme]);

  // Persist State Changes
  useEffect(() => {
    saveHabitsState(habitStore);
  }, [habitStore]);

  useEffect(() => {
    saveProjectsState(projects);
  }, [projects]);

  useEffect(() => {
    saveNotesState(notes);
  }, [notes]);

  useEffect(() => {
    saveSessionsState(sessions);
  }, [sessions]);

  useEffect(() => {
    saveSettingsState(settings);
  }, [settings]);

  // Ensure current month data is initialized
  const currentMonthData = getOrCreateMonthData(habitStore, trackYear, trackMonth);

  // Month navigation handlers (fully synchronized with selectedDate)
  const handlePrevMonth = () => {
    let newM = trackMonth - 1;
    let newY = trackYear;
    if (newM < 0) {
      newM = 11;
      newY = trackYear - 1;
    }
    setTrackMonth(newM);
    setTrackYear(newY);
    setSelectedDate((prev) => {
      const maxDays = getDaysInMonth(newY, newM);
      const day = Math.min(prev.getDate(), maxDays);
      return new Date(newY, newM, day);
    });
  };

  const handleNextMonth = () => {
    let newM = trackMonth + 1;
    let newY = trackYear;
    if (newM > 11) {
      newM = 0;
      newY = trackYear + 1;
    }
    setTrackMonth(newM);
    setTrackYear(newY);
    setSelectedDate((prev) => {
      const maxDays = getDaysInMonth(newY, newM);
      const day = Math.min(prev.getDate(), maxDays);
      return new Date(newY, newM, day);
    });
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    if (date.getMonth() !== trackMonth || date.getFullYear() !== trackYear) {
      setTrackMonth(date.getMonth());
      setTrackYear(date.getFullYear());
    }
  };

  const handlePrevWeek = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 7);
    handleSelectDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 7);
    handleSelectDate(d);
  };

  // Habit Actions
  const handleToggleHabitDay = (habitIndex: number, dayOfMonth: number) => {
    const dayIdx = dayOfMonth - 1;

    setHabitStore((prev) => {
      const monthData = getOrCreateMonthData(prev, trackYear, trackMonth);
      const habits = [...monthData.habits];
      if (habits[habitIndex]) {
        const days = [...habits[habitIndex].days];
        days[dayIdx] = !days[dayIdx];
        habits[habitIndex] = { ...habits[habitIndex], days };
      }
      return {
        ...prev,
        months: {
          ...prev.months,
          [`${trackYear}-${String(trackMonth + 1).padStart(2, '0')}`]: {
            ...monthData,
            habits,
          },
        },
      };
    });
  };

  const handleToggleHabitToday = (habitIndex: number) => {
    handleToggleHabitDay(habitIndex, todayDate.getDate());
  };

  const handleAddHabit = (habitData: Omit<HabitTemplate, 'id'>) => {
    const newHabit: HabitTemplate = {
      ...habitData,
      id: `h_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    };
    setHabitStore((prev) => ({
      ...prev,
      habitTemplates: [...prev.habitTemplates, newHabit],
    }));
  };

  const handleUpdateHabit = (index: number, updated: HabitTemplate) => {
    setHabitStore((prev) => {
      const templates = [...prev.habitTemplates];
      templates[index] = updated;
      return { ...prev, habitTemplates: templates };
    });
  };

  const handleDeleteHabit = (index: number) => {
    setHabitStore((prev) => {
      const templates = prev.habitTemplates.filter((_, i) => i !== index);
      return { ...prev, habitTemplates: templates };
    });
  };

  const handleToggleCompleteHabit = (index: number) => {
    setHabitStore((prev) => {
      const templates = [...prev.habitTemplates];
      if (templates[index]) {
        templates[index] = { ...templates[index], completed: !templates[index].completed };
      }
      return { ...prev, habitTemplates: templates };
    });
  };

  const handleReorderHabits = (reordered: HabitTemplate[]) => {
    setHabitStore((prev) => ({ ...prev, habitTemplates: reordered }));
  };

  // Project Actions
  const handleToggleProjectDay = (projectIndex: number, dayIndex: number, weekKey: string) => {
    setProjects((prev) => {
      const copy = [...prev];
      const proj = copy[projectIndex];
      if (proj) {
        const weeklyDays = { ...proj.weeklyDays };
        const currentDays = weeklyDays[weekKey] ? [...weeklyDays[weekKey]] : new Array(7).fill(false);
        currentDays[dayIndex] = !currentDays[dayIndex];
        weeklyDays[weekKey] = currentDays;
        copy[projectIndex] = { ...proj, weeklyDays };
      }
      return copy;
    });
  };

  const handleAddProject = (projectData: Omit<Project, 'id' | 'weeklyDays'>) => {
    const newProject: Project = {
      ...projectData,
      id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      weeklyDays: {},
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const handleUpdateProject = (index: number, updated: Project) => {
    setProjects((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const handleDeleteProject = (index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleCompleteProject = (index: number) => {
    setProjects((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], completed: !copy[index].completed };
      }
      return copy;
    });
  };

  const handleReorderProjects = (reordered: Project[]) => {
    setProjects(reordered);
  };

  // Mood Actions
  const handleSetMoodDay = (dayOfMonth: number, moodValue: number | null) => {
    const dayIdx = dayOfMonth - 1;
    setHabitStore((prev) => {
      const monthData = getOrCreateMonthData(prev, trackYear, trackMonth);
      const moods = [...monthData.moods];
      moods[dayIdx] = moodValue;
      return {
        ...prev,
        months: {
          ...prev.months,
          [`${trackYear}-${String(trackMonth + 1).padStart(2, '0')}`]: {
            ...monthData,
            moods,
          },
        },
      };
    });
  };

  const handleSelectMoodToday = (moodValue: number) => {
    handleSetMoodDay(todayDate.getDate(), moodValue);
  };

  // Note Actions
  const handleAddNote = (noteData: Omit<NoteItem, 'id' | 'createdAt'>) => {
    const newNote: NoteItem = {
      ...noteData,
      id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);

    // 1. Sync Mood Tracker if category is 'mood'
    if (noteData.type === 'mood' && typeof noteData.moodValue === 'number') {
      const parts = noteData.date.split('-').map(Number);
      if (parts.length === 3) {
        const [y, m, d] = parts;
        const monthKey = `${y}-${String(m).padStart(2, '0')}`;
        setHabitStore((prev) => {
          const monthData = getOrCreateMonthData(prev, y, m - 1);
          const moods = [...monthData.moods];
          moods[d - 1] = noteData.moodValue ?? null;
          return {
            ...prev,
            months: {
              ...prev.months,
              [monthKey]: {
                ...monthData,
                moods,
              },
            },
          };
        });
      }
    }

    // 2. Sync Habit Completion if category is 'habit' and linked to habit
    if (noteData.type === 'habit' && noteData.sourceId) {
      const parts = noteData.date.split('-').map(Number);
      if (parts.length === 3) {
        const [y, m, d] = parts;
        const monthKey = `${y}-${String(m).padStart(2, '0')}`;
        setHabitStore((prev) => {
          const habitIndex = prev.habitTemplates.findIndex((h) => h.id === noteData.sourceId);
          if (habitIndex === -1) return prev;
          const monthData = getOrCreateMonthData(prev, y, m - 1);
          const monthHabits = monthData.habits.map((mh, idx) => {
            if (idx === habitIndex) {
              const days = [...mh.days];
              days[d - 1] = true;
              return { ...mh, days };
            }
            return mh;
          });
          return {
            ...prev,
            months: {
              ...prev.months,
              [monthKey]: {
                ...monthData,
                habits: monthHabits,
              },
            },
          };
        });
      }
    }
  };

  const handleUpdateNote = (id: string, updated: Partial<NoteItem>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));

    if (updated.type === 'mood' && typeof updated.moodValue === 'number' && updated.date) {
      const parts = updated.date.split('-').map(Number);
      if (parts.length === 3) {
        const [y, m, d] = parts;
        const monthKey = `${y}-${String(m).padStart(2, '0')}`;
        setHabitStore((prev) => {
          const monthData = getOrCreateMonthData(prev, y, m - 1);
          const moods = [...monthData.moods];
          moods[d - 1] = updated.moodValue ?? null;
          return {
            ...prev,
            months: {
              ...prev.months,
              [monthKey]: {
                ...monthData,
                moods,
              },
            },
          };
        });
      }
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Session Actions
  const handleAddSession = (sessionData: Omit<TimeSession, 'id'>) => {
    const newSession: TimeSession = {
      ...sessionData,
      id: `s_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    };
    setSessions((prev) => [...prev, newSession]);
  };

  const handleUpdateSession = (id: string, updated: Partial<TimeSession>) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  // Continuous Live Focus Timer Handlers
  const handleStartTimer = () => {
    if (settings.soundEnabled) soundEngine.playTapSound();
    if (settings.hapticEnabled) triggerHaptic();
    const now = Date.now();
    setActiveTimer((prev) => ({
      ...prev,
      isRunning: true,
      startedAt: now,
      initialStartedAt: prev.initialStartedAt || now,
      accumulatedSeconds: 0,
    }));
  };

  const handlePauseTimer = () => {
    if (settings.soundEnabled) soundEngine.playTapSound();
    if (settings.hapticEnabled) triggerHaptic();
    setActiveTimer((prev) => {
      if (!prev.isRunning || !prev.startedAt) return prev;
      const additional = Math.max(0, Math.floor((Date.now() - prev.startedAt) / 1000));
      return {
        ...prev,
        isRunning: false,
        startedAt: null,
        accumulatedSeconds: prev.accumulatedSeconds + additional,
      };
    });
  };

  const handleResumeTimer = () => {
    if (settings.soundEnabled) soundEngine.playTapSound();
    if (settings.hapticEnabled) triggerHaptic();
    const now = Date.now();
    setActiveTimer((prev) => ({
      ...prev,
      isRunning: true,
      startedAt: now,
      initialStartedAt: prev.initialStartedAt || now,
    }));
  };

  const handleResetTimer = () => {
    if (settings.hapticEnabled) triggerHaptic();
    setActiveTimer((prev) => ({
      ...prev,
      isRunning: false,
      startedAt: null,
      initialStartedAt: null,
      accumulatedSeconds: 0,
    }));
  };

  const handleFinishTimer = () => {
    const totalSecs = activeTimer.accumulatedSeconds + (
      activeTimer.isRunning && activeTimer.startedAt
        ? Math.max(0, Math.floor((Date.now() - activeTimer.startedAt) / 1000))
        : 0
    );

    if (totalSecs < 5) {
      alert('Focus session was less than 5 seconds. Not recorded.');
      handleResetTimer();
      return;
    }

    const durationMinutes = Math.max(1, Math.round(totalSecs / 60));
    const finishTimestamp = Date.now();
    const startTimestamp = activeTimer.initialStartedAt || (finishTimestamp - totalSecs * 1000);
    const startDateObj = new Date(startTimestamp);
    const finishDateObj = new Date(finishTimestamp);

    const startMinutes = startDateObj.getHours() * 60 + startDateObj.getMinutes();
    const startIso = formatIsoDate(startDateObj);
    const startTimeStr = formatTimeWithSeconds(startDateObj);
    const endTimeStr = formatTimeWithSeconds(finishDateObj);
    const startedAtFormatted = formatDateTimeWithSeconds(startDateObj);

    handleAddSession({
      subject: activeTimer.subject.trim() || 'Focus Session',
      date: startIso,
      startMinute: Math.max(0, startMinutes),
      duration: durationMinutes,
      type: activeTimer.type,
      sourceType: activeTimer.sourceType,
      sourceId: activeTimer.sourceId,
      notes: `Started at ${startTimeStr} (${durationMinutes}m)`,
      startedAtTimestamp: startTimestamp,
      startedAtFormatted,
      startTimeStr,
      startDateStr: startIso,
      endTimeStr,
    });

    if (settings.soundEnabled) soundEngine.playCompletionChime();
    if (settings.hapticEnabled) triggerHaptic();

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
    });

    handleResetTimer();
  };

  const handleUpdateTimerConfig = (patch: Partial<ActiveTimerState>) => {
    setActiveTimer((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  const handleDataImported = () => {
    setHabitStore(loadHabitsState());
    setProjects(loadProjectsState());
    setNotes(loadNotesState());
    setSessions(loadSessionsState());
    setSettings(loadSettingsState());
    setPixelScene(loadPixelSceneState());
  };

  const handleResetData = () => {
    setHabitStore({ habitTemplates: [...DEFAULT_HABITS], months: {} });
    setProjects([...DEFAULT_PROJECTS]);
    setNotes([]);
    setSessions([]);
    setPixelScene({ ...DEFAULT_PIXEL_SCENE });
  };

  return (
    <main
      id="croakle-app"
      className="h-[100dvh] h-screen w-screen transition-colors font-mono selection:bg-[#1F1B1A] selection:text-white relative overflow-hidden flex flex-col items-center justify-center p-0 sm:p-4"
      style={{
        backgroundColor: settings.theme === 'dark' ? '#2B0A08' : '#D32018',
        backgroundImage: settings.theme === 'dark'
          ? 'radial-gradient(#1A0605 1.5px, transparent 1.5px)'
          : 'radial-gradient(#BB1912 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* MASTER UNIFIED CONTAINER: Neo-Pop 500px, 2.5px solid dark border, rounded corners & sticker shadow */}
      <div
        id="croakle-master-frame"
        className="relative z-10 w-full max-w-[500px] h-full sm:h-[900px] max-h-[100dvh] sm:max-h-[96vh] flex flex-col bg-[#D32018] dark:bg-[#2B0A08] border-0 sm:border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] sm:rounded-[28px] sm:shadow-[6px_6px_0px_#1F1B1A] dark:sm:shadow-[6px_6px_0px_#000000] overflow-hidden transition-all duration-300"
      >
        {/* Header */}
        <header
          className="shrink-0 h-14 sm:h-16 px-5 sm:px-6 border-b-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#D32018] dark:bg-[#2B0A08] flex items-center transition-colors select-none"
        >
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-white uppercase leading-none">
            CROAKLE
          </h1>
        </header>

        {/* Scrollable Viewport Container */}
        <div
          id="croakle-scroll-area"
          className="scroll-area flex-1 w-full px-4 sm:px-5 pt-4 pb-6 overflow-y-auto overscroll-y-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-[#D32018] dark:bg-[#2B0A08]"
        >
          {activePage === 'best' && (
            <HabitsView
              habits={habitStore.habitTemplates}
              monthData={currentMonthData}
              year={trackYear}
              monthIndex={trackMonth}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onToggleHabitDay={handleToggleHabitDay}
              onAddHabit={handleAddHabit}
              onUpdateHabit={handleUpdateHabit}
              onDeleteHabit={handleDeleteHabit}
              onToggleCompleteHabit={handleToggleCompleteHabit}
              onReorderHabits={handleReorderHabits}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'track' && (
            <HabitsView
              habits={habitStore.habitTemplates}
              monthData={currentMonthData}
              year={trackYear}
              monthIndex={trackMonth}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onToggleHabitDay={handleToggleHabitDay}
              onAddHabit={handleAddHabit}
              onUpdateHabit={handleUpdateHabit}
              onDeleteHabit={handleDeleteHabit}
              onToggleCompleteHabit={handleToggleCompleteHabit}
              onReorderHabits={handleReorderHabits}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'project' && (
            <ProjectsView
              projects={projects}
              year={trackYear}
              monthIndex={trackMonth}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onToggleProjectDay={handleToggleProjectDay}
              onAddProject={handleAddProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onToggleCompleteProject={handleToggleCompleteProject}
              onReorderProjects={handleReorderProjects}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'mood' && (
            <MoodView
              monthData={currentMonthData}
              year={trackYear}
              monthIndex={trackMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onSetMoodDay={handleSetMoodDay}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'notes' && (
            <NotesView
              notes={notes}
              habits={habitStore.habitTemplates}
              projects={projects}
              year={trackYear}
              monthIndex={trackMonth}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'time' && (
            <TimeSessionsView
              sessions={sessions}
              habits={habitStore.habitTemplates}
              projects={projects}
              activeTimer={activeTimer}
              elapsedSeconds={elapsedSeconds}
              onStartTimer={handleStartTimer}
              onPauseTimer={handlePauseTimer}
              onResumeTimer={handleResumeTimer}
              onResetTimer={handleResetTimer}
              onFinishTimer={handleFinishTimer}
              onUpdateTimerConfig={handleUpdateTimerConfig}
              onAddSession={handleAddSession}
              onUpdateSession={handleUpdateSession}
              onDeleteSession={handleDeleteSession}
            />
          )}

          {activePage === 'analysis' && (
            <AnalyticsView
              habits={habitStore.habitTemplates}
              monthData={currentMonthData}
              projects={projects}
              notes={notes}
              sessions={sessions}
              year={trackYear}
              monthIndex={trackMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={setSettings}
              habits={habitStore.habitTemplates}
              monthData={currentMonthData}
              projects={projects}
              pixelScene={pixelScene}
              onUpdatePixelScene={handleUpdatePixelScene}
              onDataImported={handleDataImported}
              onResetData={handleResetData}
              onNavigate={setActivePage}
            />
          )}
        </div>

        {/* Floating Continuous Live Activity Island (Visible on all tabs when timer is running/paused, except when inside Focus tab) */}
        {activePage !== 'time' && (
          <LiveTimerBar
            activeTimer={activeTimer}
            elapsedSeconds={elapsedSeconds}
            onTogglePlayPause={() => {
              if (activeTimer.isRunning) {
                handlePauseTimer();
              } else {
                handleResumeTimer();
              }
            }}
            onFinishSession={handleFinishTimer}
            onOpenTimer={() => setActivePage('time')}
          />
        )}

        {/* Floating Modern Bottom Navigation Dock anchored inside master frame */}
        <BottomDock
          activePage={activePage}
          onSelectPage={setActivePage}
          isTimerRunning={activeTimer.isRunning}
        />
      </div>
    </main>
  );
}
export default App;
