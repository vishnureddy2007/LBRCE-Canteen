import { Outlet, Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function ProtectedRoute() {
  const { user, loading, initialized } = useAuthStore();

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}