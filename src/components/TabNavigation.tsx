import React from 'react';
import { Briefcase, Cpu, Send } from 'lucide-react';
import { TabKey } from '../types';
import { projectsData } from '../data/projects';
import { servicesData } from '../data/services';

interface TabNavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

interface TabOption {
  key: TabKey;
  label: string;
  count?: number;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabOption[] = [
  {
    key: 'portfolio',
    label: 'Portfolio',
    count: projectsData.length,
    icon: Briefcase,
  },
  {
    key: 'services',
    label: 'Services',
    count: servicesData.length,
    icon: Cpu,
  },
  {
    key: 'contact',
    label: 'Get in Touch',
    icon: Send,
  },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav
      className="sticky top-0 z-30 bg-[#fafafa]/90 backdrop-blur-md pt-4 pb-0 border-b border-neutral-200/80 -mx-4 px-4 sm:mx-0 sm:px-0 transition-colors"
      aria-label="Portfolio sections"
    >
      <div className="flex items-center justify-between">
        {/* Navigation Tabs: Seamless Underline Blend */}
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const IconComponent = tab.icon;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`group relative flex items-center gap-2 pb-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 ${
                  isActive
                    ? 'text-neutral-900 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <IconComponent
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                    isActive
                      ? 'text-neutral-900'
                      : 'text-neutral-400 group-hover:text-neutral-700'
                  }`}
                />
                <span>{tab.label}</span>

                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded transition-colors leading-none ${
                      isActive
                        ? 'bg-neutral-200/80 text-neutral-900 font-medium'
                        : 'bg-neutral-200/50 text-neutral-500 group-hover:text-neutral-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}

                {/* Seamless Active Line Indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Subtle availability tag on desktop */}
        <div className="hidden sm:flex items-center gap-2 pb-3 text-xs font-medium text-neutral-500">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
          <span>Available for Projects</span>
        </div>
      </div>
    </nav>
  );
};

