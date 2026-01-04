
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
  const userDotRef = useRef<any>(null);

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
        const defaultLoc = await getLocation() || { lat: 0, lng: 0 };
        setPickerLocation(defaultLoc);
        
        const map = L.map(pickerMapRef.current, {
          center: [defaultLoc.lat, defaultLoc.lng],
          zoom: 17,
          zoomControl: false,
          attributionControl: false
        });
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

        const userIcon = L.divIcon({
          className: 'user-location-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-6 h-6 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
              <div class="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg z-10"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        userDotRef.current = L.marker([defaultLoc.lat, defaultLoc.lng], { icon: userIcon, zIndexOffset: 500 }).addTo(map);

        const pinIcon = L.divIcon({
          className: 'manual-pin-marker',
          html: `
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 bg-emerald-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center -translate-y-4">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="w-1 h-2 bg-emerald-600 -mt-4 shadow-sm"></div>
            </div>
          `,
          iconSize: [40, 48],
          iconAnchor: [20, 48]
        });

        const marker = L.marker([defaultLoc.lat, defaultLoc.lng], { 
          icon: pinIcon, 
          draggable: true,
          zIndexOffset: 1000 
        }).addTo(map);
        
        markerRef.current = marker;

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          setPickerLocation({ lat: pos.lat, lng: pos.lng });
        });

        map.on('click', (e: any) => {
          marker.setLatLng(e.latlng);
          setPickerLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        });

        mapInstanceRef.current = map;
      };
      initMap();
    }
    return () => {
      if (!showMapPicker && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        userDotRef.current = null;
      }
    };
  }, [showMapPicker]);

  const analyzerStyles = `
    @keyframes loading-anim {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-loading { animation: loading-anim 1.5s ease-in-out infinite; }
    .user-location-marker { pointer-events: none; }
    
    .analyzer-container {
      height: calc(100vh - env(safe-area-inset-bottom));
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  `;

  return (
    <div className="analyzer-container flex flex-col bg-slate-50 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: analyzerStyles }} />
      
      <div className="flex-grow relative w-full h-full overflow-hidden">
        {isCameraActive ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        ) : previewUrl ? (
          <img src={previewUrl} className="w-full h-full object-cover" alt="Captured Waste" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 px-8 text-center animate-in fade-in duration-1000">
            <div className="relative mb-12">
               <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
               <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100">
                  <svg className="w-16 h-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3" strokeWidth={1} />
                  </svg>
               </div>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-4">Ready to Scan</h1>
            <p className="text-slate-500 font-medium leading-relaxed max-w-xs">
              Keep your neighborhood clean. Snap a photo of waste to report it for pickup.
            </p>
            
            <div className="mt-16 text-center opacity-30 select-none">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">v2.5 Protocol</p>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xl flex flex-col items-center justify-center text-white p-8 z-[60] animate-in fade-in duration-300">
            <div className="relative mb-8">
              <div className="w-24 h-24 border-[6px] border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">ANALYZING</h3>
            <div className="h-1 w-32 bg-emerald-400/20 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 animate-loading"></div>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-400/60">Processing Neural Nets</p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />

      <div className="fixed bottom-32 left-0 right-0 px-6 z-50 pointer-events-none">
        <div className="max-w-md mx-auto flex items-center justify-center gap-4 pointer-events-auto">
          {!isCameraActive && !previewUrl && !isAnalyzing && (
            <>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 bg-white text-slate-600 rounded-2xl shadow-xl flex items-center justify-center active:scale-90 transition-all border border-slate-100"
                aria-label="Upload photo"
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              <button 
                onClick={startCamera}
                className="flex-grow py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all flex items-center justify-center uppercase tracking-widest text-sm"
              >
                Start Scan
              </button>
            </>
          )}

          {isCameraActive && (
            <div className="flex items-center gap-10 animate-in slide-in-from-bottom-10 duration-500">
               <button onClick={stopCamera} className="w-14 h-14 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
               <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-full p-1 shadow-2xl active:scale-90 transition-transform">
                  <div className="w-full h-full rounded-full border-4 border-slate-100 flex items-center justify-center">
                    <div className="w-14 h-14 bg-emerald-500 rounded-full"></div>
                  </div>
               </button>
               <div className="w-14 h-14 opacity-0 pointer-events-none"></div>
            </div>
          )}
        </div>
      </div>

      {showLocationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl">
            {!showMapPicker ? (
              <div className="p-8">
                <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Tag Location</h3>
                <p className="text-slate-500 text-sm mb-8 font-medium">Where was this photo taken?</p>
                <div className="flex flex-col gap-4">
                  <button onClick={() => pendingImage && handleAnalysis(pendingImage)} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black active:scale-95 transition-all">Use My GPS</button>
                  <button onClick={() => setShowMapPicker(true)} className="w-full py-5 bg-slate-100 text-slate-700 rounded-2xl font-black active:scale-95 transition-all">Pin Manually</button>
                  <button onClick={() => { setShowLocationModal(false); setPendingImage(null); setPreviewUrl(null); }} className="mt-2 py-2 text-slate-400 font-bold text-xs uppercase tracking-widest">Discard</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-[550px]">
                <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-slate-800 text-lg">Pin Location</h4>
                    <p className="text-[10px] text-emerald-600 uppercase font-black tracking-widest">DRAG PIN TO SPOT</p>
                  </div>
                  <button onClick={() => setShowMapPicker(false)} className="p-3 bg-slate-50 rounded-xl text-slate-400"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div ref={pickerMapRef} className="flex-grow bg-slate-100" />
                <div className="p-6 bg-white border-t border-slate-50">
                  <button onClick={() => pendingImage && pickerLocation && handleAnalysis(pendingImage, pickerLocation)} className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black active:scale-95 transition-all">Confirm Location</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-20 left-6 right-6 z-[70] p-4 bg-rose-50 text-rose-700 rounded-2xl flex items-center gap-3 border border-rose-200 shadow-lg animate-in slide-in-from-top-4">
          <span className="text-sm font-bold">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-rose-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};