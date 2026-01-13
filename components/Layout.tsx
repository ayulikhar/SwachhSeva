import React, { useMemo } from 'react';
import { Camera, List, MapPin } from 'lucide-react';
import { Logo } from './Logo';

interface Props {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<Props> = ({
  children,
  activeTab,
  setActiveTab
}) => {
  const tabs = useMemo(
    () => [
      {
        id: 'analyze',
        label: 'Scan',
        icon: Camera
      },
      {
        id: 'history',
        label: 'Feed',
        icon: List
      },
      {
        id: 'map',
        label: 'Map',
        icon: MapPin
      }
    ],
    []
  );

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex w-24 lg:w-64 flex-col bg-white border-r border-slate-100 sticky top-0 min-h-screen">
        <div className="p-6 flex items-center justify-center lg:justify-start gap-3">
          <Logo size="sm" />
          <span className="hidden lg:block font-black text-xl tracking-tight text-slate-800">
            SwachhSeva
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-2 p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-primary text-white shadow-medium'
                    : 'text-slate-400 hover:bg-primary-50 hover:text-primary-600'
                  }`}
              >
                <Icon
                  className={`w-6 h-6 transition-colors
                    ${isActive ? 'text-white' : 'group-hover:text-primary-600'}
                  `}
                />
                <span className="hidden lg:block font-semibold">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="hidden lg:block p-6">
          <div className="p-4 bg-slate-50 rounded-2xl border text-xs text-slate-500">
            Civic-Tech Build · SwachhSeva v1.0
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 w-full overflow-y-auto bg-slate-50">

        {/* ===== CENTERED HEADER (DESKTOP) ===== */}
        <header className="hidden md:block w-full py-6 px-4 bg-white/80 backdrop-blur-sm border-b border-primary-100 shadow-soft">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <div className="flex items-center gap-4">
              <Logo />
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                  SwachhSeva
                </h1>
                <p className="text-xs md:text-sm text-slate-500 font-medium">
                  AI-powered civic waste reporting
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ===== MOBILE HEADER ===== */}
        <header className="md:hidden sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center border-b border-primary-100">
          <h1 className="font-black text-lg tracking-tight text-slate-800">
            SwachhSeva
          </h1>
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
            JD
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <div className="w-full min-h-full pb-32 md:pb-6">
          {children}
        </div>
      </main>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-6">
        <nav className="mx-auto max-w-md bg-white/95 backdrop-blur-2xl border border-primary-100 shadow-large rounded-[2.5rem] h-20 flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200
                  ${isActive ? 'text-primary-600 scale-105' : 'text-slate-400'}
                `}
              >
                <Icon className="w-6 h-6" />
                <span
                  className={`text-[9px] font-bold mt-1 uppercase tracking-wide transition-all
                    ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                  `}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

    </div>
  );
};
