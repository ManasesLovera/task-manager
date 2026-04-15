using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Infrastructure;
using TaskManager.Core.Entities;
using TaskManager.Api.DTOs.Department;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DepartmentsController(ApplicationDbContext context)
        => _context = context;

    // GET /api/departments
    // Available to all authenticated users
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var departments = await _context.Departments.ToListAsync();
        var response = departments.Select(d => new DepartmentResponse
        {
            Id = d.Id,
            Name = d.Name,
            Code = d.Code
        });
        return Ok(response);
    }

    // POST /api/departments
    // Restricted to Admin only
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateDepartmentRequest req)
    {
        var department = new Department { Name = req.Name, Code = req.Code };
        _context.Departments.Add(department);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = department.Id },
            new DepartmentResponse { Id = department.Id, Name = department.Name, Code = department.Code });
    }

    // DELETE /api/departments/{id}
    // Restricted to Admin only
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null) return NotFound();
        
        // Optional: Check if department has tickets before deleting
        var hasTickets = await _context.Tickets.AnyAsync(t => t.DepartmentId == id);
        if (hasTickets)
        {
            return BadRequest("Cannot delete department because it has associated tickets.");
        }

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
