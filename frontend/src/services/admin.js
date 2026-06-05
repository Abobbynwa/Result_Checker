import api from './api';

export const registerStudent = async (payload) => {
  const res = await api.post('/admin/register-student', payload);
  return res.data;
};

export const uploadCSV = async (formData) => {
  const res = await api.post('/admin/upload_csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const fetchAnalytics = async (className, term) => {
  const encodedClass = encodeURIComponent(className);
  const encodedTerm = encodeURIComponent(term);
  const res = await api.get(`/admin/class-analytics/${encodedClass}?term=${encodedTerm}`);
  return res.data;
};

export const fetchStudents = async () => {
  const res = await api.get('/admin/students');
  return res.data;
};
