import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <Navbar />
      <main style={{ maxWidth: '600px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😞</div>
        <h1 style={{ fontSize: '1.8rem', color: '#991b1b' }}>Payment Cancelled</h1>
        <p style={{ color: '#64748b', marginTop: '12px', fontSize: '1.05rem' }}>
          Your payment was not completed. You can try again from your booking details page.
        </p>
        <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/bookings')}
            style={{
              padding: '12px 24px', borderRadius: '10px', border: 'none',
              background: '#f97316', color: '#fff', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Back to My Bookings
          </button>
        </div>
      </main>
    </div>
  );
}

export default PaymentFailurePage;
