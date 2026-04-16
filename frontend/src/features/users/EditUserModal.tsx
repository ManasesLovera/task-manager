import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import { useToastStore } from '../../stores/toastStore';
import type { UserResponse, UpdateUserRequest } from '../../api/types';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user }) => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'Admin' | 'Technician' | 'Member'>('Member');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setRole(user.role);
      setIsActive(user.isActive);
    }
  }, [user]);

  const updateUserMutation = useMutation({
    mutationFn: (updateData: UpdateUserRequest) => 
      apiClient.put<void>(`/Users/${user?.id}`, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      addToast('User updated successfully!', 'success');
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.[0]?.description || err.message || 'Failed to update user');
    },
  });

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !role) {
      setError('Please fill in all fields');
      return;
    }
    updateUserMutation.mutate({ fullName, role, isActive });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
          <h2 className="text-xl font-bold font-headline text-on-surface">Edit User</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-error-container text-on-error-container text-sm rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="edit-fullName" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Full Name
            </label>
            <input
              id="edit-fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-email" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Email Address (Read-only)
            </label>
            <input
              id="edit-email"
              type="email"
              value={user.email}
              readOnly
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-xl opacity-60 cursor-not-allowed text-on-surface"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-role" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Role
            </label>
            <div className="relative">
              <select
                id="edit-role"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface appearance-none"
              >
                <option value="Member">Member</option>
                <option value="Technician">Technician</option>
                <option value="Admin">Admin</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                expand_more
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div>
              <p className="text-sm font-bold text-on-surface">Active Account</p>
              <p className="text-xs text-on-surface-variant opacity-60">Whether this user can log in to the system.</p>
            </div>
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-primary-container' : 'bg-outline-variant/30'}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white transition shadow-sm ${isActive ? 'translate-x-6' : 'translate-x-1'}`}></span>
            </button>
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
              disabled={updateUserMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-1px] transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
            >
              {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
