import { insforge } from '../lib/insforge';
import type { Department } from '../types/employee';

export const departmentService = {
  async getDepartments(): Promise<Department[]> {
    const { data, error } = await insforge.database
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Failed to fetch departments:', error);
      return [];
    }

    return (data || []) as Department[];
  },
};

