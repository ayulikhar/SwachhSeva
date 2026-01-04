
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { WasteAnalyzer } from './components/WasteAnalyzer';
import { HistoryList } from './components/HistoryList';
import { MapView } from './components/MapView';
import { WasteReport } from './types';

const App: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [activeTab, setActiveTab] = useState('analyze');

  const handleNewReport = (report: WasteReport) => {
    setReports(prev => [report, ...prev]);
    setActiveTab('map');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'analyze':
        return <WasteAnalyzer onNewReport={handleNewReport} />;
      case 'history':
        return <HistoryList reports={reports} />;
      case 'map':
        return <MapView reports={reports} />;
      case 'profile':
        return (
          <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* User Profile Header */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 p-1.5 shadow-xl">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <span className="text-3xl font-black text-emerald-600">JD</span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">John Doe</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                    Eco Guardian
                  </span>
                  <span className="text-xs text-slate-400 font-medium tracking-tight">Level 12</span>
                </div>
              </div>
            </div>

            {/* Impact Dashboard */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Impact Dashboard</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                  <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3 text-emerald-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-3xl font-black text-slate-800">{reports.length}</span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Total Clean-ups</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                  <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center mb-3 text-rose-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <span className="text-3xl font-black text-slate-800">
                    {reports.filter(r => r.result.severity === 'HIGH').length}
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Hazardous Alerts</p>
                </div>
              </div>
            </div>
            
            {/* City Contribution */}
            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-700"></div>
              <h3 className="text-xl font-black mb-3 tracking-tight">City Contribution</h3>
              <p className="text-sm opacity-60 leading-relaxed font-medium">
                Your collective scanning efforts have helped sanitation crews identify {reports.length} critical sites this week.
              </p>
              <div className="mt-8">
                <div className="flex justify-between items-end mb-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Weekly Goal Progress</p>
                   <p className="text-xs font-bold">{Math.round((reports.length / 50) * 100)}%</p>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" 
                    style={{ width: `${Math.min((reports.length / 50) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[10px] mt-3 font-bold opacity-40 uppercase tracking-tighter">Goal: 50 Valid Reports</p>
              </div>
            </div>
            
            {/* Community Rank */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Community Ranking</h3>
              <div className="bg-white rounded-[2rem] border border-slate-100 divide-y divide-slate-100 overflow-hidden shadow-sm">
                {[
                  { name: 'EcoHero_22', score: 1450, me: false },
                  { name: 'John Doe', score: reports.length * 100, me: true },
                  { name: 'GreenWatcher', score: 890, me: false },
                  { name: 'TrashTitan', score: 720, me: false },
                ].sort((a,b) => b.score - a.score).map((user, i) => (
                  <div key={user.name} className={`px-6 py-5 flex justify-between items-center transition-colors ${user.me ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                        {i + 1}
                      </div>
                      <span className={`font-bold tracking-tight ${user.me ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {user.me ? 'You' : user.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 block">{user.score}</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">points</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer space */}
            <div className="h-4"></div>
          </div>
        );
      default:
        return <WasteAnalyzer onNewReport={handleNewReport} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;