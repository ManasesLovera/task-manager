import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import { useCreateTicketModal } from '../../stores/createTicketStore';
import { useAuthStore } from '../../stores/authStore';
import { TicketStatus, TicketPriority } from '../../api/types';
import type { TicketResponse, TicketStatusType, TicketPriorityType, DepartmentResponse } from '../../api/types';
import TicketActionModal from './TicketActionModal';

const TicketQueue: React.FC = () => {
  const { user } = useAuthStore();
  const openModal = useCreateTicketModal((state) => state.open);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketResponse | null>(null);

  const handleOpenAction = (ticket: TicketResponse) => {
    setSelectedTicket(ticket);
    setActionModalOpen(true);
  };

  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ['tickets', selectedDept, selectedPriority],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedDept) params.append('departmentId', selectedDept);
      if (selectedPriority !== '') params.append('priority', selectedPriority);
      return apiClient.get<TicketResponse[]>(`/Tickets?${params.toString()}`);
    },
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => apiClient.get<DepartmentResponse[]>('/Departments'),
  });

  const getStatusDetails = (status: TicketStatusType) => {
    switch (status) {
      case TicketStatus.Open:
        return {
          label: 'Open',
          bgClass: 'bg-secondary-container text-on-primary-fixed-variant',
          dotClass: 'bg-primary animate-pulse',
        };
      case TicketStatus.Pending:
        return {
          label: 'Pending',
          bgClass: 'bg-[#fef9c3] text-[#854d0e]',
          dotClass: 'bg-[#ca8a04]',
        };
      case TicketStatus.Resolved:
        return {
          label: 'Resolved',
          bgClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
          dotClass: 'bg-tertiary',
        };
      default:
        return { label: 'Unknown', bgClass: 'bg-gray-100', dotClass: 'bg-gray-400' };
    }
  };

  const getPriorityDetails = (priority: TicketPriorityType) => {
    switch (priority) {
      case TicketPriority.Low:
        return { label: 'Low', icon: 'low_priority', color: 'text-on-surface-variant' };
      case TicketPriority.Medium:
        return { label: 'Medium', icon: 'flag', color: 'text-primary' };
      case TicketPriority.High:
        return { label: 'High', icon: 'priority_high', color: 'text-error' };
      default:
        return { label: 'Unknown', icon: 'help', color: 'text-gray-400' };
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading tickets...</div>;
  if (error) return <div className="p-8 text-center text-error">Error loading tickets: {(error as Error).message}</div>;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-xs font-bold tracking-widest text-primary uppercase mb-2 block">Enterprise Queue</span>
          <h2 className="text-3xl font-extrabold text-on-surface font-headline leading-tight">Active Ticket Pipeline</h2>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/10 rounded-xl shadow-sm">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">hub</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-xs font-bold text-on-surface-variant outline-none cursor-pointer"
            >
              <option value="">All Departments</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/10 rounded-xl shadow-sm">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">flag</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-xs font-bold text-on-surface-variant outline-none cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value={TicketPriority.Low}>Low</option>
              <option value={TicketPriority.Medium}>Medium</option>
              <option value={TicketPriority.High}>High</option>
            </select>
          </div>
          <button 
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all ml-2"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            New Ticket
          </button>
        </div>
      </div>

      {/* Bento Stats Grid (Minimal Placeholder - could be calculated from data) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/5">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Open</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-primary">{tickets?.filter(t => t.status === TicketStatus.Open).length || 0}</span>
          </div>
        </div>
        {/* ... Other stats could go here ... */}
      </div>

      {/* Data Table Section */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Ticket ID</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Title</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Department</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Priority</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {tickets?.map((ticket) => {
                const statusInfo = getStatusDetails(ticket.status);
                const priorityInfo = getPriorityDetails(ticket.priority);
                const canOpenAction = user?.role === 'Admin' || user?.role === 'Technician' || user?.id === ticket.creatorId;
                return (
                  <tr 
                    key={ticket.id} 
                    onClick={() => canOpenAction && handleOpenAction(ticket)}
                    className="hover:bg-surface-container-low/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <span className="font-manrope font-bold text-primary">#TK-{ticket.id.substring(0, 4)}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-bold text-on-surface leading-tight">{ticket.title}</p>
                        <p className="text-xs text-on-surface-variant mt-1">Reported by {ticket.creatorName} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-medium px-2 py-1 bg-surface-container rounded-lg text-on-secondary-container">{ticket.departmentName}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${statusInfo.bgClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}></span>
                          {statusInfo.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-lg ${priorityInfo.color}`}>{priorityInfo.icon}</span>
                        <span className={`text-xs font-bold uppercase ${priorityInfo.color}`}>{priorityInfo.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAction(ticket);
                        }}
                        className="p-2 hover:bg-primary/10 rounded-lg text-on-surface-variant hover:text-primary transition-all"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <TicketActionModal 
        key={selectedTicket?.id || 'new'}
        isOpen={actionModalOpen} 
        onClose={() => setActionModalOpen(false)} 
        ticket={selectedTicket} 
      />
    </div>
  );
};

export default TicketQueue;
