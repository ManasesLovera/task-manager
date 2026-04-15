using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.DTOs.Ticket;

public class ResolveTicketRequest
{
    [Required]
    [StringLength(1000, MinimumLength = 5)]
    public string SolutionDescription { get; set; } = string.Empty;
}
