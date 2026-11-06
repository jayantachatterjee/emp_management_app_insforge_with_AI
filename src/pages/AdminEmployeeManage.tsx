import React, { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employee.service';
import { departmentService } from '../services/department.service';
import type { Employee, Department } from '../types/employee';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import { SearchFilterBar } from '../components/employees/SearchFilterBar';
import { Modal } from '../components/common/Modal';
import {
  UserCog,
  UserPlus,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const AdminEmployeeManage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('all');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  // Status Confirmation Modal
  const [statusModalEmployee, setStatusModalEmployee] = useState<Employee | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Alerts
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    departmentService.getDepartments().then(setDepartments);
  }, []);

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await employeeService.getEmployees({
        search,
        departmentId,
        role,
        status,
        page,
        limit,
      });
      setEmployees(res.employees);
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, departmentId, role, status, page, limit]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleOpenCreate = () => {
    setEmployeeToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEmployeeToEdit(emp);
    setIsFormModalOpen(true);
  };

  const handleToggleStatusClick = (emp: Employee) => {
    setStatusModalEmployee(emp);
  };

  const confirmToggleStatus = async () => {
    if (!statusModalEmployee) return;
    setIsUpdatingStatus(true);
    setActionSuccess(null);
    setActionError(null);

    const newStatus = statusModalEmployee.status === 'active' ? 'inactive' : 'active';

    try {
      const res = await employeeService.adminSetEmployeeStatus(statusModalEmployee.id, newStatus);
      if (!res.success) {
        throw new Error(res.error || 'Failed to update employee status');
      }

      setActionSuccess(
        `Employee "${statusModalEmployee.full_name}" has been ${
          newStatus === 'active' ? 'activated' : 'deactivated'
        }.`
      );
      setStatusModalEmployee(null);
      await fetchEmployees();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      setActionError(err.message || 'Status change failed.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <UserCog className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900">Manage Workforce</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Provision, modify, or deactivate employee and administrator accounts
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Employee
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center shadow-xs">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center shadow-xs">
          <AlertCircle className="w-4 h-4 mr-2 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter and Search */}
      <SearchFilterBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        departmentId={departmentId}
        onDepartmentChange={(val) => {
          setDepartmentId(val);
          setPage(1);
        }}
        role={role}
        onRoleChange={(val) => {
          setRole(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        departments={departments}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={() => {
          setSearch('');
          setDepartmentId('all');
          setRole('all');
          setStatus('all');
          setPage(1);
        }}
      />

      {/* Table */}
      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200/80 p-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
          <p className="text-xs font-medium text-slate-500">Loading workforce records...</p>
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          isAdminView={true}
          onEdit={handleOpenEdit}
          onToggleStatus={handleToggleStatusClick}
        />
      )}

      {/* Pagination Bar */}
      {!isLoading && totalCount > limit && (
        <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{(page - 1) * limit + 1}</span> to{' '}
            <span className="font-semibold text-slate-700">
              {Math.min(page * limit, totalCount)}
            </span>{' '}
            of <span className="font-semibold text-slate-700">{totalCount}</span> results
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-700 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Form Modal (Create or Edit) */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        employeeToEdit={employeeToEdit}
        departments={departments}
        onSuccess={fetchEmployees}
      />

      {/* Status Confirmation Modal */}
      {statusModalEmployee && (
        <Modal
          isOpen={Boolean(statusModalEmployee)}
          onClose={() => setStatusModalEmployee(null)}
          title={
            statusModalEmployee.status === 'active'
              ? 'Deactivate Employee Account?'
              : 'Reactivate Employee Account?'
          }
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-semibold mb-1">
                  {statusModalEmployee.status === 'active'
                    ? 'Account Suspension Warning'
                    : 'Account Reactivation'}
                </p>
                <p>
                  {statusModalEmployee.status === 'active'
                    ? `Deactivating "${statusModalEmployee.full_name}" will immediately revoke their workspace access and hide their public profile from colleagues.`
                    : `Reactivating "${statusModalEmployee.full_name}" will restore their workspace login and public directory presence.`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStatusModalEmployee(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmToggleStatus}
                disabled={isUpdatingStatus}
                className={`px-5 py-2 text-xs font-semibold text-white rounded-xl transition-colors shadow-xs disabled:opacity-50 flex items-center ${
                  statusModalEmployee.status === 'active'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isUpdatingStatus ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Processing...
                  </>
                ) : statusModalEmployee.status === 'active' ? (
                  'Confirm Deactivation'
                ) : (
                  'Confirm Reactivation'
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
