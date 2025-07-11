import { useState } from 'react';
import Header from '../Header';
import './index.css';

const AddStore = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '',owner_id:'' });
  // Initialize owner_id as an empty string});
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('jwt_token');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('https://store-rating-app-pu73.onrender.com/admin/stores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setMessage('Store added successfully');
      setForm({ name: '', email: '', address: '',owner_id:'' }); // Reset form
      return;
    }
    const data = await res.json();
    setMessage(data.message || data.errors?.join(', ') || 'Error occurred');
  };

  return (
    <div className="add-store">
      <Header />
      <main className="form-wrapper">
        <h2>Add New Store</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Store Name" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
          <input type="number" name="owner_id" placeholder="owner_id" value={form.owner_id} onChange={handleChange} required />
          <button type="submit">Add Store</button>
        </form>
        {message && <p className="status-msg">{message}</p>}
      </main>
    </div>
  );
};

export default AddStore;
