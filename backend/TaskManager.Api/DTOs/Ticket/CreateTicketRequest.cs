using System.ComponentModel.DataAnnotations;

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
}
