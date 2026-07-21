import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Logo from './components/common/Logo';

import Navbar      from './components/layout/Navbar';
import Footer      from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleRoute   from './components/layout/RoleRoute';

import Login       from './pages/auth/Login';
import Signup      from './pages/auth/Signup';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import Menu             from './pages/student/Menu';
import Checkout         from './pages/student/Checkout';
import MyOrders         from './pages/student/MyOrders';
import OrderTrack       from './pages/student/OrderTrack';
import Profile          from './pages/student/Profile';
import Feedback         from './pages/student/Feedback';

// Staff pages
import StaffDashboard   from './pages/staff/Dashboard';
import OrderQueue       from './pages/staff/OrderQueue';
import DailyOrders      from './pages/staff/DailyOrders';
import Availability     from './pages/staff/Availability';

// Admin pages
import AdminDashboard   from './pages/admin/Dashboard';
import ManageStudents   from './pages/admin/ManageStudents';
import ManageStaff      from './pages/admin/ManageStaff';
import ManageFood       from './pages/admin/ManageFood';
import AdminOrders      from './pages/admin/Orders';
import Reports          from './pages/admin/Reports';
import Announcements    from './pages/admin/Announcements';
import Offers           from './pages/admin/Offers';

/**
 * Top-level routing tree. Two layers of guards:
 *
 * <ul>
 *   <li>{@link ProtectedRoute} — requires a logged-in user</li>
 *   <li>{@link RoleRoute} — additionally restricts by role</li>
 * </ul>
 *
 * The navbar listens to {@code authStore.user.role} and re-renders on changes.
 */
export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const user    = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const location = useLocation();

  // Fetch current user on first load (uses session cookie).
  useEffect(() => { fetchMe(); }, [fetchMe]);

  // If a 401 fires from anywhere, force a re-check of /me which will
  // either confirm the session or clear the user.
  useEffect(() => {
    const handler = () => fetchMe();
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, [fetchMe]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-4">
        <div className="animate-pulse">
          <Logo className="scale-125" showText={true} />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
        <p className="text-xs text-slate-500 dark:text-slate-400 animate-pulse mt-2">
          Connecting to canteen services. Waking up the server, please wait...
        </p>
      </div>
    );
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/login"  element={user ? <Navigate to={defaultRouteFor(user.role)} replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to={defaultRouteFor(user.role)} replace /> : <Signup />} />

          {/* Student */}
          <Route element={<ProtectedRoute><RoleRoute roles={['STUDENT']} /></ProtectedRoute>}>
            <Route path="/student"           element={<StudentDashboard />} />
            <Route path="/student/menu"      element={<Menu />} />
            <Route path="/student/cart"      element={<Checkout />} />
            <Route path="/student/orders"    element={<MyOrders />} />
            <Route path="/student/orders/:id" element={<OrderTrack />} />
            <Route path="/student/profile"   element={<Profile />} />
            <Route path="/student/feedback"  element={<Feedback />} />
          </Route>

          {/* Staff */}
          <Route element={<ProtectedRoute><RoleRoute roles={['STAFF','ADMIN']} /></ProtectedRoute>}>
            <Route path="/staff"              element={<StaffDashboard />} />
            <Route path="/staff/queue"        element={<OrderQueue />} />
            <Route path="/staff/orders"       element={<DailyOrders />} />
            <Route path="/staff/availability" element={<Availability />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute><RoleRoute roles={['ADMIN']} /></ProtectedRoute>}>
            <Route path="/admin"               element={<AdminDashboard />} />
            <Route path="/admin/foods"         element={<ManageFood />} />
            <Route path="/admin/students"      element={<ManageStudents />} />
            <Route path="/admin/staff"         element={<ManageStaff />} />
            <Route path="/admin/orders"        element={<AdminOrders />} />
            <Route path="/admin/reports"       element={<Reports />} />
            <Route path="/admin/announcements" element={<Announcements />} />
            <Route path="/admin/offers"        element={<Offers />} />
          </Route>

          {/* Default */}
          <Route path="/" element={<Navigate to={user ? defaultRouteFor(user.role) : '/login'} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function defaultRouteFor(role) {
  switch (role) {
    case 'STUDENT': return '/student';
    case 'STAFF':   return '/staff';
    case 'ADMIN':   return '/admin';
    default:        return '/login';
  }
}