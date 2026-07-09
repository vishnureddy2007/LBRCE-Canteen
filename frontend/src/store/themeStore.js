import { create } from 'zustand';

const STORAGE_KEY = 'lbrce-theme';

// Theme store. Initial value is read on first import — the inline script in
// index.html also applies it pre-mount to avoid the flash of wrong theme.
const initial = (() => {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* ignore */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
})();

const apply = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
};

// Apply on load (defensive — index.html script should already have done it)
if (typeof window !== 'undefined') apply(initial);

const useThemeStore = create((set, get) => ({
  theme: initial,

  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
    set({ theme: next });
  },

  set: (next) => {
    apply(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
    set({ theme: next });
  },
}));

export default useThemeStore;