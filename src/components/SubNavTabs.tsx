import React from 'react';
import { PageType } from '../types';

interface SubNavTabsProps {
  activePage: PageType;
  onNavigate: (page: PageType) => void;
  tabs: { id: PageType; label: string; icon: React.ReactNode }[];
}

export const SubNavTabs: React.FC<SubNavTabsProps> = ({ activePage, onNavigate, tabs }) => {
  return (
    <nav className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 backdrop-blur-2xl rounded-[24px] border border-black/[0.06] dark:border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => {
        const isActive = activePage === tab.id;
        return (
          <button
            key={tab.id}
            id={`subnav-${tab.id}`}
            type="button"
            onClick={() => onNavigate(tab.id)}
            className={`flex-1 py-2 px-3 rounded-[20px] text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ios-tap relative ${
              isActive
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] scale-[1.01] z-10'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            <span className="truncate tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

