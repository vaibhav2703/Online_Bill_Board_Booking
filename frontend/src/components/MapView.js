import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { billboardAPI } from '../services/api';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = () => {
  const [billboards, setBillboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBillboard, setSelectedBillboard] = useState(null);

  useEffect(() => {
    fetchBillboards();
  }, []);

  const fetchBillboards = async () => {
    try {
      const response = await billboardAPI.getAvailableBillboards();
      setBillboards(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load billboards');
      setLoading(false);
      console.error('Error fetching billboards:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billboards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={fetchBillboards}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate center point of all billboards
  const center = billboards.length > 0 
    ? [
        billboards.reduce((sum, b) => sum + b.latitude, 0) / billboards.length,
        billboards.reduce((sum, b) => sum + b.longitude, 0) / billboards.length
      ]
    : [39.8283, -98.5795]; // Center of USA

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Billboard Locations
          </h1>
          <p className="text-gray-600">
            Click on any marker to view billboard details and book your space.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <MapContainer
                center={center}
                zoom={4}
                className="map-container"
                style={{ height: '600px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {billboards.map((billboard) => (
                  <Marker
                    key={billboard.id}
                    position={[billboard.latitude, billboard.longitude]}
                    eventHandlers={{
                      click: () => setSelectedBillboard(billboard),
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-lg mb-2">{billboard.name}</h3>
                        <p className="text-gray-600 mb-2">{billboard.address}</p>
                        <p className="text-sm text-gray-500 mb-2">Size: {billboard.size}</p>
                        <p className="text-lg font-bold text-green-600 mb-3">
                          ${billboard.price}/day
                        </p>
                        <Link
                          to={`/book/${billboard.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Book Now
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Billboard List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Available Billboards ({billboards.length})
                </h2>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {billboards.map((billboard) => (
                  <div
                    key={billboard.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedBillboard?.id === billboard.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedBillboard(billboard)}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {billboard.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {billboard.address}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {billboard.size}
                      </span>
                      <span className="font-bold text-green-600">
                        ${billboard.price}/day
                      </span>
                    </div>
                    <Link
                      to={`/book/${billboard.id}`}
                      className="mt-2 inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Billboard Details */}
            {selectedBillboard && (
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Billboard Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Name: </span>
                    <span className="text-gray-900">{selectedBillboard.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Address: </span>
                    <span className="text-gray-900">{selectedBillboard.address}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Size: </span>
                    <span className="text-gray-900">{selectedBillboard.size}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Price: </span>
                    <span className="text-green-600 font-bold">
                      ${selectedBillboard.price}/day
                    </span>
                  </div>
                  {selectedBillboard.description && (
                    <div>
                      <span className="font-medium text-gray-700">Description: </span>
                      <p className="text-gray-900 mt-1">{selectedBillboard.description}</p>
                    </div>
                  )}
                </div>
                <Link
                  to={`/book/${selectedBillboard.id}`}
                  className="mt-4 block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book This Billboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;