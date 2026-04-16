import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import type { UserResponse } from '../../api/types';

const UserManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get<UserResponse[]>('/Users'),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (userId: string) => apiClient.patch(`/Users/${userId}/toggle-status`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  if (isLoading) return <div className="p-8 text-center">Loading team members...</div>;
  if (error) return <div className="p-8 text-center text-error">Error loading team: {(error as Error).message}</div>;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumbs and Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-widest opacity-60">
            <span>Organization</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary font-bold">Team Management</span>
          </nav>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Team Members</h2>
          <p className="text-on-surface-variant max-w-xl leading-relaxed">Manage your organization's workforce, adjust permissions, and monitor active account statuses from a centralized hub.</p>
        </div>
      </div>

      {/* Stats Bar (Bento-lite) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_10px_30px_-5px_rgba(25,28,30,0.04)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">group</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant opacity-60 uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-extrabold font-headline">{users?.length || 0}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_10px_30px_-5px_rgba(25,28,30,0.04)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant opacity-60 uppercase tracking-wider">Active</p>
            <p className="text-2xl font-extrabold font-headline">{users?.filter(u => u.isActive).length || 0}</p>
          </div>
        </div>
      </div>

      {/* Management Table */}
      <section className="bg-surface-container-lowest rounded-3xl shadow-[0_10px_30px_-5px_rgba(25,28,30,0.04)] overflow-hidden">
        <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-outline-variant/10">
          <div className="flex items-center gap-4">
            <h3 className="font-headline font-bold text-xl">Directory</h3>
            <div className="bg-surface-container-low px-3 py-1 rounded-full text-xs font-bold text-on-surface-variant">
              Showing {users?.length || 0} of {users?.length || 0}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/30">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Name</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Email Address</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Role</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {user.fullName.charAt(0)}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${user.isActive ? 'bg-tertiary-fixed-dim' : 'bg-outline'}`}></div>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{user.fullName}</p>
                        <p className="text-xs text-on-surface-variant opacity-60">Task Manager Team</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-on-surface-variant">{user.email}</td>
                  <td className="px-8 py-5">
                    <span className="bg-surface-container-low px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => toggleStatusMutation.mutate(user.id)}
                      disabled={toggleStatusMutation.isPending}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${user.isActive ? 'bg-primary-container' : 'bg-outline-variant/30'}`}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white transition shadow-sm ${user.isActive ? 'translate-x-6' : 'translate-x-1'}`}></span>
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserManagement;
