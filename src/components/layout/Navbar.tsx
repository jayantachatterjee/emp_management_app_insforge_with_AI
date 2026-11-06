import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { LogOut, User, Shield, Menu } from 'lucide-react';

export const Navbar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const { employee, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 leading-tight tracking-tight text-base">
                  TalentForge
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-600">
                  EMS Cloud
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {employee && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-slate-50 transition-colors focus:outline-hidden"
                >
                  <Avatar
                    src={employee.avatar_url}
                    name={employee.full_name}
                    size="sm"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800 leading-none mb-1">
                      {employee.full_name}
                    </span>
                    <span className="text-xs text-slate-500 leading-none">
                      {employee.job_title || employee.email}
                    </span>
                  </div>
                  <Badge type="role" role={employee.role} className="hidden md:inline-flex" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl ring-1 ring-black/5 divide-y divide-slate-100 animate-in fade-in zoom-in-95"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="p-3">
                      <p className="text-xs font-medium text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {employee.email}
                      </p>
                      <div className="mt-2">
                        <Badge type="role" role={employee.role} />
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 mr-2.5 text-slate-400" />
                        My Profile
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-medium"
                        >
                          <Shield className="w-4 h-4 mr-2.5 text-indigo-600" />
                          Admin Overview
                        </Link>
                      )}
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4 mr-2.5 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

