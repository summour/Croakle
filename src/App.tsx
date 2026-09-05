import React, { useState, useEffect, useCallback } from 'react';
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
import { BottomDock, NAV_GROUPS } from './components/BottomDock';
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
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { UserAppStatePayload } from './lib/firebase';

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

  // Synchronize remote data received from Firebase Cloud
  const handleCloudStateLoaded = useCallback((data: UserAppStatePayload) => {
    if (data.habits) {
      setHabitStore(data.habits);
      saveHabitsState(data.habits);
    }
    if (data.projects) {
      setProjects(data.projects);
      saveProjectsState(data.projects);
    }
    if (data.notes) {
      setNotes(data.notes);
      saveNotesState(data.notes);
    }
    if (data.sessions) {
      setSessions(data.sessions);
      saveSessionsState(data.sessions);
    }
    if (data.settings) {
      setSettings(data.settings);
      saveSettingsState(data.settings);
    }
    if (data.pixelScene) {
      setPixelScene(data.pixelScene);
      savePixelSceneState(data.pixelScene);
    }
  }, []);

  // Firebase Real-time Cloud Sync Hook
  const firebaseAuth = useFirebaseAuth({
    habitStore,
    projects,
    notes,
    sessions,
    settings,
    pixelScene,
    onCloudStateLoaded: handleCloudStateLoaded,
  });

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

  // Responsive check: desktop (>= 768px) vs mobile (< 768px)
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation handler: On desktop smooth scrolls to box; On mobile switches active view directly
  const handleNavigate = (pageId: PageType) => {
    setActivePage(pageId);
    if (isDesktop) {
      const targetKey = pageId === 'best' ? 'track' : pageId === 'analysis' ? 'notes' : pageId;
      const element = document.getElementById(`section-${targetKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // ScrollSpy to update activePage on desktop as user scrolls continuously
  useEffect(() => {
    if (!isDesktop) return;
    const sectionIds: PageType[] = ['mood', 'track', 'project', 'time', 'notes', 'settings'];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 180;

      let currentSection: PageType = 'mood';
      for (const id of sectionIds) {
        const el = document.getElementById(`section-${id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          if (scrollY + threshold >= top) {
            currentSection = id;
          }
        }
      }
      setActivePage((prev) => (prev !== currentSection ? currentSection : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDesktop]);

  return (
    <main
      id="croakle-app"
      className="min-h-screen w-full transition-colors font-mono selection:bg-[#1F1B1A] selection:text-white relative flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4 bg-transparent"
    >
      {/* Pinned Fixed Background: Stays completely static and does not scroll on any screen size */}
      <div
        id="croakle-pinned-background"
        className="fixed inset-0 pointer-events-none -z-10 transition-colors"
        style={{
          backgroundColor: settings.theme === 'dark' ? '#2B0A08' : '#D32018',
          backgroundImage: settings.theme === 'dark'
            ? 'radial-gradient(#1A0605 1.5px, transparent 1.5px)'
            : 'radial-gradient(#BB1912 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* ========================================================================= */}
      {/* MOBILE VERSION (< 768px): Original layout, single view per tab, NO flow   */}
      {/* ========================================================================= */}
      {!isDesktop ? (
        <div
          id="croakle-mobile-frame"
          className="relative z-10 w-full max-w-[540px] min-h-screen flex flex-col bg-transparent transition-colors pb-24"
        >
          {/* Mobile Sticky Header */}
          <header
            id="croakle-mobile-header"
            style={{ paddingTop: 'max(0.625rem, calc(0.2rem + env(safe-area-inset-top, 0px)))' }}
            className="sticky top-0 z-40 px-4 py-3 border-b-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#D32018] dark:bg-[#2B0A08] flex items-center justify-between transition-colors select-none shadow-[0_3px_0px_rgba(0,0,0,0.15)]"
          >
            <div className="flex items-center gap-2">
              <h1
                onClick={() => handleNavigate('mood')}
                className="text-2xl font-black tracking-tight font-display text-white uppercase leading-none cursor-pointer hover:opacity-90 transition-opacity"
              >
                CROAKLE
              </h1>
            </div>
            {/* Active section badge on mobile */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black tracking-widest text-[#1F1B1A] bg-[#FEF08A] border-[1.5px] border-[#1F1B1A] px-2.5 py-1 rounded-full shadow-[2px_2px_0px_#1F1B1A] uppercase">
                {NAV_GROUPS.find((g) => g.activeKeys.includes(activePage))?.label || activePage}
              </span>
            </div>
          </header>

          {/* Mobile Content: ONLY the active page is displayed! */}
          <div className="w-full px-3.5 pt-3.5 flex-1">
            {activePage === 'mood' && (
              <MoodView
                monthData={currentMonthData}
                year={trackYear}
                monthIndex={trackMonth}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onSetMoodDay={handleSetMoodDay}
                onNavigate={handleNavigate}
              />
            )}

            {(activePage === 'track' || activePage === 'best') && (
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
                onNavigate={handleNavigate}
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
                onNavigate={handleNavigate}
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

            {(activePage === 'notes' || activePage === 'analysis') && (
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
                onNavigate={handleNavigate}
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
                onNavigate={handleNavigate}
                firebaseUser={firebaseAuth.user}
                firebaseAuthLoading={firebaseAuth.authLoading}
                firebaseSyncStatus={firebaseAuth.syncStatus}
                firebaseLastSyncedAt={firebaseAuth.lastSyncedAt}
                firebaseErrorMessage={firebaseAuth.errorMessage}
                onFirebaseSignIn={firebaseAuth.signIn}
                onFirebaseSignOut={firebaseAuth.signOut}
                onFirebaseSyncNow={firebaseAuth.syncNow}
              />
            )}
          </div>

          {/* Floating Continuous Live Activity Island on mobile */}
          {activeTimer.isRunning && activePage !== 'time' && (
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
              onOpenTimer={() => handleNavigate('time')}
            />
          )}

          {/* Mobile Bottom Navigation Dock */}
          <BottomDock
            activePage={activePage}
            onSelectPage={handleNavigate}
            isTimerRunning={activeTimer.isRunning}
          />
        </div>
      ) : (
        /* ========================================================================= */
        /* DESKTOP / COMPUTER VERSION (>= 768px): Japanese Continuous Flow of Boxes  */
        /* ========================================================================= */
        <>
          {/* Fixed Top Navigation Bar Locked In Place ("ล็อกอันนี้ให้อยู่นิ่ง ๆ ไปเลย") */}
          <header
            id="croakle-top-bar"
            className="fixed top-2 sm:top-3.5 left-0 right-0 z-50 w-full flex justify-center px-2.5 sm:px-4 pointer-events-none select-none"
          >
            <div className="w-full max-w-[540px] md:max-w-[580px] bg-[#D32018] dark:bg-[#2B0A08] border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-2xl sm:rounded-[24px] shadow-[4px_4px_0px_#1F1B1A] dark:shadow-[4px_4px_0px_#000000] px-3 sm:px-4 py-2 flex items-center justify-between gap-2 pointer-events-auto transition-colors">
              {/* Logo */}
              <button
                type="button"
                onClick={() => handleNavigate('mood')}
                className="text-xl sm:text-2xl font-black tracking-tight font-display text-white uppercase leading-none hover:opacity-90 transition-opacity cursor-pointer text-left"
              >
                CROAKLE
              </button>

              {/* Top Navigation Tabs */}
              <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {NAV_GROUPS.map((group) => {
                  const isActive = group.activeKeys.includes(activePage);
                  return (
                    <button
                      key={group.id}
                      id={`top-nav-${group.id}`}
                      type="button"
                      onClick={() => handleNavigate(group.id)}
                      title={group.title}
                      className={`h-[28px] sm:h-[32px] px-2 sm:px-2.5 flex items-center justify-center text-center text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider transition-colors cursor-pointer rounded-lg sm:rounded-xl whitespace-nowrap select-none touch-manipulation ${
                        isActive
                          ? 'bg-[#FEF08A] text-[#1F1B1A] border-[2px] border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A]'
                          : 'text-white/85 hover:text-white hover:bg-black/20 border-[2px] border-transparent active:bg-black/30'
                      }`}
                    >
                      <span>{group.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </header>

          {/* Main Flow Container: each page wrapped in its own framed box, fixed without internal scrolling */}
          <div
            id="croakle-sections-container"
            className="w-full flex flex-col items-center gap-8 sm:gap-12 px-2.5 sm:px-4 pt-16 sm:pt-20 pb-24"
          >
            {/* Box 1: Mood Tracker */}
            <section id="section-mood" className="scroll-mt-24 sm:scroll-mt-28 w-full max-w-[540px] md:max-w-[580px]">
              <div
                id="box-mood"
                className="w-full bg-[#D32018] dark:bg-[#2B0A08] border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-[24px] sm:rounded-[28px] shadow-[6px_6px_0px_#1F1B1A] dark:shadow-[6px_6px_0px_#000000] overflow-visible transition-colors"
              >
                {/* Box Header Strip */}
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#D32018] dark:bg-[#2B0A08] rounded-t-[21px] sm:rounded-t-[25px] flex items-center justify-between select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black tracking-tight font-display text-white uppercase leading-none">
                      CROAKLE
                    </span>
                    <span className="text-white/40 font-bold">/</span>
                    <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#FEF08A] uppercase">
                      MOOD TRACKER
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-black tracking-widest text-[#1F1B1A] bg-[#FEF08A] border-[1.5px] border-[#1F1B1A] px-2 py-0.5 rounded-full shadow-[2px_2px_0px_#1F1B1A]">
                    01 // MOOD
                  </span>
                </div>

                {/* Box Content: Fully fixed, no internal scroll */}
                <div className="p-3.5 sm:p-5 overflow-visible">
                  <MoodView
                    monthData={currentMonthData}
                    year={trackYear}
                    monthIndex={trackMonth}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onSetMoodDay={handleSetMoodDay}
                    onNavigate={handleNavigate}
                  />
                </div>
              </div>
            </section>

            {/* Box 2: Habit Tracker */}
            <section id="section-track" className="scroll-mt-24 sm:scroll-mt-28 w-full max-w-[540px] md:max-w-[580px]">
              <div
                id="box-track"
                className="w-full bg-[#D32018] dark:bg-[#2B0A08] border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-[24px] sm:rounded-[28px] shadow-[6px_6px_0px_#1F1B1A] dark:shadow-[6px_6px_0px_#000000] overflow-visible transition-colors"
              >
                {/* Box Header Strip */}
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#D32018] dark:bg-[#2B0A08] rounded-t-[21px] sm:rounded-t-[25px] flex items-center justify-between select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black tracking-tight font-display text-white uppercase leading-none">
                      CROAKLE
                    </span>
                    <span className="text-white/40 font-bold">/</span>
                    <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#FEF08A] uppercase">
                      HABITS TRACKER
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-black tracking-widest text-[#1F1B1A] bg-[#FEF08A] border-[1.5px] border-[#1F1B1A] px-2 py-0.5 rounded-full shadow-[2px_2px_0px_#1F1B1A]">
                    02 // HABITS
                  </span>
                </div>

                {/* Box Content: Fully fixed, no internal scroll */}
                <div className="p-3.5 sm:p-5 overflow-visible">
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
                    onNavigate={handleNavigate}
                  />
                </div>
              </div>
            </section>

            {/* Box 3: Projects */}
            <section id="section-project" className="scroll-mt-24 sm:scroll-mt-28 w-full max-w-[540px] md:max-w-[580px]">
              <div
                id="box-project"
                className="w-full bg-[#D32018] dark:bg-[#2B0A08] border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-[24px] sm:rounded-[28px] shadow-[6px_6px_0px_#1F1B1A] dark:shadow-[6px_6px_0px_#000000] overflow-visible transition-colors"
              >
                {/* Box Header Strip */}
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#D32018] dark:bg-[#2B0A08] rounded-t-[21px] sm:rounded-t-[25px] flex items-center justify-between select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black tracking-tight font-display text-white uppercase leading-none">
                      CROAKLE
                    </span>
                    <span className="text-white/40 font-bold">/</span>
                    <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#FEF08A] uppercase">
                      PROJECTS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-black tracking-widest text-[#1F1B1A] bg-[#FEF08A] border-[1.5px] border-[#1F1B1A] px-2 py-0.5 rounded-full shadow-[2px_2px_0px_#1F1B1A]">
                    03 // PROJECTS
                  </span>
                </div>

                {/* Box Content: Fully fixed, no internal scroll */}
                <div className="p-3.5 sm:p-5 overflow-visible">
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
                    onNavigate={handleNavigate}
                  />
                </div>
              </div>
            </section>

            {/* Box 4: Focus Timer & Sessions */}
            <section id="section-time" className="scroll-mt-24 sm:scroll-mt-28 w-full max-w-[540px] md:max-w-[580px]">
              <div
                id="box-time"
                className="w-full bg-[#D32018] dark:bg-[#2B0A08] border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-[24px] sm:rounded-[28px] shadow-[6px_6px_0px_#1F1B1A] dark:shadow-[6px_6px_0px_#000000] overflow-visible transition-colors"
              >
                {/* Box Header Strip */}
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#D32018] dark:bg-[#2B0A08] rounded-t-[21px] sm:rounded-t-[25px] flex items-center justify-between select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black tracking-tight font-display text-white uppercase leading-none">
                      CROAKLE
                    </span>
                    <span className="text-white/40 font-bold">/</span>
                    <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#FEF08A] uppercase">
                      FOCUS TIMER
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-black tracking-widest text-[#1F1B1A] bg-[#FEF08A] border-[1.5px] border-[#1F1B1A] px-2 py-0.5 rounded-full shadow-[2px_2px_0px_#1F1B1A]">
                    04 // FOCUS
                  </span>
                </div>

                {/* Box Content: Fully fixed, no internal scroll */}
                <div className="p-3.5 sm:p-5 overflow-visible">
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
                </div>
              </div>
            </section>

            {/* Box 5: Journal & Notes */}
            <section id="section-notes" className="scroll-mt-24 sm:scroll-mt-28 w-full max-w-[540px] md:max-w-[580px]">
              <div
                id="box-notes"
                className="w-full bg-[#D32018] dark:bg-[#2B0A08] border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-[24px] sm:rounded-[28px] shadow-[6px_6px_0px_#1F1B1A] dark:shadow-[6px_6px_0px_#000000] overflow-visible transition-colors"
              >
                {/* Box Header Strip */}
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#D32018] dark:bg-[#2B0A08] rounded-t-[21px] sm:rounded-t-[25px] flex items-center justify-between select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black tracking-tight font-display text-white uppercase leading-none">
                      CROAKLE
                    </span>
                    <span className="text-white/40 font-bold">/</span>
                    <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#FEF08A] uppercase">
                      JOURNAL & NOTES
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-black tracking-widest text-[#1F1B1A] bg-[#FEF08A] border-[1.5px] border-[#1F1B1A] px-2 py-0.5 rounded-full shadow-[2px_2px_0px_#1F1B1A]">
                    05 // NOTES
                  </span>
                </div>

                {/* Box Content: Fully fixed, no internal scroll */}
                <div className="p-3.5 sm:p-5 overflow-visible">
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
                    onNavigate={handleNavigate}
                  />
                </div>
              </div>
            </section>

            {/* Box 6: Settings */}
            <section id="section-settings" className="scroll-mt-24 sm:scroll-mt-28 w-full max-w-[540px] md:max-w-[580px]">
              <div
                id="box-settings"
                className="w-full bg-[#D32018] dark:bg-[#2B0A08] border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-[24px] sm:rounded-[28px] shadow-[6px_6px_0px_#1F1B1A] dark:shadow-[6px_6px_0px_#000000] overflow-visible transition-colors"
              >
                {/* Box Header Strip */}
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] bg-[#D32018] dark:bg-[#2B0A08] rounded-t-[21px] sm:rounded-t-[25px] flex items-center justify-between select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black tracking-tight font-display text-white uppercase leading-none">
                      CROAKLE
                    </span>
                    <span className="text-white/40 font-bold">/</span>
                    <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#FEF08A] uppercase">
                      SETTINGS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-black tracking-widest text-[#1F1B1A] bg-[#FEF08A] border-[1.5px] border-[#1F1B1A] px-2 py-0.5 rounded-full shadow-[2px_2px_0px_#1F1B1A]">
                    06 // SETTINGS
                  </span>
                </div>

                {/* Box Content: Fully fixed, no internal scroll */}
                <div className="p-3.5 sm:p-5 overflow-visible">
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
                    onNavigate={handleNavigate}
                    firebaseUser={firebaseAuth.user}
                    firebaseAuthLoading={firebaseAuth.authLoading}
                    firebaseSyncStatus={firebaseAuth.syncStatus}
                    firebaseLastSyncedAt={firebaseAuth.lastSyncedAt}
                    firebaseErrorMessage={firebaseAuth.errorMessage}
                    onFirebaseSignIn={firebaseAuth.signIn}
                    onFirebaseSignOut={firebaseAuth.signOut}
                    onFirebaseSyncNow={firebaseAuth.syncNow}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Floating Continuous Live Activity Island on desktop */}
          {activeTimer.isRunning && (
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
              onOpenTimer={() => handleNavigate('time')}
            />
          )}
        </>
      )}
    </main>
  );
}
export default App;
