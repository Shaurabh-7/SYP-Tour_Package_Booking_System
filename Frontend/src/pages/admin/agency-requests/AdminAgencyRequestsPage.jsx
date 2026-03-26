import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { getAllAgencyRequests, handleAgencyRequest } from '../../../api/agencyRequests';
import '../AdminShared.css';

function AdminAgencyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    try {
      const response = await getAllAgencyRequests();
      setRequests(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch agency requests');
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id, status) {
    let adminRemarks = '';
    if (status === 'rejected') {
      adminRemarks = window.prompt('Provide a reason for rejection (optional):') || '';
    }

    try {
      await handleAgencyRequest(id, { status, adminRemarks });
      loadRequests();
    } catch (err) {
      alert(err.message || `Failed to ${status} request`);
    }
  }

  const statusColors = {
    pending: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="admin-page-container">
        <header className="admin-header">
          <div>
            <h1>Agency Requests</h1>
            <p>Review and manage agency registration requests from customers.</p>
          </div>
        </header>

        {error && <div className="alert error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="loading-state" style={{ color: '#94a3b8' }}>No agency requests yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Agency Name</th>
                  <th>License #</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>
                      <strong>{r.User?.name}</strong><br />
                      <small style={{ color: '#64748b' }}>{r.User?.email}</small>
                    </td>
                    <td>{r.agencyName}</td>
                    <td>{r.licenseNumber}</td>
                    <td>{r.phone}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '50px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: '#fff',
                          background: statusColors[r.status] || '#94a3b8',
                          textTransform: 'capitalize',
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="action-cells">
                      {r.status === 'pending' ? (
                        <>
                          <button
                            className="btn-text"
                            style={{ color: '#10b981', fontWeight: 600 }}
                            onClick={() => handleAction(r.id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-text danger"
                            onClick={() => handleAction(r.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                          {r.adminRemarks ? `Remarks: ${r.adminRemarks}` : 'Processed'}
                        </span>
                      )}
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

export default AdminAgencyRequestsPage;
