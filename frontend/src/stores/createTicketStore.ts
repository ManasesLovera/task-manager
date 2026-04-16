import { create } from 'zustand';

interface CreateTicketModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCreateTicketModal = create<CreateTicketModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
