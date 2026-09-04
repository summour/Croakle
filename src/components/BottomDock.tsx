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
    title: string;
  }[] = [
    {
      id: 'mood',
      activeKeys: ['mood'],
      label: 'MOOD',
      title: 'Mood Tracker',
    },
    {
      id: 'track',
      activeKeys: ['track', 'best'],
      label: 'HAB',
      title: 'Habits Tracker',
    },
    {
      id: 'project',
      activeKeys: ['project'],
      label: 'PROJ',
      title: 'Projects',
    },
    {
      id: 'time',
      activeKeys: ['time'],
      label: 'FOC',
      title: 'Focus Timer',
    },
    {
      id: 'notes',
      activeKeys: ['notes', 'analysis'],
      label: 'JRNL',
      title: 'Journal & Notes',
    },
    {
      id: 'settings',
      activeKeys: ['settings'],
      label: 'SET',
      title: 'Settings',
    },
  ];

  return (
    <footer
      id="croakle-bottom-dock"
      className="shrink-0 w-full bg-[#D32018] dark:bg-[#2B0A08] border-t-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] px-1 sm:px-3 py-2 sm:py-2.5 flex items-center justify-around gap-1 z-30 transition-colors"
    >
      {groups.map((group) => {
        const isActive = group.activeKeys.includes(activePage);

        return (
          <button
            key={group.id}
            id={`dock-nav-${group.id}`}
            type="button"
            onClick={() => onSelectPage(group.id)}
            title={group.title}
            className={`nav-item flex-1 max-w-[64px] sm:max-w-[76px] text-center text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-tight sm:tracking-wider transition-all cursor-pointer relative rounded-xl whitespace-nowrap py-1.5 px-1 sm:px-2 ${
              isActive
                ? 'bg-[#FEF08A] text-[#1F1B1A] border-[2px] border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A] -translate-y-0.5'
                : 'text-white/85 hover:text-white hover:bg-black/20 border-[2px] border-transparent'
            }`}
          >
            <span>{group.label}</span>
          </button>
        );
      })}
    </footer>
  );
};



