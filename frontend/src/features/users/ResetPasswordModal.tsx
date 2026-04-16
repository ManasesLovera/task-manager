import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import { useToastStore } from '../../stores/toastStore';
import type { UserResponse, ResetPasswordRequest } from '../../api/types';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, user }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addToast = useToastStore((state) => state.addToast);

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => 
      apiClient.post<void>(`/Users/${user?.id}/reset-password`, data),
    onSuccess: () => {
      addToast('Password reset successfully!', 'success');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to reset password');
    },
  });

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    resetPasswordMutation.mutate({ newPassword });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
          <h2 className="text-xl font-bold font-headline text-on-surface">Reset Password</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-6 pt-4">
          <p className="text-sm text-on-surface-variant">
            Set a new password for <span className="font-bold text-on-surface">{user.fullName}</span> ({user.email}).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-error-container text-on-error-container text-sm rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
              placeholder="Min 6 characters"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
              placeholder="Repeat new password"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-outline-variant/30 text-on-surface-variant font-bold rounded-xl hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-1px] transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
            >
              {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
