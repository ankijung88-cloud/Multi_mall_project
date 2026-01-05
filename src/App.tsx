import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { PartnerProvider } from './context/PartnerContext';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FindAccount from './pages/FindAccount';
import PersonalHome from './pages/PersonalHome';
import CompanyHome from './pages/CompanyHome';
import ProductDetail from './pages/ProductDetail';
import OrderHistory from './pages/OrderHistory';
import Shop from './pages/Shop';
import Partners from './pages/Partners';
import PartnerDetail from './pages/PartnerDetail';
import BeautyPartners from './pages/BeautyPartners';
import CoursePartners from './pages/CoursePartners';
import PerformancePartners from './pages/PerformancePartners';
import AuditionPartners from './pages/AuditionPartners';
import FashionPartners from './pages/FashionPartners';
import Agents from './pages/Agents';

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
import AdminProducts from './pages/AdminProducts';
import AdminPartners from './pages/AdminPartners';
import AdminPartnerRequests from './pages/AdminPartnerRequests';
import AdminShippedOrders from './pages/AdminShippedOrders';
import AdminInvoices from './pages/AdminInvoices';
import AdminAgents from './pages/AdminAgents';
import AdminAgentRequests from './pages/AdminAgentRequests';
import AgentDetail from './pages/AgentDetail';
import AdminContentRequests from './pages/AdminContentRequests';
import PersonalContentDetail from './pages/PersonalContentDetail';
import AllPersonalContents from './pages/AllPersonalContents';

import { useAuthStore } from './store/useAuthStore';
import { AgentProvider } from './context/AgentContext';
import { FreelancerProvider } from './context/FreelancerContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedType }: { children: ReactNode, allowedType?: 'personal' | 'company' | 'admin' }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const userType = useAuthStore(state => state.userType);

  if (!isAuthenticated) {
    // Redirect to appropriate login if trying to access admin
    if (allowedType === 'admin') return <Navigate to="/admin/login" replace />;
    return <Navigate to="/" replace />;
  }

  // If allowedType is specified, enforce it. If not, allow any authenticated user.
  if (allowedType && userType !== allowedType) {
    // Special case: If trying to access admin area but logged in as non-admin, 
    // redirect to admin login to allow role switch.
    if (allowedType === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }

    if (userType === 'admin') return <Navigate to="/admin" replace />;
    if (userType === 'company') return <Navigate to="/company" replace />;
    return <Navigate to="/personal" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ProductProvider>
          <PartnerProvider>
            <AgentProvider>
              <FreelancerProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Welcome />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/partners/course" element={<CoursePartners />} />
                  <Route path="/partners/beauty" element={<BeautyPartners />} />
                  <Route path="/partners/performance" element={<PerformancePartners />} />
                  <Route path="/partners/audition" element={<AuditionPartners />} />
                  <Route path="/partners/fashion" element={<FashionPartners />} />
                  <Route path="/partners/:id" element={<PartnerDetail />} />
                  <Route path="/agents" element={<Agents />} />
                  <Route path="/agents/:id" element={<AgentDetail />} />
                  <Route path="/find-account" element={<FindAccount />} />

                  {/* Admin Public Route */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  import AllPersonalContents from './pages/AllPersonalContents'; // Add this at top if not auto-imported, but here we just add route

                  // ... (existing imports)

                  {/* Protected Routes */}
                  <Route path="/personal" element={<PersonalHome />} />
                  <Route path="/company" element={<CompanyHome />} />
                  <Route path="/contents" element={<AllPersonalContents />} />
                  <Route path="/contents/:id" element={<PersonalContentDetail />} />

                  <Route
                    path="/product/:id"
                    element={<ProductDetail />}
                  />

                  <Route path="/order-history" element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute allowedType="admin">
                      <AdminLayout>
                        <AdminDashboard />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/products" element={
                    <ProtectedRoute allowedType="admin">
                      <AdminLayout>
                        <AdminProducts />
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
                  <Route path="/admin/shipped" element={
                    <ProtectedRoute allowedType="admin">
                      <AdminLayout>
                        <AdminShippedOrders />
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
                  <Route path="/admin/partners" element={<Navigate to="/admin/partners/course" replace />} />
                  <Route path="/admin/partners/:category" element={
                    <ProtectedRoute allowedType="admin">
                      <AdminLayout>
                        <AdminPartners />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/partner-requests" element={<Navigate to="/admin/partner-requests/course" replace />} />
                  <Route path="/admin/partner-requests/:category" element={
                    <ProtectedRoute allowedType="admin">
                      <AdminLayout>
                        <AdminPartnerRequests />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/agents" element={
                    <ProtectedRoute allowedType="admin">
                      <AdminLayout>
                        <AdminAgents />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/agent-requests" element={
                    <ProtectedRoute allowedType="admin">
                      <AdminLayout>
                        <AdminAgentRequests />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/invoices" element={
                    <ProtectedRoute allowedType="admin">
                      <AdminLayout>
                        <AdminInvoices />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/content-requests" element={
                    <ProtectedRoute allowedType="admin">
                      <AdminLayout>
                        <AdminContentRequests />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />

                  {/* Catch all redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </FreelancerProvider>
            </AgentProvider>
          </PartnerProvider>
        </ProductProvider>
      </CartProvider>
    </BrowserRouter >
  );
}
