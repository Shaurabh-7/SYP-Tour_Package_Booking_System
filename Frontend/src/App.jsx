import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './routes/ProtectedRoute';
import Footer from './components/Footer';
import AdminDashboardPage from './pages/admin/dashboard/AdminDashboardPage';
import AdminUsersPage from './pages/admin/users/AdminUsersPage';
import AdminPackagesPage from './pages/admin/packages/AdminPackagesPage';
import AdminBookingsPage from './pages/admin/bookings/AdminBookingsPage';
import AdminContactsPage from './pages/admin/contacts/AdminContactsPage';
import AdminAgencyRequestsPage from './pages/admin/agency-requests/AdminAgencyRequestsPage';
import AgencyDashboardPage from './pages/agency/dashboard/AgencyDashboardPage';
import AgencyPackagesPage from './pages/agency/packages/AgencyPackagesPage';
import AgencyBookingsPage from './pages/agency/bookings/AgencyBookingsPage';
import AboutPage from './pages/about/AboutPage';
import BookingDetailsPage from './pages/booking-details/BookingDetailsPage';
import BookingsPage from './pages/bookings/BookingsPage';
import ContactPage from './pages/contact/ContactPage';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import PackageDetailsPage from './pages/package-details/PackageDetailsPage';
import PackagesPage from './pages/packages/PackagesPage';
import ProfilePage from './pages/profile/ProfilePage';
import RegisterPage from './pages/register/RegisterPage';
import PaymentSuccessPage from './pages/payment/PaymentSuccessPage';
import PaymentFailurePage from './pages/payment/PaymentFailurePage';
import './index.css';

function RootRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="page-status">Loading your workspace...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === 'agency') {
    return <Navigate to="/agency/dashboard" replace />;
  }

  return <Navigate to="/home" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/packages" element={<PackagesPage />} />
      <Route path="/packages/:id" element={<PackageDetailsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/:id" element={<BookingDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Payment callbacks — outside ProtectedRoute so eSewa redirects always work */}
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/failure" element={<PaymentFailurePage />} />

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/packages" element={<AdminPackagesPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        <Route path="/admin/contacts" element={<AdminContactsPage />} />
        <Route path="/admin/agency-requests" element={<AdminAgencyRequestsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['agency']} />}>
        <Route path="/agency/dashboard" element={<AgencyDashboardPage />} />
        <Route path="/agency/packages" element={<AgencyPackagesPage />} />
        <Route path="/agency/bookings" element={<AgencyBookingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppRoutes />
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
