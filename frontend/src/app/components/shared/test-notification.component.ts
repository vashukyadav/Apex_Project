import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-test-notification',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <button mat-raised-button color="primary" (click)="testNotifications()">
      Test Notifications
    </button>
    <div *ngIf="testResult" class="mt-2 p-2 bg-gray-100 rounded">
      {{ testResult }}
    </div>
  `
})
export class TestNotificationComponent {
  testResult = '';

  constructor(private notificationService: NotificationService) {}

  testNotifications(): void {
    console.log('Testing notifications...');
    this.testResult = 'Loading...';
    
    this.notificationService.getMyNotifications().subscribe({
      next: (notifications) => {
        this.testResult = `Success! Found ${notifications.length} notifications`;
        console.log('Test result:', notifications);
      },
      error: (error) => {
        this.testResult = `Error: ${error.message}`;
        console.error('Test error:', error);
      }
    });
  }
}