import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    if (token && role) {
      setUser({ token, role, name });
    }
  }, []);

  const login = async (usernameOrEmail, password, selectedRole) => {
    setIsLoading(true);
    try {
      // Map selected role to backend role
      const role = selectedRole === 'customer' ? 'USER' : 'OWNER';

      const data = {
        identifier: usernameOrEmail,
        password,
        role
      };

      const response = await authAPI.login(data);
      const token = response.data.token;
      const userRole = response.data.role;

      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('name', usernameOrEmail);
      setUser({ token, role: userRole, name: usernameOrEmail });
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.response?.data || 'Invalid credentials';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (username, password, name, email, phone, role, companyName) => {
    setIsLoading(true);
    try {
      let response;
      if (role === 'USER') {
        response = await authAPI.registerUser({ username, password, name, email, phone });
      } else {
        response = await authAPI.registerOwner({ username, password, name, email, phone, companyName });
      }
      const token = response.data.token;
      const userRole = response.data.role === 'USER' ? 'USER' : 'OWNER';
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('name', name);
      setUser({ token, role: userRole, name });
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
