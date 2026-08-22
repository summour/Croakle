import React from 'react';
import { PageType, HabitTemplate, MonthData, Project, MOOD_LEVELS, PixelSceneConfig } from '../types';
import {
  FrogMoodIcon,
  FrogMoodRad,
  HabitCloverDockIcon,
  WashiJournalDockIcon,
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
  CheckCircle2,
  Circle,
  Timer,
  BookOpen,
  TrendingUp,
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
    <div className="space-y-4 pb-28">
      {/* Cozy Header */}
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

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="home-gacha-btn"
              type="button"
              onClick={() => onNavigate('shop')}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#c47069]/15 hover:bg-[#c47069]/25 active:scale-95 text-[#9e433b] dark:text-[#f2a8a2] transition-all flex items-center gap-1.5 border border-[#c47069]/30 shadow-xs ios-tap"
              title="Gacha Sanctuary"
            >
              <span>🎁</span>
              <span>Gacha</span>
            </button>
            <button
              id="home-wardrobe-btn"
              type="button"
              onClick={() => onNavigate('dressup')}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#5f7a61]/15 hover:bg-[#5f7a61]/25 active:scale-95 text-[#425744] dark:text-[#9bc29e] transition-all flex items-center gap-1.5 border border-[#5f7a61]/30 shadow-xs ios-tap"
              title="Frog Wardrobe"
            >
              <span>👗</span>
              <span>Wardrobe</span>
            </button>
            <button
              id="home-stats-btn"
              type="button"
              onClick={() => onNavigate('analysis')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 dark:bg-white/[0.08] hover:bg-white dark:hover:bg-white/[0.12] text-[#4a4036] dark:text-[#e0d6cb] font-bold flex items-center justify-center transition-all border border-black/[0.06] dark:border-white/[0.1] shadow-xs ios-tap"
              title="Insights"
            >
              <ToriiStatsDockIcon size={16} className="text-[#5f7a61] dark:text-[#8cb88f]" />
            </button>
            <button
              id="home-settings-btn"
              type="button"
              onClick={() => onNavigate('settings')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 dark:bg-white/[0.08] hover:bg-white dark:hover:bg-white/[0.12] text-[#4a4036] dark:text-[#e0d6cb] font-bold flex items-center justify-center transition-all border border-black/[0.06] dark:border-white/[0.1] shadow-xs ios-tap"
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
        onOpenShop={() => onNavigate('dressup')}
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

      {/* Today's Habits Quick Tracker Card */}
      <div className="ios-glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HabitCloverDockIcon size={19} />
            <h3 className="font-extrabold text-sm tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
              Today's Habits
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('track')}
            className="text-xs font-black text-[#5f7a61] dark:text-[#8cb88f] hover:underline flex items-center gap-1"
          >
            <span>{completedToday}/{totalHabits} Done ({completionPercent}%)</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {activeHabits.length === 0 ? (
          <p className="text-xs text-[#8c7e70] dark:text-[#a89b8d] italic py-2 text-center">
            No active habits yet. Create some in the Habits tab!
          </p>
        ) : (
          <div className="space-y-2">
            {activeHabits.slice(0, 4).map((h) => {
              const origIdx = habits.findIndex((orig) => orig.id === h.id);
              const isDone = Boolean(monthData.habits[origIdx]?.days[dayIndex]);

              return (
                <div
                  key={h.id}
                  onClick={() => handleToggle(origIdx)}
                  className={`p-2.5 rounded-[16px] border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-900 dark:text-emerald-200'
                      : 'bg-white/60 dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] text-[#2d2823] dark:text-[#f4efe8] hover:bg-white/90 dark:hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isDone ? (
                      <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Circle size={20} className="text-[#8c7e70]/50 shrink-0" />
                    )}
                    <span className={`text-xs font-bold truncate ${isDone ? 'line-through opacity-80' : ''}`}>
                      {h.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#8c7e70] dark:text-[#a89b8d]">
                    Goal: {h.goal}d/wk
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Launchpad: Focus, Journal & Insights */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => onNavigate('time')}
          className="ios-glass-card p-3.5 flex flex-col items-center justify-center gap-1.5 text-center hover:scale-[1.02] active:scale-98 transition-all ios-tap group border border-black/[0.06] dark:border-white/[0.08]"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
            <PocketTimerDockIcon size={22} />
          </div>
          <span className="text-xs font-black text-[#2d2823] dark:text-[#f4efe8]">Focus Timer</span>
          <span className="text-[10px] text-[#8c7e70] dark:text-[#a89b8d]">Deep work</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('notes')}
          className="ios-glass-card p-3.5 flex flex-col items-center justify-center gap-1.5 text-center hover:scale-[1.02] active:scale-98 transition-all ios-tap group border border-black/[0.06] dark:border-white/[0.08]"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-700 dark:text-blue-300 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
            <WashiJournalDockIcon size={22} />
          </div>
          <span className="text-xs font-black text-[#2d2823] dark:text-[#f4efe8]">Journal</span>
          <span className="text-[10px] text-[#8c7e70] dark:text-[#a89b8d]">Daily thoughts</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('analysis')}
          className="ios-glass-card p-3.5 flex flex-col items-center justify-center gap-1.5 text-center hover:scale-[1.02] active:scale-98 transition-all ios-tap group border border-black/[0.06] dark:border-white/[0.08]"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-700 dark:text-purple-300 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
            <ToriiStatsDockIcon size={22} />
          </div>
          <span className="text-xs font-black text-[#2d2823] dark:text-[#f4efe8]">Insights</span>
          <span className="text-[10px] text-[#8c7e70] dark:text-[#a89b8d]">Stats & trends</span>
        </button>
      </div>
    </div>
  );
};


