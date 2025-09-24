import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationsComponent } from './notifications.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    NotificationsComponent
  ],
  template: `
    <div class="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <!-- Sidebar -->
      <nav class="w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-white/30 flex flex-col relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
        </div>
        
        <!-- Logo & Brand -->
        <div class="relative z-10 p-8 border-b border-gray-200/50">
          <div class="flex items-center space-x-4 fade-in">
            <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 p-4 rounded-2xl shadow-xl neon-glow animate-float">
              <mat-icon class="text-white text-3xl">corporate_fare</mat-icon>
            </div>
            <div>
              <h1 class="text-2xl font-bold gradient-text leading-tight font-poppins">Enterprise HRMS</h1>
              <p class="text-sm text-gray-600 mt-1 font-medium">HR Management Suite</p>
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="relative z-10 flex-1 py-8 px-6 space-y-2">
          <button mat-button 
                  class="w-full justify-start text-left text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl px-6 py-5 transition-all duration-500 font-semibold text-base transform hover:scale-105 hover:shadow-lg group"
                  (click)="navigateTo(isAdmin ? '/admin' : '/dashboard')">
            <mat-icon class="mr-4 text-gray-600 group-hover:text-blue-600 text-2xl transition-colors duration-300">dashboard</mat-icon>
            <span class="text-lg">Dashboard</span>
            <mat-icon class="ml-auto text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:translate-x-1">arrow_forward_ios</mat-icon>
          </button>
          
          <button mat-button 
                  class="w-full justify-start text-left text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl px-6 py-5 transition-all duration-500 font-semibold text-base transform hover:scale-105 hover:shadow-lg group"
                  (click)="navigateTo('/employees')" 
                  *ngIf="isAdmin">
            <mat-icon class="mr-4 text-gray-600 group-hover:text-blue-600 text-2xl transition-colors duration-300">people</mat-icon>
            <span class="text-lg">Employees</span>
            <mat-icon class="ml-auto text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:translate-x-1">arrow_forward_ios</mat-icon>
          </button>
          
          <button mat-button 
                  class="w-full justify-start text-left text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl px-6 py-5 transition-all duration-500 font-semibold text-base transform hover:scale-105 hover:shadow-lg group"
                  (click)="navigateTo('/leaves')">
            <mat-icon class="mr-4 text-gray-600 group-hover:text-blue-600 text-2xl transition-colors duration-300">event_available</mat-icon>
            <span class="text-lg">Leaves</span>
            <mat-icon class="ml-auto text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:translate-x-1">arrow_forward_ios</mat-icon>
          </button>
          
          <button mat-button 
                  class="w-full justify-start text-left text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl px-6 py-5 transition-all duration-500 font-semibold text-base transform hover:scale-105 hover:shadow-lg group"
                  (click)="navigateTo('/attendance')">
            <mat-icon class="mr-4 text-gray-600 group-hover:text-blue-600 text-2xl transition-colors duration-300">schedule</mat-icon>
            <span class="text-lg">Attendance</span>
            <mat-icon class="ml-auto text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:translate-x-1">arrow_forward_ios</mat-icon>
          </button>
          
          <button mat-button 
                  class="w-full justify-start text-left text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl px-6 py-5 transition-all duration-500 font-semibold text-base transform hover:scale-105 hover:shadow-lg group"
                  (click)="navigateTo('/payroll')">
            <mat-icon class="mr-4 text-gray-600 group-hover:text-blue-600 text-2xl transition-colors duration-300">payment</mat-icon>
            <span class="text-lg">Payroll</span>
            <mat-icon class="ml-auto text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:translate-x-1">arrow_forward_ios</mat-icon>
          </button>
          
          <button mat-button 
                  class="w-full justify-start text-left text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl px-6 py-5 transition-all duration-500 font-semibold text-base transform hover:scale-105 hover:shadow-lg group"
                  (click)="navigateTo('/offboarding')" 
                  *ngIf="isAdmin">
            <mat-icon class="mr-4 text-gray-600 group-hover:text-blue-600 text-2xl transition-colors duration-300">exit_to_app</mat-icon>
            <span class="text-lg">Offboarding</span>
            <mat-icon class="ml-auto text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:translate-x-1">arrow_forward_ios</mat-icon>
          </button>
        </div>

        <!-- User Profile -->
        <div class="relative z-10 p-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-blue-50/50">
          <div class="flex items-center space-x-4 mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            <div class="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
              <mat-icon class="text-white text-2xl">account_circle</mat-icon>
            </div>
            <div class="flex-1">
              <p class="text-base font-bold text-gray-800 leading-relaxed">
                {{ currentUser?.employee?.firstName }} {{ currentUser?.employee?.lastName }}
              </p>
              <p class="text-sm text-gray-600 capitalize mt-1 font-medium flex items-center">
                <mat-icon class="text-xs mr-1">badge</mat-icon>
                {{ currentUser?.role }}
              </p>
            </div>
            <app-notifications></app-notifications>
          </div>
          
          <button mat-button 
                  class="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-2xl px-6 py-4 transition-all duration-500 font-semibold transform hover:scale-105 hover:shadow-lg group"
                  (click)="logout()">
            <mat-icon class="mr-4 text-xl group-hover:rotate-12 transition-transform duration-300">logout</mat-icon>
            <span class="text-lg">Logout</span>
            <mat-icon class="ml-auto text-gray-400 group-hover:text-red-500 transition-all duration-300 group-hover:translate-x-1">arrow_forward_ios</mat-icon>
          </button>
        </div>
      </nav>

      <!-- Main Content Area -->
      <div class="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class NavbarComponent implements OnInit {
  currentUser = this.authService.getCurrentUser();
  
  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load notifications on navbar init
    setTimeout(() => {
      this.loadNotifications();
    }, 1000);
  }

  loadNotifications(): void {
    console.log('Navbar loading notifications...');
    this.notificationService.getMyNotifications().subscribe({
      next: (notifications) => {
        console.log('Navbar got notifications:', notifications.length);
        const unreadCount = notifications.filter(n => !n.isRead).length;
        this.notificationService.updateUnreadCount(unreadCount);
      },
      error: (error) => {
        console.error('Navbar notification error:', error);
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}