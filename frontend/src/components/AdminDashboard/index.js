import { useEffect, useState } from 'react';
import Header from '../Header';
import './index.css';

const AdminDashboard = () => {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });

  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
  const fetchSummary = async () => {
    try {
      const response = await fetch('https://store-rating-app-pu73.onrender.com/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch summary');

      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error loading dashboard summary:', error);
    }
  };

  fetchSummary();
}, [token]); // ✅ clean, no warnings

  console.log('Admin Dashboard Summary:', summary);

  return (
    <div className="admin-dashboard">
      <Header />

      <main className="dashboard-content">
        <h2>Admin Dashboard</h2>

        <div className="summary-grid">
          <div className="summary-card users">
            <h3>Total Users</h3>
            <p>{summary.total_users}</p>
          </div>

          <div className="summary-card stores">
            <h3>Total Stores</h3>
            <p>{summary.total_stores}</p>
          </div>

          <div className="summary-card ratings">
            <h3>Total Ratings Submitted</h3>
            <p>{summary.total_ratings}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
