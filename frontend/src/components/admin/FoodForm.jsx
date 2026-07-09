import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { X, Upload, Loader2 } from 'lucide-react';
import { getImageUrl } from '../../utils/format';

/**
 * Modal form for creating or editing a food item. Handles image upload by
 * posting to {@code /api/files} first and then including the returned URL in
 * the food payload.
 */
export default function FoodForm({ food, categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: food?.name || '',
    description: food?.description || '',
    price: food?.price ?? 0,
    categoryId: food?.category?.id || categories[0]?.id,
    available: food?.available ?? true,
    imageUrl: (food?.images && food.images[0]) || '',
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/files', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      // ResponseInterceptor returns the data field — which IS FileUploadResponse
      setForm((f) => ({ ...f, imageUrl: data.url }));
      toast.success('Image uploaded');
    } catch (err) { toast.error(err.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...form, price: Number(form.price), categoryId: Number(form.categoryId) };
      if (food) {
        await api.put(`/foods/${food.id}`, payload);
        toast.success('Food updated');
      } else {
        await api.post('/foods', payload);
        toast.success('Food created');
      }
      onSaved?.();
      onClose();
    } catch (err) { toast.error(err.message || 'Save failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog">
      <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{food ? 'Edit food' : 'Add food'}</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <Field label="Name">
            <input required value={form.name} onChange={set('name')} className="af-input" />
          </Field>
          <Field label="Description">
            <textarea rows={2} value={form.description} onChange={set('description')} className="af-input" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (₹)">
              <input type="number" step="0.5" min="0" required value={form.price} onChange={set('price')} className="af-input" />
            </Field>
            <Field label="Category">
              <select value={form.categoryId} onChange={set('categoryId')} required className="af-input">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input type="checkbox" checked={form.available} onChange={set('available')} />
            Available for ordering
          </label>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Image</label>
            {form.imageUrl ? (
              <div className="flex items-center gap-3">
                <img src={getImageUrl(form.imageUrl)} alt="" className="w-20 h-20 object-cover rounded-md" />
                <button type="button" onClick={() => setForm((f) => ({ ...f, imageUrl: '' }))} className="text-xs text-red-600">Remove</button>
              </div>
            ) : (
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-slate-300 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-300">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                <span>{uploading ? 'Uploading...' : 'Upload image'}</span>
                <input type="file" accept="image/*" className="sr-only" onChange={onFile} />
              </label>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Cancel</button>
          <button disabled={busy} className="px-4 py-2 rounded-md bg-brand-blue text-white text-sm disabled:opacity-60">
            {busy ? 'Saving...' : (food ? 'Save changes' : 'Create')}
          </button>
        </div>
      </form>

      <style>{`
        .af-input {
          width: 100%;
          padding: 0.45rem 0.7rem;
          border-radius: 0.375rem;
          border: 1px solid rgb(203 213 225);
          background: rgb(255 255 255);
          color: rgb(15 23 42);
        }
        .dark .af-input {
          border-color: rgb(71 85 105);
          background: rgb(51 65 85);
          color: rgb(241 245 249);
        }
        .af-input:focus { outline: none; border-color: #06B6D4; box-shadow: 0 0 0 1px #06B6D4; }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">{label}</label>
      {children}
    </div>
  );
}