import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class LayoutComponent {
  isSidebarCollapsed = false;

  navigationItems = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Incidents', route: '/incidents', icon: '⚠️' },
    { label: 'Compliance', route: '/compliance', icon: '✅' },
    { label: 'Reports', route: '/reports', icon: '📄' },
    { label: 'Users', route: '/users', icon: '👥' },
    { label: 'Settings', route: '/settings', icon: '⚙️' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.authService.currentUserValue;
  }
}
