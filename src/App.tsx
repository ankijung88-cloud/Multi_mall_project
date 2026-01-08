import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { PartnerProvider } from './context/PartnerContext';
import { BoardProvider } from './context/BoardContext';
import { AgentProvider } from './context/AgentContext';
import { FreelancerProvider } from './context/FreelancerContext';

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
import ScheduleDetail from './pages/ScheduleDetail';
import BeautyPartners from './pages/BeautyPartners';
import CoursePartners from './pages/CoursePartners';
import PerformancePartners from './pages/PerformancePartners';
import AuditionPartners from './pages/AuditionPartners';
import FashionPartners from './pages/FashionPartners';
import Travel from './pages/Travel';
import Food from './pages/Food';
import Agents from './pages/Agents';
import AgentDetail from './pages/AgentDetail';
import Intro from './pages/Intro';
import Notice from './pages/Notice';
import Event from './pages/Event';
import News from './pages/News';
import Recruit from './pages/Recruit';

// Board Pages
import BoardPage from './pages/BoardPage';
import InquiryBoard from './pages/InquiryBoard';

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
import CommunityBoard from './pages/CommunityBoard';
import LinkGridPage from './pages/LinkGridPage';

import AdminAgentRequests from './pages/AdminAgentRequests';
import AdminContentRequests from './pages/AdminContentRequests';
import PersonalContentDetail from './pages/PersonalContentDetail';


import AllPersonalContents from './pages/AllPersonalContents';
import MyContents from './pages/MyContents';
import AssociatedContents from './pages/AssociatedContents';
import RegisterContent from './pages/RegisterContent';
import ActivityHistory from './pages/ActivityHistory';

// ... (imports)
import { useAuthStore } from './store/useAuthStore';
import ScrollToTop from './components/ScrollToTop';

// Protected Route Component
const ProtectedRoute = ({ children, allowedType }: { children: ReactNode, allowedType?: 'personal' | 'company' | 'admin' }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const userType = useAuthStore(state => state.userType);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isCompany = searchParams.get('type') === 'company';

  if (!isAuthenticated) {
    // Redirect to appropriate login if trying to access admin
    if (allowedType === 'admin') return <Navigate to="/admin/login" replace />;
    return <Navigate to={`/login?type=${isCompany ? 'company' : 'personal'}`} replace />;
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
    <BrowserRouter basename="/multiserver">
      <ScrollToTop />
      <CartProvider>
        <ProductProvider>
          <PartnerProvider>
            <AgentProvider>
              <FreelancerProvider>
                <BoardProvider>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Welcome />} />
                    {/* ... (existing public routes) ... */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/partners" element={<Partners />} />

                    {/* K-Culture Board Routes */}
                    <Route path="/partners/inquiry" element={<InquiryBoard />} />
                    <Route path="/partners/news" element={<BoardPage type="partner-news" title="파트너 뉴스" subtitle="K-Culture 파트너들의 최신 소식을 전해드립니다." />} />
                    <Route path="/partners/success" element={<BoardPage type="partner-success" title="성공 사례" subtitle="함께 만들어낸 성공적인 비즈니스 사례를 소개합니다." />} />
                    <Route path="/partners/guide" element={<BoardPage type="partner-guide" title="가이드" subtitle="파트너십 이용을 위한 상세 가이드입니다." />} />

                    <Route path="/partners/course" element={<CoursePartners />} />
                    <Route path="/partners/beauty" element={<BeautyPartners />} />
                    <Route path="/partners/performance" element={<PerformancePartners />} />
                    <Route path="/partners/audition" element={<AuditionPartners />} />
                    <Route path="/partners/fashion" element={<FashionPartners />} />
                    <Route path="/partners/travel" element={<Travel />} />
                    <Route path="/partners/food" element={<Food />} />
                    <Route path="/partners/:id" element={<PartnerDetail />} />
                    <Route path="/partners/:partnerId/schedules/:scheduleId" element={<ScheduleDetail />} />
                    <Route path="/agents" element={<Agents />} />
                    <Route path="/agents/:id" element={<AgentDetail />} />


                    {/* Home Submenus */}
                    <Route path="/intro" element={<Intro />} />
                    <Route path="/notice" element={<Notice />} />
                    <Route path="/event" element={<Event />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/recruit" element={<Recruit />} />

                    <Route path="/find-account" element={<FindAccount />} />

                    {/* Admin Public Route */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Protected Routes */}
                    <Route path="/personal" element={<PersonalHome />} />
                    <Route path="/company" element={<CompanyHome />} />
                    <Route path="/contents" element={<AllPersonalContents />} />
                    <Route path="/contents/my" element={<ProtectedRoute><MyContents /></ProtectedRoute>} />
                    <Route path="/contents/interest" element={<ProtectedRoute><AssociatedContents /></ProtectedRoute>} />
                    <Route path="/contents/register" element={<ProtectedRoute><RegisterContent /></ProtectedRoute>} />
                    <Route path="/contents/history" element={<ProtectedRoute><ActivityHistory /></ProtectedRoute>} />
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

                    {/* Community Routes */}
                    <Route path="/community/reservation" element={<CommunityBoard category="reservation" />} />
                    <Route path="/community/info" element={<CommunityBoard category="info" />} />
                    <Route path="/community/center" element={<CommunityBoard category="center" />} />

                    <Route path="/community/airline" element={<LinkGridPage category="airline" />} />
                    <Route path="/community/hotel" element={<LinkGridPage category="hotel" />} />
                    <Route path="/community/transport" element={<LinkGridPage category="transport" />} />

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
                    <Route path="/agents/guide" element={<BoardPage type="agent-guide" title="에이전트 이용 가이드" subtitle="서비스 이용을 위한 상세 가이드입니다." />} />
                    <Route path="/agents/fee" element={<BoardPage type="agent-fee" title="수수료 안내" subtitle="투명하고 합리적인 수수료 정책을 안내합니다." />} />
                    <Route path="/agents/reviews" element={<BoardPage type="agent-reviews" title="사용자 후기" subtitle="실제 사용자들이 남긴 생생한 후기입니다." />} />
                  </Routes>
                </BoardProvider>
              </FreelancerProvider>
            </AgentProvider>
          </PartnerProvider>
        </ProductProvider>
      </CartProvider>
    </BrowserRouter >
  );
}
