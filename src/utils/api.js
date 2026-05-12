import axios from 'axios'
const API_BASE = import.meta.env.VITE_API_URL || 'https://ntabackend-c5ks.onrender.com/api'
const api = axios.create({ baseURL: API_BASE, timeout: 20000 })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tp_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) { localStorage.removeItem('tp_token'); localStorage.removeItem('tp_admin'); window.location.href = '/admin/login' }
  return Promise.reject(err)
})
export const getEvents        = (p)     => api.get('/events', { params: p })
export const getEvent         = (id)    => api.get(`/events/${id}`)
export const registerForEvent = (id, d) => api.post(`/events/${id}/register`, d)
export const getHighlights    = ()      => api.get('/highlights')
export const getHighlight     = (id)    => api.get(`/highlights/${id}`)
export const adminLogin       = (d)     => api.post('/admin/login', d)
export const getAdminMe       = ()      => api.get('/admin/me')
export const adminGetEvents   = (p)     => api.get('/admin/events', { params: p })
export const adminCreateEvent = (d)     => api.post('/admin/events', d)
export const adminUpdateEvent = (id, d) => api.put(`/admin/events/${id}`, d)
export const adminDeleteEvent = (id)    => api.delete(`/admin/events/${id}`)
export const adminGetRegistrations = (eId) => api.get(`/admin/registrations/${eId}`)
export const adminAllRegistrations = ()    => api.get('/admin/registrations')
export const adminUpdateRegStatus  = (id, status) => api.patch(`/admin/registrations/${id}/status`, { status })
export const adminVerifyCode       = (code) => api.get(`/events/verify/${code}`)
export const adminGetHighlights    = ()  => api.get('/admin/highlights')
export const adminCreateHighlight  = (fd) => api.post('/admin/highlights', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminDeleteHighlight  = (id) => api.delete(`/admin/highlights/${id}`)
export const getDashboard = () => api.get('/admin/dashboard')
export default api
