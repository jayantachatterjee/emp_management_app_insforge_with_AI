import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { storageService } from '../../services/storage.service';
import { employeeService } from '../../services/employee.service';
import { useAuth } from '../../contexts/AuthContext';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetEmployeeId?: string;
  currentAvatarKey?: string | null;
  currentAvatarUrl?: string | null;
  onSuccess?: () => void;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
  targetEmployeeId,
  currentAvatarKey,
  currentAvatarUrl,
  onSuccess,
}) => {
  const { employee, refreshProfile } = useAuth();
  const employeeId = targetEmployeeId || employee?.id;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image file must be under 5MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile || !employeeId) return;

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 1. Upload to InsForge S3 Storage bucket
      const uploadRes = await storageService.uploadAvatar(selectedFile);
      if (!uploadRes) {
        throw new Error('Upload returned empty response.');
      }

      // 2. Update employee profile in database with new url and key
      const updateRes = await employeeService.updateProfile(employeeId, {
        avatar_url: uploadRes.url,
        avatar_key: uploadRes.key,
      });

      if (!updateRes.success) {
        throw new Error(updateRes.error || 'Failed to update profile with new photo.');
      }

      // 3. Delete old avatar if present
      if (currentAvatarKey && currentAvatarKey !== uploadRes.key) {
        await storageService.removeAvatar(currentAvatarKey);
      }

      setSuccessMessage('Profile photo updated successfully!');
      await refreshProfile();
      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
        setSelectedFile(null);
        setPreviewUrl(null);
        setSuccessMessage(null);
      }, 1200);
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
      setErrorMessage(err.message || 'An error occurred while uploading.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!employeeId) return;
    setIsUploading(true);
    try {
      if (currentAvatarKey) {
        await storageService.removeAvatar(currentAvatarKey);
      }
      await employeeService.updateProfile(employeeId, {
        avatar_url: null,
        avatar_key: null,
      });
      await refreshProfile();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to remove avatar.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Profile Picture" maxWidth="md">
      <div className="space-y-5">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="flex flex-col items-center justify-center">
          {previewUrl || currentAvatarUrl ? (
            <div className="relative mb-4 group">
              <img
                src={previewUrl || currentAvatarUrl || ''}
                alt="Avatar Preview"
                className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-50 shadow-md"
              />
              <span className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full shadow-md text-xs">
                📸
              </span>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 mb-4">
              <UploadCloud className="w-8 h-8 mb-1" />
              <span className="text-xs">No Photo</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {selectedFile ? 'Choose Different Image' : 'Select Image from Computer'}
          </button>
          <p className="text-[11px] text-slate-400 mt-2">Supports JPG, PNG, WEBP up to 5MB.</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {currentAvatarUrl ? (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              disabled={isUploading}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50"
            >
              Remove Photo
            </button>
          ) : <div />}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs shadow-indigo-600/20 disabled:opacity-50 flex items-center"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Save Picture'
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
