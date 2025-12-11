import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Auth Pages
import Login from './pages/auth/Login';
import UserRegister from './pages/auth/UserRegister';
import OwnerRegister from './pages/auth/OwnerRegister';

// User Pages
import BillboardList from './pages/user/BillboardList';
import MyBookings from './pages/user/MyBookings';
import MapView from './pages/user/MapView';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddBillboard from './pages/owner/AddBillboard';
import OwnerBookings from './pages/owner/OwnerBookings';
import OwnerProfile from './pages/owner/OwnerProfile';
import ProfileSettings from './pages/owner/ProfileSettings';

// Home redirect component
const HomeRedirect = () => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={role === 'OWNER' ? '/owner' : '/user'} replace />;
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register/user" element={<UserRegister />} />
          <Route path="/register/owner" element={<OwnerRegister />} />

          {/* User Routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <BillboardList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/bookings"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/map"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <MapView />
              </ProtectedRoute>
            }
          />

          {/* Owner Routes */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/registerBillboard"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <AddBillboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/bookings"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/profile"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/profile/settings"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;

