namespace TaskManager.Api.DTOs.Department;

public class CreateDepartmentRequest
{
    public required string Name { get; set; }
    public required string Code { get; set; }
}
