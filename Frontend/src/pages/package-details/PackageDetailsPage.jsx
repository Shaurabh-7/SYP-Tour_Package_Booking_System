import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createBooking } from '../../api/bookings';
import { getPackageById } from '../../api/packages';
import Alert from '../../components/Alert';
import Navbar from '../../components/Navbar';
import useAuth from '../../hooks/useAuth';
import './PackageDetailsPage.css';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';

function PackageDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [packageItem, setPackageItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [people, setPeople] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadPackage() {
      try {
        const data = await getPackageById(id);
        if (!ignore) {
          setPackageItem(data.data);
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

    loadPackage();

    return () => {
      ignore = true;
    };
  }, [id]);

  const totalAmount = useMemo(() => {
    if (!packageItem) return 0;
    return Number(packageItem.price || 0) * people;
  }, [packageItem, people]);

  async function handleBookNow() {
    if (!isAuthenticated || user?.role !== 'customer') {
      setBookingError('Please log in as a customer to create a booking.');
      return;
    }

    setBookingError('');
    setBookingMessage('');
    setIsBooking(true);

    try {
      await createBooking({
        numberOfPeople: people,
        packageId: packageItem.id,
      });
      setBookingMessage('Booking created successfully. You can review it from My Bookings.');
    } catch (requestError) {
      setBookingError(requestError.message);
    } finally {
      setIsBooking(false);
    }
  }

  const mapUrl = packageItem
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(packageItem.destination)}`
    : '#';

  return (
    <div className="page-shell">
      <Navbar />

      <main className="package-details-page">
        {loading ? <div className="page-status">Loading package details...</div> : null}
        {error ? <div className="page-status error">{error}</div> : null}

        {!loading && !error && packageItem ? (
          <section className="package-details-layout">
            <div className="package-visual">
              <img
                src={packageItem.imageUrl || FALLBACK_IMAGE}
                alt={packageItem.name}
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            </div>

            <div className="package-details-card">
              <p className="section-kicker">Package Details</p>
              <h1>{packageItem.name}</h1>
              <p className="package-details-copy">
                {packageItem.description || 'A carefully curated travel experience designed to give you memories that last a lifetime. Enjoy seamless guidance and breathtaking views.'}
              </p>

              <div className="package-details-meta">
                <div>
                  <span>Destination</span>
                  <strong>{packageItem.destination}</strong>
                </div>
                <div>
                  <span>Duration</span>
                  <strong>{packageItem.durationDays ? `${packageItem.durationDays} days` : 'Flexible'}</strong>
                </div>
                <div>
                  <span>Base Price</span>
                  <strong>NPR {Number(packageItem.price || 0).toLocaleString()}</strong>
                </div>
              </div>

              <div className="booking-panel">
                <h2>Reserve Your Spot</h2>
                <p>Select the number of travelers to calculate your total and secure your booking today.</p>

                <label htmlFor="people">Number of Travelers</label>
                <input
                  id="people"
                  type="number"
                  min="1"
                  value={people}
                  onChange={(event) => setPeople(Math.max(1, Number(event.target.value) || 1))}
                />

                <div className="booking-summary">
                  <span>Estimated total</span>
                  <strong>NPR {totalAmount.toLocaleString()}</strong>
                </div>

                <Alert type="success" message={bookingMessage} />
                <Alert type="error" message={bookingError} />

                <div className="package-details-actions">
                  <button type="button" onClick={handleBookNow} disabled={isBooking}>
                    {isBooking ? 'Creating booking...' : 'Book Now'}
                  </button>
                  <a href={mapUrl} target="_blank" rel="noreferrer">
                    Show on Map
                  </a>
                  <Link to="/packages">Back to Packages</Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default PackageDetailsPage;
