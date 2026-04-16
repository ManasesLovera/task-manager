export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Technician' | 'Member';
  isActive: boolean;
}

export interface CreateUserRequest {
  email: string;
  fullName: string;
  role: 'Admin' | 'Technician' | 'Member';
  password?: string;
}

export interface UpdateUserRequest {
  fullName: string;
  role: 'Admin' | 'Technician' | 'Member';
  isActive: boolean;
}

export interface ResetPasswordRequest {
  newPassword: string;
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

export type TicketPriorityType = 0 | 1 | 2;

export const TicketPriority = {
  Low: 0 as const,
  Medium: 1 as const,
  High: 2 as const,
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
  priority: TicketPriorityType;
  createdAt: string;
  solutionDescription?: string;
  technicianId?: string;
  technicianName?: string;
  resolvedAt?: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  departmentId: string;
  priority: TicketPriorityType;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  departmentId?: string;
  status?: TicketStatusType;
  priority?: TicketPriorityType;
  solutionDescription?: string;
}

export interface CreateDepartmentRequest {
  name: string;
  code: string;
}

export interface ResolutionVelocityResponse {
  averageResolutionTimeHours: number;
}

export interface TechnicianPerformance {
  technicianId: string;
  technicianName: string;
  resolvedTicketsCount: number;
}

export interface DashboardAnalyticsResponse {
  technicianPerformances: TechnicianPerformance[];
}
