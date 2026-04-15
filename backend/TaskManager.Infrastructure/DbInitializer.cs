using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManager.Core.Entities;

namespace TaskManager.Infrastructure;

public static class DbInitializer
{
    public static async Task SeedData(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
    {
        // 1. Seed Roles
        var roles = new[] { UserRole.Admin.ToString(), UserRole.Technician.ToString(), UserRole.Member.ToString() };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // 2. Define Default Users
        var defaultUsers = new List<(string Email, string Name, UserRole Role, string Password)>
        {
            ("admin@taskmanager.com", "System Administrator", UserRole.Admin, "Admin123!"),
            ("tech@taskmanager.com", "Default Technician", UserRole.Technician, "Tech123!"),
            ("member@taskmanager.com", "Standard Member", UserRole.Member, "Member123!")
        };

        // 3. Seed Users
        foreach (var (email, name, role, password) in defaultUsers)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FullName = name,
                    Role = role,
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, role.ToString());
                }
            }
        }

        // 4. Seed Departments
        if (!context.Departments.Any())
        {
            var departments = new List<Department>
            {
                new Department { Name = "Human Resources", Code = "RRHH" },
                new Department { Name = "Information Technology", Code = "IT" },
                new Department { Name = "Sales", Code = "SALES" },
                new Department { Name = "Client Service", Code = "CS" },
                new Department { Name = "Management", Code = "MGMT" }
            };

            context.Departments.AddRange(departments);
            await context.SaveChangesAsync();
        }
    }
}
