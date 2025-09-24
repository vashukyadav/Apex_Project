import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/user.model';

@Component({
  selector: 'app-employee-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>{{ employee ? 'Edit Employee' : 'Add Employee' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="employeeForm" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <mat-form-field>
            <mat-label>Employee ID</mat-label>
            <input matInput formControlName="employeeId" required>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" required>
          </mat-form-field>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <mat-form-field>
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" required>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" required>
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field>
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" required>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Department</mat-label>
            <mat-select formControlName="department" required>
              <mat-option value="IT">IT</mat-option>
              <mat-option value="HR">HR</mat-option>
              <mat-option value="Finance">Finance</mat-option>
              <mat-option value="Marketing">Marketing</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field>
            <mat-label>Position</mat-label>
            <input matInput formControlName="position" required>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Salary</mat-label>
            <input matInput type="number" formControlName="salary" required>
          </mat-form-field>
        </div>

        <mat-form-field class="w-full">
          <mat-label>Join Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="joinDate" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field class="w-full" *ngIf="!employee">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="employeeForm.invalid">
        {{ employee ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `
})
export class EmployeeFormDialogComponent {
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeFormDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public employee?: Employee
  ) {
    this.employeeForm = this.fb.group({
      employeeId: [employee?.employeeId || '', Validators.required],
      firstName: [employee?.firstName || '', Validators.required],
      lastName: [employee?.lastName || '', Validators.required],
      email: [employee?.email || '', [Validators.required, Validators.email]],
      phone: [employee?.phone || '', Validators.required],
      department: [employee?.department || '', Validators.required],
      position: [employee?.position || '', Validators.required],
      salary: [employee?.salary || '', Validators.required],
      joinDate: [employee?.joinDate || '', Validators.required],
      password: ['']
    });
  }

  save(): void {
    if (this.employeeForm.valid) {
      const dialogRef = this.dialogRef;
      if (dialogRef) {
        dialogRef.close(this.employeeForm.value);
      }
    }
  }
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Employee Management
            </h1>
            <p class="text-gray-600 text-lg">Manage your team members and their information</p>
          </div>
          <button mat-raised-button 
                  class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 text-lg font-medium transform hover:scale-105 transition-all duration-200" 
                  (click)="openEmployeeDialog()">
            <mat-icon class="mr-2">person_add</mat-icon>
            Add Employee
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="p-8 border-b border-gray-200">
          <div class="flex items-center">
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl mr-4">
              <mat-icon class="text-white text-xl">people</mat-icon>
            </div>
            <h2 class="text-2xl font-bold text-gray-800">Team Members ({{ employees.length }})</h2>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="employees" class="w-full">
            <ng-container matColumnDef="employeeId">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 font-semibold text-gray-700 py-4">Employee ID</th>
              <td mat-cell *matCellDef="let employee" class="py-4">
                <span class="font-medium text-blue-600">{{ employee.employeeId }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 font-semibold text-gray-700 py-4">Name</th>
              <td mat-cell *matCellDef="let employee" class="py-4">
                <div class="flex items-center">
                  <div class="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <span class="text-white font-bold text-sm">{{ employee.firstName.charAt(0) }}{{ employee.lastName.charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">{{ employee.firstName }} {{ employee.lastName }}</p>
                    <p class="text-sm text-gray-500">{{ employee.position }}</p>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 font-semibold text-gray-700 py-4">Email</th>
              <td mat-cell *matCellDef="let employee" class="py-4">
                <span class="text-gray-600">{{ employee.email }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 font-semibold text-gray-700 py-4">Department</th>
              <td mat-cell *matCellDef="let employee" class="py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium" 
                      [ngClass]="{
                        'bg-blue-100 text-blue-800': employee.department === 'IT',
                        'bg-green-100 text-green-800': employee.department === 'HR',
                        'bg-purple-100 text-purple-800': employee.department === 'Finance',
                        'bg-orange-100 text-orange-800': employee.department === 'Marketing'
                      }">
                  {{ employee.department }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="salary">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 font-semibold text-gray-700 py-4">Salary</th>
              <td mat-cell *matCellDef="let employee" class="py-4">
                <span class="font-semibold text-green-600">₹{{ employee.salary }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 font-semibold text-gray-700 py-4">Status</th>
              <td mat-cell *matCellDef="let employee" class="py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium border" 
                      [ngClass]="employee.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'">
                  {{ employee.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="bg-gray-50 font-semibold text-gray-700 py-4">Actions</th>
              <td mat-cell *matCellDef="let employee" class="py-4">
                <div class="flex space-x-2">
                  <button mat-icon-button 
                          class="text-blue-600 hover:bg-blue-50 transition-colors" 
                          (click)="openEmployeeDialog(employee)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button 
                          class="text-red-600 hover:bg-red-50 transition-colors" 
                          (click)="deleteEmployee(employee.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns" class="border-b border-gray-200"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 transition-colors border-b border-gray-100"></tr>
          </table>
          
          <div *ngIf="employees.length === 0" class="text-center py-16">
            <mat-icon class="text-6xl text-gray-400 mb-4">people_outline</mat-icon>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">No employees found</h3>
            <p class="text-gray-500 mb-6">Get started by adding your first team member</p>
            <button mat-raised-button 
                    class="bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
                    (click)="openEmployeeDialog()">
              <mat-icon class="mr-2">person_add</mat-icon>
              Add First Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  displayedColumns: string[] = ['employeeId', 'name', 'email', 'department', 'salary', 'status', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }

  openEmployeeDialog(employee?: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
      width: '600px',
      data: employee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (employee) {
          this.employeeService.updateEmployee(employee.id, result).subscribe(() => {
            this.loadEmployees();
            this.snackBar.open('Employee updated successfully', 'Close', { duration: 3000 });
          });
        } else {
          this.employeeService.createEmployee(result).subscribe(() => {
            this.loadEmployees();
            this.snackBar.open('Employee created successfully', 'Close', { duration: 3000 });
          });
        }
      }
    });
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to deactivate this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.loadEmployees();
        this.snackBar.open('Employee deactivated successfully', 'Close', { duration: 3000 });
      });
    }
  }
}