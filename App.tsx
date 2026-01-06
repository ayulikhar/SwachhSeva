
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
          <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* User Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 p-1.5 shadow-xl">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tighter">JD</span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">John Doe</h2>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full">
                    Eco Guardian
                  </span>
                  <span className="text-sm text-slate-400 font-bold tracking-tight">Member since 2024 • Level 12</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Stats */}
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Impact Dashboard</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-4xl font-black text-slate-800">{reports.length}</span>
                      <p className="text-xs font-bold text-slate-400 uppercase mt-2 tracking-widest">Total Reports</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 text-rose-500 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4" />
                        </svg>
                      </div>
                      <span className="text-4xl font-black text-slate-800">
                        {reports.filter(r => r.result.severity === 'HIGH').length}
                      </span>
                      <p className="text-xs font-bold text-slate-400 uppercase mt-2 tracking-widest">Critical Resolved</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-[80px] group-hover:bg-emerald-500/30 transition-all duration-700"></div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">Community Progress</h3>
                  <p className="text-slate-400 leading-relaxed font-medium mb-10 max-w-md">
                    You're in the top 5% of contributors this month. Your reports have initiated 12 sanitation routes.
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Weekly Goal</p>
                       <p className="text-sm font-bold">{Math.round((reports.length / 20) * 100)}% Complete</p>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min((reports.length / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Leaderboard */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Global Ranking</h3>
                <div className="bg-white rounded-[2.5rem] border border-slate-100 divide-y divide-slate-100 overflow-hidden shadow-sm">
                  {[
                    { name: 'EcoHero_22', score: 1450, me: false },
                    { name: 'John Doe', score: reports.length * 100 + 500, me: true },
                    { name: 'GreenWatcher', score: 890, me: false },
                    { name: 'TrashTitan', score: 720, me: false },
                    { name: 'CleanCity_99', score: 640, me: false },
                  ].sort((a,b) => b.score - a.score).map((user, i) => (
                    <div key={user.name} className={`px-8 py-6 flex justify-between items-center transition-colors ${user.me ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-amber-100 text-amber-600 shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                          {i + 1}
                        </div>
                        <span className={`font-bold tracking-tight ${user.me ? 'text-emerald-700' : 'text-slate-700'}`}>
                          {user.me ? 'You' : user.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900 block">{user.score}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">points</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-12"></div>
          </div>
        );
      default:
        return <WasteAnalyzer onNewReport={handleNewReport} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-200 flex justify-center">
      {/* Mobile viewport wrapper */}
      <div
        className="w-[390px] max-w-full min-h-screen bg-slate-50 overflow-hidden shadow-2xl"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderContent()}
        </Layout>
      </div>
    </div>
  );
}  

export default App;