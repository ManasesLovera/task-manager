import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import { useToastStore } from '../../stores/toastStore';
import type { DepartmentResponse, CreateTicketRequest } from '../../api/types';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  const { data: departments, isLoading: isLoadingDepts } = useQuery({
    queryKey: ['departments'],
    queryFn: () => apiClient.get<DepartmentResponse[]>('/Departments'),
    enabled: isOpen,
  });

  const createTicketMutation = useMutation({
    mutationFn: (newTicket: CreateTicketRequest) => 
      apiClient.post<void>('/Tickets', newTicket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      addToast('Ticket created successfully!', 'success');
      setTitle('');
      setDescription('');
      setDepartmentId('');
      setError(null);
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to create ticket');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !departmentId) {
      setError('Please fill in all fields');
      return;
    }
    if (title.length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }
    if (description.length < 10) {
      setError('Description must be at least 10 characters');
      return;
    }
    createTicketMutation.mutate({ title, description, departmentId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
          <h2 className="text-xl font-bold font-headline text-on-surface">Create New Ticket</h2>
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
            <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
              placeholder="Min 5 characters"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="department" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Department
            </label>
            <div className="relative">
              <select
                id="department"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface appearance-none"
                disabled={isLoadingDepts}
              >
                <option value="">Select a department</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                expand_more
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface resize-none"
              placeholder="Min 10 characters..."
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
              disabled={createTicketMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-1px] transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
            >
              {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;
