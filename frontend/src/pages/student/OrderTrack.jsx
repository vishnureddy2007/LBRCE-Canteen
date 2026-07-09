import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, XCircle } from 'lucide-react';
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
  const [confirm, setConfirm] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(`/orders/${id}`)
       .then(setOrder)
       .catch((e) => toast.error(e.message))
       .finally(() => setLoading(false));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  if (loading) return <Loader />;
  if (!order) return null;

  const canCancel = order.status === 'PLACED';

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-brand-orange">
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
              onClick={load}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => downloadBill(order, { studentName: user?.fullName, studentRoll: user?.username })}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-blue text-white text-sm hover:bg-brand-blue-dark"
            >
              <Download size={14} /> Bill
            </button>
            {canCancel && (
              <button
                onClick={() => setConfirm(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
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