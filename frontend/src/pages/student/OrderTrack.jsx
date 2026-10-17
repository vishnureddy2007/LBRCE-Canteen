import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import OrderStatusTimeline from '../../components/orders/OrderStatusTimeline';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { downloadBill } from '../../utils/downloadBill';
import useAuthStore from '../../store/authStore';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function OrderTrack() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user    = useAuthStore((s) => s.user);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(false);

  const load = (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    api.get(`/orders/${id}`)
       .then((res) => {
         setOrder(res);
         setError(null);
       })
       .catch((e) => {
         setError(e.message || 'Unable to load order details');
         if (!silent) toast.error(e.message);
       })
       .finally(() => {
         if (!silent) setLoading(false);
       });
  };

  useEffect(() => {
    load();
  }, [id]);

  // Real-time status sync across devices: poll every 10 seconds while active
  useEffect(() => {
    if (!order || order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      return;
    }
    const timer = setInterval(() => {
      load(true);
    }, 10000);
    return () => clearInterval(timer);
  }, [id, order?.status]);

  if (loading) return <Loader label="Loading order details..." />;

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Details Unavailable</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {error || 'Could not find the requested order. It may have been deleted or the database is reconnecting.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/student/orders')}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Back to Orders
          </button>
          <button
            onClick={() => load(false)}
            className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const canCancel = order.status === 'PLACED';

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-brand-orange cursor-pointer">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Order</div>
            <div className="font-bold text-xl text-slate-900 dark:text-white">{order.orderNumber}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(order.placedAt)}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(false)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              aria-label="Refresh status"
              title="Refresh status"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => downloadBill(order, { studentName: user?.fullName, studentRoll: user?.username })}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-blue text-white text-sm hover:bg-brand-blue-dark cursor-pointer"
            >
              <Download size={14} /> Bill
            </button>
            {canCancel && (
              <button
                onClick={() => setConfirm(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 cursor-pointer"
              >
                <XCircle size={14} /> Cancel
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <OrderStatusTimeline status={order.status} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-card">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Items</h3>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {(order.items || []).map((it) => (
            <div key={it.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">{it.foodName}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">× {it.quantity} @ {formatCurrency(it.unitPrice)}</div>
              </div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(it.subtotal)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between text-lg font-bold text-slate-900 dark:text-white">
          <span>Total</span>
          <span className="text-brand-blue dark:text-brand-orange-light">{formatCurrency(order.totalAmount)}</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Payment: {order.paymentMethod} · {order.paymentStatus}
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        title="Cancel this order?"
        message="This cannot be undone. The order will be marked cancelled."
        destructive
        confirmLabel="Yes, cancel"
        onCancel={() => setConfirm(false)}
        onConfirm={async () => {
          try {
            const updated = await api.post(`/orders/${order.id}/cancel`, null, { params: { reason: 'Cancelled by student' } });
            toast.success('Order cancelled');
            setOrder(updated);
          } catch (e) { toast.error(e.message); }
          finally { setConfirm(false); }
        }}
      />
    </div>
  );
}