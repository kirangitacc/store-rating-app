
import { useEffect, useState } from 'react';
import Header from '../Header';
import { AiFillDelete } from 'react-icons/ai';
import './index.css';

const ViewStores = () => {
  const [stores, setStores] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const token = localStorage.getItem('jwt_token');

  // Fetch initial store data
  useEffect(() => {
    fetch('https://store-rating-app-pu73.onrender.com/stores', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setStores(data);
        setFiltered(data);
      });
  }, [token]);

  // Filter logic
  useEffect(() => {
    const result = stores.filter(store =>
      store.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      store.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      store.address.toLowerCase().includes(filters.address.toLowerCase())
    );
    setFiltered(result);
  }, [filters, stores]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Delete store by ID
  const handleDelete = async (storeId) => {
    const confirmed = window.confirm('Are you sure you want to delete this store?');
    if (!confirmed) return;

    try {
      const res = await fetch(`https://store-rating-app-pu73.onrender.com/admin/stores/${storeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Deletion failed');

      // Update UI after deletion
      const updatedList = stores.filter(store => store.id !== storeId);
      setStores(updatedList);
      setFiltered(updatedList);
      alert('Store deleted successfully');
    } catch (err) {
      console.error('Error deleting store:', err);
      alert('Failed to delete store');
    }
  };

  return (
    <div className="view-stores">
      <Header />
      <main className="store-panel">
        <h2>Store Listings</h2>

        <div className="filter-bar">
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="address" placeholder="Address" onChange={handleChange} />
        </div>

        <div className="list-grid">
          {filtered.map(store => (
            <div key={store.id} className="card">
              <div className="card-header">
                <h4>{store.name}</h4>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(store.id)}
                  title="Delete Store"
                >
                  <AiFillDelete size={20} color="#d32f2f" />
                </button>
              </div>
              <p><strong>Email:</strong> {store.email}</p>
              <p><strong>Address:</strong> {store.address}</p>
              <p><strong>Rating:</strong> ⭐ {store.average_rating || 'N/A'}/5</p>
              <p><strong>Owner ID:</strong> {store.owner_id}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ViewStores;


