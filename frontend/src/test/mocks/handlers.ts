import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:5000/api'; // Match .env

export const handlers = [
  // Auth Login Mock
  http.post(`${API_URL}/Auth/login`, async ({ request }) => {
    const { email, password } = (await request.json()) as any;

    if (email === 'test@example.com' && password === 'Password123!') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        expiration: '2026-04-15T12:00:00Z',
        user: {
          id: 'mock-id-123',
          email: 'test@example.com',
          fullName: 'Test User',
          role: 'Admin',
          isActive: true,
        },
      });
    }

    return new HttpResponse(
      JSON.stringify({ message: 'Invalid credentials' }),
      { status: 401 }
    );
  }),

  // Add more handlers as needed
];
