import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { PayrollService } from '../../services/payroll.service';
import { AuthService } from '../../services/auth.service';
import { Payroll } from '../../models/user.model';

@Component({
  selector: 'app-payroll',
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
    <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <!-- Header Section -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
              Payroll Management
            </h1>
            <p class="text-gray-600 text-lg">Manage salary payments and generate payslips</p>
          </div>
          <div class="flex items-center space-x-4">
            <button mat-raised-button 
                    *ngIf="authService.isAdmin()"
                    class="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 text-lg font-medium transform hover:scale-105 transition-all duration-200"
                    (click)="generatePayroll()">
              <mat-icon class="mr-2">calculate</mat-icon>
              Generate Payroll
            </button>
            <div class="hidden md:block">
              <div class="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-full">
                <mat-icon class="text-white text-4xl">payment</mat-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Month Summary -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100" *ngIf="currentPayroll">
        <div class="flex items-center mb-6">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl mr-4">
            <mat-icon class="text-white text-xl">account_balance_wallet</mat-icon>
          </div>
          <h2 class="text-2xl font-bold text-gray-800">Current Month Payroll</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium mb-1">Basic Salary</p>
                <p class="text-2xl font-bold">₹{{ currentPayroll.basicSalary | number }}</p>
              </div>
              <mat-icon class="text-3xl opacity-80">attach_money</mat-icon>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium mb-1">Allowances</p>
                <p class="text-2xl font-bold">₹{{ currentPayroll.allowances | number }}</p>
              </div>
              <mat-icon class="text-3xl opacity-80">add_circle</mat-icon>
            </div>
          </div>

          <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-100 text-sm font-medium mb-1">Deductions</p>
                <p class="text-2xl font-bold">₹{{ currentPayroll.deductions | number }}</p>
              </div>
              <mat-icon class="text-3xl opacity-80">remove_circle</mat-icon>
            </div>
          </div>

          <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-emerald-100 text-sm font-medium mb-1">Net Salary</p>
                <p class="text-2xl font-bold">₹{{ currentPayroll.netSalary | number }}</p>
              </div>
              <mat-icon class="text-3xl opacity-80">account_balance</mat-icon>
            </div>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div class="flex items-center justify-between">
              <span class="text-gray-600 font-medium">Working Days</span>
              <span class="text-xl font-bold text-gray-800">{{ currentPayroll.workingDays }}</span>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div class="flex items-center justify-between">
              <span class="text-gray-600 font-medium">Present Days</span>
              <span class="text-xl font-bold text-gray-800">{{ currentPayroll.presentDays }}</span>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div class="flex items-center justify-between">
              <span class="text-gray-600 font-medium">Attendance %</span>
              <span class="text-xl font-bold text-gray-800">{{ getAttendancePercentage() }}%</span>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button mat-raised-button 
                  class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 font-medium transform hover:scale-105 transition-all duration-200"
                  (click)="downloadPayslip(currentPayroll.id)">
            <mat-icon class="mr-2">download</mat-icon>
            Download Payslip
          </button>
        </div>
      </div>

      <!-- Payroll History -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="p-8 border-b border-gray-200">
          <div class="flex items-center">
            <div class="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl mr-4">
              <mat-icon class="text-white text-xl">history</mat-icon>
            </div>
            <h2 class="text-2xl font-bold text-gray-800">Payroll History</h2>
          </div>
        </div>

        <div class="p-8">
          <div class="space-y-4" *ngIf="payrollHistory.length > 0; else noPayroll">
            <div *ngFor="let payroll of payrollHistory" 
                 class="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors border border-gray-200">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center mb-4">
                    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl mr-4">
                      <mat-icon class="text-white text-lg">calendar_month</mat-icon>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-800 text-lg">{{ getMonthName(payroll.month) }} {{ payroll.year }}</h3>
                      <p class="text-sm text-gray-600" *ngIf="payroll.Employee">{{ payroll.Employee.firstName }} {{ payroll.Employee.lastName }} ({{ payroll.Employee.employeeId }})</p>
                      <p class="text-sm text-gray-600" *ngIf="!payroll.Employee">Payroll Period</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div class="text-center">
                      <div class="text-lg font-bold text-blue-600">₹{{ payroll.basicSalary | number }}</div>
                      <div class="text-xs text-gray-500">Basic Salary</div>
                    </div>
                    <div class="text-center">
                      <div class="text-lg font-bold text-green-600">₹{{ payroll.allowances | number }}</div>
                      <div class="text-xs text-gray-500">Allowances</div>
                    </div>
                    <div class="text-center">
                      <div class="text-lg font-bold text-red-600">₹{{ payroll.deductions | number }}</div>
                      <div class="text-xs text-gray-500">Deductions</div>
                    </div>
                    <div class="text-center">
                      <div class="text-lg font-bold text-emerald-600">₹{{ payroll.netSalary | number }}</div>
                      <div class="text-xs text-gray-500">Net Salary</div>
                    </div>
                  </div>

                  <div class="flex items-center space-x-6 text-sm text-gray-600">
                    <span>
                      <mat-icon class="text-xs mr-1">work</mat-icon>
                      {{ payroll.workingDays }} working days
                    </span>
                    <span>
                      <mat-icon class="text-xs mr-1">check_circle</mat-icon>
                      {{ payroll.presentDays }} present days
                    </span>
                    <span>
                      <mat-icon class="text-xs mr-1">percent</mat-icon>
                      {{ Math.round((payroll.presentDays / payroll.workingDays) * 100) }}% attendance
                    </span>
                  </div>
                </div>

                <div class="flex flex-col items-end space-y-3">
                  <div class="text-right">
                    <div class="text-2xl font-bold text-emerald-600">₹{{ payroll.netSalary | number }}</div>
                    <div class="text-xs text-gray-500">Net Amount</div>
                  </div>
                  
                  <button mat-raised-button 
                          size="small"
                          class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transform hover:scale-105 transition-all duration-200"
                          (click)="downloadPayslip(payroll.id)">
                    <mat-icon class="mr-1 text-sm">download</mat-icon>
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ng-template #noPayroll>
            <div class="text-center py-16">
              <mat-icon class="text-6xl text-gray-400 mb-4">receipt_long</mat-icon>
              <h3 class="text-xl font-semibold text-gray-600 mb-2">No payroll records found</h3>
              <p class="text-gray-500">Payroll history will appear here once generated</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `
})
export class PayrollComponent implements OnInit {
  payrollHistory: Payroll[] = [];
  currentPayroll: Payroll | null = null;

  constructor(
    private payrollService: PayrollService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPayroll();
  }

  loadPayroll(): void {
    if (this.authService.isAdmin()) {
      this.payrollService.getAllPayrolls().subscribe((payrolls: Payroll[]) => {
        this.payrollHistory = payrolls;
        this.setCurrentPayroll();
      });
    } else {
      this.payrollService.getMyPayroll().subscribe((payrolls: Payroll[]) => {
        this.payrollHistory = payrolls;
        this.setCurrentPayroll();
      });
    }
  }

  setCurrentPayroll(): void {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    this.currentPayroll = this.payrollHistory.find(payroll => 
      payroll.month === currentMonth && payroll.year === currentYear
    ) || this.payrollHistory[0] || null;
  }

  generatePayroll(): void {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    this.payrollService.generatePayroll({
      employeeId: 1, // This should be dynamic based on selected employee
      month: currentMonth,
      year: currentYear
    }).subscribe({
      next: () => {
        this.snackBar.open('Payroll generated successfully', 'Close', { duration: 3000 });
        this.loadPayroll();
      },
      error: () => {
        this.snackBar.open('Failed to generate payroll', 'Close', { duration: 3000 });
      }
    });
  }

  downloadPayslip(payrollId: number): void {
    this.payrollService.downloadPayslip(payrollId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `payslip-${payrollId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.snackBar.open('Failed to download payslip', 'Close', { duration: 3000 });
      }
    });
  }

  getAttendancePercentage(): number {
    if (!this.currentPayroll) return 0;
    return Math.round((this.currentPayroll.presentDays / this.currentPayroll.workingDays) * 100);
  }

  getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || '';
  }

  Math = Math;
}