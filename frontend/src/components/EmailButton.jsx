import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EmailButton = ({ reg_no }) => {
  const { token } = useAuth();

  const send = async () => {
    try {
      await axios.post(`http://localhost:5000/api/results/email/${reg_no}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Result emailed successfully");
    } catch {
      alert("❌ Failed to email result");
    }
  };

  return <button onClick={send}>📬 Email Result</button>;
};

export default EmailButton;
