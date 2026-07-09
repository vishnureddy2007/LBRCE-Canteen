import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Receipt, Star, Megaphone } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import OrderCard from '../../components/orders/OrderCard';
import useAuthStore from '../../store/authStore';
import { formatCurrency } from '../../utils/format';

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent]   = useState([]);
  const [stats, setStats]     = useState({ totalOrders: 0, totalSpent: 0 });
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [orders, anns] = await Promise.all([
          api.get('/orders/my?page=0&size=5'),
          api.get('/announcements').catch(() => []),
        ]);
        setRecent(orders.content || []);
        setStats({
          totalOrders: orders.totalElements || 0,
          totalSpent: (orders.content || []).reduce((s, o) => s + Number(o.totalAmount), 0),
        });
        setAnnouncements(anns || []);
      } catch (e) { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="rounded-xl brand-gradient text-white p-6 shadow-card">
        <p className="text-sm opacity-90">Welcome back,</p>
        <h1 className="text-2xl font-bold">{user?.fullName || user?.username}</h1>
        <p className="text-sm opacity-90 mt-1">
          {user?.role === 'STUDENT' && 'Hungry? Browse the menu and order now.'}
        </p>
        <div className="mt-4 flex gap-2 flex-wrap">
          <Link to="/student/menu" className="px-4 py-2 rounded-md bg-white text-brand-blue font-medium text-sm">Browse Menu</Link>
          <Link to="/student/orders" className="px-4 py-2 rounded-md bg-white/20 text-white font-medium text-sm hover:bg-white/30">My Orders</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} />
        <StatCard icon={Receipt}     label="Total Spent" value={formatCurrency(stats.totalSpent)} />
        <StatCard icon={Star}        label="Reward Tier" value="Bronze" />
      </div>

      {announcements.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone size={18} className="text-brand-orange" />
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Announcements</h2>
          </div>
          <ul className="space-y-2">
            {announcements.map((a) => (
              <li key={a.id} className="p-3 rounded-md bg-slate-50 dark:bg-slate-700/50">
                <div className="font-medium text-slate-800 dark:text-slate-100">{a.title}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">{a.body}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Recent Orders</h2>
        {recent.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders yet"
            description="When you place an order it will appear here."
            action={<Link to="/student/menu" className="px-4 py-2 rounded-md bg-brand-orange text-white text-sm">Browse Menu</Link>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recent.map((o) => <OrderCard key={o.id} order={o} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
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