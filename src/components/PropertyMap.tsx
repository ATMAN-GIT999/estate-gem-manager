import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom green marker SVG
const greenMarkerSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
    <path fill="#6B8E23" d="M12 0C7.8 0 4.5 3.3 4.5 7.5c0 5.3 7.5 16.5 7.5 16.5s7.5-11.2 7.5-16.5C19.5 3.3 16.2 0 12 0zm0 11c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
  </svg>
`;

const customIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(greenMarkerSvg)}`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  propertyName: string;
  nearbyAmenities?: Array<{ name: string; distance: string; type: string }>;
}

const PropertyMap = ({ latitude, longitude, propertyName, nearbyAmenities = [] }: PropertyMapProps) => {
  const center: [number, number] = [latitude, longitude];

  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden border border-border shadow-soft h-[400px]">
        <MapContainer
          center={center}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <Marker position={center} icon={customIcon}>
            <Popup>
              <div className="font-semibold">{propertyName}</div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {nearbyAmenities.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {nearbyAmenities.map((amenity, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-sage/10 border border-sage/20 hover:bg-sage/20 transition-colors"
            >
              <div className="font-medium text-sm text-foreground">{amenity.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{amenity.distance}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
