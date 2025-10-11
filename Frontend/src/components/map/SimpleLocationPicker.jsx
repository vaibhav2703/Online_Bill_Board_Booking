import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import billboardIcon from '../../assets/billboard.png';
import 'leaflet/dist/leaflet.css';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

const MapController = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position]);

  useEffect(() => {
    // Remove default zoom controls
    const zoomControl = map.zoomControl;
    if (zoomControl) {
      map.removeControl(zoomControl);
    }
  }, [map]);

  return null;
};

const ZoomControls = () => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="leaflet-bottom leaflet-left" style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000 }}>
      <div className="leaflet-control leaflet-bar leaflet-control-zoom">
        <a className="leaflet-control-zoom-in" href="#" title="Zoom in" onClick={(e) => { e.preventDefault(); handleZoomIn(); }}>+</a>
        <a className="leaflet-control-zoom-out" href="#" title="Zoom out" onClick={(e) => { e.preventDefault(); handleZoomOut(); }}>-</a>
      </div>
    </div>
  );
};

const LocationMarker = ({ position, setPosition, onLocationChange }) => {
  const customIcon = new L.Icon({
    iconUrl: billboardIcon,
    iconSize: [25, 25], // size of the icon
    iconAnchor: [12, 25], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -25] // point from which the popup should open relative to the iconAnchor
  });
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
    <Marker position={position} icon={customIcon}>
      <Popup>Selected location: {position[0].toFixed(6)}, {position[1].toFixed(6)}</Popup>
    </Marker>
  );
};

export const SimpleLocationPicker = ({ initialLat, initialLng, onLocationChange }) => {
  const [position, setPosition] = useState([initialLat || 18.501489, initialLng || 73.858904]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&accept-language=en`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Suggestions error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Debounce suggestions fetch
    clearTimeout(window.suggestionTimeout);
    window.suggestionTimeout = setTimeout(() => fetchSuggestions(value), 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    const { lat, lon, display_name } = suggestion;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    setPosition([latitude, longitude]);
    onLocationChange(latitude, longitude, display_name);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}&limit=1&accept-language=en`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        setPosition([latitude, longitude]);
        onLocationChange(latitude, longitude, display_name);
        setShowSuggestions(false);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Error searching for location. Please try again.');
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        const address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        onLocationChange(latitude, longitude, address);
      },
      () => {
        alert('Unable to retrieve your location');
      }
    );
  };

  return (
    <div>
      <div className="flex mb-2 space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search location (e.g., Pune, Kothrud)"
            value={searchQuery}
            onChange={handleInputChange}
            className="pl-10"
            aria-label="Search location"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-[1000] max-h-40 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button variant="default" size="sm" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <Button variant="default" size="sm" onClick={handleUseCurrentLocation} className="mb-2">
        Use Current Location
      </Button>
      <div style={{ height: '300px', width: '100%' }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <MapController position={position} />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onLocationChange={onLocationChange}
          />
          <ZoomControls />
        </MapContainer>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Click on the map to select the billboard location. Current: {position[0].toFixed(6)}, {position[1].toFixed(6)}
      </p>
    </div>
  );
};
