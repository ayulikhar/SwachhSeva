
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
    setActiveTab('map'); // Switch to map after capture to see the new pin
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'analyze':
        return <WasteAnalyzer onNewReport={handleNewReport} />;
      case 'history':
        return <HistoryList reports={reports} />;
      case 'map':
        return <MapView reports={reports} />;
      case 'stats':
        return (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Impact Dashboard</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <span className="text-2xl font-bold text-emerald-600">{reports.length}</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Total Reports</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <span className="text-2xl font-bold text-amber-500">
                  {reports.filter(r => r.result.severity === 'HIGH').length}
                </span>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">High Urgency</p>
              </div>
            </div>
            
            <div className="bg-emerald-700 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-2">City Contribution</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                Your reports have helped identify {reports.length} potential hazard sites this week. Keep cleaning our city!
              </p>
              <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-2/3"></div>
              </div>
              <p className="text-[10px] mt-2 font-medium opacity-75">GOAL: 50 REPORTS BY FRIDAY</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">Community Rank</h3>
              <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
                {[
                  { name: 'EcoHero_22', score: 1450, me: false },
                  { name: 'You', score: reports.length * 100, me: true },
                  { name: 'GreenWatcher', score: 890, me: false },
                ].sort((a,b) => b.score - a.score).map((user, i) => (
                  <div key={user.name} className={`px-4 py-3 flex justify-between items-center ${user.me ? 'bg-emerald-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-400">#{i+1}</span>
                      <span className={`font-medium ${user.me ? 'text-emerald-700' : 'text-slate-700'}`}>{user.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{user.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
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