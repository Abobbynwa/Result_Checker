import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UploadResults = () => {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);

  const upload = async () => {
    if (!file) return alert("📁 Please select a CSV file first.");

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/admin/upload_csv', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      setStatus({
        type: 'success',
        msg: res.data.msg || '✅ Upload successful',
        log: res.data.log || [],
        added: res.data.added,
        skipped: res.data.skipped
      });
    } catch (err) {
      setStatus({
        type: 'error',
        msg: err.response?.data?.msg || '❌ Upload failed',
        log: []
      });
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>📤 Upload Student Results</h2>
      <p>Only CSV files with headers: <code>reg_no,subject,score,term,session</code></p>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: '1rem' }}
      />
      <br />
      <button onClick={upload} style={{ padding: '0.5rem 1rem' }}>Upload</button>

      {status && (
        <div style={{ marginTop: '1rem', color: status.type === 'success' ? 'green' : 'crimson' }}>
          <p>{status.msg}</p>
          {status.type === 'success' && (
            <>
              <p>✅ Added: {status.added} | ⛔ Skipped: {status.skipped}</p>
              {status.log.length > 0 && (
                <ul>
                  {status.log.map((l, i) => (
                    <li key={i}>⚠️ {l}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadResults;
