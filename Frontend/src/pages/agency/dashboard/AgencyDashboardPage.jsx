import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { getDashboardStats } from '../../../api/dashboard';
import { useNavigate } from 'react-router-dom';
import './AgencyDashboardPage.css';

function AgencyDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    async function loadStats() {
      try {
        const response = await getDashboardStats();
        if (!ignore && response.success) {
          setStats(response.data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to fetch dashboard statistics.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadStats();
    return () => { ignore = true; };
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(amount);
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="agency-dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <p className="kicker">Business Control Center</p>
            <h1>Agency Overview</h1>
            <p>Track your sales, manage your tours, and monitor customer engagement in real-time.</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => navigate('/agency/packages')}>
              + Manage My Tours
            </button>
          </div>
        </header>

        {error && <div className="alert error">{error}</div>}

        {loading ? (
          <div className="loading-state">Syncing your business data...</div>
        ) : (
          <>
            <section className="stats-grid">
              <div className="stat-card revenue">
                <h3>Total Earnings</h3>
                <p className="stat-value highlight">{formatCurrency(stats.totalRevenue)}</p>
                <span className="stat-trend">Platform lifetime revenue</span>
              </div>
              <div className="stat-card">
                <h3>Live Bookings</h3>
                <p className="stat-value">{stats.totalBookings}</p>
                <span className="stat-link" onClick={() => navigate('/agency/bookings')}>View All Bookings →</span>
              </div>
              <div className="stat-card">
                <h3>Active Tours</h3>
                <p className="stat-value">{stats.totalPackages}</p>
                <span className="stat-link" onClick={() => navigate('/agency/packages')}>Update Listings →</span>
              </div>
            </section>

            <section className="quick-actions-panel">
              <div className="action-card" onClick={() => navigate('/agency/packages')}>
                <div className="action-icon">✈️</div>
                <div className="action-text">
                  <h4>New Tour Package</h4>
                  <p>Expand your business by adding a new destination or tour.</p>
                </div>
              </div>
              <div className="action-card" onClick={() => navigate('/agency/bookings')}>
                <div className="action-icon">📝</div>
                <div className="action-text">
                  <h4>Pending Bookings</h4>
                  <p>Check for recent reservations that need your confirmation.</p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default AgencyDashboardPage;
