import React, { useMemo } from 'react';
import { Home, Camera, Map, Award, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = useMemo(
    () => [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'report', label: 'Report', icon: Camera },
      { id: 'map', label: 'Map', icon: Map },
      { id: 'rewards', label: 'Rewards', icon: Award },
      { id: 'profile', label: 'Profile', icon: User }
    ],
    []
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe">
      <nav className="mx-auto max-w-md bg-surface/95 backdrop-blur-xl border border-border shadow-large rounded-3xl h-20 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200
                ${isActive
                  ? 'text-primary bg-primary/10 scale-105'
                  : 'text-muted hover:text-primary hover:bg-primary/5'
                }`}
            >
              {/* Icon */}
              <Icon
                className={`w-6 h-6 transition-all duration-200
                  ${isActive ? '-translate-y-0.5 scale-110' : ''}
                `}
              />

              {/* Label */}
              <span
                className={`text-[10px] font-semibold mt-1 transition-all duration-200
                  ${isActive
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-1'
                  }`}
              >
                {tab.label}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-primary animate-scale-in" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
