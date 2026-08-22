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

    inFlightFetchMePromise = (async () => {
      try {
        const me = await api.get('/auth/me', { timeout: 7000 });
        set({ user: me, loading: false, initialized: true, error: null });
        return me;
      } catch (e) {
        // Do not redirect before the session check has settled. On a first
        // load any failure leaves the user unauthenticated; after a session
        // exists, transient network failures do not discard it.
        const is401 = e.status === 401;
        set({
          user: is401 || !get().initialized ? null : get().user,
          loading: false,
          initialized: true,
          error: is401 ? null : (e.message || 'Auth check failed'),
        });
        return null;
      } finally {
        inFlightFetchMePromise = null;
        set({ loading: false, initialized: true });
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
