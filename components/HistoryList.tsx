import React from "react";
import { WasteReport, Severity } from "../types";
import { FileText, MapPin } from "lucide-react";

interface Props {
  reports: WasteReport[];
}

export const HistoryList: React.FC<Props> = ({ reports }) => {
  const severityStyle: Record<Severity, string> = {
    [Severity.LOW]: "bg-emerald-500 text-white",
    [Severity.MEDIUM]: "bg-amber-500 text-white",
    [Severity.HIGH]: "bg-rose-600 text-white"
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString([], {
      month: "short",
      day: "numeric"
    })} • ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })}`;
  };

  /* ================= EMPTY STATE ================= */
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mb-6 shadow-medium">
          <FileText className="w-10 h-10 text-white" />
        </div>

        <p className="font-black text-slate-400 uppercase tracking-widest text-xs mb-2">
          No Activity Yet
        </p>

        <h3 className="text-xl font-black text-slate-800 mb-3">
          Your Feed Is Empty
        </h3>

        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
          Start reporting waste around you. Every report helps keep the city
          cleaner and safer.
        </p>
      </div>
    );
  }

  /* ================= MAIN LIST ================= */
  return (
    <div className="w-full space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Recent Activity
          </h2>
          <p className="text-slate-400 font-medium">
            Live sanitation reports from the community.
          </p>
        </div>

        <div className="bg-gradient-surface px-6 py-3 rounded-2xl border border-primary-100 shadow-soft flex items-center gap-3 w-fit">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Total Reports
            </span>
            <span className="text-2xl font-black text-primary-600">
              {reports.length}
            </span>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col"
          >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={report.image}
                alt="Reported waste"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <span
                className={`absolute top-4 left-4 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-sm ${
                  severityStyle[report.result.severity]
                }`}
              >
                {report.result.severity} Severity
              </span>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>{formatDateTime(report.timestamp)}</span>
                  {report.location && (
                    <MapPin className="w-4 h-4 text-primary-500" />
                  )}
                </div>

                <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-2 min-h-[2.5rem]">
                  {report.result.reason}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-6 pt-6 border-t border-slate-50 flex flex-wrap gap-2">
                {report.result.waste_type.map((type) => (
                  <span
                    key={type}
                    className="text-[9px] bg-slate-50 text-slate-500 px-3 py-1 rounded-full uppercase font-black tracking-tighter border border-slate-100"
                  >
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
