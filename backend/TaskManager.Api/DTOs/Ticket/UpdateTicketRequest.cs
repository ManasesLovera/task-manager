using System.ComponentModel.DataAnnotations;
using TaskManager.Core.Entities;

namespace TaskManager.Api.DTOs.Ticket;

public class UpdateTicketRequest
{
    [StringLength(100, MinimumLength = 5)]
    public string? Title { get; set; }

    [StringLength(1000, MinimumLength = 10)]
    public string? Description { get; set; }

    public Guid? DepartmentId { get; set; }

    public TicketStatus? Status { get; set; }

    public TicketPriority? Priority { get; set; }

    public string? SolutionDescription { get; set; }
}
