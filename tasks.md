# Project Tasks

This document outlines the tasks for the TaskManager system, including backend implementation and frontend UI/UX improvements.

## Phase 1: Minimal Working Backend (Fastest Path) - COMPLETED
## Phase 2: Refactoring & Best Practices - IN PROGRESS
## Phase 3: UI/UX & Functional Polish - UPDATED

### Authentication & Header
- [ ] Fix eye button in login.
- [ ] Replace all occurrences of "Indigo Slate" with "Task Manager".
- [ ] Improve visibility of username and role next to person icon.
- [ ] Remove notifications and settings symbols in header.
- [ ] Implement dropdown menu on user icon:
    - [ ] Link to Help Center.
    - [ ] Logout functionality.

### Dashboard & Navigation
- [ ] In dashboard, remove 'TaskManager' subtitle and search component.
- [ ] Remove 'New Ticket' from sidebar (should only be in Dashboard and Ticket view).
- [ ] Remove 'Queue' field in sidebar.
- [ ] Implement Advanced Filters (Department and Priority).

### Ticket Management
- [ ] Implement 'Create New Ticket' modal:
    - [ ] Fields: Title, Description, Department, Priority.
- [ ] Ticket Actions (3 dots):
    - [ ] Make logo always visible (not just on hover).
    - [ ] Implement click action to show Modal: Update Title/Description, Delete ticket (Creator only).
    - [ ] "Update Ticket" option for Admin/Tech (Status, Priority, Solution).
- [ ] Ticket Detail/Interaction:
    - [ ] Allow Technicians to click a ticket and submit a solution.
    - [ ] Allow Admin/Tech to change Status and Priority.
- [ ] Remove CSAT score.
- [ ] **Resolution Velocity** (Admin only, conditional rendering).

### User Management (Admin Only)
- [ ] Implement Create User functionality (Modal):
    - [ ] Name, Role, Email, Password.
- [ ] Implement Update User (3 dots actions):
    - [ ] Update Full Name, Role, Status, and Password.

### Analytics
- [ ] **Analytics View**:
    - [ ] Filtering by date range.
    - [ ] Technician performance metrics.
