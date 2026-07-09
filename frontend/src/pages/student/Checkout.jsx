import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCartStore from '../../store/cartStore';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import CartItem from '../../components/cart/CartItem';
import BillSummary from '../../components/cart/BillSummary';
import EmptyState from '../../components/common/EmptyState';
import { ShoppingCart } from 'lucide-react';
import { PAYMENT_METHODS } from '../../utils/constants';

export default function Checkout() {
  const items  = useCartStore((s) => s.items);
  const total  = useCartStore((s) => s.items.reduce((s, it) => s + it.price * it.quantity, 0));
  const clear  = useCartStore((s) => s.clear);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [notes, setNotes] = useState('');
  const [busy, setBusy]   = useState(false);

  const placeOrder = async () => {
    if (items.length === 0) return;
    setBusy(true);
    try {
      const order = await api.post('/orders', {
        paymentMethod,
        notes: notes.trim() || null,
        items: items.map((it) => ({ foodId: it.foodId, quantity: it.quantity })),
      });
      toast.success(`Order ${order.orderNumber} placed!`);
      clear();
      navigate(`/student/orders/${order.id}`);
    } catch (e) {
      toast.error(e.message || 'Could not place order');
    } finally { setBusy(false); }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Browse the menu and add some delicious items."
          action={<button onClick={() => navigate('/student/menu')} className="px-4 py-2 rounded-md bg-brand-orange text-white">Browse Menu</button>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cart & Checkout</h1>
        <div className="space-y-2">
          {items.map((it) => <CartItem key={it.foodId} item={it} />)}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Payment</h3>
          <div className="flex gap-2 flex-wrap">
            {PAYMENT_METHODS.map((m) => (
              <label
                key={m.value}
                className={`cursor-pointer px-3 py-2 rounded-md border text-sm ${
                  paymentMethod === m.value
                    ? 'border-brand-orange bg-brand-orange/10 text-brand-orange-dark dark:text-brand-orange-light'
                    : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                }`}
              >
                <input
                  type="radio" name="payment" value={m.value}
                  checked={paymentMethod === m.value}
                  onChange={() => setPaymentMethod(m.value)}
                  className="sr-only"
                />
                {m.label}
              </label>
            ))}
          </div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mt-4 mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            placeholder="Any special instructions for the canteen?"
          />
        </div>
      </div>
      <div>
        <BillSummary items={items} total={total} onAction={placeOrder} busy={busy} buttonLabel="Place Order" />
      </div>
    </div>
  );
}