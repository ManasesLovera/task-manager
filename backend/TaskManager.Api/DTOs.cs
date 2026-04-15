namespace TaskManager.Api.DTOs;

public class DepartmentResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class CreateDepartmentRequest
{
    public string Name { get; set; } = string.Empty;
}