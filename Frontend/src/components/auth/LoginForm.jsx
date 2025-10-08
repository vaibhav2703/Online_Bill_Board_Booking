import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../contexts/AuthContext';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!usernameOrEmail || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(usernameOrEmail, password, role);
    if (!result.success) {
      setError(result.error);
    } else {
      navigate(role === 'customer' ? '/user' : '/owner');
    }
  };

  const signInButtonColor = '#030213';
  const unselectedBgColor = '#ECECF0';
  const unselectedTextColor = '#A0A0A0'; // darker shade

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
            <p className="text-gray-600 mt-2">Access your account to manage billboards or book advertising space</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usernameOrEmail">Username or Email</Label>
            <Input
              id="usernameOrEmail"
              type="text"
              placeholder="Enter your username or email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <Label>Account Type</Label>
            <div className="relative p-1 rounded-lg" style={{ backgroundColor: unselectedBgColor }}>
              <div
                className={`absolute top-1 bottom-1 w-1/2 rounded-md transition-transform duration-200 ease-in-out ${
                  role === "owner"
                    ? "translate-x-full"
                    : "translate-x-0"
                }`}
                style={{ backgroundColor: signInButtonColor }}
              />
              <div className="relative flex">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200"
                  style={{
                    backgroundColor: role === "customer" ? signInButtonColor : unselectedBgColor,
                    color: role === "customer" ? "white" : unselectedTextColor,
                  }}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("owner")}
                  className="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200"
                  style={{
                    backgroundColor: role === "owner" ? signInButtonColor : unselectedBgColor,
                    color: role === "owner" ? "white" : unselectedTextColor,
                  }}
                >
                  Owner
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Book billboard advertising space</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full px-16 py-3 mb-16 text-white rounded-lg transition-colors"
            style={{ backgroundColor: signInButtonColor }}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="text-center">
          <Link
            to="/login/registration"
            className="text-sm hover:underline font-bold"
            style={{ color: signInButtonColor }}
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};
