import  { useState } from 'react';
import './index.css';
import adminImg from '../images/admin.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const onSubmit = async (event) => {
    event.preventDefault();

    const userData = { email, password };
    const url = 'https://store-rating-app-pu73.onrender.com/login/';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };

    try {
      const req = await fetch(url, options);
      const res = await req.json();

      if (req.ok) {
        const jwtToken = res.jwtToken;
        const userId = res.userId;
        const userRole = res.role;
        console.log('JWT Token login:', jwtToken);
        console.log('User ID login:', userId);
        localStorage.setItem('jwt_token', jwtToken);
        localStorage.setItem('user_id', userId);
        localStorage.setItem('user_role', userRole);
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'user') {
          navigate('/stores');
        } else if (userRole === 'owner') {
          navigate('/owner/dashboard');
        } else {
          navigate('/'); // fallback
        }
      } else {
        setErrorMsg(res.error_msg || 'Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMsg('Wrong email or password');
    }
  };

  const onRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="login-con">
      {/* Left container with heading and image */}
      <div className="login-left">
        <h1 className="login-heading">Welcome to Store-View</h1>
        <p className="login-subheading">
         StoreView is a secure, responsive web application designed to help users discover, 
         rate, and monitor local stores. With dynamic dashboards and role-based access, 
         admins can manage store data, assign ownership, and view user engagement. 
         Store owners can track ratings and feedback submitted for their stores, while users enjoy a streamlined interface to search, sort, and rate stores in real time. Featuring JWT authentication, modular architecture, and smooth deployment workflows, StoreView delivers scalable performance and meaningful insights into store reputation.
        </p>
        <img src={adminImg} alt="Admin" className="login-img" />

      </div>
      {/* Right container with login card */}
      <div className="login-card">
        <div className="appLogo">Store-View</div>
        <h2 className="login-instructions-heading" >
          Welcome! Please Login or Register
        </h2>
        <p className="login-instructions" >
         New users need to register before accessing the platform.<br />
         If you are already a user, please login below.
        </p>
        <form className="form" onSubmit={onSubmit}>
          <label className="label" htmlFor="user">EMAIL</label>
          <input
            className="inp"
            type="text"
            id="user"
            onChange={onChangeEmail}
            value={email}
            placeholder="Enter your email"
          />

          <label className="label" htmlFor="pass">PASSWORD</label>
          <input
            className="inp"
            type="password"
            id="pass"
            onChange={onChangePassword}
            value={password}
            placeholder="Enter your password"
          />

          <div className="btn-row">
            <button type="submit" className="login-btn">Login</button>
            <button type="button" className="register-btn2" onClick={onRegisterClick}>
              Register
            </button>
          </div>

          {errorMsg && <p className="err-msg">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
