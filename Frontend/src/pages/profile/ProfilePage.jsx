import { useEffect, useState } from 'react';
import Alert from '../../components/Alert';
import InputField from '../../components/InputField';
import Navbar from '../../components/Navbar';
import { updateUser } from '../../api/users';
import { submitAgencyRequest, getMyAgencyRequest } from '../../api/agencyRequests';
import useAuth from '../../hooks/useAuth';
import './ProfilePage.css';

function ProfilePage() {
  const { updateLocalUser, user } = useAuth();
  const [formData, setFormData] = useState({
    address: user?.address || '',
    email: user?.email || '',
    name: user?.name || '',
    password: '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Agency request state
  const [showAgencyForm, setShowAgencyForm] = useState(false);
  const [agencyRequest, setAgencyRequest] = useState(null);
  const [agencyLoading, setAgencyLoading] = useState(false);
  const [agencyForm, setAgencyForm] = useState({
    agencyName: '',
    address: '',
    phone: '',
    description: '',
    licenseNumber: '',
  });

  useEffect(() => {
    if (user?.role === 'customer') {
      loadAgencyRequest();
    }
  }, [user?.role]);

  async function loadAgencyRequest() {
    try {
      const res = await getMyAgencyRequest();
      setAgencyRequest(res.data || null);
    } catch {
      // silently fail
    }
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
    setMessage('');
    setLoading(true);

    try {
      const payload = {
        address: formData.address,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
      };

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const data = await updateUser(user.id, payload);
      updateLocalUser(data.data);
      setFormData({
        address: '',
        email: '',
        name: '',
        password: '',
        phone: '',
      });
      setMessage('Profile updated successfully.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAgencyChange(e) {
    const { name, value } = e.target;
    setAgencyForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAgencySubmit(e) {
    e.preventDefault();
    setAgencyLoading(true);
    setError('');
    setMessage('');

    try {
      await submitAgencyRequest(agencyForm);
      setMessage('Agency request submitted! You will be notified once it is reviewed.');
      setShowAgencyForm(false);
      loadAgencyRequest();
    } catch (err) {
      setError(err.message || 'Failed to submit agency request.');
    } finally {
      setAgencyLoading(false);
    }
  }

  const statusBadgeColors = {
    pending: { bg: '#fef3c7', color: '#92400e', border: '#fbbf24' },
    approved: { bg: '#d1fae5', color: '#065f46', border: '#34d399' },
    rejected: { bg: '#fee2e2', color: '#991b1b', border: '#f87171' },
  };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="profile-page">
        <section className="profile-header">
          <p className="section-kicker">My Profile</p>
          <h1>Manage your account details and preferences.</h1>
          <p className="profile-subtitle">Keep your personal information up to date for seamless bookings and communication.</p>
        </section>

        <section className="profile-card">
          <Alert type="success" message={message} />
          <Alert type="error" message={error} />

          <form className="profile-form" onSubmit={handleSubmit}>
            <InputField
              label="Full Name"
              id="profile-name"
              value={formData.name}
              onChange={handleChange}
              name="name"
              disabled={loading}
            />

            <InputField
              label="Email Address"
              id="profile-email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              name="email"
              disabled={loading}
            />

            <InputField
              label="Phone Number"
              id="profile-phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              name="phone"
              disabled={loading}
            />

            <InputField
              label="New Password"
              id="profile-password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              name="password"
              placeholder="Leave blank to keep current password"
              disabled={loading}
            />

            <div className="input-field">
              <label htmlFor="profile-address">Address</label>
              <textarea
                id="profile-address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Saving changes...' : 'Save Profile'}
            </button>
          </form>
        </section>

        {/* Agency Registration Section — only for customers */}
        {user?.role === 'customer' && (
          <section className="agency-section">
            <h2 className="agency-section-title">Agency Registration</h2>

            {agencyRequest ? (
              <div className="agency-status-card">
                <div className="agency-status-header">
                  <span className="agency-status-label">Request Status:</span>
                  <span
                    className="agency-status-badge"
                    style={{
                      background: statusBadgeColors[agencyRequest.status]?.bg,
                      color: statusBadgeColors[agencyRequest.status]?.color,
                      border: `1px solid ${statusBadgeColors[agencyRequest.status]?.border}`,
                    }}
                  >
                    {agencyRequest.status.charAt(0).toUpperCase() + agencyRequest.status.slice(1)}
                  </span>
                </div>
                <div className="agency-status-details">
                  <p><strong>Agency Name:</strong> {agencyRequest.agencyName}</p>
                  <p><strong>License #:</strong> {agencyRequest.licenseNumber}</p>
                  {agencyRequest.status === 'rejected' && agencyRequest.adminRemarks && (
                    <p className="agency-rejection-reason">
                      <strong>Reason:</strong> {agencyRequest.adminRemarks}
                    </p>
                  )}
                </div>
                {agencyRequest.status === 'pending' && (
                  <p className="agency-pending-note">Your request is under review. You will be notified once it is processed.</p>
                )}
              </div>
            ) : (
              <>
                {!showAgencyForm ? (
                  <div className="agency-cta">
                    <p>Want to list your own tour packages? Register as an agency to get started.</p>
                    <button className="btn-agency-register" onClick={() => setShowAgencyForm(true)}>
                      Register as Agency
                    </button>
                  </div>
                ) : (
                  <form className="agency-form" onSubmit={handleAgencySubmit}>
                    <InputField
                      label="Agency Name"
                      id="agency-name"
                      name="agencyName"
                      value={agencyForm.agencyName}
                      onChange={handleAgencyChange}
                      disabled={agencyLoading}
                      required
                    />
                    <InputField
                      label="Address"
                      id="agency-address"
                      name="address"
                      value={agencyForm.address}
                      onChange={handleAgencyChange}
                      disabled={agencyLoading}
                      required
                    />
                    <InputField
                      label="Phone Number"
                      id="agency-phone"
                      type="tel"
                      name="phone"
                      value={agencyForm.phone}
                      onChange={handleAgencyChange}
                      disabled={agencyLoading}
                      required
                    />
                    <InputField
                      label="License Number"
                      id="agency-license"
                      name="licenseNumber"
                      value={agencyForm.licenseNumber}
                      onChange={handleAgencyChange}
                      disabled={agencyLoading}
                      required
                    />
                    <div className="input-field">
                      <label htmlFor="agency-description">Description</label>
                      <textarea
                        id="agency-description"
                        name="description"
                        value={agencyForm.description}
                        onChange={handleAgencyChange}
                        rows="4"
                        placeholder="Tell us about your agency, the services you offer, etc."
                        disabled={agencyLoading}
                        required
                      />
                    </div>
                    <div className="agency-form-actions">
                      <button type="submit" disabled={agencyLoading}>
                        {agencyLoading ? 'Submitting...' : 'Submit Request'}
                      </button>
                      <button type="button" className="btn-cancel" onClick={() => setShowAgencyForm(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
