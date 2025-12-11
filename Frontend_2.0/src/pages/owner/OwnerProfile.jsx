import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, MapPin, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import ownerService from '../../services/ownerService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';

const OwnerProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({
        totalBillboards: 0,
        availableBillboards: 0,
        totalRevenue: 0,
        avgOccupancy: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const [profileData, billboards, bookings] = await Promise.all([
                ownerService.getOwnerProfile(),
                ownerService.getOwnerBillboards(),
                ownerService.getOwnerBookings()
            ]);

            setProfile(profileData);

            // Calculate stats
            const totalBillboards = billboards.length;
            const availableBillboards = billboards.filter(b => b.status === 'available').length;
            const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
            const avgOccupancy = totalBillboards > 0
                ? Math.round(((totalBillboards - availableBillboards) / totalBillboards) * 100)
                : 0;

            setStats({
                totalBillboards,
                availableBillboards,
                totalRevenue,
                avgOccupancy
            });

            // Format recent activity from bookings
            const activity = bookings
                .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                .slice(0, 5)
                .map(booking => {
                    const today = new Date();
                    const startDate = new Date(booking.startDate);
                    const endDate = new Date(booking.endDate);

                    let status = 'completed';
                    let statusColor = 'bg-gray-100 text-gray-800';

                    if (startDate <= today && endDate >= today) {
                        status = 'active';
                        statusColor = 'bg-green-100 text-green-800';
                    } else if (startDate > today) {
                        status = 'confirmed';
                        statusColor = 'bg-blue-100 text-blue-800';
                    }

                    return {
                        id: booking.id,
                        title: `${status === 'confirmed' ? 'New booking for' : status === 'active' ? 'Active booking:' : 'Booking completed for'} ${booking.billboard?.name || 'Billboard'}`,
                        date: new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        company: booking.companyName,
                        amount: booking.totalPrice,
                        status,
                        statusColor,
                        icon: status === 'active' ? 'location' : 'booking'
                    };
                });

            setRecentActivity(activity);
        } catch (error) {
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner className="min-h-screen" />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/owner')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                            <p className="text-gray-600 mt-1">View your profile information and activity</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/owner/profile/settings')}
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                    >
                        <Settings className="h-4 w-4" />
                        <span>Edit Profile</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Sidebar - Profile Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            {/* Profile Image */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 mb-4 overflow-hidden">
                                    {profile?.profileImage ? (
                                        <img
                                            src={getImageUrl(profile.profileImage)}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getPlaceholderImage();
                                            }}
                                        />
                                    ) : (
                                        <span>{profile?.name?.charAt(0)?.toUpperCase() || 'X'}</span>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{profile?.name || 'Owner'}</h2>
                                <span className="bg-black text-white text-xs px-3 py-1 rounded-full mt-2">Owner</span>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4 border-t border-gray-200 pt-4">
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm">{profile?.email}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-sm">{profile?.phone}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="text-sm">{profile?.companyName}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Stats and Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <MapPin className="h-8 w-8 text-primary-600" />
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        {stats.availableBillboards} Available
                                    </span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900">{stats.totalBillboards}</div>
                                <div className="text-sm text-gray-600">Total Billboards</div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <DollarSign className="h-8 w-8 text-green-600" />
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">Total Revenue</div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <TrendingUp className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900">{stats.avgOccupancy}%</div>
                                <div className="text-sm text-gray-600">Avg. Occupancy</div>
                            </div>
                        </div>

                        {/* Activity Section */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="border-b border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
                                <p className="text-sm text-gray-600">Your recent business activity</p>
                            </div>

                            {/* Activity Tabs */}
                            <div className="border-b border-gray-200">
                                <div className="flex">
                                    <button className="flex-1 px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-b-2 border-primary-600">
                                        Recent Activity
                                    </button>
                                    <button className="flex-1 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
                                        All Activity
                                    </button>
                                </div>
                            </div>

                            {/* Activity List */}
                            <div className="divide-y divide-gray-200">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((activity) => (
                                        <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-4">
                                                    <div className={`p-3 rounded-lg ${activity.icon === 'location' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                                        {activity.icon === 'location' ? (
                                                            <MapPin className="h-5 w-5 text-green-600" />
                                                        ) : (
                                                            <Calendar className="h-5 w-5 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {activity.date} • {activity.company}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {activity.amount && (
                                                        <div className="text-lg font-bold text-gray-900 mb-1">
                                                            ₹{activity.amount.toLocaleString()}
                                                        </div>
                                                    )}
                                                    <span className={`text-xs px-3 py-1 rounded-full ${activity.statusColor}`}>
                                                        {activity.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-gray-500">
                                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p>No recent activity</p>
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

export default OwnerProfile;
