using Microsoft.AspNetCore.Identity;
using TaskManager.Core.Entities;

namespace TaskManager.Infrastructure;

public static class DbInitializer
{
    public static async Task SeedData(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        // Seed Roles
        var roles = new[] { UserRole.Admin.ToString(), UserRole.Technician.ToString(), UserRole.User.ToString() };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // Seed Admin User
        var adminEmail = "admin@taskmanager.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FullName = "System Administrator",
                Role = UserRole.Admin,
                EmailConfirmed = true,
                IsActive = true
            };

            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, UserRole.Admin.ToString());
            }
        }
    }
}
