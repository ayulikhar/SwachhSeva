
import React, { useState, useRef, useEffect } from 'react';
import { analyzeWasteImage } from '../services/geminiService';
import { AnalysisResult, Severity, WasteReport } from '../types';

// Declare L for Leaflet global
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

  // Effect to attach stream to video element when it becomes available
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
      // We set active to true, which triggers the render of the video element
      // The useEffect above will handle attaching the stream once it's mounted
      setIsCameraActive(true);
    } catch (err) {
      setError('Camera access denied or unavailable. Please check your browser permissions.');
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

  // Cleanup on unmount
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
    
    // Ensure canvas dimensions match video
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
      setError('AI Analysis failed. Please check your internet connection and try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Initialize Map Picker when showing the map modal
  useEffect(() => {
    if (showMapPicker && pickerMapRef.current && !mapInstanceRef.current) {
      const initMap = async () => {
        const defaultLoc = await getLocation() || { lat: 0, lng: 0 };
        setPickerLocation(defaultLoc);

        const map = L.map(pickerMapRef.current, {
          center: [defaultLoc.lat, defaultLoc.lng],
          zoom: 16,
          zoomControl: false,
          attributionControl: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: '<div style="background-color: #059669; width: 24px; height: 24px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([defaultLoc.lat, defaultLoc.lng], { icon, draggable: true }).addTo(map);
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
      }
    };
  }, [showMapPicker]);

  return (
    <div className="flex flex-col items-center p-4 min-h-[70vh] relative">
      <div className="w-full max-w-sm relative">
        {/* Camera Feed / Preview Container */}
        <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 border-4 border-white relative transition-all duration-500">
          {isCameraActive ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : previewUrl ? (
            <img src={previewUrl} className="w-full h-full object-cover" alt="Captured Waste" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-800">
              <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Ready to Scan</h3>
              <p className="text-sm opacity-60 px-4">Help keep our streets clean by documenting roadside waste.</p>
            </div>
          )}

          {/* Analysis Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-md flex flex-col items-center justify-center text-white p-8 z-20 animate-in fade-in duration-300">
              <div className="relative mb-8">
                <div className="w-24 h-24 border-[6px] border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-10 h-10 text-emerald-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">ANALYZING</h3>
              <div className="h-1 w-32 bg-emerald-400/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 animate-[loading_1.5s_ease-in-out_infinite]"></div>
              </div>
              <p className="text-[10px] text-emerald-200 mt-6 uppercase tracking-[0.2em] font-black opacity-80 text-center">
                Gemini AI assessing severity...
              </p>
            </div>
          )}
        </div>

        {/* Hidden Elements */}
        <canvas ref={canvasRef} className="hidden" />
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileUpload}
        />

        {/* Floating Action Button (Gallery) */}
        {!isCameraActive && !isAnalyzing && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute -right-2 top-10 w-16 h-16 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all z-30 border-4 border-white group hover:bg-emerald-400"
            title="Upload from Gallery"
          >
            <svg className="w-7 h-7 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          {!isCameraActive && !previewUrl ? (
            <button 
              onClick={startCamera}
              className="px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-200 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-widest text-sm hover:bg-emerald-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              Start Scanning
            </button>
          ) : isCameraActive ? (
            <div className="fixed bottom-24 left-0 right-0 flex justify-center items-center gap-12 z-50 px-8 animate-in slide-in-from-bottom-10">
               <button 
                onClick={stopCamera}
                className="w-14 h-14 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 active:scale-90 transition-transform"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <button 
                onClick={capturePhoto}
                className="w-24 h-24 bg-white rounded-full p-1.5 shadow-2xl active:scale-90 transition-transform ring-4 ring-white/20"
              >
                <div className="w-full h-full rounded-full border-[6px] border-slate-100 flex items-center justify-center">
                  <div className="w-14 h-14 bg-emerald-500 rounded-full shadow-inner animate-pulse"></div>
                </div>
              </button>

              <div className="w-14 h-14"></div>
            </div>
          ) : null}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-rose-50 text-rose-700 rounded-2xl flex items-center gap-3 border border-rose-200 animate-in fade-in slide-in-from-bottom-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm font-bold tracking-tight">{error}</span>
          </div>
        )}
      </div>

      {/* Location Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {!showMapPicker ? (
              <div className="p-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 ring-4 ring-emerald-50/50">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Tag Location</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
                  Select how you'd like to mark this spot. High-accuracy tagging ensures cleanup crews find it quickly.
                </p>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => pendingImage && handleAnalysis(pendingImage)}
                    className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-emerald-200 hover:bg-emerald-700"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Use Current GPS
                  </button>
                  <button 
                    onClick={() => setShowMapPicker(true)}
                    className="w-full py-5 bg-slate-100 text-slate-700 rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-slate-200"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l5-2.5 5.553 2.776a1 1 0 01.447.894v10.764a1 1 0 01-1.447.894L14 17l-5 3z" />
                    </svg>
                    Pin Manually
                  </button>
                  <button 
                    onClick={() => { setShowLocationModal(false); setPendingImage(null); }}
                    className="mt-2 py-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600"
                  >
                    Discard Scan
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-[550px]">
                <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-slate-800 tracking-tight text-lg">Pin Location</h4>
                    <p className="text-[10px] text-emerald-600 uppercase font-black tracking-widest">DRAG PIN TO CENTER</p>
                  </div>
                  <button 
                    onClick={() => setShowMapPicker(false)}
                    className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div ref={pickerMapRef} className="flex-grow bg-slate-100" />
                <div className="p-6 bg-white border-t border-slate-50">
                  <button 
                    onClick={() => pendingImage && pickerLocation && handleAnalysis(pendingImage, pickerLocation)}
                    className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-emerald-200 active:scale-95 transition-all uppercase tracking-widest text-sm"
                  >
                    Set Pin Location
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Styles for specific animations */}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* Bottom decorative bar */}
      {!isCameraActive && (
        <div className="mt-auto pt-10 text-center opacity-30 select-none pb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">EcoSense Sanitation Protocol v2.5</p>
        </div>
      )}
    </div>
  );
};