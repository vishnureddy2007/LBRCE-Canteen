import { Minus, Plus, Trash2 } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { formatCurrency, getImageUrl } from '../../utils/format';

export default function CartItem({ item }) {
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);

  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <img
        src={getImageUrl(item.image)}
        alt={item.name}
        onError={(e) => { e.currentTarget.src = '/uploads/placeholder-default.png'; }}
        className="w-14 h-14 rounded-md object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1">{item.name}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{formatCurrency(item.price)}</div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setQty(item.foodId, item.quantity - 1)}
          className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center">{item.quantity}</span>
        <button
          onClick={() => setQty(item.foodId, item.quantity + 1)}
          className="w-7 h-7 rounded-md bg-brand-orange text-white flex items-center justify-center"
        >
          <Plus size={14} />
        </button>
      </div>
      <button
        onClick={() => remove(item.foodId)}
        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md"
        aria-label="Remove"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}