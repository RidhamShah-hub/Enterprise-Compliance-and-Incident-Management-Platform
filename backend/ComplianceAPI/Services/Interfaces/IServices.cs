using ComplianceAPI.Models.DTOs;
using ComplianceAPI.Models.Entities;

namespace ComplianceAPI.Services.Interfaces;

public interface IAuthService
{
    Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request);
    Task<ApiResponse<UserDto>> RegisterAsync(RegisterRequest request);
    Task<ApiResponse<string>> RefreshTokenAsync(string refreshToken);
    Task<ApiResponse<bool>> LogoutAsync(string token);
    Task<ApiResponse<bool>> ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
    Task<ApiResponse<bool>> ResetPasswordAsync(string email);
}

public interface IUserService
{
    Task<ApiResponse<PagedResult<UserDto>>> GetUsersAsync(UserFilterDto filter);
    Task<ApiResponse<UserDto?>> GetUserByIdAsync(Guid id);
    Task<ApiResponse<UserDto?>> GetUserByUsernameAsync(string username);
    Task<ApiResponse<UserDto?>> GetUserByEmailAsync(string email);
    Task<ApiResponse<UserDto>> CreateUserAsync(CreateUserRequest request);
    Task<ApiResponse<UserDto>> UpdateUserAsync(Guid id, UpdateUserRequest request);
    Task<ApiResponse<bool>> DeleteUserAsync(Guid id);
    Task<ApiResponse<bool>> ActivateUserAsync(Guid id);
    Task<ApiResponse<bool>> DeactivateUserAsync(Guid id);
    Task<ApiResponse<List<RoleDto>>> GetUserRolesAsync(Guid userId);
    Task<ApiResponse<bool>> AssignRolesToUserAsync(Guid userId, Guid[] roleIds);
}

public interface IRoleService
{
    Task<ApiResponse<List<RoleDto>>> GetRolesAsync();
    Task<ApiResponse<RoleDto?>> GetRoleByIdAsync(Guid id);
    Task<ApiResponse<RoleDto>> CreateRoleAsync(CreateRoleRequest request);
    Task<ApiResponse<RoleDto>> UpdateRoleAsync(Guid id, UpdateRoleRequest request);
    Task<ApiResponse<bool>> DeleteRoleAsync(Guid id);
}

public interface IDepartmentService
{
    Task<ApiResponse<List<DepartmentDto>>> GetDepartmentsAsync();
    Task<ApiResponse<DepartmentDto?>> GetDepartmentByIdAsync(Guid id);
    Task<ApiResponse<DepartmentDto>> CreateDepartmentAsync(CreateDepartmentRequest request);
    Task<ApiResponse<DepartmentDto>> UpdateDepartmentAsync(Guid id, UpdateDepartmentRequest request);
    Task<ApiResponse<bool>> DeleteDepartmentAsync(Guid id);
    Task<ApiResponse<List<UserDto>>> GetDepartmentUsersAsync(Guid departmentId);
}

public interface IIncidentService
{
    Task<ApiResponse<PagedResult<IncidentDto>>> GetIncidentsAsync(IncidentFilterDto filter);
    Task<ApiResponse<IncidentDto?>> GetIncidentByIdAsync(Guid id);
    Task<ApiResponse<IncidentDto?>> GetIncidentByNumberAsync(string incidentNumber);
    Task<ApiResponse<IncidentDto>> CreateIncidentAsync(CreateIncidentRequest request, Guid reportedById);
    Task<ApiResponse<IncidentDto>> UpdateIncidentAsync(Guid id, UpdateIncidentRequest request);
    Task<ApiResponse<bool>> DeleteIncidentAsync(Guid id);
    Task<ApiResponse<bool>> AssignIncidentAsync(Guid id, Guid assignedToId);
    Task<ApiResponse<bool>> ResolveIncidentAsync(Guid id, string resolutionNotes);
    Task<ApiResponse<bool>> CloseIncidentAsync(Guid id);
    Task<ApiResponse<List<IncidentCategoryDto>>> GetIncidentCategoriesAsync();
    Task<ApiResponse<IncidentCategoryDto>> CreateIncidentCategoryAsync(CreateIncidentCategoryRequest request);
    Task<ApiResponse<IncidentCategoryDto>> UpdateIncidentCategoryAsync(Guid id, UpdateIncidentCategoryRequest request);
}

public interface IComplianceService
{
    Task<ApiResponse<PagedResult<ComplianceAssessmentDto>>> GetAssessmentsAsync(ComplianceAssessmentFilterDto filter);
    Task<ApiResponse<ComplianceAssessmentDto?>> GetAssessmentByIdAsync(Guid id);
    Task<ApiResponse<ComplianceAssessmentDto>> CreateAssessmentAsync(CreateComplianceAssessmentRequest request, Guid assessedById);
    Task<ApiResponse<ComplianceAssessmentDto>> UpdateAssessmentAsync(Guid id, UpdateComplianceAssessmentRequest request);
    Task<ApiResponse<bool>> DeleteAssessmentAsync(Guid id);
    Task<ApiResponse<List<ComplianceStandardDto>>> GetStandardsAsync();
    Task<ApiResponse<ComplianceStandardDto?>> GetStandardByIdAsync(Guid id);
    Task<ApiResponse<ComplianceStandardDto>> CreateStandardAsync(CreateComplianceStandardRequest request);
    Task<ApiResponse<ComplianceStandardDto>> UpdateStandardAsync(Guid id, UpdateComplianceStandardRequest request);
    Task<ApiResponse<bool>> DeleteStandardAsync(Guid id);
    Task<ApiResponse<List<ComplianceStatusDto>>> GetComplianceStatusByDepartmentAsync(Guid departmentId);
}

public interface IDocumentService
{
    Task<ApiResponse<List<DocumentDto>>> GetDocumentsAsync(string? entityType = null, Guid? entityId = null);
    Task<ApiResponse<DocumentDto?>> GetDocumentByIdAsync(Guid id);
    Task<ApiResponse<DocumentDto>> UploadDocumentAsync(CreateDocumentRequest request, IFormFile file, Guid uploadedById);
    Task<ApiResponse<bool>> DeleteDocumentAsync(Guid id);
    Task<ApiResponse<byte[]>> DownloadDocumentAsync(Guid id);
    Task<ApiResponse<string>> GetDocumentUrlAsync(Guid id);
}

public interface INotificationService
{
    Task<ApiResponse<PagedResult<NotificationDto>>> GetNotificationsAsync(Guid userId, int page = 1, int pageSize = 10, bool unreadOnly = false);
    Task<ApiResponse<NotificationDto?>> GetNotificationByIdAsync(Guid id);
    Task<ApiResponse<NotificationDto>> CreateNotificationAsync(CreateNotificationRequest request);
    Task<ApiResponse<bool>> MarkAsReadAsync(Guid userId, Guid[] notificationIds);
    Task<ApiResponse<bool>> MarkAllAsReadAsync(Guid userId);
    Task<ApiResponse<bool>> DeleteNotificationAsync(Guid id);
    Task<ApiResponse<int>> GetUnreadCountAsync(Guid userId);
    Task SendIncidentNotificationAsync(Incident incident, string notificationType);
    Task SendComplianceNotificationAsync(ComplianceAssessment assessment, string notificationType);
}

public interface IDashboardService
{
    Task<ApiResponse<DashboardSummaryDto>> GetDashboardSummaryAsync(Guid? departmentId = null);
    Task<ApiResponse<List<IncidentTrendDto>>> GetIncidentTrendsAsync(DateTime fromDate, DateTime toDate, Guid? departmentId = null);
    Task<ApiResponse<List<ComplianceStatusDto>>> GetComplianceOverviewAsync(Guid? departmentId = null);
    Task<ApiResponse<Dictionary<string, int>>> GetIncidentsByStatusAsync(Guid? departmentId = null);
    Task<ApiResponse<Dictionary<string, int>>> GetIncidentsByPriorityAsync(Guid? departmentId = null);
    Task<ApiResponse<Dictionary<string, int>>> GetIncidentsByCategoryAsync(Guid? departmentId = null);
}

public interface IAuditService
{
    Task<ApiResponse<PagedResult<AuditTrailDto>>> GetAuditTrailAsync(
        string? entityType = null,
        Guid? entityId = null,
        Guid? userId = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        int page = 1,
        int pageSize = 10);
    Task LogActionAsync(string entityType, Guid entityId, string action, Guid userId, string? ipAddress = null, string? userAgent = null);
}

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body, bool isHtml = false);
    Task SendIncidentNotificationEmailAsync(string to, IncidentDto incident, string notificationType);
    Task SendComplianceNotificationEmailAsync(string to, ComplianceAssessmentDto assessment, string notificationType);
    Task SendPasswordResetEmailAsync(string to, string resetToken);
    Task SendWelcomeEmailAsync(string to, string username, string tempPassword);
}

public interface IFileStorageService
{
    Task<string> SaveFileAsync(IFormFile file, string folder);
    Task<byte[]> GetFileAsync(string filePath);
    Task<bool> DeleteFileAsync(string filePath);
    Task<string> GetFileUrlAsync(string filePath);
    string GetContentType(string fileName);
    bool IsValidFileType(string fileName, string[] allowedExtensions);
    bool IsValidFileSize(long fileSize, long maxSizeInBytes);
}
