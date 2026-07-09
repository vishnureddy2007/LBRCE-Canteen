import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import { REPORT_PERIODS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Star } from 'lucide-react';

export default function Reports() {
  const [period, setPeriod] = useState('daily');
  const [sales, setSales]   = useState(null);
  const [tops, setTops]     = useState([]);
  const [loading, setLoad]  = useState(true);

  useEffect(() => {
    setLoad(true);
    Promise.all([
      api.get(`/reports/sales?period=${period}`),
      api.get(`/reports/top-items?period=${period}&limit=5`),
    ]).then(([s, t]) => {
      setSales(s);
      setTops(t || []);
    }).finally(() => setLoad(false));
  }, [period]);

  if (loading || !sales) return <Loader label="Generating report..." />;

  const chartData = (sales.buckets || []).map((b) => ({ date: formatDate(b.date), revenue: Number(b.revenue) }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
        <div className="flex gap-2">
          {REPORT_PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                period === p.value
                  ? 'bg-brand-blue text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat icon={TrendingUp} label="Total Revenue" value={formatCurrency(sales.totalRevenue)} />
        <Stat icon={TrendingUp} label="Total Orders" value={sales.totalOrders} />
        <Stat icon={Star}       label="Top items"    value={tops.length} />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-card">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Revenue</h3>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="date" stroke="rgb(100 116 139)" />
              <YAxis stroke="rgb(100 116 139)" />
              <Tooltip contentStyle={{ background: '#1f2937', color: '#fff', border: 'none' }} formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#06B6D4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-card">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Top items</h3>
        <table className="w-full text-sm">
          <thead className="text-slate-700 dark:text-slate-200">
            <tr>
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Qty sold</th>
              <th className="text-right py-2">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {tops.map((t, i) => (
              <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                <td className="py-2 text-slate-800 dark:text-slate-100">{t.foodName}</td>
                <td className="py-2 text-right text-slate-600 dark:text-slate-300">{t.quantitySold}</td>
                <td className="py-2 text-right font-semibold text-brand-blue dark:text-brand-orange-light">{formatCurrency(t.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
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