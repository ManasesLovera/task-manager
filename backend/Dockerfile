# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["TaskManager.Api/TaskManager.Api.csproj", "TaskManager.Api/"]
COPY ["TaskManager.Core/TaskManager.Core.csproj", "TaskManager.Core/"]
COPY ["TaskManager.Infrastructure/TaskManager.Infrastructure.csproj", "TaskManager.Infrastructure/"]
RUN dotnet restore "TaskManager.Api/TaskManager.Api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/TaskManager.Api"
RUN dotnet build "TaskManager.Api.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "TaskManager.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TaskManager.Api.dll"]
