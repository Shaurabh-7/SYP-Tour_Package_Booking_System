import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { getUsers, updateUser, deleteUser, createUserForAdmin } from '../../../api/users';
import '../AdminShared.css';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }



  async function handleToggleActive(id, currentStatus) {
    try {
      await updateUser(id, { isActive: !currentStatus });
      loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to completely delete this user?')) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    setFormLoading(true);
    try {
      await createUserForAdmin(newUser);
      setNewUser({ name: '', email: '', password: '', role: 'customer' });
      setShowForm(false);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to create user');
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="admin-page-container">
        <header className="admin-header">
          <div>
            <h1>User Management</h1>
            <p>View, edit, or remove user accounts across the platform.</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add New User'}
          </button>
        </header>

        {showForm && (
          <section className="admin-form-section">
            <form onSubmit={handleCreateUser} className="admin-inline-form">
              <input type="text" placeholder="Full Name *" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
              <input type="email" placeholder="Email Address *" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              <input type="password" placeholder="Password *" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
              <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                <option value="customer">Customer</option>
                <option value="agency">Agency</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" disabled={formLoading} className="btn-success">
                {formLoading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </section>
        )}

        {error && <div className="alert error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading users...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span style={{ textTransform: 'capitalize' }}>{u.role}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${u.isActive ? 'active' : 'inactive'}`}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="action-cells">
                      <button 
                        className="btn-text secondary"
                        onClick={() => handleToggleActive(u.id, u.isActive)}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        className="btn-text danger"
                        onClick={() => handleDelete(u.id)}
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

export default AdminUsersPage;
