import React, { useState, useEffect } from 'react';
import { auditService } from '../services/audit.service';
import type { AuditLog } from '../types/employee';
import { FileText, Loader2, RefreshCw } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await auditService.getRecentLogs(50);
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900">Security Audit Logs</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable system audit logs recorded in PostgreSQL for governance and compliance
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Audit Trail
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
            <p className="text-xs text-slate-500">Loading audit records...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="min-h-[250px] flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <p className="text-sm font-semibold">No audit records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-4">Timestamp</th>
                  <th scope="col" className="px-6 py-4">Action</th>
                  <th scope="col" className="px-6 py-4">Target ID</th>
                  <th scope="col" className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5 whitespace-nowrap text-slate-500 font-sans text-xs">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-slate-600">
                      {log.target_id ? log.target_id.slice(0, 8) + '...' : 'System'}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 max-w-md truncate">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

