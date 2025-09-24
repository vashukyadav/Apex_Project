import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';
import { Leave } from '../../models/user.model';

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTableModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <!-- Header Section -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              Leave Management
            </h1>
            <p class="text-gray-600 text-lg">Manage leave requests and track your time off</p>
          </div>
          <div class="hidden md:block">
            <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-full">
              <mat-icon class="text-white text-4xl">event_available</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Apply Leave Form -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div class="flex items-center mb-6">
              <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl mr-4">
                <mat-icon class="text-white text-xl">add_circle</mat-icon>
              </div>
              <h2 class="text-2xl font-bold text-gray-800">Apply for Leave</h2>
            </div>
            
            <form [formGroup]="leaveForm" (ngSubmit)="applyLeave()" class="space-y-6">
              <mat-form-field class="w-full" appearance="fill">
                <mat-label>Leave Type</mat-label>
                <mat-select formControlName="leaveType" required>
                  <mat-option value="sick">Sick Leave</mat-option>
                  <mat-option value="casual">Casual Leave</mat-option>
                  <mat-option value="annual">Annual Leave</mat-option>
                  <mat-option value="maternity">Maternity Leave</mat-option>
                  <mat-option value="paternity">Paternity Leave</mat-option>
                </mat-select>
              </mat-form-field>

              <div class="grid grid-cols-2 gap-4">
                <mat-form-field appearance="fill">
                  <mat-label>Start Date</mat-label>
                  <input matInput [matDatepicker]="startPicker" formControlName="startDate" required>
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="fill">
                  <mat-label>End Date</mat-label>
                  <input matInput [matDatepicker]="endPicker" formControlName="endDate" required>
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                </mat-form-field>
              </div>

              <mat-form-field class="w-full" appearance="fill">
                <mat-label>Reason</mat-label>
                <textarea matInput formControlName="reason" rows="4" required></textarea>
              </mat-form-field>

              <button mat-raised-button 
                      type="submit"
                      class="w-full h-12 text-lg font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200"
                      [disabled]="leaveForm.invalid || loading">
                <mat-icon class="mr-2">send</mat-icon>
                {{ loading ? 'Submitting...' : 'Submit Leave Request' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Leave History -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="p-8 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl mr-4">
                    <mat-icon class="text-white text-xl">history</mat-icon>
                  </div>
                  <h2 class="text-2xl font-bold text-gray-800">Leave History</h2>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="flex space-x-2">
                    <span class="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      Pending: {{ getPendingCount() }}
                    </span>
                    <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Approved: {{ getApprovedCount() }}
                    </span>
                  </div>
                  <button mat-raised-button 
                          color="warn"
                          class="transform hover:scale-105 transition-all duration-200"
                          (click)="clearLeaveHistory()"
                          *ngIf="leaves.length > 0">
                    <mat-icon class="mr-1">clear_all</mat-icon>
                    Clear History
                  </button>
                </div>
              </div>
            </div>

            <div class="p-8">
              <div class="space-y-4" *ngIf="leaves.length > 0; else noLeaves">
                <div *ngFor="let leave of leaves" 
                     class="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors border border-gray-200">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center mb-3">
                        <div class="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-lg mr-3">
                          <mat-icon class="text-white text-sm">{{ getLeaveIcon(leave.leaveType) }}</mat-icon>
                        </div>
                        <div>
                          <h3 class="font-semibold text-gray-800 text-lg">{{ leave.leaveType | titlecase }} Leave</h3>
                          <p class="text-sm text-gray-600">{{ leave.startDate | date:'mediumDate' }} - {{ leave.endDate | date:'mediumDate' }}</p>
                        </div>
                      </div>
                      
                      <p class="text-gray-700 mb-3">{{ leave.reason }}</p>
                      
                      <div class="flex items-center text-sm text-gray-500">
                        <mat-icon class="text-xs mr-1">schedule</mat-icon>
                        Duration: {{ getDuration(leave.startDate, leave.endDate) }} day(s)
                      </div>
                    </div>
                    
                    <div class="flex flex-col items-end space-y-2">
                      <span class="px-4 py-2 rounded-full text-sm font-medium border" 
                            [ngClass]="{
                              'bg-yellow-100 text-yellow-800 border-yellow-200': leave.status === 'pending',
                              'bg-green-100 text-green-800 border-green-200': leave.status === 'approved',
                              'bg-red-100 text-red-800 border-red-200': leave.status === 'rejected'
                            }">
                        {{ leave.status | titlecase }}
                      </span>
                      
                      <div class="text-xs text-gray-500">
                        {{ getDuration(leave.startDate, leave.endDate) }} day(s)
                      </div>
                      
                      <div *ngIf="authService.isAdmin() && leave.status === 'pending'" class="flex space-x-2">
                        <button mat-mini-fab 
                                color="primary"
                                class="transform hover:scale-110 transition-transform"
                                (click)="approveLeave(leave.id)">
                          <mat-icon>check</mat-icon>
                        </button>
                        <button mat-mini-fab 
                                color="warn"
                                class="transform hover:scale-110 transition-transform"
                                (click)="rejectLeave(leave.id)">
                          <mat-icon>close</mat-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ng-template #noLeaves>
                <div class="text-center py-16">
                  <mat-icon class="text-6xl text-gray-400 mb-4">event_busy</mat-icon>
                  <h3 class="text-xl font-semibold text-gray-600 mb-2">No leave requests found</h3>
                  <p class="text-gray-500">Your leave history will appear here once you apply for leave</p>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LeaveManagementComponent implements OnInit {
  leaveForm: FormGroup;
  leaves: Leave[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    if (this.authService.isAdmin()) {
      this.leaveService.getAllLeaves().subscribe(leaves => {
        this.leaves = leaves;
      });
    } else {
      this.leaveService.getMyLeaves().subscribe(leaves => {
        this.leaves = leaves;
      });
    }
  }

  applyLeave(): void {
    if (this.leaveForm.valid) {
      this.loading = true;
      this.leaveService.applyLeave(this.leaveForm.value).subscribe({
        next: () => {
          this.snackBar.open('Leave request submitted successfully', 'Close', { duration: 3000 });
          this.leaveForm.reset();
          // Reload leaves to show the new application
          setTimeout(() => {
            this.loadLeaves();
          }, 500);
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Failed to submit leave request', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  approveLeave(id: number): void {
    this.leaveService.approveLeave(id).subscribe(() => {
      this.snackBar.open('Leave approved successfully', 'Close', { duration: 3000 });
      setTimeout(() => {
        this.loadLeaves();
      }, 500);
    });
  }

  rejectLeave(id: number): void {
    this.leaveService.rejectLeave(id).subscribe(() => {
      this.snackBar.open('Leave rejected successfully', 'Close', { duration: 3000 });
      setTimeout(() => {
        this.loadLeaves();
      }, 500);
    });
  }

  getPendingCount(): number {
    return this.leaves.filter(leave => leave.status === 'pending').length;
  }

  getApprovedCount(): number {
    return this.leaves.filter(leave => leave.status === 'approved').length;
  }

  getLeaveIcon(leaveType: string): string {
    const icons: { [key: string]: string } = {
      'sick': 'local_hospital',
      'casual': 'beach_access',
      'annual': 'flight_takeoff',
      'maternity': 'child_care',
      'paternity': 'family_restroom'
    };
    return icons[leaveType] || 'event';
  }

  getDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  clearLeaveHistory(): void {
    const confirmMessage = this.authService.isAdmin() 
      ? 'Are you sure you want to clear ALL leave records? This action cannot be undone.'
      : 'Are you sure you want to clear your leave history? This action cannot be undone.';
    
    if (confirm(confirmMessage)) {
      const clearMethod = this.authService.isAdmin() 
        ? this.leaveService.clearAllLeaves()
        : this.leaveService.clearMyLeaves();
      
      clearMethod.subscribe({
        next: () => {
          this.snackBar.open('Leave history cleared successfully', 'Close', { duration: 3000 });
          this.loadLeaves();
        },
        error: () => {
          this.snackBar.open('Failed to clear leave history', 'Close', { duration: 3000 });
        }
      });
    }
  }
}