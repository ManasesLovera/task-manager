namespace TaskManager.Core.Entities;

/// <summary>
/// Represents a support or task ticket within the system.
/// </summary>
public class Ticket
{
    /// <summary>
    /// Gets or sets the unique identifier for the ticket.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Gets or sets the title of the ticket.
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// Gets or sets a detailed description of the task or issue.
    /// </summary>
    public required string Description { get; set; }

    /// <summary>
    /// Gets or sets the ID of the department responsible for this ticket.
    /// </summary>
    public Guid DepartmentId { get; set; }

    /// <summary>
    /// Gets or sets the ID of the user who created the ticket.
    /// </summary>
    public required string CreatorId { get; set; }

    /// <summary>
    /// Gets or sets the current status of the ticket.
    /// </summary>
    public TicketStatus Status { get; set; } = TicketStatus.Open;

    /// <summary>
    /// Gets or sets the date and time when the ticket was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets the description of the solution provided to resolve the ticket.
    /// </summary>
    public string? SolutionDescription { get; set; }

    /// <summary>
    /// Gets or sets the ID of the technician assigned to or who resolved the ticket.
    /// </summary>
    public string? TechnicianId { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the ticket was resolved.
    /// </summary>
    public DateTime? ResolvedAt { get; set; }
}
