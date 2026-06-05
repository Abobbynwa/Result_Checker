import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="dashboard" style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>
      <p>Manage students, upload results, and review class analytics.</p>

      <ul>
        <li><Link to="/admin/add-student">Add Student Manually</Link></li>
        <li><Link to="/admin/upload">Upload Results CSV</Link></li>
        <li><Link to="/admin/analytics">Class Analytics</Link></li>
      </ul>

      <button type="button" onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
