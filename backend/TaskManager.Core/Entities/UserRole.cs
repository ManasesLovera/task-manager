namespace TaskManager.Core.Entities;

/// <summary>
/// Specifies the roles available for users within the system.
/// </summary>
public enum UserRole
{
    /// <summary>
    /// Administrator with full system access.
    /// </summary>
    Admin,

    /// <summary>
    /// Technician responsible for resolving tickets.
    /// </summary>
    Technician,

    /// <summary>
    /// Member who can create and view their own tickets.
    /// </summary>
    Member
}
