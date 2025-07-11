import { useState } from 'react';
import Header from '../Header';
import './index.css';

const AddUser = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('jwt_token');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if(res.ok){
        setMessage('User added successfully');
        setForm({ name: '', email: '', address: '', password: '', role: 'user' }); // Reset form
        return; 
    }
    const data = await res.json();
    setMessage(data.message || data.errors?.join(', ') || 'Error occurred');
  };

  return (
    <div className="add-user">
      <Header />
      <main className="form-wrapper">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
          <input name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
          <button type="submit">Add User</button>
        </form>
        {message && <p className="status-msg">{message}</p>}
      </main>
    </div>
  );
};

export default AddUser;
