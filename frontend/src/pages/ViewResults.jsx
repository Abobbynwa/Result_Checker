import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ViewResults = () => {
  const { token, user } = useAuth();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/results/view/${user.reg_no}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResult(res.data);
      } catch (err) {
        setResult(null);
      }
    };

    if (user?.reg_no) fetch();
  }, [user, token]);

  if (!result) return <p>No result yet.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h3>📄 {result.student} | {result.class} | {result.reg_no}</h3>
      <p>Total: {result.total} | Average: {result.average}%</p>
      <ul>
        {result.results.map((r, i) => (
          <li key={i}>
            {r.subject} - {r.score} ({r.grade}) [{r.remark}]
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewResults;
