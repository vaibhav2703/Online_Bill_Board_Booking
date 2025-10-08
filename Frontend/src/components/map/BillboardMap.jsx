import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function BillboardMap({ billboards, onBook }) {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer center={[18.501489, 73.858904]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {billboards.map(billboard => (
          <Marker key={billboard.id} position={[billboard.lat, billboard.lng]}>
            <Popup>
              <div>
                <h4>{billboard.name}</h4>
                <p>Size: {billboard.size}</p>
                <p>Price: ${billboard.price}</p>
                <p>Description: {billboard.description}</p>
                <p>Status: {billboard.isAvailable ? 'Available' : 'Not Available'}</p>
                {billboard.isAvailable && onBook && (
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
