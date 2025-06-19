import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginRequest, LoginResponse, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getUserFromStorage()
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  public get userRoles(): string[] {
    const user = this.currentUserValue;
    return user?.roles?.map(role => role.name) || [];
  }

  login(email: string, password: string): Observable<LoginResponse> {
    // Demo/Mock authentication for testing - Multiple Users
    const mockUsers = this.getMockUsers();
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const mockLoginResponse: LoginResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          modifiedAt: new Date(),
          roles: user.roles
        }
      };

      this.setAuthData(mockLoginResponse);
      this.currentUserSubject.next(mockLoginResponse.user);
      return new Observable(observer => {
        setTimeout(() => {
          observer.next(mockLoginResponse);
          observer.complete();
        }, 1000); // Simulate network delay
      });
    }

    // For real authentication with backend
    const loginRequest: LoginRequest = { username: email, password };
    
    return this.http.post<ApiResponse<LoginResponse>>(`${this.API_URL}/auth/login`, loginRequest)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setAuthData(response.data);
            this.currentUserSubject.next(response.data.user);
            return response.data;
          }
          throw new Error(response.message || 'Login failed');
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error('Invalid email or password'));
        })
      );
  }

  logout(): void {
    const token = this.getToken();
    
    if (token) {
      this.http.post<ApiResponse<boolean>>(`${this.API_URL}/auth/logout`, {})
        .subscribe({
          next: () => console.log('Logged out from server'),
          error: (error) => console.error('Logout error:', error)
        });
    }

    this.clearAuthData();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  private setAuthData(loginResponse: LoginResponse): void {
    localStorage.setItem('token', loginResponse.token);
    localStorage.setItem('refreshToken', loginResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(loginResponse.user));
    localStorage.setItem('tokenExpiry', loginResponse.expiresAt.toString());
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  private isTokenExpired(token: string): boolean {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return true;
    
    const expiryDate = new Date(expiry);
    return Date.now() >= expiryDate.getTime();
  }

  private getMockUsers() {
    return [
      {
        id: '1',
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        fullName: 'Admin User',
        email: 'admin@company.com',
        password: 'password123',
        roles: [
          { 
            id: '1', 
            name: 'Administrator', 
            description: 'System Administrator',
            isActive: true,
            createdAt: new Date('2024-01-01')
          }
        ]
      },
      {
        id: '2',
        username: 'john.smith',
        firstName: 'John',
        lastName: 'Smith',
        fullName: 'John Smith',
        email: 'john.smith@company.com',
        password: 'user123',
        roles: [
          { 
            id: '2', 
            name: 'Security Manager', 
            description: 'Security Department Manager',
            isActive: true,
            createdAt: new Date('2024-01-01')
          }
        ]
      },
      {
        id: '3',
        username: 'sarah.johnson',
        firstName: 'Sarah',
        lastName: 'Johnson',
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        password: 'user123',
        roles: [
          { 
            id: '3', 
            name: 'Compliance Officer', 
            description: 'Compliance Department Officer',
            isActive: true,
            createdAt: new Date('2024-01-01')
          }
        ]
      },
      {
        id: '4',
        username: 'mike.wilson',
        firstName: 'Mike',
        lastName: 'Wilson',
        fullName: 'Mike Wilson',
        email: 'mike.wilson@company.com',
        password: 'user123',
        roles: [
          { 
            id: '4', 
            name: 'Employee', 
            description: 'Regular Employee',
            isActive: true,
            createdAt: new Date('2024-01-01')
          }
        ]
      }
    ];
  }
}
