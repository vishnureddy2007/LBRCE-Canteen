import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, ShoppingCart, LogOut, User, Menu as MenuIcon } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import useCartStore from '../../store/cartStore';

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
    <nav className="sticky top-0 z-40 bg-white dark:bg-slate-800 shadow-card border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setOpen((o) => !o)}
              aria-label="Open menu"
            >
              <MenuIcon size={20} />
            </button>
            <Link to={user ? defaultFor(user.role) : '/login'} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md brand-gradient flex items-center justify-center text-white font-bold">L</div>
              <span className="font-semibold text-slate-900 dark:text-white">LBRCE Canteen</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/student' || l.to === '/staff' || l.to === '/admin'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-blue text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {user?.role === 'STUDENT' && (
              <Link
                to="/student/cart"
                className="relative p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={toggle}
              className="p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user && (
              <div className="flex items-center gap-2 ml-1">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-700">
                  <User size={16} className="text-slate-600 dark:text-slate-300" />
                  <span className="text-sm text-slate-800 dark:text-slate-100 font-medium">
                    {user.fullName || user.username}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-brand-blue text-white">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-brand-blue text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
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