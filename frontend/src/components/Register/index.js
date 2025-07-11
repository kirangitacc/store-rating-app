import { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const onChange = event => {
    const { name, value } = event.target;
    if (name === 'name') setName(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'address') setAddress(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'role') setRole(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const userData = { name, email, address, password, role };

    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      console.log('Response status:', res);

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(data.message || 'Registration successful!');
        setErrorMsg('');
        setName('');
        setEmail('');
        setAddress('');
        setPassword('');
        setRole('');
      } else {
        setErrorMsg(data.message || 'Registration failed. Please try again.');
        setSuccessMsg('');
      }
    } catch (error) {
      setErrorMsg(error.message || 'An error occurred. Please try again.');
      setSuccessMsg('');
    }
  };

  return (
    <div className="register-con">
      <div className="register-card">
        
        <form className="register-form" onSubmit={onSubmit}>
          <h1 className="logo" style={{color:'black'}}>S-Register</h1>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={name} onChange={onChange} required />

          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />

          <label htmlFor="address">Address</label>
          <input type="text" name="address" value={address} onChange={onChange} />

          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required />

          <label htmlFor="role">Role</label>
          <select name="role" value={role} onChange={onChange} required>
            <option value="">Select a role</option>
            <option value="owner">Owner</option>
            <option value="user">User</option>
          </select>

          <button type="submit">Register</button>


          {errorMsg && <p className="register-err-msg">{errorMsg}</p>}
          {successMsg && (
            <Link to="/">
              <p className="register-success-msg">{successMsg} click here to login</p>
            </Link>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
