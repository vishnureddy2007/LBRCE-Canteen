import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

/**
 * Guards a route tree: redirects to /login if no user is loaded.
 */
export default function ProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}