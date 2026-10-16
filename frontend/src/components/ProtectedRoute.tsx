/**
 * ProtectedRoute — Auth Guard
 * Member 1 (Frontend & UI/UX) — Sprint 1
 *
 * Redirects unauthenticated users to /login.
 * Shows a spinner while the session is being hydrated from localStorage.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
