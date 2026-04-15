using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Core.DTOs.Auth;
using TaskManager.Core.Entities;
using TaskManager.Core.Interfaces;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;

    public AuthController(UserManager<ApplicationUser> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName,
            Role = UserRole.Member,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await _userManager.AddToRoleAsync(user, UserRole.Member.ToString());

        var (token, expiration) = await _tokenService.GenerateTokenAsync(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Expiration = expiration,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FullName = user.FullName,
                Role = user.Role.ToString(),
                IsActive = user.IsActive
            }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !user.IsActive)
        {
            return Unauthorized("Invalid credentials or inactive account.");
        }

        var result = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!result)
        {
            return Unauthorized("Invalid credentials.");
        }

        var (token, expiration) = await _tokenService.GenerateTokenAsync(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Expiration = expiration,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FullName = user.FullName,
                Role = user.Role.ToString(),
                IsActive = user.IsActive
            }
        });
    }
}
