import React from 'react';
import { PageType, HabitTemplate, MonthData, Project, MOOD_LEVELS, PixelSceneConfig } from '../types';
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
import { PixelFrogScene } from './PixelFrogScene';
import {
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
  pixelScene: PixelSceneConfig;
  onUpdatePixelScene: (patch: Partial<PixelSceneConfig>) => void;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
  onToggleHabitToday: (habitIndex: number) => void;
  onSelectMoodToday: (moodValue: number) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  habits,
  monthData,
  projects,
  todayDate,
  pixelScene,
  onUpdatePixelScene,
  soundEnabled = true,
  hapticEnabled = true,
  onToggleHabitToday,
  onSelectMoodToday,
}) => {
  const dayOfMonth = todayDate.getDate();
  const dayIndex = dayOfMonth - 1;

  // Calculate today's habit completion (Active habits)
  const activeHabits = habits.filter((h) => !h.completed);
  const totalHabits = activeHabits.length;
  const completedToday = activeHabits.reduce((acc, h) => {
    const origIdx = habits.findIndex((orig) => orig.id === h.id);
    return acc + (monthData.habits[origIdx]?.days[dayIndex] ? 1 : 0);
  }, 0);
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
      {/* Cozy Header (Non-sticky, fluid natural scroll matching app background) */}
      <div className="pt-1 pb-1">
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

      {/* Dynamic Pixel Sanctuary Frog & Habitat Diorama */}
      <PixelFrogScene
        config={pixelScene}
        onUpdateConfig={onUpdatePixelScene}
        currentMoodValue={currentMoodValue}
        soundEnabled={soundEnabled}
        hapticEnabled={hapticEnabled}
      />

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
            <span className={`text-xs font-black px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-2xs ${currentMoodObj.bgLight} ${currentMoodObj.bgDark} ${currentMoodObj.borderLight} ${currentMoodObj.borderDark} ${currentMoodObj.textColorLight} ${currentMoodObj.textColorDark}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${currentMoodObj.iconBgLight} ${currentMoodObj.iconBgDark}`}>
                <FrogMoodIcon value={currentMoodObj.value} size={14} />
              </div>
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
                className={`py-2.5 px-1 rounded-[18px] border flex flex-col items-center gap-1 transition-all ios-tap ${
                  mood.bgLight
                } ${mood.bgDark} ${
                  isSelected
                    ? `ring-2 ring-offset-1 ring-offset-white dark:ring-offset-[#161311] ${mood.borderLight} ${mood.borderDark} shadow-md scale-[1.02]`
                    : `${mood.borderLight} ${mood.borderDark} hover:scale-[1.02]`
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-2xs ${mood.iconBgLight} ${mood.iconBgDark}`}>
                  <FrogMoodIcon value={mood.value} size={22} />
                </div>
                <span className={`text-[10.5px] font-black ${mood.textColorLight} ${mood.textColorDark}`}>
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};


