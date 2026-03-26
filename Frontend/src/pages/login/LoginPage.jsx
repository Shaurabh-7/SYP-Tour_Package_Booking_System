import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import InputField from '../../components/InputField';
import Navbar from '../../components/Navbar';
import useAuth from '../../hooks/useAuth';
import './LoginPage.css';

function getRedirectPath(role) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'agency') return '/agency/dashboard';
  return '/home';
}

function LoginPage() {
  const { isAuthenticated, signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && user) {
    return <Navigate to={getRedirectPath(user.role)} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const nextUser = await signIn(email, password);
      const fallbackPath = getRedirectPath(nextUser.role);
      navigate(location.state?.from?.pathname || fallbackPath, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />

      <section className="login-page">
        <div className="login-shell">
          <div className="login-image-panel">
            <div className="login-image-content">
              <h1>Welcome Back to NepalYatra</h1>
              <p>Sign in to manage your bookings, discover new breathtaking destinations, and plan your next mountain escape seamlessly.</p>
            </div>
          </div>

          <div className="login-card-wrapper">
            <div className="login-card">
              <div className="login-card-top">
                <h2 className="login-title">Sign In</h2>
                <p className="login-subtitle">Access your account securely</p>
              </div>

              <Alert type="error" message={error} />

            <form className="login-form" onSubmit={handleSubmit}>
              <InputField
                label="Email Address"
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                name="email"
              />

              <InputField
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                name="password"
              />

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

              <p className="login-footer">
                Don&apos;t have an account? <Link to="/register">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
