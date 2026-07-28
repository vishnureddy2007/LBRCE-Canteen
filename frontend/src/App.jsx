import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Logo from './components/common/Logo';
import Loader from './components/common/Loader';

import Navbar      from './components/layout/Navbar';
import MobileNav   from './components/layout/MobileNav';
import Footer      from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleRoute   from './components/layout/RoleRoute';

// Public pages
import Login       from './pages/auth/Login';
import Signup      from './pages/auth/Signup';

// Lazy-loaded Student pages
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const Menu             = lazy(() => import('./pages/student/Menu'));
const Checkout         = lazy(() => import('./pages/student/Checkout'));
const MyOrders         = lazy(() => import('./pages/student/MyOrders'));
const OrderTrack       = lazy(() => import('./pages/student/OrderTrack'));
const Profile          = lazy(() => import('./pages/student/Profile'));
const Feedback         = lazy(() => import('./pages/student/Feedback'));

// Lazy-loaded Staff pages
const StaffDashboard   = lazy(() => import('./pages/staff/Dashboard'));
const OrderQueue       = lazy(() => import('./pages/staff/OrderQueue'));
const DailyOrders      = lazy(() => import('./pages/staff/DailyOrders'));
const Availability     = lazy(() => import('./pages/staff/Availability'));

// Lazy-loaded Admin pages
const AdminDashboard   = lazy(() => import('./pages/admin/Dashboard'));
const ManageStudents   = lazy(() => import('./pages/admin/ManageStudents'));
const ManageStaff      = lazy(() => import('./pages/admin/ManageStaff'));
const ManageFood       = lazy(() => import('./pages/admin/ManageFood'));
const AdminOrders      = lazy(() => import('./pages/admin/Orders'));
const Reports          = lazy(() => import('./pages/admin/Reports'));
const Announcements    = lazy(() => import('./pages/admin/Announcements'));
const Offers           = lazy(() => import('./pages/admin/Offers'));

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const user    = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const location = useLocation();

  // Fetch current user on first load
  useEffect(() => { fetchMe(); }, [fetchMe]);

  useEffect(() => {
    const handler = () => fetchMe();
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, [fetchMe]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-5 p-4 text-center">
        <div className="animate-pulse">
          <Logo className="scale-125" showText={true} />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-brand-orange rounded-full animate-ping" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Initializing LBRCE Canteen portal...
          </p>
        </div>
      </div>
    );
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 selection:bg-brand-orange/30">
      {!isAuthPage && <Navbar />}

      <main className="flex-1">
        <Suspense fallback={<Loader label="Loading section..." />}>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login"  element={user ? <Navigate to={defaultRouteFor(user.role)} replace /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to={defaultRouteFor(user.role)} replace /> : <Signup />} />

            {/* Student Routes */}
            <Route element={<ProtectedRoute><RoleRoute roles={['STUDENT']} /></ProtectedRoute>}>
              <Route path="/student"           element={<StudentDashboard />} />
              <Route path="/student/menu"      element={<Menu />} />
              <Route path="/student/cart"      element={<Checkout />} />
              <Route path="/student/orders"    element={<MyOrders />} />
              <Route path="/student/orders/:id" element={<OrderTrack />} />
              <Route path="/student/profile"   element={<Profile />} />
              <Route path="/student/feedback"  element={<Feedback />} />
            </Route>

            {/* Staff Routes */}
            <Route element={<ProtectedRoute><RoleRoute roles={['STAFF','ADMIN']} /></ProtectedRoute>}>
              <Route path="/staff"              element={<StaffDashboard />} />
              <Route path="/staff/queue"        element={<OrderQueue />} />
              <Route path="/staff/orders"       element={<DailyOrders />} />
              <Route path="/staff/availability" element={<Availability />} />
            </Route>

            {/* Admin Routes */}
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

            {/* Fallback Defaults */}
            <Route path="/" element={<Navigate to={user ? defaultRouteFor(user.role) : '/login'} replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <MobileNav />}
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