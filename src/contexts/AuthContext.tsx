import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AuthContextType, AuthUser } from '../types/auth';
import type { Employee, UserRole } from '../types/employee';
import { authService } from '../services/auth.service';
import { employeeService } from '../services/employee.service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const profile = await employeeService.getProfile(userId);
      setEmployee(profile);
      return profile;
    } catch (err) {
      console.error('Failed to fetch profile in AuthProvider:', err);
      setEmployee(null);
      return null;
    }
  }, []);

  const loadSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await fetchProfile(currentUser.id);
      } else {
        setUser(null);
        setEmployee(null);
      }
    } catch (err) {
      console.error('Error restoring session:', err);
      setUser(null);
      setEmployee(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.signIn(email, password);
      if (!res.success) {
        setIsLoading(false);
        return { success: false, error: res.error };
      }

      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const profile = await fetchProfile(currentUser.id);
        setIsLoading(false);
        if (profile && profile.status === 'inactive') {
          await authService.signOut();
          setUser(null);
          setEmployee(null);
          return { success: false, error: 'Your account has been deactivated. Please contact your administrator.' };
        }
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Failed to retrieve session after login.' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'An unexpected error occurred during login.' };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
    } finally {
      setUser(null);
      setEmployee(null);
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  const role: UserRole | null = employee?.role || null;
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        employee,
        role,
        isAdmin,
        isLoading,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

