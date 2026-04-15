import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import type { DepartmentResponse } from '../../api/types';

const DepartmentManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: departments, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: () => apiClient.get<DepartmentResponse[]>('/Departments'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/Departments/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });

  if (isLoading) return <div className="p-8 text-center">Loading departments...</div>;
  if (error) return <div className="p-8 text-center text-error">Error loading departments: {(error as Error).message}</div>;

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Page Header Asymmetric Layout */}
      <div className="flex justify-between items-end mb-12">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-extrabold font-manrope tracking-tight text-on-surface mb-2">Corporate Structure</h2>
          <p className="text-on-surface-variant text-lg">Manage organizational entities, hierarchy, and identification codes for the global enterprise network.</p>
        </div>
        <button className="primary-gradient-cta text-on-primary font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95">
          <span className="material-symbols-outlined">add_business</span>
          <span>Add New Department</span>
        </button>
      </div>

      {/* Bento Stats Grid (Editorial Polish) */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-[0_10px_30px_-5px_rgba(25,28,30,0.04)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">account_tree</span>
            </div>
            <div>
              <p className="text-sm font-label text-on-surface-variant">Total Departments</p>
              <p className="text-2xl font-bold font-manrope">{departments?.length || 0} Active</p>
            </div>
          </div>
          <div className="h-1 w-full bg-surface-container-high rounded-full">
            <div className="h-1 bg-primary w-full rounded-full"></div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 bg-indigo-600 p-6 rounded-xl relative overflow-hidden flex items-center justify-between text-white">
          <div className="relative z-10">
            <h3 className="text-xl font-bold font-manrope mb-1">Entity Sync Status</h3>
            <p className="text-indigo-100/80 text-sm max-w-md">All department codes are currently synchronized with the C# enterprise backbone and active ERP systems.</p>
          </div>
          <div className="relative z-10 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
            <span className="text-sm font-bold uppercase tracking-wider">Synced</span>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <span className="material-symbols-outlined !text-[160px]" style={{ fontVariationSettings: "'wght' 200" }}>hub</span>
          </div>
        </div>
      </div>

      {/* Department Table (Surface Layering) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_-5px_rgba(25,28,30,0.04)] overflow-hidden">
        <div className="px-8 py-6 flex items-center justify-between border-none">
          <h3 className="font-bold text-lg font-manrope">Department Directory</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-surface-container-low/50">
            <tr>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 font-manrope">Status</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 font-manrope">Department Name</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 font-manrope">Department Code</th>
              <th className="px-8 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {departments?.map((dept) => (
              <tr key={dept.id} className="hover:bg-surface-container-low/30 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    <span className="text-xs font-semibold text-on-surface-variant">Active</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-indigo-600">
                      <span className="material-symbols-outlined">domain</span>
                    </div>
                    <span className="font-semibold text-on-surface font-manrope">{dept.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <code className="bg-surface-container-high px-3 py-1 rounded text-xs font-mono text-primary font-bold">{dept.code}</code>
                </td>
                <td className="px-8 py-5 text-right">
                  <button 
                    onClick={() => {
                      if (window.confirm('Delete department?')) {
                        deleteMutation.mutate(dept.id);
                      }
                    }}
                    className="p-2 text-outline hover:bg-error-container hover:text-error rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentManagement;
