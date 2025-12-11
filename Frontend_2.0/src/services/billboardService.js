import api from './api';

const billboardService = {
    // Get all billboards
    getAllBillboards: async () => {
        const response = await api.get('/billboards');
        return response.data;
    },

    // Search billboards by location
    searchBillboards: async (lat, lng, radius) => {
        const response = await api.get('/billboards/search', {
            params: { lat, lng, radius },
        });
        return response.data;
    },

    // Get billboard by ID
    getBillboardById: async (id) => {
        const response = await api.get(`/billboards/${id}`);
        return response.data;
    },

    // Create new billboard
    createBillboard: async (formData) => {
        const response = await api.post('/billboards', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export default billboardService;
