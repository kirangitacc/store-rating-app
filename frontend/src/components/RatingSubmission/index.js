import { useState, useEffect } from 'react';
import Header from '../Header';
import './index.css';

const RatingSubmission = () => {
  const [stores, setStores] = useState([]);
  const [selected, setSelected] = useState('');
  const [rating, setRating] = useState('');
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    fetch('http://localhost:5000/stores', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setStores);
  }, [token]);

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/stores/${selected}/rating`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rating: parseInt(rating) })
    });
    const data = await res.json();
    setMsg(data.message || 'Rating submitted');
  };

  return (
    <div className="rating-page">
      <Header />
      <main className="rating-content">
        <h2>Submit Rating</h2>
        <form onSubmit={handleSubmit}>
          <select required value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="">Select Store</option>
            {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input type="number" min="1" max="5" required value={rating} onChange={e => setRating(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
        {msg && <p>{msg}</p>}
      </main>
    </div>
  );
};

export default RatingSubmission;
