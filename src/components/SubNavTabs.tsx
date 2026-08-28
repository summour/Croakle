import React from 'react';
import { PageType } from '../types';

interface SubNavTabsProps {
  activePage: PageType;
  onNavigate: (page: PageType) => void;
  tabs: { id: PageType; label: string; icon?: React.ReactNode }[];
}

export const SubNavTabs: React.FC<SubNavTabsProps> = ({ activePage, onNavigate, tabs }) => {
  return (
    <nav className="flex items-center p-1 bg-zinc-200/60 dark:bg-zinc-800/60 backdrop-blur-2xl rounded-full border border-black/[0.04] dark:border-white/[0.08] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] select-none">
      {tabs.map((tab) => {
        const isActive = activePage === tab.id;
        return (
          <button
            key={tab.id}
            id={`subnav-${tab.id}`}
            type="button"
            onClick={() => onNavigate(tab.id)}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ios-tap relative ${
              isActive
                ? 'bg-white dark:bg-zinc-700/90 text-zinc-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] scale-[1.01] z-10'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-zinc-700/40'
            }`}
          >
            {tab.icon && <span className="shrink-0 opacity-80">{tab.icon}</span>}
            <span className="truncate tracking-tight font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

