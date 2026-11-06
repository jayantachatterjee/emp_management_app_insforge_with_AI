import React from 'react';
import type { EmployeeStatus, UserRole } from '../../types/employee';

interface BadgeProps {
  type?: 'status' | 'role' | 'default';
  status?: EmployeeStatus;
  role?: UserRole;
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  type = 'default',
  status,
  role,
  children,
  className = '',
}) => {
  if (type === 'status' && status) {
    const statusConfig = {
      active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 border-emerald-200',
      inactive: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 border-rose-200',
      on_leave: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 border-amber-200',
      terminated: 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20 border-gray-200',
    };

    const labels = {
      active: 'Active',
      inactive: 'Inactive',
      on_leave: 'On Leave',
      terminated: 'Terminated',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[status]} ${className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            status === 'active'
              ? 'bg-emerald-500'
              : status === 'inactive'
              ? 'bg-rose-500'
              : status === 'on_leave'
              ? 'bg-amber-500'
              : 'bg-gray-400'
          }`}
        />
        {labels[status]}
      </span>
    );
  }

  if (type === 'role' && role) {
    const isAdm = role === 'admin';
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
          isAdm
            ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-700/20 border border-indigo-200'
            : 'bg-slate-100 text-slate-700 ring-1 ring-slate-600/20 border border-slate-200'
        } ${className}`}
      >
        {isAdm ? 'Admin' : 'Employee'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 ${className}`}
    >
      {children}
    </span>
  );
};

