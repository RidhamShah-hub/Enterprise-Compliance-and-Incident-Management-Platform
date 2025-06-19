import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '../../services/incident.service';

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'compliance' | 'incident' | 'risk' | 'user' | 'training' | 'audit';
}

interface GeneratedReport {
  id: string;
  title: string;
  type: string;
  generatedDate: Date;
  fileSize: string;
  status: 'Completed' | 'Generating' | 'Failed';
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class ReportsComponent implements OnInit {
  reportTemplates: ReportTemplate[] = [];
  recentReports: GeneratedReport[] = [];
  selectedReportType: string = '';
  startDate: string = '';
  endDate: string = '';
  selectedDepartment: string = 'all';
  
  departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'IT', label: 'IT' },
    { value: 'Security', label: 'Security' },
    { value: 'Legal', label: 'Legal' },
    { value: 'HR', label: 'HR' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' }
  ];

  constructor(private incidentService: IncidentService) {}

  ngOnInit() {
    this.loadReportTemplates();
    this.loadRecentReports();
    this.setDefaultDates();
  }

  loadReportTemplates() {
    this.reportTemplates = [
      {
        id: 'compliance-summary',
        title: 'Compliance Summary Report',
        description: 'Overall compliance status across all areas',
        icon: '📊',
        type: 'compliance'
      },
      {
        id: 'incident-analysis',
        title: 'Incident Analysis Report',
        description: 'Detailed analysis of incidents and trends',
        icon: '🚨',
        type: 'incident'
      },
      {
        id: 'risk-assessment',
        title: 'Risk Assessment Report',
        description: 'Risk evaluation and mitigation strategies',
        icon: '📈',
        type: 'risk'
      },
      {
        id: 'user-access',
        title: 'User Access Report',
        description: 'User permissions and access control audit',
        icon: '👥',
        type: 'user'
      },
      {
        id: 'training-compliance',
        title: 'Training Compliance Report',
        description: 'Employee training completion status',
        icon: '📚',
        type: 'training'
      },
      {
        id: 'audit-trail',
        title: 'Audit Trail Report',
        description: 'System access and change logs',
        icon: '🔍',
        type: 'audit'
      }
    ];
  }

  loadRecentReports() {
    this.recentReports = [
      {
        id: 'rpt-001',
        title: 'Q4 2024 Compliance Summary',
        type: 'Compliance Summary',
        generatedDate: new Date('2024-01-15'),
        fileSize: '2.4 MB',
        status: 'Completed'
      },
      {
        id: 'rpt-002',
        title: 'December Incident Analysis',
        type: 'Incident Analysis',
        generatedDate: new Date('2024-01-10'),
        fileSize: '1.8 MB',
        status: 'Completed'
      },
      {
        id: 'rpt-003',
        title: 'Security Training Report',
        type: 'Training Compliance',
        generatedDate: new Date('2024-01-05'),
        fileSize: '956 KB',
        status: 'Completed'
      }
    ];
  }

  setDefaultDates() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.endDate = today.toISOString().split('T')[0];
    this.startDate = firstDayOfMonth.toISOString().split('T')[0];
  }

  selectReportType(reportId: string) {
    this.selectedReportType = reportId;
  }

  generateReport() {
    if (!this.selectedReportType) {
      alert('Please select a report type first.');
      return;
    }

    const reportTemplate = this.reportTemplates.find(t => t.id === this.selectedReportType);
    if (!reportTemplate) return;

    // Generate mock report data based on type
    let reportData: any = {};
    
    switch (reportTemplate.type) {
      case 'incident':
        reportData = this.generateIncidentReportData();
        break;
      case 'compliance':
        reportData = this.generateComplianceReportData();
        break;
      case 'user':
        reportData = this.generateUserReportData();
        break;
      default:
        reportData = this.generateGenericReportData(reportTemplate.title);
    }

    // Create the report
    const newReport: GeneratedReport = {
      id: `rpt-${Date.now()}`,
      title: `${reportTemplate.title} - ${new Date().toLocaleDateString()}`,
      type: reportTemplate.title,
      generatedDate: new Date(),
      fileSize: this.calculateFileSize(reportData),
      status: 'Completed'
    };

    // Add to recent reports
    this.recentReports.unshift(newReport);

    // Generate and download the report
    this.downloadReport(newReport, reportData);
    
    alert(`Report "${reportTemplate.title}" generated successfully!`);
  }

  generateIncidentReportData() {
    const stats = this.incidentService.getIncidentStats();
    return {
      summary: {
        totalIncidents: stats.total,
        openIncidents: stats.open,
        resolvedIncidents: stats.resolved,
        highPriorityIncidents: stats.high
      },
      dateRange: `${this.startDate} to ${this.endDate}`,
      department: this.selectedDepartment,
      trends: 'Incident volume decreased by 15% compared to previous period',
      recommendations: [
        'Enhance security training for high-risk departments',
        'Implement proactive monitoring systems',
        'Review and update incident response procedures'
      ]
    };
  }

  generateComplianceReportData() {
    return {
      overallScore: '94%',
      areas: [
        { name: 'Data Protection', score: '96%', status: 'Compliant' },
        { name: 'Security Policies', score: '92%', status: 'Compliant' },
        { name: 'Access Control', score: '98%', status: 'Compliant' },
        { name: 'Documentation', score: '89%', status: 'At Risk' }
      ],
      dateRange: `${this.startDate} to ${this.endDate}`,
      department: this.selectedDepartment,
      summary: 'Organization maintains strong compliance posture with minor improvements needed in documentation processes.'
    };
  }

  generateUserReportData() {
    return {
      totalUsers: 24,
      activeUsers: 22,
      inactiveUsers: 2,
      roleDistribution: {
        'Administrator': 2,
        'Security Manager': 4,
        'Compliance Officer': 6,
        'Employee': 12
      },
      dateRange: `${this.startDate} to ${this.endDate}`,
      department: this.selectedDepartment,
      lastAuditDate: new Date().toLocaleDateString()
    };
  }

  generateGenericReportData(title: string) {
    return {
      title: title,
      generatedBy: 'Admin User',
      dateRange: `${this.startDate} to ${this.endDate}`,
      department: this.selectedDepartment,
      timestamp: new Date().toISOString(),
      data: 'Report content would be generated based on actual system data.'
    };
  }

  calculateFileSize(data: any): string {
    const jsonString = JSON.stringify(data);
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInKB = Math.round(sizeInBytes / 1024);
    
    if (sizeInKB > 1024) {
      return `${(sizeInKB / 1024).toFixed(1)} MB`;
    }
    return `${sizeInKB} KB`;
  }

  downloadReport(report: GeneratedReport, data: any) {
    // Create enhanced PDF-like content (in real app, use a PDF library like jsPDF)
    const content = this.formatReportContent(report, data);
    
    // Create HTML content for better formatting
    const htmlContent = this.createHTMLReport(report, data);
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  createHTMLReport(report: GeneratedReport, data: any): string {
    const reportTemplate = this.reportTemplates.find(t => t.title === report.type.split(' - ')[0]);
    const reportType = reportTemplate?.type || 'general';
    
    let contentHtml = '';
    
    switch (reportType) {
      case 'incident':
        contentHtml = this.generateIncidentHTML(data);
        break;
      case 'compliance':
        contentHtml = this.generateComplianceHTML(data);
        break;
      case 'user':
        contentHtml = this.generateUserHTML(data);
        break;
      default:
        contentHtml = this.generateGenericHTML(data);
    }
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${report.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #3b82f6; margin: 0; }
        .header .subtitle { color: #666; margin: 5px 0; }
        .section { margin: 30px 0; }
        .section h2 { color: #374151; border-left: 4px solid #3b82f6; padding-left: 12px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 2em; font-weight: bold; color: #3b82f6; }
        .stat-label { color: #666; margin-top: 5px; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .table th { background: #f9fafb; font-weight: bold; }
        .recommendations { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${report.title}</h1>
        <div class="subtitle">Generated on ${report.generatedDate.toLocaleDateString()}</div>
        <div class="subtitle">Date Range: ${this.startDate} to ${this.endDate}</div>
        <div class="subtitle">Department: ${this.selectedDepartment === 'all' ? 'All Departments' : this.selectedDepartment}</div>
    </div>
    
    ${contentHtml}
    
    <div class="footer">
        <p>This report was automatically generated by the Enterprise Compliance System.</p>
        <p>For questions or support, contact the compliance team.</p>
        <p>Report ID: ${report.id} | Generated: ${new Date().toISOString()}</p>
    </div>
</body>
</html>
    `;
  }

  generateIncidentHTML(data: any): string {
    return `
    <div class="section">
        <h2>Executive Summary</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${data.summary.totalIncidents}</div>
                <div class="stat-label">Total Incidents</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.summary.openIncidents}</div>
                <div class="stat-label">Open Incidents</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.summary.resolvedIncidents}</div>
                <div class="stat-label">Resolved Incidents</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.summary.highPriorityIncidents}</div>
                <div class="stat-label">High Priority</div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h2>Trends Analysis</h2>
        <p>${data.trends}</p>
    </div>
    
    <div class="section">
        <h2>Recommendations</h2>
        <div class="recommendations">
            <ul>
                ${data.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    </div>
    `;
  }

  generateComplianceHTML(data: any): string {
    return `
    <div class="section">
        <h2>Overall Compliance Score</h2>
        <div class="stat-card" style="max-width: 300px; margin: 0 auto;">
            <div class="stat-value">${data.overallScore}</div>
            <div class="stat-label">Compliance Rating</div>
        </div>
    </div>
    
    <div class="section">
        <h2>Compliance Areas</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Area</th>
                    <th>Score</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${data.areas.map((area: any) => `
                    <tr>
                        <td>${area.name}</td>
                        <td>${area.score}</td>
                        <td>${area.status}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h2>Summary</h2>
        <p>${data.summary}</p>
    </div>
    `;
  }

  generateUserHTML(data: any): string {
    return `
    <div class="section">
        <h2>User Statistics</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${data.totalUsers}</div>
                <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.activeUsers}</div>
                <div class="stat-label">Active Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.inactiveUsers}</div>
                <div class="stat-label">Inactive Users</div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h2>Role Distribution</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Role</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(data.roleDistribution).map(([role, count]) => `
                    <tr>
                        <td>${role}</td>
                        <td>${count}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h2>Audit Information</h2>
        <p><strong>Last Audit Date:</strong> ${data.lastAuditDate}</p>
    </div>
    `;
  }

  generateGenericHTML(data: any): string {
    return `
    <div class="section">
        <h2>Report Details</h2>
        <table class="table">
            <tbody>
                ${Object.entries(data).map(([key, value]) => `
                    <tr>
                        <td><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong></td>
                        <td>${value}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    `;
  }

  formatReportContent(report: GeneratedReport, data: any): string {
    return `
ENTERPRISE COMPLIANCE SYSTEM
${report.title}

Generated: ${report.generatedDate.toLocaleDateString()}
Date Range: ${this.startDate} to ${this.endDate}
Department: ${this.selectedDepartment === 'all' ? 'All Departments' : this.selectedDepartment}

${JSON.stringify(data, null, 2)}

---
This report was automatically generated by the Enterprise Compliance System.
For questions or support, contact the compliance team.
    `.trim();
  }

  downloadExistingReport(report: GeneratedReport) {
    // Simulate downloading an existing report
    const mockData = this.generateGenericReportData(report.title);
    this.downloadReport(report, mockData);
    alert(`Downloading "${report.title}"...`);
  }

  deleteReport(report: GeneratedReport) {
    if (confirm(`Are you sure you want to delete "${report.title}"?`)) {
      this.recentReports = this.recentReports.filter(r => r.id !== report.id);
      alert('Report deleted successfully.');
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'Generating': return 'status-generating';
      case 'Failed': return 'status-failed';
      default: return '';
    }
  }
}
