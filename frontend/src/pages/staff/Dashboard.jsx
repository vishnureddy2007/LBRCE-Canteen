import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import { ClipboardList, Clock, CheckCircle, Truck, Inbox } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export default function StaffDashboard() {
  const [stats, setStats] = useState({ placed: 0, preparing: 0, ready: 0, delivered: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const page = await api.get('/orders/queue');
        const placed = page || [];
        const preparing = placed.length; // the queue is PLACED only — we treat as waiting
        // Pull a wider window to compute rough counters
        const all = await api.get('/orders?page=0&size=200&status=PREPARING').catch(() => ({ content: [] }));
        const ready = await api.get('/orders?page=0&size=200&status=READY').catch(() => ({ content: [] }));
        const delivered = await api.get('/orders?page=0&size=200&status=DELIVERED').catch(() => ({ content: [] }));
        setStats({
          placed:    placed.length,
          preparing: all.content?.length || 0,
          ready:     ready.content?.length || 0,
          delivered: delivered.content?.length || 0,
          revenue:   delivered.content?.reduce((s, o) => s + Number(o.totalAmount), 0) || 0,
        });
      } catch (e) { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Loader label="Loading staff dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      <div className="rounded-xl brand-gradient text-white p-6 shadow-card">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <p className="text-sm opacity-90 mt-1">Triage incoming orders and keep the queue moving.</p>
        <div className="mt-4 flex gap-2 flex-wrap">
          <Link to="/staff/queue" className="px-4 py-2 rounded-md bg-white text-brand-blue font-medium text-sm">Open Queue ({stats.placed})</Link>
          <Link to="/staff/orders" className="px-4 py-2 rounded-md bg-white/20 text-white font-medium text-sm hover:bg-white/30">All Orders</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Stat icon={Inbox}        label="In Queue"    value={stats.placed}    color="bg-slate-100 text-slate-700" />
        <Stat icon={Clock}        label="Preparing"   value={stats.preparing} color="bg-amber-100 text-amber-800" />
        <Stat icon={CheckCircle}  label="Ready"       value={stats.ready}     color="bg-blue-100 text-blue-800" />
        <Stat icon={Truck}        label="Delivered"   value={stats.delivered} color="bg-green-100 text-green-800" />
        <Stat icon={ClipboardList}label="Revenue"     value={formatCurrency(stats.revenue)} color="bg-purple-100 text-purple-800" />
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-card flex items-center gap-3">
      <div className={`w-10 h-10 rounded-md flex items-center justify-center ${color} dark:bg-slate-700 dark:text-slate-200`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</div>
      </div>
    </div>
  );
}