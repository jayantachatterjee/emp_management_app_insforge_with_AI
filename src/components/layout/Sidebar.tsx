import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShieldCheck,
  UserCog,
  FileText,
  Building2,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;

  const navContent = (
    <div className="flex flex-col h-full justify-between py-4">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Workspace
          </p>
          <nav className="space-y-1">
            <NavLink to="/dashboard" className={navLinkClass} onClick={onClose} end>
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Employee Dashboard
            </NavLink>
            <NavLink to="/directory" className={navLinkClass} onClick={onClose}>
              <Users className="w-4 h-4 mr-3" />
              Employee Directory
            </NavLink>
            <NavLink to="/profile" className={navLinkClass} onClick={onClose}>
              <UserCheck className="w-4 h-4 mr-3" />
              My Profile
            </NavLink>
          </nav>
        </div>

        {isAdmin && (
          <div>
            <div className="flex items-center px-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Administration
              </span>
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                RBAC
              </span>
            </div>
            <nav className="space-y-1">
              <NavLink to="/admin/dashboard" className={navLinkClass} onClick={onClose}>
                <ShieldCheck className="w-4 h-4 mr-3 text-indigo-500" />
                Admin Overview
              </NavLink>
              <NavLink to="/admin/employees" className={navLinkClass} onClick={onClose}>
                <UserCog className="w-4 h-4 mr-3 text-indigo-500" />
                Manage Employees
              </NavLink>
              <NavLink to="/admin/audit-logs" className={navLinkClass} onClick={onClose}>
                <FileText className="w-4 h-4 mr-3 text-indigo-500" />
                Security Audit Logs
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      <div className="px-3 pt-4 border-t border-slate-200">
        <div className="p-3 bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-xl border border-indigo-100/60 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-800 truncate">InsForge Backend</p>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1"></span>
              PostgreSQL Online
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 px-4 transform transition-transform duration-200 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 border-b border-slate-100">
          <span className="font-bold text-slate-800 text-sm">Navigation Menu</span>
          <button onClick={onClose} className="p-1 rounded-md text-slate-500 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        {navContent}
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16 bg-white border-r border-slate-200/80 px-4">
        {navContent}
      </aside>
    </>
  );
};
