import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { employeeService } from '../services/employee.service';
import { departmentService } from '../services/department.service';
import type { Employee, Department } from '../types/employee';
import { SearchFilterBar } from '../components/employees/SearchFilterBar';
import { EmployeeCard } from '../components/employees/EmployeeCard';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { Modal } from '../components/common/Modal';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import {
  Users,
  Loader2,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const EmployeeDirectory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDept = searchParams.get('dept') || 'all';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState(initialDept);
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Selected employee detail modal
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Load departments
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
      console.error('Failed to load employees:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, departmentId, role, status, page, limit]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleResetFilters = () => {
    setSearch('');
    setDepartmentId('all');
    setRole('all');
    setStatus('all');
    setPage(1);
    setSearchParams({});
  };

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900">Employee Directory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse and connect with verified team members across the organization ({totalCount} total)
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
        onReset={handleResetFilters}
      />

      {/* Content Area */}
      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200/80 p-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
          <p className="text-xs font-medium text-slate-500">Searching records...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No employees found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Try adjusting your search criteria or resetting the active filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onClick={() => setSelectedEmployee(emp)}
            />
          ))}
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onClickRow={(emp) => setSelectedEmployee(emp)}
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

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <Modal
          isOpen={Boolean(selectedEmployee)}
          onClose={() => setSelectedEmployee(null)}
          title="Colleague Profile"
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar
                src={selectedEmployee.avatar_url}
                name={selectedEmployee.full_name}
                size="xl"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedEmployee.full_name}
                  </h3>
                  <Badge type="status" status={selectedEmployee.status} />
                </div>
                <p className="text-sm text-slate-600 mt-0.5">{selectedEmployee.job_title}</p>
                <div className="mt-2">
                  <Badge type="role" role={selectedEmployee.role} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <p className="text-slate-400 font-semibold mb-1">Department</p>
                <p className="text-slate-800 font-medium flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  {selectedEmployee.department?.name || 'General'}
                </p>
              </div>

              <div>
                <p className="text-slate-400 font-semibold mb-1">Corporate Email</p>
                <p className="text-slate-800 font-medium flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  {selectedEmployee.email}
                </p>
              </div>

              {selectedEmployee.phone && (
                <div>
                  <p className="text-slate-400 font-semibold mb-1">Phone Number</p>
                  <p className="text-slate-800 font-medium flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {selectedEmployee.phone}
                  </p>
                </div>
              )}

              <div>
                <p className="text-slate-400 font-semibold mb-1">Joined Company</p>
                <p className="text-slate-800 font-medium flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  {new Date(selectedEmployee.date_of_joining).toLocaleDateString()}
                </p>
              </div>
            </div>

            {selectedEmployee.bio && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  About
                </h4>
                <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-100">
                  {selectedEmployee.bio}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

