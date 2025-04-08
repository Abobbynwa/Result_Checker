import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const { setToken, setUser } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const { token, role, ...rest } = res.data;
      setToken(token);
      setUser({ role, ...rest });

      if (role === 'student') navigate('/student');
      if (role === 'admin') navigate('/admin');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => navigate('/forgot-password')}>Forgot password?</button>
    <button onClick={() => navigate('/Register')}>Register</button>

      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
