import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { tokenStore } from '../lib/api';

/** Gate for authenticated-only routes. Redirects guests to /login, remembering origin. */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!tokenStore.token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
