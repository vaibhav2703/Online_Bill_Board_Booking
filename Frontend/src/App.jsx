import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import Registration from './components/auth/Registration';
import UserRegistration from './components/auth/UserRegistration';
import OwnerRegistration from './components/auth/OwnerRegistration';
import UserDashboard from './components/dashboards/UserDashboard';
import OwnerDashboard from './components/dashboards/OwnerDashboard';
import BillboardRegistration from './components/auth/BillboardRegistration';
import { Header } from './components/common/Header';
import { Toaster } from 'react-hot-toast';
import './App.css';

function AppContent() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100">
      {user && <Header onProfileClick={user.role === 'USER' ? handleProfileClick : undefined} />}
      <main className={`container mx-auto px-4 ${user ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={
            user ? (
              user.role === 'USER' ? <Navigate to="/user" /> : <Navigate to="/owner" />
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/" />} />
          <Route path="/login/registration" element={!user ? <Registration /> : <Navigate to="/" />} />
          <Route path="/login/registration/user" element={!user ? <UserRegistration /> : <Navigate to="/" />} />
          <Route path="/login/registration/owner" element={!user ? <OwnerRegistration /> : <Navigate to="/" />} />
          <Route path="/user" element={
            user && user.role === 'USER' ? <UserDashboard showProfile={showProfile} onCloseProfile={handleCloseProfile} /> : <Navigate to="/login" />
          } />
          <Route path="/owner" element={
            user && user.role === 'OWNER' ? <OwnerDashboard /> : <Navigate to="/login" />
          } />
          <Route path="/owner/registerBillboard" element={
            user && user.role === 'OWNER' ? <BillboardRegistration /> : <Navigate to="/login" />
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
