using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskManager.Api.Controllers;
using TaskManager.Core.DTOs.Auth;
using TaskManager.Core.Entities;
using TaskManager.Core.Interfaces;
using Xunit;

namespace TaskManager.Tests.Api.Controllers;

public class AuthControllerTests
{
    private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
    private readonly Mock<ITokenService> _mockTokenService;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        var store = new Mock<IUserStore<ApplicationUser>>();
        _mockUserManager = new Mock<UserManager<ApplicationUser>>(
            store.Object, null!, null!, null!, null!, null!, null!, null!, null!);
        _mockTokenService = new Mock<ITokenService>();
        _controller = new AuthController(_mockUserManager.Object, _mockTokenService.Object);
    }

    [Fact]
    public async Task Register_ShouldReturnOk_WhenSuccessful()
    {
        // Arrange
        var request = new RegisterRequest
        {
            Email = "new@example.com",
            Password = "Password123!",
            FullName = "New User"
        };

        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), request.Password))
            .ReturnsAsync(IdentityResult.Success);
        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), UserRole.Member.ToString()))
            .ReturnsAsync(IdentityResult.Success);
        
        var expiration = DateTime.UtcNow.AddHours(1);
        _mockTokenService.Setup(x => x.GenerateTokenAsync(It.IsAny<ApplicationUser>()))
            .ReturnsAsync(("mock-token", expiration));

        // Act
        var result = await _controller.Register(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<AuthResponse>(okResult.Value);
        Assert.Equal("mock-token", response.Token);
        Assert.Equal(request.Email, response.User.Email);
    }

    [Fact]
    public async Task Login_ShouldReturnOk_WhenSuccessful()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "test@example.com",
            Password = "Password123!"
        };
        var user = new ApplicationUser
        {
            Email = request.Email,
            FullName = "Test User",
            IsActive = true,
            Role = UserRole.Member
        };

        _mockUserManager.Setup(x => x.FindByEmailAsync(request.Email)).ReturnsAsync(user);
        _mockUserManager.Setup(x => x.CheckPasswordAsync(user, request.Password)).ReturnsAsync(true);
        
        var expiration = DateTime.UtcNow.AddHours(1);
        _mockTokenService.Setup(x => x.GenerateTokenAsync(user)).ReturnsAsync(("mock-token", expiration));

        // Act
        var result = await _controller.Login(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<AuthResponse>(okResult.Value);
        Assert.Equal("mock-token", response.Token);
        Assert.Equal(request.Email, response.User.Email);
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WhenUserInactive()
    {
        // Arrange
        var request = new LoginRequest { Email = "inactive@example.com", Password = "password" };
        var user = new ApplicationUser { Email = request.Email, IsActive = false };
        _mockUserManager.Setup(x => x.FindByEmailAsync(request.Email)).ReturnsAsync(user);

        // Act
        var result = await _controller.Login(request);

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(result);
    }
}
