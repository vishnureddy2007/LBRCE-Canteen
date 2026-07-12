import { Plus, Minus, Star } from 'lucide-react';
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
    <div className="card rounded-2xl bg-white dark:bg-slate-800 shadow-card border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group">
      {/* Food Image Container */}
      <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
        <img
          src={image}
          alt={food.name}
          onError={(e) => { e.currentTarget.src = '/uploads/placeholder-default.png'; }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ease-out"
          loading="lazy"
        />
        {/* Category Badge */}
        {food.category && (
          <span className="absolute top-3 left-3 bg-blue-600/90 dark:bg-slate-900/80 backdrop-blur-sm text-white dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
            {food.category.name}
          </span>
        )}
        
        {/* Rating Badge */}
        {food.ratingCount > 0 && (
          <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm text-amber-500 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 text-xs shadow-sm">
            <Star size={12} className="fill-amber-500 stroke-amber-500" />
            <span>{Number(food.ratingAvg).toFixed(1)}</span>
            <span className="text-[10px] text-slate-400 font-normal">({food.ratingCount})</span>
          </div>
        )}
      </div>

      {/* Food Details */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base leading-snug line-clamp-1 mb-1 group-hover:text-brand-blue dark:group-hover:text-brand-orange-light transition-colors duration-200">
          {food.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2rem] leading-relaxed mb-4">
          {food.description || "Freshly prepared campus dish."}
        </p>

        {/* Pricing and Actions */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white leading-none">
              ₹{Number(food.price).toFixed(2)}
            </span>
          </div>

          {qty === 0 ? (
            <button
              onClick={() => { add(food, 1); toast.success(`${food.name} added to cart`); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange text-white text-xs font-semibold hover:bg-brand-orange-dark transition-all duration-150 active:scale-95 shadow-sm hover:shadow"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/80 p-1 rounded-xl border border-slate-200/50 dark:border-slate-600/40">
              <button
                onClick={() => setQty(food.id, qty - 1)}
                className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm active:scale-90 transition-all"
                aria-label="decrement"
              >
                <Minus size={14} strokeWidth={2.5} />
              </button>
              <span className="font-semibold w-5 text-center text-xs text-slate-800 dark:text-slate-100">{qty}</span>
              <button
                onClick={() => setQty(food.id, qty + 1)}
                className="w-7 h-7 rounded-lg bg-brand-orange text-white flex items-center justify-center hover:bg-brand-orange-dark shadow-sm active:scale-90 transition-all"
                aria-label="increment"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}