import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../../api/packages';
import Navbar from '../../components/Navbar';
import PackageCard from '../../components/PackageCard';
import useAuth from '../../hooks/useAuth';
import './HomePage.css';

function HomePage() {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadPackages() {
      try {
        const data = await getPackages();
        if (!ignore) {
          setPackages(data.data || []);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPackages();

    return () => {
      ignore = true;
    };
  }, []);

  const featuredPackages = packages.slice(0, 3);

  return (
    <div className="page-shell">
      <Navbar />

      <main>
        {/* Full Width Hero */}
        <section className="hero-banner">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <span className="hero-kicker">Explore The Himalayas</span>
            <h1 className="hero-title">Experience the Magic of Nepal</h1>
            <p className="hero-subtitle">
              Discover breathtaking mountain escapes, spiritual cities, and unforgettable journeys tailored just for you.
            </p>
            <div className="hero-actions">
              <Link to="/packages" className="btn-hero-primary">
                View All Packages
              </Link>
              {!user && (
                <Link to="/register" className="btn-hero-secondary">
                  Join NepalYatra
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Featured Packages Section */}
        <section className="page-section featured-section">
          <div className="section-heading-centered">
            <span className="section-kicker">Top Destinations</span>
            <h2>Most Popular Journeys</h2>
            <p>Handpicked adventures that our travelers love.</p>
          </div>

          {loading ? <div className="page-status">Loading packages...</div> : null}
          {error ? <div className="page-status error">{error}</div> : null}

          {!loading && !error ? (
            <div className="package-grid">
              {featuredPackages.length ? (
                featuredPackages.map((packageItem) => <PackageCard key={packageItem.id} packageItem={packageItem} showAgency />)
              ) : (
                <div className="page-status">No packages are available yet.</div>
              )}
            </div>
          ) : null}

          <div className="view-all-container">
            <Link to="/packages" className="btn-view-all">Explore More Destinations</Link>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="why-choose-us">
          <div className="page-section">
            <div className="section-heading-centered">
              <span className="section-kicker">Why NepalYatra</span>
              <h2>Travel With Confidence</h2>
            </div>

            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h3>Verified Agencies</h3>
                <p>All our partner agencies are highly vetted to ensure you get the best and safest experience.</p>
              </div>
              <div className="benefit-card">
                <div className="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <h3>Flexible Itineraries</h3>
                <p>Find packages with flexible durations and activities that perfectly match your schedule.</p>
              </div>
              <div className="benefit-card">
                <div className="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                </div>
                <h3>Secure Booking</h3>
                <p>Reserve your spot easily and securely. Manage all your trips from a single, calm dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery / Inspiration */}
        <section className="inspiration-section page-section">
          <div className="inspiration-grid">
            <div className="insp-item main-insp" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80')" }}>
              <h3>Majestic Peaks</h3>
            </div>
            <div className="insp-column">
              <div className="insp-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80')" }}>
                <h3>Cultural Heritage</h3>
              </div>
              <div className="insp-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80')" }}>
                <h3>Diverse Wildlife</h3>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default HomePage;
