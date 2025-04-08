import React, { useState } from 'react';
import { saveStudentToStorage, exportCSV } from '../utils/storageUtils';

const AddStudent = () => {
  const [form, setForm] = useState({
    name: '',
    class_name: '',
    gender: '',
    email: '',
    subjects: [],
  });
  const subjects = ['English', 'Math', 'CRS', 'Basic Science', 'Social Studies'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectToggle = (subject) => {
    setForm(prev => {
      const selected = prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject];
      return { ...prev, subjects: selected };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveStudentToStorage(form);
    alert('✅ Student saved!');
    setForm({ name: '', class_name: '', gender: '', email: '', subjects: [] });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>➕ Add Student (Local)</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
        <input name="class_name" value={form.class_name} onChange={handleChange} placeholder="Class" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <fieldset>
          <legend>📚 Subjects Offered:</legend>
          {subjects.map((subj) => (
            <label key={subj}>
              <input
                type="checkbox"
                checked={form.subjects.includes(subj)}
                onChange={() => handleSubjectToggle(subj)}
              />
              {subj}
            </label>
          ))}
        </fieldset>

        <button type="submit">Save Student</button>
      </form>

      <hr />
      <button onClick={exportCSV}>📤 Export CSV Backup</button>
    </div>
  );
};

export default AddStudent;
