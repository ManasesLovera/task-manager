import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:5294/api'; // Match .env

export const handlers = [
  // Auth Login Mock
  http.post(`${API_URL}/Auth/login`, async ({ request }) => {
    const { email, password } = (await request.json()) as Record<string, string>;

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

  // Tickets Mock
  http.get(`${API_URL}/Tickets`, () => {
    return HttpResponse.json([
      {
        id: 'ticket-1',
        title: 'Mock Ticket 1',
        description: 'Description 1',
        departmentId: 'dept-1',
        departmentName: 'IT',
        creatorId: 'user-1',
        creatorName: 'John Doe',
        status: 0, // Open
        createdAt: new Date().toISOString(),
      },
    ]);
  }),

  // Add more handlers as needed
];
