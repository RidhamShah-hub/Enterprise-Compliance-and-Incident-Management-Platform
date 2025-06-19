import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ComplianceArea {
  id: string;
  name: string;
  score: number;
  status: 'Compliant' | 'At Risk' | 'Non-Compliant';
  lastAssessment: Date;
  nextAssessment: Date;
  requirements: number;
  completedRequirements: number;
  description: string;
}

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  status: 'Complete' | 'In Progress' | 'Not Started' | 'Overdue';
  dueDate: Date;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
  area: string;
}

@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compliance.html',
  styleUrl: './compliance.scss'
})
export class ComplianceComponent implements OnInit {
  overallScore = 94;
  complianceAreas: ComplianceArea[] = [];
  requirements: ComplianceRequirement[] = [];
  selectedArea = 'all';

  ngOnInit() {
    this.loadComplianceData();
  }

  loadComplianceData() {
    this.complianceAreas = [
      {
        id: '1',
        name: 'Data Protection',
        score: 96,
        status: 'Compliant',
        lastAssessment: new Date('2024-01-10'),
        nextAssessment: new Date('2024-04-10'),
        requirements: 25,
        completedRequirements: 24,
        description: 'GDPR and data privacy compliance requirements'
      },
      {
        id: '2',
        name: 'Security Policies',
        score: 92,
        status: 'Compliant',
        lastAssessment: new Date('2024-01-08'),
        nextAssessment: new Date('2024-04-08'),
        requirements: 30,
        completedRequirements: 28,
        description: 'Information security policies and procedures'
      },
      {
        id: '3',
        name: 'Access Control',
        score: 98,
        status: 'Compliant',
        lastAssessment: new Date('2024-01-12'),
        nextAssessment: new Date('2024-04-12'),
        requirements: 15,
        completedRequirements: 15,
        description: 'User access management and authorization controls'
      },
      {
        id: '4',
        name: 'Documentation',
        score: 89,
        status: 'At Risk',
        lastAssessment: new Date('2024-01-05'),
        nextAssessment: new Date('2024-04-05'),
        requirements: 20,
        completedRequirements: 18,
        description: 'Policy documentation and record keeping'
      },
      {
        id: '5',
        name: 'Training & Awareness',
        score: 85,
        status: 'At Risk',
        lastAssessment: new Date('2024-01-01'),
        nextAssessment: new Date('2024-04-01'),
        requirements: 12,
        completedRequirements: 10,
        description: 'Employee training and security awareness programs'
      }
    ];

    this.requirements = [
      {
        id: '1',
        title: 'Annual Security Training Completion',
        description: 'All employees must complete annual security awareness training',
        status: 'Overdue',
        dueDate: new Date('2024-01-01'),
        assignedTo: 'HR Department',
        priority: 'High',
        area: 'Training & Awareness'
      },
      {
        id: '2',
        title: 'Password Policy Update',
        description: 'Update password policy to include multi-factor authentication requirements',
        status: 'In Progress',
        dueDate: new Date('2024-02-15'),
        assignedTo: 'IT Security',
        priority: 'High',
        area: 'Security Policies'
      },
      {
        id: '3',
        title: 'Data Processing Records Review',
        description: 'Quarterly review of data processing activities and records',
        status: 'Complete',
        dueDate: new Date('2024-01-31'),
        assignedTo: 'Privacy Officer',
        priority: 'Medium',
        area: 'Data Protection'
      },
      {
        id: '4',
        title: 'Access Rights Audit',
        description: 'Conduct comprehensive audit of user access rights and permissions',
        status: 'In Progress',
        dueDate: new Date('2024-02-28'),
        assignedTo: 'Security Team',
        priority: 'Medium',
        area: 'Access Control'
      },
      {
        id: '5',
        title: 'Policy Documentation Update',
        description: 'Update and review all security policy documentation',
        status: 'Not Started',
        dueDate: new Date('2024-03-15'),
        assignedTo: 'Legal Team',
        priority: 'Low',
        area: 'Documentation'
      }
    ];
  }

  // Getter methods for template calculations
  get overdueRequirements(): number {
    return this.requirements.filter(r => r.status === 'Overdue').length;
  }

  get inProgressRequirements(): number {
    return this.requirements.filter(r => r.status === 'In Progress').length;
  }

  get completeRequirements(): number {
    return this.requirements.filter(r => r.status === 'Complete').length;
  }

  get completionPercentage(): number {
    if (this.requirements.length === 0) return 0;
    return Math.round((this.completeRequirements / this.requirements.length) * 100);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Compliant': return 'status-compliant';
      case 'At Risk': return 'status-at-risk';
      case 'Non-Compliant': return 'status-non-compliant';
      case 'Complete': return 'status-complete';
      case 'In Progress': return 'status-progress';
      case 'Not Started': return 'status-not-started';
      case 'Overdue': return 'status-overdue';
      default: return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  }

  getScoreClass(score: number): string {
    if (score >= 95) return 'score-excellent';
    if (score >= 90) return 'score-good';
    if (score >= 80) return 'score-fair';
    return 'score-poor';
  }

  getFilteredRequirements() {
    if (this.selectedArea === 'all') {
      return this.requirements;
    }
    return this.requirements.filter(req => req.area === this.selectedArea);
  }

  selectArea(areaName: string) {
    this.selectedArea = areaName;
  }
}
