export type UserRole = 'admin' | 'employee';

export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
}

export interface Employee {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string | null;
  role: UserRole;
  department_id?: string | null;
  department?: Department | null;
  job_title?: string | null;
  date_of_joining: string;
  status: EmployeeStatus;
  avatar_url?: string | null;
  avatar_key?: string | null;
  bio?: string | null;
  address?: string | null;
  emergency_contact?: EmergencyContact | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string | null;
  actor_email?: string | null;
  action: string;
  target_id?: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export interface EmployeeFilterParams {
  search?: string;
  departmentId?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

