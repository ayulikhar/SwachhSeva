import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import { WasteReport, Severity } from "../types";
import { Layers, Navigation } from "lucide-react";

interface Props {
  reports: WasteReport[];
}

type MapLayerType = "standard" | "satellite";
type FilterType = Severity | "ALL";

export const MapView: React.FC<Props> = ({ reports }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const baseLayersRef = useRef<Record<MapLayerType, L.TileLayer>>({} as any);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [layerType, setLayerType] = useState<MapLayerType>("standard");
  const [isLocating, setIsLocating] = useState(false);

  /* ================= INIT MAP ================= */
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialCenter: [number, number] =
      reports[0]?.location
        ? [reports[0].location.lat, reports[0].location.lng]
        : [20.5937, 78.9629]; // India default

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: reports.length ? 13 : 5,
      zoomControl: false,
      attributionControl: false
    });

    baseLayersRef.current.standard = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 20 }
    );

    baseLayersRef.current.satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19 }
    );

    baseLayersRef.current.standard.addTo(map);
    mapRef.current = map;

    locateUser();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* ================= USER LOCATION ================= */
  const locateUser = (center = false) => {
    if (!navigator.geolocation) return;

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setIsLocating(false);

        if (center && mapRef.current) {
          mapRef.current.flyTo([loc.lat, loc.lng], 16, { duration: 1.2 });
        }
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  /* ================= USER MARKER ================= */
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      return;
    }

    const icon = L.divIcon({
      html: `
        <div class="relative">
          <div class="absolute w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
          <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
        </div>
      `,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    userMarkerRef.current = L.marker(
      [userLocation.lat, userLocation.lng],
      { icon, zIndexOffset: 1000 }
    ).addTo(mapRef.current);
  }, [userLocation]);

  /* ================= BASE LAYER SWITCH ================= */
  useEffect(() => {
    if (!mapRef.current) return;

    Object.values(baseLayersRef.current).forEach(layer => {
      if (mapRef.current!.hasLayer(layer)) {
        mapRef.current!.removeLayer(layer);
      }
    });

    baseLayersRef.current[layerType].addTo(mapRef.current);
  }, [layerType]);

  /* ================= REPORT MARKERS ================= */
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const visibleReports =
      filter === "ALL"
        ? reports
        : reports.filter(r => r.result.severity === filter);

    visibleReports.forEach(report => {
      if (!report.location) return;

      const color =
        report.result.severity === Severity.HIGH
          ? "#E11D48"
          : report.result.severity === Severity.MEDIUM
          ? "#F59E0B"
          : "#10B981";

      const icon = L.divIcon({
        html: `<div style="
          background:${color};
          width:22px;
          height:22px;
          border-radius:50%;
          border:3px solid white;
          box-shadow:0 4px 10px rgba(0,0,0,.25)
        "></div>`,
        className: "",
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker(
        [report.location.lat, report.location.lng],
        { icon }
      ).addTo(mapRef.current!);

      marker.bindPopup(`
        <div class="overflow-hidden rounded-xl">
          <img src="${report.image}" class="w-full h-24 object-cover"/>
          <div class="p-2">
            <p class="text-[10px] font-black uppercase text-slate-400 mb-1">
              ${report.result.severity} urgency
            </p>
            <p class="text-xs text-slate-700">
              ${report.result.reason}
            </p>
          </div>
        </div>
      `);

      markersRef.current.push(marker);
    });
  }, [reports, filter]);

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-bg pb-safe">
      <div className="relative w-full h-[70vh] md:h-[75vh] rounded-2xl overflow-hidden bg-slate-100 mx-auto max-w-md">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        {/* FILTER */}
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-1 flex shadow-medium border border-primary-100">
            {["ALL", Severity.HIGH, Severity.MEDIUM, Severity.LOW].map(level => (
              <button
                key={level}
                onClick={() => setFilter(level as FilterType)}
                className={`flex-1 px-3 py-2 text-[10px] font-black uppercase rounded-xl transition-all duration-200
                  ${filter === level
                    ? "bg-primary-600 text-white shadow-soft"
                    : "text-slate-500 hover:bg-primary-50 hover:text-primary-600"
                  }`}
              >
                {level === "ALL" ? "All" : level}
              </button>
            ))}
          </div>
        </div>

        {/* MAP STYLE */}
        <button
          onClick={() =>
            setLayerType(layerType === "standard" ? "satellite" : "standard")
          }
          className="absolute bottom-6 left-6 z-20 w-14 h-14 rounded-2xl bg-white shadow-large flex items-center justify-center hover:scale-110 transition-all duration-200 border border-primary-100"
        >
          <Layers className="w-6 h-6 text-primary-600" />
        </button>

        {/* LOCATE */}
        <button
          onClick={() => locateUser(true)}
          disabled={isLocating}
          className="absolute bottom-6 right-6 z-20 w-14 h-14 rounded-2xl bg-gradient-primary shadow-large flex items-center justify-center hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Navigation
            className={`w-6 h-6 text-white ${
              isLocating ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
};
