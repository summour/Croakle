import React from 'react';
import { PageType } from '../types';

interface BottomDockProps {
  activePage: PageType;
  onSelectPage: (page: PageType) => void;
  isTimerRunning?: boolean;
}

export interface NavGroup {
  id: PageType;
  activeKeys: PageType[];
  label: string;
  title: string;
}

export const NAV_GROUPS: NavGroup[] = [
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

export const BottomDock: React.FC<BottomDockProps> = ({ activePage, onSelectPage, isTimerRunning }) => {
  return (
    <footer
      id="croakle-bottom-dock"
      style={{
        paddingBottom: 'max(0.625rem, calc(0.25rem + env(safe-area-inset-bottom, 0px)))',
      }}
      className="md:hidden fixed bottom-0 left-0 right-0 max-w-[540px] mx-auto w-full bg-[#D32018] dark:bg-[#2B0A08] border-t-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] px-1.5 sm:px-3 pt-1.5 sm:pt-2 flex items-center justify-around gap-1 sm:gap-1.5 z-30 transition-colors"
    >
      {NAV_GROUPS.map((group) => {
        const isActive = group.activeKeys.includes(activePage);

        return (
          <button
            key={group.id}
            id={`dock-nav-${group.id}`}
            type="button"
            onClick={() => onSelectPage(group.id)}
            title={group.title}
            className={`nav-item flex-1 max-w-[62px] sm:max-w-[72px] h-[34px] sm:h-[34px] flex items-center justify-center text-center text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-tight sm:tracking-wider transition-all cursor-pointer relative rounded-lg sm:rounded-xl whitespace-nowrap px-1 sm:px-1.5 select-none touch-manipulation active:scale-95 ${
              isActive
                ? 'bg-[#FEF08A] text-[#1F1B1A] border-[2px] border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A] -translate-y-0.5'
                : 'text-white/85 hover:text-white hover:bg-black/20 border-[2px] border-transparent active:bg-black/30'
            }`}
          >
            <span>{group.label}</span>
          </button>
        );
      })}
    </footer>
  );
};



