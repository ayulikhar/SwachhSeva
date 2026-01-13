import { useReports } from "@/hooks/use-reports";
import { Header } from "@/components/Header";
import { Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { SEVERITY_COLORS, SEVERITY_LABELS } from "@/lib/utils";

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapPage() {
  const { data: reports, isLoading } = useReports();
  
  // Default center (New Delhi)
  const center = { lat: 28.6139, lng: 77.2090 };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <Header />
      
      <div className="flex-1 relative z-0">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <MapContainer 
            center={[center.lat, center.lng]} 
            zoom={13} 
            scrollWheelZoom={true}
            className="w-full h-full"
            style={{ minHeight: "calc(100vh - 160px)" }} // Adjust based on header/nav
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports?.map((report) => (
              report.latitude && report.longitude && (
                <Marker 
                  key={report.id} 
                  position={[report.latitude, report.longitude]}
                >
                  <Popup className="rounded-xl overflow-hidden">
                    <div className="p-1 min-w-[200px]">
                      <div className="h-24 w-full rounded-lg overflow-hidden mb-2 bg-gray-100">
                         <img src={report.imageUrl} alt={report.category} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-bold text-sm mb-1">{report.category}</h3>
                      <div className={`text-[10px] inline-block px-2 py-0.5 rounded-full border mb-1 ${SEVERITY_COLORS[report.severity as keyof typeof SEVERITY_COLORS]}`}>
                        {SEVERITY_LABELS[report.severity as keyof typeof SEVERITY_LABELS]}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        )}
        
        {/* Floating Info Card */}
        <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 z-[400] pointer-events-none">
          <h2 className="font-bold text-emerald-900 text-sm">Waste Hotspots</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Red markers indicate critical waste accumulation areas needing immediate attention.
          </p>
        </div>
      </div>
    </div>
  );
}
