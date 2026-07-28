import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, ShoppingCart, LogOut, User, Menu as MenuIcon, X } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import useCartStore from '../../store/cartStore';
import Logo from '../common/Logo';

const STUDENT_LINKS = [
  { to: '/student',           label: 'Dashboard' },
  { to: '/student/menu',      label: 'Menu' },
  { to: '/student/orders',    label: 'My Orders' },
  { to: '/student/profile',   label: 'Profile' },
  { to: '/student/feedback',  label: 'Feedback' },
];

const STAFF_LINKS = [
  { to: '/staff',              label: 'Dashboard' },
  { to: '/staff/queue',        label: 'Order Queue' },
  { to: '/staff/orders',       label: 'Daily Orders' },
  { to: '/staff/availability', label: 'Availability' },
];

const ADMIN_LINKS = [
  { to: '/admin',               label: 'Dashboard' },
  { to: '/admin/foods',         label: 'Manage Food' },
  { to: '/admin/students',      label: 'Students' },
  { to: '/admin/staff',         label: 'Staff' },
  { to: '/admin/orders',        label: 'Orders' },
  { to: '/admin/reports',       label: 'Reports' },
  { to: '/admin/announcements', label: 'Announcements' },
  { to: '/admin/offers',        label: 'Offers' },
];

export default function Navbar() {
  const user    = useAuthStore((s) => s.user);
  const logout  = useAuthStore((s) => s.logout);
  const theme   = useThemeStore((s) => s.theme);
  const toggle  = useThemeStore((s) => s.toggle);
  const itemCount = useCartStore((s) => s.items.reduce((sum, it) => sum + it.quantity, 0));
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = user?.role === 'STUDENT' ? STUDENT_LINKS
              : user?.role === 'STAFF'   ? STAFF_LINKS
              : user?.role === 'ADMIN'   ? ADMIN_LINKS
              : [];

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle navigation menu"
            >
              {open ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
            <Link to={user ? defaultFor(user.role) : '/login'} className="focus:outline-none focus:ring-2 focus:ring-brand-orange rounded-xl p-1">
              <Logo />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/student' || l.to === '/staff' || l.to === '/admin'}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user?.role === 'STUDENT' && (
              <Link
                to="/student/cart"
                className="relative p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                aria-label={`Shopping cart with ${itemCount} items`}
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={toggle}
              className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>

            {user && (
              <div className="flex items-center gap-2 ml-1">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                  <User size={15} className="text-brand-orange" />
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-bold max-w-[120px] truncate">
                    {user.fullName || user.username}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-blue text-white uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all active:scale-95"
                  aria-label="Log out of account"
                  title="Logout"
                >
                  <LogOut size={19} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {open && (
          <div className="md:hidden py-3 px-1 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1 animate-fadeIn">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

function defaultFor(role) {
  return role === 'ADMIN' ? '/admin' : role === 'STAFF' ? '/staff' : '/student';
}