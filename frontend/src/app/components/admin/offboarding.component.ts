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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OffboardingService } from '../../services/offboarding.service';
import { EmployeeService } from '../../services/employee.service';
import { Offboarding, Employee } from '../../models/user.model';

@Component({
  selector: 'app-offboarding',
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
    MatCheckboxModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6 relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-red-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
      </div>

      <div class="relative z-10">
        <!-- Header Section -->
        <div class="glass-card p-10 mb-8 slide-in">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-4">
                <div class="bg-gradient-to-br from-red-500 via-orange-600 to-yellow-500 p-1 rounded-2xl mr-4">
                  <div class="bg-white p-3 rounded-xl">
                    <mat-icon class="text-3xl gradient-text-warm">exit_to_app</mat-icon>
                  </div>
                </div>
                <div>
                  <h1 class="text-5xl font-bold gradient-text-warm mb-2 font-poppins">
                    Employee Offboarding
                  </h1>
                  <p class="text-xl text-gray-600 font-semibold">Manage employee exit process</p>
                </div>
              </div>
            </div>
            <div class="hidden lg:block">
              <div class="bg-gradient-to-br from-red-500 via-orange-600 to-yellow-500 p-6 rounded-3xl shadow-2xl neon-glow animate-float">
                <mat-icon class="text-white text-6xl">person_remove</mat-icon>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Initiate Offboarding Form -->
          <div class="lg:col-span-1">
            <div class="glass-card p-8 slide-in" style="animation-delay: 0.2s;">
              <div class="flex items-center mb-6">
                <div class="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-xl mr-4">
                  <mat-icon class="text-white text-xl">person_off</mat-icon>
                </div>
                <h2 class="text-2xl font-bold text-gray-800">Initiate Offboarding</h2>
              </div>
              
              <form [formGroup]="offboardingForm" (ngSubmit)="initiateOffboarding()" class="space-y-6">
                <mat-form-field class="w-full" appearance="outline">
                  <mat-label>Select Employee</mat-label>
                  <mat-select formControlName="employeeId" required>
                    <mat-option *ngFor="let employee of employees" [value]="employee.id">
                      {{ employee.firstName }} {{ employee.lastName }} ({{ employee.employeeId }})
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="w-full" appearance="outline">
                  <mat-label>Reason</mat-label>
                  <mat-select formControlName="reason" required>
                    <mat-option value="resignation">Resignation</mat-option>
                    <mat-option value="termination">Termination</mat-option>
                    <mat-option value="retirement">Retirement</mat-option>
                    <mat-option value="contract_end">Contract End</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="w-full" appearance="outline">
                  <mat-label>Last Working Day</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="lastWorkingDay" required>
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>

                <mat-form-field class="w-full" appearance="outline">
                  <mat-label>Notes</mat-label>
                  <textarea matInput formControlName="notes" rows="4"></textarea>
                </mat-form-field>

                <button mat-raised-button 
                        type="submit"
                        class="w-full h-14 text-lg font-bold btn-danger"
                        [disabled]="offboardingForm.invalid || loading">
                  <mat-icon class="mr-2">start</mat-icon>
                  {{ loading ? 'Initiating...' : 'Initiate Offboarding' }}
                </button>
              </form>
            </div>
          </div>

          <!-- Offboarding Records -->
          <div class="lg:col-span-2">
            <div class="glass-card p-8 slide-in" style="animation-delay: 0.4s;">
              <div class="flex items-center mb-6">
                <div class="bg-gradient-to-r from-orange-500 to-yellow-600 p-3 rounded-xl mr-4">
                  <mat-icon class="text-white text-xl">list</mat-icon>
                </div>
                <h2 class="text-2xl font-bold text-gray-800">Offboarding Records</h2>
              </div>

              <div class="space-y-4 max-h-96 overflow-y-auto">
                <div *ngFor="let offboarding of offboardings; let i = index" 
                     class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                     [style.animation-delay]="(0.6 + i * 0.1) + 's'"
                     style="animation: slideIn 0.6s ease-out both;">
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                      <h3 class="font-bold text-lg text-gray-800 mb-2">
                        {{ offboarding.Employee?.firstName }} {{ offboarding.Employee?.lastName }}
                      </h3>
                      <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span class="text-gray-600">Reason:</span>
                          <span class="font-semibold ml-2 capitalize">{{ offboarding.reason.replace('_', ' ') }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">Last Day:</span>
                          <span class="font-semibold ml-2">{{ offboarding.lastWorkingDay | date:'mediumDate' }}</span>
                        </div>
                      </div>
                    </div>
                    <span class="px-4 py-2 rounded-2xl text-sm font-bold" 
                          [ngClass]="getStatusClass(offboarding.status)">
                      {{ offboarding.status | titlecase }}
                    </span>
                  </div>

                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <mat-checkbox 
                      [checked]="offboarding.exitInterviewCompleted"
                      (change)="updateOffboarding(offboarding.id, 'exitInterviewCompleted', $event.checked)"
                      [disabled]="offboarding.status === 'completed'">
                      Exit Interview Completed
                    </mat-checkbox>
                    <mat-checkbox 
                      [checked]="offboarding.assetsReturned"
                      (change)="updateOffboarding(offboarding.id, 'assetsReturned', $event.checked)"
                      [disabled]="offboarding.status === 'completed'">
                      Assets Returned
                    </mat-checkbox>
                  </div>

                  <div class="flex items-center justify-between">
                    <mat-form-field class="flex-1 mr-4" appearance="outline">
                      <mat-label>Final Settlement (₹)</mat-label>
                      <input matInput type="number" 
                             [value]="offboarding.finalSettlementAmount"
                             (blur)="updateSettlement(offboarding.id, $event)"
                             [disabled]="offboarding.status === 'completed'">
                    </mat-form-field>
                    
                    <button mat-raised-button 
                            color="primary"
                            (click)="completeOffboarding(offboarding.id)"
                            [disabled]="offboarding.status === 'completed' || !canComplete(offboarding)"
                            class="transform hover:scale-105 transition-all duration-200">
                      <mat-icon class="mr-1">check_circle</mat-icon>
                      Complete
                    </button>
                  </div>

                  <div *ngIf="offboarding.notes" class="mt-4 p-3 bg-gray-100 rounded-lg">
                    <span class="text-sm text-gray-600 font-medium">Notes:</span>
                    <p class="text-sm text-gray-700 mt-1">{{ offboarding.notes }}</p>
                  </div>
                </div>

                <div *ngIf="offboardings.length === 0" class="text-center py-12 text-gray-500">
                  <div class="bg-gray-100 p-6 rounded-3xl inline-block mb-4">
                    <mat-icon class="text-6xl text-gray-400">person_off</mat-icon>
                  </div>
                  <p class="text-xl font-semibold">No offboarding records</p>
                  <p class="text-gray-400 mt-2">Employee offboarding records will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OffboardingComponent implements OnInit {
  offboardingForm: FormGroup;
  offboardings: Offboarding[] = [];
  employees: Employee[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private offboardingService: OffboardingService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {
    this.offboardingForm = this.fb.group({
      employeeId: ['', Validators.required],
      reason: ['', Validators.required],
      lastWorkingDay: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.employeeService.getAllEmployees().subscribe(employees => {
      this.employees = employees.filter(emp => emp.isActive);
    });
    
    this.offboardingService.getAllOffboardings().subscribe(offboardings => {
      this.offboardings = offboardings;
    });
  }

  initiateOffboarding(): void {
    if (this.offboardingForm.valid) {
      this.loading = true;
      this.offboardingService.initiateOffboarding(this.offboardingForm.value).subscribe({
        next: () => {
          this.snackBar.open('Offboarding initiated successfully', 'Close', { duration: 3000 });
          this.offboardingForm.reset();
          this.loadData();
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Failed to initiate offboarding', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  updateOffboarding(id: number, field: string, value: any): void {
    const updates = { [field]: value };
    this.offboardingService.updateOffboarding(id, updates).subscribe({
      next: () => {
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Failed to update offboarding', 'Close', { duration: 3000 });
      }
    });
  }

  completeOffboarding(id: number): void {
    this.offboardingService.completeOffboarding(id).subscribe({
      next: () => {
        this.snackBar.open('Offboarding completed successfully', 'Close', { duration: 3000 });
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Failed to complete offboarding', 'Close', { duration: 3000 });
      }
    });
  }

  canComplete(offboarding: Offboarding): boolean {
    return offboarding.exitInterviewCompleted && offboarding.assetsReturned;
  }

  updateSettlement(id: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.updateOffboarding(id, 'finalSettlementAmount', target.value);
    }
  }

  getStatusClass(status: string): string {
    const classes = {
      'initiated': 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-300',
      'in_progress': 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-300',
      'completed': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300'
    };
    return classes[status as keyof typeof classes] || classes.initiated;
  }
}