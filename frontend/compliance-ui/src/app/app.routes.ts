import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { LayoutComponent } from './components/layout/layout';
import { IncidentsComponent } from './components/incidents/incidents';
import { ComplianceComponent } from './components/compliance/compliance';
import { ReportsComponent } from './components/reports/reports';
import { UsersComponent } from './components/users/users';
import { SettingsComponent } from './components/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'incidents', component: IncidentsComponent },
      { path: 'compliance', component: ComplianceComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
