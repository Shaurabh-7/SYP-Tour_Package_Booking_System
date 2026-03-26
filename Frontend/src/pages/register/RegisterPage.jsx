import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import InputField from '../../components/InputField';
import Navbar from '../../components/Navbar';
import useAuth from '../../hooks/useAuth';
import './RegisterPage.css';

function RegisterPage() {
  const { isAuthenticated, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    email: '',
    name: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'customer' ? '/home' : user.role === 'agency' ? '/agency/dashboard' : '/admin/dashboard'} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previousState) => ({
      ...previousState,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in name, email, and password.');
      return;
    }

    setLoading(true);
    try {
      await signUp(formData);
      navigate('/home', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />

      <section className="register-page">
        <div className="register-shell">
          <div className="register-image-panel">
            <div className="register-image-content">
              <h1>Start Your Journey</h1>
              <p>Join thousands of travelers who discover the beauty of Nepal with curated, flexible, and premium packages.</p>
            </div>
          </div>

          <div className="register-card-wrapper">
            <div className="register-card">
              <div className="register-card-top">
                <h2 className="register-title">Create Account</h2>
                <p className="register-subtitle">Start planning your next journey with NepalYatra.</p>
              </div>

              <Alert type="error" message={error} />

            <form className="register-form" onSubmit={handleSubmit}>
              <InputField
                label="Full Name"
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={loading}
                name="name"
              />

              <InputField
                label="Email Address"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
                name="email"
              />

              <InputField
                label="Password"
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                disabled={loading}
                name="password"
              />

              <InputField
                label="Phone Number"
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="98XXXXXXXX"
                disabled={loading}
                name="phone"
              />

              <div className="input-field">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  disabled={loading}
                  rows="4"
                />
              </div>

              <button type="submit" className="btn-register-submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

              <p className="register-footer">
                Already have an account? <Link to="/login">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RegisterPage;
