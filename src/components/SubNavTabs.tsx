import React from 'react';
import { PageType } from '../types';

interface SubNavTabsProps {
  activePage: PageType;
  onNavigate: (page: PageType) => void;
  tabs: { id: PageType; label: string; icon?: React.ReactNode }[];
}

export const SubNavTabs: React.FC<SubNavTabsProps> = ({ activePage, onNavigate, tabs }) => {
  return (
    <nav className="flex items-center p-1 bg-white dark:bg-[#1D1B18] border border-[#1D1B18] dark:border-[#F8F7F4] select-none gap-1">
      {tabs.map((tab) => {
        const isActive = activePage === tab.id;
        return (
          <button
            key={tab.id}
            id={`subnav-${tab.id}`}
            type="button"
            onClick={() => onNavigate(tab.id)}
            className={`flex-1 py-1 px-2 text-xs font-oswald font-bold tracking-wider uppercase transition-all duration-100 cursor-pointer border ${
              isActive
                ? 'bg-[#E63946] text-white border-[#1D1B18] dark:border-[#F8F7F4]'
                : 'border-transparent text-[#1D1B18] dark:text-[#F8F7F4] hover:bg-[#F8F7F4] dark:hover:bg-[#252320]'
            }`}
          >
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};


