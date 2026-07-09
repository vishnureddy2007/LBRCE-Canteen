import { create } from 'zustand';

// Cart state. Persisted to localStorage so it survives reloads.
const STORAGE_KEY = 'lbrce-cart-v1';

const loadInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
};

const persist = (items) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
};

const useCartStore = create((set, get) => ({
  items: typeof window !== 'undefined' ? loadInitial() : [],

  add: (food, qty = 1) => {
    const items = [...get().items];
    const existing = items.find((it) => it.foodId === food.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      items.push({
        foodId: food.id,
        name: food.name,
        price: Number(food.price),
        image: (food.images && food.images[0]) || '',
        quantity: qty,
      });
    }
    persist(items);
    set({ items });
  },

  setQty: (foodId, qty) => {
    let items = get().items.map((it) =>
      it.foodId === foodId ? { ...it, quantity: Math.max(0, qty) } : it
    ).filter((it) => it.quantity > 0);
    persist(items);
    set({ items });
  },

  remove: (foodId) => {
    const items = get().items.filter((it) => it.foodId !== foodId);
    persist(items);
    set({ items });
  },

  clear: () => { persist([]); set({ items: [] }); },

  // Derived helpers
  itemCount: () => get().items.reduce((s, it) => s + it.quantity, 0),
  total:     () => get().items.reduce((s, it) => s + it.price * it.quantity, 0),
}));

export default useCartStore;