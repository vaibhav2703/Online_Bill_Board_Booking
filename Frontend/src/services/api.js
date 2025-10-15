import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    //console.log('Token added to request:', token.substring(0, 20) + '...'); // Log partial token for debugging
  } else {
    console.warn('No token found in localStorage for request to:', config.url);
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      console.warn('403 Forbidden: Token might be expired or invalid');
      // Clear invalid token and user data
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      // Optionally, redirect to login or trigger logout
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data, {
    headers: { 'Content-Type': 'application/json' }
  }),
  registerUser: (userData) => api.post('/auth/register/user', userData, {
    headers: { 'Content-Type': 'application/json' }
  }),
  registerOwner: (ownerData) => api.post('/auth/register/owner', ownerData, {
    headers: { 'Content-Type': 'application/json' }
  }),
};

export const billboardAPI = {
  getAll: () => api.get('/billboards'),
  search: (lat, lng, radius) => api.get(`/billboards/search?lat=${lat}&lng=${lng}&radius=${radius}`),
  getById: (id) => api.get(`/billboards/${id}`),
};

export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData, {
    headers: { 'Content-Type': 'application/json' }
  }),
  getUserBookings: () => api.get('/bookings/user'),
};

export const ownerAPI = {
  addBillboard: (billboardData) => {
    const formData = new FormData();
    formData.append('name', billboardData.name);
    formData.append('location', billboardData.location);
    formData.append('address', billboardData.address);
    formData.append('phone', billboardData.phone);
    formData.append('lat', billboardData.lat);
    formData.append('lng', billboardData.lng);
    formData.append('size', billboardData.size);
    formData.append('price', billboardData.price);
    formData.append('description', billboardData.description);
    if (billboardData.image) {
      formData.append('image', billboardData.image);
    }
    return api.post('/owner/billboards', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getBillboards: () => api.get('/owner/billboards'),
  updateBillboard: (id, billboardData) => {
    const formData = new FormData();
    formData.append('name', billboardData.name);
    formData.append('location', billboardData.location);
    formData.append('address', billboardData.address);
    formData.append('phone', billboardData.phone);
    formData.append('lat', billboardData.lat);
    formData.append('lng', billboardData.lng);
    formData.append('size', billboardData.size);
    formData.append('price', billboardData.price);
    formData.append('description', billboardData.description);
    if (billboardData.image) {
      formData.append('image', billboardData.image);
    }
    return api.put(`/owner/billboards/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteBillboard: (id) => api.delete(`/owner/billboards/${id}`),
  getBookings: () => api.get('/owner/bookings'),
};

export default api;
