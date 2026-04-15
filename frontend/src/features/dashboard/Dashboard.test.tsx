import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import DashboardView from './Dashboard';
import { useAuthStore } from '../../stores/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('DashboardView Usability', () => {
  beforeEach(() => {
    useAuthStore.getState().setAuth(
      {
        id: '1',
        email: 'alex@indigoslate.com',
        fullName: 'Alex Sterling',
        role: 'Admin',
        isActive: true,
      },
      'token'
    );
  });

  it('renders greeting with users first name', async () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <DashboardView />
      </QueryClientProvider>
    );
    expect(await screen.findByText(/Good morning, Alex./i)).toBeInTheDocument();
  });

  it('displays critical metrics from the design', async () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <DashboardView />
      </QueryClientProvider>
    );
    
    // Wait for data to load
    expect(await screen.findByText('Resolution Velocity')).toBeInTheDocument();
    expect(screen.getByText('2.4')).toBeInTheDocument();
    expect(screen.getByText('CSAT Score')).toBeInTheDocument();
    expect(screen.getByText('98.2%')).toBeInTheDocument();
  });

  it('shows the action button to create new tickets', async () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <DashboardView />
      </QueryClientProvider>
    );
    expect(await screen.findByRole('button', { name: /Create New Ticket/i })).toBeInTheDocument();
  });
});
