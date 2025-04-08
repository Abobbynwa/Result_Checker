import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🧠 Format greeting with title
  const title = user?.gender === 'Male'
    ? 'Mr.'
    : user?.gender === 'Female'
    ? 'Miss'
    : '';

  return (
    <div className="dashboard">
      <h2>🎉 Welcome back, {title} {user?.name}</h2>
      <p>🏫 Class: {user?.class_name}</p>
      <p>🧮 Reg No: {user?.reg_no}</p>
      <p>🔐 Gender: {user?.gender || 'Unspecified'}</p>

      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={() => navigate('/results')}>📄 View Results</button>
        <button onClick={() => navigate('/download')}>⬇️ Download PDF</button>
        <button onClick={() => navigate('/email')}>📧 Email Result</button>
      </div>
    </div>
  );
};

export default StudentDashboard;
