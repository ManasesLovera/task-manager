export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Technician' | 'Member';
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  user: UserResponse;
}

export interface DepartmentResponse {
  id: string;
  name: string;
  code: string;
}

export type TicketStatusType = 0 | 1 | 2;

export const TicketStatus = {
  Open: 0 as const,
  Pending: 1 as const,
  Resolved: 2 as const,
};

export interface TicketResponse {
  id: string;
  title: string;
  description: string;
  departmentId: string;
  departmentName: string;
  creatorId: string;
  creatorName: string;
  status: TicketStatusType;
  createdAt: string;
  solutionDescription?: string;
  technicianId?: string;
  technicianName?: string;
  resolvedAt?: string;
}
