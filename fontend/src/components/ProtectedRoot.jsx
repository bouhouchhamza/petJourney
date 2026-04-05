import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoot = ({ adminOnly = false }) => {
  const { userInfo, loading, checkAuth } = useAuth();

  // Only HERE do we actually check if the user is authenticated
  useEffect(() => {
    if (!userInfo) {
      checkAuth();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-text-body/60 text-sm font-medium">Verifying artisan access...</p>
      </div>
    );
  }

  if (!loading && !userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && userInfo?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoot;
