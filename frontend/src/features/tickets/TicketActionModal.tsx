import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import { useToastStore } from '../../stores/toastStore';
import { useAuthStore } from '../../stores/authStore';
import { TicketStatus, TicketPriority } from '../../api/types';
import type { 
  TicketResponse, 
  UpdateTicketRequest, 
  TicketStatusType, 
  TicketPriorityType,
  DepartmentResponse 
} from '../../api/types';

interface TicketActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketResponse | null;
}

const TicketActionModal: React.FC<TicketActionModalProps> = ({ isOpen, onClose, ticket }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  // Form State initialized from ticket directly when possible
  const [title, setTitle] = useState(ticket?.title || '');
  const [description, setDescription] = useState(ticket?.description || '');
  const [departmentId, setDepartmentId] = useState(ticket?.departmentId || '');
  const [status, setStatus] = useState<TicketStatusType>(ticket?.status ?? TicketStatus.Open);
  const [priority, setPriority] = useState<TicketPriorityType>(ticket?.priority ?? TicketPriority.Medium);
  const [solutionDescription, setSolutionDescription] = useState(ticket?.solutionDescription || '');
  const [error, setError] = useState<string | null>(null);

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => apiClient.get<DepartmentResponse[]>('/Departments'),
    enabled: isOpen,
  });

  // Sync state with ticket when it changes (e.g. when modal opens with new ticket)
  useEffect(() => {
    if (ticket && isOpen) {
      setTitle(ticket.title);
      setDescription(ticket.description);
      setDepartmentId(ticket.departmentId);
      setStatus(ticket.status);
      setPriority(ticket.priority);
      setSolutionDescription(ticket.solutionDescription || '');
      setError(null);
    }
  }, [ticket, isOpen]);

  const updateMutation = useMutation({
    mutationFn: (update: UpdateTicketRequest) => 
      apiClient.put(`/Tickets/${ticket?.id}`, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      addToast('Ticket updated successfully', 'success');
      onClose();
    },
    onError: (err: Error) => setError(err.message || 'Update failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete(`/Tickets/${ticket?.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      addToast('Ticket deleted successfully', 'success');
      onClose();
    },
    onError: (err: Error) => setError(err.message || 'Delete failed'),
  });

  if (!isOpen || !ticket || !user) return null;

  const isCreator = user.id === ticket.creatorId;
  const isTechOrAdmin = user.role === 'Technician' || user.role === 'Admin';
  const isOpenStatus = ticket.status === TicketStatus.Open;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const update: UpdateTicketRequest = {};
    
    if (isCreator && isOpenStatus) {
      update.title = title;
      update.description = description;
      update.departmentId = departmentId;
    }

    if (isTechOrAdmin) {
      update.status = status;
      update.priority = priority;
      if (solutionDescription) update.solutionDescription = solutionDescription;
    }

    updateMutation.mutate(update);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
          <div>
            <h2 className="text-xl font-bold font-headline text-on-surface">Manage Ticket</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-1">#TK-{ticket.id.substring(0, 8)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-error-container text-on-error-container text-sm rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          {/* Creator View: Edit Title/Desc/Dept if Open */}
          {isCreator && isOpenStatus ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Department</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                >
                  {departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-surface-container border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium resize-none"
                />
              </div>
            </div>
          ) : (
            /* Read-only view for Creators if not Open, or for others if they are not editing metadata */
            <div className="bg-surface-container-low p-4 rounded-xl space-y-2 border border-outline-variant/5">
               <h3 className="font-bold text-on-surface">{ticket.title}</h3>
               <p className="text-sm text-on-surface-variant leading-relaxed">{ticket.description}</p>
            </div>
          )}

          {/* Technician/Admin View: Status/Priority/Solution */}
          {isTechOrAdmin && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-primary">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(Number(e.target.value) as TicketStatusType)}
                  className="w-full px-4 py-2 bg-primary-container/20 border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-primary"
                >
                  <option value={TicketStatus.Open}>Open</option>
                  <option value={TicketStatus.Pending}>Pending</option>
                  <option value={TicketStatus.Resolved}>Resolved</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-primary">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value) as TicketPriorityType)}
                  className="w-full px-4 py-2 bg-primary-container/20 border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-primary"
                >
                  <option value={TicketPriority.Low}>Low</option>
                  <option value={TicketPriority.Medium}>Medium</option>
                  <option value={TicketPriority.High}>High</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-primary">Solution Description</label>
                <textarea
                  value={solutionDescription}
                  onChange={(e) => setSolutionDescription(e.target.value)}
                  placeholder="Describe how the issue was addressed..."
                  rows={3}
                  className="w-full px-4 py-2 bg-primary-container/20 border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium resize-none placeholder:text-primary/40"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {(isCreator && isOpenStatus) || (user.role === 'Admin') ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 text-error font-bold text-sm hover:bg-error/10 rounded-xl transition-colors"
              >
                Delete Ticket
              </button>
            ) : null}
            <div className="flex-grow"></div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-on-surface-variant font-bold text-sm hover:bg-surface-container rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketActionModal;
