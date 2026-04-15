using TaskManager.Core.Entities;

namespace TaskManager.Core.Interfaces;

public interface ITokenService
{
    Task<(string Token, DateTime Expiration)> GenerateTokenAsync(ApplicationUser user);
}
