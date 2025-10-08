import React, { useState, useEffect } from 'react';
import { billboardAPI, bookingAPI } from '../../services/api';
import BillboardMap from '../map/BillboardMap';
import BookingForm from '../forms/BookingForm';

function UserDashboard() {
  const [billboards, setBillboards] = useState([]);
  const [selectedBillboard, setSelectedBillboard] = useState(null);
  const [searchLocation, setSearchLocation] = useState({ lat: 18.501489, lng: 73.858904 });
  const [searchRadius, setSearchRadius] = useState(50);

  useEffect(() => {
    loadBillboards();
  }, []);

  const loadBillboards = async () => {
    try {
      const response = await billboardAPI.search(searchLocation.lat, searchLocation.lng, searchRadius);
      setBillboards(response.data);
    } catch (err) {
      console.error('Failed to load billboards:', err);
    }
  };

  const handleSearch = () => {
    loadBillboards();
  };

  const handleBook = (billboard) => {
    setSelectedBillboard(billboard);
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <div>
        <h3>Search Billboards</h3>
        <label>
          Latitude: <input value={searchLocation.lat} onChange={e => setSearchLocation({...searchLocation, lat: parseFloat(e.target.value)})} />
        </label>
        <label>
          Longitude: <input value={searchLocation.lng} onChange={e => setSearchLocation({...searchLocation, lng: parseFloat(e.target.value)})} />
        </label>
        <label>
          Radius (km): <input value={searchRadius} onChange={e => setSearchRadius(parseFloat(e.target.value))} />
        </label>
        <button onClick={handleSearch}>Search</button>
      </div>
      <BillboardMap billboards={billboards} onBook={handleBook} />
      {selectedBillboard && (
        <BookingForm billboard={selectedBillboard} onClose={() => setSelectedBillboard(null)} />
      )}
    </div>
  );
}

export default UserDashboard;
