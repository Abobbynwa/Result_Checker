import React, { useState } from 'react';
import api from '../services/api';

const UploadResults = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) {
      setStatus({ type: 'error', msg: 'Please select a CSV file first.', log: [] });
      return;
    }

    const form = new FormData();
    form.append('file', file);
    setLoading(true);
    setStatus(null);

    try {
      const res = await api.post('/admin/upload_csv', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatus({
        type: 'success',
        msg: res.data.msg || 'Upload successful',
        log: res.data.log || [],
        added: res.data.added || 0,
        skipped: res.data.skipped || 0,
      });
    } catch (err) {
      setStatus({
        type: 'error',
        msg: err.response?.data?.msg || 'Upload failed',
        log: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Upload Student Results</h2>
      <p>CSV headers required: <code>reg_no,subject,score,term,session</code></p>
      <input type="file" accept=".csv" onChange={(event) => setFile(event.target.files[0])} />
      <br />
      <button type="button" onClick={upload} disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {status && (
        <div className={status.type === 'success' ? 'success-text' : 'error-text'} style={{ marginTop: '1rem' }}>
          <p>{status.msg}</p>
          {status.type === 'success' && (
            <>
              <p>Added/Updated: {status.added} | Skipped: {status.skipped}</p>
              {status.log.length > 0 && (
                <ul>{status.log.map((item, index) => <li key={index}>{item}</li>)}</ul>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadResults;
