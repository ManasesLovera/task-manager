import { describe, it, expect, beforeEach } from 'vitest';
import { apiClient } from './apiClient';
import { useAuthStore } from '../stores/authStore';

import type { AuthResponse } from './types';

describe('apiClient', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('should include Authorization header when token is present', () => {
    useAuthStore.getState().setAuth(
      { id: '1', email: 't@t.com', fullName: 'T', role: 'Admin', isActive: true },
      'valid-token'
    );

    const headers = apiClient.getHeaders() as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer valid-token');
  });

  it('should not include Authorization header when token is absent', () => {
    const headers = apiClient.getHeaders() as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });

  it('should successfully post login data', async () => {
    const data = await apiClient.post<AuthResponse>('/Auth/login', {
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(data.token).toBe('mock-jwt-token');
    expect(data.user.email).toBe('test@example.com');
  });

  it('should throw error on invalid credentials', async () => {
    await expect(apiClient.post('/Auth/login', {
      email: 'wrong@example.com',
      password: 'wrong',
    })).rejects.toThrow('Invalid credentials');
  });
});
