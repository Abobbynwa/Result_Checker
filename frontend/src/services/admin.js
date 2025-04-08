import api from './api';

export const uploadCSV = async (formData) => {
  const res = await api.post('/admin/upload_csv', formData);
  return res.data;
};

export const fetchAnalytics = async (class_name, term) => {
  const res = await api.get(`/admin/class-analytics/${class_name}?term=${term}`);
  return res.data;
};
