import { create } from 'zustand';
import api from '../api/axios';

let inFlightFetchMePromise = null;

const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,

  /** Fetch the current user from /api/auth/me. Returns the user (or null). */
  fetchMe: async () => {
    // Deduplicate in-flight calls
    if (inFlightFetchMePromise) {
      return inFlightFetchMePromise;
    }

    set({ loading: true, error: null });

    let fallbackFired = false;
    const fallbackTimer = setTimeout(() => {
      fallbackFired = true;
      set({ initialized: true, loading: false });
    }, 3000);

    inFlightFetchMePromise = (async () => {
      try {
        const me = await api.get('/auth/me', { timeout: 7000 });
        clearTimeout(fallbackTimer);
        set({ user: me, loading: false, initialized: true, error: null });
        return me;
      } catch (e) {
        clearTimeout(fallbackTimer);
        // Only reset user to null if unauthorized or server error, but don't overwrite if fallback already fired with valid user
        const is401 = e.status === 401;
        set({
          user: is401 ? null : get().user,
          loading: false,
          initialized: true,
          error: is401 ? null : (e.message || 'Auth check failed'),
        });
        return null;
      } finally {
        clearTimeout(fallbackTimer);
        inFlightFetchMePromise = null;
        if (!fallbackFired) {
          set({ loading: false, initialized: true });
        }
      }
    })();

    return inFlightFetchMePromise;
  },

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const me = await api.post('/auth/login', { username, password }, { timeout: 25000 });
      if (!me || typeof me !== 'object' || !me.role) {
        throw new Error('Server returned invalid auth response. Please retry.');
      }
      set({ user: me, loading: false, initialized: true, error: null });
      return me;
    } catch (e) {
      set({ loading: false, error: e.message || 'Login failed' });
      throw e;
    }
  },

  signup: async (payload) => {
    set({ loading: true, error: null });
    try {
      const me = await api.post('/auth/signup', payload, { timeout: 25000 });
      if (!me || typeof me !== 'object' || !me.role) {
        throw new Error('Server returned invalid auth response. Please retry.');
      }
      set({ user: me, loading: false, initialized: true, error: null });
      return me;
    } catch (e) {
      set({ loading: false, error: e.message || 'Signup failed' });
      throw e;
    }
  },

  logout: async () => {
    try { await api.post('/auth/logout'); } catch (_) { /* ignore */ }
    set({ user: null, loading: false, error: null });
  },

  isRole: (role) => get().user?.role === role,
}));

export default useAuthStore;