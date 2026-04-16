using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Core.DTOs.Auth;
using TaskManager.Core.Entities;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsers()
    {
        var users = await _userManager.Users.ToListAsync();
        var userDtos = users.Select(user => new UserResponse
        {
            Id = user.Id,
            Email = user.Email!,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            IsActive = user.IsActive
        });

        return Ok(userDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserResponse>> GetUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(new UserResponse
        {
            Id = user.Id,
            Email = user.Email!,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            IsActive = user.IsActive
        });
    }

    [HttpPost]
    public async Task<ActionResult<UserResponse>> CreateUser([FromBody] CreateUserRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName,
            Role = request.Role,
            IsActive = true,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await _userManager.AddToRoleAsync(user, request.Role.ToString());

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new UserResponse
        {
            Id = user.Id,
            Email = user.Email!,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            IsActive = user.IsActive
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        // Update basic info
        user.FullName = request.FullName;
        user.IsActive = request.IsActive;

        // Update role if changed
        if (user.Role != request.Role)
        {
            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            user.Role = request.Role;
            await _userManager.AddToRoleAsync(user, request.Role.ToString());
        }

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return NoContent();
    }

    [HttpPost("{id}/reset-password")]
    public async Task<IActionResult> ResetPassword(string id, [FromBody] ResetPasswordRequest request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return NoContent();
    }

    [HttpPatch("{id}/role")]
    public async Task<IActionResult> UpdateRole(string id, [FromBody] UpdateUserRole request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        // Remove existing roles
        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);

        // Add new role
        user.Role = request.Role;
        await _userManager.UpdateAsync(user);
        await _userManager.AddToRoleAsync(user, request.Role.ToString());

        return NoContent();
    }

    [HttpPatch("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        user.IsActive = !user.IsActive;
        await _userManager.UpdateAsync(user);

        return NoContent();
    }
}
