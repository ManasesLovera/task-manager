# AI Agent Guidelines - TaskManager

## Project Overview
Internal ticketing system for managing support requests across organizational departments.

## Tech Stack
- **Backend**: .NET 10, PostgreSQL 17, Entity Framework Core, ASP.NET Core Identity.
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query.

## Architecture & Structure
- `backend/TaskManager.Api`: Entry point, controllers, and middleware.
- `backend/TaskManager.Core`: Domain entities, enums, and business interfaces.
- `backend/TaskManager.Infrastructure`: Persistence (EF Core), Identity, and service implementations.
- `backend/TaskManager.Tests`: Unit and integration tests.
- `frontend/`: React application.

## Domain Entities
- **ApplicationUser**: Extends `IdentityUser`. Roles: `Admin`, `Technician`, `Member`.
- **Department**: Organizational units with a unique `Code`.
- **Ticket**: Support request linked to a `Department`, `Creator` (User), and `Technician` (User). Statuses: `Open`, `Pending`, `Resolved`.

## Workflow Conventions
- **Git Commits**: Use only `feat:`, `fix:`, or `chore:`.
- **GitHub**: Always use the GitHub CLI (`gh`) for creating pull requests and managing issues.
- **Verification**: 
  - Backend: `dotnet build` and `dotnet test`.
  - Frontend: Check `package.json` for test/build scripts.

## Critical Gotchas
- Ensure any changes to the database schema are reflected in EF Core migrations.
- When seeding data, check `DbInitializer.cs` in `TaskManager.Infrastructure`.
