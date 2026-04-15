import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import DashboardView from './Dashboard';
import { useAuthStore } from '../../stores/authStore';

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

  it('renders greeting with users first name', () => {
    render(<DashboardView />);
    expect(screen.getByText(/Good morning, Alex./i)).toBeInTheDocument();
  });

  it('displays critical metrics from the design', () => {
    render(<DashboardView />);
    
    // Check for specific design stats
    expect(screen.getByText('Resolution Velocity')).toBeInTheDocument();
    expect(screen.getByText('2.4')).toBeInTheDocument();
    expect(screen.getByText('CSAT Score')).toBeInTheDocument();
    expect(screen.getByText('98.2%')).toBeInTheDocument();
  });

  it('shows the action button to create new tickets', () => {
    render(<DashboardView />);
    expect(screen.getByRole('button', { name: /Create New Ticket/i })).toBeInTheDocument();
  });
});
