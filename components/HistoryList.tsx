import React from "react";
import { WasteReport, Severity } from "../types";

interface Props {
  reports: WasteReport[];
}

export const HistoryList: React.FC<Props> = ({ reports }) => {
  const severityStyle: Record<Severity, string> = {
    [Severity.LOW]: "bg-emerald-500 text-white",
    [Severity.MEDIUM]: "bg-amber-500 text-white",
    [Severity.HIGH]: "bg-rose-600 text-white"
  };

  /* ============ EMPTY STATE ============ */
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2"
            />
          </svg>
        </div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">
          Feed Empty
        </p>
        <p className="text-sm text-slate-400 mt-1">
          Scan waste to populate this list.
        </p>
      </div>
    );
  }

  /* ============ MAIN LIST ============ */
  return (
    <div className="w-full space-y-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Recent Activity
          </h2>
          <p className="text-slate-400 font-medium">
            Global sanitation tracking in real time.
          </p>
        </div>

        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 w-fit">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Total Reports
          </span>
          <span className="text-2xl font-black text-emerald-600">
            {reports.length}
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {reports.map(report => (
          <div
            key={report.id}
            className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col"
          >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={report.image}
                alt="Waste"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span
                className={`absolute top-4 left-4 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-sm ${severityStyle[report.result.severity]}`}
              >
                {report.result.severity}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>
                    {new Date(report.timestamp).toLocaleDateString([], {
                      month: "short",
                      day: "numeric"
                    })}{" "}
                    •{" "}
                    {new Date(report.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>

                  {report.location && (
                    <svg
                      className="w-4 h-4 text-emerald-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      />
                    </svg>
                  )}
                </div>

                <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-2 min-h-[2.5rem]">
                  {report.result.reason}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-6 pt-6 border-t border-slate-50 flex flex-wrap gap-2">
                {report.result.waste_type.map(type => (
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
