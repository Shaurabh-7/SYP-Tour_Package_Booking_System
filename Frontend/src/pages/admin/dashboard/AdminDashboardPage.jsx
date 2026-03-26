import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { getDashboardStats } from '../../../api/dashboard';
import './AdminDashboardPage.css';

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPackages: 0,
    totalBookings: 0,
    totalContacts: 0,
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
      <main className="admin-dashboard">
        <header className="dashboard-header">
          <p className="kicker">Admin Control Center</p>
          <h1>System Overview</h1>
          <p>Monitor your platform's overall performance and key metrics in real-time.</p>
        </header>

        {error && <div className="alert error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading metrics...</div>
        ) : (
          <section className="stats-grid">
            <div className="stat-card revenue">
              <h3>Total Revenue</h3>
              <p className="stat-value highlight">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="stat-card">
              <h3>Total Bookings</h3>
              <p className="stat-value">{stats.totalBookings}</p>
            </div>
            <div className="stat-card">
              <h3>Active Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Tour Packages</h3>
              <p className="stat-value">{stats.totalPackages}</p>
            </div>
            <div className="stat-card">
              <h3>Contact Inquiries</h3>
              <p className="stat-value">{stats.totalContacts}</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboardPage;
