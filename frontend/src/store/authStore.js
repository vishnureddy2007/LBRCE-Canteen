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

    // Safety unblock: If backend takes longer than 4s to respond (e.g. Render cold boot),
    // unblock UI so mobile users aren't trapped on a blank full-screen loading spinner.
    const fallbackTimer = setTimeout(() => {
      if (!get().initialized) {
        set({ initialized: true });
      }
    }, 4000);

    let attempts = 0;
    const maxAttempts = 2;
    try {
      while (attempts < maxAttempts) {
        try {
          const me = await api.get('/auth/me', { timeout: 45000 });
          clearTimeout(fallbackTimer);
          set({ user: me, loading: false, initialized: true, error: null });
          return me;
        } catch (e) {
          attempts++;
          const isNetworkOrGatewayError =
            e.status === 502 ||
            e.status === 504 ||
            e.message?.includes('timeout') ||
            e.message?.includes('Network') ||
            !e.status;

          if (isNetworkOrGatewayError && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            continue;
          }
          clearTimeout(fallbackTimer);
          set({ user: null, loading: false, initialized: true, error: e.status === 401 ? null : e.message });
          return null;
        }
      }
    } finally {
      clearTimeout(fallbackTimer);
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