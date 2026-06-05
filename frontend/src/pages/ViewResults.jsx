import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ViewResults = () => {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      if (!user?.reg_no) return;

      try {
        const res = await api.get(`/results/view/${encodeURIComponent(user.reg_no)}`);
        setResult(res.data);
        setError('');
      } catch (err) {
        setResult(null);
        setError(err.response?.data?.msg || 'No result yet.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [user]);

  if (loading) return <p>Loading result...</p>;
  if (!result) return <p>{error || 'No result yet.'}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h3>{result.student} | {result.class} | {result.reg_no}</h3>
      <p>Total: {result.total} | Average: {result.average}%</p>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Score</th>
            <th>Grade</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {result.results.map((row, index) => (
            <tr key={`${row.subject}-${index}`}>
              <td>{row.subject}</td>
              <td>{row.score}</td>
              <td>{row.grade}</td>
              <td>{row.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewResults;
