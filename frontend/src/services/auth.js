import api from './api';

export const login = async (data) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const resetPassword = async (payload) => {
  const res = await api.post('/auth/forgot-password', payload);
  return res.data;
};
