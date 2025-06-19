export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  createdAt: Date;
  modifiedAt: Date;
  roles: Role[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface Incident {
  id: string;
  incidentNumber: string;
  title: string;
  description: string;
  category: IncidentCategory;
  priority: number;
  priorityName: string;
  status: number;
  statusName: string;
  reportedBy: User;
  assignedTo?: User;
  department?: Department;
  incidentDate: Date;
  resolutionDate?: Date;
  resolutionNotes?: string;
  createdAt: Date;
  modifiedAt: Date;
  documents: Document[];
}

export interface IncidentCategory {
  id: string;
  name: string;
  description?: string;
  severityLevel: number;
  severityLevelName: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  manager?: User;
  isActive: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

export interface ComplianceAssessment {
  id: string;
  standard: ComplianceStandard;
  department: Department;
  assessmentDate: Date;
  status: number;
  statusName: string;
  score?: number;
  assessedBy: User;
  notes?: string;
  nextAssessmentDate?: Date;
  createdAt: Date;
  modifiedAt: Date;
  documents: Document[];
}

export interface ComplianceStandard {
  id: string;
  name: string;
  description?: string;
  version?: string;
  effectiveDate: Date;
  expirationDate?: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  documentType: number;
  documentTypeName: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  uploadedBy: User;
  createdAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: number;
  typeName: string;
  isRead: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt: Date;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardSummary {
  totalIncidents: number;
  openIncidents: number;
  highPriorityIncidents: number;
  overdueIncidents: number;
  complianceAssessmentsDue: number;
  activeUsers: number;
  totalDepartments: number;
  averageComplianceScore: number;
  incidentTrends: IncidentTrend[];
  complianceStatus: ComplianceStatus[];
}

export interface IncidentTrend {
  date: Date;
  incidentCount: number;
  resolvedCount: number;
}

export interface ComplianceStatus {
  standardName: string;
  departmentName: string;
  score?: number;
  lastAssessmentDate?: Date;
  nextAssessmentDate?: Date;
  status: string;
}
