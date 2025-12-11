import api from './api';

const ownerService = {
    // Add a new billboard
    addBillboard: async (formData) => {
        const response = await api.post('/owner/billboards', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get all billboards owned by the current owner
    getOwnerBillboards: async () => {
        const response = await api.get('/owner/billboards');
        return response.data;
    },

    // Update a billboard
    updateBillboard: async (id, formData) => {
        const response = await api.put(`/owner/billboards/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete a billboard
    deleteBillboard: async (id) => {
        const response = await api.delete(`/owner/billboards/${id}`);
        return response.data;
    },

    // Get all bookings for owner's billboards
    getOwnerBookings: async () => {
        const response = await api.get('/owner/bookings');
        return response.data;
    },

    // Get owner profile
    getOwnerProfile: async () => {
        const response = await api.get('/owner/profile');
        return response.data;
    },

    // Update owner profile
    updateOwnerProfile: async (formData) => {
        const response = await api.put('/owner/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Change password
    changePassword: async (passwordData) => {
        const response = await api.put('/owner/change-password', passwordData);
        return response.data;
    },
};

export default ownerService;
