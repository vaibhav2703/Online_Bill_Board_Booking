import api from './api';

const authService = {
    // Login
    login: async (identifier, password, role) => {
        const response = await api.post('/auth/login', {
            identifier,
            password,
            role,
        });
        return response.data;
    },

    // Register User
    registerUser: async (userData) => {
        const response = await api.post('/auth/register/user', userData);
        return response.data;
    },

    // Register Owner
    registerOwner: async (ownerData) => {
        const response = await api.post('/auth/register/owner', ownerData);
        return response.data;
    },

    // Forgot Password
    forgotPassword: async (email, role) => {
        const response = await api.post('/auth/forgot-password', {
            email,
            role,
        });
        return response.data;
    },

    // Reset Password
    resetPassword: async (resetToken, newPassword) => {
        const response = await api.post('/auth/reset-password', {
            resetToken,
            newPassword,
        });
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    },

    // Get stored token
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Get stored role
    getRole: () => {
        return localStorage.getItem('role');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};

export default authService;
