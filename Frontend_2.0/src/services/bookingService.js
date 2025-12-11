import api from './api';

const bookingService = {
    // Create a new booking
    createBooking: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    // Get all bookings for the current user
    getUserBookings: async () => {
        const response = await api.get('/bookings/user');
        return response.data;
    },

    // Get all bookings (admin/owner)
    getAllBookings: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },
};

export default bookingService;
