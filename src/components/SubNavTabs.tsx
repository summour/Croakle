import React from 'react';
import { PageType } from '../types';

interface SubNavTabsProps {
  activePage: PageType;
  onNavigate: (page: PageType) => void;
  tabs: { id: PageType; label: string; icon: React.ReactNode }[];
}

export const SubNavTabs: React.FC<SubNavTabsProps> = ({ activePage, onNavigate, tabs }) => {
  return (
    <nav className="flex items-center p-1 bg-black/[0.04] dark:bg-white/[0.06] backdrop-blur-2xl rounded-[26px] border border-black/[0.04] dark:border-white/[0.08] shadow-[inset_0_1px_2.5px_rgba(0,0,0,0.04)]">
      {tabs.map((tab) => {
        const isActive = activePage === tab.id;
        return (
          <button
            key={tab.id}
            id={`subnav-${tab.id}`}
            type="button"
            onClick={() => onNavigate(tab.id)}
            className={`flex-1 py-2 px-3 rounded-[22px] text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 ios-tap relative ${
              isActive
                ? 'bg-white dark:bg-[#28211b] text-[#221c17] dark:text-[#f6f1eb] shadow-[0_4px_14px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.18)] scale-[1.01] z-10'
                : 'text-[#85776a] dark:text-[#a89b8d] hover:text-[#221c17] dark:hover:text-[#f6f1eb]'
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
