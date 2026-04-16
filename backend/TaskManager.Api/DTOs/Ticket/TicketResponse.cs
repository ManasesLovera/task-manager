using TaskManager.Core.Entities;

namespace TaskManager.Api.DTOs.Ticket;

public class TicketResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public string CreatorId { get; set; } = string.Empty;
    public string CreatorName { get; set; } = string.Empty;
    public TicketStatus Status { get; set; }
    public TicketPriority Priority { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? SolutionDescription { get; set; }
    public string? TechnicianId { get; set; }
    public string? TechnicianName { get; set; }
    public DateTime? ResolvedAt { get; set; }
}
