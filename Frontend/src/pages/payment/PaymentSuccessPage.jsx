import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../../api/payments';
import Navbar from '../../components/Navbar';

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | failed
  const [message, setMessage] = useState('');
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    async function verify() {
      // eSewa redirects with ?data=BASE64_ENCODED_RESPONSE
      const encodedData = searchParams.get('data');

      if (!encodedData) {
        setStatus('failed');
        setMessage('No payment data received from eSewa.');
        return;
      }

      // Decode to extract booking ID for navigation
      try {
        const decoded = JSON.parse(atob(encodedData));
        const txUuid = decoded.transaction_uuid || '';
        const parts = txUuid.split('-');
        if (parts.length >= 2) {
          setBookingId(parseInt(parts[1], 10));
        }
      } catch {
        // ignore decode error for display
      }

      // Try verification with one retry
      let lastError = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          if (attempt > 0) {
            await new Promise(r => setTimeout(r, 2000)); // wait 2s before retry
          }
          const response = await verifyPayment(encodedData);
          if (response.success) {
            setStatus('success');
            setMessage(response.message || 'Payment completed successfully!');
            return;
          } else {
            lastError = response.message || 'Payment verification failed.';
          }
        } catch (err) {
          lastError = err.message || 'Payment verification failed.';
        }
      }

      setStatus('failed');
      setMessage(lastError || 'Payment verification failed.');
    }

    verify();
  }, [searchParams]);

  return (
    <div className="page-shell">
      <Navbar />
      <main style={{ maxWidth: '600px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        {status === 'verifying' && (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
            <h1 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Verifying your payment...</h1>
            <p style={{ color: '#64748b', marginTop: '12px' }}>Please wait while we confirm your transaction with eSewa.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
            <h1 style={{ fontSize: '1.8rem', color: '#166534' }}>Payment Successful!</h1>
            <p style={{ color: '#64748b', marginTop: '12px', fontSize: '1.05rem' }}>{message}</p>
            <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {bookingId && (
                <button
                  onClick={() => navigate(`/bookings/${bookingId}`)}
                  style={{
                    padding: '12px 24px', borderRadius: '10px', border: 'none',
                    background: '#f97316', color: '#fff', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  View Booking
                </button>
              )}
              <button
                onClick={() => navigate('/bookings')}
                style={{
                  padding: '12px 24px', borderRadius: '10px', border: '1px solid #cbd5e1',
                  background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer',
                }}
              >
                My Bookings
              </button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>❌</div>
            <h1 style={{ fontSize: '1.8rem', color: '#991b1b' }}>Payment Failed</h1>
            <p style={{ color: '#64748b', marginTop: '12px', fontSize: '1.05rem' }}>{message}</p>
            <div style={{ marginTop: '32px' }}>
              <button
                onClick={() => navigate('/bookings')}
                style={{
                  padding: '12px 24px', borderRadius: '10px', border: 'none',
                  background: '#f97316', color: '#fff', fontWeight: 700, cursor: 'pointer',
                }}
              >
                Back to Bookings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default PaymentSuccessPage;
