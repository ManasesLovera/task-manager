# API Documentation

## Base URL
`http://localhost:<<port>>/api`

## Authentication
Most endpoints require a JWT token in the `Authorization` header:
`Authorization: Bearer <token>`

---

## Health Controller
**Route:** `/api/Health`

### Get Health
- **Endpoint:** `GET /api/Health`
- **Description:** Returns the health status and version of the API.
- **Response:**
  - `200 OK`
    ```json
    {
      "status": "Healthy",
      "version": "0.5.0"
    }
    ```

---

## Auth Controller
**Route:** `/api/Auth`

### Register
- **Endpoint:** `POST /api/Auth/register`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "fullName": "John Doe"
  }
  ```
- **Responses:**
  - `200 OK`
    ```json
    {
      "token": "eyJhbG...",
      "expiration": "2026-04-15T12:00:00Z",
      "user": {
        "id": "guid-123",
        "email": "user@example.com",
        "fullName": "John Doe",
        "role": "Member",
        "isActive": true
      }
    }
    ```
  - `400 Bad Request` (Invalid input or identity errors)

### Login
- **Endpoint:** `POST /api/Auth/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  }
  ```
- **Responses:**
  - `200 OK`
    ```json
    {
      "token": "eyJhbG...",
      "expiration": "2026-04-15T12:00:00Z",
      "user": {
        "id": "guid-123",
        "email": "user@example.com",
        "fullName": "John Doe",
        "role": "Member",
        "isActive": true
      }
    }
    ```
  - `401 Unauthorized` (Invalid credentials or inactive account)

---

## Users Controller
**Route:** `/api/Users`
**Authorization:** `Admin` role required.

### Get All Users
- **Endpoint:** `GET /api/Users`
- **Description:** Retrieves a list of all users.
- **Response:**
  - `200 OK`
    ```json
    [
      {
        "id": "guid-123",
        "email": "user@example.com",
        "fullName": "John Doe",
        "role": "Member",
        "isActive": true
      }
    ]
    ```

### Get User by ID
- **Endpoint:** `GET /api/Users/{id}`
- **Description:** Retrieves details of a specific user.
- **Response:**
  - `200 OK`
    ```json
    {
      "id": "guid-123",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "Member",
      "isActive": true
    }
    ```
  - `404 Not Found`

### Update User Role
- **Endpoint:** `PATCH /api/Users/{id}/role`
- **Description:** Updates the role of a specific user.
- **Request Body:**
  ```json
  {
    "role": "Admin"
  }
  ```
- **Response:**
  - `204 No Content`
  - `404 Not Found`

### Toggle User Status
- **Endpoint:** `PATCH /api/Users/{id}/toggle-status`
- **Description:** Toggles the active status of a user.
- **Response:**
  - `204 No Content`
  - `404 Not Found`
