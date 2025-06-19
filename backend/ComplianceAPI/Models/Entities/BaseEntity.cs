using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComplianceAPI.Models.Entities;

public abstract class BaseEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public bool IsDeleted { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime ModifiedAt { get; set; } = DateTime.UtcNow;

    public Guid? CreatedBy { get; set; }

    public Guid? ModifiedBy { get; set; }
}

public class User : BaseEntity
{
    [Required]
    [StringLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string Salt { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    [NotMapped]
    public string FullName => $"{FirstName} {LastName}";

    // Navigation properties
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public virtual ICollection<Incident> ReportedIncidents { get; set; } = new List<Incident>();
    public virtual ICollection<Incident> AssignedIncidents { get; set; } = new List<Incident>();
    public virtual ICollection<ComplianceAssessment> ComplianceAssessments { get; set; } = new List<ComplianceAssessment>();
    public virtual ICollection<Document> UploadedDocuments { get; set; } = new List<Document>();
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public virtual ICollection<AuditTrail> AuditTrails { get; set; } = new List<AuditTrail>();
    public virtual ICollection<Department> ManagedDepartments { get; set; } = new List<Department>();
}

public class Role : BaseEntity
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [StringLength(255)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}

public class UserRole : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid RoleId { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation properties
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [ForeignKey("RoleId")]
    public virtual Role Role { get; set; } = null!;
}

public class Department : BaseEntity
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(255)]
    public string? Description { get; set; }

    public Guid? ManagerId { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation properties
    [ForeignKey("ManagerId")]
    public virtual User? Manager { get; set; }

    public virtual ICollection<Incident> Incidents { get; set; } = new List<Incident>();
    public virtual ICollection<ComplianceAssessment> ComplianceAssessments { get; set; } = new List<ComplianceAssessment>();
}

public class IncidentCategory : BaseEntity
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(255)]
    public string? Description { get; set; }

    [Range(1, 4)]
    public int SeverityLevel { get; set; } = 1; // 1=Low, 2=Medium, 3=High, 4=Critical

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<Incident> Incidents { get; set; } = new List<Incident>();
}

public class Incident : BaseEntity
{
    [Required]
    [StringLength(50)]
    public string IncidentNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public Guid CategoryId { get; set; }

    [Range(1, 4)]
    public int Priority { get; set; } = 2; // 1=Low, 2=Medium, 3=High, 4=Critical

    [Range(1, 4)]
    public int Status { get; set; } = 1; // 1=Open, 2=InProgress, 3=Resolved, 4=Closed

    [Required]
    public Guid ReportedById { get; set; }

    public Guid? AssignedToId { get; set; }

    public Guid? DepartmentId { get; set; }

    public DateTime IncidentDate { get; set; } = DateTime.UtcNow;

    public DateTime? ResolutionDate { get; set; }

    public string? ResolutionNotes { get; set; }

    // Navigation properties
    [ForeignKey("CategoryId")]
    public virtual IncidentCategory Category { get; set; } = null!;

    [ForeignKey("ReportedById")]
    public virtual User ReportedBy { get; set; } = null!;

    [ForeignKey("AssignedToId")]
    public virtual User? AssignedTo { get; set; }

    [ForeignKey("DepartmentId")]
    public virtual Department? Department { get; set; }

    public virtual ICollection<Document> Documents { get; set; } = new List<Document>();
}

public class ComplianceStandard : BaseEntity
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(255)]
    public string? Description { get; set; }

    [StringLength(20)]
    public string? Version { get; set; }

    public DateTime EffectiveDate { get; set; }

    public DateTime? ExpirationDate { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<ComplianceAssessment> ComplianceAssessments { get; set; } = new List<ComplianceAssessment>();
}

public class ComplianceAssessment : BaseEntity
{
    [Required]
    public Guid StandardId { get; set; }

    [Required]
    public Guid DepartmentId { get; set; }

    public DateTime AssessmentDate { get; set; } = DateTime.UtcNow;

    [Range(1, 4)]
    public int Status { get; set; } = 1; // 1=Pending, 2=InProgress, 3=Completed, 4=Failed

    [Range(0, 100)]
    public decimal? Score { get; set; } // Percentage score

    [Required]
    public Guid AssessedById { get; set; }

    public string? Notes { get; set; }

    public DateTime? NextAssessmentDate { get; set; }

    // Navigation properties
    [ForeignKey("StandardId")]
    public virtual ComplianceStandard Standard { get; set; } = null!;

    [ForeignKey("DepartmentId")]
    public virtual Department Department { get; set; } = null!;

    [ForeignKey("AssessedById")]
    public virtual User AssessedBy { get; set; } = null!;

    public virtual ICollection<Document> Documents { get; set; } = new List<Document>();
}

public class Document : BaseEntity
{
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    [StringLength(255)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string FilePath { get; set; } = string.Empty;

    public long FileSize { get; set; }

    [Required]
    [StringLength(100)]
    public string ContentType { get; set; } = string.Empty;

    [Range(1, 4)]
    public int DocumentType { get; set; } = 1; // 1=Policy, 2=Procedure, 3=Evidence, 4=Report

    [StringLength(50)]
    public string? RelatedEntityType { get; set; }

    public Guid? RelatedEntityId { get; set; }

    [Required]
    public Guid UploadedById { get; set; }

    // Navigation properties
    [ForeignKey("UploadedById")]
    public virtual User UploadedBy { get; set; } = null!;
}

public class AuditTrail
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(100)]
    public string EntityType { get; set; } = string.Empty;

    [Required]
    public Guid EntityId { get; set; }

    [Required]
    [StringLength(50)]
    public string Action { get; set; } = string.Empty; // CREATE, UPDATE, DELETE

    public string? OldValues { get; set; } // JSON

    public string? NewValues { get; set; } // JSON

    [Required]
    public Guid UserId { get; set; }

    [StringLength(45)]
    public string? IPAddress { get; set; }

    [StringLength(500)]
    public string? UserAgent { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}

public class Notification : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }

    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Message { get; set; } = string.Empty;

    [Range(1, 4)]
    public int Type { get; set; } = 1; // 1=Info, 2=Warning, 3=Error, 4=Success

    public bool IsRead { get; set; } = false;

    [StringLength(50)]
    public string? RelatedEntityType { get; set; }

    public Guid? RelatedEntityId { get; set; }

    // Navigation properties
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}
