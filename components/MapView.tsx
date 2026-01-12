import React, { useEffect, useRef, useState } from "react";
import { analyzeWasteImage } from "../services/geminiService";
import { Severity, WasteReport } from "../types";

declare const L: any;

interface Props {
  onNewReport: (report: WasteReport) => void;
}

export const WasteAnalyzer: React.FC<Props> = ({ onNewReport }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pickerMapRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [manualLocation, setManualLocation] = useState<{ lat: number; lng: number } | null>(null);

  /* ================= CAMERA ================= */

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch {
      setError("Camera access denied.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setIsCameraOn(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
      mapRef.current?.remove();
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/jpeg", 0.85);
    setPreview(image);
    setPendingImage(image);
    stopCamera();
    setShowLocationModal(true);
  };

  /* ================= FILE UPLOAD ================= */

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = reader.result as string;
      setPreview(img);
      setPendingImage(img);
      setShowLocationModal(true);
    };
    reader.readAsDataURL(file);
  };

  /* ================= LOCATION ================= */

  const getCurrentLocation = (): Promise<{ lat: number; lng: number } | undefined> =>
    new Promise(resolve => {
      navigator.geolocation?.getCurrentPosition(
        p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve(undefined),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });

  /* ================= ANALYSIS ================= */

  const runAnalysis = async (image: string, location?: { lat: number; lng: number }) => {
    setIsAnalyzing(true);
    setShowLocationModal(false);

    try {
      const base64 = image.split(",")[1];
      const result = await analyzeWasteImage(base64, "image/jpeg");
      const report: WasteReport = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        image,
        result,
        location: location || (await getCurrentLocation())
      };
      onNewReport(report);
      setPreview(null);
      setPendingImage(null);
    } catch {
      setError("AI analysis failed. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* ================= MAP PICKER ================= */

  useEffect(() => {
    if (!showMapPicker || !pickerMapRef.current || mapRef.current) return;

    (async () => {
      const loc = (await getCurrentLocation()) || { lat: 20.5937, lng: 78.9629 };
      setManualLocation(loc);

      const map = L.map(pickerMapRef.current, {
        center: [loc.lat, loc.lng],
        zoom: 17,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png").addTo(map);

      const marker = L.marker([loc.lat, loc.lng], { draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const p = marker.getLatLng();
        setManualLocation({ lat: p.lat, lng: p.lng });
      });

      mapRef.current = map;
      markerRef.current = marker;
    })();
  }, [showMapPicker]);

  /* ================= UI ================= */

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xl space-y-8">

        {/* CAMERA / PREVIEW */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-100 shadow-lg">
          {isCameraOn ? (
            <video ref={videoRef} autoPlay playsInline className="w-full h-[55vh] object-cover" />
          ) : preview ? (
            <img src={preview} className="w-full h-[55vh] object-cover" />
          ) : (
            <div className="h-[45vh] flex flex-col items-center justify-center text-center px-6">
              <h1 className="text-3xl font-black text-slate-800 mb-3">Ready to Scan</h1>
              <p className="text-slate-500">Capture or upload a waste image</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
              <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-black tracking-widest text-sm">ANALYZING</p>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        {!isCameraOn && !preview && (
          <div className="flex gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-4 bg-white rounded-2xl shadow border font-bold"
            >
              Upload
            </button>
            <button
              onClick={startCamera}
              className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black"
            >
              Camera
            </button>
          </div>
        )}

        {isCameraOn && (
          <div className="flex justify-between px-4">
            <button onClick={stopCamera} className="text-slate-500 font-bold">Cancel</button>
            <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-full shadow-xl" />
            <div className="w-10" />
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      {/* LOCATION MODAL */}
      {showLocationModal && pendingImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4">
            {!showMapPicker ? (
              <>
                <h3 className="text-xl font-black text-center">Confirm Location</h3>
                <button
                  onClick={() => runAnalysis(pendingImage)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black"
                >
                  Use Current Location
                </button>
                <button
                  onClick={() => setShowMapPicker(true)}
                  className="w-full py-4 bg-slate-100 rounded-xl font-bold"
                >
                  Pick on Map
                </button>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="block w-full text-center text-slate-400 text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div ref={pickerMapRef} className="h-64 rounded-xl overflow-hidden" />
                <button
                  onClick={() => manualLocation && runAnalysis(pendingImage, manualLocation)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black"
                >
                  Confirm Location
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:w-96 bg-white p-4 rounded-xl shadow-lg border text-rose-600 z-50">
          <p className="font-bold">{error}</p>
          <button onClick={() => setError(null)} className="mt-2 text-sm text-slate-400">Dismiss</button>
        </div>
      )}
    </div>
  );
};
