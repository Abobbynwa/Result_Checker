import React, { useState } from 'react';
import api from '../services/api';

const initialForm = {
  name: '',
  username: '',
  reg_no: '',
  class_name: '',
  gender: '',
  dob: '',
  password: '',
  email: '',
};

const AdminAddStudent = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const response = await api.post('/admin/register-student', form);
      setStatus({ type: 'success', msg: response.data.msg });
      setForm(initialForm);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.msg || 'Failed to register student' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard" style={{ padding: '2rem' }}>
      <h2>Add New Student</h2>
      {status && <p className={status.type === 'success' ? 'success-text' : 'error-text'}>{status.msg}</p>}

      <form onSubmit={handleSubmit} className="form-grid">
        <input name="name" placeholder="Full Name" onChange={handleChange} value={form.name} required />
        <input name="username" placeholder="Username" onChange={handleChange} value={form.username} required />
        <input name="reg_no" placeholder="Registration Number" onChange={handleChange} value={form.reg_no} required />
        <input name="class_name" placeholder="Class e.g. JSS 3A" onChange={handleChange} value={form.class_name} required />
        <select name="gender" onChange={handleChange} value={form.gender} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input name="dob" placeholder="Date of Birth / reset code" onChange={handleChange} value={form.dob} required />
        <input name="email" placeholder="Email optional" type="email" onChange={handleChange} value={form.email} />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} value={form.password} required />
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Student'}</button>
      </form>
    </div>
  );
};

export default AdminAddStudent;
