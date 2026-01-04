
import React from 'react';

interface Props {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<Props> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Minimalistic safe area spacing instead of header */}
      <div className="safe-top h-4 w-full bg-transparent" />

      <main className="flex-grow pb-28">
        {children}
      </main>

      {/* Floating Minimalist Navigation */}
      <div className="fixed bottom-6 left-0 right-0 px-6 z-50 pointer-events-none">
        <nav className="mx-auto max-w-md pointer-events-auto bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden transition-all duration-500 ease-in-out">
          <div className="flex h-20 items-center justify-around px-4">
            <NavButton 
              active={activeTab === 'analyze'} 
              onClick={() => setActiveTab('analyze')}
              label="Scan"
            >
              <svg className="w-6 h-6" fill={activeTab === 'analyze' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </NavButton>

            <NavButton 
              active={activeTab === 'history'} 
              onClick={() => setActiveTab('history')}
              label="Feed"
            >
              <svg className="w-6 h-6" fill={activeTab === 'history' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </NavButton>

            <NavButton 
              active={activeTab === 'map'} 
              onClick={() => setActiveTab('map')}
              label="Map"
            >
              <svg className="w-6 h-6" fill={activeTab === 'map' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </NavButton>

            <NavButton 
              active={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')}
              label="Profile"
            >
              <svg className="w-6 h-6" fill={activeTab === 'profile' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </NavButton>
          </div>
        </nav>
      </div>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, children, label }) => {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center transition-all duration-300 p-2 group w-16 h-16`}
    >
      <div className={`
        absolute inset-0 rounded-2xl transition-all duration-500 transform
        ${active ? 'bg-emerald-600/10 scale-100 opacity-100' : 'scale-75 opacity-0 group-hover:bg-slate-200/50 group-hover:scale-90 group-hover:opacity-100'}
      `} />
      <div className={`relative z-10 transition-all duration-300 ${active ? 'text-emerald-600 -translate-y-1' : 'text-slate-400'}`}>
        {children}
      </div>
      <span className={`
        relative z-10 text-[10px] font-black uppercase tracking-[0.1em] mt-1 transition-all duration-300
        ${active ? 'text-emerald-700 opacity-100 scale-100' : 'text-slate-400 opacity-0 scale-50'}
      `}>
        {label}
      </span>
    </button>
  );
};