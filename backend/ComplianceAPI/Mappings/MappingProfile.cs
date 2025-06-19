using AutoMapper;
using ComplianceAPI.Models.DTOs;
using ComplianceAPI.Models.Entities;

namespace ComplianceAPI.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles
                .Where(ur => ur.IsActive)
                .Select(ur => ur.Role)));

        CreateMap<CreateUserRequest, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.Salt, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.UserRoles, opt => opt.Ignore());

        // Role mappings
        CreateMap<Role, RoleDto>();
        CreateMap<CreateRoleRequest, Role>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

        // Department mappings
        CreateMap<Department, DepartmentDto>();
        CreateMap<CreateDepartmentRequest, Department>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

        // Incident Category mappings
        CreateMap<IncidentCategory, IncidentCategoryDto>()
            .ForMember(dest => dest.SeverityLevelName, opt => opt.MapFrom(src => GetSeverityLevelName(src.SeverityLevel)));

        CreateMap<CreateIncidentCategoryRequest, IncidentCategory>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

        // Incident mappings
        CreateMap<Incident, IncidentDto>()
            .ForMember(dest => dest.PriorityName, opt => opt.MapFrom(src => GetPriorityName(src.Priority)))
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => GetIncidentStatusName(src.Status)))
            .ForMember(dest => dest.Documents, opt => opt.MapFrom(src => src.Documents.Where(d => !d.IsDeleted)));

        CreateMap<CreateIncidentRequest, Incident>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.IncidentNumber, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => 1)) // Open
            .ForMember(dest => dest.IncidentDate, opt => opt.MapFrom(src => src.IncidentDate ?? DateTime.UtcNow));

        // Compliance Standard mappings
        CreateMap<ComplianceStandard, ComplianceStandardDto>();
        CreateMap<CreateComplianceStandardRequest, ComplianceStandard>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

        // Compliance Assessment mappings
        CreateMap<ComplianceAssessment, ComplianceAssessmentDto>()
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => GetAssessmentStatusName(src.Status)))
            .ForMember(dest => dest.Documents, opt => opt.MapFrom(src => src.Documents.Where(d => !d.IsDeleted)));

        CreateMap<CreateComplianceAssessmentRequest, ComplianceAssessment>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => 1)) // Pending
            .ForMember(dest => dest.AssessmentDate, opt => opt.MapFrom(src => src.AssessmentDate ?? DateTime.UtcNow));

        // Document mappings
        CreateMap<Document, DocumentDto>()
            .ForMember(dest => dest.DocumentTypeName, opt => opt.MapFrom(src => GetDocumentTypeName(src.DocumentType)));

        CreateMap<CreateDocumentRequest, Document>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.FileName, opt => opt.Ignore())
            .ForMember(dest => dest.FilePath, opt => opt.Ignore())
            .ForMember(dest => dest.FileSize, opt => opt.Ignore())
            .ForMember(dest => dest.ContentType, opt => opt.Ignore());

        // Notification mappings
        CreateMap<Notification, NotificationDto>()
            .ForMember(dest => dest.TypeName, opt => opt.MapFrom(src => GetNotificationTypeName(src.Type)));

        CreateMap<CreateNotificationRequest, Notification>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.IsRead, opt => opt.MapFrom(src => false));

        // Audit Trail mappings
        CreateMap<AuditTrail, AuditTrailDto>();

        // Compliance Status mapping
        CreateMap<ComplianceAssessment, ComplianceStatusDto>()
            .ForMember(dest => dest.StandardName, opt => opt.MapFrom(src => src.Standard.Name))
            .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Department.Name))
            .ForMember(dest => dest.LastAssessmentDate, opt => opt.MapFrom(src => src.AssessmentDate))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => GetAssessmentStatusName(src.Status)));
    }

    private static string GetSeverityLevelName(int severityLevel) => severityLevel switch
    {
        1 => "Low",
        2 => "Medium",
        3 => "High",
        4 => "Critical",
        _ => "Unknown"
    };

    private static string GetPriorityName(int priority) => priority switch
    {
        1 => "Low",
        2 => "Medium",
        3 => "High",
        4 => "Critical",
        _ => "Unknown"
    };

    private static string GetIncidentStatusName(int status) => status switch
    {
        1 => "Open",
        2 => "In Progress",
        3 => "Resolved",
        4 => "Closed",
        _ => "Unknown"
    };

    private static string GetAssessmentStatusName(int status) => status switch
    {
        1 => "Pending",
        2 => "In Progress",
        3 => "Completed",
        4 => "Failed",
        _ => "Unknown"
    };

    private static string GetDocumentTypeName(int documentType) => documentType switch
    {
        1 => "Policy",
        2 => "Procedure",
        3 => "Evidence",
        4 => "Report",
        _ => "Unknown"
    };

    private static string GetNotificationTypeName(int type) => type switch
    {
        1 => "Info",
        2 => "Warning",
        3 => "Error",
        4 => "Success",
        _ => "Unknown"
    };
}
