import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import ThemeToggle from '../../components/common/ThemeToggle';
import Logo from '../../components/common/Logo';

export default function Signup() {
  const [form, setForm] = useState({
    rollNumber: '', email: '', password: '', confirmPassword: '',
    fullName: '', phone: '', department: '', yearOfStudy: 1,
  });
  const [show, setShow] = useState(false);
  const signup = useAuthStore((s) => s.signup);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      const me = await signup({
        rollNumber:  form.rollNumber.trim(),
        email:       form.email.trim(),
        password:    form.password,
        fullName:    form.fullName.trim(),
        phone:       form.phone.trim(),
        department:  form.department.trim(),
        yearOfStudy: Number(form.yearOfStudy) || 1,
      });
      toast.success('Account created! Welcome.');
      navigate('/student', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Column: Campus Image Hero */}
      <div 
        className="hidden md:flex md:w-5/12 lg:w-1/2 bg-cover bg-center relative items-center justify-center p-12 text-white"
        style={{ backgroundImage: `url('/login-bg.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-955/95 via-blue-900/80 to-slate-900/40" />
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-semibold uppercase tracking-wider text-orange-300">
            🎓 Campus Registration
          </div>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight drop-shadow-sm">
            Create Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Student Account
            </span>
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed drop-shadow-sm">
            Sign up to get access to online food ordering, instant cart checkouts, and custom announcements. Skip the lines and get your food directly.
          </p>
        </div>
      </div>

      {/* Right Column: Signup Card */}
      <div className="w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto relative">
        {/* Mobile Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center md:hidden" 
          style={{ backgroundImage: `url('/login-bg.png')` }}
        />
        {/* Mobile Background Overlay */}
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm md:hidden" />

        {/* Signup Form Card */}
        <div className="w-full max-w-xl bg-white/95 dark:bg-slate-800/90 md:bg-white md:dark:bg-slate-800 rounded-3xl shadow-card border border-slate-200/50 dark:border-slate-700/50 p-8 sm:p-10 relative z-10 backdrop-blur-md md:backdrop-blur-none transition-all duration-300 my-8">
          <div className="flex flex-col items-center mb-6">
            <Logo className="scale-110 mb-2" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Create your Student Account</p>
          </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Roll Number" required>
            <input value={form.rollNumber} onChange={set('rollNumber')} required className="input" placeholder="21A91A0501" />
          </Field>
          <Field label="Full Name" required>
            <input value={form.fullName} onChange={set('fullName')} required className="input" placeholder="Your full name" />
          </Field>
          <Field label="Email" required>
            <input type="email" value={form.email} onChange={set('email')} required className="input" placeholder="you@lbrce.edu" />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={set('phone')} className="input" placeholder="9876543210" />
          </Field>
          <Field label="Department" required>
            <input value={form.department} onChange={set('department')} required className="input" placeholder="CSE / ECE / MECH" />
          </Field>
          <Field label="Year of Study" required>
            <select value={form.yearOfStudy} onChange={set('yearOfStudy')} required className="input">
              {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </Field>
          <Field label="Password" required>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={form.password} onChange={set('password')} required className="input pr-9" minLength={6} />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>
          <Field label="Confirm Password" required>
            <input type={show ? 'text' : 'password'} value={form.confirmPassword} onChange={set('confirmPassword')} required className="input" minLength={6} />
          </Field>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md brand-gradient text-white font-semibold disabled:opacity-60"
            >
              <UserPlus size={18} /> {loading ? 'Creating...' : 'Create account'}
            </button>
          </div>
        </form>

          <p className="mt-6 text-sm text-center text-slate-600 dark:text-slate-300">
            Already have an account? <Link to="/login" className="font-bold text-brand-blue dark:text-brand-orange-light hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          border: 1px solid rgb(203 213 225);
          background: rgb(255 255 255);
          color: rgb(15 23 42);
        }
        .dark .input {
          border-color: rgb(71 85 105);
          background: rgb(51 65 85);
          color: rgb(241 245 249);
        }
        .input:focus { outline: none; border-color: #06B6D4; box-shadow: 0 0 0 1px #06B6D4; }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}