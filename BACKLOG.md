# Technical Backlog & Execution Plan

This document tracks the technical implementation of Phase 3 requirements.

## Ticket 1: Global UI Cleanup & Branding
**Branch:** `chore/ui-branding-cleanup`
**Goal:** Remove deprecated components, fix static branding, and clean up the navigation structures.
**Execution Plan:**
1. Global search and replace "Indigo Slate" with "Task Manager" in all frontend files.
2. Update the `Header` component:
   - Remove the notification icon.
3. Update the `Sidebar` navigation:
   - Remove the "Queue" link.
   - Remove the "New Ticket" link (so it only remains accessible from Dashboard/Ticket view).
4. Update the `Dashboard` component:
   - Remove the "TaskManager" subtitle.
   - Remove the search input component.
5. Update `TicketDetail`:
   - Remove the CSAT score component.
6. Update `UserManagement`:
   - Remove the "Add New User" button.

## Ticket 2: Header Profile & Login Form Fixes
**Branch:** `fix/auth-and-header-ui`
**Goal:** Resolve specific usability bugs in the login form and improve text contrast in the header profile section.
**Execution Plan:**
1. Update `Login.tsx`:
   - Inspect the password input field's "eye" toggle logic. Ensure the state toggles between `password` and `text` input types correctly.
2. Update `Header` component (Profile Section):
   - Adjust CSS classes for the username and role text elements next to the avatar. Ensure sufficient contrast against the dark background.

## Ticket 3: Ticket Creation Implementation
**Branch:** `feat/ticket-creation-modal`
**Goal:** Implement the missing functionality to create new tickets via a dedicated UI modal.
**Execution Plan:**
1. Create a `CreateTicketModal.tsx` component.
   - Include fields for Title, Description, and Department selection.
2. Integrate the modal into the `Dashboard` and `TicketQueue` components.
3. Wire the form submission to the existing `POST /api/tickets` backend endpoint.
4. Add success/error handling (toast notifications).

## Ticket 4: Help Center View
**Branch:** `feat/help-center`
**Goal:** Provide a dedicated view containing guidance on how to use the application.
**Execution Plan:**
1. Create a `HelpCenter.tsx` component.
2. Register the route (e.g., `/help`) in `src/router/index.tsx`.
3. Update the Header or Sidebar with a "Help Center" link.

## Ticket 5: Analytics and Resolution Metrics (Full Stack)
**Branch:** `feat/analytics-and-metrics`
**Goal:** Build new API endpoints for ticket metrics and implement the corresponding visual components.
**Execution Plan:**
**Backend:**
1. Create `AnalyticsController.cs`.
2. Implement `GET /api/analytics/resolution-velocity`.
3. Implement `GET /api/analytics/dashboard` with date range filtering.
4. Secure endpoints with `Admin` role.

**Frontend:**
1. Create `Analytics` view with date range pickers and performance charts.
2. Create `ResolutionVelocity` component (Admin only).
3. Integrate into Dashboard/Sidebar.
