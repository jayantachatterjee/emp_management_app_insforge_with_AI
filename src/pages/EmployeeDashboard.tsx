import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { employeeService } from '../services/employee.service';
import type { Employee } from '../types/employee';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import {
  Users,
  Briefcase,
  Calendar,
  Building,
  Mail,
  Phone,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const { employee, isAdmin } = useAuth();
  const [departmentTeammates, setDepartmentTeammates] = useState<Employee[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    if (employee?.department_id) {
      employeeService
        .getEmployees({ departmentId: employee.department_id, limit: 5 })
        .then((res) => {
          // exclude current user from teammates list
          setDepartmentTeammates(res.employees.filter((e) => e.id !== employee.id));
        });
    }

    employeeService.getEmployees({ limit: 1 }).then((res) => {
      setTotalEmployees(res.totalCount);
    });
  }, [employee]);

  if (!employee) return null;

  // Calculate days since joining
  const joiningDate = new Date(employee.date_of_joining);
  const diffDays = Math.max(
    0,
    Math.floor((new Date().getTime() - joiningDate.getTime()) / (1000 * 3600 * 24))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <Avatar
              src={employee.avatar_url}
              name={employee.full_name}
              size="xl"
              className="ring-4 ring-white/20"
            />
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs uppercase tracking-widest text-indigo-300 font-bold">
                  Welcome back
                </span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {employee.full_name}
              </h1>
              <p className="text-sm text-indigo-200 mt-1">
                {employee.job_title} • {employee.department?.name || 'General'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/profile"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs font-semibold transition-all border border-white/10"
            >
              Edit Profile & Photo
            </Link>
            <Link
              to="/directory"
              className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/30 transition-all flex items-center"
            >
              Company Directory
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Department
            </p>
            <h4 className="text-base font-bold text-slate-800 truncate">
              {employee.department?.name || 'Assigned'}
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tenure</p>
            <h4 className="text-base font-bold text-slate-800">
              {diffDays === 0 ? 'Joined Today' : `${diffDays} Days`}
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Directory Size
            </p>
            <h4 className="text-base font-bold text-slate-800">{totalEmployees} Colleagues</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Access Level</p>
            <div className="mt-0.5">
              <Badge type="role" role={employee.role} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Summary Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs lg:col-span-1">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Profile Overview</span>
            <Badge type="status" status={employee.status} />
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <p className="text-slate-400 font-semibold mb-1">Corporate Email</p>
              <p className="text-slate-800 font-medium flex items-center">
                <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
                {employee.email}
              </p>
            </div>

            <div>
              <p className="text-slate-400 font-semibold mb-1">Contact Phone</p>
              <p className="text-slate-800 font-medium flex items-center">
                <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                {employee.phone || 'Not provided'}
              </p>
            </div>

            <div>
              <p className="text-slate-400 font-semibold mb-1">Job Designation</p>
              <p className="text-slate-800 font-medium flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-2 text-slate-400" />
                {employee.job_title}
              </p>
            </div>

            <div>
              <p className="text-slate-400 font-semibold mb-1">Joining Date</p>
              <p className="text-slate-800 font-medium flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400" />
                {joiningDate.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <p className="text-slate-400 font-semibold mb-1">Bio / About</p>
              <p className="text-slate-600 italic leading-relaxed">
                {employee.bio || 'No personal bio added yet. Click edit profile to add your background.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/profile"
              className="w-full inline-flex justify-center items-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Update Information
            </Link>
          </div>
        </div>

        {/* Right Column: Department Teammates & Quick Actions */}
        <div className="space-y-6 lg:col-span-2">
          {/* Teammates Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Department Colleagues ({employee.department?.name || 'Team'})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Connect with team members working in your department
                </p>
              </div>
              <Link
                to={`/directory?dept=${employee.department_id}`}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center"
              >
                View All
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {departmentTeammates.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No other teammates found in this department yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {departmentTeammates.map((mate) => (
                  <div key={mate.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar src={mate.avatar_url} name={mate.full_name} size="md" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{mate.full_name}</p>
                        <p className="text-xs text-slate-500">{mate.job_title}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden sm:inline">{mate.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          {isAdmin && (
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-6 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                      Administrative Control
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Administrator Tools Available
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-lg">
                    As an administrator, you have permission to provision new employees, manage active statuses, and inspect audit trails.
                  </p>
                </div>
                <Link
                  to="/admin/dashboard"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all shrink-0"
                >
                  Open Admin Center
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

