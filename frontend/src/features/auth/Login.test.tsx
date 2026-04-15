import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginView from './Login';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <LoginView />
    </BrowserRouter>
  );
};

describe('LoginView Usability & Design', () => {
  it('renders all design elements correctly', () => {
    renderLogin();
    
    // Check for branding
    expect(screen.getByText('Indigo Slate')).toBeInTheDocument();
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
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
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
