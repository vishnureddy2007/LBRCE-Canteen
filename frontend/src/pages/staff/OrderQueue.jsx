import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Inbox, CheckCircle, XCircle, Play, PackageCheck, Clock, Check } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function OrderQueue() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState('PLACED');

  const load = () => {
    setLoading(true);
    api.get('/orders/queue')
       .then((rows) => setOrders(Array.isArray(rows) ? rows : []))
       .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const callApi = async (fn, okMsg) => {
    setBusy(true);
    try { await fn(); toast.success(okMsg); load(); }
    catch (e) { toast.error(e.message || 'Action failed'); }
    finally { setBusy(false); }
  };

  const accept = (id) => callApi(() => api.post(`/orders/${id}/accept`),    'Order accepted');
  const reject = (id) => callApi(() => api.post(`/orders/${id}/reject`, null, { params: { reason: 'Out of ingredients' } }), 'Order rejected');
  const update = (id, status) => callApi(() => api.patch(`/orders/${id}/status`, { status }), `Marked ${status.toLowerCase()}`);

  if (loading) return <Loader />;

  const placedOrders = orders.filter((o) => o.status === 'PLACED');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  const renderColumn = (title, Icon, colorClass, borderClass, list, status) => {
    const isVisible = activeTab === status;
    const displayClass = isVisible ? 'flex' : 'hidden md:flex';
    return (
      <div className={`flex-1 ${displayClass} flex-col bg-slate-100/60 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700/60 p-4 min-h-[500px]`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-4">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${colorClass} text-white`}>
              <Icon size={16} />
            </span>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-wide">{title}</h2>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {list.length}
          </span>
        </div>

        {list.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl p-6 text-slate-400 dark:text-slate-500 text-xs text-center">
            No orders in this stage
          </div>
        ) : (
          <div className="space-y-3 flex-1 overflow-y-auto">
            {list.map((o) => (
              <div key={o.id} className={`bg-white dark:bg-slate-800 rounded-lg border-l-4 ${borderClass} border-slate-200 dark:border-slate-700/80 p-4 shadow-card hover:shadow-md transition duration-150 space-y-3`}>
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{o.orderNumber}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{formatDateTime(o.placedAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brand-blue dark:text-brand-orange-light text-sm">{formatCurrency(o.totalAmount)}</div>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {o.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{o.studentName}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{o.studentRoll}</div>
                </div>

                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4 border-t border-slate-100 dark:border-slate-700/40 pt-2">
                  {(o.items || []).map((it) => (
                    <li key={it.id}>
                      {it.foodName} <span className="font-bold text-slate-800 dark:text-slate-200">×{it.quantity}</span>
                    </li>
                  ))}
                </ul>

                {o.notes && (
                  <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded text-[11px] italic text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700/40">
                    "{o.notes}"
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/40">
                  {o.status === 'PLACED' && (
                    <>
                      <button
                        onClick={() => accept(o.id)}
                        disabled={busy}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs font-semibold disabled:opacity-60 transition"
                      >
                        <Check size={12} /> Accept
                      </button>
                      <button
                        onClick={() => setConfirm({ type: 'reject', id: o.id })}
                        disabled={busy}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-60 transition"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </>
                  )}
                  {o.status === 'PREPARING' && (
                    <button
                      onClick={() => update(o.id, 'READY')}
                      disabled={busy}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold disabled:opacity-60 transition"
                    >
                      <PackageCheck size={12} /> Ready to Serve
                    </button>
                  )}
                  {o.status === 'READY' && (
                    <button
                      onClick={() => update(o.id, 'DELIVERED')}
                      disabled={busy}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-60 transition"
                    >
                      <CheckCircle size={12} /> Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Order Triage Queue</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Manage the lifecycle of students' orders in real-time.
        </p>
      </div>

      {orders.length > 0 && (
        <div className="flex md:hidden border-b border-slate-200 dark:border-slate-700 mb-2">
          <button
            onClick={() => setActiveTab('PLACED')}
            className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition ${
              activeTab === 'PLACED'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400'
            }`}
          >
            New ({placedOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('PREPARING')}
            className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition ${
              activeTab === 'PREPARING'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400'
            }`}
          >
            Preparing ({preparingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('READY')}
            className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition ${
              activeTab === 'READY'
                ? 'border-green-500 text-green-600 dark:text-green-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400'
            }`}
          >
            Ready ({readyOrders.length})
          </button>
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState icon={Inbox} title="No active orders" description="New orders will appear here as they are placed." />
      ) : (
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {renderColumn('New Orders', Inbox, 'bg-indigo-500', 'border-indigo-500', placedOrders, 'PLACED')}
          {renderColumn('Preparing', Clock, 'bg-amber-500', 'border-amber-500', preparingOrders, 'PREPARING')}
          {renderColumn('Ready to Serve', PackageCheck, 'bg-green-500', 'border-green-500', readyOrders, 'READY')}
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Reject this order?"
        message="The order will be cancelled and the student will be notified."
        destructive
        confirmLabel="Reject"
        onCancel={() => setConfirm(null)}
        onConfirm={async () => { if (confirm) await reject(confirm.id); setConfirm(null); }}
      />
    </div>
  );
}