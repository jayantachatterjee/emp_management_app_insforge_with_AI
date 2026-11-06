import { insforge } from '../lib/insforge';
import type { Employee, EmployeeFilterParams } from '../types/employee';

export interface AdminCreateEmployeeInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'employee';
  departmentId: string;
  jobTitle: string;
  phone?: string;
}

export const employeeService = {
  async getProfile(userId: string): Promise<Employee | null> {
    const { data, error } = await insforge.database
      .from('employees')
      .select('*, department:departments(*)')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching employee profile:', error);
      return null;
    }

    return data as Employee | null;
  },

  async getEmployees(params: EmployeeFilterParams = {}) {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = insforge.database
      .from('employees')
      .select('*, department:departments(*)', { count: 'exact' });

    if (params.search && params.search.trim()) {
      const term = `%${params.search.trim()}%`;
      query = query.ilike('full_name', term);
    }

    if (params.departmentId && params.departmentId !== 'all') {
      query = query.eq('department_id', params.departmentId);
    }

    if (params.role && params.role !== 'all') {
      query = query.eq('role', params.role);
    }

    if (params.status && params.status !== 'all') {
      query = query.eq('status', params.status);
    }

    const { data, error, count } = await query
      .order('full_name', { ascending: true })
      .range(from, to);

    if (error) {
      console.error('Error fetching employees:', error);
      return { employees: [], totalCount: 0 };
    }

    return {
      employees: (data || []) as Employee[],
      totalCount: count || 0,
    };
  },

  async updateProfile(id: string, updates: Partial<Employee>): Promise<{ success: boolean; error?: string }> {
    // Whitelist editable fields for employees
    const payload: Record<string, unknown> = {};
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.bio !== undefined) payload.bio = updates.bio;
    if (updates.address !== undefined) payload.address = updates.address;
    if (updates.emergency_contact !== undefined) payload.emergency_contact = updates.emergency_contact;
    if (updates.avatar_url !== undefined) payload.avatar_url = updates.avatar_url;
    if (updates.avatar_key !== undefined) payload.avatar_key = updates.avatar_key;
    if (updates.first_name !== undefined) payload.first_name = updates.first_name;
    if (updates.last_name !== undefined) payload.last_name = updates.last_name;

    const { error } = await insforge.database
      .from('employees')
      .update(payload)
      .eq('id', id);

    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  async adminCreateEmployee(input: AdminCreateEmployeeInput): Promise<{ success: boolean; id?: string; error?: string }> {
    const { data, error } = await insforge.database.rpc('admin_create_employee', {
      p_email: input.email.trim(),
      p_password: input.password,
      p_first_name: input.firstName.trim(),
      p_last_name: input.lastName.trim(),
      p_role: input.role,
      p_department_id: input.departmentId,
      p_job_title: input.jobTitle.trim(),
      p_phone: input.phone?.trim() || null,
    });

    if (error) {
      console.error('Error in admin_create_employee:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data as string };
  },

  async adminSetEmployeeStatus(employeeId: string, status: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await insforge.database.rpc('admin_set_employee_status', {
      p_employee_id: employeeId,
      p_status: status,
    });

    if (error) {
      console.error('Error setting status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  async adminUpdateEmployee(id: string, updates: Partial<Employee>): Promise<{ success: boolean; error?: string }> {
    const payload: Record<string, unknown> = {};
    if (updates.first_name !== undefined) payload.first_name = updates.first_name;
    if (updates.last_name !== undefined) payload.last_name = updates.last_name;
    if (updates.role !== undefined) payload.role = updates.role;
    if (updates.department_id !== undefined) payload.department_id = updates.department_id;
    if (updates.job_title !== undefined) payload.job_title = updates.job_title;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.date_of_joining !== undefined) payload.date_of_joining = updates.date_of_joining;

    const { error } = await insforge.database
      .from('employees')
      .update(payload)
      .eq('id', id);

    if (error) {
      console.error('Error updating employee as admin:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  },
};
