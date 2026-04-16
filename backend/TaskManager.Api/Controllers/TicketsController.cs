using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.DTOs.Ticket;
using TaskManager.Core.Entities;
using TaskManager.Infrastructure;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TicketsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public TicketsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TicketResponse>>> GetTickets(
        [FromQuery] Guid? departmentId, 
        [FromQuery] TicketStatus? status,
        [FromQuery] TicketPriority? priority)
    {
        var userId = _userManager.GetUserId(User);
        var user = await _userManager.FindByIdAsync(userId!);
        
        var query = _context.Tickets
            .Include(t => t.Department)
            .Include(t => t.Creator)
            .Include(t => t.Technician)
            .AsQueryable();

        // Role-based filtering
        if (user!.Role == UserRole.Member)
        {
            query = query.Where(t => t.CreatorId == userId);
        }

        // Additional filters
        if (departmentId.HasValue)
        {
            query = query.Where(t => t.DepartmentId == departmentId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        if (priority.HasValue)
        {
            query = query.Where(t => t.Priority == priority.Value);
        }

        var tickets = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
        
        return Ok(tickets.Select(MapToResponse));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TicketResponse>> GetTicket(Guid id)
    {
        var userId = _userManager.GetUserId(User);
        var user = await _userManager.FindByIdAsync(userId!);

        var ticket = await _context.Tickets
            .Include(t => t.Department)
            .Include(t => t.Creator)
            .Include(t => t.Technician)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (ticket == null)
        {
            return NotFound();
        }

        // Access check
        if (user!.Role == UserRole.Member && ticket.CreatorId != userId)
        {
            return Forbid();
        }

        return Ok(MapToResponse(ticket));
    }

    [HttpPost]
    public async Task<ActionResult<TicketResponse>> CreateTicket([FromBody] CreateTicketRequest request)
    {
        var userId = _userManager.GetUserId(User);
        
        var departmentExists = await _context.Departments.AnyAsync(d => d.Id == request.DepartmentId);
        if (!departmentExists)
        {
            return BadRequest("Invalid DepartmentId.");
        }

        var ticket = new Ticket
        {
            Title = request.Title,
            Description = request.Description,
            DepartmentId = request.DepartmentId,
            Priority = request.Priority,
            CreatorId = userId!,
            Status = TicketStatus.Open,
            CreatedAt = DateTime.UtcNow
        };

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        // Reload to get navigation properties
        await _context.Entry(ticket).Reference(t => t.Department).LoadAsync();
        await _context.Entry(ticket).Reference(t => t.Creator).LoadAsync();

        return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, MapToResponse(ticket));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTicket(Guid id, [FromBody] UpdateTicketRequest request)
    {
        var userId = _userManager.GetUserId(User);
        var user = await _userManager.FindByIdAsync(userId!);

        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null) return NotFound();

        // Creators/Members can only edit their own tickets if they are still 'Open'
        if (user!.Role == UserRole.Member)
        {
            if (ticket.CreatorId != userId) return Forbid();
            if (ticket.Status != TicketStatus.Open) return BadRequest("Only 'Open' tickets can be edited by members.");

            if (request.Title != null) ticket.Title = request.Title;
            if (request.Description != null) ticket.Description = request.Description;
            if (request.DepartmentId.HasValue) ticket.DepartmentId = request.DepartmentId.Value;
        }
        else // Admin or Technician
        {
            if (request.Status.HasValue)
            {
                ticket.Status = request.Status.Value;
                if (ticket.Status == TicketStatus.Resolved)
                {
                    ticket.ResolvedAt = DateTime.UtcNow;
                    ticket.TechnicianId = userId;
                }
            }

            if (request.Priority.HasValue) ticket.Priority = request.Priority.Value;
            if (request.SolutionDescription != null)
            {
                ticket.SolutionDescription = request.SolutionDescription;
                ticket.TechnicianId = userId;
            }

            // Admins can also edit title/desc if they really want, but usually it's the creator
            if (user.Role == UserRole.Admin)
            {
                if (request.Title != null) ticket.Title = request.Title;
                if (request.Description != null) ticket.Description = request.Description;
                if (request.DepartmentId.HasValue) ticket.DepartmentId = request.DepartmentId.Value;
            }
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTicket(Guid id)
    {
        var userId = _userManager.GetUserId(User);
        var user = await _userManager.FindByIdAsync(userId!);

        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null) return NotFound();

        // Only Creator (if Open) or Admin can delete
        if (user!.Role == UserRole.Member)
        {
            if (ticket.CreatorId != userId) return Forbid();
            if (ticket.Status != TicketStatus.Open) return BadRequest("Only 'Open' tickets can be deleted.");
        }
        else if (user.Role != UserRole.Admin)
        {
            return Forbid();
        }

        _context.Tickets.Remove(ticket);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static TicketResponse MapToResponse(Ticket ticket)
    {
        return new TicketResponse
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            DepartmentId = ticket.DepartmentId,
            DepartmentName = ticket.Department?.Name ?? "Unknown",
            CreatorId = ticket.CreatorId,
            CreatorName = ticket.Creator?.FullName ?? "Unknown",
            Status = ticket.Status,
            Priority = ticket.Priority,
            CreatedAt = ticket.CreatedAt,
            SolutionDescription = ticket.SolutionDescription,
            TechnicianId = ticket.TechnicianId,
            TechnicianName = ticket.Technician?.FullName,
            ResolvedAt = ticket.ResolvedAt
        };
    }
}
