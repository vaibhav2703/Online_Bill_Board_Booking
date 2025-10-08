import React from 'react';
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
import './App.css';

function AppContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={
            user ? (
              user.role === 'USER' ? <Navigate to="/user" /> : <Navigate to="/owner" />
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/login/registration" element={<Registration />} />
          <Route path="/login/registration/user" element={<UserRegistration />} />
          <Route path="/login/registration/owner" element={<OwnerRegistration />} />
          <Route path="/user" element={
            user && user.role === 'USER' ? <UserDashboard /> : <Navigate to="/login" />
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
      </Router>
    </AuthProvider>
  );
}

export default App;
