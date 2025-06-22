import api from './api';

export const fetchResult = async (reg_no) => {
  const res = await api.get(`/results/view/${encodeURIComponent(reg_no)}`);
  return res.data;
};

export const emailResult = async (reg_no) => {
  const res = await api.post(`/results/email/${encodeURIComponent(reg_no)}`);
  return res.data;
};

export const downloadResult = async (reg_no) => {
  const res = await api.get(`/results/download/${encodeURIComponent(reg_no)}`, {
    responseType: 'blob'
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${reg_no}_result.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
};
