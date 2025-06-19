-- Seed Data for Enterprise Compliance & Incident Management Platform
-- This script provides initial data for development and testing

USE [ComplianceDB]
GO

-- Insert default roles
INSERT INTO [dbo].[Roles] ([Id], [Name], [Description], [CreatedAt])
VALUES 
    (NEWID(), 'Administrator', 'Full system access and user management', GETUTCDATE()),
    (NEWID(), 'Compliance Manager', 'Manage compliance assessments and standards', GETUTCDATE()),
    (NEWID(), 'Incident Manager', 'Manage incidents and assign to users', GETUTCDATE()),
    (NEWID(), 'Department Manager', 'View and manage department-specific data', GETUTCDATE()),
    (NEWID(), 'Employee', 'Basic user access for reporting incidents', GETUTCDATE()),
    (NEWID(), 'Auditor', 'Read-only access for audit purposes', GETUTCDATE());

-- Insert default departments
INSERT INTO [dbo].[Departments] ([Id], [Name], [Description], [CreatedAt])
VALUES 
    (NEWID(), 'Information Technology', 'IT operations and security', GETUTCDATE()),
    (NEWID(), 'Human Resources', 'Personnel and employee relations', GETUTCDATE()),
    (NEWID(), 'Finance', 'Financial operations and compliance', GETUTCDATE()),
    (NEWID(), 'Legal', 'Legal affairs and regulatory compliance', GETUTCDATE()),
    (NEWID(), 'Operations', 'Day-to-day business operations', GETUTCDATE()),
    (NEWID(), 'Quality Assurance', 'Quality control and assurance', GETUTCDATE()),
    (NEWID(), 'Risk Management', 'Enterprise risk assessment and mitigation', GETUTCDATE());

-- Insert incident categories
INSERT INTO [dbo].[IncidentCategories] ([Id], [Name], [Description], [SeverityLevel], [CreatedAt])
VALUES 
    (NEWID(), 'Security Breach', 'Unauthorized access or data compromise', 4, GETUTCDATE()),
    (NEWID(), 'Data Privacy', 'Personal data handling violations', 3, GETUTCDATE()),
    (NEWID(), 'System Outage', 'IT system downtime or unavailability', 3, GETUTCDATE()),
    (NEWID(), 'Workplace Safety', 'Employee safety and health incidents', 3, GETUTCDATE()),
    (NEWID(), 'Financial Irregularity', 'Financial process or control violations', 4, GETUTCDATE()),
    (NEWID(), 'Regulatory Violation', 'Non-compliance with regulations', 4, GETUTCDATE()),
    (NEWID(), 'Process Failure', 'Business process breakdowns', 2, GETUTCDATE()),
    (NEWID(), 'Equipment Malfunction', 'Hardware or equipment failures', 2, GETUTCDATE()),
    (NEWID(), 'Documentation Issue', 'Missing or incorrect documentation', 1, GETUTCDATE()),
    (NEWID(), 'Training Gap', 'Employee training deficiencies', 1, GETUTCDATE());

-- Insert compliance standards
INSERT INTO [dbo].[ComplianceStandards] ([Id], [Name], [Description], [Version], [EffectiveDate], [CreatedAt])
VALUES 
    (NEWID(), 'ISO 27001', 'Information Security Management System', '2013', '2023-01-01', GETUTCDATE()),
    (NEWID(), 'SOX', 'Sarbanes-Oxley Act compliance', '2002', '2023-01-01', GETUTCDATE()),
    (NEWID(), 'GDPR', 'General Data Protection Regulation', '2018', '2023-01-01', GETUTCDATE()),
    (NEWID(), 'HIPAA', 'Health Insurance Portability and Accountability Act', '1996', '2023-01-01', GETUTCDATE()),
    (NEWID(), 'PCI DSS', 'Payment Card Industry Data Security Standard', 'v4.0', '2023-01-01', GETUTCDATE()),
    (NEWID(), 'ISO 9001', 'Quality Management System', '2015', '2023-01-01', GETUTCDATE()),
    (NEWID(), 'NIST Cybersecurity Framework', 'Cybersecurity risk management', 'v1.1', '2023-01-01', GETUTCDATE()),
    (NEWID(), 'OSHA', 'Occupational Safety and Health Administration', '2023', '2023-01-01', GETUTCDATE());

-- Create default admin user (password: Admin123!)
-- Note: In production, this should be created through proper user registration
DECLARE @AdminUserId UNIQUEIDENTIFIER = NEWID();
DECLARE @AdminRoleId UNIQUEIDENTIFIER = (SELECT TOP 1 [Id] FROM [Roles] WHERE [Name] = 'Administrator');

INSERT INTO [dbo].[Users] ([Id], [Username], [Email], [PasswordHash], [Salt], [FirstName], [LastName], [CreatedAt])
VALUES 
    (@AdminUserId, 'admin', 'admin@company.com', 
     -- This is a placeholder hash - implement proper password hashing in the application
     'AQAAAAEAACcQAAAAEKKjUs8HZ9KrMv9Kc8LFUa2Gb0Sf6s+pqX1wV2E3oQ4N5p8R7t9Y0a2D5f8H1j4K7m0P', 
     'RandomSaltValue123', 'System', 'Administrator', GETUTCDATE());

-- Assign admin role to admin user
INSERT INTO [dbo].[UserRoles] ([Id], [UserId], [RoleId], [CreatedAt])
VALUES (NEWID(), @AdminUserId, @AdminRoleId, GETUTCDATE());

-- Insert sample users for demonstration
DECLARE @ITManagerId UNIQUEIDENTIFIER = NEWID();
DECLARE @HRManagerId UNIQUEIDENTIFIER = NEWID();
DECLARE @ComplianceManagerRoleId UNIQUEIDENTIFIER = (SELECT TOP 1 [Id] FROM [Roles] WHERE [Name] = 'Compliance Manager');
DECLARE @DeptManagerRoleId UNIQUEIDENTIFIER = (SELECT TOP 1 [Id] FROM [Roles] WHERE [Name] = 'Department Manager');

INSERT INTO [dbo].[Users] ([Id], [Username], [Email], [PasswordHash], [Salt], [FirstName], [LastName], [CreatedAt])
VALUES 
    (@ITManagerId, 'john.doe', 'john.doe@company.com', 
     'AQAAAAEAACcQAAAAEKKjUs8HZ9KrMv9Kc8LFUa2Gb0Sf6s+pqX1wV2E3oQ4N5p8R7t9Y0a2D5f8H1j4K7m0P', 
     'RandomSaltValue456', 'John', 'Doe', GETUTCDATE()),
    (@HRManagerId, 'jane.smith', 'jane.smith@company.com', 
     'AQAAAAEAACcQAAAAEKKjUs8HZ9KrMv9Kc8LFUa2Gb0Sf6s+pqX1wV2E3oQ4N5p8R7t9Y0a2D5f8H1j4K7m0P', 
     'RandomSaltValue789', 'Jane', 'Smith', GETUTCDATE());

-- Assign roles to sample users
INSERT INTO [dbo].[UserRoles] ([Id], [UserId], [RoleId], [CreatedAt])
VALUES 
    (NEWID(), @ITManagerId, @ComplianceManagerRoleId, GETUTCDATE()),
    (NEWID(), @ITManagerId, @DeptManagerRoleId, GETUTCDATE()),
    (NEWID(), @HRManagerId, @DeptManagerRoleId, GETUTCDATE());

-- Update departments with managers
DECLARE @ITDeptId UNIQUEIDENTIFIER = (SELECT TOP 1 [Id] FROM [Departments] WHERE [Name] = 'Information Technology');
DECLARE @HRDeptId UNIQUEIDENTIFIER = (SELECT TOP 1 [Id] FROM [Departments] WHERE [Name] = 'Human Resources');

UPDATE [dbo].[Departments] SET [ManagerId] = @ITManagerId, [ModifiedAt] = GETUTCDATE() WHERE [Id] = @ITDeptId;
UPDATE [dbo].[Departments] SET [ManagerId] = @HRManagerId, [ModifiedAt] = GETUTCDATE() WHERE [Id] = @HRDeptId;

-- Insert sample incidents for demonstration
DECLARE @SecurityCategoryId UNIQUEIDENTIFIER = (SELECT TOP 1 [Id] FROM [IncidentCategories] WHERE [Name] = 'Security Breach');
DECLARE @SystemOutageCategoryId UNIQUEIDENTIFIER = (SELECT TOP 1 [Id] FROM [IncidentCategories] WHERE [Name] = 'System Outage');

INSERT INTO [dbo].[Incidents] ([Id], [IncidentNumber], [Title], [Description], [CategoryId], [Priority], [Status], [ReportedById], [AssignedToId], [DepartmentId], [IncidentDate], [CreatedAt])
VALUES 
    (NEWID(), 'INC-2024-001', 'Suspicious Login Attempts', 
     'Multiple failed login attempts detected from unknown IP addresses', 
     @SecurityCategoryId, 3, 2, @AdminUserId, @ITManagerId, @ITDeptId, GETUTCDATE(), GETUTCDATE()),
    (NEWID(), 'INC-2024-002', 'Email Server Downtime', 
     'Email server experiencing intermittent connectivity issues', 
     @SystemOutageCategoryId, 2, 1, @ITManagerId, @ITManagerId, @ITDeptId, GETUTCDATE(), GETUTCDATE());

-- Insert sample compliance assessments
DECLARE @ISO27001Id UNIQUEIDENTIFIER = (SELECT TOP 1 [Id] FROM [ComplianceStandards] WHERE [Name] = 'ISO 27001');
DECLARE @GDPRId UNIQUEIDENTIFIER = (SELECT TOP 1 [Id] FROM [ComplianceStandards] WHERE [Name] = 'GDPR');

INSERT INTO [dbo].[ComplianceAssessments] ([Id], [StandardId], [DepartmentId], [AssessmentDate], [Status], [Score], [AssessedById], [Notes], [NextAssessmentDate], [CreatedAt])
VALUES 
    (NEWID(), @ISO27001Id, @ITDeptId, GETUTCDATE(), 3, 85.50, @ITManagerId, 
     'Good overall compliance with minor improvements needed in access controls', 
     DATEADD(MONTH, 6, GETUTCDATE()), GETUTCDATE()),
    (NEWID(), @GDPRId, @HRDeptId, GETUTCDATE(), 2, NULL, @HRManagerId, 
     'Assessment in progress - reviewing data processing procedures', 
     DATEADD(MONTH, 3, GETUTCDATE()), GETUTCDATE());

-- Insert sample notifications
INSERT INTO [dbo].[Notifications] ([Id], [UserId], [Title], [Message], [Type], [RelatedEntityType], [CreatedAt])
VALUES 
    (NEWID(), @AdminUserId, 'New Incident Reported', 
     'A new security incident has been reported and requires immediate attention', 
     2, 'Incident', GETUTCDATE()),
    (NEWID(), @ITManagerId, 'Compliance Assessment Due', 
     'ISO 27001 compliance assessment is due for review within 30 days', 
     1, 'ComplianceAssessment', GETUTCDATE());

PRINT 'Seed data inserted successfully!';
