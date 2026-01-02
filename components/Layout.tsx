
import React from 'react';

interface Props {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<Props> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Android Style Header */}
      <header className="safe-top sticky top-0 z-50 bg-emerald-700 text-white shadow-md">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xl font-medium tracking-tight">EcoSense</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-1 hover:bg-emerald-600 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pb-20">
        {children}
      </main>

      {/* Android Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-bottom z-50">
        <div className="flex h-16">
          <button 
            onClick={() => setActiveTab('analyze')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'analyze' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6" fill={activeTab === 'analyze' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-medium uppercase tracking-wider">Analyze</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'history' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6" fill={activeTab === 'history' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-[10px] font-medium uppercase tracking-wider">Feed</span>
          </button>

          <button 
            onClick={() => setActiveTab('map')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'map' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6" fill={activeTab === 'map' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-medium uppercase tracking-wider">Map</span>
          </button>

          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'stats' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6" fill={activeTab === 'stats' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-[10px] font-medium uppercase tracking-wider">Stats</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
