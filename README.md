# TaskManager

A comprehensive internal ticketing system designed to manage support requests across organizational departments. This solution enables users to submit tickets and technicians to document resolutions within a secure, scalable architecture.

## Architecture Overview

TaskManager follows Clean Architecture principles with a decoupled frontend and backend:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
│                    React 19 + TypeScript                         │
│                  (Vite, Tailwind, Zustand)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Backend                                  │
│                      .NET 10 (C# 14)                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      API Layer                            │   │
│  │              (Controllers, DTOs, Scalar)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Infrastructure                          │   │
│  │         (Persistence, Identity, External Services)        │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                       Core                                │   │
│  │         (Entities, Value Objects, Domain Services)        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Entity Framework Core
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Database                                  │
│                      PostgreSQL 17                               │
└─────────────────────────────────────────────────────────────────┘
```

### Backend Layers

| Layer | Responsibility |
|-------|----------------|
| **Core** | Domain entities, business logic, and interfaces. No external dependencies. |
| **Infrastructure** | Data persistence, authentication (.NET Identity), and external service implementations. |
| **API** | RESTful endpoints, request/response DTOs, and API documentation (Scalar). |

### Frontend Architecture

The React application communicates with the backend via REST APIs. State management is handled through Zustand, while server state caching and synchronization leverage TanStack Query.

## Database Schema

### Entity Relationships

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │ Department  │       │    Ticket   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ Id          │       │ Id          │       │ Id          │
│ Username    │       │ Name        │       │ Title       │
│ Email       │       │ Code        │       │ Description │
│ DepartmentId│──────▶│             │◀──────│ DepartmentId│
│ Role        │       │             │       │ CreatorId   │
└─────────────┘       └─────────────┘       │ Status      │
                                            │ CreatedAt   │
                                            └──────┬──────┘
                                                   │
                                                   │ 1:1
                                                   ▼
                                            ┌─────────────┐
                                            │  Solution   │
                                            ├─────────────┤
                                            │ Id          │
                                            │ TicketId    │
                                            │ TechnicianId│
                                            │ Description │
                                            │ ResolvedAt  │
                                            └─────────────┘
```

### Entities

| Entity | Description |
|--------|-------------|
| **User** | System users with role assignments (Admin, Technician, User) and department affiliation. |
| **Department** | Organizational units (HR, Accounting, Treasury, Marketing, Logistics, Technology). |
| **Ticket** | Support requests created by users, assigned to departments, with status tracking (Open, Pending, Resolved). |
| **Solution** | Resolution documentation linked 1:1 to tickets, authored by technicians. |

## Environment Setup

### Prerequisites

- .NET 10 SDK
- Node.js 20+
- Docker and Docker Compose
- PostgreSQL 17 (or Docker)

### Backend Configuration

Configure development secrets using .NET user-secrets:

```bash
cd backend

# Initialize secrets (if not already initialized)
dotnet user-secrets init

# Configure connection string
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=taskmanager;Username=postgres;Password=postgres"

# Configure JWT settings
dotnet user-secrets set "JwtSettings:SecretKey" "your-secret-key-here"
dotnet user-secrets set "JwtSettings:Issuer" "TaskManager"
dotnet user-secrets set "JwtSettings:Audience" "TaskManager"
```

### Frontend Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Full Stack

Start all services using Docker Compose from the project root:

```bash
docker-compose up --build
```

This command orchestrates:
- PostgreSQL 17 database
- .NET 10 backend API
- React 19 frontend application

To run in detached mode:

```bash
docker-compose up -d
```

## API Documentation

The backend API includes interactive documentation powered by Scalar. Access the documentation at:

```
http://localhost:5000/scalar/v1
```

Scalar provides an interactive interface for exploring endpoints, request/response schemas, and testing API calls directly.

## Deployment

### Azure Container Apps

The application targets Azure Container Apps for production deployment. The containerized architecture enables:

- **Backend Deployment**: Containerized .NET 10 API deployed to Azure Container Apps with auto-scaling.
- **Frontend Deployment**: Static React build served via a lightweight container or Azure Static Web Apps.
- **Database Connectivity**: Managed Identity authentication for secure PostgreSQL connections without credential management.
- **Networking**: Internal VNet integration for secure communication between services.

### Deployment Workflow

1. Build and tag Docker images for backend and frontend.
2. Push images to Azure Container Registry.
3. Deploy to Azure Container Apps using Managed Identities for database authentication.
4. Configure environment variables and secrets through Azure Key Vault integration.

## Project Structure

```
task-manager/
├── backend/                    # .NET 10 solution
│   ├── TaskManager.sln
│   ├── src/
│   │   ├── TaskManager.Core/          # Domain layer
│   │   ├── TaskManager.Infrastructure/ # Persistence & Identity
│   │   └── TaskManager.Api/           # API endpoints
│   └── tests/
│       └── TaskManager.Tests/         # Unit and integration tests
├── frontend/                   # React 19 application
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
├── docker-compose.yml          # Multi-container orchestration
└── README.md                   # This file
```

## License

This project is developed for educational purposes as part of university coursework.
