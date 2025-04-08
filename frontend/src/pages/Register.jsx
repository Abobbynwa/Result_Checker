import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    username: '',
    reg_no: '',
    dob: '',
    class_name: '',
    password: '',
    confirm_password: '',
    bot_trap: '' // honeypot
  });

  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (form.bot_trap) return setMsg('Bot detected');
    if (form.password !== form.confirm_password) return setMsg('Passwords do not match');
    if (!/^\d{4}$/.test(form.dob)) return setMsg('DOB must be 4-digit DDMM format');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      setMsg(res.data.msg || 'Student registered successfully');
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📋 Student Registration</h2>

      <input name="name" placeholder="Full Name" onChange={handleChange} />
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="reg_no" placeholder="Reg No (e.g., ABIC/2024/101)" onChange={handleChange} />
      <input name="dob" placeholder="DOB (DDMM)" onChange={handleChange} />
      <input name="class_name" placeholder="Class (e.g., JSS 3A)" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <input name="confirm_password" placeholder="Confirm Password" type="password" onChange={handleChange} />

      <select name="gender" onChange={handleChange}>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Other">Other</option>
</select>


      {/* honeypot input hidden from real users */}
      <input name="bot_trap" style={{ display: 'none' }} onChange={handleChange} />
<br /><hr /><br />
      <button onClick={handleRegister}>Register Student</button>
      <p>{msg}</p>
    </div>
  );
};

export default Register;
