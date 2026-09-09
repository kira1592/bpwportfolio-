import React from 'react';
import { TabKey } from '../types';

interface TabNavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

interface TabOption {
  key: TabKey;
  label: string;
}

const TABS: TabOption[] = [
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'services', label: 'Services' },
  { key: 'contact', label: 'Contact' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav
      className="border-b border-neutral-200/80 mt-3 pb-px"
      aria-label="Portfolio sections"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Section indicator / quiet label on desktop */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
          <span>Navigation</span>
        </div>

        {/* Desktop aligned right, mobile 3 equal-width tabs with soft 10px-12px rounded elements */}
        <div className="grid grid-cols-3 sm:flex sm:justify-end gap-1 sm:gap-1.5 p-1 bg-neutral-100/70 border border-neutral-200/60 rounded-xl">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-200 text-center whitespace-nowrap rounded-[10px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 ${
                  isActive
                    ? 'bg-white text-neutral-900 font-semibold border border-neutral-200/90'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60 border border-transparent'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
