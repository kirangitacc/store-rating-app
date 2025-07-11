import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/index.js';
import Register from './components/Register/index.js';
import Profile from './components/Profile/index.js';
import StoreListings from './components/StoreListings/index.js';
import RatingSubmission from './components/RatingSubmission/index.js';
import OwnerDashboard from './components/OwnerDashboard/index.js';
import AdminDashboard from './components/AdminDashboard/index.js';
import AddStore from './components/AddStore/index.js';
import AddUser from './components/AddUser/index.js';
import ViewStores from './components/ViewStores/index.js';
import ViewUsers from './components/ViewUsers/index.js';
import ProtectedRoute from './components/ProtectedRoute/index.js';

import './App.css';

const App = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/user/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/stores" element={<ProtectedRoute><StoreListings /></ProtectedRoute>} />
    <Route path="/submit-rating" element={<ProtectedRoute><RatingSubmission /></ProtectedRoute>} />
    <Route path="/owner/dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
    <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/add-store" element={<ProtectedRoute><AddStore /></ProtectedRoute>} />
    <Route path="/admin/add-user" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
    <Route path="/admin/view-stores" element={<ProtectedRoute><ViewStores /></ProtectedRoute>} />
    <Route path="/admin/view-users" element={<ProtectedRoute><ViewUsers /></ProtectedRoute>} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
