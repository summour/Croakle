import React from 'react';
import { PageType } from '../types';
import {
  HabitCloverDockIcon,
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
      id: 'mood',
      activeKeys: ['mood', 'track', 'project', 'best'],
      label: 'Trackers',
      icon: HabitCloverDockIcon,
    },
    {
      id: 'notes',
      activeKeys: ['notes'],
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
      activeKeys: ['analysis'],
      label: 'Insights',
      icon: ToriiStatsDockIcon,
    },
    {
      id: 'settings',
      activeKeys: ['settings', 'shop', 'dressup', 'coins'],
      label: 'Settings',
      icon: WoodGearDockIcon,
    },
  ];

  return (
    <footer
      id="croakle-bottom-dock"
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto min-w-[280px] max-w-sm bg-white/90 dark:bg-zinc-900/90 backdrop-blur-3xl border border-black/10 dark:border-white/15 rounded-full p-1.5 shadow-[0_20px_48px_-12px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-center gap-1.5 transition-all duration-300"
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
            aria-label={group.label}
            className={`flex items-center justify-center w-12 h-11 sm:w-13 sm:h-12 rounded-full transition-all duration-200 ios-tap relative ${
              isActive
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-[0_4px_14px_rgba(0,0,0,0.18)] scale-[1.04]'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.08]'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Icon size={24} className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              {group.id === 'time' && isTimerRunning && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34C759] border-2 border-white dark:border-zinc-900" />
                </span>
              )}
            </div>
          </button>
        );
      })}
    </footer>
  );
};


