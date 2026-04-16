using System.ComponentModel.DataAnnotations;
using TaskManager.Core.Entities;

namespace TaskManager.Core.DTOs.Auth;

public class CreateUserRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; } = UserRole.Member;
}
