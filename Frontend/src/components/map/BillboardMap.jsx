import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import billboardIcon from '../../assets/billboard.png';
import 'leaflet/dist/leaflet.css';

function BillboardMap({ billboards, onBook }) {
  const customIcon = new L.Icon({
    iconUrl: billboardIcon,
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
  });
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer center={[18.501489, 73.858904]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {billboards.map(billboard => (
          <Marker key={billboard.id} position={[billboard.lat, billboard.lng]} icon={customIcon}>
            <Popup>
              <div>
                <h4>{billboard.name}</h4>
                <p>Size: {billboard.size}</p>
                <p>Price: ${billboard.price}</p>
                <p>Description: {billboard.description}</p>
                <p>Status: {billboard.status}</p>
                {billboard.status === 'available' && onBook && (
                  <button onClick={() => onBook(billboard)}>Book Now</button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default BillboardMap;
