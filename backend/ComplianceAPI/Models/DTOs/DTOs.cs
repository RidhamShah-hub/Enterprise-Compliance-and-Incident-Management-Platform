using System.ComponentModel.DataAnnotations;

namespace ComplianceAPI.Models.DTOs;

// Authentication DTOs
public record LoginRequest(
    [Required] string Username,
    [Required] string Password
);

public record LoginResponse(
    string Token,
    string RefreshToken,
    UserDto User,
    DateTime ExpiresAt
);

public record RegisterRequest(
    [Required] [StringLength(50)] string Username,
    [Required] [EmailAddress] string Email,
    [Required] [StringLength(100, MinimumLength = 8)] string Password,
    [Required] [StringLength(100)] string FirstName,
    [Required] [StringLength(100)] string LastName,
    [Required] Guid[] RoleIds
);

// User DTOs
public record UserDto(
    Guid Id,
    string Username,
    string Email,
    string FirstName,
    string LastName,
    string FullName,
    bool IsActive,
    DateTime CreatedAt,
    DateTime ModifiedAt,
    List<RoleDto> Roles
);

public record CreateUserRequest(
    [Required] [StringLength(50)] string Username,
    [Required] [EmailAddress] string Email,
    [Required] [StringLength(100, MinimumLength = 8)] string Password,
    [Required] [StringLength(100)] string FirstName,
    [Required] [StringLength(100)] string LastName,
    [Required] Guid[] RoleIds
);

public record UpdateUserRequest(
    [StringLength(50)] string? Username,
    [EmailAddress] string? Email,
    [StringLength(100)] string? FirstName,
    [StringLength(100)] string? LastName,
    bool? IsActive,
    Guid[]? RoleIds
);

public record ChangePasswordRequest(
    [Required] string CurrentPassword,
    [Required] [StringLength(100, MinimumLength = 8)] string NewPassword
);

// Role DTOs
public record RoleDto(
    Guid Id,
    string Name,
    string? Description,
    bool IsActive,
    DateTime CreatedAt
);

public record CreateRoleRequest(
    [Required] [StringLength(50)] string Name,
    [StringLength(255)] string? Description
);

public record UpdateRoleRequest(
    [StringLength(50)] string? Name,
    [StringLength(255)] string? Description,
    bool? IsActive
);

// Department DTOs
public record DepartmentDto(
    Guid Id,
    string Name,
    string? Description,
    UserDto? Manager,
    bool IsActive,
    DateTime CreatedAt,
    DateTime ModifiedAt
);

public record CreateDepartmentRequest(
    [Required] [StringLength(100)] string Name,
    [StringLength(255)] string? Description,
    Guid? ManagerId
);

public record UpdateDepartmentRequest(
    [StringLength(100)] string? Name,
    [StringLength(255)] string? Description,
    Guid? ManagerId,
    bool? IsActive
);

// Incident Category DTOs
public record IncidentCategoryDto(
    Guid Id,
    string Name,
    string? Description,
    int SeverityLevel,
    string SeverityLevelName,
    bool IsActive,
    DateTime CreatedAt
);

public record CreateIncidentCategoryRequest(
    [Required] [StringLength(100)] string Name,
    [StringLength(255)] string? Description,
    [Range(1, 4)] int SeverityLevel
);

public record UpdateIncidentCategoryRequest(
    [StringLength(100)] string? Name,
    [StringLength(255)] string? Description,
    [Range(1, 4)] int? SeverityLevel,
    bool? IsActive
);

// Incident DTOs
public record IncidentDto(
    Guid Id,
    string IncidentNumber,
    string Title,
    string Description,
    IncidentCategoryDto Category,
    int Priority,
    string PriorityName,
    int Status,
    string StatusName,
    UserDto ReportedBy,
    UserDto? AssignedTo,
    DepartmentDto? Department,
    DateTime IncidentDate,
    DateTime? ResolutionDate,
    string? ResolutionNotes,
    DateTime CreatedAt,
    DateTime ModifiedAt,
    List<DocumentDto> Documents
);

public record CreateIncidentRequest(
    [Required] [StringLength(255)] string Title,
    [Required] string Description,
    [Required] Guid CategoryId,
    [Range(1, 4)] int Priority,
    Guid? AssignedToId,
    Guid? DepartmentId,
    DateTime? IncidentDate
);

public record UpdateIncidentRequest(
    [StringLength(255)] string? Title,
    string? Description,
    Guid? CategoryId,
    [Range(1, 4)] int? Priority,
    [Range(1, 4)] int? Status,
    Guid? AssignedToId,
    Guid? DepartmentId,
    DateTime? IncidentDate,
    DateTime? ResolutionDate,
    string? ResolutionNotes
);

// Compliance Standard DTOs
public record ComplianceStandardDto(
    Guid Id,
    string Name,
    string? Description,
    string? Version,
    DateTime EffectiveDate,
    DateTime? ExpirationDate,
    bool IsActive,
    DateTime CreatedAt
);

public record CreateComplianceStandardRequest(
    [Required] [StringLength(100)] string Name,
    [StringLength(255)] string? Description,
    [StringLength(20)] string? Version,
    DateTime EffectiveDate,
    DateTime? ExpirationDate
);

public record UpdateComplianceStandardRequest(
    [StringLength(100)] string? Name,
    [StringLength(255)] string? Description,
    [StringLength(20)] string? Version,
    DateTime? EffectiveDate,
    DateTime? ExpirationDate,
    bool? IsActive
);

// Compliance Assessment DTOs
public record ComplianceAssessmentDto(
    Guid Id,
    ComplianceStandardDto Standard,
    DepartmentDto Department,
    DateTime AssessmentDate,
    int Status,
    string StatusName,
    decimal? Score,
    UserDto AssessedBy,
    string? Notes,
    DateTime? NextAssessmentDate,
    DateTime CreatedAt,
    DateTime ModifiedAt,
    List<DocumentDto> Documents
);

public record CreateComplianceAssessmentRequest(
    [Required] Guid StandardId,
    [Required] Guid DepartmentId,
    DateTime? AssessmentDate,
    [Range(0, 100)] decimal? Score,
    string? Notes,
    DateTime? NextAssessmentDate
);

public record UpdateComplianceAssessmentRequest(
    DateTime? AssessmentDate,
    [Range(1, 4)] int? Status,
    [Range(0, 100)] decimal? Score,
    string? Notes,
    DateTime? NextAssessmentDate
);

// Document DTOs
public record DocumentDto(
    Guid Id,
    string Name,
    string? Description,
    string FileName,
    long FileSize,
    string ContentType,
    int DocumentType,
    string DocumentTypeName,
    string? RelatedEntityType,
    Guid? RelatedEntityId,
    UserDto UploadedBy,
    DateTime CreatedAt
);

public record CreateDocumentRequest(
    [Required] [StringLength(255)] string Name,
    [StringLength(500)] string? Description,
    [Range(1, 4)] int DocumentType,
    string? RelatedEntityType,
    Guid? RelatedEntityId
);

// Notification DTOs
public record NotificationDto(
    Guid Id,
    string Title,
    string Message,
    int Type,
    string TypeName,
    bool IsRead,
    string? RelatedEntityType,
    Guid? RelatedEntityId,
    DateTime CreatedAt
);

public record CreateNotificationRequest(
    [Required] Guid UserId,
    [Required] [StringLength(255)] string Title,
    [Required] string Message,
    [Range(1, 4)] int Type,
    string? RelatedEntityType,
    Guid? RelatedEntityId
);

public record MarkNotificationReadRequest(
    [Required] Guid[] NotificationIds
);

// Dashboard DTOs
public record DashboardSummaryDto(
    int TotalIncidents,
    int OpenIncidents,
    int HighPriorityIncidents,
    int OverdueIncidents,
    int ComplianceAssessmentsDue,
    int ActiveUsers,
    int TotalDepartments,
    decimal AverageComplianceScore,
    List<IncidentTrendDto> IncidentTrends,
    List<ComplianceStatusDto> ComplianceStatus
);

public record IncidentTrendDto(
    DateTime Date,
    int IncidentCount,
    int ResolvedCount
);

public record ComplianceStatusDto(
    string StandardName,
    string DepartmentName,
    decimal? Score,
    DateTime? LastAssessmentDate,
    DateTime? NextAssessmentDate,
    string Status
);

// Common DTOs
public record PagedResult<T>(
    List<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages
);

public record ApiResponse<T>(
    bool Success,
    string? Message,
    T? Data,
    List<string>? Errors
);

// Audit Trail DTOs
public record AuditTrailDto(
    Guid Id,
    string EntityType,
    Guid EntityId,
    string Action,
    string? OldValues,
    string? NewValues,
    UserDto User,
    string? IPAddress,
    string? UserAgent,
    DateTime Timestamp
);

// Filter and Search DTOs
public record IncidentFilterDto(
    string? Search,
    Guid? CategoryId,
    int? Priority,
    int? Status,
    Guid? AssignedToId,
    Guid? DepartmentId,
    DateTime? FromDate,
    DateTime? ToDate,
    int Page = 1,
    int PageSize = 10,
    string? SortBy = "CreatedAt",
    bool SortDescending = true
);

public record ComplianceAssessmentFilterDto(
    string? Search,
    Guid? StandardId,
    Guid? DepartmentId,
    int? Status,
    DateTime? FromDate,
    DateTime? ToDate,
    int Page = 1,
    int PageSize = 10,
    string? SortBy = "AssessmentDate",
    bool SortDescending = true
);

public record UserFilterDto(
    string? Search,
    Guid? RoleId,
    bool? IsActive,
    int Page = 1,
    int PageSize = 10,
    string? SortBy = "LastName",
    bool SortDescending = false
);
