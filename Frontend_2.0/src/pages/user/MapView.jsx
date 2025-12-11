import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Marker, Popup, NavigationControl, GeolocateControl, Source, Layer } from 'react-map-gl/maplibre';
import { Search, MapPin, IndianRupee, X, Loader2, Globe } from 'lucide-react';
import billboardService from '../../services/billboardService';
import bookingService from '../../services/bookingService';
import BookingModal from '../../components/user/BookingModal';
import BillboardDetailsModal from '../../components/user/BillboardDetailsModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';
import toast from 'react-hot-toast';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapView = () => {
    const [billboards, setBillboards] = useState([]);
    const [userBookings, setUserBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedBillboard, setSelectedBillboard] = useState(null);
    const [popupInfo, setPopupInfo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [locationBoundary, setLocationBoundary] = useState(null);
    const searchRef = useRef(null);
    const mapRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Default map view centered on India
    const [viewState, setViewState] = useState({
        longitude: 78.9629,
        latitude: 20.5937,
        zoom: 5
    });

    useEffect(() => {
        fetchBillboards();
        fetchUserBookings();
    }, []);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchBillboards = async () => {
        try {
            const data = await billboardService.getAllBillboards();
            // console.log('📍 All billboards from API:', data);
            // console.log('📍 Total billboards fetched:', data.length);

            // Filter billboards with valid coordinates (using lat/lng fields)
            const billboardsWithCoords = data.filter(
                (billboard) => billboard.lat && billboard.lng
            );

            // console.log('✅ Billboards with coordinates:', billboardsWithCoords);
            // console.log('✅ Count:', billboardsWithCoords.length);

            setBillboards(billboardsWithCoords);
        } catch (error) {
            console.error('❌ Error fetching billboards:', error);
            toast.error('Failed to load billboards');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserBookings = async () => {
        try {
            const bookings = await bookingService.getUserBookings();
            setUserBookings(bookings);
        } catch (error) {
            console.error('❌ Error fetching user bookings:', error);
            // Don't show error toast as this is optional functionality
        }
    };

    // Geocoding search using OpenStreetMap Nominatim API
    const searchLocation = async (query) => {
        if (!query || query.trim().length < 3) {
            setLocationSuggestions([]);
            return;
        }

        try {
            setIsSearchingLocation(true);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`,
                {
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            );

            if (!response.ok) throw new Error('Geocoding failed');

            const data = await response.json();
            setLocationSuggestions(data);
        } catch (error) {
            console.error('❌ Error searching location:', error);
            setLocationSuggestions([]);
        } finally {
            setIsSearchingLocation(false);
        }
    };

    const getSuggestions = () => {
        if (!searchTerm.trim()) return [];

        const suggestions = [];
        const seen = new Set();

        billboards.forEach((billboard) => {
            // Add billboard name suggestions
            if (billboard.name?.toLowerCase().includes(searchTerm.toLowerCase()) && !seen.has(billboard.name)) {
                suggestions.push({ type: 'name', value: billboard.name, billboard });
                seen.add(billboard.name);
            }
            // Add location suggestions
            if (billboard.location?.toLowerCase().includes(searchTerm.toLowerCase()) && !seen.has(billboard.location)) {
                suggestions.push({ type: 'location', value: billboard.location, billboard });
                seen.add(billboard.location);
            }
        });

        return suggestions.slice(0, 5);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.value);
        setShowSuggestions(false);

        // Animate to the billboard location with smooth zoom
        if (suggestion.billboard && mapRef.current) {
            mapRef.current.flyTo({
                center: [suggestion.billboard.lng, suggestion.billboard.lat],
                zoom: 16, // Closer zoom for better location visibility
                duration: 2000,
                essential: true
            });

            // Show popup after animation
            setTimeout(() => {
                setPopupInfo(suggestion.billboard);
            }, 2000);
        }
    };

    const handleLocationSelect = async (location) => {
        setSearchTerm(location.display_name);
        setShowSuggestions(false);
        setLocationSuggestions([]);

        // Zoom to fit the entire location boundary
        if (mapRef.current) {
            // Fetch boundary data for the location
            try {
                const boundaryResponse = await fetch(
                    `https://nominatim.openstreetmap.org/lookup?osm_ids=${location.osm_type.charAt(0).toUpperCase()}${location.osm_id}&format=json&polygon_geojson=1`,
                    {
                        headers: {
                            'Accept': 'application/json',
                        }
                    }
                );

                if (boundaryResponse.ok) {
                    const boundaryData = await boundaryResponse.json();
                    if (boundaryData.length > 0 && boundaryData[0].geojson) {
                        const boundary = {
                            type: 'Feature',
                            geometry: boundaryData[0].geojson
                        };
                        setLocationBoundary(boundary);

                        // Use the bounding box to fit the entire area
                        if (location.boundingbox && location.boundingbox.length === 4) {
                            const [south, north, west, east] = location.boundingbox.map(parseFloat);

                            mapRef.current.fitBounds(
                                [
                                    [west, south],  // Southwest corner
                                    [east, north]   // Northeast corner
                                ],
                                {
                                    padding: { top: 50, bottom: 50, left: 50, right: 50 },
                                    duration: 2000,
                                    essential: true
                                }
                            );
                        } else {
                            // Fallback to center point if no bounding box
                            const lat = parseFloat(location.lat);
                            const lon = parseFloat(location.lon);

                            mapRef.current.flyTo({
                                center: [lon, lat],
                                zoom: 12,
                                duration: 2000,
                                essential: true
                            });
                        }
                    } else {
                        setLocationBoundary(null);
                        // Fallback zoom to center point
                        const lat = parseFloat(location.lat);
                        const lon = parseFloat(location.lon);

                        mapRef.current.flyTo({
                            center: [lon, lat],
                            zoom: 12,
                            duration: 2000,
                            essential: true
                        });
                    }
                } else {
                    setLocationBoundary(null);
                    // Fallback zoom to center point
                    const lat = parseFloat(location.lat);
                    const lon = parseFloat(location.lon);

                    mapRef.current.flyTo({
                        center: [lon, lat],
                        zoom: 12,
                        duration: 2000,
                        essential: true
                    });
                }
            } catch (error) {
                console.error('Error fetching boundary:', error);
                setLocationBoundary(null);
                // Fallback zoom to center point
                const lat = parseFloat(location.lat);
                const lon = parseFloat(location.lon);

                mapRef.current.flyTo({
                    center: [lon, lat],
                    zoom: 12,
                    duration: 2000,
                    essential: true
                });
            }

            // Keep all billboards visible - don't filter
            toast.success(`Navigated to ${location.display_name.split(',')[0]}`);
        }
    };

    // Calculate distance between two coordinates (Haversine formula)
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleSearchInput = (value) => {
        setSearchTerm(value);
        setShowSuggestions(true);

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Debounce geocoding search (wait 500ms after user stops typing)
        searchTimeoutRef.current = setTimeout(() => {
            searchLocation(value);
        }, 500);
    };

    // Check if a billboard is booked by the current user (active or upcoming only)
    const isBookedByUser = (billboardId) => {
        const today = new Date();
        return userBookings.some(booking => {
            if (booking.billboard?.id !== billboardId) return false;

            // Only show blue pin if booking is active or upcoming (not completed)
            const endDate = new Date(booking.endDate);
            return endDate >= today;
        });
    };

    // Get marker color based on billboard status and user bookings
    const getMarkerColor = (billboard) => {
        // Blue for user's booked billboards
        if (isBookedByUser(billboard.id)) {
            return 'bg-blue-400';
        }
        // Green for available billboards
        if (billboard.status === 'available') {
            return 'bg-green-400';
        }
        // Orange for billboards booked by others
        return 'bg-orange-400';
    };

    const handleMarkerClick = (billboard) => {
        setPopupInfo(billboard);

        // Pan and zoom to show the billboard popup card prominently
        if (mapRef.current) {
            const map = mapRef.current;

            // First, zoom to the desired level
            const targetZoom = 14;

            // Calculate how much to offset the center so popup is visible
            // Popup appears ABOVE the marker, so we need to pan the map so marker is in lower portion
            // This makes the popup appear in the upper-center area

            // Use easeTo for smoother, more controlled animation
            map.easeTo({
                center: [billboard.lng, billboard.lat],
                zoom: targetZoom,
                duration: 1500,
                offset: [0, 0], // Offset by 150px down - this moves the marker down, popup up
                essential: true
            });
        }
    };

    const handleBookNow = (billboard) => {
        setSelectedBillboard(billboard);
        setIsModalOpen(true);
        setPopupInfo(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBillboard(null);
    };

    const handleViewDetails = (billboard) => {
        setSelectedBillboard(billboard);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setPopupInfo(null);
        setLocationBoundary(null);

        // Reset map view to default
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [78.9629, 20.5937],
                zoom: 4.5,
                duration: 2000,
                essential: true
            });
        }
    };

    if (loading) return <LoadingSpinner className="min-h-screen" />;

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                {/* Header */}
                <div className="mb-4 sm:mb-5 lg:mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Map View</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Discover billboards on the map</p>
                </div>

                {/* Map Container */}
                <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden map-container-responsive">
                    {/* Floating Search Bar */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4 z-10 w-[calc(100%-1rem)] sm:w-80 lg:w-96 max-w-[calc(100%-1rem)] sm:max-w-[calc(100%-1.5rem)] lg:max-w-[calc(100%-2rem)]">
                        <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl">
                            <div className="relative p-3" ref={searchRef}>
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500 z-10 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search locations or billboards..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchInput(e.target.value)}
                                    onFocus={() => setShowSuggestions(true)}
                                    className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2 sm:py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all duration-200 text-xs sm:text-sm"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}

                                {/* Suggestions Dropdown */}
                                {showSuggestions && searchTerm && (getSuggestions().length > 0 || locationSuggestions.length > 0) && (
                                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-80 overflow-y-auto">
                                        {/* Location Suggestions from Geocoding */}
                                        {locationSuggestions.length > 0 && (
                                            <>
                                                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                                                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                                                        <Globe className="h-3 w-3" />
                                                        Locations
                                                    </p>
                                                </div>
                                                {locationSuggestions.map((location, index) => (
                                                    <div
                                                        key={`loc-${index}`}
                                                        onClick={() => handleLocationSelect(location)}
                                                        className="px-3 py-2.5 hover:bg-orange-50 cursor-pointer transition-colors duration-150 flex items-center space-x-2 border-b border-gray-100"
                                                    >
                                                        <div className="bg-blue-100 p-1.5 rounded-lg">
                                                            <Globe className="h-3.5 w-3.5 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {location.display_name.split(',')[0]}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {location.display_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}

                                        {/* Billboard Suggestions */}
                                        {getSuggestions().length > 0 && (
                                            <>
                                                {locationSuggestions.length > 0 && (
                                                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                                                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                                                            <MapPin className="h-3 w-3" />
                                                            Billboards
                                                        </p>
                                                    </div>
                                                )}
                                                {getSuggestions().map((suggestion, index) => (
                                                    <div
                                                        key={`bb-${index}`}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className="px-3 py-2.5 hover:bg-orange-50 cursor-pointer transition-colors duration-150 flex items-center space-x-2 border-b border-gray-100 last:border-b-0"
                                                    >
                                                        <div className="bg-orange-100 p-1.5 rounded-lg">
                                                            {suggestion.type === 'location' ? (
                                                                <MapPin className="h-3.5 w-3.5 text-orange-600" />
                                                            ) : (
                                                                <Search className="h-3.5 w-3.5 text-orange-600" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{suggestion.value}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {suggestion.type === 'location' ? 'Billboard Location' : 'Billboard Name'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}

                                        {/* Loading State */}
                                        {isSearchingLocation && (
                                            <div className="px-3 py-2.5 flex items-center justify-center space-x-2 text-gray-500">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span className="text-sm">Searching...</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <ReactMapGL
                        ref={mapRef}
                        {...viewState}
                        onMove={(evt) => setViewState(evt.viewState)}
                        mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
                        style={{ width: '100%', height: '100%' }}
                        attributionControl={false}
                    >
                        {/* Navigation Controls */}
                        <NavigationControl position="top-right" style={{ marginTop: '10px', marginRight: '10px' }} />
                        <GeolocateControl position="top-right" style={{ marginTop: '60px', marginRight: '10px' }} />

                        {/* Location Boundary Highlight */}
                        {locationBoundary && (
                            <Source id="location-boundary" type="geojson" data={locationBoundary}>
                                {/* Fill layer */}
                                <Layer
                                    id="location-boundary-fill"
                                    type="fill"
                                    paint={{
                                        'fill-color': '#ff6b35',
                                        'fill-opacity': 0.1
                                    }}
                                />
                                {/* Border layer */}
                                <Layer
                                    id="location-boundary-line"
                                    type="line"
                                    paint={{
                                        'line-color': '#ff6b35',
                                        'line-width': 3,
                                        'line-opacity': 0.8
                                    }}
                                />
                            </Source>
                        )}

                        {/* Billboard Markers */}
                        {billboards.map((billboard) => (
                            <Marker
                                key={billboard.id}
                                longitude={billboard.lng}
                                latitude={billboard.lat}
                                anchor="bottom"
                                onClick={(e) => {
                                    e.originalEvent.stopPropagation();
                                    handleMarkerClick(billboard);
                                }}
                            >
                                <div className="relative cursor-pointer group">
                                    {/* Marker Pin */}
                                    <div className="relative">
                                        <div className={`absolute -inset-2 ${getMarkerColor(billboard)} rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                        <div className={`relative ${getMarkerColor(billboard)} w-6 h-6 rounded-full border-4 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <MapPin className="h-2 w-2 text-white fill-white" />
                                        </div>
                                    </div>
                                    {/* Marker Tail */}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                                </div>
                            </Marker>
                        ))}

                        {/* Popup */}
                        {popupInfo && (
                            <Popup
                                longitude={popupInfo.lng}
                                latitude={popupInfo.lat}
                                anchor="top"
                                onClose={() => setPopupInfo(null)}
                                closeButton={true}
                                closeOnClick={false}
                                className="billboard-popup"
                                maxWidth="90vw"
                            >
                                <div className="w-72 sm:w-80 p-2 sm:p-3">
                                    {/* Billboard Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden mb-4 shadow-sm">
                                        <img
                                            src={popupInfo.image ? getImageUrl(popupInfo.image) : getPlaceholderImage()}
                                            alt={popupInfo.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getPlaceholderImage();
                                            }}
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg capitalize ${popupInfo.status === 'available'
                                                ? 'bg-green-500 text-white'
                                                : popupInfo.status === 'booked'
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-gray-500 text-white'
                                                }`}>
                                                {popupInfo.status || 'Available'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Billboard Details */}
                                    <h3
                                        onClick={() => handleViewDetails(popupInfo)}
                                        className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight cursor-pointer hover:text-orange-600 transition-colors duration-200"
                                    >
                                        {popupInfo.name}
                                    </h3>

                                    <div className="flex items-start text-sm text-gray-600 mb-4">
                                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-orange-500" />
                                        <span className="line-clamp-2 leading-relaxed">{popupInfo.location}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-200">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Size</p>
                                            <p className="text-base font-bold text-gray-900">{popupInfo.size}</p>
                                        </div>
                                        <div className="bg-orange-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Price</p>
                                            <div className="flex items-baseline">
                                                <span className="text-xl font-bold text-orange-600">{formatCurrency(popupInfo.price)}</span>
                                                <span className="text-xs font-medium text-gray-500 ml-1">/mo</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Conditional Book Now Button - Only show for available billboards */}
                                    {popupInfo.status === 'available' ? (
                                        <button
                                            onClick={() => handleBookNow(popupInfo)}
                                            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-5 py-3 rounded-lg text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <span>Book Now</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <div className="w-full bg-gray-100 text-gray-500 px-5 py-3 rounded-lg text-base font-semibold text-center border-2 border-gray-200">
                                            Not Available for Booking
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        )}
                    </ReactMapGL>

                    {/* Info Badge */}
                    <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 lg:bottom-4 lg:left-4 bg-white rounded-lg sm:rounded-xl shadow-lg px-3 py-2 sm:px-4 sm:py-3 z-10">
                        <div className="flex items-center space-x-1.5 sm:space-x-2">
                            <div className="bg-orange-100 p-1.5 sm:p-2 rounded-lg">
                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500">Total Billboards</p>
                                <p className="text-base sm:text-lg font-bold text-gray-900">{billboards.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {selectedBillboard && (
                <BookingModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    billboard={selectedBillboard}
                />
            )}

            {/* Billboard Details Modal */}
            <BillboardDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={handleCloseDetailsModal}
                billboard={selectedBillboard}
                onBookNow={handleBookNow}
            />
        </div>
    );
};

export default MapView;
