import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LocationMarker = ({ position, setPosition, onLocationChange }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      // For simplicity, using lat/lng as address. In a real app, use geocoding.
      const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      onLocationChange(lat, lng, address);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected location: {position[0].toFixed(6)}, {position[1].toFixed(6)}</Popup>
    </Marker>
  );
};

export const SimpleLocationPicker = ({ initialLat, initialLng, onLocationChange }) => {
  const [position, setPosition] = useState([initialLat || 18.501489, initialLng || 73.858904]);

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationChange={onLocationChange}
        />
      </MapContainer>
      <p className="text-sm text-muted-foreground mt-2">
        Click on the map to select the billboard location. Current: {position[0].toFixed(6)}, {position[1].toFixed(6)}
      </p>
    </div>
  );
};
