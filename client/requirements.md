## Packages
react-leaflet | For the map visualization feature
leaflet | Core mapping library required by react-leaflet
@types/leaflet | TypeScript definitions for leaflet
recharts | For the impact dashboard charts in Profile
framer-motion | For smooth page transitions and UI animations
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind CSS classes safely

## Notes
The map feature relies on OpenStreetMap tiles.
The camera functionality uses standard HTML5 file input with capture="environment" for broad mobile compatibility.
AI Analysis is handled by the backend endpoint /api/analyze.
