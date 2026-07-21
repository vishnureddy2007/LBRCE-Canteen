import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,

  /** Fetch the current user from /api/auth/me. Returns the user (or null). */
  fetchMe: async () => {
    set({ loading: true, error: null });
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        const me = await api.get('/auth/me', { timeout: 15000 });
        set({ user: me, loading: false, initialized: true });
        return me;
      } catch (e) {
        attempts++;
        const isNetworkOrGatewayError =
          e.status === 502 ||
          e.status === 504 ||
          e.message?.includes('timeout') ||
          e.message?.includes('Network') ||
          !e.status; // general network errors

        if (isNetworkOrGatewayError && attempts < maxAttempts) {
          // Wait 2.5 seconds before retrying to let Render spin up
          await new Promise((resolve) => setTimeout(resolve, 2500));
          continue;
        }
        // 401 is expected when nobody's logged in — silent.
        set({ user: null, loading: false, initialized: true, error: e.status === 401 ? null : e.message });
        return null;
      }
    }
  },

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const me = await api.post('/auth/login', { username, password });
      set({ user: me, loading: false, initialized: true });
      return me;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  signup: async (payload) => {
    set({ loading: true, error: null });
    try {
      const me = await api.post('/auth/signup', payload);
      set({ user: me, loading: false, initialized: true });
      return me;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  logout: async () => {
    try { await api.post('/auth/logout'); } catch (_) { /* ignore */ }
    set({ user: null });
  },

  isRole: (role) => get().user?.role === role,
}));

export default useAuthStore;