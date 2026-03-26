import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import NotificationBell from './NotificationBell';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, signOut, user } = useAuth();
  
  const isLoginPage = location.pathname === '/login';

  const guestLinks = [
    { label: 'Home', to: '/home' },
    { label: 'Packages', to: '/packages' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const customerLinks = [
    { label: 'Home', to: '/home' },
    { label: 'Packages', to: '/packages' },
    { label: 'My Bookings', to: '/bookings' },
    { label: 'Profile', to: '/profile' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const agencyLinks = [
    { label: 'Dashboard', to: '/agency/dashboard' },
    { label: 'Manage Tours', to: '/agency/packages' },
    { label: 'Manage Bookings', to: '/agency/bookings' },
    { label: 'Contact', to: '/contact' },
  ];

  const adminLinks = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Users', to: '/admin/users' },
    { label: 'Tours', to: '/admin/packages' },
    { label: 'Bookings', to: '/admin/bookings' },
    { label: 'Inquiries', to: '/admin/contacts' },
    { label: 'Agency Requests', to: '/admin/agency-requests' },
  ];

  const links = !isAuthenticated
    ? guestLinks
    : user?.role === 'admin'
      ? adminLinks
      : user?.role === 'agency'
        ? agencyLinks
        : customerLinks;

  async function handleLogout() {
    await signOut();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-link">
          <svg className="logo-icon" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 25 L12 8 L18 16 L23 10 L33 25 Z" fill="#e67e22" opacity="0.9" />
            <path d="M10 25 L18 12 L26 25 Z" fill="#c0392b" opacity="0.7" />
          </svg>
          <span className="logo-text">
            <span className="logo-nepal">Nepal</span>
            <span className="logo-yatra">Yatra</span>
          </span>
        </Link>
      </div>
      <div className="navbar-links">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}

        {isAuthenticated ? (
          <>
            {user?.role !== 'admin' && <NotificationBell />}
            <span className="navbar-user">{user?.name}</span>
            <button type="button" className="btn-register btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={isLoginPage ? 'btn-register' : 'nav-link'}>
              Login
            </Link>
            <Link to="/register" className={!isLoginPage ? 'btn-register' : 'nav-link'}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
