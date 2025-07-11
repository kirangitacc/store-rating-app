import { useState, useEffect } from "react";
import Header from "../Header";
import "./index.css";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [statusMsg, setStatusMsg] = useState("");

  const userId = localStorage.getItem("user_id");
  const jwtToken = localStorage.getItem("jwt_token");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const res = await fetch(`http://localhost:5000/user/${userId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      const data = await res.json();
      setUserDetails(data);
      setLoading(false);
    };

    fetchUserDetails().catch(err => {
      setError("Failed to fetch user details");
      setLoading(false);
    });
  }, [userId, jwtToken]);

  const handleResetSubmit = async e => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatusMsg("Passwords do not match");
      return;
    }
    const res = await fetch(`http://localhost:5000/user/${userId}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ password: passwords.newPassword })
    });
    const data = await res.json();
    setStatusMsg(data.message || "Password updated");
    setPasswords({ newPassword: "", confirmPassword: "" });
    setShowReset(false);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-wrapper">
      <Header />
      <div className="profile-card">
        <h2>User Profile</h2>
        <div className="profile-avatar">{userDetails.name.charAt(0)}</div>
        <div className="profile-details">
          <div className="profile-row">
            <label>Name:</label>
            <span>{userDetails.name}</span>
          </div>
          <div className="profile-row">
            <label>Email:</label>
            <span>{userDetails.email}</span>
          </div>
          <div className="profile-row">
            <label>Role:</label>
            <span>{userDetails.role}</span>
          </div>
          <div className="profile-row">
            <label>Address:</label>
            <span>{userDetails.address}</span>
          </div>
        </div>

        {!showReset && (
          <button className="reset-btn" onClick={() => setShowReset(true)}>
            Reset Password
          </button>
        )}

        {showReset && (
          <form className="reset-form" onSubmit={handleResetSubmit}>
            <input
            type="password"
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwords.confirmPassword}
            onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            required
          />
          <div className="reset-actions">
            <button type="submit">Update Password</button>
            <button type="button" className="close-reset" onClick={() => setShowReset(false)}>
              ❌
            </button>
          </div>
          </form>
        )}

       
        {statusMsg && <p className="status-msg">{statusMsg}</p>}
      </div>
    </div>
  );
};

export default Profile;

