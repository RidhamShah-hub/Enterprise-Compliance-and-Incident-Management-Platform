using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;
using ComplianceAPI.Data;
using ComplianceAPI.Models.DTOs;
using ComplianceAPI.Models.Entities;
using ComplianceAPI.Services.Interfaces;
using AutoMapper;

namespace ComplianceAPI.Services;

public class AuthService : IAuthService
{
    private readonly ComplianceDbContext _context;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        ComplianceDbContext context,
        IMapper mapper,
        IConfiguration configuration,
        ILogger<AuthService> logger)
    {
        _context = context;
        _mapper = mapper;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.IsActive);

            if (user == null || !VerifyPassword(request.Password, user.PasswordHash, user.Salt))
            {
                return new ApiResponse<LoginResponse>(false, "Invalid username or password", null, null);
            }

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            var expiresAt = DateTime.UtcNow.AddMinutes(
                _configuration.GetValue<int>("JWT:ExpiryMinutes", 60));

            // Store refresh token in database (you might want to create a RefreshTokens table)
            // For now, we'll just return it

            var userDto = _mapper.Map<UserDto>(user);
            var response = new LoginResponse(token, refreshToken, userDto, expiresAt);

            _logger.LogInformation("User {Username} logged in successfully", user.Username);

            return new ApiResponse<LoginResponse>(true, "Login successful", response, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for user {Username}", request.Username);
            return new ApiResponse<LoginResponse>(false, "An error occurred during login", null, new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponse<UserDto>> RegisterAsync(RegisterRequest request)
    {
        try
        {
            // Check if username or email already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username || u.Email == request.Email);

            if (existingUser != null)
            {
                var field = existingUser.Username == request.Username ? "Username" : "Email";
                return new ApiResponse<UserDto>(false, $"{field} already exists", null, null);
            }

            // Validate roles exist
            var roles = await _context.Roles
                .Where(r => request.RoleIds.Contains(r.Id) && r.IsActive)
                .ToListAsync();

            if (roles.Count != request.RoleIds.Length)
            {
                return new ApiResponse<UserDto>(false, "One or more roles are invalid", null, null);
            }

            // Hash password
            var salt = GenerateSalt();
            var hashedPassword = HashPassword(request.Password, salt);

            // Create user
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = hashedPassword,
                Salt = salt,
                FirstName = request.FirstName,
                LastName = request.LastName,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Assign roles
            var userRoles = request.RoleIds.Select(roleId => new UserRole
            {
                UserId = user.Id,
                RoleId = roleId,
                IsActive = true
            }).ToList();

            _context.UserRoles.AddRange(userRoles);
            await _context.SaveChangesAsync();

            // Load user with roles for response
            var createdUser = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstAsync(u => u.Id == user.Id);

            var userDto = _mapper.Map<UserDto>(createdUser);

            _logger.LogInformation("User {Username} registered successfully", user.Username);

            return new ApiResponse<UserDto>(true, "User registered successfully", userDto, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user registration for {Username}", request.Username);
            return new ApiResponse<UserDto>(false, "An error occurred during registration", null, new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponse<string>> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            // In a production environment, you would validate the refresh token
            // against stored tokens in the database and ensure it hasn't expired
            
            // For now, we'll return a simple response
            // You should implement proper refresh token validation
            
            return new ApiResponse<string>(false, "Refresh token functionality not implemented", null, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return new ApiResponse<string>(false, "An error occurred during token refresh", null, new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponse<bool>> LogoutAsync(string token)
    {
        try
        {
            // In a production environment, you would add the token to a blacklist
            // or remove the refresh token from the database
            
            _logger.LogInformation("User logged out");
            
            return new ApiResponse<bool>(true, "Logout successful", true, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return new ApiResponse<bool>(false, "An error occurred during logout", false, new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponse<bool>> ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return new ApiResponse<bool>(false, "User not found", false, null);
            }

            // Verify current password
            if (!VerifyPassword(request.CurrentPassword, user.PasswordHash, user.Salt))
            {
                return new ApiResponse<bool>(false, "Current password is incorrect", false, null);
            }

            // Hash new password
            var salt = GenerateSalt();
            var hashedPassword = HashPassword(request.NewPassword, salt);

            // Update password
            user.PasswordHash = hashedPassword;
            user.Salt = salt;
            user.ModifiedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Password changed for user {UserId}", userId);

            return new ApiResponse<bool>(true, "Password changed successfully", true, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password for user {UserId}", userId);
            return new ApiResponse<bool>(false, "An error occurred while changing password", false, new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponse<bool>> ResetPasswordAsync(string email)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
            if (user == null)
            {
                // Don't reveal if email exists for security reasons
                return new ApiResponse<bool>(true, "If the email exists, a password reset link has been sent", true, null);
            }

            // Generate reset token (implement proper token generation and storage)
            var resetToken = Guid.NewGuid().ToString();
            
            // In a production environment, store the reset token in database with expiration
            // and send email with reset link
            
            _logger.LogInformation("Password reset requested for user {Email}", email);

            return new ApiResponse<bool>(true, "If the email exists, a password reset link has been sent", true, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset for email {Email}", email);
            return new ApiResponse<bool>(false, "An error occurred during password reset", false, new List<string> { ex.Message });
        }
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JWT");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Secret"] ?? "your-super-secret-key-that-is-at-least-32-characters-long!");
        
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Email, user.Email),
            new("full_name", user.FullName)
        };

        // Add role claims
        foreach (var userRole in user.UserRoles.Where(ur => ur.IsActive))
        {
            claims.Add(new Claim(ClaimTypes.Role, userRole.Role.Name));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(jwtSettings.GetValue<int>("ExpiryMinutes", 60)),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        
        return tokenHandler.WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private string GenerateSalt()
    {
        return BCrypt.Net.BCrypt.GenerateSalt(12);
    }

    private string HashPassword(string password, string salt)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, salt);
    }

    private bool VerifyPassword(string password, string hashedPassword, string salt)
    {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
}
