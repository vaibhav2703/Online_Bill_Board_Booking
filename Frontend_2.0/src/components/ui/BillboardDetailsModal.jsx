import React from 'react';
import Modal from './Modal';
import { MapPin, Maximize2, IndianRupee, Calendar, Info } from 'lucide-react';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';

const BillboardDetailsModal = ({ isOpen, onClose, billboard }) => {
    if (!billboard) return null;

    const DetailItem = ({ icon: Icon, label, value, fullWidth = false }) => (
        <div className={`${fullWidth ? 'col-span-2' : ''} space-y-2`}>
            <div className="flex items-center space-x-2 text-gray-600">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
            </div>
            <p className="text-gray-900 font-semibold pl-6">{value}</p>
        </div>
    );

    // Use the image field (same as user dashboard) or fallback to imagePath
    const imageSource = billboard.image || billboard.imagePath;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Billboard Details" size="lg">
            <div className="space-y-6">
                {/* Billboard Image - Always show */}
                <div className="relative overflow-hidden rounded-xl bg-gray-100 group shadow-lg">
                    {imageSource ? (
                        <img
                            src={getImageUrl(imageSource)}
                            alt={billboard.name}
                            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = getPlaceholderImage();
                            }}
                        />
                    ) : (
                        <img
                            src={getPlaceholderImage()}
                            alt="No image available"
                            className="w-full h-80 object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Image overlay with billboard name */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <h3 className="text-white text-xl font-bold drop-shadow-lg">{billboard.name}</h3>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
                    <DetailItem
                        icon={MapPin}
                        label="Location"
                        value={billboard.location}
                    />
                    <DetailItem
                        icon={Maximize2}
                        label="Size"
                        value={billboard.size}
                    />
                    <DetailItem
                        icon={IndianRupee}
                        label="Price"
                        value={`₹${billboard.price?.toLocaleString()}`}
                    />
                    <DetailItem
                        icon={Calendar}
                        label="Status"
                        value={
                            <span
                                className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${billboard.status === 'available'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {billboard.status}
                            </span>
                        }
                    />
                    {billboard.description && (
                        <DetailItem
                            icon={Info}
                            label="Description"
                            value={billboard.description}
                            fullWidth
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default BillboardDetailsModal;
