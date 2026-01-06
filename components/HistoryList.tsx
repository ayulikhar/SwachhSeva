
import React from 'react';
import { WasteReport, Severity } from '../types';

interface Props {
  reports: WasteReport[];
}

export const HistoryList: React.FC<Props> = ({ reports }) => {
  const getSeverityBadge = (sev: Severity) => {
    const styles = {
      [Severity.LOW]: 'bg-emerald-500 text-white',
      [Severity.MEDIUM]: 'bg-amber-500 text-white',
      [Severity.HIGH]: 'bg-rose-600 text-white'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-sm ${styles[sev]}`}>
        {sev}
      </span>
    );
  };

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2" />
          </svg>
        </div>
        <p className="font-bold text-slate-400">Feed Empty</p>
        <p className="text-sm text-slate-400">Scan waste to populate this list.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Recent Activity</h2>
          <p className="text-slate-400 font-medium">Global sanitation tracking in real-time.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Reports</span>
           <span className="text-2xl font-black text-emerald-600">{reports.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div 
            key={report.id} 
            className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
          >
            <div className="relative aspect-video overflow-hidden">
              <img src={report.image} alt="Waste" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4">
                {getSeverityBadge(report.result.severity)}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {new Date(report.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {report.location && (
                    <div className="text-emerald-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-600 font-medium line-clamp-2 leading-relaxed h-10">
                  {report.result.reason}
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-50 flex flex-wrap gap-2">
                {report.result.waste_type.map(type => (
                  <span key={type} className="text-[9px] bg-slate-50 text-slate-500 px-3 py-1 rounded-full uppercase font-black tracking-tighter border border-slate-100">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};