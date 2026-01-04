
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
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[sev]}`}>
        {sev}
      </span>
    );
  };

  if (reports.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p>No reports found.</p>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-4 pt-4 pb-12">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        Recent Activity
        <span className="text-xs font-normal text-slate-400">({reports.length})</span>
      </h2>
      {reports.map((report) => (
        <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex h-32 active:bg-slate-50 transition-colors">
          <div className="w-32 flex-shrink-0">
            <img src={report.image} alt="Waste" className="w-full h-full object-cover" />
          </div>
          <div className="p-3 flex flex-col justify-between flex-grow min-w-0">
            <div>
              <div className="flex justify-between items-start mb-1">
                {getSeverityBadge(report.result.severity)}
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {report.result.reason}
              </p>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex gap-1 overflow-hidden">
                {report.result.waste_type.slice(0, 2).map(type => (
                  <span key={type} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold">
                    {type}
                  </span>
                ))}
              </div>
              {report.location && (
                <div className="flex items-center text-emerald-600">
                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                   </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};