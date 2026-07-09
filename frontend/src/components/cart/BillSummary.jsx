import { formatCurrency } from '../../utils/format';

export default function BillSummary({ items, total, buttonLabel, onAction, busy }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-card">
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Bill Summary</h3>
      <div className="space-y-1 text-sm">
        {items.map((it) => (
          <div key={it.foodId} className="flex justify-between text-slate-600 dark:text-slate-300">
            <span className="truncate">{it.name} × {it.quantity}</span>
            <span>{formatCurrency(it.price * it.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 dark:border-slate-700 mt-3 pt-3 flex justify-between font-semibold text-slate-900 dark:text-slate-100">
        <span>Total</span>
        <span className="text-brand-blue dark:text-brand-orange-light">{formatCurrency(total)}</span>
      </div>
      {onAction && (
        <button
          onClick={onAction}
          disabled={busy}
          className="mt-4 w-full py-2.5 rounded-md bg-brand-orange text-white font-medium hover:bg-brand-orange-dark disabled:opacity-60"
        >
          {busy ? 'Please wait...' : buttonLabel || 'Place Order'}
        </button>
      )}
    </div>
  );
}