import React from 'react';
import { PageType } from '../types';
import {
  FrogHouseDockIcon,
  HabitCloverDockIcon,
  BambooProjectDockIcon,
  FrogFaceDockIcon,
  WashiJournalDockIcon,
  PocketTimerDockIcon,
  ToriiStatsDockIcon,
  WoodGearDockIcon,
} from './FrogIcons';

interface BottomDockProps {
  activePage: PageType;
  onSelectPage: (page: PageType) => void;
  isTimerRunning?: boolean;
}

export const BottomDock: React.FC<BottomDockProps> = ({ activePage, onSelectPage, isTimerRunning }) => {
  const groups: {
    id: PageType;
    activeKeys: PageType[];
    label: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
  }[] = [
    {
      id: 'menu',
      activeKeys: ['menu'],
      label: 'Home',
      icon: FrogHouseDockIcon,
    },
    {
      id: 'track',
      activeKeys: ['track', 'project', 'best'],
      label: 'Habits',
      icon: HabitCloverDockIcon,
    },
    {
      id: 'mood',
      activeKeys: ['mood', 'notes'],
      label: 'Journal',
      icon: WashiJournalDockIcon,
    },
    {
      id: 'time',
      activeKeys: ['time'],
      label: 'Focus',
      icon: PocketTimerDockIcon,
    },
    {
      id: 'analysis',
      activeKeys: ['analysis', 'settings'],
      label: 'Insights',
      icon: ToriiStatsDockIcon,
    },
  ];

  return (
    <footer
      id="croakle-bottom-dock"
      className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md bg-[#221c17]/85 dark:bg-[#130f0d]/88 backdrop-blur-3xl border border-white/25 dark:border-white/12 rounded-[36px] p-2 shadow-[0_24px_48px_-12px_rgba(15,10,6,0.55),0_6px_16px_rgba(0,0,0,0.25),inset_0_1.5px_2px_rgba(255,255,255,0.3)] flex items-center justify-between gap-1.5 transition-all duration-300"
    >
      {groups.map((group) => {
        const Icon = group.icon;
        const isActive = group.activeKeys.includes(activePage);

        return (
          <button
            key={group.id}
            id={`dock-nav-${group.id}`}
            type="button"
            onClick={() => {
              if (!group.activeKeys.includes(activePage)) {
                onSelectPage(group.id);
              }
            }}
            title={group.label}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-[24px] transition-all duration-250 min-h-[52px] ios-tap relative ${
              isActive
                ? 'bg-gradient-to-b from-[#ffffff] via-[#faf6f0] to-[#f0e7dc] text-[#221c17] font-black shadow-[0_8px_20px_-2px_rgba(0,0,0,0.22),inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,0,0,0.06)] scale-[1.04]'
                : 'text-[#a89b8d] hover:text-[#f4efe8] hover:bg-white/[0.06] font-medium'
            }`}
          >
            <div className="relative">
              <Icon size={22} className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              {group.id === 'time' && isTimerRunning && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white dark:border-[#130f0d]" />
                </span>
              )}
            </div>
            <span className="text-[10px] leading-tight mt-0.5 tracking-tight font-black">{group.label}</span>
            {isActive && (
              <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-[#5f7a61] dark:bg-[#7d9d80] shadow-[0_0_6px_rgba(95,122,97,0.8)]" />
            )}
          </button>
        );
      })}
    </footer>
  );
};



