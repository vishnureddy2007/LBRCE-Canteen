import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import OrderCard from '../../components/orders/OrderCard';
import EmptyState from '../../components/common/EmptyState';
import { ClipboardList } from 'lucide-react';

export default function DailyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show today's orders (very wide window for the demo)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const params = new URLSearchParams({ from: today.toISOString(), size: '100' });
    api.get(`/orders?${params.toString()}`)
       .then((p) => setOrders(p.content || []))
       .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-3">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Daily Orders</h1>
      {orders.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No orders today" description="Once students order, they'll show up here." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {orders.map((o) => <OrderCard key={o.id} order={o} href={`/admin/orders?focus=${o.id}`} />)}
        </div>
      )}
    </div>
  );
}