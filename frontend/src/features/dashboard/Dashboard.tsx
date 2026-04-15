import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import { useAuthStore } from '../../stores/authStore';
import { TicketStatus } from '../../api/types';
import type { TicketResponse } from '../../api/types';

const DashboardView: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => apiClient.get<TicketResponse[]>('/Tickets'),
  });

  const urgentTickets = tickets?.filter(t => t.status === TicketStatus.Open).length || 0;

  if (isLoading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-10">
      {/* Greeting Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-label-md text-on-surface-variant font-medium tracking-wide uppercase text-xs mb-2 block">Overview Dashboard</span>
          <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">
            Good morning, {user?.fullName.split(' ')[0]}.
          </h2>
          <p className="text-on-surface-variant mt-2 max-w-lg">
            {urgentTickets > 0 
              ? `You have ${urgentTickets} urgent tickets that require your immediate attention today.`
              : "You're all caught up! No urgent tickets at the moment."}
          </p>
        </div>
        <button className="primary-gradient-cta text-white py-4 px-8 rounded-xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
          Create New Ticket
        </button>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Metric */}
        <div className="col-span-12 md:col-span-8 bg-surface-container-lowest p-8 rounded-2xl ghost-border relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-on-surface font-headline">Resolution Velocity</h3>
                <p className="text-sm text-on-surface-variant">Average time to close primary support tickets</p>
              </div>
              <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                +12% Efficiency
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-primary">2.4</span>
              <span className="text-xl font-medium text-on-surface-variant">hours</span>
            </div>
            <div className="mt-8 flex gap-4">
              <div className="flex-grow bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <span className="material-symbols-outlined text-[200px]">speed</span>
          </div>
        </div>

        {/* Secondary Stats Stack */}
        <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-6">
          <div className="bg-secondary-container p-6 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-on-secondary-container">verified_user</span>
              <span className="text-xs font-bold text-on-secondary-container/60 uppercase">CSAT Score</span>
            </div>
            <div>
              <p className="text-3xl font-black text-on-secondary-container">98.2%</p>
              <p className="text-xs font-medium text-on-secondary-container/80">Industry leading satisfaction</p>
            </div>
          </div>
          <div className="bg-tertiary-fixed p-6 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-on-tertiary-fixed">bolt</span>
              <span className="text-xs font-bold text-on-tertiary-fixed/60 uppercase">Active Tickets</span>
            </div>
            <div>
              <p className="text-3xl font-black text-on-tertiary-fixed">{tickets?.length || 0}</p>
              <p className="text-xs font-medium text-on-tertiary-fixed/80">Managed by your team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-2xl font-bold font-headline text-on-surface">My Active Tickets</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors">View All Tickets</button>
          </div>
        </div>
        {/* Ticket Table / List */}
        <div className="bg-surface-container-low rounded-2xl p-2">
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden ghost-border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/30">
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ticket Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Requester</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets?.slice(0, 3).map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                          <span className="material-symbols-outlined">bug_report</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{ticket.title}</p>
                          <p className="text-xs text-on-surface-variant mt-1">#TK-{ticket.id.substring(0, 4)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                          {ticket.creatorName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-on-surface">{ticket.creatorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-primary font-bold text-[10px] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {ticket.status === TicketStatus.Open ? 'Open' : ticket.status === TicketStatus.Pending ? 'Pending' : 'Resolved'}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <p className="text-sm font-medium text-on-surface">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardView;
