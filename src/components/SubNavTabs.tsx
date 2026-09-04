import React from 'react';
import { PageType } from '../types';

interface SubNavTabsProps {
  activePage: PageType;
  onNavigate: (page: PageType) => void;
  tabs: { id: PageType; label: string; icon?: React.ReactNode }[];
}

export const SubNavTabs: React.FC<SubNavTabsProps> = ({ activePage, onNavigate, tabs }) => {
  return (
    <nav className="flex items-center p-1.5 bg-[#FFFEF7] dark:bg-[#1D1B18] border-[2.5px] border-[#1F1B1A] dark:border-[#F8F7F4] rounded-2xl shadow-[4px_4px_0px_#1F1B1A] select-none gap-1.5 mb-3">
      {tabs.map((tab) => {
        const isActive = activePage === tab.id;
        return (
          <button
            key={tab.id}
            id={`subnav-${tab.id}`}
            type="button"
            onClick={() => onNavigate(tab.id)}
            className={`flex-1 py-1.5 px-2 text-xs font-oswald font-bold tracking-wider uppercase transition-all duration-100 cursor-pointer rounded-xl border-[2px] ${
              isActive
                ? 'bg-[#D32018] text-white border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A] -translate-y-0.5'
                : 'border-transparent text-[#1F1B1A] dark:text-[#F8F7F4] hover:bg-[#1F1B1A]/5 dark:hover:bg-white/5'
            }`}
          >
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};


