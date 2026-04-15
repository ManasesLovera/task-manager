namespace TaskManager.Core.Entities;

/// <summary>
/// Specifies the possible statuses of a ticket.
/// </summary>
public enum TicketStatus
{
    /// <summary>
    /// The ticket is new and has not yet been addressed.
    /// </summary>
    Open,

    /// <summary>
    /// The ticket is currently being processed or waiting for action.
    /// </summary>
    Pending,

    /// <summary>
    /// The ticket has been successfully resolved.
    /// </summary>
    Resolved
}
