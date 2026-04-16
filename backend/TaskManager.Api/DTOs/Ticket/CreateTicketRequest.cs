using System.ComponentModel.DataAnnotations;
using TaskManager.Core.Entities;

namespace TaskManager.Api.DTOs.Ticket;

public class CreateTicketRequest
{
    [Required]
    [StringLength(100, MinimumLength = 5)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(1000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public Guid DepartmentId { get; set; }

    [Required]
    public TicketPriority Priority { get; set; } = TicketPriority.Medium;
}
