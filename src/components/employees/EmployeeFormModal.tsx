import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { employeeService, type AdminCreateEmployeeInput } from '../../services/employee.service';
import type { Department, Employee, EmployeeStatus, UserRole } from '../../types/employee';
import { AlertCircle, CheckCircle2, Loader2, KeyRound } from 'lucide-react';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
  departments: Department[];
  onSuccess: () => void;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit,
  departments,
  onSuccess,
}) => {
  const isEditing = Boolean(employeeToEdit);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [departmentId, setDepartmentId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<EmployeeStatus>('active');
  const [dateOfJoining, setDateOfJoining] = useState(new Date().toISOString().split('T')[0]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (employeeToEdit) {
      setEmail(employeeToEdit.email);
      setPassword('');
      setFirstName(employeeToEdit.first_name);
      setLastName(employeeToEdit.last_name);
      setRole(employeeToEdit.role);
      setDepartmentId(employeeToEdit.department_id || (departments[0]?.id || ''));
      setJobTitle(employeeToEdit.job_title || '');
      setPhone(employeeToEdit.phone || '');
      setStatus(employeeToEdit.status);
      setDateOfJoining(employeeToEdit.date_of_joining || new Date().toISOString().split('T')[0]);
    } else {
      setEmail('');
      setPassword('Welcome123!');
      setFirstName('');
      setLastName('');
      setRole('employee');
      setDepartmentId(departments[0]?.id || '');
      setJobTitle('');
      setPhone('');
      setStatus('active');
      setDateOfJoining(new Date().toISOString().split('T')[0]);
    }
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [employeeToEdit, departments, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (isEditing && employeeToEdit) {
        // Edit existing employee
        const res = await employeeService.adminUpdateEmployee(employeeToEdit.id, {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          role,
          department_id: departmentId || null,
          job_title: jobTitle.trim(),
          phone: phone.trim() || null,
          status,
          date_of_joining: dateOfJoining,
        });

        if (!res.success) {
          throw new Error(res.error || 'Failed to update employee details.');
        }

        setSuccessMsg('Employee details updated successfully!');
      } else {
        // Create new employee
        if (!password || password.length < 6) {
          throw new Error('Initial password must be at least 6 characters long.');
        }

        const input: AdminCreateEmployeeInput = {
          email: email.trim(),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role,
          departmentId: departmentId || departments[0]?.id,
          jobTitle: jobTitle.trim(),
          phone: phone.trim() || undefined,
        };

        const res = await employeeService.adminCreateEmployee(input);
        if (!res.success) {
          throw new Error(res.error || 'Failed to create employee account.');
        }

        setSuccessMsg('Employee created and provisioned successfully!');
      }

      onSuccess();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Form submission error:', err);
      setErrorMsg(err.message || 'Operation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Employee Details' : 'Create New Employee'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Name inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Jane"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Doe"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Email & Initial Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Corporate Email *
            </label>
            <input
              type="email"
              required
              disabled={isEditing}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.doe@company.com"
              className={`w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                isEditing ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''
              }`}
            />
            {isEditing && (
              <span className="text-[10px] text-slate-400 mt-1 block">
                Email cannot be modified directly once created.
              </span>
            )}
          </div>

          {!isEditing && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Password *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}
        </div>

        {/* Job Title & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Department *
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Role & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              System Role (RBAC) *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="employee">Standard Employee</option>
              <option value="admin">Administrator (Full Access)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Employment Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive / Deactivated</option>
            </select>
          </div>
        </div>

        {/* Phone & Date of Joining */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date of Joining
            </label>
            <input
              type="date"
              value={dateOfJoining}
              onChange={(e) => setDateOfJoining(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs shadow-indigo-600/20 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Create Employee'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

