import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import OrderCard from '../../components/orders/OrderCard';
import SearchBar from '../../components/common/SearchBar';
import { ORDER_STATUSES } from '../../utils/constants';
import EmptyState from '../../components/common/EmptyState';
import { ClipboardList } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoad] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  const load = () => {
    setLoad(true);
    const params = new URLSearchParams({ size: '50' });
    if (status) params.set('status', status);
    if (q)      params.set('studentName', q); // (extra) just a UI nicety
    api.get(`/orders?${params.toString()}`).then((p) => setOrders(p.content || [])).finally(() => setLoad(false));
  };
  useEffect(load, [status]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-3">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Orders</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={q} onChange={setQ} placeholder="Search by student name..." />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : orders.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No orders found" description="Try changing the filters." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {orders.map((o) => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
}