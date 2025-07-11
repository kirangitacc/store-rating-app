import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './index.css';

const Header = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('user_role');
  const userId = localStorage.getItem('user_id');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="app-header">
      <p className="p">S</p>

      {/* Menu Toggle Button (visible only on small screens) */}
      <button className="nav-toggle" onClick={() => setMenuOpen(true)}>
        ☰
      </button>

      {/* Regular nav links for large screens */}
<nav className="nav-links">
  {role === 'admin' && (
    <>
      <Link to="/admin/dashboard">Dashboard</Link>
      <Link to="/admin/add-store">Add Store</Link>
      <Link to="/admin/add-user">Add User</Link>
      <Link to="/admin/view-stores">View Stores</Link>
      <Link to="/admin/view-users">View Users</Link>
    </>
  )}
  {role === 'user' && <Link to="/stores">Store Listings</Link>}
  {role === 'owner' && <Link to="/owner/dashboard">My Store Dashboard</Link>}
  {userId && <Link to={`/user/${userId}`}>Profile</Link>}

  <button className="logout-btn" onClick={handleLogout}>Logout</button>
</nav>


      {/* Popup Overlay Menu */}
      {menuOpen && (
        <div className="popup-nav">
          <div className="popup-content">
            <button className="close-popup" onClick={() => setMenuOpen(false)}>×</button>

            {/* Role-Based Navigation */}
            {role === 'admin' && (
              <>
                <Link to="/admin/dashboard">Dashboard</Link>
                <Link to="/admin/add-store">Add Store</Link>
                <Link to="/admin/add-user">Add User</Link>
                <Link to="/admin/view-stores">View Stores</Link>
                <Link to="/admin/view-users">View Users</Link>
              </>
            )}
            {role === 'user' && <Link to="/stores">Store Listings</Link>}
            {role === 'owner' && <Link to="/owner/dashboard">My Store Dashboard</Link>}
            {userId && <Link to={`/user/${userId}`}>Profile</Link>}

            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
