import axios from 'axios';

// In production, the single deployed Spring Boot container serves both frontend and API
// from the same origin, so API_BASE defaults to relative '/api'.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 90000, // 90s timeout to allow cold starts or slow cloud DB handshakes
});

let unauthorizedTimer = null;
const dispatchUnauthorized = () => {
  if (unauthorizedTimer) return;
  unauthorizedTimer = setTimeout(() => {
    unauthorizedTimer = null;
  }, 500);
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));
};

// Response interceptor: unwrap standard ApiResponse envelope & handle automatic cold-start retry
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

    // Automatic 1-time retry for true gateway timeouts / cold starts (502, 504, or timeout)
    const isColdStart = (
      (status === 502 || status === 504 || error.code === 'ECONNABORTED' || error.message?.includes('timeout')) ||
      (typeof body === 'string' && (body.trim().startsWith('<!') || body.trim().startsWith('<html')))
    );

    if (isColdStart && config && !config._retry) {
      config._retry = true;
      // Wait 4 seconds for container to finish spinning up, then retry request
      await new Promise((resolve) => setTimeout(resolve, 4000));
      return api(config);
    }

    // Preserve real backend error messages (e.g., from GlobalExceptionHandler)
    let msg = (body && typeof body === 'object' && body.message) ? body.message : '';

    if (!msg) {
      if (typeof body === 'string' && (body.trim().startsWith('<!') || body.trim().startsWith('<html'))) {
        msg = 'Backend server is starting up. Please wait a few seconds and try again.';
      } else if (status === 502 || status === 504) {
        msg = 'Server gateway timeout. Please wait 10 seconds and try again.';
      } else if (status === 503) {
        msg = 'Service is temporarily unavailable. Please try again shortly.';
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        msg = 'Connection timed out. Please check your connection and retry.';
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        msg = 'Unable to reach the server. Please check your internet connection and try again.';
      } else {
        msg = error.message || 'An unexpected error occurred';
      }
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
