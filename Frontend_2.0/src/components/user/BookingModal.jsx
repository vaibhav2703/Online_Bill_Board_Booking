import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Mail, Phone, MapPin, IndianRupee, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import api from '../../services/api';

const BookingModal = ({ isOpen, onClose, billboard }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        startDate: '',
        endDate: '',
        message: ''
    });

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }

        // Cleanup function
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.fullName || !formData.email || !formData.phone || !formData.startDate || !formData.endDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        // Phone validation (basic)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        // Date validation
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (start >= end) {
            toast.error('End date must be after start date');
            return;
        }

        // Calculate duration in months
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const duration = Math.ceil(diffDays / 30); // Convert days to months

        // Prepare booking data according to backend BookingRequest structure
        const bookingData = {
            billboardId: billboard.id,
            startDate: formData.startDate,
            duration: duration,
            companyName: formData.companyName || 'N/A',
            contactPerson: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            campaignDetails: formData.message || 'No additional details provided'
        };

        try {
            // Show loading toast
            const loadingToast = toast.loading('Submitting your booking...');

            // Make API call to create booking
            const response = await api.post('/bookings', bookingData);

            // Dismiss loading toast
            toast.dismiss(loadingToast);

            // Show success message
            toast.success('🎉 Booking confirmed! Billboard status updated to booked.');

            console.log('Booking created:', response.data);

            // Reset form
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                companyName: '',
                startDate: '',
                endDate: '',
                message: ''
            });

            // Close modal
            onClose();

            // Refresh the page to update billboard list
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error('Booking error:', error);

            // Handle error response
            if (error.response) {
                const errorMessage = typeof error.response.data === 'string'
                    ? error.response.data
                    : error.response.data.message || 'Failed to create booking';
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('No response from server. Please check your connection.');
            } else {
                toast.error('An error occurred while creating the booking');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Container - Wider and optimized for no scroll */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Book Billboard</h2>
                        <p className="text-gray-300 text-xs mt-0.5">{billboard.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form Container - Scrollable if needed but optimized to fit */}
                <div className="overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Billboard Info - Compact horizontal layout */}
                        <div className="mb-5 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">Location</p>
                                        <p className="text-sm font-semibold text-gray-900">{billboard.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">Size</p>
                                        <p className="text-sm font-semibold text-gray-900">{billboard.size}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IndianRupee className="h-4 w-4 text-gray-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">Price</p>
                                        <p className="text-sm font-bold text-gray-900">{formatCurrency(billboard.price)}/mo</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields - Two Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="10-digit number"
                                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Company Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Company/Business Name <span className="text-gray-400 text-xs">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Enter company/business name"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none"
                                />
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    End Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Message - Full Width */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Additional Message <span className="text-gray-400 text-xs">(Optional)</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Any special requirements or questions..."
                                    rows="3"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none resize-none"
                                ></textarea>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm"
                            >
                                Submit Booking
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
