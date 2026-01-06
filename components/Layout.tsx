
import React from 'react';

interface Props {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<Props> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'analyze', label: 'Scan', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { id: 'history', label: 'Feed', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2" />
      </svg>
    )},
    { id: 'map', label: 'Map', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { id: 'profile', label: 'Profile', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-24 lg:w-64 flex-col bg-white border-r border-slate-100 h-screen sticky top-0">
        <div className="p-8 flex items-center justify-center lg:justify-start gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center shrink-0">
             <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
             </svg>
          </div>
          <span className="hidden lg:block font-black text-xl tracking-tighter text-slate-800">SwachhSeva</span>
        </div>

        <nav className="flex-grow flex flex-col gap-2 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                activeTab === tab.id 
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <div className={`${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                {tab.icon}
              </div>
              <span className={`hidden lg:block font-bold tracking-tight ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-6 hidden lg:block">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Hackathon Build</p>
             <p className="text-xs text-slate-500 font-medium">v2.5.2 Pro Web</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden h-screen w-full">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-6 bg-slate-50/80 backdrop-blur-xl sticky top-0 z-40">
           <h1 className="text-xl font-black tracking-tighter text-slate-800">SwachhSeva</h1>
           <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">JD</div>
        </header>

        <div className="pb-28 md:pb-0 h-full w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 px-6 z-50 pointer-events-none">
        <nav className="mx-auto max-w-md pointer-events-auto bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[2.5rem] flex h-20 items-center justify-around px-2">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center transition-all w-16 h-16 group ${activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400'}`}
            >
              <div className={`absolute inset-0 rounded-2xl transition-all scale-75 opacity-0 ${activeTab === tab.id ? 'bg-emerald-600/10 scale-100 opacity-100' : 'group-hover:bg-slate-100 group-hover:opacity-100'}`} />
              <div className="relative z-10">{tab.icon}</div>
              <span className={`relative z-10 text-[8px] font-black uppercase tracking-widest mt-1 transition-all ${activeTab === tab.id ? 'opacity-100' : 'opacity-0 scale-50'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};