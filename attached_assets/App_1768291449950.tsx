import React, { useState } from 'react';
import { Camera, History, Map, User, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

// Types
interface WasteReport {
  id: string;
  timestamp: Date;
  location: string;
  result: {
    category: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
  };
}

// Layout Component
const Layout: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; children: React.ReactNode }> = ({ 
  activeTab, 
  setActiveTab, 
  children 
}) => {
  const tabs = [
    { id: 'analyze', icon: Camera, label: 'Analyze' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 shadow-lg">
        <h1 className="text-2xl font-black tracking-tight">SwachhSeva</h1>
        <p className="text-xs text-emerald-100 font-medium mt-0.5">Smart Waste Report system</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 shadow-lg z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-bold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Waste Analyzer Component
const WasteAnalyzer: React.FC<{ onNewReport: (report: WasteReport) => void }> = ({ onNewReport }) => {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const categories = ['Plastic Waste', 'Organic Waste', 'Mixed Waste'];
      const severities: Array<'LOW' | 'MEDIUM' | 'HIGH'> = ['LOW', 'MEDIUM', 'HIGH'];
      
      const report: WasteReport = {
        id: Date.now().toString(),
        timestamp: new Date(),
        location: 'Thane, Maharashtra',
        result: {
          category: categories[Math.floor(Math.random() * 3)],
          severity: severities[Math.floor(Math.random() * 3)],
          description: 'Waste accumulation detected in residential area'
        }
      };
      onNewReport(report);
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Report Waste</h2>
        <p className="text-slate-500 text-sm mb-6">Take a photo or upload an image to analyze waste conditions</p>
        
        <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center mb-6 hover:border-emerald-400 transition-colors cursor-pointer">
          <div className="text-center">
            <Camera className="w-16 h-16 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-600">Tap to capture</p>
            <p className="text-xs text-slate-400 mt-1">or drag & drop</p>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {analyzing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </span>
          ) : 'Analyze Waste'}
        </button>
      </div>

      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
        <h3 className="font-black text-emerald-900 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Quick Tips
        </h3>
        <ul className="space-y-2 text-sm text-emerald-800">
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5 font-bold">•</span>
            <span>Ensure good lighting for accurate detection</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5 font-bold">•</span>
            <span>Capture the waste pile from multiple angles</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5 font-bold">•</span>
            <span>Include landmarks for better location tracking</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// History List Component
const HistoryList: React.FC<{ reports: WasteReport[] }> = ({ reports }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-black text-slate-800 px-2">Report History</h2>
      {reports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
          <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No reports yet</p>
          <p className="text-slate-300 text-sm mt-2">Start analyzing waste to see your history</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(report.result.severity)}`}>
                  {report.result.severity}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {report.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{report.result.category}</h3>
              <p className="text-sm text-slate-500 mb-2">{report.result.description}</p>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="w-3 h-3" />
                <span>{report.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Map View Component
const MapView: React.FC<{ reports: WasteReport[] }> = ({ reports }) => {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-black text-slate-800 px-2">Waste Map</h2>
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        <div className="aspect-video bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]"></div>
          <div className="text-center relative z-10">
            <Map className="w-16 h-16 text-emerald-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-emerald-800">Map View</p>
            <p className="text-xs text-emerald-600 mt-1">{reports.length} reports plotted</p>
          </div>
        </div>
      </div>
      
      {reports.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-3">Recent Locations</h3>
          <div className="space-y-2">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center gap-3 text-sm py-2 border-b border-slate-50 last:border-0">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-600">{report.location}</span>
                <span className="text-xs text-slate-400 ml-auto">{report.timestamp.toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Profile View Component
const ProfileView: React.FC<{ reports: WasteReport[] }> = ({ reports }) => {
  const leaderboardUsers = [
    { name: 'EcoHero_22', score: 1450, me: false },
    { name: 'John Doe', score: reports.length * 100 + 500, me: true },
    { name: 'GreenWatcher', score: 890, me: false },
    { name: 'TrashTitan', score: 720, me: false },
    { name: 'CleanCity_99', score: 640, me: false },
  ].sort((a, b) => b.score - a.score);

  const progressPercent = Math.min((reports.length / 20) * 100, 100);
  const highSeverityCount = reports.filter(r => r.result.severity === 'HIGH').length;

  return (
    <div className="w-full space-y-6">
      {/* User Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 p-1.5 shadow-xl">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <span className="text-3xl font-black text-emerald-600 tracking-tighter">JD</span>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">John Doe</h2>
          <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest rounded-full">
              Eco Guardian
            </span>
            <span className="text-sm text-slate-400 font-bold tracking-tight">Member since 2024 • Level 12</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Impact Dashboard</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-slate-800 block">{reports.length}</span>
                <p className="text-xs font-bold text-slate-400 uppercase mt-2 tracking-widest">Total Reports</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 text-rose-500 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-slate-800 block">{highSeverityCount}</span>
                <p className="text-xs font-bold text-slate-400 uppercase mt-2 tracking-widest">Critical Resolved</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-[80px] group-hover:bg-emerald-500/30 transition-all duration-700"></div>
            <h3 className="text-2xl font-black mb-4 tracking-tight relative z-10">Community Progress</h3>
            <p className="text-slate-400 leading-relaxed font-medium mb-8 max-w-md relative z-10">
              You're in the top 5% of contributors this month. Your reports have initiated 12 sanitation routes.
            </p>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                 <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Weekly Goal</p>
                 <p className="text-sm font-bold">{Math.round(progressPercent)}% Complete</p>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-1000 ease-out" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Global Ranking</h3>
          <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {leaderboardUsers.map((user, i) => (
              <div key={user.name} className={`px-6 py-4 flex justify-between items-center transition-colors ${user.me ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-amber-100 text-amber-600 shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                    {i + 1}
                  </div>
                  <span className={`font-bold tracking-tight text-sm ${user.me ? 'text-emerald-700' : 'text-slate-700'}`}>
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
    </div>
  );
};

// Main App Component
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
        return <ProfileView reports={reports} />;
      default:
        return <WasteAnalyzer onNewReport={handleNewReport} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;