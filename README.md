# Enterprise Compliance & Incident Management Platform

A comprehensive, enterprise-grade web application for compliance tracking and incident management built with modern technologies and following enterprise best practices.

## 🏗️ Architecture

- **Backend**: .NET Core 8 Web API with Entity Framework Core
- **Frontend**: Angular 17+ with TypeScript and SCSS
- **Database**: SQL Server with normalized schema
- **Infrastructure**: Docker containers, AWS deployment ready
- **Authentication**: JWT-based authentication with role-based access control

## 🚀 Features

- **User Management**: Multi-role user authentication and authorization
- **Incident Management**: Create, track, assign, and resolve incidents
- **Compliance Tracking**: Monitor compliance standards and assessments
- **Document Management**: Upload and manage compliance documents
- **Dashboard**: Real-time metrics and reporting
- **Audit Trail**: Complete audit logging for all system activities
- **Notifications**: Email and in-app notifications
- **Role-based Access**: Granular permissions system
- **Data Export**: Export capabilities for reports and data

## 🛠️ Technology Stack

### Backend (.NET Core 8)
- ASP.NET Core Web API
- Entity Framework Core
- JWT Authentication
- AutoMapper
- FluentValidation
- Serilog
- BCrypt.Net

### Frontend (Angular 17+)
- Angular CLI
- TypeScript
- SCSS/Sass
- Reactive Forms
- RxJS
- Angular Material (planned)

### Database
- SQL Server
- Entity Framework Code-First
- Normalized schema design
- Proper indexing for performance

### DevOps & Infrastructure
- Docker & Docker Compose
- AWS deployment configurations
- CI/CD pipeline ready
- Environment-specific configurations

## 📋 Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or Docker SQL Server container

## 🏃‍♂️ Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd enterprise-compliance-incident-management
   ```

2. **Start the development environment**
   ```bash
   # Start only database and supporting services for development
   docker-compose -f docker/docker-compose.dev.yml up -d
   
   # Or start the complete application stack
   docker-compose -f docker/docker-compose.yml up -d
   ```

3. **Access the applications**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000
   - Swagger UI: http://localhost:5000
   - MailHog (Email testing): http://localhost:8025

### Option 2: Local Development

1. **Start the database**
   ```bash
   docker-compose -f docker/docker-compose.dev.yml up -d sqlserver-dev
   ```

2. **Run the backend**
   ```bash
   cd backend/ComplianceAPI
   dotnet restore
   dotnet run
   ```

3. **Run the frontend**
   ```bash
   cd frontend/compliance-ui
   npm install
   ng serve
   ```

## 📁 Project Structure

```
enterprise-compliance-incident-management/
├── backend/
│   └── ComplianceAPI/           # .NET Core Web API
│       ├── Controllers/         # API Controllers
│       ├── Data/               # DbContext and configurations
│       ├── Models/             # Domain entities and DTOs
│       ├── Services/           # Business logic services
│       └── Mappings/           # AutoMapper profiles
├── frontend/
│   └── compliance-ui/          # Angular application
│       ├── src/app/            # Angular components and services
│       ├── src/assets/         # Static assets
│       └── src/environments/   # Environment configurations
├── database/
│   └── scripts/                # SQL scripts for schema and seed data
├── docker/                     # Docker configurations
│   ├── Dockerfile.backend      # Backend container
│   ├── Dockerfile.frontend     # Frontend container
│   ├── docker-compose.yml      # Production compose
│   └── docker-compose.dev.yml  # Development compose
├── infrastructure/
│   └── aws/                    # AWS deployment configurations
├── docs/                       # Project documentation
└── tests/                      # Test projects
```

## 🔧 Configuration

### Backend Configuration (appsettings.json)

Key configuration sections:
- **ConnectionStrings**: Database connection
- **JWT**: Authentication settings
- **EmailSettings**: SMTP configuration
- **FileStorage**: Document upload settings

### Frontend Configuration

Environment-specific settings in `src/environments/`:
- `environment.ts` - Development
- `environment.prod.ts` - Production

## 🗄️ Database Schema

The application uses a normalized SQL Server database with the following main entities:

- **Users**: User accounts and authentication
- **Roles**: Role-based access control
- **Departments**: Organizational structure
- **Incidents**: Incident tracking and management
- **ComplianceStandards**: Compliance frameworks
- **ComplianceAssessments**: Assessment records
- **Documents**: File attachments
- **AuditTrail**: Complete audit logging
- **Notifications**: System notifications

## 🔐 Security Features

- JWT-based authentication
- Role-based authorization
- Password hashing with BCrypt
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Audit trail logging

## 📊 API Documentation

The API documentation is available via Swagger UI:
- Development: http://localhost:5000
- The API follows RESTful conventions
- JWT authentication required for protected endpoints
- Comprehensive request/response examples

## 🧪 Testing

### Backend Testing
```bash
cd backend/ComplianceAPI
dotnet test
```

### Frontend Testing
```bash
cd frontend/compliance-ui
npm test              # Unit tests
npm run e2e          # End-to-end tests
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and deploy with Docker Compose
docker-compose -f docker/docker-compose.yml up -d --build
```

### AWS Deployment
Deployment configurations are available in the `infrastructure/aws/` directory:
- ECS service definitions
- Load balancer configurations
- RDS database setup
- CloudFormation templates

## 📖 Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** following the coding standards in `.github/copilot-instructions.md`

3. **Test your changes**
   ```bash
   # Backend tests
   dotnet test
   
   # Frontend tests
   npm test
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards in `.github/copilot-instructions.md`
4. Write tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `docs/` directory

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes and updates.

---

**Built with ❤️ for enterprise compliance and incident management**
