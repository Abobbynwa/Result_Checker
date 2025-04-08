import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>🧠 Admin Dashboard</h2>
      <button onClick={() => navigate('/admin/upload')}>📤 Upload Results</button>
      <button onClick={() => navigate('/admin/analytics')}>📊 Class Analytics</button>
    </div>
  );
};

<div className="dashboard">
  <h2>🛠️ Admin Dashboard</h2>

  <ul>
    <li><Link to="/admin/add-student">➕ Add Student Manually</Link></li>
    <li><Link to="/admin/upload">📤 Upload Results (CSV)</Link></li>
    <li><Link to="/admin/analytics">📊 Class Analytics</Link></li>
  </ul>
</div>

export default AdminDashboard;
