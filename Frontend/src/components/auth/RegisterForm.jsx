import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const RegisterForm = ({ onToggleMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Temporary debug logs (remove after fixing)
    console.log('=== SUBMIT DEBUG ===');
    console.log('Password value at submit:', JSON.stringify(password));
    console.log('Password length at submit:', password.length);
    console.log('Confirm password value:', JSON.stringify(confirmPassword));
    console.log('Confirm password length:', confirmPassword.length);
    console.log('Passwords match?', password === confirmPassword);

    if (!username || !password || !name || !email || !phone || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setError('Password must be between 8 and 16 characters');
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!passwordPattern.test(password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)');
      return;
    }

    if (phone.length < 10 || phone.length > 15) {
      setError('Phone number must be between 10 and 15 digits');
      return;
    }

    if (role === 'OWNER' && (!companyName || companyName.trim() === '')) {
      setError('Company name is required for owners');
      return;
    }

    const success = await register(username, password, name, email, phone, role, companyName);
    if (!success) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Join Billboard Hub</CardTitle>
        <CardDescription>
          Create your account to start managing or booking billboard advertising
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())} // Trim to avoid spaces
              placeholder="Create a password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value.trim())} // Trim here too
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Account Type</Label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="user"
                  name="role"
                  value="USER"
                  checked={role === 'USER'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <Label htmlFor="user">User - Book billboard space</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="owner"
                  name="role"
                  value="OWNER"
                  checked={role === 'OWNER'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <Label htmlFor="owner">Owner - Manage billboard properties</Label>
              </div>
            </div>
          </div>

          {role === 'OWNER' && (
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name"
                required
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary hover:underline"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};