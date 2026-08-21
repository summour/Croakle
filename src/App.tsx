import React, { useState, useEffect } from 'react';
import {
  PageType,
  HabitTemplate,
  MonthData,
  Project,
  NoteItem,
  TimeSession,
  AppSettings,
  DEFAULT_HABITS,
  DEFAULT_PROJECTS,
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
} from './utils/storage';
import { getTodayIso, getDaysInMonth } from './utils/dateUtils';
import { BottomDock } from './components/BottomDock';
import { HomeDashboard } from './components/HomeDashboard';
import { HabitsView } from './components/HabitsView';
import { ProjectsView } from './components/ProjectsView';
import { BestHabitsView } from './components/BestHabitsView';
import { MoodView } from './components/MoodView';
import { NotesView } from './components/NotesView';
import { TimeSessionsView } from './components/TimeSessionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';

export function App() {
  const [activePage, setActivePage] = useState<PageType>('menu');

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
    const dateStr = `${trackYear}-${String(trackMonth + 1).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}`;
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

  const handleDataImported = () => {
    setHabitStore(loadHabitsState());
    setProjects(loadProjectsState());
    setNotes(loadNotesState());
    setSessions(loadSessionsState());
    setSettings(loadSettingsState());
  };

  const handleResetData = () => {
    setHabitStore({ habitTemplates: [...DEFAULT_HABITS], months: {} });
    setProjects([...DEFAULT_PROJECTS]);
    setNotes([]);
    setSessions([]);
  };

  return (
    <main
      id="croakle-app"
      className="h-[100dvh] h-screen w-screen bg-[var(--bg-color)] text-[#2e271f] dark:text-[#f4efe8] transition-colors font-sans selection:bg-[#5f7a61]/20 relative overflow-hidden flex flex-col items-center justify-center p-0 sm:p-2.5 md:p-3.5"
    >
      {/* Soft atmospheric background gradient accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#5f7a61]/8 dark:bg-[#5f7a61]/5 blur-[120px]" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-[#b86f52]/6 dark:bg-[#b86f52]/4 blur-[100px]" />
        <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-[#7d9d80]/7 dark:bg-[#7d9d80]/4 blur-[110px]" />
      </div>

      {/* MASTER UNIFIED CONTAINER: iOS 26 Squircle Device Shell */}
      <div
        id="croakle-master-frame"
        className="relative z-10 w-full max-w-xl h-full sm:h-[calc(100dvh-1.5rem)] flex flex-col bg-[#fdfbf7]/95 dark:bg-[#161311]/95 backdrop-blur-3xl border-0 sm:border-[2px] sm:border-white/80 dark:sm:border-white/10 sm:rounded-[40px] sm:shadow-[0_25px_70px_-15px_rgba(20,15,10,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)] dark:sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),inset_0_1px_1.5px_rgba(255,255,255,0.12)] overflow-hidden transition-all duration-300"
      >
        {/* iOS 26 Dynamic Top Island Pill Accent */}
        <div className="w-full flex justify-center pt-2 pb-0.5 select-none pointer-events-none">
          <div className="h-1.5 w-24 bg-black/10 dark:bg-white/15 rounded-full backdrop-blur-md transition-all duration-300" />
        </div>

        {/* Scrollable Viewport Container: Locked inside master box, only this container scrolls */}
        <div
          id="croakle-scroll-area"
          className="flex-1 w-full px-4 pt-1 pb-24 overflow-y-auto overscroll-y-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {activePage === 'menu' && (
            <HomeDashboard
              onNavigate={setActivePage}
              habits={habitStore.habitTemplates}
              monthData={currentMonthData}
              projects={projects}
              todayDate={todayDate}
              onToggleHabitToday={handleToggleHabitToday}
              onSelectMoodToday={handleSelectMoodToday}
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
              onToggleHabitDay={handleToggleHabitDay}
              onAddHabit={handleAddHabit}
              onUpdateHabit={handleUpdateHabit}
              onDeleteHabit={handleDeleteHabit}
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

          {activePage === 'best' && (
            <BestHabitsView
              habits={habitStore.habitTemplates}
              monthData={currentMonthData}
              year={trackYear}
              monthIndex={trackMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
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
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
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
              onDataImported={handleDataImported}
              onResetData={handleResetData}
              onNavigate={setActivePage}
            />
          )}
        </div>

        {/* Floating Modern Bottom Navigation Dock anchored inside master frame */}
        <BottomDock activePage={activePage} onSelectPage={setActivePage} />
      </div>
    </main>
  );
}
export default App;

