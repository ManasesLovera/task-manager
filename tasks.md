# Project Tasks

This document outlines the tasks for the TaskManager system, including backend implementation and frontend UI/UX improvements.

## Phase 1: Minimal Working Backend (Fastest Path) - COMPLETED
Goal: Get the API running with essential CRUDs and Authentication.

### 1. Project Infrastructure Setup
- [x] Install NuGet Packages.
- [x] Configure `appsettings.json` with PostgreSQL connection string.
- [x] Register `DbContext` and Identity services in `Program.cs`.
- [x] **CORS**: Enable permissive policy for frontend development.

### 2. Entity Definitions (Domain Models)
Define the following entities in `TaskManager.Core`:
- [x] **Department**: `Id`, `Name`, `Code`.
- [x] **User**: `Id`, `FullName`, `Role`, `IsActive`.
- [x] **Ticket**: `Id`, `Title`, `Description`, `DepartmentId`, `CreatorId`, `Status`, `CreatedAt`, `SolutionDescription`, `TechnicianId`, `ResolvedAt`.
- [x] **Navigation Properties**: Added to `Ticket` for better API responses.

### 3. Authentication & Identity Setup
- [x] Implement JWT Token generation logic (with Claims for Role).
- [x] **Auth Endpoints**:
  - [x] `POST /api/auth/register`: Public registration (defaults to 'Member' role).
  - [x] `POST /api/auth/login`: Returns JWT token and basic user info.
  - [x] `GET /api/auth/me`: Returns current user details based on token.
- [x] **User Management (Admin Only)**:
  - [x] `GET /api/users`: List all users.
  - [x] `PATCH /api/users/{id}/toggle-status`: Enable or disable a user account.
  - [x] `PATCH /api/users/{id}/role`: Change a user's role.

### 4. Core CRUD Operations
#### Departments
- [x] `GET /api/departments`: List all (Available to all authenticated users).
- [x] `POST /api/departments`: Create a new department (Admin only).
- [x] `DELETE /api/departments/{id}`: Remove a department (Admin only, safety check for tickets).

#### Tickets
- [x] `POST /api/tickets`: Create a new ticket (Any authenticated user).
- [x] `GET /api/tickets`: 
  - **Member**: List only their own created tickets.
  - **Technician/Admin**: List all tickets with filtering support.
- [x] `GET /api/tickets/{id}`: View ticket details (Access control enforced).
- [x] `PATCH /api/tickets/{id}/status`: Update status (Technician/Admin).
- [x] `PATCH /api/tickets/{id}/resolve`: Add a solution and mark as Resolved (Technician/Admin).

---

## Phase 2: Refactoring & Best Practices - IN PROGRESS
Goal: Align with Clean Architecture and enhance maintainability.

### 1. Folder Structure & DTOs
- [x] **DTO Refactoring**:
  - [x] Removed "Dto" suffix from classes and filenames.
  - [x] Ensured one class per file.
  - [x] Organized into entity-specific folders.
- [ ] **Domain Layer (Optional Refinement)**:
  - Move Entities to `Domain/Entities`.
  - Add `Domain/Interfaces` for Repositories.

### 2. Advanced Features
- [x] **Global Error Handling**: Middleware implemented for consistent JSON responses.
- [ ] **Validation**: Implement FluentValidation for request models.
- [ ] **Logging**: Configure Serilog.
- [x] **OpenAPI**: Enhanced documentation in `API_DOC.md`.

### 3. Testing
- [x] **Unit Tests**: Existing tests updated to new DTO naming.
- [x] **Integration Tests**: Existing tests updated.
- [ ] **New Tests**: Add specific tests for Ticket filtering and resolution logic.

---

## Phase 3: UI/UX & Functional Polish
Goal: Fix identified issues and implement missing features.

### Authentication & Header
- [ ] Fix eye button in login (currently does not work).
- [ ] Replace all occurrences of "Indigo Slate" with "Task Manager".
- [ ] Improve visibility of username and role next to person icon (currently dark letters on dark background).
- [ ] Remove notifications symbol in header.

### Dashboard & Navigation
- [ ] In dashboard, remove 'TaskManager' subtitle and search component.
- [ ] Remove 'New Ticket' from sidebar (should only be in Dashboard and Ticket view).
- [ ] Remove 'Queue' field in sidebar (this view won't be implemented).
- [ ] Add Help Center View (clicks should navigate to a guide on how to use the app).

### Ticket Management
- [ ] Implement 'Create New Ticket' functionality (show modal with ticket fields per design).
- [ ] Remove CSAT score.
- [ ] **Resolution Velocity**:
  - Create a new endpoint with average resolution time for all tickets.
  - Logic: If no tickets, don't show the component.
  - Access: Only show to Admin roles.

### Analytics & User Management
- [ ] **Analytics View**:
  - Create controller with valuable information.
  - Filtering by date range.
  - Show ticket duration/resolution time.
  - Technician performance (tickets resolved per range date).
- [ ] Remove 'Add New User' button.
