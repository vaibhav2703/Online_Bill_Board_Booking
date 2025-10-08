import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BillboardForm } from '../forms/BillboardForm';
import { ownerAPI } from '../../services/api';

const BillboardRegistration = () => {
  const navigate = useNavigate();

  const handleSubmit = async (billboardData) => {
    try {
      await ownerAPI.addBillboard(billboardData);
      navigate('/owner');
    } catch (err) {
      console.error('Failed to add billboard:', err);
      // TODO: Show error message
    }
  };

  const handleCancel = () => {
    navigate('/owner');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <BillboardForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default BillboardRegistration;
