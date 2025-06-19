import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncidentService, Incident } from '../../services/incident.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incidents.html',
  styleUrl: './incidents.scss'
})
export class IncidentsComponent implements OnInit {
  incidents: Incident[] = [];
  filteredIncidents: Incident[] = [];
  showCreateForm = false;
  incidentForm: FormGroup;
  selectedFilter = 'all';

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
    private authService: AuthService
  ) {
    this.incidentForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: ['Medium', [Validators.required]],
      assignedTo: ['']
    });
  }

  ngOnInit() {
    this.loadIncidents();
  }

  loadIncidents() {
    this.incidentService.getAllIncidents().subscribe(incidents => {
      this.incidents = incidents;
      this.filteredIncidents = incidents;
    });
  }

  filterIncidents(filter: string) {
    this.selectedFilter = filter;
    if (filter === 'all') {
      this.filteredIncidents = this.incidents;
    } else {
      this.filteredIncidents = this.incidents.filter(incident => 
        incident.status.toLowerCase() === filter.toLowerCase()
      );
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-progress';
      case 'Resolved': return 'status-resolved';
      case 'Closed': return 'status-closed';
      default: return '';
    }
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.incidentForm.reset();
    }
  }

  onSubmit() {
    if (this.incidentForm.valid) {
      const incidentData = {
        title: this.incidentForm.value.title,
        description: this.incidentForm.value.description,
        priority: this.incidentForm.value.priority,
        assignedTo: this.incidentForm.value.assignedTo || 'Unassigned'
      };

      this.incidentService.createIncident(incidentData).subscribe({
        next: (newIncident) => {
          console.log('Incident created:', newIncident);
          this.loadIncidents(); // Refresh the list
          this.toggleCreateForm();
          alert(`Incident "${newIncident.title}" created successfully!`);
        },
        error: (error) => {
          console.error('Error creating incident:', error);
          alert('Error creating incident. Please try again.');
        }
      });
    }
  }

  updateStatus(incident: Incident, newStatus: string) {
    this.incidentService.updateIncidentStatus(incident.id, newStatus as any).subscribe({
      next: (updatedIncident) => {
        console.log('Incident status updated:', updatedIncident);
        this.loadIncidents(); // Refresh the list
      },
      error: (error) => {
        console.error('Error updating incident status:', error);
        alert('Error updating incident status. Please try again.');
      }
    });
  }

  viewIncident(incident: Incident) {
    // In a real app, this would open a detailed view modal or navigate to a detail page
    alert(`Viewing incident: ${incident.title}\n\nDescription: ${incident.description}\nStatus: ${incident.status}\nPriority: ${incident.priority}\nAssigned to: ${incident.assignedTo}`);
  }

  editIncident(incident: Incident) {
    // In a real app, this would open an edit modal or navigate to an edit page
    const newTitle = prompt('Edit incident title:', incident.title);
    if (newTitle && newTitle !== incident.title) {
      // For demo purposes, just update the title locally
      incident.title = newTitle;
      console.log('Incident title updated to:', newTitle);
      alert(`Incident title updated to: "${newTitle}"`);
    }
  }
}
