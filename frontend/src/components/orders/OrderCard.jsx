import { Link } from 'react-router-dom';
import { ORDER_STATUSES } from '../../utils/constants';
import { formatDateTime, formatCurrency } from '../../utils/format';

export default function OrderCard({ order, href }) {
  const meta = ORDER_STATUSES.find((s) => s.value === order.status);
  const itemCount = (order.items || []).reduce((s, it) => s + it.quantity, 0);
  return (
    <Link
      to={href || `/student/orders/${order.id}`}
      className="block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-card p-4 hover:shadow-md transition"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{order.orderNumber}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(order.placedAt)}</div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${meta?.color}`}>{meta?.label || order.status}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-300">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
        <span className="font-semibold text-brand-blue dark:text-brand-orange-light">{formatCurrency(order.totalAmount)}</span>
      </div>
    </Link>
  );
}