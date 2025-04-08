import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [form, setForm] = useState({ username: '', dob: '', new_password: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', form);
      setMsg(res.data.msg || 'Password reset successfully');
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔐 Reset Password</h2>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="dob" placeholder="DOB (DDMM)" onChange={handleChange} />
      <input name="new_password" placeholder="New Password" onChange={handleChange} />
      <button onClick={handleSubmit}>Reset</button>
      <p>{msg}</p>
    </div>
  );
};

export default ForgotPassword;
