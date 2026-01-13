import { useReports } from "@/hooks/use-reports";
import { Header } from "@/components/Header";
import { Loader2, MapPin, Calendar, AlertCircle } from "lucide-react";
import { SEVERITY_COLORS, SEVERITY_LABELS } from "@/lib/utils";
import { motion } from "framer-motion";

export default function History() {
  const { data: reports, isLoading, error } = useReports();

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <main className="max-w-md mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold text-emerald-950 px-2">Recent Reports</h2>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">
            <AlertCircle className="w-10 h-10 mx-auto mb-4" />
            <p>Failed to load reports.</p>
          </div>
        ) : reports?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground bg-white/50 rounded-3xl border border-dashed border-emerald-200">
            <p>No reports submitted yet.</p>
            <p className="text-sm mt-2">Start by analyzing some waste!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports?.map((report, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={report.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow flex gap-4 overflow-hidden"
              >
                <div className="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                  <img 
                    src={report.imageUrl} 
                    alt={report.category} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-foreground truncate pr-2">{report.category}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border flex-shrink-0 ${SEVERITY_COLORS[report.severity as keyof typeof SEVERITY_COLORS]}`}>
                      {report.severity}
                    </span>
                  </div>
                  
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center text-xs text-muted-foreground truncate">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{report.location}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span>{new Date(report.createdAt!).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
