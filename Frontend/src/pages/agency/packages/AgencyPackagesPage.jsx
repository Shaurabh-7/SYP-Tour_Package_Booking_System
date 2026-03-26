import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { getPackages, createPackage, updatePackage, deletePackage } from '../../../api/packages';
import '../../admin/AdminShared.css';

function AgencyPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    durationDays: '',
    destination: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadPackages();
  }, []);

  async function loadPackages() {
    setLoading(true);
    try {
      const response = await getPackages();
      setPackages(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your packages');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(pkg) {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price,
      durationDays: pkg.durationDays || '',
      destination: pkg.destination || '',
      imageUrl: pkg.imageUrl || '',
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingPackage) {
        await updatePackage(editingPackage.id, formData);
      } else {
        await createPackage(formData);
      }
      setFormData({ name: '', description: '', price: '', durationDays: '', destination: '', imageUrl: '' });
      setShowForm(false);
      setEditingPackage(null);
      loadPackages();
    } catch (err) {
      alert(err.message || 'Error saving package');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this package?')) return;
    try {
      await deletePackage(id);
      loadPackages();
    } catch (err) {
      alert(err.message || 'Error deleting package');
    }
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="admin-page-container">
        <header className="admin-header">
          <div>
            <h1>Manage My Packages</h1>
            <p>Create and edit your tour packages visible to customers.</p>
          </div>
          <button className="btn-primary" onClick={() => {
            setShowForm(!showForm);
            setEditingPackage(null);
            setFormData({ name: '', description: '', price: '', durationDays: '', destination: '', imageUrl: '' });
          }}>
            {showForm ? 'Cancel' : '+ Add New Package'}
          </button>
        </header>

        {showForm && (
          <section className="admin-form-section">
            <form onSubmit={handleSubmit} className="admin-inline-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input type="text" placeholder="Package Name *" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="number" placeholder="Price (NPR) *" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <input type="text" placeholder="Destination" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
              <input type="number" placeholder="Duration (Days)" value={formData.durationDays} onChange={e => setFormData({...formData, durationDays: e.target.value})} />
              <input type="text" placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              <textarea placeholder="Description" style={{ gridColumn: 'span 2', minHeight: '80px', borderRadius: '8px', padding: '10px', border: '1px solid #ddd' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <button type="submit" disabled={formLoading} className="btn-success" style={{ gridColumn: 'span 2' }}>
                {formLoading ? 'Saving...' : editingPackage ? 'Update Package' : 'Create Package'}
              </button>
            </form>
          </section>
        )}

        {error && <div className="alert error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading your tours...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Destination</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(p => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.destination || '-'}</td>
                    <td>NPR {p.price}</td>
                    <td>
                      <span className={`status-badge ${p.isActive ? 'active' : 'inactive'}`}>
                        {p.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="action-cells">
                      <button className="btn-text secondary" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="btn-text danger" onClick={() => handleDelete(p.id)}>Delete</button>
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

export default AgencyPackagesPage;
