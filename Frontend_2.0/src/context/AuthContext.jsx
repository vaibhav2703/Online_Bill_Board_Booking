import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing auth on mount
    useEffect(() => {
        const storedToken = authService.getToken();
        const storedRole = authService.getRole();

        if (storedToken && storedRole) {
            setToken(storedToken);
            setRole(storedRole);
            setUser({ role: storedRole });
        }
        setLoading(false);
    }, []);

    const login = async (identifier, password, selectedRole) => {
        try {
            const data = await authService.login(identifier, password, selectedRole);

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);

            setToken(data.token);
            setRole(data.role);
            setUser({ role: data.role });

            return { success: true, role: data.role };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data || 'Login failed. Please try again.'
            };
        }
    };

    const register = async (userData, isOwner = false) => {
        try {
            const data = isOwner
                ? await authService.registerOwner(userData)
                : await authService.registerUser(userData);

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);

            setToken(data.token);
            setRole(data.role);
            setUser({ role: data.role });

            return { success: true, role: data.role };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.response?.data || 'Registration failed. Please try again.'
            };
        }
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setRole(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        role,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
