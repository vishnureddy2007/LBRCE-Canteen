import { useEffect, useState } from 'react';
import api from '../../api/axios';
import CategoryTabs from '../../components/food/CategoryTabs';
import FoodGrid from '../../components/food/FoodGrid';
import SearchBar from '../../components/common/SearchBar';
import { FoodGridSkeleton } from '../../components/common/Skeleton';
import { CATEGORIES } from '../../utils/constants';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Menu() {
  const [categories, setCategories] = useState([{ id: null, name: 'All' }]);
  const [active, setActive]         = useState(null);
  const [q, setQ]                   = useState('');
  const [foods, setFoods]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // Load real categories for the tabs
  useEffect(() => {
    api.get('/categories').then((rows) => {
      setCategories([{ id: null, name: 'All' }, ...rows.map((c) => ({ id: c.id, name: c.name }))]);
    }).catch(() => setCategories(CATEGORIES));
  }, []);

  const loadFoods = () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (active) params.set('category', active);
    if (q)      params.set('q', q);
    params.set('size', '40');
    api.get(`/foods?${params.toString()}`)
       .then((page) => {
         setFoods(page.content || []);
         setError(null);
       })
       .catch((err) => {
         setFoods([]);
         setError(err.message || 'Unable to load menu items. Please check database connection.');
       })
       .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFoods();
  }, [active, q]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
            Canteen Food Menu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Freshly prepared South Indian breakfast, thali meals, fast foods & drinks
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar value={q} onChange={setQ} placeholder="Search idli, biryani, coffee..." />
        </div>
      </div>

      <CategoryTabs categories={categories} activeId={active} onChange={setActive} />

      {error && !loading && (
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-700 dark:text-red-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            onClick={loadFoods}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {loading ? <FoodGridSkeleton count={8} /> : <FoodGrid foods={foods} />}
    </div>
  );
}