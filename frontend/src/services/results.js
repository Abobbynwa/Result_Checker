import api from './api';

export const fetchResult = async (reg_no) => {
  const res = await api.get(`/results/view/${encodeURIComponent(reg_no)}`);
  return res.data;
};

export const emailResult = async (reg_no) => {
  const res = await api.post(`/results/email/${encodeURIComponent(reg_no)}`);
  return res.data;
};

export const downloadResult = (reg_no) => {
  window.open(`http://localhost:5000/api/results/download/${encodeURIComponent(reg_no)}`, '_blank');
};
