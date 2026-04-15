# TaskManager Frontend 🚀

A high-fidelity, enterprise-grade React frontend for the TaskManager internal ticketing system. Built with **React 19**, **Vite 8**, and **Tailwind CSS 4**, this application provides a seamless experience for managing support requests across organizational departments.

## 🏗 Code Structure

The project follows a **Feature-Based Architecture**, ensuring high scalability and modularity.

```text
src/
├── api/            # Centralized API client, types, and error handling
├── assets/         # Static assets (images, global icons)
├── components/     # Reusable UI components (buttons, inputs, cards)
├── features/       # Feature-specific logic and views
│   ├── auth/       # Login, JWT management, profile
│   ├── dashboard/  # Stats overview and quick actions
│   ├── tickets/    # Queue management and detail views
│   ├── users/      # Team management (Admin only)
│   └── departments/# Corporate structure (Admin only)
├── layouts/        # Layout wrappers (AuthLayout, MainLayout with Sidebar)
├── router/         # React Router v7 configuration and route definitions
├── stores/         # Global state management using Zustand
└── test/           # Test setup, mocks (MSW), and helpers
```

## 🛠 Tech Stack & Patterns

- **Framework**: [React 19](https://react.dev/) utilizing the latest Hooks and experimental features.
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with a custom theme defined in `index.css` using CSS variables.
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/) for lightweight, persistent global state (Auth & User Preferences).
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) for server-state synchronization, caching, and optimistic updates.
- **Routing**: [React Router 7](https://reactrouter.com/) with Protected Routes and Role-Based Access Control (RBAC).
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) with [MSW](https://mswjs.io/) for API mocking.

## 🔑 Business Logic & RBAC

The application implements strict **Role-Based Access Control (RBAC)** aligned with the .NET backend:

- **Admin**: Full access to the "Team" and "Departments" management modules.
- **Technician**: Can view all tickets, update statuses, and provide formal resolutions.
- **Member**: Restricted to creating tickets and viewing their own request history.

**Authentication**: Uses JWT tokens stored in a persistent Zustand store (`auth-storage` in localStorage). Tokens are automatically attached to all `apiClient` requests via an interceptor pattern.

## 📡 API Integration

The frontend communicates with a .NET 10 API. 

- **Base URL**: Configured via `VITE_API_URL` in `.env`.
- **Client**: Custom fetch wrapper in `src/api/apiClient.ts` handling `GET`, `POST`, `PATCH`, and `DELETE`.
- **Types**: All API responses are strictly typed in `src/api/types.ts`.

## ⚙️ Setup & Development

### Prerequisites
- **Node.js**: `v24.x.x`
- **NPM**: `v11.x.x`

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env # Ensure VITE_API_URL points to your backend
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

### Quality Control
- **Build**: `npm run build` (Ensures Type Safety)
- **Test**: `npm test` (Runs Vitest suite)
- **Lint**: `npm run lint` (ESLint with React Refresh)

## 🎨 Design System
The UI is built on the **Indigo Slate** design system, featuring:
- **Tonal Asymmetry**: Unique gradients for depth.
- **Atmospheric Shadows**: Soft, layered box-shadows.
- **Glassmorphism**: High-blur backdrops for modal and panel elements.
- **Material Symbols**: Integrated Google Material Symbols for consistent iconography.
