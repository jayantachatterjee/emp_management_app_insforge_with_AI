import React from 'react';
import { Search, Filter, LayoutGrid, Table as TableIcon, X } from 'lucide-react';
import type { Department } from '../../types/employee';

interface SearchFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  departmentId: string;
  onDepartmentChange: (val: string) => void;
  role: string;
  onRoleChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  departments: Department[];
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onReset: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  search,
  onSearchChange,
  departmentId,
  onDepartmentChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  departments,
  viewMode,
  onViewModeChange,
  onReset,
}) => {
  const hasActiveFilters =
    search.trim() !== '' ||
    departmentId !== 'all' ||
    role !== 'all' ||
    status !== 'all';

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search employees by name, title, or email..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl self-end md:self-auto">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Table View"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
        <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
          <Filter className="w-3.5 h-3.5 mr-1.5" />
          Filters:
        </div>

        {/* Department Filter */}
        <select
          value={departmentId}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="text-xs font-medium py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Role Filter */}
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="text-xs font-medium py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          <option value="all">All Roles</option>
          <option value="employee">Employee</option>
          <option value="admin">Administrator</option>
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="text-xs font-medium py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="inactive">Inactive</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-md hover:bg-rose-50 transition-colors ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

