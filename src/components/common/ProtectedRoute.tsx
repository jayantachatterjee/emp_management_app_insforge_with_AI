import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, employee, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-600">Loading your profile...</p>
      </div>
    );
  }

  if (!user || !employee) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (employee.status === 'inactive') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
