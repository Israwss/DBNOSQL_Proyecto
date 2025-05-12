'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos predeterminados de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Sucursal {
  mall: string;
  lat: number;
  lon: number;
}

interface MapComponentProps {
  branches: Sucursal[];
}

export default function MapComponent({ branches }: MapComponentProps) {
  const [mapReady, setMapReady] = React.useState(false);

  React.useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady || branches.length === 0) return null;

  const position = [branches[0].lat, branches[0].lon];

  return (
    <MapContainer 
      center={position} 
      zoom={12} 
      scrollWheelZoom={true} 
      style={{ 
        height: '100%', 
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {branches.map((sucursal, i) => (
        <Marker
          key={i}
          position={[sucursal.lat, sucursal.lon]}
          icon={L.icon({ 
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })}
        >
          <Popup>{sucursal.mall}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}