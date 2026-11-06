import { insforge } from '../lib/insforge';

export const storageService = {
  async uploadAvatar(file: File): Promise<{ url: string; key: string } | null> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload a valid image file (PNG, JPG, WEBP).');
      }

      // 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB.');
      }

      const { data, error } = await insforge.storage
        .from('avatars')
        .uploadAuto(file);

      if (error || !data) {
        console.error('Storage upload error:', error);
        throw new Error(error?.message || 'Failed to upload profile photo');
      }

      return {
        url: data.url,
        key: data.key,
      };
    } catch (err: any) {
      console.error('Error in uploadAvatar:', err);
      throw err;
    }
  },

  async removeAvatar(avatarKey: string): Promise<boolean> {
    try {
      if (!avatarKey) return false;
      const { error } = await insforge.storage
        .from('avatars')
        .remove(avatarKey);

      if (error) {
        console.warn('Failed to delete old avatar:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Error deleting avatar:', err);
      return false;
    }
  },
};

