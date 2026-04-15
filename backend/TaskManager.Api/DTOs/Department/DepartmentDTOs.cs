namespace TaskManager.Api.DTOs.Department;

public class DepartmentResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}

public class CreateDepartmentRequest
{
    public required string Name { get; set; }
    public required string Code { get; set; }
}
