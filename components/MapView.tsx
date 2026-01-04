
import React, { useEffect, useRef, useState } from 'react';
import { WasteReport, Severity } from '../types';

// Declare L for Leaflet global
declare const L: any;

interface Props {
  reports: WasteReport[];
}

export const MapView: React.FC<Props> = ({ reports }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Function to get and set user location
  const updateLocation = (centerMap = false) => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(newLoc);
        setIsLocating(false);
        
        if (centerMap && mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([newLoc.lat, newLoc.lng], 16, {
            duration: 1.5,
            easeLinearity: 0.25
          });
        }
      },
      (err) => {
        console.error('Location error:', err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default to a reasonable view (world or last report)
    const startPos = reports.length > 0 && reports[0].location 
      ? [reports[0].location.lat, reports[0].location.lng] 
      : [0, 0];

    const map = L.map(mapContainerRef.current, {
      center: startPos,
      zoom: reports.length > 0 ? 13 : 2,
      zoomControl: false, 
      attributionControl: false
    });

    // High-quality clean tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;
    
    // Initial location grab
    updateLocation();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update User Marker when location changes
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    const map = mapInstanceRef.current;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
            <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg z-10"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000 // Always on top
      }).addTo(map);
    }
  }, [userLocation]);

  // Update Waste Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    reports.forEach(report => {
      if (!report.location) return;

      const color = report.result.severity === Severity.HIGH ? '#E11D48' : 
                    report.result.severity === Severity.MEDIUM ? '#F59E0B' : '#10B981';

      const customIcon = L.divIcon({
        className: 'waste-marker',
        html: `
          <div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2);"></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([report.location.lat, report.location.lng], { icon: customIcon }).addTo(map);
      
      const popupContent = `
        <div class="flex flex-col overflow-hidden">
          <img src="${report.image}" class="w-full h-24 object-cover" />
          <div class="p-2">
            <p class="text-[10px] font-black uppercase text-slate-400 mb-1">${report.result.severity} URGENCY</p>
            <p class="text-xs text-slate-700 leading-tight">${report.result.reason}</p>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 200, className: 'eco-popup' });
      markersRef.current.push(marker);
    });
  }, [reports]);

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem-4rem)] bg-slate-100 overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Legend Overlay */}
      <div className="absolute top-4 left-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 flex justify-around items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-600"></div>
          <span className="text-[10px] font-bold text-slate-600 uppercase">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
          <span className="text-[10px] font-bold text-slate-600 uppercase">Mid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span className="text-[10px] font-bold text-slate-600 uppercase">Low</span>
        </div>
      </div>

      {/* Locate Me FAB */}
      <button 
        onClick={() => updateLocation(true)}
        disabled={isLocating}
        className={`absolute bottom-6 right-6 w-14 h-14 bg-white text-slate-700 rounded-full shadow-2xl flex items-center justify-center z-20 active:scale-90 transition-all border border-slate-100 ${isLocating ? 'opacity-50' : 'opacity-100'}`}
      >
        <svg className={`w-6 h-6 ${isLocating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      <style>{`
        .leaflet-container { background: #f8fafc !important; }
        .eco-popup .leaflet-popup-content-wrapper { border-radius: 12px; padding: 0; }
        .eco-popup .leaflet-popup-content { margin: 0; width: 180px !important; }
      `}</style>
    </div>
  );
};