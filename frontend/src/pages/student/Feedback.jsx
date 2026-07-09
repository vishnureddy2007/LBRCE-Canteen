import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Star, MessageSquare } from 'lucide-react';
import { formatDateTime } from '../../utils/format';

export default function Feedback() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]       = useState(false);
  const [draft, setDraft]     = useState({});

  useEffect(() => {
    api.get('/orders/my?page=0&size=20')
       .then((p) => {
         const recent = (p.content || []).filter((o) => o.status === 'DELIVERED');
         setOrders(recent);
       })
       .finally(() => setLoading(false));
  }, []);

  const setRating = (orderId, rating) => setDraft((d) => ({ ...d, [orderId]: { ...(d[orderId] || {}), rating } }));
  const setComment = (orderId, comment) => setDraft((d) => ({ ...d, [orderId]: { ...(d[orderId] || {}), comment } }));

  const submit = async (order) => {
    const d = draft[order.id];
    if (!d || !d.rating) { toast.error('Please choose a rating'); return; }
    setBusy(true);
    try {
      await api.post('/feedback', {
        orderId: order.id,
        // Send feedback for the first item — backend aggregates per item.
        foodItemId: order.items?.[0]?.foodId,
        rating: Number(d.rating),
        comment: d.comment || null,
      });
      toast.success('Thanks for your feedback!');
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch (e) {
      toast.error(e.message || 'Failed to submit feedback');
    } finally { setBusy(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Feedback</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">Rate your delivered orders to help the canteen improve.</p>

      {orders.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No pending feedback"
          description="Once an order is delivered it will appear here for you to rate."
        />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{o.orderNumber}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(o.placedAt)}</div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRating(o.id, n)}
                      className={`p-1 ${(draft[o.id]?.rating || 0) >= n ? 'text-yellow-500' : 'text-slate-300 dark:text-slate-600'}`}
                      aria-label={`Rate ${n}`}
                    >
                      <Star size={20} className={(draft[o.id]?.rating || 0) >= n ? 'fill-yellow-500' : ''} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <div className="flex-1 relative">
                  <MessageSquare size={14} className="absolute left-2 top-3 text-slate-400" />
                  <input
                    value={draft[o.id]?.comment || ''}
                    onChange={(e) => setComment(o.id, e.target.value)}
                    placeholder="Optional comment..."
                    className="w-full pl-8 pr-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                  />
                </div>
                <button
                  onClick={() => submit(o)}
                  disabled={busy}
                  className="px-4 py-2 rounded-md bg-brand-blue text-white text-sm disabled:opacity-60"
                >
                  Submit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}