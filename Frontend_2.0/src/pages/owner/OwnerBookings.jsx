import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Building2, FileText, IndianRupee, Clock, Search, Filter } from 'lucide-react';
import ownerService from '../../services/ownerService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';

const OwnerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings();
    }, [searchTerm, statusFilter, bookings]);

    const fetchBookings = async () => {
        try {
            const data = await ownerService.getOwnerBookings();
            setBookings(data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const filterBookings = () => {
        let filtered = [...bookings];

        // Filter to only show bookings with booked or upcoming billboard status
        filtered = filtered.filter(booking => {
            const billboardStatus = booking.billboard?.status;
            return billboardStatus === 'booked' || billboardStatus === 'upcoming';
        });

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.billboard?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.userName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter based on billboard status from DB
        if (statusFilter !== 'all') {
            filtered = filtered.filter(booking => {
                const billboardStatus = booking.billboard?.status;

                if (statusFilter === 'active') {
                    return billboardStatus === 'booked';
                } else if (statusFilter === 'upcoming') {
                    return billboardStatus === 'upcoming';
                } else if (statusFilter === 'completed') {
                    return billboardStatus === 'available';
                }
                return true;
            });
        }

        setFilteredBookings(filtered);
    };

    const getBillboardStatus = (billboard) => {
        const status = billboard?.status || 'available';

        // Map billboard status from DB to display format
        const statusMap = {
            'available': { label: 'Available', color: 'bg-green-100 text-green-800' },
            'booked': { label: 'Booked', color: 'bg-red-100 text-red-800' },
            'upcoming': { label: 'Upcoming', color: 'bg-yellow-100 text-yellow-800' }
        };

        return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) return <LoadingSpinner className="min-h-screen" />;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-gray-600 mt-1">View and manage all billboard bookings</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-500">
                        <h3 className="text-gray-600 text-sm font-medium">Total Bookings</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {bookings.filter(b => b.billboard?.status === 'booked' || b.billboard?.status === 'upcoming').length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                        <h3 className="text-gray-600 text-sm font-medium">Booked</h3>
                        <p className="text-3xl font-bold text-red-600 mt-2">
                            {bookings.filter(b => b.billboard?.status === 'booked').length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                        <h3 className="text-gray-600 text-sm font-medium">Upcoming</h3>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">
                            {bookings.filter(b => b.billboard?.status === 'upcoming').length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-500">
                        <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            ₹{bookings
                                .filter(b => b.billboard?.status === 'booked' || b.billboard?.status === 'upcoming')
                                .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
                                .toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by billboard, company, or contact person..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">All Bookings</option>
                                <option value="active">Active</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <EmptyState
                        title={searchTerm || statusFilter !== 'all' ? 'No bookings found' : 'No bookings yet'}
                        description={searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Bookings will appear here once customers book your billboards'}
                    />
                ) : (
                    <div className="space-y-6">
                        {filteredBookings.map((booking) => {
                            const status = getBillboardStatus(booking.billboard);
                            return (
                                <div
                                    key={booking.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="md:flex">
                                        {/* Billboard Image */}
                                        <div className="md:w-1/3 lg:w-1/4">
                                            <div className="relative h-64 md:h-full">
                                                <img
                                                    src={booking.billboard?.image ? getImageUrl(booking.billboard.image) : getPlaceholderImage()}
                                                    alt={booking.billboard?.name || 'Billboard'}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = getPlaceholderImage();
                                                    }}
                                                />
                                                <div className="absolute top-4 right-4">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Booking Details */}
                                        <div className="md:w-2/3 lg:w-3/4 p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                                        {booking.billboard?.name || 'N/A'}
                                                    </h3>
                                                    <div className="flex items-center text-gray-600">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        <span className="text-sm">{booking.billboard?.location || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center justify-end text-2xl font-bold text-primary-600">
                                                        <IndianRupee className="h-6 w-6" />
                                                        <span>{booking.totalPrice?.toLocaleString() || 0}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{booking.duration} month(s)</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                {/* Company Info */}
                                                <div className="space-y-3">
                                                    <div className="flex items-start space-x-3">
                                                        <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Company</p>
                                                            <p className="text-sm font-semibold text-gray-900">{booking.companyName || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start space-x-3">
                                                        <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Contact Person</p>
                                                            <p className="text-sm font-semibold text-gray-900">{booking.userName || 'N/A'}</p>
                                                            <p className="text-xs text-gray-600">{booking.userEmail || 'N/A'}</p>
                                                            <p className="text-xs text-gray-600">{booking.userContact || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Booking Dates */}
                                                <div className="space-y-3">
                                                    <div className="flex items-start space-x-3">
                                                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Booking Period</p>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start space-x-3">
                                                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                                                            <p className="text-sm font-semibold text-gray-900">{booking.duration} month(s)</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Campaign Details */}
                                            {booking.campaignDetails && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <div className="flex items-start space-x-3">
                                                        <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Campaign Details</p>
                                                            <p className="text-sm text-gray-700 leading-relaxed">{booking.campaignDetails}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerBookings;
