using System.ComponentModel.DataAnnotations;

namespace TaskManager.Core.DTOs.Auth;

public class ResetPasswordRequest
{
    [Required]
    [MinLength(6)]
    public string NewPassword { get; set; } = string.Empty;
}
