using System.ComponentModel.DataAnnotations;
using TaskManager.Core.Entities;

namespace TaskManager.Core.DTOs.Auth;

public class UpdateUserRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; }

    [Required]
    public bool IsActive { get; set; }
}
