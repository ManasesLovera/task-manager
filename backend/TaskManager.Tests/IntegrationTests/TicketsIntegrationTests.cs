using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TaskManager.Api.DTOs.Ticket;
using TaskManager.Core.Entities;
using TaskManager.Infrastructure;
using Xunit;

namespace TaskManager.Tests.IntegrationTests;

public class TicketsIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public TicketsIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("IntegrationTesting");
            builder.ConfigureTestServices(services =>
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryTicketsTest");
                });

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

    private async Task SeedData(ApplicationDbContext db)
    {
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var dept = new Department { Id = Guid.NewGuid(), Name = "IT", Code = "IT01" };
        db.Departments.Add(dept);

        var admin = new ApplicationUser { Id = "admin-1", UserName = "admin@test.com", Email = "admin@test.com", FullName = "Admin", Role = UserRole.Admin };
        db.Users.Add(admin);

        db.Tickets.Add(new Ticket { Id = Guid.NewGuid(), Title = "High Ticket", Description = "Desc High", DepartmentId = dept.Id, CreatorId = "admin-1", Priority = TicketPriority.High, Status = TicketStatus.Open });
        db.Tickets.Add(new Ticket { Id = Guid.NewGuid(), Title = "Low Ticket", Description = "Desc Low", DepartmentId = dept.Id, CreatorId = "admin-1", Priority = TicketPriority.Low, Status = TicketStatus.Open });

        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task GetTickets_WithPriorityFilter_ShouldReturnCorrectTickets()
    {
        // Arrange
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(scheme: "Test");

        using (var scope = _factory.Services.CreateScope())
        {
            await SeedData(scope.ServiceProvider.GetRequiredService<ApplicationDbContext>());
        }

        // Act
        var response = await client.GetAsync("/api/tickets?priority=High");

        // Assert
        response.EnsureSuccessStatusCode();
        var tickets = await response.Content.ReadFromJsonAsync<IEnumerable<TicketResponse>>();
        Assert.NotNull(tickets);
        var ticketList = tickets.ToList();
        Assert.Single(ticketList);
        Assert.Equal(TicketPriority.High, ticketList.First().Priority);
    }

    [Fact]
    public async Task UpdateTicket_ShouldUpdatePriorityAndStatus()
    {
        // Arrange
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(scheme: "Test");

        Guid ticketId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await SeedData(db);
            ticketId = db.Tickets.First().Id;
        }

        var updateRequest = new UpdateTicketRequest
        {
            Status = TicketStatus.Pending,
            Priority = TicketPriority.Low,
            SolutionDescription = "Some solution"
        };

        // Act
        var response = await client.PutAsJsonAsync($"/api/tickets/{ticketId}", updateRequest);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.NoContent, response.StatusCode);

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var ticket = await db.Tickets.FindAsync(ticketId);
            Assert.NotNull(ticket);
            Assert.Equal(TicketStatus.Pending, ticket.Status);
            Assert.Equal(TicketPriority.Low, ticket.Priority);
            Assert.Equal("Some solution", ticket.SolutionDescription);
        }
    }
}
