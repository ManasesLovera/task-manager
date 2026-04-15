using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Infrastructure;
using TaskManager.Core.Entities;
using TaskManager.Api.DTOs;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DepartmentsController(ApplicationDbContext context)
        => _context = context;

    // GET /api/departments
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var departments = await _context.Departments.ToListAsync();
        var response = departments.Select(d => new DepartmentResponse
        {
            Id   = d.Id,
            Name = d.Name
        });
        return Ok(response);
    }

    // POST /api/departments
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDepartmentRequest req)
    {
        var department = new Department { Name = req.Name };
        _context.Departments.Add(department);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = department.Id },
            new DepartmentResponse { Id = department.Id, Name = department.Name });
    }

    // DELETE /api/departments/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null) return NotFound();
        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}