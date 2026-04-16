import { create } from 'zustand';

interface CreateDepartmentModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCreateDepartmentModal = create<CreateDepartmentModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
