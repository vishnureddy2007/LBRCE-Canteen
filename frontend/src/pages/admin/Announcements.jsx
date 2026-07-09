import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Plus, Pencil, Trash2, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoad] = useState(true);
  const [editing, setEdit] = useState(null);
  const [creating, setCreate] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setLoad(true);
    api.get('/announcements').then((rows) => setItems(Array.isArray(rows) ? rows : [])).finally(() => setLoad(false));
  };
  useEffect(load, []);

  const remove = async (id) => { try { await api.delete(`/announcements/${id}`); toast.success('Deleted'); load(); } catch (e) { toast.error(e.message); } };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Announcements</h1>
        <button onClick={() => setCreate(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-brand-blue text-white text-sm">
          <Plus size={16} /> New
        </button>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <div className="text-sm text-slate-500 dark:text-slate-400">No announcements yet.</div>
      ) : (
        <div className="space-y-2">
          {items.map((a) => (
            <div key={a.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">{a.title}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">{a.body}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">By {a.createdByName || 'Admin'}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEdit(a)} className="p-1.5 rounded-md text-brand-blue hover:bg-slate-100 dark:hover:bg-slate-700"><Pencil size={14} /></button>
                <button onClick={() => setConfirm(a.id)} className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <AnnouncementModal
          item={editing}
          onClose={() => { setEdit(null); setCreate(false); }}
          onSaved={load}
        />
      )}
      <ConfirmDialog
        open={!!confirm}
        title="Delete announcement?"
        destructive confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={async () => { if (confirm) await remove(confirm); setConfirm(null); }}
      />
    </div>
  );
}

function AnnouncementModal({ item, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: item?.title || '',
    body: item?.body || '',
    active: item?.active ?? true,
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (item) await api.put(`/announcements/${item.id}`, form);
      else      await api.post('/announcements', form);
      toast.success('Saved');
      onSaved?.(); onClose();
    } catch (e) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">{item ? 'Edit' : 'New'} announcement</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Title</label>
            <input required value={form.title} onChange={set('title')} className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Body</label>
            <textarea rows={3} value={form.body} onChange={set('body')} className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input type="checkbox" checked={form.active} onChange={set('active')} /> Active
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Cancel</button>
          <button disabled={busy} className="px-4 py-2 rounded-md bg-brand-blue text-white text-sm disabled:opacity-60">{busy ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}