import React from 'react';
import { PageType } from '../types';

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
  }[] = [
    {
      id: 'mood',
      activeKeys: ['mood'],
      label: 'Mood',
    },
    {
      id: 'track',
      activeKeys: ['track', 'best'],
      label: 'Habits',
    },
    {
      id: 'project',
      activeKeys: ['project'],
      label: 'Projects',
    },
    {
      id: 'time',
      activeKeys: ['time'],
      label: 'Focus',
    },
    {
      id: 'notes',
      activeKeys: ['notes', 'analysis'],
      label: 'Journal',
    },
    {
      id: 'settings',
      activeKeys: ['settings'],
      label: 'Settings',
    },
  ];

  return (
    <footer
      id="croakle-bottom-dock"
      className="shrink-0 w-full bg-white dark:bg-[#1D1B18] border-t border-[#1D1B18] dark:border-[#F8F7F4] px-4 sm:px-6 py-3.5 flex items-center justify-between z-30 transition-colors"
    >
      {groups.map((group) => {
        const isActive = group.activeKeys.includes(activePage);

        return (
          <button
            key={group.id}
            id={`dock-nav-${group.id}`}
            type="button"
            onClick={() => onSelectPage(group.id)}
            className={`nav-item text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.1em] font-bold py-1 transition-all cursor-pointer relative ${
              isActive
                ? 'text-[#1D1B18] dark:text-[#F8F7F4] border-b-2 border-[#E63946]'
                : 'text-[#1D1B18]/50 dark:text-[#F8F7F4]/50 hover:text-[#1D1B18] dark:hover:text-[#F8F7F4] border-b-2 border-transparent'
            }`}
          >
            <span>{group.label}</span>
            {group.id === 'time' && isTimerRunning && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E63946] ml-1 align-middle animate-pulse" />
            )}
          </button>
        );
      })}
    </footer>
  );
};



