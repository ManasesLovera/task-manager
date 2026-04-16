# Technical Backlog & Execution Plan

## Ticket 1: Global UI Cleanup & Branding
**Branch:** `chore/ui-branding-cleanup`
**Goal:** Remove deprecated components, fix branding, and improve visibility.
1. Replace "Indigo Slate" with "Task Manager".
2. Remove notification and settings icons from Header.
3. Sidebar: Remove "Queue" and "New Ticket".
4. Dashboard: Remove subtitle and search.
5. Tickets View: Ensure 3-dot action icons are always visible (remove `opacity-0` or hover-only classes).
6. Remove CSAT score.

## Ticket 2: Header Profile & Auth Improvements
**Branch:** `fix/auth-and-header-ui`
**Goal:** Fix login bugs and implement the user profile dropdown.
1. Fix "eye" toggle in `Login.tsx`.
2. Update Header text contrast for profile name/role.
3. Implement Dropdown on profile icon: Help Center link, Logout functionality.

## Ticket 3: Ticket Lifecycle & Interaction (Full Stack)
**Branch:** `feat/ticket-management-v2`
**Goal:** Enable full ticket CRUD and interaction (Creation, Solution, Priority, Deletion).
1. **Creation:** Add "Priority" to Create Ticket Modal/Endpoint.
2. **Detail/Solution:** Enable Technician clicks to open ticket and submit solution.
3. **Actions:** Implement 3-dot click modal for users (Update Title/Desc, Delete) and Admin/Tech (Update Status/Priority/Solution).
4. **Backend:** Ensure endpoints support Priority updates and solution submission for Technicians.

## Ticket 4: Help Center & Filters
**Branch:** `feat/help-and-filters`
**Goal:** Implement Help Center and functional Advanced Filters.
1. Create `HelpCenter.tsx` and route.
2. Implement Advanced Filters logic in `TicketQueue.tsx` (Filter by Dept and Priority).

## Ticket 5: Analytics and Metrics
**Branch:** `feat/analytics-and-metrics`
**Goal:** Metrics and dashboards for Admin.
1. Backend endpoints for velocity and tech performance.
2. Frontend Analytics view and velocity component.

## Ticket 6: Admin User Management
**Branch:** `feat/admin-user-mgmt`
**Goal:** Full User CRUD for Admins.
1. **Create User Modal:** Full name, Role, Email, Password.
2. **Update User Modal (3 dots):** Update name, role, status, and reset password.
