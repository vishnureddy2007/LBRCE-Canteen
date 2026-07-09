import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Plus, Pencil, Trash2, Users, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function ManageStudents() {
  const [items, setItems]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [q, setQ]           = useState('');
  const [editing, setEdit]  = useState(null);
  const [creating, setCreate] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setLoad(true);
    const params = new URLSearchParams({ size: '100' });
    if (q) params.set('q', q);
    api.get(`/students?${params.toString()}`).then((p) => setItems(p.content || [])).finally(() => setLoad(false));
  };
  useEffect(() => { const t = setTimeout(load, 200); return () => clearTimeout(t); }, [q]);

  const remove = async (id) => { try { await api.delete(`/students/${id}`); toast.success('Removed'); load(); } catch (e) { toast.error(e.message); } };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Students</h1>
        <button onClick={() => setCreate(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-brand-blue text-white text-sm hover:bg-brand-blue-dark">
          <Plus size={16} /> Add student
        </button>
      </div>

      <SearchBar value={q} onChange={setQ} placeholder="Search by name, roll, email..." />

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState icon={Users} title="No students" description="Add the first student to get started." />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200">
              <tr>
                <th className="text-left px-4 py-2">Roll</th>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Dept</th>
                <th className="text-left px-4 py-2">Year</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {items.filter((s) => s !== null && s !== undefined).map((s) => (
                <tr key={s.id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40">
                  <td className="px-4 py-2 font-mono text-slate-800 dark:text-slate-100">{s.rollNumber}</td>
                  <td className="px-4 py-2 text-slate-800 dark:text-slate-100">{s.fullName}</td>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{s.email}</td>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{s.department}</td>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{s.yearOfStudy}</td>
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
        <StudentModal
          student={editing}
          onClose={() => { setEdit(null); setCreate(false); }}
          onSaved={load}
        />
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Delete this student?"
        message="They will no longer be able to log in."
        destructive confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={async () => { if (confirm) await remove(confirm); setConfirm(null); }}
      />
    </div>
  );
}

function StudentModal({ student, onClose, onSaved }) {
  const [form, setForm] = useState({
    rollNumber: student?.rollNumber || '',
    email: student?.email || '',
    password: '',
    fullName: student?.fullName || '',
    phone: student?.phone || '',
    department: student?.department || '',
    yearOfStudy: student?.yearOfStudy || 1,
  });
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (student) await api.put(`/students/${student.id}`, { ...form, yearOfStudy: Number(form.yearOfStudy) });
      else         await api.post('/students', { ...form, yearOfStudy: Number(form.yearOfStudy) });
      toast.success(student ? 'Updated' : 'Created');
      onSaved?.(); onClose();
    } catch (e) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">{student ? 'Edit student' : 'Add student'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Roll"      v={form.rollNumber} onChange={set('rollNumber')} required />
          <Input label="Name"      v={form.fullName}   onChange={set('fullName')} required />
          <Input label="Email"     v={form.email}      onChange={set('email')} type="email" required />
          <Input label="Phone"     v={form.phone}      onChange={set('phone')} />
          <Input label="Dept"      v={form.department} onChange={set('department')} />
          <Input label="Year"      v={form.yearOfStudy} onChange={set('yearOfStudy')} type="number" min="1" max="5" />
          <Input label="Password"  v={form.password}   onChange={set('password')} type="password" placeholder={student ? 'Leave blank to keep' : ''} full />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Cancel</button>
          <button disabled={busy} className="px-4 py-2 rounded-md bg-brand-blue text-white text-sm disabled:opacity-60">{busy ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, v, onChange, type = 'text', required, placeholder, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">{label}</label>
      <input type={type} value={v} onChange={onChange} required={required} placeholder={placeholder} className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" />
    </div>
  );
}