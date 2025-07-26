import React, { useState, useEffect } from 'react';
import { bookingAPI, fileAPI } from '../services/api';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getAllBookings();
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load bookings');
      setLoading(false);
      console.error('Error fetching bookings:', err);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, newStatus);
      // Refresh bookings
      fetchBookings();
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Failed to update booking status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'ALL') return true;
    return booking.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={fetchBookings}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Dashboard
          </h1>
          <p className="text-gray-600">
            Manage all billboard bookings and their status.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {status} ({bookings.filter(b => status === 'ALL' || b.status === status).length})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">No bookings found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {booking.billboard.name}
                        </h3>
                        <p className="text-gray-600">{booking.billboard.address}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Customer</span>
                        <p className="text-gray-900">{booking.userName}</p>
                        <p className="text-gray-600 text-sm">{booking.email}</p>
                        <p className="text-gray-600 text-sm">{booking.contactNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Duration</span>
                        <p className="text-gray-900">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Billboard Size</span>
                        <p className="text-gray-900">{booking.billboard.size}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Total Price</span>
                        <p className="text-green-600 font-bold text-lg">${booking.totalPrice}</p>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {booking.imagePath && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500 block mb-2">
                          Uploaded Creative
                        </span>
                        <img
                          src={fileAPI.getFileUrl(booking.imagePath)}
                          alt="Booking creative"
                          className="max-w-xs max-h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Status Update Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                      {(booking.status === 'CANCELLED' || booking.status === 'COMPLETED') && (
                        <span className="text-gray-500 text-sm italic">
                          No actions available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {bookings.length}
            </div>
            <div className="text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {bookings.filter(b => b.status === 'PENDING').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {bookings.filter(b => b.status === 'CONFIRMED').length}
            </div>
            <div className="text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              ${bookings.reduce((total, booking) => total + (booking.totalPrice || 0), 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;