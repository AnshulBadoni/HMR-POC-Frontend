import axios from 'axios';

const API_BASE_URL = "https://hmr-poc.onrender.com";

const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || 'An unexpected error occurred';
    return Promise.reject({ message, status: error.response?.status });
  }
);

export const employeeAPI = {
  getAll: (params = {}) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  delete: (id) => api.delete(`/employees/${id}`),
};

export const attendanceAPI = {
  getAll: (params = {}) => api.get('/attendance', { params }),
  getByEmployee: (employeeId, params = {}) => 
    api.get(`/attendance/employee/${employeeId}`, { params }),
  mark: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
