import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(result.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 items-center justify-center shadow-xl shadow-indigo-500/30 mb-4 ring-4 ring-indigo-500/20">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          TalentForge EMS
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Enterprise Employee Management on InsForge Cloud
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/20 text-slate-900">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center animate-in fade-in">
                <AlertCircle className="w-4 h-4 mr-2.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to Workspace
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for instant evaluation */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              One-Click Seed Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@company.com', 'AdminPassword123!')}
                className="p-2.5 text-xs text-left bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-900 rounded-xl border border-indigo-100 transition-colors"
              >
                <div className="font-bold flex items-center">
                  <Shield className="w-3 h-3 mr-1 text-indigo-600" />
                  Admin
                </div>
                <div className="text-[11px] text-indigo-600/80 truncate">admin@company.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('alex.morgan@company.com', 'EmployeePassword123!')}
                className="p-2.5 text-xs text-left bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-200 transition-colors"
              >
                <div className="font-bold">Employee</div>
                <div className="text-[11px] text-slate-500 truncate">alex.morgan@company.com</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

