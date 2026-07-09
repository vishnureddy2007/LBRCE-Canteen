import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

/**
 * Restricts a sub-route to specific roles. Must be nested under {@link ProtectedRoute}.
 *
 * @param {{roles: string[]}} props
 */
export default function RoleRoute({ roles }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    const fallback = user.role === 'ADMIN' ? '/admin'
                   : user.role === 'STAFF' ? '/staff'
                   : '/student';
    return <Navigate to={fallback} replace />;
  }
  return <Outlet />;
}