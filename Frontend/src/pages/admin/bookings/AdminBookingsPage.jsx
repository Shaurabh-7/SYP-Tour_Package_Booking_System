import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { getBookings, updateBooking, deleteBooking } from '../../../api/bookings';
import '../AdminShared.css';

function AdminBookingsPage() {
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



  async function handleDelete(id) {
    if (!window.confirm('Are you certain you want to delete this booking? This will cancel the reservation.')) return;
    try {
      await deleteBooking(id);
      loadBookings();
    } catch (err) {
      alert(err.message || 'Failed to delete booking');
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
            <h1>Booking Management</h1>
            <p>Track reservations, process payments, and update booking lifecycles.</p>
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
                  <th>Total Amount</th>
                  <th>Booking Status</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
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
                    <td>{b.TourPackage?.name || 'Deleted Package'}</td>
                    <td>{formatCurrency(b.totalAmount)}</td>
                    <td>
                      <span style={{ textTransform: 'capitalize' }}>{b.status}</span>
                    </td>
                    <td>
                      <span style={{ textTransform: 'capitalize' }}>{b.paymentStatus}</span>
                    </td>
                    <td className="action-cells">
                      <button 
                        className="btn-text danger"
                        onClick={() => handleDelete(b.id)}
                      >
                        Delete
                      </button>
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

export default AdminBookingsPage;
