# Backend Implementation Tasks

This document outlines the steps to build a fully functional backend for the TaskManager system, following the architecture and requirements defined in the root README.

## Phase 1: Minimal Working Backend (Fastest Path)
Goal: Get the API running with essential CRUDs and Authentication.

### 1. Project Infrastructure Setup
- [x] Install NuGet Packages:
  - `Microsoft.EntityFrameworkCore.PostgreSQL`
  - `Microsoft.AspNetCore.Identity.EntityFrameworkCore`
  - `Microsoft.AspNetCore.Authentication.JwtBearer`
- [x] Configure `appsettings.json` with PostgreSQL connection string.
- [x] Register `DbContext` and Identity services in `Program.cs`.

### 2. Entity Definitions (Domain Models)
Define the following entities in `TaskManager.Core`:
- [x] **Department**: `Id` (Guid), `Name` (string), `Code` (string).
- [x] **User** (Extends `IdentityUser`): `Id`, `FullName` (string), `Role` (Enum: Admin, Technician, User), `IsActive` (bool).
- [x] **Ticket**: 
  - `Id` (Guid), `Title` (string), `Description` (string), `DepartmentId` (Guid), `CreatorId` (string/Guid), `Status` (Enum: Open, Pending, Resolved), `CreatedAt` (DateTime).
  - **Solution Fields**: `SolutionDescription` (string?), `TechnicianId` (string?), `ResolvedAt` (DateTime?).

### 3. Authentication & Identity Setup
- [ ] Implement JWT Token generation logic (with Claims for Role).
- [ ] **Auth Endpoints**:
  - `POST /api/auth/register`: Public registration (defaults to 'User' role).
  - `POST /api/auth/login`: Returns JWT token and basic user info.
  - `GET /api/auth/me`: Returns current user details based on token.
- [ ] **User Management (Admin Only)**:
  - `GET /api/users`: List all users with their roles and status.
  - `PATCH /api/users/{id}/toggle-status`: Enable or disable a user account.
  - `PATCH /api/users/{id}/role`: Change a user's role.

### 4. Core CRUD Operations
#### Departments (Admin Only)
- [ ] `GET /api/departments`: List all (Available to all authenticated users for ticket creation).
- [ ] `POST /api/departments`: Create a new department.
- [ ] `DELETE /api/departments/{id}`: Remove a department.

#### Tickets
- [ ] `POST /api/tickets`: Create a new ticket (**User**).
- [ ] `GET /api/tickets`: 
  - **User**: List only their own created tickets.
  - **Technician**: List all tickets in the system (ability to filter by Department and Status != Resolved).
  - **Admin**: List all tickets in the system.
- [ ] `GET /api/tickets/{id}`: View ticket details (including solution if resolved).
- [ ] `PATCH /api/tickets/{id}/status`: Update status (**Technician/Admin**).
- [ ] `PATCH /api/tickets/{id}/resolve`: Add a `SolutionDescription`, set `TechnicianId` and `ResolvedAt`, and mark ticket as `Resolved` (**Technician/Admin**).

---

## Phase 2: Refactoring & Best Practices
Goal: Align with Clean Architecture and enhance maintainability.

### 1. Folder Structure Refinement
- [ ] **TaskManager.Core**:
  - Move Entities to `Domain/Entities`.
  - Add `Domain/Interfaces` for Repositories.
  - Add `Domain/Enums` (TicketStatus, UserRole).
- [ ] **TaskManager.Infrastructure**:
  - Move DbContext to `Persistence`.
  - Implement Repositories in `Repositories/`.
  - Add `Migrations/`.
- [ ] **TaskManager.Api**:
  - Organize `Controllers/`.
  - Create `DTOs/` (Request/Response models).
  - Implement `Mappings/` (AutoMapper or manual).

### 2. Advanced Features
- [ ] **Global Error Handling**: Middleware to catch exceptions and return consistent JSON.
- [ ] **Validation**: Implement FluentValidation for request DTOs.
- [ ] **Logging**: Configure Serilog or standard ILogger.
- [ ] **OpenAPI/Scalar**: Enhance documentation with Security Schemes (Bearer Auth).

### 3. Testing
- [ ] **Unit Tests**: Test business logic and status transitions.
- [ ] **Integration Tests**: Test end-to-end API flows (Auth -> Create Ticket -> Resolve Ticket).

---

## Role Permissions Summary

| Feature | User (Standard) | Technician | Admin |
| :--- | :---: | :---: | :---: |
| Create Tickets | ✅ | ✅ | ✅ |
| View Own Tickets | ✅ | ✅ | ✅ |
| View All Tickets | ❌ | ✅ | ✅ |
| Filter by Dept | ❌ | ✅ | ✅ |
| Add Solutions | ❌ | ✅ | ✅ |
| Manage Departments | ❌ | ❌ | ✅ |
| Manage Users/Roles | ❌ | ❌ | ✅ |
| Disable Users | ❌ | ❌ | ✅ |
