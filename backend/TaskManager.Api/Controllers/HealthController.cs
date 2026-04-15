using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public HealthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public IActionResult GetHealth()
    {
        var version = _configuration["AppVersion"] ?? "0.0.0";
        return Ok(new
        {
            Status = "Healthy",
            Version = version
        });
    }
}
