import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Billboard API
export const billboardAPI = {
  // Get all billboards
  getAllBillboards: () => api.get('/billboards'),
  
  // Get available billboards
  getAvailableBillboards: () => api.get('/billboards/available'),
  
  // Get billboard by ID
  getBillboardById: (id) => api.get(`/billboards/${id}`),
  
  // Create new billboard
  createBillboard: (billboard) => api.post('/billboards', billboard),
  
  // Update billboard
  updateBillboard: (id, billboard) => api.put(`/billboards/${id}`, billboard),
  
  // Update billboard availability
  updateAvailability: (id, isAvailable) => 
    api.put(`/billboards/${id}/availability?isAvailable=${isAvailable}`),
  
  // Delete billboard
  deleteBillboard: (id) => api.delete(`/billboards/${id}`),
};

// Booking API
export const bookingAPI = {
  // Get all bookings
  getAllBookings: () => api.get('/bookings'),
  
  // Get booking by ID
  getBookingById: (id) => api.get(`/bookings/${id}`),
  
  // Get bookings by billboard
  getBookingsByBillboard: (billboardId) => api.get(`/bookings/billboard/${billboardId}`),
  
  // Get bookings by email
  getBookingsByEmail: (email) => api.get(`/bookings/email/${email}`),
  
  // Get bookings by status
  getBookingsByStatus: (status) => api.get(`/bookings/status/${status}`),
  
  // Create booking with file upload
  createBooking: (formData) => {
    return axios.post(`${API_BASE_URL}/bookings`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Check availability
  checkAvailability: (billboardId, startDate, endDate) => 
    api.get(`/bookings/availability?billboardId=${billboardId}&startDate=${startDate}&endDate=${endDate}`),
  
  // Update booking status
  updateBookingStatus: (id, status) => 
    api.put(`/bookings/${id}/status?status=${status}`),
  
  // Delete booking
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
};

// File API
export const fileAPI = {
  // Get file URL
  getFileUrl: (fileName) => `${API_BASE_URL}/files/${fileName}`,
};

export default api;