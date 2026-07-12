import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import ThemeToggle from '../../components/common/ThemeToggle';
import Logo from '../../components/common/Logo';

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
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
      {/* Theme Toggle in top-right corner */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Column: Campus Image Hero (hidden on mobile, shown on md and up) */}
      <div 
        className="hidden md:flex md:w-1/2 lg:w-3/5 bg-cover bg-center relative items-center justify-center p-12 text-white"
        style={{ backgroundImage: `url('/login-bg.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-955/95 via-blue-900/80 to-slate-900/40" />
        
        {/* Floating text content */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-semibold uppercase tracking-wider text-orange-300">
            ⚡ Fast, Fresh & Digital
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-sm">
            Skip the Queue, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Savor the Taste!
            </span>
          </h2>
          <p className="text-sm lg:text-base text-slate-200 font-medium leading-relaxed drop-shadow-sm">
            Digitize your food orders at Lakireddy Bali Reddy College of Engineering. Browse daily menus, track order status in real-time, and get your food hot and ready.
          </p>
          <div className="pt-4 flex gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">🎓 College Campus Portal</span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1.5">🍔 Fresh Daily Meals</span>
          </div>
        </div>
      </div>

      {/* Right Column: Login Card Container (Centered, full width on small screens, half width on md/lg) */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile Background (hidden on md and up) */}
        <div 
          className="absolute inset-0 bg-cover bg-center md:hidden" 
          style={{ backgroundImage: `url('/login-bg.png')` }}
        />
        {/* Mobile Background Overlay */}
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm md:hidden" />

        {/* Login Form Card */}
        <div className="w-full max-w-md bg-white/95 dark:bg-slate-800/90 md:bg-white md:dark:bg-slate-800 rounded-3xl shadow-card border border-slate-200/50 dark:border-slate-700/50 p-8 sm:p-10 relative z-10 backdrop-blur-md md:backdrop-blur-none transition-all duration-300">
          <div className="flex flex-col items-center mb-8">
            <Logo className="scale-110 mb-4" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Please enter your credentials to login</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Username / User ID
              </label>
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Roll number / Email"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-11 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Toggle password visibility"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-600 dark:to-indigo-600 hover:from-blue-800 hover:to-indigo-800 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-white font-semibold text-sm transition-all duration-150 active:scale-98 shadow-sm hover:shadow disabled:opacity-60 disabled:pointer-events-none mt-2"
            >
              <LogIn size={18} /> 
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-slate-600 dark:text-slate-300">
            New student? <Link to="/signup" className="font-bold text-brand-blue dark:text-brand-orange-light hover:underline">Create an account</Link>
          </p>

          <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 text-xs text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700/50">
            <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">🎓 Instructions</span>
            Student &rarr; sign up, then sign in with roll number
          </div>
        </div>
      </div>
    </div>
  );
}