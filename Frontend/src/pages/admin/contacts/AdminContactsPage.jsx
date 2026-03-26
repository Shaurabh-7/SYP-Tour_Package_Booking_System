import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { getAllContacts, deleteContact } from '../../../api/contacts';
import '../AdminShared.css';

function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    setLoading(true);
    try {
      const response = await getAllContacts();
      setContacts(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await deleteContact(id);
      loadContacts();
    } catch (err) {
      alert(err.message || 'Failed to delete contact request');
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="admin-page-container">
        <header className="admin-header">
          <div>
            <h1>Contact Inquiries</h1>
            <p>Review and manage messages submitted by customers via the contact form.</p>
          </div>
        </header>

        {error && <div className="alert error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading inquiries...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Customer Info</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      No contact inquiries found.
                    </td>
                  </tr>
                ) : null}
                {contacts.map(c => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(c.createdAt)}</td>
                    <td>
                      <strong>{c.name}</strong><br/>
                      <small style={{ color: '#64748b' }}>{c.email}</small>
                    </td>
                    <td>{c.subject || '-'}</td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>{c.message}</td>
                    <td className="action-cells">
                      <button 
                        className="btn-text danger"
                        onClick={() => handleDelete(c.id)}
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

export default AdminContactsPage;
