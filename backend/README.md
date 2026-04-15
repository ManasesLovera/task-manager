# Task Manager Backend

A robust task management backend built with .NET 10. This project follows a clean architecture approach, separating domain logic, infrastructure, and the API entry point.

## Project Structure

The project is organized into several key layers:

- **TaskManager.Api/**: The entry point of the application. Contains controllers, middleware, and configuration for the ASP.NET Core Web API.
- **TaskManager.Core/**: The Domain Layer. Contains entities, enums, and business logic interfaces.
- **TaskManager.Infrastructure/**: The Data Layer. Implements data persistence with Entity Framework Core and handles external service integrations.
- **TaskManager.Tests/**: Unit and integration tests to ensure code quality.

## Core Features

- **Authentication & Identity**: Fully integrated with ASP.NET Core Identity. Supports user registration, login, and role-based access control (RBAC).
- **Ticket Management**: Create, assign, and resolve support tickets.
- **Departmental Organization**: Tickets are categorized by departments for efficient routing.
- **Role-Based Workflows**: Support for different user roles (Admin, Technician, User) with specific permissions.

## Domain Model

### Entities
- **ApplicationUser**: Extends `IdentityUser` with additional fields like `FullName`, `Role` (Admin, Technician, User), and `IsActive`.
- **Ticket**: Represents a task or support request, tracking `Status`, `Department`, `Creator`, and assigned `Technician`.
- **Department**: Organizational units (e.g., IT, HR, Maintenance) to which tickets are assigned.

### Enums
- **TicketStatus**: `Open`, `Pending`, `Resolved`.
- **UserRole**: `Admin`, `Technician`, `User`.

## Tech Stack

- **Framework**: .NET 10 (ASP.NET Core)
- **Database**: PostgreSQL
- **ORM**: Entity Framework Core
- **Auth**: ASP.NET Core Identity (API Endpoints)
- **Documentation**: OpenAPI (Scalar/Swagger)

## Setup & Prerequisites

### Required Tools

- **.NET 10 SDK**: [Download .NET 10](https://dotnet.microsoft.com/download/dotnet/10.0)
- **PostgreSQL**: A running instance of PostgreSQL.
- **Docker** (Optional): For containerized execution.

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>/backend
    ```

2.  **Configuration**:
    Update `TaskManager.Api/appsettings.json` or use user-secrets to set your PostgreSQL connection string:
    ```json
    "ConnectionStrings": {
      "DefaultConnection": "Host=localhost;Database=taskmanager;Username=postgres;Password=yourpassword"
    }
    ```

3.  **Database Migrations**:
    Generate and apply migrations using the .NET EF tool:
    ```bash
    # Install tool if not already present
    dotnet tool install --global dotnet-ef

    # Add initial migration
    dotnet ef migrations add InitialCreate --project TaskManager.Infrastructure --startup-project TaskManager.Api

    # Apply to database
    dotnet ef database update --project TaskManager.Infrastructure --startup-project TaskManager.Api
    ```

## How to Run

### Using .NET CLI

From the `backend` directory:
```bash
dotnet run --project TaskManager.Api
```

Access the API documentation at `https://localhost:<port>/openapi/v1.json` or through the interactive UI.

### Using Docker

1.  **Build**:
    ```bash
    docker build -t taskmanager-backend .
    ```

2.  **Run**:
    ```bash
    docker run -it --rm -p 8080:8080 -e "ConnectionStrings__DefaultConnection=Host=host.docker.internal;..." taskmanager-backend
    ```

## License

This project is licensed under the MIT License.
