using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.DTOs.Analytics;
using TaskManager.Core.Entities;
using TaskManager.Infrastructure;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AnalyticsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AnalyticsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("resolution-velocity")]
    public async Task<ActionResult<ResolutionVelocityResponse>> GetResolutionVelocity()
    {
        var resolvedTickets = await _context.Tickets
            .Where(t => t.Status == TicketStatus.Resolved && t.ResolvedAt.HasValue)
            .Select(t => new { t.CreatedAt, ResolvedAt = t.ResolvedAt!.Value })
            .ToListAsync();

        if (!resolvedTickets.Any())
        {
            return Ok(new ResolutionVelocityResponse { AverageResolutionTimeHours = 0 });
        }

        var averageResolutionTime = resolvedTickets
            .Average(t => (t.ResolvedAt - t.CreatedAt).TotalHours);

        return Ok(new ResolutionVelocityResponse { AverageResolutionTimeHours = averageResolutionTime });
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardAnalyticsResponse>> GetDashboardAnalytics([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var query = _context.Tickets
            .Where(t => t.Status == TicketStatus.Resolved && t.ResolvedAt.HasValue);

        if (startDate.HasValue)
        {
            // Ensure we use UTC for comparison
            var startUtc = DateTime.SpecifyKind(startDate.Value, DateTimeKind.Utc);
            query = query.Where(t => t.ResolvedAt >= startUtc);
        }

        if (endDate.HasValue)
        {
            // Ensure we use UTC for comparison
            var endUtc = DateTime.SpecifyKind(endDate.Value, DateTimeKind.Utc);
            query = query.Where(t => t.ResolvedAt <= endUtc);
        }

        var techPerformance = await query
            .GroupBy(t => new { t.TechnicianId, FullName = t.Technician != null ? t.Technician.FullName : "Unknown" })
            .Select(g => new TechnicianPerformance
            {
                TechnicianId = g.Key.TechnicianId ?? "Unknown",
                TechnicianName = g.Key.FullName,
                ResolvedTicketsCount = g.Count()
            })
            .ToListAsync();

        return Ok(new DashboardAnalyticsResponse { TechnicianPerformances = techPerformance });
    }
}
