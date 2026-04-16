using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TaskManager.Core.DTOs.Auth;
using TaskManager.Core.Entities;
using TaskManager.Infrastructure;
using Xunit;

namespace TaskManager.Tests.IntegrationTests;

public class UsersIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public UsersIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("IntegrationTesting");
            builder.ConfigureTestServices(services =>
            {
                // Add In-Memory DB (Npgsql is skipped due to environment)
                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryDbForTesting");
                });

                // Mock Authentication
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = "Test";
                    options.DefaultChallengeScheme = "Test";
                })
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                    "Test", options => { });
            });
        });
    }

    [Fact]
    public async Task GetUsers_ShouldReturnUsers_WhenAuthenticatedAsAdmin()
    {
        // Arrange
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(scheme: "Test");
        
        using (var scope = _factory.Services.CreateScope())
        {
            var scopedServices = scope.ServiceProvider;
            var db = scopedServices.GetRequiredService<ApplicationDbContext>();
            db.Database.EnsureDeleted(); // Start clean
            db.Database.EnsureCreated();

            db.Users.Add(new ApplicationUser { Id = "admin-1", UserName = "admin@test.com", Email = "admin@test.com", FullName = "Admin", Role = UserRole.Admin });
            db.Users.Add(new ApplicationUser { Id = "user-1", UserName = "user@test.com", Email = "user@test.com", FullName = "User", Role = UserRole.Member });
            await db.SaveChangesAsync();
        }

        // Act
        var response = await client.GetAsync("/api/users");

        // Assert
        response.EnsureSuccessStatusCode();
        var users = await response.Content.ReadFromJsonAsync<IEnumerable<UserResponse>>();
        Assert.NotNull(users);
        Assert.True(users.Count() >= 2);
    }

    [Fact]
    public async Task CreateUser_ShouldCreateUser_WhenAdmin()
    {
        // Arrange
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(scheme: "Test");

        var request = new CreateUserRequest
        {
            Email = "integration@test.com",
            FullName = "Integration Test",
            Password = "Password123!",
            Role = UserRole.Technician
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/users", request);

        // Assert
        response.EnsureSuccessStatusCode();
        var user = await response.Content.ReadFromJsonAsync<UserResponse>();
        Assert.NotNull(user);
        Assert.Equal(request.Email, user.Email);
        Assert.Equal("Technician", user.Role);
    }

    [Fact]
    public async Task UpdateUser_ShouldUpdateUser_WhenAdmin()
    {
        // Arrange
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(scheme: "Test");
        var userId = "user-to-update";

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            db.Users.Add(new ApplicationUser { Id = userId, UserName = "update@test.com", Email = "update@test.com", FullName = "Before Update", Role = UserRole.Member });
            await db.SaveChangesAsync();
        }

        var request = new UpdateUserRequest
        {
            FullName = "After Update",
            Role = UserRole.Admin,
            IsActive = false
        };

        // Act
        var response = await client.PutAsJsonAsync($"/api/users/{userId}", request);

        // Assert
        response.EnsureSuccessStatusCode();
        
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var user = await db.Users.FindAsync(userId);
            Assert.NotNull(user);
            Assert.Equal("After Update", user.FullName);
            Assert.Equal(UserRole.Admin, user.Role);
            Assert.False(user.IsActive);
        }
    }
}
