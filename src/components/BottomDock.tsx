import React from 'react';
import { PageType } from '../types';
import { CheckSquare, FileText, Timer, BarChart3, Settings } from 'lucide-react';

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
    icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  }[] = [
    {
      id: 'mood',
      activeKeys: ['mood', 'track', 'project', 'best'],
      label: 'Trackers',
      icon: CheckSquare,
    },
    {
      id: 'notes',
      activeKeys: ['notes'],
      label: 'Journal',
      icon: FileText,
    },
    {
      id: 'time',
      activeKeys: ['time'],
      label: 'Focus',
      icon: Timer,
    },
    {
      id: 'analysis',
      activeKeys: ['analysis'],
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'settings',
      activeKeys: ['settings'],
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <footer
      id="croakle-bottom-dock"
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto min-w-[260px] max-w-sm bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800 rounded-full p-1.5 shadow-lg shadow-zinc-950/5 flex items-center justify-center gap-1 transition-all duration-200"
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
            className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-150 ios-tap relative ${
              isActive
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold'
                : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.7}
              />
              {group.id === 'time' && isTimerRunning && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-950 dark:bg-white opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-950 dark:bg-white border border-white dark:border-zinc-900" />
                </span>
              )}
            </div>
          </button>
        );
      })}
    </footer>
  );
};



