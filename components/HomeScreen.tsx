import React from 'react';
import {
  Camera,
  MapPin,
  Award,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { WasteReport, Severity } from '../types';

interface HomeScreenProps {
  reports: WasteReport[];
  userStats: {
    totalReports: number;
    totalPoints: number;
    reportsThisWeek: number;
  };
  onReportGarbage: () => void;
  onViewReport: (report: WasteReport) => void;
  onViewMap?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  reports,
  userStats,
  onReportGarbage,
  onViewReport,
  onViewMap
}) => {
  const severityConfig = {
    [Severity.LOW]: {
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      icon: CheckCircle
    },
    [Severity.MEDIUM]: {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      icon: AlertTriangle
    },
    [Severity.HIGH]: {
      color: 'text-danger',
      bgColor: 'bg-danger/10',
      borderColor: 'border-danger/20',
      icon: XCircle
    }
  };

  const recentReports = reports.slice(0, 3);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-bg pb-safe">
      {/* Header */}
      <div className="bg-surface px-6 py-6 border-b border-border">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-2xl font-display font-bold text-text">
              {greeting()} 👋
            </h1>
            <p className="text-muted">
              You’ve reported {userStats.reportsThisWeek} issues this week
            </p>
          </div>
          <div className="icon-container-lg bg-primary/10">
            <Award className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="container-centered py-10">
        <button
          onClick={onReportGarbage}
          className="btn-primary text-left group"
        >
          <div className="icon-container-lg bg-white/20 group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold mb-1">
              Report Garbage
            </h2>
            <p className="text-white/90">
              Capture waste and notify authorities instantly
            </p>
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="container-centered mb-10">
        <div className="grid-stats">
          <div className="card card-hover p-6">
            <div className="flex items-center gap-4">
              <div className="icon-container-md bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-text">
                  {userStats.totalReports}
                </p>
                <p className="text-muted text-sm">Total Reports</p>
              </div>
            </div>
          </div>

          <div className="card card-hover p-6">
            <div className="flex items-center gap-4">
              <div className="icon-container-md bg-accent/10">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-text">
                  {userStats.totalPoints}
                </p>
                <p className="text-muted text-sm">Reward Points</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="container-centered">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text">
            Recent Reports
          </h3>
          {onViewMap && (
            <button
              onClick={onViewMap}
              className="text-primary font-medium text-sm hover:text-primary-600 transition-colors"
            >
              View Map
            </button>
          )}
        </div>

        {recentReports.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="icon-container-lg bg-primary/10 mx-auto mb-4">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-semibold text-text mb-2">
              No reports yet
            </h4>
            <p className="text-muted text-sm">
              Your first report will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentReports.map((report) => {
              const severity = severityConfig[report.result.severity];
              const SeverityIcon = severity.icon;

              return (
                <div
                  key={report.id}
                  onClick={() => onViewReport(report)}
                  className="card card-hover p-4 cursor-pointer animate-fade-in-up"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={report.image}
                        alt="Waste report"
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-surface rounded-full flex items-center justify-center border-2 border-surface shadow-sm">
                        <SeverityIcon className={`w-3 h-3 ${severity.color}`} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`badge ${severity.bgColor} ${severity.color} border ${severity.borderColor}`}
                        >
                          {report.result.severity}
                        </span>
                        <div className="flex items-center gap-1 text-muted text-xs">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(report.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-text text-sm line-clamp-2 mb-2">
                        {report.result.reason}
                      </p>

                      {report.location && (
                        <div className="flex items-center gap-1 text-muted text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>Location captured</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
