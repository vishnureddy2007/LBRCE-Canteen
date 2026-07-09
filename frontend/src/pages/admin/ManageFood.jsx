import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import FoodGrid from '../../components/food/FoodGrid';
import CategoryTabs from '../../components/food/CategoryTabs';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FoodForm from '../../components/admin/FoodForm';
import { getImageUrl } from '../../utils/format';

export default function ManageFood() {
  const [foods, setFoods]     = useState([]);
  const [categories, setCats] = useState([]);
  const [active, setActive]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);   // food being edited
  const [creating, setCreating] = useState(false);
  const [confirm, setConfirm] = useState(null);

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

  const remove = async (id) => {
    try { await api.delete(`/foods/${id}`); toast.success('Food deleted'); load(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Food</h1>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-brand-blue text-white text-sm hover:bg-brand-blue-dark"
        >
          <Plus size={16} /> Add food
        </button>
      </div>

      <CategoryTabs
        categories={[{ id: null, name: 'All' }, ...categories.map((c) => ({ id: c.id, name: c.name }))]}
        activeId={active} onChange={setActive}
      />

      {loading ? <Loader /> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {foods.map((f) => (
            <div key={f.id} className="relative">
              <FoodGridPlaceholder food={f} />
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => setEditing(f)}
                  className="p-1.5 rounded-md bg-white text-brand-blue shadow hover:bg-slate-100"
                  aria-label="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setConfirm(f.id)}
                  className="p-1.5 rounded-md bg-white text-red-600 shadow hover:bg-red-50"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <FoodForm
          food={editing}
          categories={categories}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={load}
        />
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Delete this food item?"
        message="Existing orders will still reference the snapshot, but it will no longer be orderable."
        destructive
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={async () => { if (confirm) await remove(confirm); setConfirm(null); }}
      />
    </div>
  );
}

function FoodGridPlaceholder({ food }) {
  return (
    <div className="card rounded-xl bg-white dark:bg-slate-800 shadow-card border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
      <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <img
          src={getImageUrl(food.images && food.images[0])}
          alt={food.name}
          onError={(e) => { e.currentTarget.src = '/uploads/placeholder-default.png'; }}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{food.name}</div>
        <div className="text-sm text-brand-blue dark:text-brand-orange-light font-bold">₹{Number(food.price).toFixed(2)}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{food.available ? 'Available' : 'Sold out'}</div>
      </div>
    </div>
  );
}