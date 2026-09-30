import axios from 'axios';

// The public application always talks to its own origin. Vercel forwards
// /api and /uploads to the backend, keeping browser sessions same-origin.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 90000, // 90s timeout to allow Render free instance cold starts to complete
});

let unauthorizedTimer = null;
const dispatchUnauthorized = () => {
  if (unauthorizedTimer) return;
  unauthorizedTimer = setTimeout(() => {
    unauthorizedTimer = null;
  }, 500);
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));
};

// Response interceptor: unwrap standard envelope & handle automatic cold-start retry
api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (typeof body === 'string' && (body.trim().startsWith('<!') || body.trim().startsWith('<html'))) {
      const err = new Error('Backend server is waking up (cold start). Retrying...');
      err.status = response.status || 504;
      throw err;
    }
    if (body && typeof body === 'object' && 'success' in body) {
      if (body.success) return body.data;
      const err = new Error(body.message || 'Request failed');
      err.payload = body;
      throw err;
    }
    return body;
  },
  async (error) => {
    const config = error.config;
    const status = error.response?.status;
    const body   = error.response?.data;

    // Automatic 1-time retry for Render cold starts (502, 503, 504, or timeout)
    const isColdStart = (
      status === 502 || status === 503 || status === 504 ||
      error.code === 'ECONNABORTED' || error.message?.includes('timeout') ||
      (typeof body === 'string' && (body.trim().startsWith('<!') || body.trim().startsWith('<html')))
    );

    if (isColdStart && config && !config._retry) {
      config._retry = true;
      // Wait 4 seconds for Render container to finish spinning up, then retry request
      await new Promise((resolve) => setTimeout(resolve, 4000));
      return api(config);
    }

    let msg = (body && typeof body === 'object' && body.message) || error.message || 'Network error';
    
    if (typeof body === 'string' && (body.trim().startsWith('<!') || body.trim().startsWith('<html'))) {
      msg = 'Backend server is starting up (cold start). Please wait 10 seconds and try again.';
    } else if (status === 502 || status === 503 || status === 504) {
      msg = 'Backend server is starting up (cold start / timeout). Please wait 10 seconds and try again.';
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      msg = 'Server connection timed out while waking up. Please wait 10 seconds and try again.';
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      msg = 'Server temporarily unavailable. Please check your connection and try again.';
    }

    const err = new Error(msg);
    err.status = status;
    err.errors = body?.errors;
    if (status === 401 && !config?.url?.includes('/auth/me') && !config?.url?.includes('/auth/login') && !config?.url?.includes('/auth/signup')) {
      dispatchUnauthorized();
    }
    return Promise.reject(err);
  }
);

export default api;
