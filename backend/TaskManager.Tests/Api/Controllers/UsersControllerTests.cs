using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskManager.Api.Controllers;
using TaskManager.Core.DTOs.Auth;
using TaskManager.Core.Entities;
using Xunit;

namespace TaskManager.Tests.Api.Controllers;

public class UsersControllerTests
{
    private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
    private readonly UsersController _controller;

    public UsersControllerTests()
    {
        var store = new Mock<IUserStore<ApplicationUser>>();
        _mockUserManager = new Mock<UserManager<ApplicationUser>>(
            store.Object, null!, null!, null!, null!, null!, null!, null!, null!);
        _controller = new UsersController(_mockUserManager.Object);
    }

    [Fact]
    public async Task GetUser_ShouldReturnOk_WhenUserExists()
    {
        // Arrange
        var userId = "user-1";
        var user = new ApplicationUser
        {
            Id = userId,
            Email = "test@example.com",
            FullName = "Test User"
        };
        _mockUserManager.Setup(x => x.FindByIdAsync(userId)).ReturnsAsync(user);

        // Act
        var result = await _controller.GetUser(userId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<UserResponse>(okResult.Value);
        Assert.Equal(userId, response.Id);
    }

    [Fact]
    public async Task UpdateRole_ShouldReturnNoContent_WhenSuccessful()
    {
        // Arrange
        var userId = "user-1";
        var user = new ApplicationUser { Id = userId };
        var request = new UpdateUserRole { Role = UserRole.Admin };
        
        _mockUserManager.Setup(x => x.FindByIdAsync(userId)).ReturnsAsync(user);
        _mockUserManager.Setup(x => x.GetRolesAsync(user)).ReturnsAsync(new List<string> { "Member" });
        _mockUserManager.Setup(x => x.RemoveFromRolesAsync(user, It.IsAny<IEnumerable<string>>())).ReturnsAsync(IdentityResult.Success);
        _mockUserManager.Setup(x => x.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);
        _mockUserManager.Setup(x => x.AddToRoleAsync(user, UserRole.Admin.ToString())).ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _controller.UpdateRole(userId, request);

        // Assert
        Assert.IsType<NoContentResult>(result);
        Assert.Equal(UserRole.Admin, user.Role);
    }

    [Fact]
    public async Task ToggleStatus_ShouldReturnNoContent_WhenSuccessful()
    {
        // Arrange
        var userId = "user-1";
        var user = new ApplicationUser { Id = userId, IsActive = true };
        _mockUserManager.Setup(x => x.FindByIdAsync(userId)).ReturnsAsync(user);
        _mockUserManager.Setup(x => x.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _controller.ToggleStatus(userId);

        // Assert
        Assert.IsType<NoContentResult>(result);
        Assert.False(user.IsActive);
    }

    [Fact]
    public async Task CreateUser_ShouldReturnCreatedAtAction_WhenSuccessful()
    {
        // Arrange
        var request = new CreateUserRequest
        {
            Email = "new@example.com",
            FullName = "New User",
            Password = "Password123!",
            Role = UserRole.Member
        };
        
        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), request.Password))
            .ReturnsAsync(IdentityResult.Success);
        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), request.Role.ToString()))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _controller.CreateUser(request);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var response = Assert.IsType<UserResponse>(createdAtActionResult.Value);
        Assert.Equal(request.Email, response.Email);
        Assert.Equal(request.FullName, response.FullName);
    }

    [Fact]
    public async Task UpdateUser_ShouldReturnNoContent_WhenSuccessful()
    {
        // Arrange
        var userId = "user-1";
        var user = new ApplicationUser { Id = userId, FullName = "Old Name", Role = UserRole.Member, IsActive = true };
        var request = new UpdateUserRequest
        {
            FullName = "New Name",
            Role = UserRole.Technician,
            IsActive = false
        };

        _mockUserManager.Setup(x => x.FindByIdAsync(userId)).ReturnsAsync(user);
        _mockUserManager.Setup(x => x.GetRolesAsync(user)).ReturnsAsync(new List<string> { "Member" });
        _mockUserManager.Setup(x => x.RemoveFromRolesAsync(user, It.IsAny<IEnumerable<string>>())).ReturnsAsync(IdentityResult.Success);
        _mockUserManager.Setup(x => x.AddToRoleAsync(user, request.Role.ToString())).ReturnsAsync(IdentityResult.Success);
        _mockUserManager.Setup(x => x.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _controller.UpdateUser(userId, request);

        // Assert
        Assert.IsType<NoContentResult>(result);
        Assert.Equal("New Name", user.FullName);
        Assert.Equal(UserRole.Technician, user.Role);
        Assert.False(user.IsActive);
    }

    [Fact]
    public async Task ResetPassword_ShouldReturnNoContent_WhenSuccessful()
    {
        // Arrange
        var userId = "user-1";
        var user = new ApplicationUser { Id = userId };
        var request = new ResetPasswordRequest { NewPassword = "NewPassword123!" };

        _mockUserManager.Setup(x => x.FindByIdAsync(userId)).ReturnsAsync(user);
        _mockUserManager.Setup(x => x.GeneratePasswordResetTokenAsync(user)).ReturnsAsync("token");
        _mockUserManager.Setup(x => x.ResetPasswordAsync(user, "token", request.NewPassword))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _controller.ResetPassword(userId, request);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }
}
