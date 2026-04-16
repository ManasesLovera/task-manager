using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Controllers;
using TaskManager.Api.DTOs.Analytics;
using TaskManager.Core.Entities;
using TaskManager.Infrastructure;
using Xunit;

namespace TaskManager.Tests.Api.Controllers;

public class AnalyticsControllerTests
{
    private ApplicationDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetResolutionVelocity_ShouldReturnAverageHours_WhenTicketsExist()
    {
        // Arrange
        var context = GetDbContext();
        var now = DateTime.UtcNow;
        context.Tickets.AddRange(new List<Ticket>
        {
            new Ticket 
            { 
                Title = "T1", Description = "D1", CreatorId = "u1", 
                Status = TicketStatus.Resolved, CreatedAt = now.AddHours(-10), ResolvedAt = now 
            }, // 10 hours
            new Ticket 
            { 
                Title = "T2", Description = "D2", CreatorId = "u1", 
                Status = TicketStatus.Resolved, CreatedAt = now.AddHours(-2), ResolvedAt = now 
            }, // 2 hours
            new Ticket 
            { 
                Title = "T3", Description = "D3", CreatorId = "u1", 
                Status = TicketStatus.Open, CreatedAt = now.AddHours(-5) 
            } // Not resolved, should be ignored
        });
        await context.SaveChangesAsync();

        var controller = new AnalyticsController(context);

        // Act
        var result = await controller.GetResolutionVelocity();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<ResolutionVelocityResponse>(okResult.Value);
        Assert.Equal(6, response.AverageResolutionTimeHours); // (10 + 2) / 2 = 6
    }

    [Fact]
    public async Task GetResolutionVelocity_ShouldReturnZero_WhenNoResolvedTickets()
    {
        // Arrange
        var context = GetDbContext();
        var controller = new AnalyticsController(context);

        // Act
        var result = await controller.GetResolutionVelocity();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<ResolutionVelocityResponse>(okResult.Value);
        Assert.Equal(0, response.AverageResolutionTimeHours);
    }

    [Fact]
    public async Task GetDashboardAnalytics_ShouldFilterByDateAndGroupCorrectly()
    {
        // Arrange
        var context = GetDbContext();
        var now = DateTime.UtcNow;
        
        var tech1 = new ApplicationUser { Id = "t1", FullName = "Tech One" };
        var tech2 = new ApplicationUser { Id = "t2", FullName = "Tech Two" };
        context.Users.AddRange(tech1, tech2);

        context.Tickets.AddRange(new List<Ticket>
        {
            new Ticket 
            { 
                Title = "T1", Description = "D1", CreatorId = "u1", TechnicianId = "t1", 
                Status = TicketStatus.Resolved, ResolvedAt = now.AddDays(-5) 
            },
            new Ticket 
            { 
                Title = "T2", Description = "D2", CreatorId = "u1", TechnicianId = "t1", 
                Status = TicketStatus.Resolved, ResolvedAt = now.AddDays(-2) 
            },
            new Ticket 
            { 
                Title = "T3", Description = "D3", CreatorId = "u1", TechnicianId = "t2", 
                Status = TicketStatus.Resolved, ResolvedAt = now.AddDays(-1) 
            },
            new Ticket 
            { 
                Title = "T4", Description = "D4", CreatorId = "u1", TechnicianId = "t2", 
                Status = TicketStatus.Resolved, ResolvedAt = now.AddDays(-10) 
            }
        });
        await context.SaveChangesAsync();

        var controller = new AnalyticsController(context);

        // Act - Filter for last 3 days
        var result = await controller.GetDashboardAnalytics(now.AddDays(-3), now);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<DashboardAnalyticsResponse>(okResult.Value);
        
        Assert.Equal(2, response.TechnicianPerformances.Count);
        
        var t1Perf = response.TechnicianPerformances.First(p => p.TechnicianId == "t1");
        Assert.Equal(1, t1Perf.ResolvedTicketsCount); // Only T2
        
        var t2Perf = response.TechnicianPerformances.First(p => p.TechnicianId == "t2");
        Assert.Equal(1, t2Perf.ResolvedTicketsCount); // Only T3
    }
}
