
import React, { useEffect, useRef, useState } from 'react';
import { WasteReport, Severity } from '../types';

// Declare L for Leaflet global
declare const L: any;

interface Props {
  reports: WasteReport[];
}

type MapLayerType = 'standard' | 'satellite';

export const MapView: React.FC<Props> = ({ reports }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const baseLayersRef = useRef<{ [key in MapLayerType]?: any }>({});
  
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [filter, setFilter] = useState<Severity | 'ALL'>('ALL');
  const [layerType, setLayerType] = useState<MapLayerType>('standard');

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

    const startPos: [number, number] = reports.length > 0 && reports[0].location 
      ? [reports[0].location.lat, reports[0].location.lng] 
      : [20.5937, 78.9629]; // Default center (India) if no reports

    const map = L.map(mapContainerRef.current, {
      center: startPos,
      zoom: reports.length > 0 ? 13 : 5,
      zoomControl: false, 
      attributionControl: false
    });

    // Define base layers
    baseLayersRef.current.standard = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    });

    baseLayersRef.current.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri'
    });

    // Add initial layer
    baseLayersRef.current.standard.addTo(map);

    mapInstanceRef.current = map;
    updateLocation();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Effect to switch base layers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    
    // Remove all base layers
    Object.values(baseLayersRef.current).forEach((layer: any) => {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    });

    // Add selected layer
    if (baseLayersRef.current[layerType]) {
      baseLayersRef.current[layerType].addTo(map);
    }
  }, [layerType]);

  // Update User Marker
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
        zIndexOffset: 1000
      }).addTo(map);
    }
  }, [userLocation]);

  // Update Waste Markers based on filter
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const filteredReports = filter === 'ALL' 
      ? reports 
      : reports.filter(r => r.result.severity === filter);

    filteredReports.forEach(report => {
      if (!report.location) return;

      const color = report.result.severity === Severity.HIGH ? '#E11D48' : 
                    report.result.severity === Severity.MEDIUM ? '#F59E0B' : '#10B981';

      const customIcon = L.divIcon({
        className: 'waste-marker',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2);"></div>`,
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
  }, [reports, filter]);

  const mapStyles = `
    .leaflet-container { background: ${layerType === 'satellite' ? '#1a202c' : '#f8fafc'} !important; }
    .eco-popup .leaflet-popup-content-wrapper { border-radius: 12px; padding: 0; }
    .eco-popup .leaflet-popup-content { margin: 0; width: 180px !important; }
    .user-location-marker { pointer-events: none; }
  `;

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem-4rem)] bg-slate-100 overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Top Filter Control */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-white/50 flex items-center justify-between overflow-hidden">
          <button 
            onClick={() => setFilter('ALL')}
            className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${filter === 'ALL' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter(Severity.HIGH)}
            className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${filter === Severity.HIGH ? 'bg-rose-600 text-white shadow-md' : 'text-rose-600 hover:bg-rose-50'}`}
          >
            <div className={`w-2 h-2 rounded-full bg-current ${filter === Severity.HIGH ? 'animate-pulse' : ''}`}></div>
            High
          </button>
          <button 
            onClick={() => setFilter(Severity.MEDIUM)}
            className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${filter === Severity.MEDIUM ? 'bg-amber-500 text-white shadow-md' : 'text-amber-600 hover:bg-amber-50'}`}
          >
            <div className="w-2 h-2 rounded-full bg-current"></div>
            Mid
          </button>
          <button 
            onClick={() => setFilter(Severity.LOW)}
            className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${filter === Severity.LOW ? 'bg-emerald-500 text-white shadow-md' : 'text-emerald-600 hover:bg-emerald-50'}`}
          >
            <div className="w-2 h-2 rounded-full bg-current"></div>
            Low
          </button>
        </div>
      </div>

      {/* Layer Switcher (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-3">
        <button 
          onClick={() => setLayerType(layerType === 'standard' ? 'satellite' : 'standard')}
          className="w-14 h-14 bg-white text-slate-700 rounded-2xl shadow-2xl flex flex-col items-center justify-center active:scale-90 transition-all border border-slate-100 overflow-hidden group"
          title="Switch Map Style"
        >
          <div className="relative w-full h-full flex items-center justify-center">
             {layerType === 'standard' ? (
                <div className="flex flex-col items-center">
                  <svg className="w-6 h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 012.5 2.5V17m-6 5c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  <span className="text-[8px] font-black uppercase tracking-tighter">Satellite</span>
                </div>
             ) : (
                <div className="flex flex-col items-center">
                  <svg className="w-6 h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l5-2.5 5.553 2.776a1 1 0 01.447.894v10.764a1 1 0 01-1.447.894L14 17l-5 3z" />
                  </svg>
                  <span className="text-[8px] font-black uppercase tracking-tighter">Standard</span>
                </div>
             )}
          </div>
        </button>
      </div>

      {/* Locate Me FAB (Bottom Right) */}
      <button 
        onClick={() => updateLocation(true)}
        disabled={isLocating}
        className={`absolute bottom-6 right-6 w-14 h-14 bg-white text-slate-700 rounded-full shadow-2xl flex items-center justify-center z-20 active:scale-90 transition-all border border-slate-100 ${isLocating ? 'opacity-50' : 'opacity-100 hover:bg-slate-50'}`}
        title="Find My Location"
      >
        <svg className={`w-6 h-6 ${isLocating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      <style dangerouslySetInnerHTML={{ __html: mapStyles }} />
    </div>
  );
};