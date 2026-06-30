import { useMemo } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Bundlers break Leaflet's default marker asset paths; use an inline SVG pin.
const pinIcon = L.divIcon({
  className: '',
  html:
    '<svg width="30" height="40" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 0C5.4 0 0 5.4 0 12c0 8 12 20 12 20s12-12 12-20C24 5.4 18.6 0 12 0z" fill="#02A958"/>' +
    '<circle cx="12" cy="12" r="5" fill="#fff"/></svg>',
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

type LatLng = { lat: number; lng: number };

function ClickCapture({ onPick }: { onPick: (ll: LatLng) => void }) {
  useMapEvents({ click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }) });
  return null;
}

export default function LocationPicker({
  value, onChange,
}: { value: LatLng | null; onChange: (ll: LatLng) => void }) {
  // Tehran default until the user picks.
  const center = useMemo<[number, number]>(() => [value?.lat ?? 35.6892, value?.lng ?? 51.389], []);

  const locateMe = () => {
    navigator.geolocation?.getCurrentPosition((pos) =>
      onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    );
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200" style={{ height: 320 }}>
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCapture onPick={onChange} />
        {value && (
          <Marker
            position={[value.lat, value.lng]}
            icon={pinIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const ll = (e.target as L.Marker).getLatLng();
                onChange({ lat: ll.lat, lng: ll.lng });
              },
            }}
          />
        )}
      </MapContainer>

      <button
        type="button"
        onClick={locateMe}
        className="absolute z-[1000] bottom-3 left-3 flex items-center gap-1.5 bg-white shadow-md rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:text-primary"
      >
        <Crosshair size={15} /> موقعیت من
      </button>

      {!value && (
        <div className="absolute z-[1000] top-3 right-3 bg-white/90 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 shadow">
          روی نقشه بزنید تا موقعیت انتخاب شود
        </div>
      )}
    </div>
  );
}
