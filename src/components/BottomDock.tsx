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
}

export const BottomDock: React.FC<BottomDockProps> = ({ activePage, onSelectPage }) => {
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
      className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-[#241f1a]/90 dark:bg-[#151210]/92 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[32px] p-2 shadow-[0_20px_40px_-10px_rgba(20,15,10,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.25)] flex items-center justify-between gap-1.5 transition-all duration-300"
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
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-[22px] transition-all duration-200 min-h-[52px] ios-tap relative ${
              isActive
                ? 'bg-gradient-to-b from-[#ffffff] to-[#f4eee6] text-[#241f1a] font-black shadow-[0_6px_16px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,1)] scale-[1.03]'
                : 'text-[#a89b8d] hover:text-[#f4efe8] hover:bg-white/[0.08] font-semibold'
            }`}
          >
            <Icon size={23} className="transition-transform duration-200" />
            <span className="text-[10.5px] leading-tight mt-0.5 tracking-tight font-extrabold">{group.label}</span>
          </button>
        );
      })}
    </footer>
  );
};



