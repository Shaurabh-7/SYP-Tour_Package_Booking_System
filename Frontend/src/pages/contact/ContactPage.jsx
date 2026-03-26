import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Alert from '../../components/Alert';
import InputField from '../../components/InputField';
import { submitContact } from '../../api/contacts';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      setLoading(false);
      setStatus({ type: 'success', message: 'Thank you for reaching out! Your message has been sent successfully.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (apiError) {
      setLoading(false);
      setStatus({ type: 'error', message: apiError.response?.data?.message || apiError.message || 'Failed to send message.' });
    }
  }

  return (
    <div className="page-shell">
      <Navbar />

      <main className="contact-page">
        <section className="contact-hero">
          <p className="section-kicker">Get in Touch</p>
          <h1>We're here to help you plan your perfect adventure.</h1>
          <p>Whether you have a question about a package or need custom travel arrangements, reach out to our team.</p>
        </section>

        <section className="contact-container">
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p className="contact-info-desc">Feel free to reach out to us through any of the following channels.</p>

            <div className="info-grid">
              <article>
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <span>Email</span>
                  <strong>nepalyatra.explore@gmail.com</strong>
                  <p>For inquiries, bookings and support.</p>
                </div>
              </article>
              <article>
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>+977-9826228311</strong>
                  <p>Our direct line for fast coordination.</p>
                </div>
              </article>
              <article>
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <span>Office</span>
                  <strong>Itahari, Nepal</strong>
                  <p>Visit our home base for face-to-face planning.</p>
                </div>
              </article>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h2>Send us a Message</h2>
            {status.message && <Alert type={status.type} message={status.message} />}
            <form className="contact-form" onSubmit={handleSubmit}>
              <InputField
                label="Full Name *"
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={loading}
              />
              <InputField
                label="Email Address *"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
              />
              <InputField
                label="Subject"
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                disabled={loading}
              />

              <div className="input-field">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  disabled={loading}
                  rows="5"
                />
              </div>

              <button type="submit" className="btn-submit-contact" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ContactPage;
