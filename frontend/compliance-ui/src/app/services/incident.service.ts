import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Incident {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  createdBy: string;
  createdByName: string;
  createdDate: Date;
  modifiedDate: Date;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private incidentsSubject = new BehaviorSubject<Incident[]>(this.loadIncidentsFromStorage());
  public incidents$ = this.incidentsSubject.asObservable();

  constructor(private authService: AuthService) {}

  private loadIncidentsFromStorage(): Incident[] {
    const stored = localStorage.getItem('incidents');
    if (stored) {
      const incidents = JSON.parse(stored);
      // Convert date strings back to Date objects
      return incidents.map((incident: any) => ({
        ...incident,
        createdDate: new Date(incident.createdDate),
        modifiedDate: new Date(incident.modifiedDate)
      }));
    }
    
    // Default mock incidents
    return [
      {
        id: 'INC-001',
        title: 'Data Access Violation - Marketing Department',
        description: 'Unauthorized access detected in marketing database',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'Security Team',
        createdBy: '1',
        createdByName: 'Admin User',
        createdDate: new Date('2024-01-15'),
        modifiedDate: new Date('2024-01-15'),
        department: 'Marketing'
      },
      {
        id: 'INC-002',
        title: 'Policy Non-Compliance - Remote Work Guidelines',
        description: 'Employee working from unauthorized location',
        priority: 'Medium',
        status: 'Open',
        assignedTo: 'HR Department',
        createdBy: '2',
        createdByName: 'John Smith',
        createdDate: new Date('2024-01-14'),
        modifiedDate: new Date('2024-01-14'),
        department: 'HR'
      },
      {
        id: 'INC-003',
        title: 'Security Protocol Breach - Third Party Vendor',
        description: 'Vendor accessed system without proper authorization',
        priority: 'High',
        status: 'Resolved',
        assignedTo: 'Security Team',
        createdBy: '3',
        createdByName: 'Sarah Johnson',
        createdDate: new Date('2024-01-13'),
        modifiedDate: new Date('2024-01-16'),
        department: 'IT'
      },
      {
        id: 'INC-004',
        title: 'Documentation Missing - Finance Process',
        description: 'Required compliance documentation not found',
        priority: 'Low',
        status: 'Open',
        assignedTo: 'Compliance Team',
        createdBy: '1',
        createdByName: 'Admin User',
        createdDate: new Date('2024-01-12'),
        modifiedDate: new Date('2024-01-12'),
        department: 'Finance'
      }
    ];
  }

  private saveIncidentsToStorage(incidents: Incident[]): void {
    localStorage.setItem('incidents', JSON.stringify(incidents));
  }

  getAllIncidents(): Observable<Incident[]> {
    return this.incidents$;
  }

  getIncidentsByUser(userId: string): Observable<Incident[]> {
    return new Observable(observer => {
      this.incidents$.subscribe(incidents => {
        const userIncidents = incidents.filter(incident => incident.createdBy === userId);
        observer.next(userIncidents);
      });
    });
  }

  createIncident(incidentData: Partial<Incident>): Observable<Incident> {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const newIncident: Incident = {
      id: this.generateIncidentId(),
      title: incidentData.title || '',
      description: incidentData.description || '',
      priority: incidentData.priority || 'Medium',
      status: 'Open',
      assignedTo: incidentData.assignedTo || 'Unassigned',
      createdBy: currentUser.id,
      createdByName: currentUser.fullName,
      createdDate: new Date(),
      modifiedDate: new Date(),
      department: this.getDepartmentByRole(currentUser.roles?.[0]?.name || '')
    };

    const currentIncidents = this.incidentsSubject.value;
    const updatedIncidents = [newIncident, ...currentIncidents];
    
    this.saveIncidentsToStorage(updatedIncidents);
    this.incidentsSubject.next(updatedIncidents);

    return new Observable(observer => {
      observer.next(newIncident);
      observer.complete();
    });
  }

  updateIncidentStatus(incidentId: string, status: Incident['status']): Observable<Incident> {
    const currentIncidents = this.incidentsSubject.value;
    const incidentIndex = currentIncidents.findIndex(inc => inc.id === incidentId);
    
    if (incidentIndex === -1) {
      throw new Error('Incident not found');
    }

    const updatedIncident = {
      ...currentIncidents[incidentIndex],
      status,
      modifiedDate: new Date()
    };

    const updatedIncidents = [...currentIncidents];
    updatedIncidents[incidentIndex] = updatedIncident;
    
    this.saveIncidentsToStorage(updatedIncidents);
    this.incidentsSubject.next(updatedIncidents);

    return new Observable(observer => {
      observer.next(updatedIncident);
      observer.complete();
    });
  }

  private generateIncidentId(): string {
    const currentIncidents = this.incidentsSubject.value;
    const maxId = currentIncidents.reduce((max, incident) => {
      const idNumber = parseInt(incident.id.split('-')[1]);
      return idNumber > max ? idNumber : max;
    }, 0);
    
    return `INC-${String(maxId + 1).padStart(3, '0')}`;
  }

  private getDepartmentByRole(roleName: string): string {
    const roleMapping: Record<string, string> = {
      'Administrator': 'IT',
      'Security Manager': 'Security',
      'Compliance Officer': 'Legal',
      'Employee': 'General'
    };
    
    return roleMapping[roleName] || 'General';
  }

  // Get statistics for dashboard
  getIncidentStats() {
    const incidents = this.incidentsSubject.value;
    return {
      total: incidents.length,
      open: incidents.filter(i => i.status === 'Open').length,
      inProgress: incidents.filter(i => i.status === 'In Progress').length,
      resolved: incidents.filter(i => i.status === 'Resolved').length,
      high: incidents.filter(i => i.priority === 'High').length,
      medium: incidents.filter(i => i.priority === 'Medium').length,
      low: incidents.filter(i => i.priority === 'Low').length
    };
  }
}
