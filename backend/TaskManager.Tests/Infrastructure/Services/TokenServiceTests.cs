using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Moq;
using TaskManager.Core.Entities;
using TaskManager.Core.Settings;
using TaskManager.Infrastructure.Services;
using Xunit;

namespace TaskManager.Tests.Infrastructure.Services;

public class TokenServiceTests
{
    private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
    private readonly IOptions<JwtSettings> _jwtSettings;
    private readonly TokenService _tokenService;

    public TokenServiceTests()
    {
        var store = new Mock<IUserStore<ApplicationUser>>();
        // UserManager requires many arguments, but for basic mocking, we can pass nulls for those we don't need
        _mockUserManager = new Mock<UserManager<ApplicationUser>>(
            store.Object, null!, null!, null!, null!, null!, null!, null!, null!);

        var settings = new JwtSettings
        {
            SecretKey = "SuperSecretKeyForTestingPurposeOnly_DoNotUseInProduction",
            Issuer = "TaskManager",
            Audience = "TaskManagerUsers",
            ExpiryInMinutes = 60
        };
        _jwtSettings = Options.Create(settings);

        _tokenService = new TokenService(_mockUserManager.Object, _jwtSettings);
    }

    [Fact]
    public async Task GenerateTokenAsync_ShouldReturnTokenAndExpiration()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "user-1",
            Email = "test@example.com",
            FullName = "Test User"
        };
        var roles = new List<string> { "Member" };
        _mockUserManager.Setup(x => x.GetRolesAsync(user)).ReturnsAsync(roles);

        // Act
        var (token, expiration) = await _tokenService.GenerateTokenAsync(user);

        // Assert
        Assert.NotNull(token);
        Assert.NotEmpty(token);
        Assert.True(expiration > DateTime.UtcNow);
        _mockUserManager.Verify(x => x.GetRolesAsync(user), Times.Once);
    }
}
