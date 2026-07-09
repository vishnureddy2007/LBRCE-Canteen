import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import CategoryTabs from '../../components/food/CategoryTabs';
import SearchBar from '../../components/common/SearchBar';
import { CheckCircle2, XCircle } from 'lucide-react';
import { formatCurrency, getImageUrl } from '../../utils/format';

/**
 * Staff "Availability" page — a focused view of the menu with a one-click toggle
 * to mark an item sold out / available. Mirrors the food-card look used in
 * {@code ManageFood} so the staff can quickly scan the menu and flip items.
 *
 * Backed by {@code PATCH /api/foods/{id}/availability?available=true|false},
 * which is open to {@code STAFF} and {@code ADMIN}.
 */
export default function Availability() {
  const [foods, setFoods]       = useState([]);
  const [categories, setCats]   = useState([]);
  const [active, setActive]     = useState(null);
  const [query, setQuery]       = useState('');
  const [loading, setLoading]   = useState(true);
  const [busyId, setBusyId]     = useState(null);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (active) params.set('category', active);
    params.set('size', '100');
    Promise.all([
      api.get(`/foods?${params.toString()}`),
      api.get('/categories/all'),
    ]).then(([page, cats]) => {
      setFoods(page.content || []);
      setCats(cats || []);
    }).finally(() => setLoading(false));
  };

  useEffect(load, [active]);

  const toggle = async (food) => {
    const next = !food.available;
    setBusyId(food.id);
    try {
      await api.patch(`/foods/${food.id}/availability`, null, { params: { available: next } });
      toast.success(`${food.name} marked ${next ? 'available' : 'sold out'}`);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to update availability');
    } finally {
      setBusyId(null);
    }
  };

  const filtered = query.trim()
    ? foods.filter((f) => f.name.toLowerCase().includes(query.trim().toLowerCase()))
    : foods;

  const availableCount = foods.filter((f) => f.available).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Availability</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Toggle items on or off the menu instantly. Visible to students right away.
          </p>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-green-600 dark:text-green-400">{availableCount}</span>
          <span className="mx-1">/</span>
          <span>{foods.length} available</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <CategoryTabs
          categories={[{ id: null, name: 'All' }, ...categories.map((c) => ({ id: c.id, name: c.name }))]}
          activeId={active} onChange={setActive}
        />
        <div className="w-full sm:w-64">
          <SearchBar value={query} onChange={setQuery} placeholder="Search items…" />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <EmptyState title="No items" description="No food items match this filter." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-card"
            >
              <div className="w-14 h-14 rounded-md bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                <img
                  src={getImageUrl(f.images && f.images[0])}
                  alt={f.name}
                  onError={(e) => { e.currentTarget.src = '/uploads/placeholder-default.png'; }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{f.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {f.category?.name || 'Uncategorised'} · {formatCurrency(f.price)}
                </div>
              </div>
              <button
                onClick={() => toggle(f)}
                disabled={busyId === f.id}
                className={
                  f.available
                    ? 'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-60'
                    : 'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-medium hover:bg-slate-400 dark:hover:bg-slate-500 disabled:opacity-60'
                }
                aria-pressed={!f.available}
                aria-label={f.available ? 'Mark sold out' : 'Mark available'}
              >
                {f.available ? <><CheckCircle2 size={14} /> On</> : <><XCircle size={14} /> Off</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}