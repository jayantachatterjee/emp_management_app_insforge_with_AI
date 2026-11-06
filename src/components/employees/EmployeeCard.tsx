import React from 'react';
import type { Employee } from '../../types/employee';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Mail, Phone, Calendar, Briefcase } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onClick?: () => void;
  isAdminView?: boolean;
  onEdit?: () => void;
  onToggleStatus?: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onClick,
  isAdminView = false,
  onEdit,
  onToggleStatus,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between relative group ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <Avatar
            src={employee.avatar_url}
            name={employee.full_name}
            size="lg"
          />
          <div className="flex flex-col items-end space-y-1">
            <Badge type="status" status={employee.status} />
            <Badge type="role" role={employee.role} />
          </div>
        </div>

        {/* Name and Title */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {employee.full_name}
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {employee.job_title || 'No Job Title Defined'}
          </p>
        </div>

        {/* Department pill */}
        <div className="mb-4">
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            {employee.department?.name || 'General Department'}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center truncate">
            <Mail className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center truncate">
              <Phone className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
              <span>{employee.phone}</span>
            </div>
          )}
          <div className="flex items-center text-slate-400 pt-1">
            <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
            <span>Joined {new Date(employee.date_of_joining).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Admin Quick Actions */}
      {isAdminView && (
        <div
          className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2"
          onClick={(e) => e.stopPropagation()}
        >
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Edit
            </button>
          )}
          {onToggleStatus && (
            <button
              onClick={onToggleStatus}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                employee.status === 'active'
                  ? 'text-rose-600 hover:bg-rose-50'
                  : 'text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              {employee.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
