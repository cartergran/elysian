import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  time: 10000
});

export default api;
