import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Camera, Upload, X, Check, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useAnalyzeWaste, useCreateReport } from "@/hooks/use-reports";
import { convertBlobToBase64, SEVERITY_COLORS, SEVERITY_LABELS } from "@/lib/utils";
import { Header } from "@/components/Header";
import { type InsertReport } from "@shared/routes";

export default function Analyze() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analyzeMutation = useAnalyzeWaste();
  const createReportMutation = useCreateReport();
  const [, setLocation] = useLocation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await convertBlobToBase64(file);
        setImagePreview(base64);
        analyzeMutation.reset(); // Clear previous analysis
      } catch (err) {
        console.error("Error converting file:", err);
      }
    }
  };

  const handleAnalyze = () => {
    if (imagePreview) {
      analyzeMutation.mutate(imagePreview);
    }
  };

  const handleSubmitReport = () => {
    if (imagePreview && analyzeMutation.data) {
      // Mock location for MVP - in a real app use navigator.geolocation
      const mockLocation = { latitude: 28.6139, longitude: 77.2090, location: "Connaught Place, New Delhi" };
      
      const reportData: InsertReport = {
        imageUrl: imagePreview,
        category: analyzeMutation.data.category,
        severity: analyzeMutation.data.severity,
        description: analyzeMutation.data.description,
        latitude: mockLocation.latitude,
        longitude: mockLocation.longitude,
        location: mockLocation.location,
        status: "pending",
        metadata: {}
      };

      createReportMutation.mutate(reportData, {
        onSuccess: () => {
          setLocation("/history");
        }
      });
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    analyzeMutation.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <main className="max-w-md mx-auto p-6 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-emerald-950">Report Waste</h2>
          <p className="text-muted-foreground">Snap a photo to analyze severity and location.</p>
        </div>

        {/* Camera/Image Section */}
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 bg-white border border-border/50 group">
          <AnimatePresence mode="wait">
            {!imagePreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6"
              >
                <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center shadow-inner">
                  <Camera className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-3 w-full">
                  <Button 
                    className="w-full gap-2" 
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.setAttribute("capture", "environment");
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <Camera className="w-4 h-4" />
                    Open Camera
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.removeAttribute("capture");
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    Upload from Gallery
                  </Button>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative h-full w-full"
              >
                <img 
                  src={imagePreview} 
                  alt="Captured waste" 
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                <Button
                  size="icon"
                  variant="glass"
                  className="absolute top-4 right-4 rounded-full w-10 h-10 hover:bg-destructive hover:text-white border-0"
                  onClick={clearImage}
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Analysis Result Card Overlay */}
                {analyzeMutation.data && (
                  <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Detected</span>
                        <h3 className="text-lg font-bold text-foreground">{analyzeMutation.data.category}</h3>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${SEVERITY_COLORS[analyzeMutation.data.severity]}`}>
                        {SEVERITY_LABELS[analyzeMutation.data.severity]}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {analyzeMutation.data.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 mb-0">
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                      Wait for admin verification
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        {imagePreview && !analyzeMutation.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button 
              className="w-full h-14 text-lg shadow-xl shadow-primary/30" 
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending}
            >
              {analyzeMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Waste
                </>
              )}
            </Button>
          </motion.div>
        )}

        {analyzeMutation.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button 
              className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/30" 
              onClick={handleSubmitReport}
              disabled={createReportMutation.isPending}
            >
              {createReportMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
