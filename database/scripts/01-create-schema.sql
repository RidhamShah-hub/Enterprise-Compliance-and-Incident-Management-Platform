-- Enterprise Compliance & Incident Management Platform Database Schema
-- SQL Server Database Schema (Code-First approach with EF Core)
-- This script is for reference and documentation purposes

USE [ComplianceDB]
GO

-- Users table for authentication and user management
CREATE TABLE [dbo].[Users] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Username] NVARCHAR(50) NOT NULL UNIQUE,
    [Email] NVARCHAR(255) NOT NULL UNIQUE,
    [PasswordHash] NVARCHAR(255) NOT NULL,
    [Salt] NVARCHAR(255) NOT NULL,
    [FirstName] NVARCHAR(100) NOT NULL,
    [LastName] NVARCHAR(100) NOT NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [ModifiedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [ModifiedBy] UNIQUEIDENTIFIER NULL
);

-- Roles table for role-based access control
CREATE TABLE [dbo].[Roles] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(50) NOT NULL UNIQUE,
    [Description] NVARCHAR(255) NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [ModifiedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [ModifiedBy] UNIQUEIDENTIFIER NULL
);

-- User-Role mapping table (many-to-many)
CREATE TABLE [dbo].[UserRoles] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [RoleId] UNIQUEIDENTIFIER NOT NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]),
    FOREIGN KEY ([RoleId]) REFERENCES [Roles]([Id]),
    UNIQUE([UserId], [RoleId])
);

-- Departments table for organizational structure
CREATE TABLE [dbo].[Departments] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(255) NULL,
    [ManagerId] UNIQUEIDENTIFIER NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [ModifiedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [ModifiedBy] UNIQUEIDENTIFIER NULL,
    FOREIGN KEY ([ManagerId]) REFERENCES [Users]([Id])
);

-- Incident Categories for classification
CREATE TABLE [dbo].[IncidentCategories] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(255) NULL,
    [SeverityLevel] INT NOT NULL DEFAULT 1, -- 1=Low, 2=Medium, 3=High, 4=Critical
    [IsActive] BIT NOT NULL DEFAULT 1,
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [ModifiedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [ModifiedBy] UNIQUEIDENTIFIER NULL
);

-- Incidents table for incident management
CREATE TABLE [dbo].[Incidents] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [IncidentNumber] NVARCHAR(50) NOT NULL UNIQUE,
    [Title] NVARCHAR(255) NOT NULL,
    [Description] NVARCHAR(MAX) NOT NULL,
    [CategoryId] UNIQUEIDENTIFIER NOT NULL,
    [Priority] INT NOT NULL DEFAULT 2, -- 1=Low, 2=Medium, 3=High, 4=Critical
    [Status] INT NOT NULL DEFAULT 1, -- 1=Open, 2=InProgress, 3=Resolved, 4=Closed
    [ReportedById] UNIQUEIDENTIFIER NOT NULL,
    [AssignedToId] UNIQUEIDENTIFIER NULL,
    [DepartmentId] UNIQUEIDENTIFIER NULL,
    [IncidentDate] DATETIME2 NOT NULL,
    [ResolutionDate] DATETIME2 NULL,
    [ResolutionNotes] NVARCHAR(MAX) NULL,
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [ModifiedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [ModifiedBy] UNIQUEIDENTIFIER NULL,
    FOREIGN KEY ([CategoryId]) REFERENCES [IncidentCategories]([Id]),
    FOREIGN KEY ([ReportedById]) REFERENCES [Users]([Id]),
    FOREIGN KEY ([AssignedToId]) REFERENCES [Users]([Id]),
    FOREIGN KEY ([DepartmentId]) REFERENCES [Departments]([Id])
);

-- Compliance Standards table
CREATE TABLE [dbo].[ComplianceStandards] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(255) NULL,
    [Version] NVARCHAR(20) NULL,
    [EffectiveDate] DATE NOT NULL,
    [ExpirationDate] DATE NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [ModifiedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [ModifiedBy] UNIQUEIDENTIFIER NULL
);

-- Compliance Assessments table
CREATE TABLE [dbo].[ComplianceAssessments] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [StandardId] UNIQUEIDENTIFIER NOT NULL,
    [DepartmentId] UNIQUEIDENTIFIER NOT NULL,
    [AssessmentDate] DATE NOT NULL,
    [Status] INT NOT NULL DEFAULT 1, -- 1=Pending, 2=InProgress, 3=Completed, 4=Failed
    [Score] DECIMAL(5,2) NULL, -- Percentage score
    [AssessedById] UNIQUEIDENTIFIER NOT NULL,
    [Notes] NVARCHAR(MAX) NULL,
    [NextAssessmentDate] DATE NULL,
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [ModifiedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [ModifiedBy] UNIQUEIDENTIFIER NULL,
    FOREIGN KEY ([StandardId]) REFERENCES [ComplianceStandards]([Id]),
    FOREIGN KEY ([DepartmentId]) REFERENCES [Departments]([Id]),
    FOREIGN KEY ([AssessedById]) REFERENCES [Users]([Id])
);

-- Documents table for document management
CREATE TABLE [dbo].[Documents] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(255) NOT NULL,
    [Description] NVARCHAR(500) NULL,
    [FileName] NVARCHAR(255) NOT NULL,
    [FilePath] NVARCHAR(500) NOT NULL,
    [FileSize] BIGINT NOT NULL,
    [ContentType] NVARCHAR(100) NOT NULL,
    [DocumentType] INT NOT NULL DEFAULT 1, -- 1=Policy, 2=Procedure, 3=Evidence, 4=Report
    [RelatedEntityType] NVARCHAR(50) NULL, -- Incident, Assessment, etc.
    [RelatedEntityId] UNIQUEIDENTIFIER NULL,
    [UploadedById] UNIQUEIDENTIFIER NOT NULL,
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [ModifiedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [ModifiedBy] UNIQUEIDENTIFIER NULL,
    FOREIGN KEY ([UploadedById]) REFERENCES [Users]([Id])
);

-- Audit Trail table for tracking all changes
CREATE TABLE [dbo].[AuditTrail] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [EntityType] NVARCHAR(100) NOT NULL,
    [EntityId] UNIQUEIDENTIFIER NOT NULL,
    [Action] NVARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE
    [OldValues] NVARCHAR(MAX) NULL, -- JSON
    [NewValues] NVARCHAR(MAX) NULL, -- JSON
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [IPAddress] NVARCHAR(45) NULL,
    [UserAgent] NVARCHAR(500) NULL,
    [Timestamp] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY ([UserId]) REFERENCES [Users]([Id])
);

-- Notifications table for system notifications
CREATE TABLE [dbo].[Notifications] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [Title] NVARCHAR(255) NOT NULL,
    [Message] NVARCHAR(MAX) NOT NULL,
    [Type] INT NOT NULL DEFAULT 1, -- 1=Info, 2=Warning, 3=Error, 4=Success
    [IsRead] BIT NOT NULL DEFAULT 0,
    [RelatedEntityType] NVARCHAR(50) NULL,
    [RelatedEntityId] UNIQUEIDENTIFIER NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY ([UserId]) REFERENCES [Users]([Id])
);

-- Create indexes for better performance
CREATE INDEX IX_Users_Email ON [Users]([Email]);
CREATE INDEX IX_Users_Username ON [Users]([Username]);
CREATE INDEX IX_Users_IsActive ON [Users]([IsActive]);
CREATE INDEX IX_Incidents_Status ON [Incidents]([Status]);
CREATE INDEX IX_Incidents_Priority ON [Incidents]([Priority]);
CREATE INDEX IX_Incidents_IncidentDate ON [Incidents]([IncidentDate]);
CREATE INDEX IX_Incidents_AssignedToId ON [Incidents]([AssignedToId]);
CREATE INDEX IX_ComplianceAssessments_Status ON [ComplianceAssessments]([Status]);
CREATE INDEX IX_ComplianceAssessments_AssessmentDate ON [ComplianceAssessments]([AssessmentDate]);
CREATE INDEX IX_AuditTrail_EntityType_EntityId ON [AuditTrail]([EntityType], [EntityId]);
CREATE INDEX IX_AuditTrail_Timestamp ON [AuditTrail]([Timestamp]);
CREATE INDEX IX_Notifications_UserId_IsRead ON [Notifications]([UserId], [IsRead]);
