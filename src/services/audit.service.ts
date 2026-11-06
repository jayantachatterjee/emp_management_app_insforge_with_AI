import { insforge } from '../lib/insforge';
import type { AuditLog } from '../types/employee';

export const auditService = {
  async getRecentLogs(limit = 20): Promise<AuditLog[]> {
    const { data, error } = await insforge.database
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }

    return (data || []) as AuditLog[];
  },
};

