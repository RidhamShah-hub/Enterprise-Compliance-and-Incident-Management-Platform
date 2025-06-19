using Microsoft.EntityFrameworkCore;
using ComplianceAPI.Models.Entities;
using System.Text.Json;
using System.Linq.Expressions;

namespace ComplianceAPI.Data;

public class ComplianceDbContext : DbContext
{
    public ComplianceDbContext(DbContextOptions<ComplianceDbContext> options) : base(options)
    {
    }

    // DbSets for all entities
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<IncidentCategory> IncidentCategories { get; set; }
    public DbSet<Incident> Incidents { get; set; }
    public DbSet<ComplianceStandard> ComplianceStandards { get; set; }
    public DbSet<ComplianceAssessment> ComplianceAssessments { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<AuditTrail> AuditTrails { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.IsActive);
            
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Salt).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            
            // Soft delete filter
            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // Configure Role entity
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Name).IsUnique();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(255);
            
            // Soft delete filter
            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // Configure UserRole entity
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.RoleId }).IsUnique();
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.UserRoles)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Role)
                  .WithMany(r => r.UserRoles)
                  .HasForeignKey(e => e.RoleId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            // Soft delete filter
            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // Configure Department entity
        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(255);
            
            entity.HasOne(e => e.Manager)
                  .WithMany(u => u.ManagedDepartments)
                  .HasForeignKey(e => e.ManagerId)
                  .OnDelete(DeleteBehavior.SetNull);
                  
            // Soft delete filter
            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // Configure IncidentCategory entity
        modelBuilder.Entity<IncidentCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(255);
            
            // Soft delete filter
            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // Configure Incident entity
        modelBuilder.Entity<Incident>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.IncidentNumber).IsUnique();
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Priority);
            entity.HasIndex(e => e.IncidentDate);
            entity.HasIndex(e => e.AssignedToId);
            
            entity.Property(e => e.IncidentNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Description).IsRequired();
            
            entity.HasOne(e => e.Category)
                  .WithMany(c => c.Incidents)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
                  
            entity.HasOne(e => e.ReportedBy)
                  .WithMany(u => u.ReportedIncidents)
                  .HasForeignKey(e => e.ReportedById)
                  .OnDelete(DeleteBehavior.Restrict);
                  
            entity.HasOne(e => e.AssignedTo)
                  .WithMany(u => u.AssignedIncidents)
                  .HasForeignKey(e => e.AssignedToId)
                  .OnDelete(DeleteBehavior.SetNull);
                  
            entity.HasOne(e => e.Department)
                  .WithMany(d => d.Incidents)
                  .HasForeignKey(e => e.DepartmentId)
                  .OnDelete(DeleteBehavior.SetNull);
                  
            // Soft delete filter
            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // Configure ComplianceStandard entity
        modelBuilder.Entity<ComplianceStandard>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Version).HasMaxLength(20);
            entity.Property(e => e.EffectiveDate).HasColumnType("date");
            entity.Property(e => e.ExpirationDate).HasColumnType("date");
            
            // Soft delete filter
            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // Configure ComplianceAssessment entity
        modelBuilder.Entity<ComplianceAssessment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.AssessmentDate);
            
            entity.Property(e => e.AssessmentDate).HasColumnType("date");
            entity.Property(e => e.NextAssessmentDate).HasColumnType("date");
            entity.Property(e => e.Score).HasColumnType("decimal(5,2)");
            
            entity.HasOne(e => e.Standard)
                  .WithMany(s => s.ComplianceAssessments)
                  .HasForeignKey(e => e.StandardId)
                  .OnDelete(DeleteBehavior.Restrict);
                  
            entity.HasOne(e => e.Department)
                  .WithMany(d => d.ComplianceAssessments)
                  .HasForeignKey(e => e.DepartmentId)
                  .OnDelete(DeleteBehavior.Restrict);
                  
            entity.HasOne(e => e.AssessedBy)
                  .WithMany(u => u.ComplianceAssessments)
                  .HasForeignKey(e => e.AssessedById)
                  .OnDelete(DeleteBehavior.Restrict);
                  
            // Soft delete filter
            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // Configure Document entity
        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FilePath).IsRequired().HasMaxLength(500);
            entity.Property(e => e.ContentType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.RelatedEntityType).HasMaxLength(50);
            
            entity.HasOne(e => e.UploadedBy)
                  .WithMany(u => u.UploadedDocuments)
                  .HasForeignKey(e => e.UploadedById)
                  .OnDelete(DeleteBehavior.Restrict);
                  
            // Soft delete filter
            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // Configure AuditTrail entity
        modelBuilder.Entity<AuditTrail>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.EntityType, e.EntityId });
            entity.HasIndex(e => e.Timestamp);
            
            entity.Property(e => e.EntityType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Action).IsRequired().HasMaxLength(50);
            entity.Property(e => e.IPAddress).HasMaxLength(45);
            entity.Property(e => e.UserAgent).HasMaxLength(500);
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.AuditTrails)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Notification entity
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.IsRead });
            
            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Message).IsRequired();
            entity.Property(e => e.RelatedEntityType).HasMaxLength(50);
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Notifications)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            // Soft delete filter
            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // Configure automatic timestamps for BaseEntity
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                var parameter = Expression.Parameter(entityType.ClrType, "e");
                var property = Expression.Property(parameter, nameof(BaseEntity.IsDeleted));
                var filter = Expression.Lambda(Expression.Equal(property, Expression.Constant(false)), parameter);
                entityType.SetQueryFilter(filter);
            }
        }
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        await AddAuditTrailAsync();
        return await base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        AddAuditTrail();
        return base.SaveChanges();
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries<BaseEntity>();
        
        foreach (var entry in entries)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    entry.Entity.ModifiedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.ModifiedAt = DateTime.UtcNow;
                    break;
            }
        }
    }

    private async Task AddAuditTrailAsync()
    {
        // This is a simplified audit trail implementation
        // In a production environment, you might want to use a more sophisticated approach
        var auditEntries = new List<AuditTrail>();
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is BaseEntity && e.State != EntityState.Unchanged);

        foreach (var entry in entries)
        {
            var auditTrail = new AuditTrail
            {
                EntityType = entry.Entity.GetType().Name,
                EntityId = ((BaseEntity)entry.Entity).Id,
                Action = entry.State.ToString().ToUpper(),
                Timestamp = DateTime.UtcNow,
                UserId = GetCurrentUserId() // This should be implemented to get the current user
            };

            if (entry.State == EntityState.Modified)
            {
                var originalValues = new Dictionary<string, object?>();
                var newValues = new Dictionary<string, object?>();

                foreach (var property in entry.OriginalValues.Properties)
                {
                    var originalValue = entry.OriginalValues[property];
                    var newValue = entry.CurrentValues[property];

                    if (!Equals(originalValue, newValue))
                    {
                        originalValues[property.Name] = originalValue;
                        newValues[property.Name] = newValue;
                    }
                }

                auditTrail.OldValues = JsonSerializer.Serialize(originalValues);
                auditTrail.NewValues = JsonSerializer.Serialize(newValues);
            }
            else if (entry.State == EntityState.Added)
            {
                var newValues = new Dictionary<string, object?>();
                foreach (var property in entry.CurrentValues.Properties)
                {
                    newValues[property.Name] = entry.CurrentValues[property];
                }
                auditTrail.NewValues = JsonSerializer.Serialize(newValues);
            }

            auditEntries.Add(auditTrail);
        }

        await AuditTrails.AddRangeAsync(auditEntries);
    }

    private void AddAuditTrail()
    {
        AddAuditTrailAsync().GetAwaiter().GetResult();
    }

    private Guid GetCurrentUserId()
    {
        // This should be implemented to get the current user from the HTTP context
        // For now, return a default value
        return Guid.Empty;
    }
}
