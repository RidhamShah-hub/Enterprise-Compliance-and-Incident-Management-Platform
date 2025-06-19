using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using ComplianceAPI.Models.DTOs;
using ComplianceAPI.Services.Interfaces;

namespace ComplianceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Authenticate user and return JWT token
    /// </summary>
    /// <param name="request">Login credentials</param>
    /// <returns>Authentication response with token and user info</returns>
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        
        if (!result.Success)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    /// <param name="request">User registration details</param>
    /// <returns>Created user information</returns>
    [HttpPost("register")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<ApiResponse<UserDto>>> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(Register), result);
    }

    /// <summary>
    /// Refresh JWT token using refresh token
    /// </summary>
    /// <param name="refreshToken">Refresh token</param>
    /// <returns>New JWT token</returns>
    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<string>>> RefreshToken([FromBody] string refreshToken)
    {
        var result = await _authService.RefreshTokenAsync(refreshToken);
        
        if (!result.Success)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Logout user and invalidate token
    /// </summary>
    /// <returns>Logout confirmation</returns>
    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> Logout()
    {
        var token = HttpContext.Request.Headers["Authorization"]
            .FirstOrDefault()?.Split(" ").Last();

        if (string.IsNullOrEmpty(token))
        {
            return BadRequest(new ApiResponse<bool>(false, "No token provided", false, null));
        }

        var result = await _authService.LogoutAsync(token);
        return Ok(result);
    }

    /// <summary>
    /// Change user password
    /// </summary>
    /// <param name="request">Current and new password</param>
    /// <returns>Password change confirmation</returns>
    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized(new ApiResponse<bool>(false, "Invalid user token", false, null));
        }

        var result = await _authService.ChangePasswordAsync(userId, request);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Request password reset
    /// </summary>
    /// <param name="email">User email address</param>
    /// <returns>Password reset confirmation</returns>
    [HttpPost("forgot-password")]
    public async Task<ActionResult<ApiResponse<bool>>> ForgotPassword([FromBody] string email)
    {
        var result = await _authService.ResetPasswordAsync(email);
        return Ok(result);
    }

    /// <summary>
    /// Get current user information
    /// </summary>
    /// <returns>Current user details</returns>
    [HttpGet("me")]
    [Authorize]
    public ActionResult<object> GetCurrentUser()
    {
        var userInfo = new
        {
            Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            Username = User.FindFirst(ClaimTypes.Name)?.Value,
            Email = User.FindFirst(ClaimTypes.Email)?.Value,
            FullName = User.FindFirst("full_name")?.Value,
            Roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray()
        };

        return Ok(new ApiResponse<object>(true, "User information retrieved", userInfo, null));
    }

    /// <summary>
    /// Validate token
    /// </summary>
    /// <returns>Token validation result</returns>
    [HttpGet("validate")]
    [Authorize]
    public ActionResult<ApiResponse<bool>> ValidateToken()
    {
        return Ok(new ApiResponse<bool>(true, "Token is valid", true, null));
    }
}
