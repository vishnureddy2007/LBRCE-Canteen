import { Plus, Minus } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/format';

export default function FoodCard({ food }) {
  const add     = useCartStore((s) => s.add);
  const items   = useCartStore((s) => s.items);
  const setQty  = useCartStore((s) => s.setQty);

  const inCart = items.find((it) => it.foodId === food.id);
  const qty    = inCart?.quantity ?? 0;

  const image = getImageUrl(food.images && food.images[0]);

  return (
    <div className="card rounded-xl bg-white dark:bg-slate-800 shadow-card border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
      <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <img
          src={image}
          alt={food.name}
          onError={(e) => { e.currentTarget.src = '/uploads/placeholder-default.png'; }}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{food.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2rem]">
          {food.description || food.category?.name}
        </p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <div className="text-base font-bold text-brand-blue dark:text-brand-orange-light">
              ₹{Number(food.price).toFixed(2)}
            </div>
            {food.ratingCount > 0 && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                ★ {Number(food.ratingAvg).toFixed(1)} ({food.ratingCount})
              </div>
            )}
          </div>
          {qty === 0 ? (
            <button
              onClick={() => { add(food, 1); toast.success(`${food.name} added to cart`); }}
              className="px-3 py-1.5 rounded-md bg-brand-orange text-white text-sm font-medium hover:bg-brand-orange-dark"
            >
              <Plus size={14} className="inline -mt-0.5" /> Add
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty(food.id, qty - 1)}
                className="w-7 h-7 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600"
                aria-label="decrement"
              >
                <Minus size={14} />
              </button>
              <span className="font-medium w-5 text-center">{qty}</span>
              <button
                onClick={() => setQty(food.id, qty + 1)}
                className="w-7 h-7 rounded-md bg-brand-orange text-white flex items-center justify-center hover:bg-brand-orange-dark"
                aria-label="increment"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}