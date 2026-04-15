# API Documentation

## Base URL
`http://localhost:<<portport>/api`

## Authentication
Most endpoints require a JWT token in the `Authorization` header:
`Authorization: Bearer <<tokentoken>`

---

## Health Controller
**Route:** `/api/Health`

### Get Health
- **Endpoint:** `GET /api/Health`
- **Description:** Returns the health status and version of the API.
- **Response:** `200 OK`
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
- **Request Body:** `RegisterRequestDto`
- **Response:** `200 OK` (returns token and user details) or `400 BadRequest`.

### Login
- **Endpoint:** `POST /api/Auth/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:** `LoginRequestDto`
- **Response:** `200 OK` (returns token and user details) or `401 Unauthorized`.

---

## Users Controller
**Route:** `/api/Users`
**Authorization:** `Admin` role required.

### Get All Users
- **Endpoint:** `GET /api/Users`
- **Description:** Retrieves a list of all users.
- **Response:** `200 OK` (list of `UserDto`).

### Get User by ID
- **Endpoint:** `GET /api/Users/{id}`
- **Description:** Retrieves details of a specific user.
- **Response:** `200 OK` (`UserDto`) or `404 NotFound`.

### Update User Role
- **Endpoint:** `PATCH /api/Users/{id}/role`
- **Description:** Updates the role of a specific user.
- **Request Body:** `UpdateUserRoleDto`
- **Response:** `204 NoContent` or `404 NotFound`.

### Toggle User Status
- **Endpoint:** `PATCH /api/Users/{id}/toggle-status`
- **Description:** Toggles the active status of a user.
- **Response:** `204 NoContent` or `404 NotFound`.
