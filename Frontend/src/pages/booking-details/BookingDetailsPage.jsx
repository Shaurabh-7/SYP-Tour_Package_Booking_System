import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBookingById } from '../../api/bookings';
import { initiatePayment } from '../../api/payments';
import Navbar from '../../components/Navbar';
import './BookingDetailsPage.css';

function BookingDetailsPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    async function loadBooking() {
      try {
        const data = await getBookingById(id);
        if (!ignore) {
          setBooking(data.data);
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

    loadBooking();

    return () => {
      ignore = true;
    };
  }, [id]);

  async function handlePayWithEsewa() {
    setPayLoading(true);
    try {
      const response = await initiatePayment(booking.id);
      if (response.success) {
        const { gatewayUrl, formData } = response.data;

        // Build and auto-submit a hidden form
        const form = formRef.current;
        form.action = gatewayUrl;
        form.method = 'POST';
        form.innerHTML = '';

        // Add success and failure URLs
        const successUrl = `${window.location.origin}/payment/success`;
        const failureUrl = `${window.location.origin}/payment/failure`;

        const allFields = {
          ...formData,
          success_url: successUrl,
          failure_url: failureUrl,
        };

        Object.entries(allFields).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        form.submit();
      }
    } catch (err) {
      alert(err.message || 'Failed to initiate payment');
      setPayLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <Navbar />

      <main className="booking-details-page">
        {loading ? <div className="page-status">Loading booking details...</div> : null}
        {error ? <div className="page-status error">{error}</div> : null}

        {!loading && !error && booking ? (
          <section className="booking-detail-card">
            <p className="section-kicker">Booking Detail</p>
            <h1>{booking.TourPackage?.name || `Booking #${booking.id}`}</h1>
            <p className="booking-detail-copy">
              Review your booking details and complete your payment below.
            </p>

            <div className="booking-detail-grid">
              <div>
                <span>Destination</span>
                <strong>{booking.TourPackage?.destination || 'Not available'}</strong>
              </div>
              <div>
                <span>Booking Status</span>
                <strong>{booking.status}</strong>
              </div>
              <div>
                <span>Payment Status</span>
                <strong className={`payment-status ${booking.paymentStatus}`}>
                  {booking.paymentStatus === 'paid' ? '✅ Paid' : booking.paymentStatus}
                </strong>
              </div>
              <div>
                <span>Travelers</span>
                <strong>{booking.numberOfPeople}</strong>
              </div>
              <div>
                <span>Total Amount</span>
                <strong>NPR {Number(booking.totalAmount || 0).toLocaleString()}</strong>
              </div>
              <div>
                <span>Booked By</span>
                <strong>{booking.User?.name || 'Current user'}</strong>
              </div>
            </div>

            {/* eSewa Payment Button */}
            {booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' && (
              <div className="payment-action">
                <button
                  className="btn-esewa"
                  onClick={handlePayWithEsewa}
                  disabled={payLoading}
                >
                  {payLoading ? 'Redirecting to eSewa...' : '💳 Pay with eSewa'}
                </button>
                <p className="payment-note">You will be redirected to eSewa to complete your payment securely.</p>
              </div>
            )}

            {booking.paymentStatus === 'paid' && (
              <div className="payment-success-banner">
                <span>✅</span>
                <p>Payment completed! Your booking is confirmed.</p>
              </div>
            )}

            <div className="booking-detail-actions">
              <Link to="/bookings">Back to My Bookings</Link>
              {booking.TourPackage?.id ? <Link to={`/packages/${booking.TourPackage.id}`}>Open Package</Link> : null}
            </div>
          </section>
        ) : null}
      </main>

      {/* Hidden form for eSewa redirect */}
      <form ref={formRef} style={{ display: 'none' }} />
    </div>
  );
}

export default BookingDetailsPage;
