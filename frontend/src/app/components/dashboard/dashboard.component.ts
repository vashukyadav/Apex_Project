import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AttendanceService } from '../../services/attendance.service';
import { LeaveService } from '../../services/leave.service';
import { NotificationService } from '../../services/notification.service';
import { User, Attendance, Leave } from '../../models/user.model';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestNotificationComponent } from '../shared/test-notification.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    TestNotificationComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-6 relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
      </div>

      <div class="relative z-10">
        <!-- Header Section -->
        <div class="glass-card p-10 mb-8 slide-in">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-4">
                <div class="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-1 rounded-2xl mr-4">
                  <div class="bg-white p-3 rounded-xl">
                    <mat-icon class="text-3xl gradient-text">waving_hand</mat-icon>
                  </div>
                </div>
                <div>
                  <h1 class="text-5xl font-bold gradient-text mb-2 font-poppins">
                    Welcome Back!
                  </h1>
                  <p class="text-2xl font-semibold text-gray-700">
                    {{ currentUser?.employee?.firstName }} {{ currentUser?.employee?.lastName }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-6 text-lg">
                <div class="flex items-center bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
                  <mat-icon class="text-blue-600 mr-2">work</mat-icon>
                  <span class="text-gray-700 font-semibold">{{ currentUser?.employee?.position }}</span>
                </div>
                <div class="flex items-center bg-purple-50 px-4 py-2 rounded-xl border border-purple-200">
                  <mat-icon class="text-purple-600 mr-2">business</mat-icon>
                  <span class="text-gray-700 font-semibold">{{ currentUser?.employee?.department }}</span>
                </div>
              </div>
            </div>
            <div class="hidden lg:block">
              <div class="relative">
                <div class="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-6 rounded-3xl shadow-2xl neon-glow animate-float">
                  <mat-icon class="text-white text-6xl">person</mat-icon>
                </div>
                <div class="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="gradient-card from-blue-500 via-blue-600 to-cyan-600 p-8 slide-in" style="animation-delay: 0.1s;">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-3">
                  <div class="bg-white/20 p-2 rounded-xl mr-3">
                    <mat-icon class="text-white text-xl">access_time</mat-icon>
                  </div>
                  <p class="text-blue-100 text-sm font-bold uppercase tracking-wider">Today's Status</p>
                </div>
                <p class="text-4xl font-black mb-2">{{ todayAttendance ? 'Present' : 'Absent' }}</p>
                <p class="text-blue-200 text-sm font-medium">{{ todayAttendance?.checkIn || 'Not checked in' }}</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                <mat-icon class="text-3xl animate-pulse">{{ todayAttendance ? 'check_circle' : 'schedule' }}</mat-icon>
              </div>
            </div>
          </div>

          <div class="gradient-card from-emerald-500 via-green-600 to-teal-600 p-8 slide-in" style="animation-delay: 0.2s;">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-3">
                  <div class="bg-white/20 p-2 rounded-xl mr-3">
                    <mat-icon class="text-white text-xl">event_available</mat-icon>
                  </div>
                  <p class="text-green-100 text-sm font-bold uppercase tracking-wider">Pending Leaves</p>
                </div>
                <p class="text-4xl font-black mb-2">{{ pendingLeaves }}</p>
                <p class="text-green-200 text-sm font-medium">Awaiting approval</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                <mat-icon class="text-3xl animate-bounce-slow">pending_actions</mat-icon>
              </div>
            </div>
          </div>

          <div class="gradient-card from-purple-500 via-violet-600 to-indigo-600 p-8 slide-in" style="animation-delay: 0.3s;">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-3">
                  <div class="bg-white/20 p-2 rounded-xl mr-3">
                    <mat-icon class="text-white text-xl">calendar_today</mat-icon>
                  </div>
                  <p class="text-purple-100 text-sm font-bold uppercase tracking-wider">This Month</p>
                </div>
                <p class="text-4xl font-black mb-2">{{ monthlyAttendance }}</p>
                <p class="text-purple-200 text-sm font-medium">Days present</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                <mat-icon class="text-3xl animate-pulse">trending_up</mat-icon>
              </div>
            </div>
          </div>

          <div class="gradient-card from-orange-500 via-red-500 to-pink-600 p-8 slide-in" style="animation-delay: 0.4s;">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-3">
                  <div class="bg-white/20 p-2 rounded-xl mr-3">
                    <mat-icon class="text-white text-xl">schedule</mat-icon>
                  </div>
                  <p class="text-orange-100 text-sm font-bold uppercase tracking-wider">Total Hours</p>
                </div>
                <p class="text-4xl font-black mb-2">{{ totalHours }}h</p>
                <p class="text-orange-200 text-sm font-medium">This month</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                <mat-icon class="text-3xl animate-pulse">timer</mat-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Quick Actions -->
          <div class="glass-card p-10 slide-in" style="animation-delay: 0.5s;">
            <div class="flex items-center mb-8">
              <div class="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-4 rounded-2xl mr-4 shadow-xl">
                <mat-icon class="text-white text-2xl">flash_on</mat-icon>
              </div>
              <div>
                <h2 class="text-3xl font-bold gradient-text font-poppins">Quick Actions</h2>
                <p class="text-gray-600 font-medium">Manage your daily tasks</p>
              </div>
            </div>
            <div class="space-y-5">
              <button mat-raised-button 
                      class="w-full h-16 text-xl font-bold btn-success relative overflow-hidden group" 
                      (click)="openCheckInDialog()" [disabled]="todayAttendance && !todayAttendance.checkOut">
                <div class="flex items-center justify-center">
                  <mat-icon class="mr-3 text-2xl group-hover:rotate-12 transition-transform duration-300">login</mat-icon>
                  <span>Check In</span>
                </div>
              </button>
              <button mat-raised-button 
                      class="w-full h-16 text-xl font-bold btn-danger relative overflow-hidden group" 
                      (click)="openCheckOutDialog()" [disabled]="!todayAttendance || todayAttendance.checkOut">
                <div class="flex items-center justify-center">
                  <mat-icon class="mr-3 text-2xl group-hover:-rotate-12 transition-transform duration-300">logout</mat-icon>
                  <span>Check Out</span>
                </div>
              </button>
              <button mat-raised-button 
                      class="w-full h-16 text-xl font-bold btn-primary relative overflow-hidden group" 
                      (click)="router.navigate(['/leaves'])">
                <div class="flex items-center justify-center">
                  <mat-icon class="mr-3 text-2xl group-hover:scale-110 transition-transform duration-300">event</mat-icon>
                  <span>Apply Leave</span>
                </div>
              </button>
              
              <!-- Test Notification Button -->
              <div class="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p class="text-sm text-yellow-800 mb-2">Debug: Test Notifications</p>
                <app-test-notification></app-test-notification>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="glass-card p-10 slide-in" style="animation-delay: 0.6s;">
            <div class="flex items-center mb-8">
              <div class="bg-gradient-to-br from-purple-500 via-pink-600 to-rose-500 p-4 rounded-2xl mr-4 shadow-xl">
                <mat-icon class="text-white text-2xl">history</mat-icon>
              </div>
              <div>
                <h2 class="text-3xl font-bold gradient-text font-poppins">Recent Activity</h2>
                <p class="text-gray-600 font-medium">Your attendance history</p>
              </div>
            </div>
            <div class="space-y-4 max-h-96 overflow-y-auto">
              <div *ngFor="let attendance of recentAttendance; let i = index" 
                   class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 border border-white/50 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                   [style.animation-delay]="(0.7 + i * 0.1) + 's'"
                   style="animation: slideIn 0.6s ease-out both;">
                <div class="flex justify-between items-center">
                  <div class="flex-1">
                    <div class="flex items-center mb-2">
                      <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl mr-3">
                        <mat-icon class="text-white text-sm">calendar_today</mat-icon>
                      </div>
                      <p class="font-bold text-gray-800 text-lg">
                        {{ attendance.date | date:'mediumDate' }}
                      </p>
                    </div>
                    <div class="flex items-center text-gray-600 ml-11">
                      <mat-icon class="text-sm mr-2 text-green-600">login</mat-icon>
                      <span class="font-semibold mr-4">{{ attendance.checkIn }}</span>
                      <mat-icon class="text-sm mr-2 text-red-600">logout</mat-icon>
                      <span class="font-semibold">{{ attendance.checkOut || 'Ongoing' }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200 shadow-lg">
                      {{ attendance.workingHours }}h
                    </span>
                    <p class="text-xs text-gray-500 mt-1 font-medium">Working Hours</p>
                  </div>
                </div>
              </div>
              <div *ngIf="recentAttendance.length === 0" class="text-center py-12 text-gray-500">
                <div class="bg-gray-100 p-6 rounded-3xl inline-block mb-4">
                  <mat-icon class="text-6xl text-gray-400">schedule</mat-icon>
                </div>
                <p class="text-xl font-semibold">No recent activity</p>
                <p class="text-gray-400 mt-2">Your attendance records will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  todayAttendance: Attendance | null = null;
  recentAttendance: Attendance[] = [];
  pendingLeaves = 0;
  monthlyAttendance = 0;
  totalHours = 0;

  constructor(
    private authService: AuthService,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getMyNotifications().subscribe(notifications => {
      const unreadCount = notifications.filter(n => !n.isRead).length;
      this.notificationService.updateUnreadCount(unreadCount);
    });
  }

  loadDashboardData(): void {
    this.attendanceService.getMyAttendance().subscribe(attendance => {
      this.recentAttendance = attendance.slice(0, 5);
      this.todayAttendance = attendance.find(a => 
        new Date(a.date).toDateString() === new Date().toDateString()
      ) || null;
      this.monthlyAttendance = attendance.filter(a => 
        new Date(a.date).getMonth() === new Date().getMonth()
      ).length;
      this.totalHours = attendance.reduce((sum, a) => sum + a.workingHours, 0);
    });

    this.leaveService.getMyLeaves().subscribe(leaves => {
      this.pendingLeaves = leaves.filter(l => l.status === 'pending').length;
    });
  }

  openCheckInDialog(): void {
    const dialogRef = this.dialog.open(CheckInDialogComponent, {
      width: '400px',
      data: { employee: this.currentUser?.employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.attendanceService.checkIn().subscribe({
          next: () => {
            this.snackBar.open('Successfully checked in!', 'Close', { duration: 3000 });
            this.loadDashboardData();
          },
          error: () => {
            this.snackBar.open('Check-in failed', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openCheckOutDialog(): void {
    const dialogRef = this.dialog.open(CheckOutDialogComponent, {
      width: '400px',
      data: { 
        employee: this.currentUser?.employee,
        checkInTime: this.todayAttendance?.checkIn
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.attendanceService.checkOut().subscribe({
          next: () => {
            this.snackBar.open('Successfully checked out!', 'Close', { duration: 3000 });
            this.loadDashboardData();
          },
          error: () => {
            this.snackBar.open('Check-out failed', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}

@Component({
  selector: 'app-check-in-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6">
      <div class="text-center mb-6">
        <div class="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-4">
          <mat-icon class="text-white text-4xl">login</mat-icon>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Check In</h2>
        <p class="text-gray-600">{{ getCurrentTime() }}</p>
      </div>
      
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-600">Employee:</span>
          <span class="font-semibold">{{ data.employee?.firstName }} {{ data.employee?.lastName }}</span>
        </div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-600">Employee ID:</span>
          <span class="font-semibold">{{ data.employee?.employeeId }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-600">Department:</span>
          <span class="font-semibold">{{ data.employee?.department }}</span>
        </div>
      </div>

      <div class="flex space-x-3">
        <button mat-button class="flex-1" mat-dialog-close>Cancel</button>
        <button mat-raised-button 
                class="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white" 
                [mat-dialog-close]="true">
          Confirm Check In
        </button>
      </div>
    </div>
  `
})
export class CheckInDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  
  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }
}

@Component({
  selector: 'app-check-out-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6">
      <div class="text-center mb-6">
        <div class="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-full w-16 h-16 mx-auto mb-4">
          <mat-icon class="text-white text-4xl">logout</mat-icon>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Check Out</h2>
        <p class="text-gray-600">{{ getCurrentTime() }}</p>
      </div>
      
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-600">Employee:</span>
          <span class="font-semibold">{{ data.employee?.firstName }} {{ data.employee?.lastName }}</span>
        </div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-600">Check In Time:</span>
          <span class="font-semibold">{{ data.checkInTime }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-600">Working Hours:</span>
          <span class="font-semibold">{{ getWorkingHours() }}</span>
        </div>
      </div>

      <div class="flex space-x-3">
        <button mat-button class="flex-1" mat-dialog-close>Cancel</button>
        <button mat-raised-button 
                class="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white" 
                [mat-dialog-close]="true">
          Confirm Check Out
        </button>
      </div>
    </div>
  `
})
export class CheckOutDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  
  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }
  
  getWorkingHours(): string {
    if (!this.data.checkInTime) return '0h';
    const checkIn = new Date(`1970-01-01T${this.data.checkInTime}`);
    const now = new Date();
    const currentTime = new Date(`1970-01-01T${now.toTimeString().split(' ')[0]}`);
    const diff = (currentTime.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    return `${Math.max(0, diff).toFixed(1)}h`;
  }
}