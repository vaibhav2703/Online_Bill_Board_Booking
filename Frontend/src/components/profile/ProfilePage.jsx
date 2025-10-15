import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { BookOpen, User } from 'lucide-react';
import { bookingAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export const ProfilePage = ({ onBack, onEditProfile }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const fetchUserBookings = async () => {
    if (!user) {
      console.warn('User not authenticated, skipping bookings fetch');
      toast.error('Please log in to view your bookings');
      setBookingsLoading(false);
      return;
    }
    setBookingsLoading(true);
    try {
      const response = await bookingAPI.getUserBookings();
      setUserBookings(response.data);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      if (error.response && error.response.status === 403) {
        toast.error('Authentication failed. Please log in again.');
        // Optionally, redirect to login or clear token
        localStorage.removeItem('token');
        // You might want to call a logout function from AuthContext
      } else {
        toast.error('Failed to load bookings');
      }
    } finally {
      setBookingsLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'bookings') {
      fetchUserBookings();
    }
  }, [activeTab]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <div className="space-x-2">
          <Button onClick={onEditProfile}>Edit Profile</Button>
          <Button variant="outline" onClick={onBack}>Back</Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <User className="h-4 w-4 mr-2" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'bookings'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          My Bookings
        </button>
      </div>

      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{user?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{user?.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <p className="text-sm text-gray-900 capitalize">{user?.role || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'bookings' && (
        <div>
          {bookingsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your bookings...</p>
            </div>
          ) : userBookings.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-muted-foreground">You haven't made any bookings yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <img
                      src={booking.billboard?.image ? (booking.billboard.image.startsWith('uploads') ? `http://localhost:8080/uploads/${booking.billboard.image.replace(/^uploads[\/\\]/, '').replace(/\\/g, '/')}` : `data:image/png;base64,${booking.billboard.image}`) : '/placeholder.png'}
                      alt={booking.billboard?.name}
                      className="w-full h-full object-contain"
                    />
                    <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800">
                      Booked
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="flex items-center justify-between font-bold">
                      {booking.billboard?.name}
                    </CardTitle>
                    <CardDescription>{booking.billboard?.location}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Company:</strong> {booking.companyName}</p>
                      <p><strong>Duration:</strong> {booking.duration} months</p>
                      <p><strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
                      <p><strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
                      <p><strong>Total Price:</strong> ${booking.totalPrice?.toLocaleString()}</p>
                    </div>

                    <div className="text-sm">
                      <p className="line-clamp-2">{booking.campaignDetails}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
