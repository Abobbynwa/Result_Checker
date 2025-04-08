import React, { useState } from 'react';
import { getStoredStudents, markStudentRegistered } from '../utils/storageUtils';
import { useNavigate } from 'react-router-dom';

const StudentRegister = () => {
  const [form, setForm] = useState({
    name: '',
    username: '',
    dob: '',
    password: '',
    confirm_password: '',
    gender: '',
    bot_trap: ''
  });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    if (form.bot_trap) return setMsg('⚠️ Bot detected');
    if (!form.name || !form.dob || !form.username || !form.password || !form.confirm_password)
      return setMsg('❗ All fields required');
    if (form.password !== form.confirm_password) return setMsg('⚠️ Passwords do not match');
    if (!/^\d{4}$/.test(form.dob)) return setMsg('❌ DOB must be in 4-digit DDMM format');

    // Search for name match (pre-added)
    const students = getStoredStudents();
    const student = students.find(s => s.name.toLowerCase() === form.name.toLowerCase());

    if (!student) return setMsg('❌ You are not registered by the school admin');
    if (student.registered) return setMsg('⚠️ Already registered');

    // ✅ Mark registered in localStorage
    markStudentRegistered(student.name);
    alert('✅ Registration complete. Please login now.');
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h2>📋 Student Registration</h2>

      <input name="name" placeholder="Full Name" onChange={handleChange} required />
      <input name="username" placeholder="Preferred Username" onChange={handleChange} required />
      <input name="dob" placeholder="DOB (DDMM)" onChange={handleChange} required />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
      <input name="confirm_password" placeholder="Confirm Password" type="password" onChange={handleChange} required />

      <select name="gender" onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      {/* 🧠 Honeypot for bot */}
      <input name="bot_trap" style={{ display: 'none' }} onChange={handleChange} />

      <br /><hr /><br />
      <button onClick={handleRegister}>✅ Register Now</button>
      <p style={{ color: 'crimson' }}>{msg}</p>
    </div>
  );
};

export default StudentRegister;
