import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IncidentService, Incident } from '../../services/incident.service';
import { AuthService } from '../../services/auth.service';

interface MetricCard {
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
}

interface RecentIncident {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdDate: Date;
  createdByName: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  
  constructor(
    private router: Router,
    private incidentService: IncidentService,
    private authService: AuthService
  ) {}

  // Modal states
  showCreateIncidentModal = false;
  showReportModal = false;

  // Form data
  newIncident = {
    title: '',
    description: '',
    priority: 'Medium',
    assignedTo: ''
  };

  metrics: MetricCard[] = [
    {
      title: 'Active Incidents',
      value: 23,
      change: -2,
      changeType: 'decrease',
      icon: '⚠️'
    },
    {
      title: 'Compliance Score',
      value: 94,
      change: 3,
      changeType: 'increase',
      icon: '✅'
    },
    {
      title: 'Open Tasks',
      value: 156,
      change: 12,
      changeType: 'increase',
      icon: '📋'
    },
    {
      title: 'Risk Assessments',
      value: 8,
      change: 1,
      changeType: 'increase',
      icon: '🔍'
    }
  ];

  recentIncidents: RecentIncident[] = [];

  ngOnInit() {
    this.loadIncidents();
    this.updateMetrics();
  }

  loadIncidents() {
    this.incidentService.getAllIncidents().subscribe(incidents => {
      // Convert to recent incidents format and take the 4 most recent
      this.recentIncidents = incidents
        .slice(0, 4)
        .map(incident => ({
          id: incident.id,
          title: incident.title,
          priority: incident.priority,
          status: incident.status,
          createdDate: incident.createdDate,
          createdByName: incident.createdByName
        }));
    });
  }

  updateMetrics() {
    const stats = this.incidentService.getIncidentStats();
    this.metrics[0].value = stats.open + stats.inProgress; // Active incidents
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-progress';
      case 'Resolved': return 'status-resolved';
      default: return '';
    }
  }

  // Quick Actions Methods
  createIncident() {
    this.showCreateIncidentModal = true;
    // Alternative: this.router.navigate(['/incidents']);
  }

  generateReport() {
    this.showReportModal = true;
    // Alternative: this.router.navigate(['/reports']);
  }

  startRiskAssessment() {
    this.router.navigate(['/reports']);
    // In a real app, this could open a risk assessment form
  }

  openSystemSettings() {
    this.router.navigate(['/settings']);
  }

  viewCalendar() {
    // In a real app, this could open a calendar view or task management page
    alert('Calendar view - Feature coming soon!');
  }

  viewAllIncidents() {
    this.router.navigate(['/incidents']);
  }

  viewComplianceDetails() {
    this.router.navigate(['/compliance']);
  }

  viewIncident(incidentId: string) {
    this.router.navigate(['/incidents', incidentId]);
  }

  // Modal Methods
  closeCreateIncidentModal() {
    this.showCreateIncidentModal = false;
    this.resetIncidentForm();
  }

  closeReportModal() {
    this.showReportModal = false;
  }

  resetIncidentForm() {
    this.newIncident = {
      title: '',
      description: '',
      priority: 'Medium',
      assignedTo: ''
    };
  }

  submitIncident() {
    if (this.newIncident.title && this.newIncident.description) {
      this.incidentService.createIncident({
        title: this.newIncident.title,
        description: this.newIncident.description,
        priority: this.newIncident.priority as 'High' | 'Medium' | 'Low',
        assignedTo: this.newIncident.assignedTo || 'Unassigned'
      }).subscribe({
        next: (incident) => {
          console.log('Incident created:', incident);
          alert(`Incident "${incident.title}" created successfully!`);
          this.closeCreateIncidentModal();
          this.loadIncidents(); // Refresh the incidents list
          this.updateMetrics(); // Update dashboard metrics
          
          // Optionally navigate to incidents page
          setTimeout(() => {
            this.router.navigate(['/incidents']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating incident:', error);
          alert('Error creating incident. Please try again.');
        }
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }

  generateSelectedReport() {
    // In a real app, this would generate the report
    alert('Report generation started! You will be notified when complete.');
    this.closeReportModal();
    
    // Navigate to reports page
    setTimeout(() => {
      this.router.navigate(['/reports']);
    }, 1000);
  }
}
