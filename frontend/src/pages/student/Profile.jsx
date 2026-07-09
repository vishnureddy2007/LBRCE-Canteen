import { useState } from 'react';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';
import useAuthStore from '../../store/authStore';

/**
 * Student profile is currently read-only (we don't expose update endpoints
 * to students — admins manage them via the admin UI). The page shows the
 * current user record and lets them sign out from anywhere.
 */
export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [busy, setBusy] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-card">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-brand-blue/10 text-brand-blue dark:bg-brand-orange/20 dark:text-brand-orange-light flex items-center justify-center">
            <User size={28} />
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900 dark:text-white">{user?.fullName || '—'}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{user?.role}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Row k="Username" v={user?.username} />
          <Row k="Email"    v={user?.email} />
        </div>
        <button
          onClick={async () => { setBusy(true); await logout(); toast.success('Logged out'); }}
          disabled={busy}
          className="mt-6 px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-60"
        >
          {busy ? 'Logging out...' : 'Sign out'}
        </button>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
      <span className="text-slate-500 dark:text-slate-400">{k}</span>
      <span className="font-medium text-slate-900 dark:text-slate-100">{v || '—'}</span>
    </div>
  );
}