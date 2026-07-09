import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import ThemeToggle from '../../components/common/ThemeToggle';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow]       = useState(false);
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const me = await login(username.trim(), password);
      toast.success(`Welcome back, ${me.fullName || me.username}!`);
      const next = me.role === 'ADMIN' ? '/admin' : me.role === 'STAFF' ? '/staff' : '/student';
      navigate(next, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-card border border-slate-200 dark:border-slate-700 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-md brand-gradient flex items-center justify-center text-white font-bold">L</div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">LBRCE Canteen</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to continue</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Username</label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Roll number / Employee ID / Email"
              className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Toggle visibility"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md brand-gradient text-white font-semibold disabled:opacity-60"
          >
            <LogIn size={18} /> {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-slate-600 dark:text-slate-300">
          New student? <Link to="/signup" className="font-medium text-brand-blue dark:text-brand-orange-light hover:underline">Create an account</Link>
        </p>

        <div className="mt-6 p-3 rounded-md bg-slate-100 dark:bg-slate-700/50 text-xs text-slate-600 dark:text-slate-300">
          <div className="font-semibold mb-1">Instructions</div>
          <div>Student &rarr; sign up, then sign in with roll number</div>
        </div>
      </div>
    </div>
  );
}