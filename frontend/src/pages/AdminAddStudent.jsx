import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminAddStudent = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: '',
    username: '',
    reg_no: '',
    class_name: '',
    gender: '',
    dob: '',
    password: '',
    email: ''
  });

  const [status, setStatus] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/register-student', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', msg: res.data.msg });
      setForm({
        name: '',
        username: '',
        reg_no: '',
        class_name: '',
        gender: '',
        dob: '',
        password: '',
        email: ''
      });
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.msg || 'Failed to register student' });
    }
  };

  return (
    <div className="dashboard">
      <h2>📄 Add New Student</h2>
      {status && <p style={{ color: status.type === 'success' ? 'green' : 'crimson' }}>{status.msg}</p>}

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} value={form.name} required />
        <input name="username" placeholder="Username" onChange={handleChange} value={form.username} required />
        <input name="reg_no" placeholder="Reg Number (e.g., ABIC/2024/103)" onChange={handleChange} value={form.reg_no} required />
        <input name="class_name" placeholder="Class (e.g., JSS 3A)" onChange={handleChange} value={form.class_name} required />
        <select name="gender" onChange={handleChange} value={form.gender} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input name="dob" placeholder="Date of Birth (DDMM)" onChange={handleChange} value={form.dob} required />
        <input name="email" placeholder="Email (optional)" onChange={handleChange} value={form.email} />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} value={form.password} required />
        <button type="submit">➕ Add Student</button>
      </form>
    </div>
  );
};

export default AdminAddStudent;
