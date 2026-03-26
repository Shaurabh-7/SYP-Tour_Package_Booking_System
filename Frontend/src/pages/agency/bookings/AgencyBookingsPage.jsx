import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { getBookings, updateBooking } from '../../../api/bookings';
import '../../admin/AdminShared.css';

function AgencyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    try {
      const response = await getBookings();
      setBookings(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await updateBooking(id, { status: newStatus });
      loadBookings();
    } catch (err) {
      alert(err.message || 'Failed to update booking status');
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(amount);
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="admin-page-container">
        <header className="admin-header">
          <div>
            <h1>Manage My Bookings</h1>
            <p>Update booking statuses and track reservations for your packages.</p>
          </div>
        </header>

        {error && <div className="alert error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading bookings...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Package</th>
                  <th>Amount</th>
                  <th>Booking Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>
                      <strong>{b.User?.name}</strong><br/>
                      <small style={{ color: '#64748b' }}>{b.User?.email}</small>
                    </td>
                    <td>{b.TourPackage?.name || 'Deleted'}</td>
                    <td>{formatCurrency(b.totalAmount)}</td>
                    <td>
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`inline-select ${b.status}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <span className={`status-badge ${b.paymentStatus}`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default AgencyBookingsPage;
