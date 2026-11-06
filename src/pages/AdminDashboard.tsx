import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService } from '../services/employee.service';
import { departmentService } from '../services/department.service';
import { auditService } from '../services/audit.service';
import type { Employee, Department, AuditLog } from '../types/employee';
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import {
  ShieldCheck,
  UserPlus,
  Users,
  Building,
  Activity,
  ArrowRight,
  UserCheck,
  UserX,
  ShieldAlert,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [empRes, deptRes, logsRes] = await Promise.all([
        employeeService.getEmployees({ limit: 100 }),
        departmentService.getDepartments(),
        auditService.getRecentLogs(6),
      ]);
      setEmployees(empRes.employees);
      setDepartments(deptRes);
      setAuditLogs(logsRes);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalEmployees = employees.length;
  const activeCount = employees.filter((e) => e.status === 'active').length;
  const inactiveCount = employees.filter((e) => e.status === 'inactive').length;
  const adminCount = employees.filter((e) => e.role === 'admin').length;

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-12">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500">Loading workforce insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Workforce analytics, role-based controls, and security audit metrics
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Employee
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Headcount
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900">{totalEmployees}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Staff
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900">{activeCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Deactivated
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900">{inactiveCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Admin Accounts
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900">{adminCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Departments Breakdown & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <Building className="w-4 h-4 mr-2 text-indigo-600" />
                Department Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of staff headcount allocation by department
              </p>
            </div>
            <Link
              to="/admin/employees"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center"
            >
              Manage Employees
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {departments.map((dept) => {
              const deptCount = employees.filter((e) => e.department_id === dept.id).length;
              const pct = totalEmployees > 0 ? Math.round((deptCount / totalEmployees) * 100) : 0;
              return (
                <div
                  key={dept.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">{dept.name}</span>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {deptCount} staff
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-indigo-600" />
              Security Trail
            </h3>
            <Link
              to="/admin/audit-logs"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              All Logs
            </Link>
          </div>

          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No recent logs recorded.</p>
          ) : (
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="text-xs pb-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1 font-mono text-[11px] truncate">
                    {JSON.stringify(log.details)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Employee Modal */}
      <EmployeeFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        departments={departments}
        onSuccess={loadData}
      />
    </div>
  );
};
