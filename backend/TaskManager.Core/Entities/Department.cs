namespace TaskManager.Core.Entities;

/// <summary>
/// Represents a department within the organization.
/// </summary>
public class Department
{
    /// <summary>
    /// Gets or sets the unique identifier for the department.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Gets or sets the display name of the department.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Gets or sets the unique code identifying the department.
    /// </summary>
    public required string Code { get; set; }
}
