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
  FrogShopState,
  ShopItem,
  FrogOutfitId,
  FrogHatId,
  FrogGlassesId,
  FrogSkinId,
  FrogActivityId,
  SceneLocationId,
  FrogCompanionId,
  DEFAULT_HABITS,
  DEFAULT_PROJECTS,
  DEFAULT_ACTIVE_TIMER,
  DEFAULT_PIXEL_SCENE,
  DEFAULT_FROG_SHOP_STATE,
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
  loadShopState,
  saveShopState,
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
import { GachaView } from './components/GachaView';
import { WardrobeView } from './components/WardrobeView';
import { CoinShopView } from './components/CoinShopView';
import { LiveTimerBar } from './components/LiveTimerBar';
import { GachaPullResult } from './types';
import { soundEngine, triggerHaptic } from './utils/audioUtils';
import confetti from 'canvas-confetti';

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
  const [pixelScene, setPixelScene] = useState<PixelSceneConfig>(loadPixelSceneState);
  const [shopState, setShopState] = useState<FrogShopState>(loadShopState);

  // Persist Frog Shop State whenever changed
  useEffect(() => {
    saveShopState(shopState);
  }, [shopState]);

  // Helper to award Lily Coins with optional transaction log
  const earnCoins = (amount: number, reason: string) => {
    setShopState((prev) => ({
      ...prev,
      coins: prev.coins + amount,
      transactions: [
        {
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          title: reason,
          amount,
          date: new Date().toISOString().slice(0, 10),
          type: 'earn',
        },
        ...(prev.transactions || []),
      ],
    }));
  };

  const handleBuyItem = (item: ShopItem): boolean => {
    if (shopState.coins < item.price) return false;

    setShopState((prev) => ({
      ...prev,
      coins: prev.coins - item.price,
      ownedItemIds: prev.ownedItemIds.includes(item.id)
        ? prev.ownedItemIds
        : [...prev.ownedItemIds, item.id],
      transactions: [
        {
          id: `tx_${Date.now()}`,
          title: `Purchased ${item.name}`,
          amount: item.price,
          date: new Date().toISOString().slice(0, 10),
          type: 'spend',
        },
        ...(prev.transactions || []),
      ],
    }));
    return true;
  };

  const handleEquipItem = (item: ShopItem) => {
    const patch: Partial<PixelSceneConfig> = {};
    if (item.category === 'outfit') patch.outfitId = item.itemId as FrogOutfitId;
    if (item.category === 'hat') patch.hatId = item.itemId as FrogHatId;
    if (item.category === 'glasses') patch.glassesId = item.itemId as FrogGlassesId;
    if (item.category === 'skin') patch.skinId = item.itemId as FrogSkinId;
    if (item.category === 'prop') patch.activityId = item.itemId as FrogActivityId;
    if (item.category === 'scene') patch.sceneId = item.itemId as SceneLocationId;
    if (item.category === 'companion') patch.companionId = item.itemId as FrogCompanionId;

    handleUpdatePixelScene(patch);
  };

  const handleClaimDailyReward = () => {
    const today = new Date().toISOString().slice(0, 10);
    setShopState((prev) => ({
      ...prev,
      coins: prev.coins + 50,
      lastDailyClaimDate: today,
      transactions: [
        {
          id: `tx_${Date.now()}`,
          title: 'Daily Boutique Reward 🎁',
          amount: 50,
          date: today,
          type: 'earn',
        },
        ...(prev.transactions || []),
      ],
    }));
  };

  const handleGachaPullResults = (results: GachaPullResult[], totalCost: number, isDailyFree?: boolean) => {
    let totalRefund = 0;
    const newOwnedIds: string[] = [];

    results.forEach((res) => {
      newOwnedIds.push(res.item.id);
      if (res.duplicateRefundCoins) {
        totalRefund += res.duplicateRefundCoins;
      }
    });

    const today = new Date().toISOString().slice(0, 10);

    setShopState((prev) => {
      const mergedOwned = Array.from(new Set([...prev.ownedItemIds, ...newOwnedIds]));
      const newCoins = prev.coins - totalCost + totalRefund;

      const txs = [
        {
          id: `tx_${Date.now()}`,
          title: isDailyFree
            ? `Daily Free Gacha 1-Pull 🎁 (${results[0]?.item.name || 'Item'})`
            : `Gacha ${results.length}x Pulls (${results.map((r) => r.item.name).slice(0, 2).join(', ')}${results.length > 2 ? '...' : ''})`,
          amount: Math.max(0, totalCost - totalRefund),
          date: today,
          type: (totalCost > 0 ? 'spend' : 'earn') as 'spend' | 'earn',
        },
        ...(prev.transactions || []),
      ];

      return {
        ...prev,
        coins: Math.max(0, newCoins),
        ownedItemIds: mergedOwned,
        gachaPityCounter: (prev.gachaPityCounter || 0) + results.length,
        lastFreeGachaDate: isDailyFree ? today : prev.lastFreeGachaDate,
        transactions: txs,
      };
    });
  };

  const handleToggleWishlist = (itemId: string) => {
    setShopState((prev) => {
      const current = prev.wishlistIds || [];
      const exists = current.includes(itemId);
      const next = exists ? current.filter((id) => id !== itemId) : [...current, itemId];
      return {
        ...prev,
        wishlistIds: next,
      };
    });
  };

  const handleClaimSetCompletionBonus = (setId: string, rewardCoins: number) => {
    const today = new Date().toISOString().slice(0, 10);
    setShopState((prev) => {
      const alreadyClaimed = (prev.completedSetClaimedIds || []).includes(setId);
      if (alreadyClaimed) return prev;

      return {
        ...prev,
        coins: prev.coins + rewardCoins,
        completedSetClaimedIds: [...(prev.completedSetClaimedIds || []), setId],
        transactions: [
          {
            id: `tx_${Date.now()}`,
            title: `Set Master Completion Reward 👑 (+${rewardCoins} Coins)`,
            amount: rewardCoins,
            date: today,
            type: 'earn',
          },
          ...(prev.transactions || []),
        ],
      };
    });
  };

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
    earnCoins(10, 'Daily Mood Check-in 🐸');
  };

  // Note Actions
  const handleAddNote = (noteData: Omit<NoteItem, 'id' | 'createdAt'>) => {
    const newNote: NoteItem = {
      ...noteData,
      id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    earnCoins(15, 'Journal Note Written 📝');

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
    setActiveTimer((prev) => ({
      ...prev,
      isRunning: true,
      startedAt: Date.now(),
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
    setActiveTimer((prev) => ({
      ...prev,
      isRunning: true,
      startedAt: Date.now(),
    }));
  };

  const handleResetTimer = () => {
    if (settings.hapticEnabled) triggerHaptic();
    setActiveTimer((prev) => ({
      ...prev,
      isRunning: false,
      startedAt: null,
      accumulatedSeconds: 0,
    }));
  };

  const handleFinishTimer = () => {
    const totalSecs = activeTimer.accumulatedSeconds + (
      activeTimer.isRunning && activeTimer.startedAt
        ? Math.max(0, Math.floor((Date.now() - activeTimer.startedAt) / 1000))
        : 0
    );

    if (totalSecs < 10) {
      alert('Focus session was less than 10 seconds. Not recorded.');
      handleResetTimer();
      return;
    }

    const durationMinutes = Math.max(1, Math.round(totalSecs / 60));
    const now = new Date();
    const startMinutes = now.getHours() * 60 + now.getMinutes() - durationMinutes;

    handleAddSession({
      subject: activeTimer.subject.trim() || 'Focus Session',
      date: getTodayIso(),
      startMinute: Math.max(0, startMinutes),
      duration: durationMinutes,
      type: activeTimer.type,
      sourceType: activeTimer.sourceType,
      sourceId: activeTimer.sourceId,
      notes: `Recorded with Continuous Timer (${durationMinutes}m)`,
    });

    earnCoins(20, `Focus Session Completed (${durationMinutes}m) ⏱️`);

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
    setShopState(loadShopState());
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
      className="h-[100dvh] h-screen w-screen bg-[var(--bg-color)] text-[#2e271f] dark:text-[#f4efe8] transition-colors font-sans selection:bg-[#5f7a61]/20 relative overflow-hidden flex flex-col items-center justify-center p-0"
    >
      {/* MASTER UNIFIED CONTAINER */}
      <div
        id="croakle-master-frame"
        className="relative z-10 w-full max-w-xl h-full flex flex-col bg-[var(--bg-color)] overflow-hidden transition-all duration-300"
      >
        {/* Scrollable Viewport Container: Locked inside master box */}
        <div
          id="croakle-scroll-area"
          className={
            activePage === 'menu' || activePage === 'shop' || activePage === 'dressup'
              ? 'flex-1 w-full h-full relative overflow-hidden flex flex-col'
              : 'flex-1 w-full px-4 pt-3.5 pb-24 overflow-y-auto overscroll-y-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
          }
        >
          {activePage === 'menu' && (
            <HomeDashboard
              onNavigate={setActivePage}
              pixelScene={pixelScene}
              onUpdatePixelScene={handleUpdatePixelScene}
              shopState={shopState}
              onGachaPullResults={handleGachaPullResults}
              onToggleWishlist={handleToggleWishlist}
              onEarnCoins={earnCoins}
              todayDate={todayDate}
              soundEnabled={settings.soundEnabled}
              hapticEnabled={settings.hapticEnabled}
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

          {activePage === 'shop' && (
            <GachaView
              config={pixelScene}
              onUpdateConfig={handleUpdatePixelScene}
              shopState={shopState}
              onGachaPullResults={handleGachaPullResults}
              onToggleWishlist={handleToggleWishlist}
              onOpenCoins={() => setActivePage('coins')}
              onBack={() => setActivePage('menu')}
              soundEnabled={settings.soundEnabled}
              hapticEnabled={settings.hapticEnabled}
            />
          )}

          {activePage === 'dressup' && (
            <WardrobeView
              config={pixelScene}
              onUpdateConfig={handleUpdatePixelScene}
              shopState={shopState}
              onToggleWishlist={handleToggleWishlist}
              onOpenCoins={() => setActivePage('coins')}
              onNavigateGacha={() => setActivePage('shop')}
              onBack={() => setActivePage('menu')}
              soundEnabled={settings.soundEnabled}
              hapticEnabled={settings.hapticEnabled}
            />
          )}

          {activePage === 'coins' && (
            <CoinShopView
              shopState={shopState}
              onEarnCoins={earnCoins}
              onClaimDailyReward={handleClaimDailyReward}
              onBack={() => setActivePage('menu')}
              soundEnabled={settings.soundEnabled}
              hapticEnabled={settings.hapticEnabled}
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

