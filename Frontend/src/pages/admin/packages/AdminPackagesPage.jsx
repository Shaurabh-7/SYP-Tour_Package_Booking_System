import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { getPackages, createPackage, updatePackage, deletePackage } from '../../../api/packages';
import '../AdminShared.css';

function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Combined Form State for Create & Edit
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const initialFormState = { name: '', description: '', price: '', durationDays: '', destination: '', imageUrl: '' };
  const [formData, setFormData] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  async function loadPackages() {
    setLoading(true);
    try {
      const response = await getPackages();
      setPackages(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(id, currentStatus) {
    try {
      await updatePackage(id, { isActive: !currentStatus });
      loadPackages();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to completely delete this tour package?')) return;
    try {
      await deletePackage(id);
      loadPackages();
    } catch (err) {
      alert(err.message || 'Failed to delete package');
    }
  }

  function handleEditClick(pkg) {
    setFormData({
      name: pkg.name || '',
      description: pkg.description || '',
      price: pkg.price || '',
      durationDays: pkg.durationDays || '',
      destination: pkg.destination || '',
      imageUrl: pkg.imageUrl || '',
    });
    setEditId(pkg.id);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelForm() {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setFormData(initialFormState);
  }

  function handleOpenCreate() {
    setShowForm(true);
    setIsEditing(false);
    setEditId(null);
    setFormData(initialFormState);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormLoading(true);
    try {
      // Send integers as numbers if they exist
      const submitData = { ...formData };
      if (submitData.price) submitData.price = Number(submitData.price);
      if (submitData.durationDays) submitData.durationDays = Number(submitData.durationDays);

      if (isEditing) {
        await updatePackage(editId, submitData);
      } else {
        await createPackage(submitData);
      }
      handleCancelForm();
      loadPackages();
    } catch (err) {
      alert(err.response?.data?.message || err.message || `Failed to ${isEditing ? 'update' : 'create'} package`);
    } finally {
      setFormLoading(false);
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(amount);
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="admin-page-container">
        <header className="admin-header">
          <div>
            <h1>Package Management</h1>
            <p>View, edit, disable, or delete tour packages across all agencies.</p>
          </div>
          <button className="btn-primary" onClick={showForm ? handleCancelForm : handleOpenCreate}>
            {showForm ? 'Cancel' : '+ Create Package'}
          </button>
        </header>

        {showForm && (
          <section className="admin-form-section">
            <h2 style={{ marginBottom: '16px', color: '#1e293b', fontSize: '1.25rem' }}>
              {isEditing ? `Edit Package #${editId}` : 'Create New Package'}
            </h2>
            <form onSubmit={handleSubmit} className="admin-inline-form">
              <input type="text" placeholder="Package Name *" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="Destination" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
              <input type="number" placeholder="Price (NPR) *" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <input type="number" placeholder="Duration (Days)" value={formData.durationDays} onChange={e => setFormData({...formData, durationDays: e.target.value})} />
              <input type="text" placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              <input type="text" placeholder="Short Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ minWidth: '100%' }} />
              
              <button type="submit" disabled={formLoading} className="btn-success">
                {formLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Package')}
              </button>
            </form>
          </section>
        )}

        {error && <div className="alert error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading packages...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Destination</th>
                  <th>Price</th>
                  <th>Agency</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(p => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.destination || 'N/A'}</td>
                    <td>{formatCurrency(p.price)}</td>
                    <td>{p.agency?.name || 'Platform'}</td>
                    <td>
                      <span className={`status-badge ${p.isActive ? 'active' : 'inactive'}`}>
                        {p.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="action-cells">
                      <button 
                        className="btn-text secondary"
                        onClick={() => handleToggleActive(p.id, p.isActive)}
                      >
                        {p.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button 
                        className="btn-text secondary"
                        onClick={() => handleEditClick(p)}
                        style={{ color: '#0284c7' }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-text danger"
                        onClick={() => handleDelete(p.id)}
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

export default AdminPackagesPage;
