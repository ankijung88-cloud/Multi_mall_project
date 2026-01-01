import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FindAccount from './pages/FindAccount';
import PersonalHome from './pages/PersonalHome';
import CompanyHome from './pages/CompanyHome';

// Admin Imports
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminMembers from './pages/AdminMembers';
import AdminSettings from './pages/AdminSettings';
import AdminOrders from './pages/AdminOrders';
import AdminShipping from './pages/AdminShipping';
import AdminPayments from './pages/AdminPayments';
import AdminReturns from './pages/AdminReturns';

import { useAuthStore } from './store/useAuthStore';

// Protected Route Component
const ProtectedRoute = ({ children, allowedType }: { children: ReactNode, allowedType: 'personal' | 'company' | 'admin' }) => {
  const { isAuthenticated, userType } = useAuthStore();

  if (!isAuthenticated) {
    // Redirect to appropriate login if trying to access admin
    if (allowedType === 'admin') return <Navigate to="/admin/login" replace />;
    return <Navigate to="/" replace />;
  }

  if (userType !== allowedType) {
    if (userType === 'admin') return <Navigate to="/admin" replace />;
    if (userType === 'company') return <Navigate to="/company" replace />;
    return <Navigate to="/personal" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-account" element={<FindAccount />} />

        {/* Admin Public Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route
          path="/personal"
          element={
            <ProtectedRoute allowedType="personal">
              <PersonalHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company"
          element={
            <ProtectedRoute allowedType="company">
              <CompanyHome />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedType="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/members" element={
          <ProtectedRoute allowedType="admin">
            <AdminLayout>
              <AdminMembers />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedType="admin">
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute allowedType="admin">
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/shipping" element={
          <ProtectedRoute allowedType="admin">
            <AdminLayout>
              <AdminShipping />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/payments" element={
          <ProtectedRoute allowedType="admin">
            <AdminLayout>
              <AdminPayments />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/returns" element={
          <ProtectedRoute allowedType="admin">
            <AdminLayout>
              <AdminReturns />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
