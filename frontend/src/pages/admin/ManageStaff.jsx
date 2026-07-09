import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { SHIFTS } from '../../utils/constants';

export default function ManageStaff() {
  const [items, setItems] = useState([]);
  const [loading, setLoad] = useState(true);
  const [editing, setEdit] = useState(null);
  const [creating, setCreate] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setLoad(true);
    api.get('/staff?size=100').then((p) => setItems(p.content || [])).finally(() => setLoad(false));
  };
  useEffect(load, []);

  const remove = async (id) => { try { await api.delete(`/staff/${id}`); toast.success('Removed'); load(); } catch (e) { toast.error(e.message); } };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Staff</h1>
        <button onClick={() => setCreate(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-brand-blue text-white text-sm hover:bg-brand-blue-dark">
          <Plus size={16} /> Add staff
        </button>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState icon={Users} title="No staff yet" description="Add canteen staff members." />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200">
              <tr>
                <th className="text-left px-4 py-2">Employee ID</th>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Shift</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40">
                  <td className="px-4 py-2 font-mono text-slate-800 dark:text-slate-100">{s.employeeId}</td>
                  <td className="px-4 py-2 text-slate-800 dark:text-slate-100">{s.fullName}</td>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{s.email}</td>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{s.shift}</td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <button onClick={() => setEdit(s)} className="p-1.5 rounded-md text-brand-blue hover:bg-slate-100 dark:hover:bg-slate-700"><Pencil size={14} /></button>
                    <button onClick={() => setConfirm(s.id)} className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(editing || creating) && (
        <StaffModal
          staff={editing}
          onClose={() => { setEdit(null); setCreate(false); }}
          onSaved={load}
        />
      )}
      <ConfirmDialog
        open={!!confirm}
        title="Delete this staff member?"
        message="They will no longer be able to log in."
        destructive confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={async () => { if (confirm) await remove(confirm); setConfirm(null); }}
      />
    </div>
  );
}

function StaffModal({ staff, onClose, onSaved }) {
  const [form, setForm] = useState({
    employeeId: staff?.employeeId || '',
    email: staff?.email || '',
    password: '',
    fullName: staff?.fullName || '',
    phone: staff?.phone || '',
    shift: staff?.shift || 'MORNING',
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (staff) await api.put(`/staff/${staff.id}`, form);
      else       await api.post('/staff', form);
      toast.success(staff ? 'Updated' : 'Created');
      onSaved?.(); onClose();
    } catch (e) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">{staff ? 'Edit staff' : 'Add staff'}</h3>
        <div className="space-y-3">
          <Field label="Employee ID"><input required value={form.employeeId} onChange={set('employeeId')} className="adm-in" /></Field>
          <Field label="Name"><input required value={form.fullName} onChange={set('fullName')} className="adm-in" /></Field>
          <Field label="Email"><input type="email" required value={form.email} onChange={set('email')} className="adm-in" /></Field>
          <Field label="Phone"><input value={form.phone} onChange={set('phone')} className="adm-in" /></Field>
          <Field label="Shift">
            <select value={form.shift} onChange={set('shift')} className="adm-in">
              {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Password"><input type="password" value={form.password} onChange={set('password')} placeholder={staff ? 'Leave blank to keep' : ''} className="adm-in" /></Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Cancel</button>
          <button disabled={busy} className="px-4 py-2 rounded-md bg-brand-blue text-white text-sm disabled:opacity-60">{busy ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
      <style>{`
        .adm-in { width: 100%; padding: 0.45rem 0.7rem; border-radius: 0.375rem; border: 1px solid rgb(203 213 225); background: white; color: rgb(15 23 42); }
        .dark .adm-in { border-color: rgb(71 85 105); background: rgb(51 65 85); color: rgb(241 245 249); }
        .adm-in:focus { outline: none; border-color: #06B6D4; box-shadow: 0 0 0 1px #06B6D4; }
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