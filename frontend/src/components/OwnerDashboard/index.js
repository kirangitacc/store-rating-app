import { useEffect, useState } from 'react';
import Header from '../Header';
import './index.css';

const OwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    const fetchOwnerStoreData = async () => {
      try {
        const res = await fetch('http://localhost:5000/owner/store', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setAverage(data.average_rating ?? 0);
        setRatings(data.user_list ?? []);
      } catch (err) {
        console.error('Failed to fetch owner store data:', err);
      }
    };

    fetchOwnerStoreData();
  }, [token]);

  return (
    <div className="owner-dashboard">
      <Header />
      <main className="dashboard-content">
        <h2>My Store Dashboard</h2>
        <p className="average">⭐ Average Rating: {average.toFixed(2)}</p>

        <div className="rating-list">
          {ratings.length > 0 ? (
            ratings.map((user, idx) => (
              <div className="rating-card" key={idx}>
                <p><strong>User:</strong> {user.name}</p>
                <p><strong>Rating:</strong> ⭐ {user.rating}</p>
              </div>
            ))
          ) : (
            <p>No ratings yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
