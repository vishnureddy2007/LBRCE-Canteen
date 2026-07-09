import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import CategoryTabs from '../../components/food/CategoryTabs';
import FoodGrid from '../../components/food/FoodGrid';
import SearchBar from '../../components/common/SearchBar';
import { CATEGORIES } from '../../utils/constants';

export default function Menu() {
  const [categories, setCategories] = useState([{ id: null, name: 'All' }]);
  const [active, setActive]         = useState(null);
  const [q, setQ]                   = useState('');
  const [foods, setFoods]           = useState([]);
  const [loading, setLoading]       = useState(true);

  // Load real categories for the tabs.
  useEffect(() => {
    api.get('/categories').then((rows) => {
      setCategories([{ id: null, name: 'All' }, ...rows.map((c) => ({ id: c.id, name: c.name }))]);
    }).catch(() => setCategories(CATEGORIES));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (active) params.set('category', active);
    if (q)      params.set('q', q);
    params.set('size', '40');
    api.get(`/foods?${params.toString()}`)
       .then((page) => setFoods(page.content || []))
       .finally(() => setLoading(false));
  }, [active, q]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Menu</h1>
        <SearchBar value={q} onChange={setQ} placeholder="Search dishes..." />
      </div>

      <CategoryTabs categories={categories} activeId={active} onChange={setActive} />

      {loading ? <Loader /> : <FoodGrid foods={foods} />}
    </div>
  );
}