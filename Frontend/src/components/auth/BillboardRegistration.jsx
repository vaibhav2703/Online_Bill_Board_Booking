import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BillboardForm } from '../forms/BillboardForm';
import { ownerAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const BillboardRegistration = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (billboardData) => {
    try {
      await ownerAPI.addBillboard(billboardData);
      navigate('/owner');
    } catch (err) {
      console.error('Failed to add billboard:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setError('Failed to add billboard. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    navigate('/owner');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <BillboardForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default BillboardRegistration;
