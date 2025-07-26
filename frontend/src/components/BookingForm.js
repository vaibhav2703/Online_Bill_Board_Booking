import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { billboardAPI, bookingAPI } from '../services/api';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [billboard, setBillboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    contactNumber: '',
    startDate: '',
    endDate: '',
    image: null
  });
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(0);

  useEffect(() => {
    fetchBillboard();
  }, [id]);

  useEffect(() => {
    calculatePrice();
  }, [formData.startDate, formData.endDate, billboard]);

  const fetchBillboard = async () => {
    try {
      const response = await billboardAPI.getBillboardById(id);
      setBillboard(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load billboard details');
      setLoading(false);
      console.error('Error fetching billboard:', err);
    }
  };

  const calculatePrice = () => {
    if (formData.startDate && formData.endDate && billboard) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const timeDiff = end.getTime() - start.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
      
      if (dayDiff > 0) {
        setDays(dayDiff);
        setTotalPrice(dayDiff * billboard.price);
      } else {
        setDays(0);
        setTotalPrice(0);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const validateForm = () => {
    if (!formData.userName.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.contactNumber.trim()) {
      setError('Contact number is required');
      return false;
    }
    if (!formData.startDate) {
      setError('Start date is required');
      return false;
    }
    if (!formData.endDate) {
      setError('End date is required');
      return false;
    }
    if (new Date(formData.startDate) < new Date().setHours(0,0,0,0)) {
      setError('Start date cannot be in the past');
      return false;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date cannot be before start date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Check availability first
      const availabilityResponse = await bookingAPI.checkAvailability(
        id, 
        formData.startDate, 
        formData.endDate
      );
      
      if (!availabilityResponse.data.available) {
        setError('This billboard is not available for the selected dates');
        setSubmitting(false);
        return;
      }

      // Prepare form data for submission
      const submitData = new FormData();
      submitData.append('billboardId', id);
      submitData.append('userName', formData.userName);
      submitData.append('email', formData.email);
      submitData.append('contactNumber', formData.contactNumber);
      submitData.append('startDate', formData.startDate);
      submitData.append('endDate', formData.endDate);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await bookingAPI.createBooking(submitData);
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to create booking');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      console.error('Error creating booking:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billboard details...</p>
        </div>
      </div>
    );
  }

  if (!billboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Billboard not found</p>
          <button 
            onClick={() => navigate('/map')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Map
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your booking request has been submitted successfully. You will be redirected to the dashboard shortly.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button 
              onClick={() => navigate('/map')}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Map
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Book Billboard: {billboard.name}
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Booking Details
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date Selection */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* User Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Creative (Optional)
                    </label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload your advertisement image (JPG, PNG, GIF)
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || days <= 0}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Processing...' : `Book Billboard - $${totalPrice}`}
                  </button>
                </form>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Booking Summary
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <span className="font-medium text-gray-700">Billboard:</span>
                    <p className="text-gray-900">{billboard.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <p className="text-gray-900">{billboard.address}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Size:</span>
                    <p className="text-gray-900">{billboard.size}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Rate:</span>
                    <p className="text-green-600 font-bold">${billboard.price}/day</p>
                  </div>
                </div>

                {formData.startDate && formData.endDate && days > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Duration:</span>
                      <span className="text-gray-900">{days} day{days > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Rate per day:</span>
                      <span className="text-gray-900">${billboard.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-green-600">${totalPrice}</span>
                    </div>
                  </div>
                )}

                {billboard.description && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Description:</h4>
                    <p className="text-gray-600 text-sm">{billboard.description}</p>
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

export default BookingForm;