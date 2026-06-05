import React, { useEffect, useState } from 'react';
import { fetchAnalytics } from '../services/admin';
import { useAuth } from '../context/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [term, setTerm] = useState('2nd Term');
  const [className, setClassName] = useState('JSS 3B');
  const [error, setError] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchAnalytics(className, term);
        setData(res.analytics || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching analytics');
      }
    };

    if (user?.role === 'admin' && className) {
      getData();
    }
  }, [term, className, user]);

  if (user?.role !== 'admin') {
    return <p>Access denied.</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Class Analytics</h2>

      <label htmlFor="className">Class:</label>
      <input
        id="className"
        value={className}
        onChange={(event) => setClassName(event.target.value)}
        style={styles.input}
        placeholder="e.g. JSS 3B"
      />

      <label htmlFor="term">Term:</label>
      <select id="term" value={term} onChange={(event) => setTerm(event.target.value)} style={styles.select}>
        <option>1st Term</option>
        <option>2nd Term</option>
        <option>3rd Term</option>
      </select>

      {error && <p className="error-text">{error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Subject</th>
            <th style={styles.th}>Average</th>
            <th style={styles.th}>Highest</th>
            <th style={styles.th}>Lowest</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.subject}>
              <td style={styles.td}>{row.subject}</td>
              <td style={styles.td}>{row.average}</td>
              <td style={styles.td}>{row.highest}</td>
              <td style={styles.td}>{row.lowest}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { padding: '20px', background: '#fff', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  heading: { fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' },
  input: { display: 'block', marginBottom: '12px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  select: { display: 'block', marginBottom: '20px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px', background: '#f2f2f2', borderBottom: '1px solid #ddd' },
  td: { padding: '10px', borderBottom: '1px solid #eee' },
};

export default Analytics;
