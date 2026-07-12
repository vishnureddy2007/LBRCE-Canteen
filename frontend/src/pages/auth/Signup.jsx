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
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50 dark:bg-slate-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-card border border-slate-200 dark:border-slate-700 p-8">
        <div className="flex flex-col items-center mb-6">
          <Logo className="scale-110 mb-2" showText={true} />
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
          Already have an account? <Link to="/login" className="font-medium text-brand-blue dark:text-brand-orange-light hover:underline">Sign in</Link>
        </p>
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