# Task Manager API Documentation

## Base URL
`http://localhost:5000/api` (or your local port)

## Authentication
Most endpoints require a JWT token in the `Authorization` header:
`Authorization: Bearer <token>`

### Roles
- `Admin`: Full access to users, departments, and tickets.
- `Technician`: Access to all tickets, can update status and resolve them.
- `Member`: Can create tickets and view only their own.

---

## Auth Endpoints
**Route:** `/api/Auth`

### Register
- **Endpoint:** `POST /api/Auth/register`
- **Role:** Public
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "fullName": "John Doe"
  }
  ```
- **Response (200 OK):** `AuthResponse`

### Login
- **Endpoint:** `POST /api/Auth/login`
- **Role:** Public
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK):** `AuthResponse`

### Get My Profile
- **Endpoint:** `GET /api/Auth/me`
- **Role:** Authenticated
- **Response (200 OK):** `UserResponse`

---

## User Management
**Route:** `/api/Users`
**Authorization:** `Admin` role required for all.

### Get All Users
- **Endpoint:** `GET /api/Users`
- **Response (200 OK):** `IEnumerable<UserResponse>`

### Get User by ID
- **Endpoint:** `GET /api/Users/{id}`
- **Response (200 OK):** `UserResponse`

### Update User Role
- **Endpoint:** `PATCH /api/Users/{id}/role`
- **Request Body:**
  ```json
  {
    "role": "Technician" // Admin, Technician, Member
  }
  ```

### Toggle User Status
- **Endpoint:** `PATCH /api/Users/{id}/toggle-status`
- **Description:** Enables or disables a user.

---

## Department Management
**Route:** `/api/Departments`

### Get All Departments
- **Endpoint:** `GET /api/Departments`
- **Role:** Authenticated
- **Response (200 OK):** `IEnumerable<DepartmentResponse>`

### Create Department
- **Endpoint:** `POST /api/Departments`
- **Role:** `Admin`
- **Request Body:**
  ```json
  {
    "name": "Human Resources",
    "code": "HR"
  }
  ```

### Delete Department
- **Endpoint:** `DELETE /api/Departments/{id}`
- **Role:** `Admin`
- **Note:** Fails if department has associated tickets.

---

## Ticket Management
**Route:** `/api/Tickets`

### Get Tickets
- **Endpoint:** `GET /api/Tickets`
- **Role:** Authenticated
- **Filtering (Query Params):**
  - `departmentId`: Guid (Optional)
  - `status`: int (Optional - 0: Open, 1: Pending, 2: Resolved)
- **Behavior:**
  - `Member`: Returns only tickets created by them.
  - `Admin/Technician`: Returns all tickets.
- **Response (200 OK):** `IEnumerable<TicketResponse>`

### Get Ticket by ID
- **Endpoint:** `GET /api/Tickets/{id}`
- **Role:** Authenticated (Owner or Tech/Admin)
- **Response (200 OK):** `TicketResponse`

### Create Ticket
- **Endpoint:** `POST /api/Tickets`
- **Role:** Authenticated
- **Request Body:**
  ```json
  {
    "title": "Printer not working",
    "description": "The printer in room 404 is showing an error code E12.",
    "departmentId": "guid-here"
  }
  ```

### Update Ticket Status
- **Endpoint:** `PATCH /api/Tickets/{id}/status`
- **Role:** `Admin`, `Technician`
- **Request Body:**
  ```json
  {
    "status": 1 // 0: Open, 1: Pending, 2: Resolved
  }
  ```

### Resolve Ticket
- **Endpoint:** `PATCH /api/Tickets/{id}/resolve`
- **Role:** `Admin`, `Technician`
- **Request Body:**
  ```json
  {
    "solutionDescription": "Replaced the toner cartridge and restarted the printer."
  }
  ```

---

## Shared Models

### AuthResponse
```json
{
  "token": "string",
  "expiration": "datetime",
  "user": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "role": "string",
    "isActive": "bool"
  }
}
```

### UserResponse
```json
{
  "id": "string",
  "email": "string",
  "fullName": "string",
  "role": "string",
  "isActive": "bool"
}
```

### DepartmentResponse
```json
{
  "id": "guid",
  "name": "string",
  "code": "string"
}
```

### TicketResponse
```json
{
  "id": "guid",
  "title": "string",
  "description": "string",
  "departmentId": "guid",
  "departmentName": "string",
  "creatorId": "string",
  "creatorName": "string",
  "status": "int", // 0, 1, 2
  "createdAt": "datetime",
  "solutionDescription": "string?",
  "technicianId": "string?",
  "technicianName": "string?",
  "resolvedAt": "datetime?"
}
```
