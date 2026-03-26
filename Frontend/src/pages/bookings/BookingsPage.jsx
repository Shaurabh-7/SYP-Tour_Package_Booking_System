import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteBooking, getBookings } from '../../api/bookings';
import Alert from '../../components/Alert';
import Navbar from '../../components/Navbar';
import './BookingsPage.css';

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadBookings() {
      try {
        const data = await getBookings();
        if (!ignore) {
          setBookings(data.data || []);
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

    loadBookings();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleCancel(bookingId) {
    setError('');
    setMessage('');

    try {
      await deleteBooking(bookingId);
      setBookings((currentBookings) => currentBookings.filter((booking) => booking.id !== bookingId));
      setMessage('Booking cancelled successfully.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="page-shell">
      <Navbar />

      <main className="bookings-page">
        <section className="bookings-header">
          <p className="section-kicker">My Bookings</p>
          <h1>Track your upcoming adventures.</h1>
          <p>View your reservations, check payment statuses, and manage your booked packages easily.</p>
        </section>

        <Alert type="success" message={message} />
        <Alert type="error" message={error} />

        {loading ? <div className="page-status">Loading bookings...</div> : null}

        {!loading ? (
          <div className="booking-list">
            {bookings.length ? (
              bookings.map((booking) => (
                <article className="booking-card" key={booking.id}>
                  <div>
                    <p className="booking-label">Package</p>
                    <h2>{booking.TourPackage?.name || `Package #${booking.packageId}`}</h2>
                    <p className="booking-subtext">{booking.TourPackage?.destination || 'Destination unavailable'}</p>
                  </div>

                  <div className="booking-meta">
                    <div>
                      <span>Status</span>
                      <strong>{booking.status}</strong>
                    </div>
                    <div>
                      <span>Payment</span>
                      <strong>{booking.paymentStatus}</strong>
                    </div>
                    <div>
                      <span>Travelers</span>
                      <strong>{booking.numberOfPeople}</strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>NPR {Number(booking.totalAmount || 0).toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <Link to={`/bookings/${booking.id}`}>View Details</Link>
                    <button type="button" onClick={() => handleCancel(booking.id)}>
                      Cancel Booking
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="page-status">You have not created any bookings yet.</div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default BookingsPage;
