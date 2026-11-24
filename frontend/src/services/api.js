import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 15000 })
api.interceptors.request.use((cfg) => { const t = localStorage.getItem('medilens_token'); if (t && t !== 'demo-token') cfg.headers.Authorization = `Bearer ${t}`; return cfg })
export default api
export const reportsApi = {
  list: () => api.get('/reports'),
  get: (id) => api.get(`/reports/${id}`),
  upload: (form) => api.post('/reports/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => api.delete(`/reports/${id}`),
  summary: (id) => api.get(`/reports/${id}/summary`, { responseType: 'blob' }),
  original: (id) => api.get(`/reports/${id}/download`, { responseType: 'blob' }),
}
