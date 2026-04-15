import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginView from './Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderLogin = () => {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <BrowserRouter>
        <LoginView />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('LoginView Usability & Design', () => {
  it('renders all design elements correctly', async () => {
    renderLogin();
    
    // Check for branding
    expect(await screen.findByText('Indigo Slate')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByLabelText(/Email or Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('shows error message on failed login', async () => {
    renderLogin();
    
    fireEvent.change(screen.getByLabelText(/Email or Username/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpass' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  it('navigates to dashboard on successful login', async () => {
    renderLogin();
    
    fireEvent.change(screen.getByLabelText(/Email or Username/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'Password123!' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('disables button while loading', async () => {
    renderLogin();
    
    fireEvent.change(screen.getByLabelText(/Email or Username/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'Password123!' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    expect(screen.getByRole('button', { name: /Signing In.../i })).toBeDisabled();
  });
});
