import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, IndianRupee, Loader2 } from 'lucide-react';
import billboardService from '../../services/billboardService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import HeroSection from '../../components/user/HeroSection';
import BookingModal from '../../components/user/BookingModal';
import { formatCurrency } from '../../utils/formatters';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const BillboardList = () => {
    const [billboards, setBillboards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayCount, setDisplayCount] = useState(8); // Initial number of cards to display
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBillboard, setSelectedBillboard] = useState(null);
    const observerTarget = useRef(null);

    useEffect(() => {
        fetchBillboards();
    }, []);

    const fetchBillboards = async () => {
        try {
            const data = await billboardService.getAllBillboards();
            //console.log('API Response - First billboard:', data[0]);
            //console.log('Image path from API:', data[0]?.image);
            setBillboards(data);
        } catch (error) {
            toast.error('Failed to load billboards');
        } finally {
            setLoading(false);
        }
    };

    const filteredBillboards = billboards.filter(
        (billboard) =>
            billboard.status === 'available' &&
            (billboard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                billboard.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Get only the billboards to display based on displayCount
    const displayedBillboards = filteredBillboards.slice(0, displayCount);
    const hasMore = displayCount < filteredBillboards.length;

    // Load more billboards
    const loadMore = useCallback(() => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        // Simulate a small delay for smooth loading experience
        setTimeout(() => {
            setDisplayCount(prev => prev + 8); // Load 8 more cards
            setIsLoadingMore(false);
        }, 500);
    }, [isLoadingMore, hasMore]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, isLoadingMore, loadMore]);

    // Reset display count when search term changes
    useEffect(() => {
        setDisplayCount(8);
    }, [searchTerm]);

    // Handle booking modal
    const handleBookNow = (billboard) => {
        setSelectedBillboard(billboard);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBillboard(null);
    };

    if (loading) return <LoadingSpinner className="min-h-screen" />;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <HeroSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            {/* Billboard Grid */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Ambient background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-orange-400/20 via-orange-300/10 to-transparent blur-3xl pointer-events-none -z-10"></div>

                {filteredBillboards.length === 0 ? (
                    <EmptyState title="No billboards found" description="Try adjusting your search" />
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {displayedBillboards.map((billboard) => (
                                <div
                                    key={billboard.id}
                                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Image Container with Overlay */}
                                    <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                                        {billboard.image ? (
                                            <img
                                                src={getImageUrl(billboard.image)}
                                                alt={billboard.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = getPlaceholderImage();
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-gray-400 text-sm font-medium">No image available</span>
                                            </div>
                                        )}
                                        {/* Status Badge Overlay */}
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-200 text-black shadow-lg backdrop-blur-sm">
                                                Available
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6">
                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                                            {billboard.name}
                                        </h3>

                                        {/* Location */}
                                        <div className="flex items-center text-sm text-gray-600 mb-4">
                                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                            <span className="line-clamp-1">{billboard.location}</span>
                                        </div>

                                        {/* Size and Price Row */}
                                        <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Size</p>
                                                <p className="text-sm font-semibold text-gray-900">{billboard.size}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 mb-1">Price</p>
                                                <div className="flex items-center text-2xl font-bold text-gray-900">
                                                    <span>{formatCurrency(billboard.price)}</span>
                                                    <span className="text-sm font-normal text-gray-500 ml-1">/mo</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Book Now Button */}
                                        <button
                                            onClick={() => handleBookNow(billboard)}
                                            className="w-full cursor-pointer bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black transition-all duration-200 shadow-md hover:shadow-xl active:scale-95"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Loading indicator and observer target */}
                        {hasMore && (
                            <div ref={observerTarget} className="flex justify-center items-center py-8">
                                {isLoadingMore && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span className="text-sm font-medium">Loading more billboards...</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Show total count */}
                        {!hasMore && filteredBillboards.length > 8 && (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-500">
                                    Showing all {filteredBillboards.length} available billboards
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Booking Modal */}
            {selectedBillboard && (
                <BookingModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    billboard={selectedBillboard}
                />
            )}
        </div >
    );
};

export default BillboardList;
