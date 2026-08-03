import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Receipt, Star, Megaphone, Utensils, ArrowRight, Clock } from 'lucide-react';
import api from '../../api/axios';
import EmptyState from '../../components/common/EmptyState';
import OrderCard from '../../components/orders/OrderCard';
import { StatCardSkeleton } from '../../components/common/Skeleton';
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
          api.get('/orders/my?page=0&size=5').catch(() => ({ content: [], totalElements: 0 })),
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl brand-gradient text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3">
            <Utensils size={13} />
            LBRCE Campus Dining
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight leading-tight">
            Welcome back, {user?.fullName || user?.username}!
          </h1>
          <p className="text-sm opacity-90 mt-2 leading-relaxed max-w-xl">
            Hungry between classes? Order freshly prepared South Indian tiffins, biryani, coffee, and snacks for quick campus pickup.
          </p>

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <Link
              to="/student/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm hover:bg-slate-100 transition-all active:scale-95 shadow-md"
            >
              <span>Browse Food Menu</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/student/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md text-white font-bold text-sm hover:bg-white/25 transition-all active:scale-95 border border-white/20"
            >
              <Clock size={16} />
              <span>Track Orders</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} color="blue" />
          <StatCard icon={Receipt} label="Total Spent" value={formatCurrency(stats.totalSpent)} color="orange" />
          <StatCard icon={Star} label="Campus Tier" value="Silver Student" color="gold" />
        </div>
      )}

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-card">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
              <Megaphone size={18} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base">Canteen Announcements</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Live updates and specials</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{a.title}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{a.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Recent Orders</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Your latest food pickup requests</p>
          </div>
          {recent.length > 0 && (
            <Link to="/student/orders" className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders placed yet"
            description="Explore our fresh South Indian breakfast, lunch thali, fast foods & beverages."
            action={
              <Link
                to="/student/menu"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-dark shadow-sm transition-all active:scale-95"
              >
                <Utensils size={14} />
                <span>Explore Canteen Menu</span>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((o) => <OrderCard key={o.id} order={o} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    blue: 'bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-blue-400',
    orange: 'bg-brand-orange/10 text-brand-orange dark:bg-brand-orange/20 dark:text-brand-orange-light',
    gold: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-card flex items-center gap-4 hover:-translate-y-0.5 transition-transform duration-200">
      <div className={`w-12 h-12 rounded-2xl ${colorMap[color] || colorMap.blue} flex items-center justify-center shadow-sm flex-shrink-0`}>
        <Icon size={22} strokeWidth={2} />
      </div>
      <div>
        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">{value}</div>
      </div>
    </div>
  );
}