import React from 'react';
import type { Employee } from '../../types/employee';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Mail, Phone } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
  isAdminView?: boolean;
  onEdit?: (emp: Employee) => void;
  onToggleStatus?: (emp: Employee) => void;
  onClickRow?: (emp: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isAdminView = false,
  onEdit,
  onToggleStatus,
  onClickRow,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-4">Employee</th>
              <th scope="col" className="px-6 py-4">Department & Role</th>
              <th scope="col" className="px-6 py-4">Contact</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4">Joined</th>
              {isAdminView && <th scope="col" className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={isAdminView ? 6 : 5} className="px-6 py-12 text-center text-slate-400">
                  No employees found matching the criteria.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => onClickRow && onClickRow(emp)}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    onClickRow ? 'cursor-pointer' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <Avatar src={emp.avatar_url} name={emp.full_name} size="md" />
                      <div>
                        <div className="font-semibold text-slate-900">{emp.full_name}</div>
                        <div className="text-xs text-slate-500">{emp.job_title || 'No Job Title'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">
                      {emp.department?.name || 'General'}
                    </div>
                    <div className="mt-0.5">
                      <Badge type="role" role={emp.role} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-xs text-slate-600 mb-1">
                      <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      {emp.email}
                    </div>
                    {emp.phone && (
                      <div className="flex items-center text-xs text-slate-500">
                        <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        {emp.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge type="status" status={emp.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                    {new Date(emp.date_of_joining).toLocaleDateString()}
                  </td>
                  {isAdminView && (
                    <td
                      className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {onEdit && (
                        <button
                          onClick={() => onEdit(emp)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      {onToggleStatus && (
                        <button
                          onClick={() => onToggleStatus(emp)}
                          className={`font-semibold px-2 py-1 rounded-md transition-colors ${
                            emp.status === 'active'
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {emp.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
