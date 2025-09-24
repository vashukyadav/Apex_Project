import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { AttendanceService } from '../../services/attendance.service';
import { AuthService } from '../../services/auth.service';
import { Attendance } from '../../models/user.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <!-- Header Section -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Attendance Management
            </h1>
            <p class="text-gray-600 text-lg">Track your working hours and attendance records</p>
          </div>
          <div class="hidden md:block">
            <div class="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-full">
              <mat-icon class="text-white text-4xl">access_time</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium mb-1">Today's Status</p>
              <p class="text-3xl font-bold mb-2">{{ todayAttendance ? 'Present' : 'Absent' }}</p>
              <p class="text-blue-200 text-xs">{{ todayAttendance?.checkIn || 'Not checked in' }}</p>
            </div>
            <div class="bg-white bg-opacity-20 p-3 rounded-xl">
              <mat-icon class="text-2xl">{{ todayAttendance ? 'check_circle' : 'cancel' }}</mat-icon>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium mb-1">This Month</p>
              <p class="text-3xl font-bold mb-2">{{ monthlyDays }}</p>
              <p class="text-green-200 text-xs">Days present</p>
            </div>
            <div class="bg-white bg-opacity-20 p-3 rounded-xl">
              <mat-icon class="text-2xl">calendar_today</mat-icon>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm font-medium mb-1">Total Hours</p>
              <p class="text-3xl font-bold mb-2">{{ totalHours }}h</p>
              <p class="text-orange-200 text-xs">This month</p>
            </div>
            <div class="bg-white bg-opacity-20 p-3 rounded-xl">
              <mat-icon class="text-2xl">schedule</mat-icon>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium mb-1">Average Hours</p>
              <p class="text-3xl font-bold mb-2">{{ averageHours }}h</p>
              <p class="text-purple-200 text-xs">Per day</p>
            </div>
            <div class="bg-white bg-opacity-20 p-3 rounded-xl">
              <mat-icon class="text-2xl">trending_up</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Quick Actions -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div class="flex items-center mb-6">
              <div class="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl mr-4">
                <mat-icon class="text-white text-xl">flash_on</mat-icon>
              </div>
              <h2 class="text-2xl font-bold text-gray-800">Quick Actions</h2>
            </div>
            
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-3">
                  <span class="font-semibold text-gray-800">Current Time</span>
                  <span class="text-2xl font-bold text-purple-600">{{ currentTime | date:'shortTime' }}</span>
                </div>
                <div class="text-sm text-gray-600">
                  {{ currentTime | date:'fullDate' }}
                </div>
              </div>

              <button mat-raised-button 
                      class="w-full h-14 text-lg font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200"
                      (click)="checkIn()" 
                      [disabled]="todayAttendance && !todayAttendance.checkOut">
                <mat-icon class="mr-2">login</mat-icon>
                Check In
              </button>

              <button mat-raised-button 
                      class="w-full h-14 text-lg font-medium bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
                      (click)="checkOut()" 
                      [disabled]="!todayAttendance || todayAttendance.checkOut">
                <mat-icon class="mr-2">logout</mat-icon>
                Check Out
              </button>

              <div *ngIf="todayAttendance" class="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 class="font-semibold text-blue-800 mb-2">Today's Summary</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-blue-600">Check In:</span>
                    <span class="font-medium">{{ todayAttendance.checkIn }}</span>
                  </div>
                  <div class="flex justify-between" *ngIf="todayAttendance.checkOut">
                    <span class="text-blue-600">Check Out:</span>
                    <span class="font-medium">{{ todayAttendance.checkOut }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-blue-600">Hours Worked:</span>
                    <span class="font-medium">{{ todayAttendance.workingHours || 0 }}h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Attendance History -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="p-8 border-b border-gray-200">
              <div class="flex items-center">
                <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl mr-4">
                  <mat-icon class="text-white text-xl">history</mat-icon>
                </div>
                <h2 class="text-2xl font-bold text-gray-800">Attendance History</h2>
              </div>
            </div>

            <div class="p-8">
              <div class="space-y-4" *ngIf="attendanceRecords.length > 0; else noRecords">
                <div *ngFor="let record of attendanceRecords" 
                     class="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors border border-gray-200">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center">
                      <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl mr-4">
                        <mat-icon class="text-white text-lg">{{ getStatusIcon(record.status) }}</mat-icon>
                      </div>
                      <div>
                        <h3 class="font-semibold text-gray-800 text-lg">{{ record.date | date:'fullDate' }}</h3>
                        <div class="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>
                            <mat-icon class="text-xs mr-1">login</mat-icon>
                            {{ record.checkIn || 'Not checked in' }}
                          </span>
                          <span>
                            <mat-icon class="text-xs mr-1">logout</mat-icon>
                            {{ record.checkOut || 'Not checked out' }}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="text-right">
                      <div class="flex items-center space-x-3">
                        <span class="px-3 py-1 rounded-full text-sm font-medium border" 
                              [ngClass]="{
                                'bg-green-100 text-green-800 border-green-200': record.status === 'present',
                                'bg-red-100 text-red-800 border-red-200': record.status === 'absent',
                                'bg-yellow-100 text-yellow-800 border-yellow-200': record.status === 'half-day'
                              }">
                          {{ record.status | titlecase }}
                        </span>
                        <div class="text-right">
                          <div class="text-lg font-bold text-purple-600">{{ record.workingHours || 0 }}h</div>
                          <div class="text-xs text-gray-500">Working Hours</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ng-template #noRecords>
                <div class="text-center py-16">
                  <mat-icon class="text-6xl text-gray-400 mb-4">schedule</mat-icon>
                  <h3 class="text-xl font-semibold text-gray-600 mb-2">No attendance records found</h3>
                  <p class="text-gray-500">Your attendance history will appear here once you start checking in</p>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AttendanceComponent implements OnInit {
  attendanceRecords: Attendance[] = [];
  todayAttendance: Attendance | null = null;
  currentTime = new Date();
  monthlyDays = 0;
  totalHours = 0;
  averageHours = 0;

  constructor(
    private attendanceService: AttendanceService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    // Update current time every second
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnInit(): void {
    this.loadAttendance();
  }

  loadAttendance(): void {
    if (this.authService.isAdmin()) {
      this.attendanceService.getAllAttendance().subscribe(records => {
        this.attendanceRecords = records;
        this.calculateStats();
      });
    } else {
      this.attendanceService.getMyAttendance().subscribe(records => {
        this.attendanceRecords = records;
        this.calculateStats();
      });
    }
  }

  calculateStats(): void {
    const today = new Date().toDateString();
    this.todayAttendance = this.attendanceRecords.find(record => 
      new Date(record.date).toDateString() === today
    ) || null;

    const currentMonth = new Date().getMonth();
    const monthlyRecords = this.attendanceRecords.filter(record => 
      new Date(record.date).getMonth() === currentMonth
    );

    this.monthlyDays = monthlyRecords.length;
    this.totalHours = monthlyRecords.reduce((sum, record) => sum + (record.workingHours || 0), 0);
    this.averageHours = this.monthlyDays > 0 ? Math.round((this.totalHours / this.monthlyDays) * 10) / 10 : 0;
  }

  checkIn(): void {
    this.attendanceService.checkIn().subscribe({
      next: () => {
        this.snackBar.open('Checked in successfully', 'Close', { duration: 3000 });
        this.loadAttendance();
      },
      error: () => {
        this.snackBar.open('Failed to check in', 'Close', { duration: 3000 });
      }
    });
  }

  checkOut(): void {
    this.attendanceService.checkOut().subscribe({
      next: () => {
        this.snackBar.open('Checked out successfully', 'Close', { duration: 3000 });
        this.loadAttendance();
      },
      error: () => {
        this.snackBar.open('Failed to check out', 'Close', { duration: 3000 });
      }
    });
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'present': 'check_circle',
      'absent': 'cancel',
      'late': 'schedule'
    };
    return icons[status] || 'help';
  }
}