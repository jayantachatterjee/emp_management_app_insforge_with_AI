import type { Employee, UserRole } from './employee';

export interface AuthUser {
  id: string;
  email: string;
  emailVerified?: boolean;
  providers?: string[];
  createdAt?: string;
  profile?: {
    name?: string;
    avatar_url?: string | null;
  };
}

export interface AuthContextType {
  user: AuthUser | null;
  employee: Employee | null;
  role: UserRole | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

