
import React from 'react';

interface Props {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<Props> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'analyze',
      label: 'Scan',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'history',
      label: 'Feed',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2" />
        </svg>
      )
    },
    {
      id: 'map',
      label: 'Map',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden md:flex w-24 lg:w-64 flex-col bg-white border-r border-slate-100 sticky top-0 min-h-screen">
        <div className="p-6 flex items-center justify-center lg:justify-start gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
            </svg>
          </div>
          <span className="hidden lg:block font-black text-xl tracking-tight text-slate-800">
            SwachhSeva
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-2 p-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all
                ${activeTab === tab.id
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
            >
              {tab.icon}
              <span className="hidden lg:block font-semibold">
                {tab.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="hidden lg:block p-6">
          <div className="p-4 bg-slate-50 rounded-2xl border text-xs text-slate-500">
            Hackathon Build · v2.5.2
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 w-full overflow-y-auto bg-slate-50">

        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center">
          <h1 className="font-black text-lg tracking-tight text-slate-800">
            SwachhSeva
          </h1>
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
            JD
          </div>
        </header>

        {/* Content */}
        <div className="w-full min-h-full pb-28 md:pb-6">
          {children}
        </div>
      </main>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-6">
        <nav className="mx-auto max-w-md bg-white/80 backdrop-blur-2xl border shadow-2xl rounded-[2.5rem] h-20 flex items-center justify-around">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition
                ${activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400'}`}
            >
              {tab.icon}
              <span className={`text-[9px] font-bold mt-1 uppercase tracking-wide
                ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

    </div>
  );
};
