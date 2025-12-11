import React from 'react';
import { X, MapPin, Calendar, Ruler, IndianRupee, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';

const BillboardDetailsModal = ({ isOpen, onClose, billboard, onBookNow }) => {
    if (!isOpen || !billboard) return null;

    const isAvailable = billboard.status === 'available';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop with blur - matching BookingModal */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
                <div
                    className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full mx-auto transform transition-all animate-modal-slide-up max-h-[95vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </button>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Left: Image Section */}
                        <div className="relative h-64 sm:h-80 md:h-auto bg-gradient-to-br from-gray-100 to-gray-50 rounded-t-xl sm:rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
                            <img
                                src={billboard.image ? getImageUrl(billboard.image) : getPlaceholderImage()}
                                alt={billboard.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getPlaceholderImage();
                                }}
                            />
                            {/* Status Badge */}
                            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                                <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg capitalize backdrop-blur-sm ${billboard.status === 'available'
                                    ? 'bg-green-500 text-white'
                                    : billboard.status === 'booked'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-500 text-white'
                                    }`}>
                                    {billboard.status || 'Available'}
                                </span>
                            </div>
                        </div>

                        {/* Right: Details Section */}
                        <div className="p-5 sm:p-6 md:p-8 flex flex-col">
                            {/* Title */}
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 pr-8">
                                {billboard.name}
                            </h2>

                            {/* Location */}
                            <div className="flex items-start text-gray-600 mb-4 sm:mb-6">
                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 flex-shrink-0 text-orange-500" />
                                <span className="text-sm sm:text-base">{billboard.location}</span>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                {/* Size */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                                    <div className="flex items-center mb-1 sm:mb-2">
                                        <Ruler className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 mr-1 sm:mr-2" />
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Size</p>
                                    </div>
                                    <p className="text-base sm:text-lg font-bold text-gray-900">{billboard.size}</p>
                                </div>

                                {/* Price */}
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200">
                                    <div className="flex items-center mb-1 sm:mb-2">
                                        <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 mr-1 sm:mr-2" />
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Price</p>
                                    </div>
                                    <div className="flex items-baseline">
                                        <span className="text-lg sm:text-2xl font-bold text-orange-600">{formatCurrency(billboard.price)}</span>
                                        <span className="text-xs sm:text-sm font-medium text-gray-500 ml-1">/month</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {billboard.description && (
                                <div className="mb-4 sm:mb-6">
                                    <div className="flex items-center mb-2">
                                        <Info className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 mr-1 sm:mr-2" />
                                        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Description</h3>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        {billboard.description}
                                    </p>
                                </div>
                            )}

                            {/* Additional Details */}
                            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 space-y-2">
                                {billboard.type && (
                                    <div className="flex justify-between">
                                        <span className="text-xs sm:text-sm text-gray-600">Type:</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-900 capitalize">{billboard.type}</span>
                                    </div>
                                )}
                                {billboard.lighting && (
                                    <div className="flex justify-between">
                                        <span className="text-xs sm:text-sm text-gray-600">Lighting:</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-900 capitalize">{billboard.lighting}</span>
                                    </div>
                                )}
                                {billboard.visibility && (
                                    <div className="flex justify-between">
                                        <span className="text-xs sm:text-sm text-gray-600">Visibility:</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-900 capitalize">{billboard.visibility}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto">
                                {isAvailable ? (
                                    <button
                                        onClick={() => {
                                            onBookNow(billboard);
                                            onClose();
                                        }}
                                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-5 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                                        <span>Book Now</span>
                                    </button>
                                ) : (
                                    <div className="w-full bg-gray-100 text-gray-500 px-5 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold text-center border-2 border-gray-200">
                                        Not Available for Booking
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillboardDetailsModal;
