import React from 'react';
import { PageType, HabitTemplate, MonthData, Project, MOOD_LEVELS } from '../types';
import {
  FrogMoodIcon,
  FrogMoodRad,
  CloverIcon,
  HabitCloverDockIcon,
  BambooScrollDockIcon,
  PocketTimerDockIcon,
  ToriiStatsDockIcon,
  WoodGearDockIcon,
  FrogFaceDockIcon,
} from './FrogIcons';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Coffee,
  Sun,
  Moon,
  Feather,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HomeDashboardProps {
  onNavigate: (page: PageType) => void;
  habits: HabitTemplate[];
  monthData: MonthData;
  projects: Project[];
  todayDate: Date;
  onToggleHabitToday: (habitIndex: number) => void;
  onSelectMoodToday: (moodValue: number) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  habits,
  monthData,
  projects,
  todayDate,
  onToggleHabitToday,
  onSelectMoodToday,
}) => {
  const dayOfMonth = todayDate.getDate();
  const dayIndex = dayOfMonth - 1;

  // Calculate today's habit completion
  const totalHabits = habits.length;
  const completedToday = monthData.habits.reduce((acc, h) => acc + (h.days[dayIndex] ? 1 : 0), 0);
  const completionPercent = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  // Active projects count
  const activeProjectsCount = projects.filter((p) => !p.completed).length;

  // Today's mood
  const currentMoodValue = monthData.moods[dayIndex];
  const currentMoodObj = MOOD_LEVELS.find((m) => m.value === currentMoodValue);

  // Time-of-day greeting
  const hours = todayDate.getHours();
  let timeGreeting = 'Good morning';
  let GreetingIcon = Sun;
  if (hours >= 12 && hours < 17) {
    timeGreeting = 'Good afternoon';
    GreetingIcon = Coffee;
  } else if (hours >= 17 && hours < 21) {
    timeGreeting = 'Peaceful evening';
    GreetingIcon = SunsetIcon;
  } else if (hours >= 21 || hours < 5) {
    timeGreeting = 'Restful night';
    GreetingIcon = Moon;
  }

  function SunsetIcon(props: any) {
    return <Sparkles {...props} />;
  }

  const handleToggle = (idx: number) => {
    onToggleHabitToday(idx);
    if (!monthData.habits[idx]?.days[dayIndex]) {
      confetti({
        particleCount: 30,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#5f7a61', '#b86f52', '#d4af37', '#e8ded1'],
      });
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Cozy Header (Sticky Locked with iOS 26 glass) */}
      <div className="sticky top-0 z-20 bg-[#fdfbf7]/90 dark:bg-[#161311]/90 backdrop-blur-xl pt-1 pb-1">
        <header className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[22px] bg-[#eef4ec] dark:bg-[#273325] border border-[#d2e2d0] dark:border-[#384a35] flex items-center justify-center p-1 shadow-[0_4px_12px_rgba(95,122,97,0.15)]">
              <FrogMoodRad size={30} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8c7e70] dark:text-[#a89b8d]">
                <GreetingIcon size={13} className="text-[#b86f52] dark:text-[#d68767]" />
                <span>{timeGreeting}</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
                Croakle
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="home-stats-btn"
              type="button"
              onClick={() => onNavigate('analysis')}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/80 dark:bg-white/[0.08] hover:bg-white dark:hover:bg-white/[0.12] text-[#4a4036] dark:text-[#e0d6cb] transition-all flex items-center gap-1.5 border border-black/[0.06] dark:border-white/[0.1] shadow-xs ios-tap"
            >
              <ToriiStatsDockIcon size={16} className="text-[#5f7a61] dark:text-[#8cb88f]" />
              Stats
            </button>
            <button
              id="home-settings-btn"
              type="button"
              onClick={() => onNavigate('settings')}
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/[0.08] hover:bg-white dark:hover:bg-white/[0.12] text-[#4a4036] dark:text-[#e0d6cb] font-bold flex items-center justify-center transition-all border border-black/[0.06] dark:border-white/[0.1] shadow-xs ios-tap"
              title="Settings"
            >
              <WoodGearDockIcon size={16} />
            </button>
          </div>
        </header>
      </div>

      {/* Quick Mood Log Row */}
      <div className="ios-glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FrogFaceDockIcon size={19} />
            <h3 className="font-extrabold text-sm tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
              Daily Mood
            </h3>
          </div>
          {currentMoodObj && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f5efe6] dark:bg-[#2c2722] text-[#5f7a61] dark:text-[#8cb88f] border border-[#e8ded1] dark:border-[#383129] flex items-center gap-1.5 shadow-2xs">
              <FrogMoodIcon value={currentMoodObj.value} size={18} />
              <span>{currentMoodObj.label}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {MOOD_LEVELS.map((mood) => {
            const isSelected = currentMoodValue === mood.value;
            return (
              <button
                key={mood.value}
                id={`home-mood-btn-${mood.value}`}
                type="button"
                onClick={() => onSelectMoodToday(mood.value)}
                className={`py-3 rounded-[20px] border flex flex-col items-center gap-1 transition-all ios-tap ${
                  isSelected
                    ? 'border-[#5f7a61] dark:border-[#7d9d80] bg-[#eef4ec] dark:bg-[#263324] text-[#2d2823] dark:text-[#f4efe8] font-bold scale-[1.04] shadow-[0_6px_16px_rgba(95,122,97,0.2)]'
                    : 'border-black/[0.05] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.08] text-[#574d42] dark:text-[#d4c8bc]'
                }`}
              >
                <FrogMoodIcon value={mood.value} size={28} />
                <span className="text-[10px] font-bold">{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Habit Quick Checklist */}
      <div className="ios-glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HabitCloverDockIcon size={19} />
            <h3 className="font-extrabold text-sm tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
              Today's Habits
            </h3>
          </div>
          <button
            id="home-view-all-habits"
            type="button"
            onClick={() => onNavigate('track')}
            className="text-xs font-bold text-[#8c7e70] hover:text-[#2d2823] dark:text-[#a89b8d] dark:hover:text-[#f4efe8] flex items-center gap-1 transition ios-tap"
          >
            Full Calendar <ArrowRight size={13} />
          </button>
        </div>

        <div className="divide-y divide-[#f3ede3] dark:divide-[#2d2823]">
          {habits.length === 0 ? (
            <div className="py-6 text-center text-[#8c7e70] dark:text-[#a89b8d]">
              <p className="text-xs font-medium">No habits yet. Start by creating your first habit!</p>
            </div>
          ) : (
            habits.map((habit, idx) => {
              const isDone = Boolean(monthData.habits[idx]?.days[dayIndex]);
              return (
                <div
                  key={habit.id || idx}
                  className="py-3 flex items-center justify-between gap-3 group transition-colors"
                >
                  <div className="min-w-0">
                    <p
                      className={`font-bold text-sm truncate ${
                        isDone
                          ? 'line-through text-[#a89b8d] dark:text-[#6e6358]'
                          : 'text-[#2d2823] dark:text-[#f4efe8]'
                      }`}
                    >
                      {habit.name}
                    </p>
                    {habit.description && (
                      <p className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d] truncate mt-0.5">
                        {habit.description}
                      </p>
                    )}
                  </div>
                  <button
                    id={`home-toggle-habit-${idx}`}
                    type="button"
                    onClick={() => handleToggle(idx)}
                    className={`w-9 h-9 rounded-[18px] flex items-center justify-center transition-all ios-tap ${
                      isDone
                        ? 'bg-[#5f7a61] dark:bg-[#7d9d80] text-white dark:text-[#171513] shadow-[0_4px_12px_rgba(95,122,97,0.3)]'
                        : 'border-2 border-[#d6cbbe] dark:border-[#423930] hover:border-[#5f7a61] text-transparent'
                    }`}
                  >
                    <CheckCircle2 size={18} className={isDone ? 'opacity-100' : 'opacity-0'} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Navigation Quick Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          id="home-nav-track"
          type="button"
          onClick={() => onNavigate('track')}
          className="ios-glass-card p-4 hover:scale-[1.02] transition text-left flex flex-col justify-between h-28 shadow-xs group ios-tap"
        >
          <div className="w-10 h-10 rounded-[20px] bg-[#eef3ee] dark:bg-[#273229] flex items-center justify-center shadow-2xs">
            <HabitCloverDockIcon size={24} />
          </div>
          <div>
            <strong className="block font-black text-sm text-[#2d2823] dark:text-[#f4efe8]">Habits</strong>
            <span className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d]">{habits.length} habits</span>
          </div>
        </button>

        <button
          id="home-nav-project"
          type="button"
          onClick={() => onNavigate('project')}
          className="ios-glass-card p-4 hover:scale-[1.02] transition text-left flex flex-col justify-between h-28 shadow-xs group ios-tap"
        >
          <div className="w-10 h-10 rounded-[20px] bg-[#f8efe8] dark:bg-[#342721] flex items-center justify-center shadow-2xs">
            <BambooScrollDockIcon size={24} className="text-[#b86f52]" />
          </div>
          <div>
            <strong className="block font-black text-sm text-[#2d2823] dark:text-[#f4efe8]">Projects</strong>
            <span className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d]">{activeProjectsCount} active</span>
          </div>
        </button>

        <button
          id="home-nav-mood"
          type="button"
          onClick={() => onNavigate('mood')}
          className="ios-glass-card p-4 hover:scale-[1.02] transition text-left flex flex-col justify-between h-28 shadow-xs group ios-tap"
        >
          <div className="w-10 h-10 rounded-[20px] bg-[#eef4ec] dark:bg-[#273325] flex items-center justify-center shadow-2xs">
            <FrogFaceDockIcon size={24} />
          </div>
          <div>
            <strong className="block font-black text-sm text-[#2d2823] dark:text-[#f4efe8]">Mood</strong>
            <span className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d]">Daily Tracker</span>
          </div>
        </button>

        <button
          id="home-nav-time"
          type="button"
          onClick={() => onNavigate('time')}
          className="ios-glass-card p-4 hover:scale-[1.02] transition text-left flex flex-col justify-between h-28 shadow-xs group ios-tap"
        >
          <div className="w-10 h-10 rounded-[20px] bg-[#fdf5e8] dark:bg-[#362f22] flex items-center justify-center shadow-2xs">
            <PocketTimerDockIcon size={24} className="text-[#c28f3a]" />
          </div>
          <div>
            <strong className="block font-black text-sm text-[#2d2823] dark:text-[#f4efe8]">Focus Timer</strong>
            <span className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d]">Time Sessions</span>
          </div>
        </button>
      </div>
    </div>
  );
};


