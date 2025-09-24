import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
      </div>

      <div class="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div class="w-full max-w-lg fade-in">
          <!-- Company Branding -->
          <div class="text-center mb-8 slide-in">
            <div class="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl mb-6 neon-glow animate-float">
              <mat-icon class="text-5xl text-white">corporate_fare</mat-icon>
            </div>
            <h1 class="text-5xl font-bold text-white mb-3 tracking-tight font-poppins">
              <span class="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Enterprise HRMS
              </span>
            </h1>
            <p class="text-blue-200 text-xl font-medium">Next-Gen Human Resource Management</p>
            <div class="flex items-center justify-center mt-4 space-x-2">
              <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
              <div class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
            </div>
          </div>

          <!-- Login Card -->
          <div class="glass-card p-10 slide-in" style="animation-delay: 0.3s;">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold gradient-text mb-3 font-poppins">Welcome Back</h2>
              <p class="text-gray-600 text-lg">Sign in to access your personalized dashboard</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-8">
              <div class="space-y-6">
                <mat-form-field class="w-full" appearance="outline">
                  <mat-label class="text-lg font-medium">Email Address</mat-label>
                  <input matInput type="email" formControlName="email" required class="text-lg py-2">
                  <mat-icon matSuffix class="text-blue-500">email</mat-icon>
                  <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                    Email is required
                  </mat-error>
                  <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                    Please enter a valid email
                  </mat-error>
                </mat-form-field>

                <mat-form-field class="w-full" appearance="outline">
                  <mat-label class="text-lg font-medium">Password</mat-label>
                  <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required class="text-lg py-2">
                  <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button" class="text-blue-500 hover:text-blue-600">
                    <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                  <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                    Password is required
                  </mat-error>
                </mat-form-field>
              </div>

              <button mat-flat-button 
                      type="submit" 
                      class="w-full h-16 text-xl font-bold btn-primary relative overflow-hidden"
                      [disabled]="loginForm.invalid || loading">
                <div class="flex items-center justify-center">
                  <mat-icon *ngIf="loading" class="loading-spinner mr-3 text-2xl">refresh</mat-icon>
                  <mat-icon *ngIf="!loading" class="mr-3 text-2xl">login</mat-icon>
                  {{ loading ? 'Signing In...' : 'Sign In to Dashboard' }}
                </div>
              </button>
            </form>

            <!-- Quick Access -->
            <div class="mt-10">
              <div class="flex items-center mb-6">
                <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <span class="px-6 text-sm text-gray-500 font-semibold bg-white rounded-full py-2 shadow-lg">Quick Demo Access</span>
                <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <button mat-stroked-button 
                        (click)="quickLogin('admin')" 
                        class="h-14 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  <div class="flex items-center justify-center">
                    <mat-icon class="mr-2 text-xl">admin_panel_settings</mat-icon>
                    <span>Admin Demo</span>
                  </div>
                </button>
                <button mat-stroked-button 
                        (click)="quickLogin('employee')" 
                        class="h-14 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  <div class="flex items-center justify-center">
                    <mat-icon class="mr-2 text-xl">badge</mat-icon>
                    <span>Employee Demo</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Credentials Info -->
            <div class="mt-10 p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl border border-blue-200/50 shadow-inner">
              <div class="flex items-center mb-6">
                <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl mr-3">
                  <mat-icon class="text-white text-xl">info</mat-icon>
                </div>
                <h3 class="font-bold text-gray-800 text-lg">Demo Credentials</h3>
              </div>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
                  <span class="text-gray-700 font-semibold flex items-center">
                    <mat-icon class="mr-2 text-blue-600">admin_panel_settings</mat-icon>
                    Admin:
                  </span>
                  <code class="text-blue-700 bg-blue-100 px-3 py-2 rounded-xl font-bold text-sm">admin&#64;company.com</code>
                </div>
                <div class="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
                  <span class="text-gray-700 font-semibold flex items-center">
                    <mat-icon class="mr-2 text-emerald-600">badge</mat-icon>
                    Employee:
                  </span>
                  <code class="text-emerald-700 bg-emerald-100 px-3 py-2 rounded-xl font-bold text-sm">john.doe&#64;company.com</code>
                </div>
                <div class="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
                  <span class="text-gray-700 font-semibold flex items-center">
                    <mat-icon class="mr-2 text-purple-600">key</mat-icon>
                    Password:
                  </span>
                  <code class="text-purple-700 bg-purple-100 px-3 py-2 rounded-xl font-bold text-sm">password123</code>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="text-center mt-8 slide-in" style="animation-delay: 0.6s;">
            <p class="text-blue-200 text-sm font-medium">&copy; 2024 Enterprise HRMS. Crafted with ❤️ for modern workplaces.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  quickLogin(type: 'admin' | 'employee'): void {
    const credentials = {
      admin: { email: 'admin@company.com', password: 'password123' },
      employee: { email: 'john.doe@company.com', password: 'password123' }
    };
    
    this.loginForm.patchValue(credentials[type]);
    this.onSubmit();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Welcome back!', 'Close', { duration: 2000 });
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(error.error.message || 'Login failed', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
}