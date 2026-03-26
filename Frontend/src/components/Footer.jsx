import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <svg className="footer-logo-icon" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 25 L12 8 L18 16 L23 10 L33 25 Z" fill="#fb923c" opacity="0.9" />
              <path d="M10 25 L18 12 L26 25 Z" fill="#ea580c" opacity="0.7" />
            </svg>
            <span className="footer-logo-text">NepalYatra</span>
          </Link>
          <p className="footer-description">
            Your trusted partner for discovering the wonders of Nepal. Experience majestic mountains, rich culture, and seamless journeys.
          </p>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-title">Explore</h4>
          <Link to="/packages" className="footer-link">All Packages</Link>
          <Link to="/about" className="footer-link">About Us</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-title">Legal</h4>
          <Link to="#" className="footer-link">Terms of Service</Link>
          <Link to="#" className="footer-link">Privacy Policy</Link>
          <Link to="#" className="footer-link">Cookie Policy</Link>
        </div>

        <div className="footer-social">
          <h4 className="footer-title">Connect</h4>
          <div className="social-icons">
             <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
             <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
             <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NepalYatra. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
