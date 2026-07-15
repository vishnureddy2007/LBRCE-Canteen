import axios from 'axios';

// Centralized axios instance. withCredentials is required so the session
// cookie set by Spring Security is sent on cross-origin requests during dev.
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Response interceptor: unwrap the standard envelope so callers see just the
// payload, and surface backend errors as rejected promises with a clean
// message string.
api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body) {
      if (body.success) return body.data;
      // backend returned success=false with a message — treat as error
      const err = new Error(body.message || 'Request failed');
      err.payload = body;
      throw err;
    }
    return body;
  },
  (error) => {
    const status = error.response?.status;
    const body   = error.response?.data;
    const msg = (body && body.message) || error.message || 'Network error';
    const err = new Error(msg);
    err.status = status;
    err.errors = body?.errors;
    if (status === 401 && !error.config?.url?.includes('/auth/me') && !error.config?.url?.includes('/auth/login')) {
      // surface auth events for the store to handle
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(err);
  }
);

export default api;