<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Enterprise Compliance & Incident Management Platform

This is a full-stack enterprise-grade web application for compliance tracking and incident management.

## Architecture
- **Backend**: .NET Core 8 Web API with Entity Framework Core
- **Frontend**: Angular 17+ with TypeScript and SCSS
- **Database**: SQL Server with normalized schema
- **Infrastructure**: Docker containers, AWS deployment
- **Authentication**: JWT-based authentication with role-based access control

## Code Style Guidelines
- Use C# 12 features and modern async/await patterns
- Follow Clean Architecture principles with separation of concerns
- Implement proper error handling and logging
- Use Entity Framework Core with Code-First approach
- Angular components should follow OnPush change detection strategy
- Use reactive forms and observables for state management
- Implement proper TypeScript typing throughout
- Follow enterprise security best practices

## Key Features to Implement
- User authentication and authorization
- Incident creation, tracking, and resolution
- Compliance status monitoring and reporting
- Dashboard with real-time metrics
- Document management system
- Audit trail and logging
- Email notifications
- Role-based permissions
- Data export capabilities

## Database Design
- Normalize schema following 3NF principles
- Implement soft deletes for audit purposes
- Use proper indexing for performance
- Include created/modified timestamps on all entities
- Implement proper foreign key relationships

## Security Requirements
- JWT token-based authentication
- Password hashing with salt
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- Audit logging for sensitive operations
