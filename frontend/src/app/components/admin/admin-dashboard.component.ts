import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { LeaveService } from '../../services/leave.service';
import { AttendanceService } from '../../services/attendance.service';
import { Employee, Leave, Attendance } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6 relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/5 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 4s;"></div>
      </div>

      <div class="relative z-10">
        <!-- Header Section -->
        <div class="glass-card p-10 mb-8 slide-in">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-4">
                <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 p-1 rounded-2xl mr-4">
                  <div class="bg-white p-3 rounded-xl">
                    <mat-icon class="text-3xl gradient-text">admin_panel_settings</mat-icon>
                  </div>
                </div>
                <div>
                  <h1 class="text-5xl font-bold gradient-text mb-2 font-poppins">
                    Admin Dashboard
                  </h1>
                  <p class="text-xl text-gray-600 font-semibold">Command Center for HR Operations</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex items-center bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
                  <mat-icon class="text-blue-600 mr-2">business</mat-icon>
                  <span class="text-gray-700 font-semibold">Enterprise Management</span>
                </div>
                <div class="flex items-center bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                  <mat-icon class="text-green-600 mr-2">verified</mat-icon>
                  <span class="text-gray-700 font-semibold">Full Access</span>
                </div>
              </div>
            </div>
            <div class="hidden lg:block">
              <div class="relative">
                <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 p-6 rounded-3xl shadow-2xl neon-glow animate-float">
                  <mat-icon class="text-white text-6xl">dashboard</mat-icon>
                </div>
                <div class="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="gradient-card from-blue-500 via-blue-600 to-cyan-600 p-8 cursor-pointer slide-in group" 
               (click)="router.navigate(['/employees'])" style="animation-delay: 0.1s;">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-3">
                  <div class="bg-white/20 p-2 rounded-xl mr-3">
                    <mat-icon class="text-white text-xl">people</mat-icon>
                  </div>
                  <p class="text-blue-100 text-sm font-bold uppercase tracking-wider">Total Employees</p>
                </div>
                <p class="text-4xl font-black mb-2">{{ totalEmployees }}</p>
                <p class="text-blue-200 text-sm font-medium flex items-center">
                  <span>Click to manage</span>
                  <mat-icon class="ml-2 text-sm group-hover:translate-x-1 transition-transform duration-300">arrow_forward</mat-icon>
                </p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 group-hover:scale-110 transition-transform duration-300">
                <mat-icon class="text-3xl">groups</mat-icon>
              </div>
            </div>
          </div>

          <div class="gradient-card from-emerald-500 via-green-600 to-teal-600 p-8 cursor-pointer slide-in group" 
               (click)="router.navigate(['/leaves'])" style="animation-delay: 0.2s;">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-3">
                  <div class="bg-white/20 p-2 rounded-xl mr-3">
                    <mat-icon class="text-white text-xl">event_available</mat-icon>
                  </div>
                  <p class="text-green-100 text-sm font-bold uppercase tracking-wider">Pending Leaves</p>
                </div>
                <p class="text-4xl font-black mb-2">{{ pendingLeaves }}</p>
                <p class="text-green-200 text-sm font-medium flex items-center">
                  <span>Click to review</span>
                  <mat-icon class="ml-2 text-sm group-hover:translate-x-1 transition-transform duration-300">arrow_forward</mat-icon>
                </p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 group-hover:scale-110 transition-transform duration-300">
                <mat-icon class="text-3xl animate-bounce-slow">pending_actions</mat-icon>
              </div>
            </div>
          </div>

          <div class="gradient-card from-purple-500 via-violet-600 to-indigo-600 p-8 cursor-pointer slide-in group" 
               (click)="router.navigate(['/attendance'])" style="animation-delay: 0.3s;">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-3">
                  <div class="bg-white/20 p-2 rounded-xl mr-3">
                    <mat-icon class="text-white text-xl">check_circle</mat-icon>
                  </div>
                  <p class="text-purple-100 text-sm font-bold uppercase tracking-wider">Present Today</p>
                </div>
                <p class="text-4xl font-black mb-2">{{ presentToday }}</p>
                <p class="text-purple-200 text-sm font-medium flex items-center">
                  <span>Click to view</span>
                  <mat-icon class="ml-2 text-sm group-hover:translate-x-1 transition-transform duration-300">arrow_forward</mat-icon>
                </p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 group-hover:scale-110 transition-transform duration-300">
                <mat-icon class="text-3xl animate-pulse">how_to_reg</mat-icon>
              </div>
            </div>
          </div>

          <div class="gradient-card from-orange-500 via-red-500 to-pink-600 p-8 cursor-pointer slide-in group" 
               (click)="router.navigate(['/employees'])" style="animation-delay: 0.4s;">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-3">
                  <div class="bg-white/20 p-2 rounded-xl mr-3">
                    <mat-icon class="text-white text-xl">person_check</mat-icon>
                  </div>
                  <p class="text-orange-100 text-sm font-bold uppercase tracking-wider">Active Employees</p>
                </div>
                <p class="text-4xl font-black mb-2">{{ activeEmployees }}</p>
                <p class="text-orange-200 text-sm font-medium flex items-center">
                  <span>Click to manage</span>
                  <mat-icon class="ml-2 text-sm group-hover:translate-x-1 transition-transform duration-300">arrow_forward</mat-icon>
                </p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 group-hover:scale-110 transition-transform duration-300">
                <mat-icon class="text-3xl animate-pulse">verified_user</mat-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Quick Actions -->
          <div class="glass-card p-10 slide-in" style="animation-delay: 0.5s;">
            <div class="flex items-center mb-8">
              <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 p-4 rounded-2xl mr-4 shadow-xl">
                <mat-icon class="text-white text-2xl">flash_on</mat-icon>
              </div>
              <div>
                <h2 class="text-3xl font-bold gradient-text font-poppins">Quick Actions</h2>
                <p class="text-gray-600 font-medium">Administrative controls</p>
              </div>
            </div>
            <div class="space-y-5">
              <button mat-raised-button 
                      class="w-full h-16 text-xl font-bold btn-primary relative overflow-hidden group" 
                      (click)="router.navigate(['/employees'])">
                <div class="flex items-center justify-center">
                  <mat-icon class="mr-3 text-2xl group-hover:scale-110 transition-transform duration-300">person_add</mat-icon>
                  <span>Manage Employees</span>
                </div>
              </button>
              <button mat-raised-button 
                      class="w-full h-16 text-xl font-bold btn-success relative overflow-hidden group" 
                      (click)="router.navigate(['/leaves'])">
                <div class="flex items-center justify-center">
                  <mat-icon class="mr-3 text-2xl group-hover:rotate-12 transition-transform duration-300">approval</mat-icon>
                  <span>Review Leave Requests</span>
                </div>
              </button>
              <button mat-raised-button 
                      class="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group" 
                      (click)="router.navigate(['/payroll'])">
                <div class="flex items-center justify-center">
                  <mat-icon class="mr-3 text-2xl group-hover:scale-110 transition-transform duration-300">payment</mat-icon>
                  <span>Generate Payroll</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Recent Leave Requests -->
          <div class="glass-card p-10 slide-in" style="animation-delay: 0.6s;">
            <div class="flex items-center mb-8">
              <div class="bg-gradient-to-br from-orange-500 via-red-600 to-pink-500 p-4 rounded-2xl mr-4 shadow-xl">
                <mat-icon class="text-white text-2xl">schedule</mat-icon>
              </div>
              <div>
                <h2 class="text-3xl font-bold gradient-text font-poppins">Recent Leave Requests</h2>
                <p class="text-gray-600 font-medium">Pending approvals</p>
              </div>
            </div>
            <div class="space-y-4 max-h-96 overflow-y-auto">
              <div *ngFor="let leave of recentLeaves; let i = index" 
                   class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 cursor-pointer border border-white/50 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                   [style.animation-delay]="(0.7 + i * 0.1) + 's'"
                   style="animation: slideIn 0.6s ease-out both;">
                <div class="flex justify-between items-center">
                  <div class="flex-1">
                    <div class="flex items-center mb-3">
                      <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl mr-3">
                        <mat-icon class="text-white text-sm">person</mat-icon>
                      </div>
                      <div>
                        <p class="font-bold text-gray-800 text-lg">
                          {{ leave.Employee?.firstName }} {{ leave.Employee?.lastName }}
                        </p>
                        <div class="flex items-center text-gray-600 mt-1">
                          <mat-icon class="text-sm mr-2 text-orange-600">event</mat-icon>
                          <span class="font-semibold text-sm">{{ leave.leaveType | titlecase }}</span>
                          <span class="mx-2 text-gray-400">•</span>
                          <span class="text-sm">{{ leave.startDate }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="px-4 py-2 rounded-2xl text-sm font-bold shadow-lg" 
                          [ngClass]="{
                            'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-300': leave.status === 'pending',
                            'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300': leave.status === 'approved',
                            'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-300': leave.status === 'rejected'
                          }">
                      {{ leave.status | titlecase }}
                    </span>
                    <p class="text-xs text-gray-500 mt-1 font-medium">Status</p>
                  </div>
                </div>
              </div>
              <div *ngIf="recentLeaves.length === 0" class="text-center py-12 text-gray-500">
                <div class="bg-gray-100 p-6 rounded-3xl inline-block mb-4">
                  <mat-icon class="text-6xl text-gray-400">inbox</mat-icon>
                </div>
                <p class="text-xl font-semibold">No recent leave requests</p>
                <p class="text-gray-400 mt-2">Employee leave requests will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  totalEmployees = 0;
  activeEmployees = 0;
  pendingLeaves = 0;
  presentToday = 0;
  recentLeaves: Leave[] = [];

  constructor(
    private employeeService: EmployeeService,
    private leaveService: LeaveService,
    private attendanceService: AttendanceService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.employeeService.getAllEmployees().subscribe(employees => {
      this.totalEmployees = employees.length;
      this.activeEmployees = employees.filter(e => e.isActive).length;
    });

    this.leaveService.getAllLeaves().subscribe(leaves => {
      this.pendingLeaves = leaves.filter(l => l.status === 'pending').length;
      this.recentLeaves = leaves.slice(0, 5);
    });

    this.attendanceService.getAllAttendance().subscribe(attendance => {
      const today = new Date().toDateString();
      this.presentToday = attendance.filter(a => 
        new Date(a.date).toDateString() === today
      ).length;
    });
  }
}