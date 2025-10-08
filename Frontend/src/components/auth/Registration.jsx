import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';

function Registration() {
  const navigate = useNavigate();
  const [role, setRole] = useState('USER');
  const [error, setError] = useState(null);

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setError(null);
  };

  const handleContinue = () => {
    if (!role) {
      setError('Please select an account type to continue.');
      return;
    }
    if (role === 'USER') {
      navigate('/login/registration/user');
    } else {
      navigate('/login/registration/owner');
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  const signInButtonColor = '#030213';
  const unselectedBgColor = '#ECECF0';
  const unselectedTextColor = '#A0A0A0';

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      <Button
        onClick={handleBack}
        className="absolute top-4 left-4 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        Back
      </Button>
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 space-y-6">
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Billboard Hub
            </h1>
            <p className="text-gray-600 mt-2">Choose your account type to get started</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Account Type</Label>
          <div className="relative p-1 rounded-lg" style={{ backgroundColor: unselectedBgColor }}>
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-md transition-transform duration-200 ease-in-out ${
                role === "OWNER"
                  ? "translate-x-full"
                  : "translate-x-0"
              }`}
              style={{ backgroundColor: signInButtonColor }}
            />
            <div className="relative flex">
              <button
                type="button"
                onClick={() => handleRoleSelection('USER')}
                className="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200"
                style={{
                  backgroundColor: role === "USER" ? signInButtonColor : unselectedBgColor,
                  color: role === "USER" ? "white" : unselectedTextColor,
                }}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelection('OWNER')}
                className="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200"
                style={{
                  backgroundColor: role === "OWNER" ? signInButtonColor : unselectedBgColor,
                  color: role === "OWNER" ? "white" : unselectedTextColor,
                }}
              >
                Owner
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Select your role to continue</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleContinue}
          className="w-full px-16 py-3 mb-16 text-white rounded-lg transition-colors"
          style={{ backgroundColor: signInButtonColor }}
          disabled={!role}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default Registration;
