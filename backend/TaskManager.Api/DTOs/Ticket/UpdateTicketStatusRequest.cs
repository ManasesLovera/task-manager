using TaskManager.Core.Entities;

namespace TaskManager.Api.DTOs.Ticket;

public class UpdateTicketStatusRequest
{
    public TicketStatus Status { get; set; }
}
