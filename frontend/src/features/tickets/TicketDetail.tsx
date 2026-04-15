import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import { TicketStatus } from '../../api/types';
import type { TicketResponse, TicketStatusType } from '../../api/types';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => apiClient.get<TicketResponse>(`/Tickets/${id}`),
    enabled: !!id,
  });

  const resolveMutation = useMutation({
    mutationFn: (solutionDescription: string) => 
      apiClient.patch(`/Tickets/${id}/resolve`, { solutionDescription }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ticket', id] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: TicketStatusType) => 
      apiClient.patch(`/Tickets/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ticket', id] }),
  });

  if (isLoading) return <div className="p-8 text-center">Loading ticket details...</div>;
  if (error) return <div className="p-8 text-center text-error">Error: {(error as Error).message}</div>;
  if (!ticket) return <div className="p-8 text-center text-on-surface-variant">Ticket not found.</div>;

  return (
    <div className="flex h-[calc(100vh-8rem)] -m-10">
      {/* SideNavBar (Focused detail view metadata) */}
      <aside className="hidden lg:flex flex-col w-80 bg-surface-container-high border-r border-slate-200/50 p-6 gap-8 shrink-0 overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-primary-container text-on-primary-container text-[10px] font-bold rounded uppercase tracking-wider">
              {ticket.status === TicketStatus.Open ? 'High Priority' : 'Information'}
            </span>
            <span className="text-on-surface-variant text-xs font-medium">#TK-{ticket.id.substring(0, 4)}</span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl text-on-surface leading-tight mb-4">{ticket.title}</h1>
          <div className="space-y-6">
            <div className="group">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Department</p>
              <div className="flex items-center gap-2 text-on-surface font-medium">
                <span className="material-symbols-outlined text-primary text-sm">hub</span>
                {ticket.departmentName}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Assigned To</p>
              <div className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold">
                  {ticket.technicianName?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-bold">{ticket.technicianName || 'Unassigned'}</p>
                  <p className="text-xs text-on-surface-variant">Technician</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Created</span>
                <span className="font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Status</span>
                <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-md text-[10px] font-bold uppercase">
                  {ticket.status === TicketStatus.Open ? 'Open' : ticket.status === TicketStatus.Pending ? 'Pending' : 'Resolved'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content: Ticket History/Chat */}
      <main className="flex-1 flex flex-col bg-surface overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar scroll-smooth space-y-12 max-w-4xl mx-auto w-full">
          {/* Initial Description */}
          <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                {ticket.creatorName.charAt(0)}
              </div>
              <span className="text-sm font-bold">{ticket.creatorName}</span>
              <span className="text-xs text-on-surface-variant">• {new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-on-surface leading-relaxed font-body">
              {ticket.description}
            </p>
          </section>

          {/* Solution Section if Resolved */}
          {ticket.status === TicketStatus.Resolved && (
            <section className="bg-tertiary-container/10 p-8 rounded-xl border border-tertiary/20 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-tertiary">
                <span className="material-symbols-outlined">check_circle</span>
                <span className="text-sm font-bold uppercase">Resolution Summary</span>
              </div>
              <p className="text-on-surface italic">{ticket.solutionDescription}</p>
              <div className="mt-4 text-xs text-on-surface-variant">
                Resolved by {ticket.technicianName} on {ticket.resolvedAt && new Date(ticket.resolvedAt).toLocaleString()}
              </div>
            </section>
          )}

          <div className="flex items-center gap-4 text-outline-variant/40">
            <div className="h-px flex-1 bg-current"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">System Information</span>
            <div className="h-px flex-1 bg-current"></div>
          </div>
          
          <p className="text-center text-xs text-on-surface-variant opacity-60">End of message history</p>
        </div>

        {/* Action Area if not resolved */}
        {ticket.status !== TicketStatus.Resolved && (
          <div className="p-6 bg-surface-container-high/50 backdrop-blur-sm border-t border-outline-variant/10">
            <div className="max-w-4xl mx-auto flex items-end gap-4">
              <div className="flex-1 bg-surface-container-lowest rounded-xl shadow-inner p-4 focus-within:ring-2 ring-primary-container transition-all">
                <h4 className="text-sm font-bold text-on-surface mb-3">Resolve Ticket</h4>
                <textarea 
                  id="solution-desc"
                  className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none h-24 mb-3" 
                  placeholder="Describe the solution provided..."
                ></textarea>
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      const desc = (document.getElementById('solution-desc') as HTMLTextAreaElement).value;
                      if (desc) resolveMutation.mutate(desc);
                    }}
                    disabled={resolveMutation.isPending}
                    className="bg-gradient-to-br from-primary to-primary-container text-white px-5 py-2 rounded-lg text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    {resolveMutation.isPending ? 'Resolving...' : 'Submit Resolution'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar: Quick Actions */}
      <aside className="hidden xl:flex flex-col w-96 bg-surface-container-lowest border-l border-slate-200/50 p-8 shrink-0 overflow-y-auto">
        <h3 className="font-headline font-bold text-lg mb-6">Technician Controls</h3>
        <div className="space-y-8">
          <div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4">Update Status</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => updateStatusMutation.mutate(TicketStatus.Pending)}
                disabled={updateStatusMutation.isPending || ticket.status === TicketStatus.Pending}
                className="flex flex-col items-center justify-center p-4 bg-surface-container-low rounded-xl hover:bg-secondary-container transition-all group disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-secondary mb-2 group-hover:scale-110 transition-transform">schedule</span>
                <span className="text-[10px] font-bold text-on-secondary-container">Set Pending</span>
              </button>
              <button 
                onClick={() => updateStatusMutation.mutate(TicketStatus.Open)}
                disabled={updateStatusMutation.isPending || ticket.status === TicketStatus.Open}
                className="flex flex-col items-center justify-center p-4 bg-surface-container-low rounded-xl hover:bg-primary-container/20 transition-all group disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform">flag</span>
                <span className="text-[10px] font-bold text-primary">Set Open</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default TicketDetail;
