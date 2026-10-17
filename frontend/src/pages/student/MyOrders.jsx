import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import OrderCard from '../../components/orders/OrderCard';
import { ShoppingBag, AlertCircle, RefreshCw } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    api.get('/orders/my?page=0&size=50')
       .then((p) => {
         setOrders(p.content || []);
         setError(null);
       })
       .catch((err) => {
         setError(err.message || 'Failed to load orders');
         setOrders([]);
       })
       .finally(() => {
         if (!silent) setLoading(false);
       });
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(() => loadOrders(true), 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader label="Loading your orders..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Orders</h1>
        <button
          onClick={() => loadOrders(false)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-4 flex items-center justify-between text-red-700 dark:text-red-300 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadOrders(false)}
            className="px-2.5 py-1 rounded bg-red-600 text-white text-xs font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {orders.length === 0 && !error ? (
        <EmptyState icon={ShoppingBag} title="No orders yet" description="Your placed orders will appear here." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {orders.map((o) => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
}