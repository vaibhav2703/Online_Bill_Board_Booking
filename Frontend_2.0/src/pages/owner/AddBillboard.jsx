import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Popup } from 'react-leaflet';
import { Upload, MapPin, IndianRupee, Ruler, Type, FileText, Save, Search, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import billboardService from '../../services/billboardService';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom modern marker icon
const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
        <div class="relative w-8 h-8 transform hover:scale-110 transition-transform duration-200 cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full filter drop-shadow-xl">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" fill="#000000" stroke="white" stroke-width="1.5"/>
                <circle cx="12" cy="10" r="3.5" fill="white"/>
            </svg>
        </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={customIcon}>
            <Popup>
                <div className="text-center py-1">
                    <p className="font-semibold text-sm text-gray-900">Billboard location selected</p>
                    <p className="text-xs text-gray-600 mt-1">Move pin to adjust exact location</p>
                </div>
            </Popup>
        </Marker>
    );
};

const MapUpdater = ({ position }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo([position.lat, position.lng], 13, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }, [position, map]);

    return null;
};

const AddBillboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [position, setPosition] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [locationName, setLocationName] = useState('');
    const [showCustomSize, setShowCustomSize] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        size: '',
        customSize: '',
        price: '',
        description: '',
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition({ lat: latitude, lng: longitude });

                    // Reverse geocode to get location name
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
                        );
                        const data = await response.json();
                        if (data.display_name) {
                            setLocationName(data.display_name);
                            if (!formData.location) {
                                setFormData(prev => ({ ...prev, location: data.display_name }));
                            }
                        }
                    } catch (error) {
                        console.error('Failed to get location name:', error);
                    }
                },
                (error) => {
                    toast.error('Unable to get your location');
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser');
        }
    };

    const fetchSuggestions = async (query) => {
        if (!query.trim() || query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=en`
            );
            const data = await response.json();
            setSuggestions(data);
            setShowSuggestions(data.length > 0);
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
        }
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Debounce the API call
        if (window.searchTimeout) {
            clearTimeout(window.searchTimeout);
        }
        window.searchTimeout = setTimeout(() => {
            fetchSuggestions(value);
        }, 300);
    };

    const selectSuggestion = (suggestion) => {
        const { lat, lon, display_name } = suggestion;
        setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setSearchQuery(display_name);
        setShowSuggestions(false);
        setSuggestions([]);
        setLocationName(display_name);
        if (!formData.location) {
            setFormData(prev => ({ ...prev, location: display_name }));
        }
    };

    const handleSearchLocation = async () => {
        if (!searchQuery.trim()) {
            toast.error('Please enter a location to search');
            return;
        }

        setSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&accept-language=en`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
                setLocationName(display_name);
                if (!formData.location) {
                    setFormData(prev => ({ ...prev, location: display_name }));
                }
            } else {
                toast.error('Location not found. Please try a different search.');
            }
        } catch (error) {
            toast.error('Failed to search location');
        } finally {
            setSearching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!position) {
            toast.error('Please select a location on the map');
            return;
        }
        if (!formData.image) {
            toast.error('Please upload an image');
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('location', formData.location);
            data.append('size', formData.size);
            data.append('price', formData.price);
            data.append('description', formData.description);
            data.append('latitude', position.lat);
            data.append('longitude', position.lng);
            data.append('image', formData.image);

            await billboardService.createBillboard(data);
            toast.success('Billboard created successfully!');
            navigate('/owner');
        } catch (error) {
            toast.error('Failed to create billboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Add New Billboard</h1>
                    <p className="text-gray-600 mt-1">List a new billboard for booking</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Basic Info Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Billboard Name
                                    </label>
                                    <div className="relative">
                                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            placeholder="e.g. Highway Prime Spot"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location Address
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="location"
                                            required
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            placeholder="e.g. Main Street, City Center"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Size (Dimensions)
                                    </label>
                                    <div className="relative">
                                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                                        <select
                                            name="size"
                                            required={!showCustomSize}
                                            value={formData.size}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === 'custom') {
                                                    setShowCustomSize(true);
                                                    setFormData(prev => ({ ...prev, size: '' }));
                                                } else {
                                                    setShowCustomSize(false);
                                                    setFormData(prev => ({ ...prev, size: value, customSize: '' }));
                                                }
                                            }}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white"
                                        >
                                            <option value="">Select size</option>
                                            <option value="10x5 ft">10x5 ft (Small)</option>
                                            <option value="14x48 ft">14x48 ft (Standard)</option>
                                            <option value="20x10 ft">20x10 ft (Medium)</option>
                                            <option value="40x20 ft">40x20 ft (Large)</option>
                                            <option value="48x14 ft">48x14 ft (Highway)</option>
                                            <option value="60x30 ft">60x30 ft (Extra Large)</option>
                                            <option value="custom">Custom Size</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Custom Size Input */}
                                    {showCustomSize && (
                                        <div className="mt-3 relative">
                                            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="customSize"
                                                required
                                                value={formData.customSize}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFormData(prev => ({ ...prev, customSize: value, size: value }));
                                                }}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                placeholder="e.g. 25x15 ft"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Enter custom dimensions (e.g., 25x15 ft)</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Monthly Price (₹)
                                    </label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="price"
                                            required
                                            value={formData.price}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Only allow numbers
                                                if (value === '' || /^\d+$/.test(value)) {
                                                    handleChange(e);
                                                }
                                            }}
                                            onKeyPress={(e) => {
                                                // Prevent non-numeric characters
                                                if (!/[0-9]/.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            placeholder="e.g. 50000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <textarea
                                            name="description"
                                            required
                                            rows="4"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                                            placeholder="Describe the visibility, traffic, and advantages..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Billboard Image
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 transition-colors cursor-pointer relative overflow-hidden bg-gray-50 h-48">
                                        {imagePreview ? (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        setFormData(prev => ({ ...prev, image: null }));
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 px-2 py-1">
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pinpoint Location on Map
                            </label>

                            {/* Search Bar */}
                            <div className="mb-4 relative">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchInputChange}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSearchLocation();
                                            }
                                        }}
                                        onFocus={() => {
                                            if (suggestions.length > 0) {
                                                setShowSuggestions(true);
                                            }
                                        }}
                                        placeholder="Search location (e.g., Mumbai, Maharashtra)"
                                        className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSearchLocation}
                                        disabled={searching}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-all z-10"
                                    >
                                        {searching ? 'Searching...' : 'Search'}
                                    </button>
                                </div>

                                {/* Suggestions Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                                        {suggestions.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                onClick={() => selectSuggestion(suggestion)}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                            >
                                                <div className="flex items-start">
                                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-900">{suggestion.display_name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="h-[400px] rounded-xl overflow-hidden border border-gray-300 shadow-inner relative">
                                {/* Use Current Location Button */}
                                <button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white text-primary-600 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 font-medium border border-gray-200"
                                >
                                    <Navigation className="h-4 w-4" />
                                    <span>Use current location</span>
                                </button>

                                <MapContainer
                                    center={[20.5937, 78.9629]}
                                    zoom={5}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <LocationMarker position={position} setPosition={setPosition} />
                                    <MapUpdater position={position} />
                                </MapContainer>
                            </div>

                            {/* Selected Location Display */}
                            {locationName && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-gray-900 mb-1">{locationName.split(',')[0]}</h3>
                                    <p className="text-sm text-gray-600">{locationName}</p>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        <span>Save Billboard</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBillboard;
