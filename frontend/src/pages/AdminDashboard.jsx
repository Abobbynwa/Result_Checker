import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => (
  <div className="dashboard">
    <h2>🛠️ Admin Dashboard</h2>
    <ul>
      <li><Link to="/admin/add-student">➕ Add Student Manually</Link></li>
      <li><Link to="/admin/upload">📤 Upload Results (CSV)</Link></li>
      <li><Link to="/admin/analytics">📊 Class Analytics</Link></li>
    </ul>
  </div>
);

export default AdminDashboard;
