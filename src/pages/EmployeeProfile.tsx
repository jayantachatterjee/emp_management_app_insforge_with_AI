import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { employeeService } from '../services/employee.service';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { AvatarUploadModal } from '../components/employees/AvatarUploadModal';
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  User,
  Phone,
  MapPin,
  HeartPulse,
} from 'lucide-react';

export const EmployeeProfile: React.FC = () => {
  const { employee, refreshProfile } = useAuth();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState(employee?.first_name || '');
  const [lastName, setLastName] = useState(employee?.last_name || '');
  const [phone, setPhone] = useState(employee?.phone || '');
  const [bio, setBio] = useState(employee?.bio || '');
  const [address, setAddress] = useState(employee?.address || '');

  // Emergency contact states
  const [ecName, setEcName] = useState(employee?.emergency_contact?.name || '');
  const [ecRelationship, setEcRelationship] = useState(employee?.emergency_contact?.relationship || '');
  const [ecPhone, setEcPhone] = useState(employee?.emergency_contact?.phone || '');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!employee) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await employeeService.updateProfile(employee.id, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || null,
        bio: bio.trim() || null,
        address: address.trim() || null,
        emergency_contact: {
          name: ecName.trim() || undefined,
          relationship: ecRelationship.trim() || undefined,
          phone: ecPhone.trim() || undefined,
        },
      });

      if (!res.success) {
        throw new Error(res.error || 'Failed to update profile.');
      }

      await refreshProfile();
      setSuccessMsg('Your profile has been updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Save profile error:', err);
      setErrorMsg(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          {/* Avatar with edit overlay */}
          <div className="relative group shrink-0">
            <Avatar
              src={employee.avatar_url}
              name={employee.full_name}
              size="xl"
              className="ring-4 ring-slate-100 shadow-md"
            />
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
              title="Change Profile Picture"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {employee.full_name}
              </h2>
              <Badge type="status" status={employee.status} />
              <Badge type="role" role={employee.role} />
            </div>
            <p className="text-sm font-medium text-slate-500">
              {employee.job_title} • {employee.department?.name || 'Department'}
            </p>
            <p className="text-xs text-slate-400">
              Employee ID: <span className="font-mono text-slate-600">{employee.id}</span>
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
              >
                Upload / Change Photo via InsForge Storage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center shadow-xs">
            <CheckCircle2 className="w-5 h-5 mr-3 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center shadow-xs">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Personal Information */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Residential Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, Postal Code"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Professional Biography
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your skills, roles, and interests..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Section 2: Emergency Contact */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-slate-900">Emergency Contact</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Name
              </label>
              <input
                type="text"
                value={ecName}
                onChange={(e) => setEcName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Relationship
              </label>
              <input
                type="text"
                value={ecRelationship}
                onChange={(e) => setEcRelationship(e.target.value)}
                placeholder="e.g. Spouse, Parent"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Phone
              </label>
              <input
                type="tel"
                value={ecPhone}
                onChange={(e) => setEcPhone(e.target.value)}
                placeholder="+1 (555) 999-8888"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Organization & System Controls (Read Only) */}
        <div className="bg-slate-50/70 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200/80 pb-3">
            <Lock className="w-5 h-5 text-slate-500" />
            <h3 className="text-base font-bold text-slate-800">
              Employment Details (Managed by Administrator)
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            These fields are protected by backend Row Level Security and company governance. Contact Human Resources to request changes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Corporate Email</span>
              <span className="text-xs font-semibold text-slate-800 truncate block">{employee.email}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Department</span>
              <span className="text-xs font-semibold text-slate-800 block">{employee.department?.name || 'General'}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Role / Permissions</span>
              <Badge type="role" role={employee.role} />
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Joining Date</span>
              <span className="text-xs font-semibold text-slate-800 block">
                {new Date(employee.date_of_joining).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/25 disabled:opacity-50 flex items-center"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving Profile...
              </>
            ) : (
              'Save Profile Changes'
            )}
          </button>
        </div>
      </form>

      {/* Avatar Modal */}
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatarKey={employee.avatar_key}
        currentAvatarUrl={employee.avatar_url}
        onSuccess={refreshProfile}
      />
    </div>
  );
};
