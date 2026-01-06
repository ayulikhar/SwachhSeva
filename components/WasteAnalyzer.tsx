
import React, { useState, useRef, useEffect } from 'react';
import { analyzeWasteImage } from '../services/geminiService';
import { AnalysisResult, Severity, WasteReport } from '../types';

declare const L: any;

interface Props {
  onNewReport: (report: WasteReport) => void;
}

export const WasteAnalyzer: React.FC<Props> = ({ onNewReport }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [pickerLocation, setPickerLocation] = useState<{ lat: number, lng: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pickerMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      setError('Camera access denied or unavailable.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.85);
      setPreviewUrl(base64Image);
      stopCamera();
      setPendingImage(base64Image);
      setShowLocationModal(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPendingImage(base64);
      setShowLocationModal(true);
    };
    reader.readAsDataURL(file);
  };

  const getLocation = (): Promise<{lat: number, lng: number} | undefined> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(undefined);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(undefined),
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  };

  const handleAnalysis = async (dataUrl: string, manualLocation?: {lat: number, lng: number}) => {
    setIsAnalyzing(true);
    setError(null);
    setShowLocationModal(false);
    setShowMapPicker(false);
    try {
      const base64String = dataUrl.split(',')[1];
      const location = manualLocation || await getLocation();
      const result = await analyzeWasteImage(base64String, 'image/jpeg');
      const report: WasteReport = {
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        image: dataUrl,
        result: result,
        location: location
      };
      onNewReport(report);
      setPreviewUrl(null);
      setPendingImage(null);
    } catch (err) {
      setError('AI Analysis failed. Try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (showMapPicker && pickerMapRef.current && !mapInstanceRef.current) {
      const initMap = async () => {
        const defaultLoc = await getLocation() || { lat: 20.5937, lng: 78.9629 };
        setPickerLocation(defaultLoc);
        const map = L.map(pickerMapRef.current, {
          center: [defaultLoc.lat, defaultLoc.lng],
          zoom: 17,
          zoomControl: false,
          attributionControl: false
        });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
        const pinIcon = L.divIcon({
          className: 'manual-pin-marker',
          html: `<div class="bg-emerald-600 w-8 h-8 rounded-full border-4 border-white shadow-lg"></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        const marker = L.marker([defaultLoc.lat, defaultLoc.lng], { icon: pinIcon, draggable: true }).addTo(map);
        markerRef.current = marker;
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          setPickerLocation({ lat: pos.lat, lng: pos.lng });
        });
        mapInstanceRef.current = map;
      };
      initMap();
    }
  }, [showMapPicker]);

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Content wrapper - forced vertical alignment and centering */}
      <div className={`relative flex flex-col items-center w-full transition-all duration-700 ${isCameraActive ? 'max-w-4xl h-full sm:h-auto aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-slate-800' : 'max-w-xl'}`}>
        
        {/* Main Display Viewport */}
        <div className="relative w-full flex flex-col items-center justify-center">
          {isCameraActive ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : previewUrl ? (
            <img src={previewUrl} className="w-full object-cover rounded-[3rem] shadow-2xl" alt="Captured Waste" />
          ) : (
            <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-1000">
               <div className="relative mb-6 sm:mb-10">
                 <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-[60px] animate-pulse"></div>
                 <div className="relative w-28 h-28 sm:w-40 sm:h-40 bg-white rounded-[2.5rem] sm:rounded-[3.5rem] flex items-center justify-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 transition-all duration-500 transform hover:scale-105">
                    <svg className="w-16 h-16 sm:w-24 sm:h-24 text-emerald-600 overflow-visible" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.2} 
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                      />
                      <circle cx="12" cy="13" r="3" strokeWidth={1.2} />
                    </svg>
                 </div>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight mb-4">Ready to Scan</h1>
              <p className="text-slate-400 font-medium leading-relaxed max-w-sm text-sm sm:text-lg mb-8 sm:mb-10">
                Report roadside waste clusters with AI. Automated sanitation routing starts with a single snap.
              </p>
            </div>
          )}

          {/* Neural Scan Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-3xl flex flex-col items-center justify-center text-white z-[60] animate-in fade-in duration-300">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-10">
                <div className="absolute inset-0 border-[6px] border-emerald-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-[6px] border-t-emerald-400 rounded-full animate-spin"></div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-3 uppercase italic">Analyzing Site</h3>
              <p className="text-[11px] font-black tracking-[0.5em] text-emerald-400/80 uppercase">Computing Hygiene Risk Index</p>
            </div>
          )}
        </div>

        {/* Action Controls - Integrated into the central stack */}
        <div className={`w-full max-w-md ${isCameraActive ? 'absolute bottom-8 left-0 right-0 px-8 z-40' : ''}`}>
           {!isCameraActive && !previewUrl && !isAnalyzing && (
              <div className="flex items-center gap-4 sm:gap-6 animate-in slide-in-from-bottom-8 duration-700">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-white text-slate-500 rounded-3xl flex items-center justify-center active:scale-90 transition-all shadow-[0_12px_40px_-8px_rgba(0,0,0,0.06)] border border-slate-100 hover:bg-slate-50 hover:text-slate-800"
                  title="Upload Image"
                >
                  <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
                  </svg>
                </button>
                <button 
                  onClick={startCamera}
                  className="flex-grow py-5 sm:py-7 bg-emerald-600 text-white rounded-3xl font-black shadow-[0_24px_48px_-12px_rgba(16,185,129,0.35)] active:scale-95 hover:bg-emerald-500 transition-all flex items-center justify-center uppercase tracking-[0.15em] text-sm sm:text-base"
                >
                  Launch Scanner
                </button>
              </div>
           )}

           {isCameraActive && (
              <div className="flex items-center justify-between animate-in slide-in-from-bottom-10">
                 <button onClick={stopCamera} className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-colors">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6" /></svg>
                 </button>
                 <button onClick={capturePhoto} className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full p-2 shadow-2xl active:scale-90 transition-transform group">
                    <div className="w-full h-full rounded-full border-4 border-slate-100 flex items-center justify-center group-hover:border-slate-300 transition-colors">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500 rounded-full shadow-inner"></div>
                    </div>
                 </button>
                 <div className="w-14 h-14 sm:w-16 sm:h-16 opacity-0" />
              </div>
           )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Location Confirmation Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-2xl">
          <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10">
            {!showMapPicker ? (
              <div className="p-10 sm:p-14 space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-2">Tag Location</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">Please verify where this report was taken.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <button onClick={() => pendingImage && handleAnalysis(pendingImage)} className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-50 active:scale-95 transition-all">My Current Position</button>
                  <button onClick={() => setShowMapPicker(true)} className="w-full py-6 bg-slate-100 text-slate-700 rounded-2xl font-black active:scale-95 transition-all">Pick From Map</button>
                  <button onClick={() => { setShowLocationModal(false); setPendingImage(null); setPreviewUrl(null); }} className="pt-2 text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-rose-500 text-center transition-colors">Discard and Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-[600px] max-h-[85vh]">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h4 className="font-black text-xl text-slate-800 tracking-tight">Manual Pinpoint</h4>
                  <button onClick={() => setShowMapPicker(false)} className="w-12 h-12 bg-slate-50 rounded-2xl text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">×</button>
                </div>
                <div ref={pickerMapRef} className="flex-grow bg-slate-50" />
                <div className="p-10">
                  <button onClick={() => pendingImage && pickerLocation && handleAnalysis(pendingImage, pickerLocation)} className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-50">Confirm Site Position</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-10 right-10 left-10 md:left-auto md:w-96 z-[70] p-6 bg-white text-rose-600 rounded-[2rem] border border-rose-50 shadow-[0_30px_60px_-12px_rgba(225,29,72,0.15)] flex items-center gap-5 animate-in slide-in-from-right-10">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4" /></svg>
          </div>
          <div className="flex-grow">
            <p className="text-xs font-black uppercase tracking-widest text-rose-400 mb-0.5">System Error</p>
            <p className="text-sm font-bold text-slate-700">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-slate-300 hover:text-slate-500 text-2xl font-light px-2">×</button>
        </div>
      )}
    </div>
  );
};