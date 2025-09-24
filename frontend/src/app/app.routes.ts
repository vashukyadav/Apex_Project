import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'employees',
    loadComponent: () => import('./components/employee/employee-list.component').then(m => m.EmployeeListComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'leaves',
    loadComponent: () => import('./components/employee/leave-management.component').then(m => m.LeaveManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: 'attendance',
    loadComponent: () => import('./components/employee/attendance.component').then(m => m.AttendanceComponent),
    canActivate: [authGuard]
  },
  {
    path: 'payroll',
    loadComponent: () => import('./components/employee/payroll.component').then(m => m.PayrollComponent),
    canActivate: [authGuard]
  },
  {
    path: 'offboarding',
    loadComponent: () => import('./components/admin/offboarding.component').then(m => m.OffboardingComponent),
    canActivate: [authGuard, adminGuard]
  }
];