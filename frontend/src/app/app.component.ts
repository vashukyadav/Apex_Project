import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/shared/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    NavbarComponent
  ],
  template: `
    <div class="min-h-screen">
      <app-navbar *ngIf="authService.isLoggedIn()">
        <router-outlet></router-outlet>
      </app-navbar>
      <router-outlet *ngIf="!authService.isLoggedIn()"></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}
}