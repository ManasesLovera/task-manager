# Task Manager Backend

A robust task management backend built with .NET 10. This project follows a clean architecture approach, separating domain logic, infrastructure, and the API entry point.

## Folder Structure

The project is organized into several key directories:

- **TaskManager.Api/**: The entry point of the application. Contains controllers, middleware, and configuration for the ASP.NET Core Web API.
- **TaskManager.Core/**: Contains the domain models, business logic, and interface definitions (Domain Layer).
- **TaskManager.Infrastructure/**: Implements the interfaces defined in Core. This layer handles data persistence, external service integrations, and repository implementations.
- **TaskManager.Tests/**: Contains unit and integration tests to ensure code quality and system reliability.
- **TaskManager.slnx**: The solution file that manages the overall project structure.
- **Dockerfile**: Defines the containerization steps for building and running the application in Docker.

## Expected Behavior

The backend serves as a RESTful API for managing tasks. Key functionalities include:

- Creating, retrieving, updating, and deleting (CRUD) tasks.
- Organizing tasks with categories and priorities (to be implemented).
- Providing a standard OpenAPI/Swagger interface for developers to interact with the API.

## Setup & Prerequisites

### Required Tools/Apps

- **.NET 10 SDK**: [Download .NET 10](https://dotnet.microsoft.com/download/dotnet/10.0)
- **Git**: For version control.
- **Docker** (Optional): To run the application in a containerized environment.

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>/backend
    ```

2.  **Restore Dependencies**:
    ```bash
    dotnet restore
    ```

## How to Run the Project

### Using .NET CLI

From the `backend` directory, run:

```bash
dotnet run --project TaskManager.Api
```

The API will start, and you can access the OpenAPI documentation at `https://localhost:<port>/openapi/v1.json` or through the Swagger UI (if configured).

### Using Docker

1.  **Build the Docker Image**:
    ```bash
    docker build -t taskmanager-backend .
    ```

2.  **Run the Container**:
    ```bash
    docker run -it --rm -p 8080:8080 taskmanager-backend
    ```

## IDE Setup

### Visual Studio (2022 v17.13+)

1.  Open **Visual Studio**.
2.  Select **Open a project or solution**.
3.  Choose the `TaskManager.slnx` file.
4.  Set `TaskManager.Api` as the **Startup Project**.
5.  Press `F5` to build and run the project.

### Visual Studio Code

1.  Open **VS Code**.
2.  Install the following extensions:
    - **C# Dev Kit** (by Microsoft)
    - **C#** (by Microsoft)
3.  Open the `backend` folder.
4.  Use the **Run and Debug** sidebar (`Ctrl+Shift+D`) to start the application using the predefined launch configurations.
5.  Alternatively, use the integrated terminal to run `dotnet run --project TaskManager.Api`.

## License

This project is licensed under the MIT License.
