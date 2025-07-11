import { useEffect, useState } from 'react';
import Header from '../Header';
import './index.css';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    fetch('https://store-rating-app-pu73.onrender.com/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setFiltered(data);
      });
  }, [token]);

  useEffect(() => {
    const result = users.filter(u =>
      u.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      u.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      u.address.toLowerCase().includes(filters.address.toLowerCase()) &&
      (filters.role === '' || u.role === filters.role)
    );
    setFiltered(result);
  }, [filters, users]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="view-users">
      <Header />
      <main className="user-panel">
        <h2>View Users</h2>
        <div className="filter-bar2">
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="address" placeholder="Address" onChange={handleChange} />
          <select name="role" onChange={handleChange}>
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
        </div>

        <div className="user-flex">
          {filtered.map(u => (
            <div key={u.id} className="card">
              <p><strong>ID:</strong> {u.id}</p>
              <p><strong>Name:</strong> {u.name}</p>
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Address:</strong> {u.address}</p>
              <p><strong>Role:</strong> {u.role}</p>
              {u.role === 'owner' && (
                <p><strong>Rating:</strong> ⭐ {u.average_rating || 'N/A'}</p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ViewUsers;
