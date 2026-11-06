import { insforge } from '../lib/insforge';
import type { AuthUser } from '../types/auth';

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await insforge.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return { success: false, error: error.message || 'Invalid credentials' };
    }

    return { success: true, data };
  },

  async signOut() {
    const { error } = await insforge.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (error || !data?.user) {
        return null;
      }
      return data.user as AuthUser;
    } catch (err) {
      console.error('Failed to get current user:', err);
      return null;
    }
  },
};

