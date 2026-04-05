import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — Guards private and admin-only pages.
 *
 * Usage in App.jsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/profile" element={<Profile />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute adminOnly />}>
 *     <Route path="/admin/*" element={<AdminDashboard />} />
 *   </Route>
 *
 * State machine:
 *   loading=true  → Show spinner (checkAuth still running)
 *   loading=false, no user → Redirect to /login
 *   loading=false, user, adminOnly, not admin → Redirect to /
 *   loading=false, user, authorized → Render <Outlet />
 */
const ProtectedRoute = ({ adminOnly = false }) => {
  const { userInfo, loading } = useAuth();

  // Phase 1: Wait for the initial checkAuth() to complete.
  // Without this guard, loading=true would not stop a premature redirect.
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-text-body/60 text-sm font-medium tracking-wide">
          Verifying access...
        </p>
      </div>
    );
  }

  // Phase 2: Not logged in → redirect to login page
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Phase 3: Logged in but not admin → redirect to home
  if (adminOnly && userInfo.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Phase 4: Authorized → render child routes
  return <Outlet />;
};

export default ProtectedRoute;
