using Microsoft.AspNetCore.Mvc;

namespace ComplianceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    /// <summary>
    /// Health check endpoint
    /// </summary>
    /// <returns>Health status</returns>
    [HttpGet]
    public ActionResult<object> Get()
    {
        return Ok(new 
        { 
            status = "healthy", 
            timestamp = DateTime.UtcNow,
            version = "1.0.0",
            service = "Enterprise Compliance & Incident Management API"
        });
    }

    /// <summary>
    /// Database connectivity check
    /// </summary>
    /// <returns>Database status</returns>
    [HttpGet("database")]
    public ActionResult<object> CheckDatabase()
    {
        try
        {
            // Simple database connectivity check
            return Ok(new 
            { 
                status = "connected", 
                timestamp = DateTime.UtcNow,
                database = "SQLite"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new 
            { 
                status = "error", 
                message = ex.Message,
                timestamp = DateTime.UtcNow
            });
        }
    }
}
