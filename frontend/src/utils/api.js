import axios from 'axios';

const API = axios.create({
  baseURL: 'https://nibvh-backend.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

export const verifyBVN = (data) => API.post('/verify/bvn', data);
export const verifyNIN = (data) => API.post('/verify/nin', data);
export const verifyCAC = (data) => API.post('/verify/cac', data);
export const getHistory = () => API.get('/verify/history');

export const getWallet = () => API.get('/wallet');
export const getTransactions = () => API.get('/wallet/transactions');
export const fundWallet = (data) => API.post('/wallet/fund', data);

export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const getAdminVerifications = () => API.get('/admin/verifications');
export const getAdminPricing = () => API.get('/admin/pricing');
export const updateAdminPricing = (data) => API.put('/admin/pricing', data);
export const creditUserWallet = (data) => API.post('/admin/wallet/credit', data);
export const downloadStandardPDF = (verificationId) =>
  API.get(`/pdf/standard/${verificationId}`, { responseType: 'blob' });

export const downloadIDCardPDF = (verificationId) =>
  API.get(`/pdf/idcard/${verificationId}`, { responseType: 'blob' });

export const downloadCompliancePDF = (verificationId) =>
  API.get(`/pdf/compliance/${verificationId}`, { responseType: 'blob' });
export const downloadPDF = async (type, verificationId) => {
  let endpoint;
  if (type === 'Standard') endpoint = `/pdf/standard/${verificationId}`;
  if (type === 'ID Card') endpoint = `/pdf/idcard/${verificationId}`;
  if (type === 'Compliance') endpoint = `/pdf/compliance/${verificationId}`;

  const response = await API.get(endpoint, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `NIBVH-${type.replace(' ', '-')}-${verificationId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};