import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Users, ShoppingBag, UtensilsCrossed, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, students: 0, food: 0, revenue: 0 });
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [orders, students, food] = await Promise.all([
          api.get('/orders?size=200'),
          api.get('/students?size=200'),
          api.get('/foods?size=200'),
        ]);
        setStats({
          orders: orders.totalElements || (orders.content || []).length,
          students: students.totalElements || (students.content || []).length,
          food: food.totalElements || (food.content || []).length,
          revenue: (orders.content || [])
            .filter((o) => o.status === 'DELIVERED')
            .reduce((s, o) => s + Number(o.totalAmount), 0),
        });
      } catch (e) { /* ignore */ }
      finally { setLoad(false); }
    })();
  }, []);

  if (loading) return <Loader label="Loading admin dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      <div className="rounded-xl brand-gradient text-white p-6 shadow-card">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm opacity-90 mt-1">Snapshot of your canteen, today and beyond.</p>
        <div className="mt-4 flex gap-2 flex-wrap">
          <Link to="/admin/foods"   className="px-4 py-2 rounded-md bg-white text-brand-blue font-medium text-sm">Manage Food</Link>
          <Link to="/admin/orders"  className="px-4 py-2 rounded-md bg-white/20 text-white font-medium text-sm">All Orders</Link>
          <Link to="/admin/reports" className="px-4 py-2 rounded-md bg-white/20 text-white font-medium text-sm">Reports</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPI icon={Users}          label="Students" value={stats.students} />
        <KPI icon={UtensilsCrossed}label="Food items" value={stats.food} />
        <KPI icon={ShoppingBag}    label="Orders" value={stats.orders} />
        <KPI icon={IndianRupee}    label="Revenue (delivered)" value={formatCurrency(stats.revenue)} />
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-card flex items-center gap-3">
      <div className="w-10 h-10 rounded-md bg-brand-blue/10 text-brand-blue dark:bg-brand-orange/20 dark:text-brand-orange-light flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</div>
      </div>
    </div>
  );
}