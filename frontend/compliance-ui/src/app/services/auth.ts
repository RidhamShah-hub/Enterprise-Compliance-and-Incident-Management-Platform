import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginRequest, LoginResponse, ApiResponse } from '../models/interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
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

  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { username, password };
    
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
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    const token = this.getToken();
    
    if (token) {
      // Call logout endpoint to invalidate token on server
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

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    const request = { currentPassword, newPassword };
    
    return this.http.post<ApiResponse<boolean>>(`${this.API_URL}/auth/change-password`, request)
      .pipe(
        map(response => {
          if (response.success) {
            return true;
          }
          throw new Error(response.message || 'Password change failed');
        }),
        catchError(error => {
          console.error('Change password error:', error);
          return throwError(() => error);
        })
      );
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<ApiResponse<string>>(`${this.API_URL}/auth/refresh`, refreshToken)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            localStorage.setItem('token', response.data);
            return response.data;
          }
          throw new Error(response.message || 'Token refresh failed');
        }),
        catchError(error => {
          console.error('Token refresh error:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/auth/me`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Failed to get current user');
        }),
        catchError(error => {
          console.error('Get current user error:', error);
          return throwError(() => error);
        })
      );
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
}
