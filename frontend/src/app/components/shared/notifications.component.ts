import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/user.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule
  ],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="notificationMenu" class="relative" (click)="onNotificationClick()">
      <mat-icon [matBadge]="unreadCount" [matBadgeHidden]="unreadCount === 0" matBadgeColor="warn">
        notifications
      </mat-icon>
    </button>

    <mat-menu #notificationMenu="matMenu" class="notification-menu">
      <div class="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-gray-800">Notifications</h3>
          <button mat-button 
                  class="text-sm text-blue-600 hover:text-blue-700"
                  (click)="markAllAsRead()"
                  *ngIf="unreadCount > 0">
            Mark all read
          </button>
        </div>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div *ngFor="let notification of notifications; let i = index" 
             class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
             [class.bg-blue-50]="!notification.isRead"
             (click)="markAsRead(notification)">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full flex items-center justify-center"
                   [ngClass]="getNotificationIconClass(notification.type)">
                <mat-icon class="text-white text-sm">{{ getNotificationIcon(notification.type) }}</mat-icon>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-800 text-sm" [class.font-bold]="!notification.isRead">
                {{ notification.title }}
              </p>
              <p class="text-gray-600 text-xs mt-1 line-clamp-2">
                {{ notification.message }}
              </p>
              <p class="text-gray-400 text-xs mt-2">
                {{ notification.createdAt | date:'short' }}
              </p>
            </div>
            <div *ngIf="!notification.isRead" class="flex-shrink-0">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div *ngIf="notifications.length === 0" class="p-8 text-center text-gray-500">
          <mat-icon class="text-4xl mb-2 text-gray-400">notifications_none</mat-icon>
          <p class="text-sm">No notifications yet</p>
          <button mat-button class="mt-2 text-blue-600" (click)="loadNotifications()">
            Refresh
          </button>
        </div>
        
        <div class="p-4 text-center border-t border-gray-200">
          <p class="text-xs text-gray-500">Total: {{ notifications.length }} | Unread: {{ unreadCount }}</p>
        </div>
      </div>
    </mat-menu>
  `,
  styles: [`
    ::ng-deep .notification-menu .mat-mdc-menu-panel {
      width: 380px;
      max-width: 90vw;
    }
    
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  private refreshSubscription?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
    
    // Refresh notifications every 30 seconds
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadNotifications();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  onNotificationClick(): void {
    console.log('Notification button clicked');
    this.loadNotifications();
  }

  loadNotifications(): void {
    console.log('Loading notifications...');
    this.notificationService.getMyNotifications().subscribe({
      next: (notifications) => {
        console.log('Notifications loaded:', notifications);
        this.notifications = notifications;
        this.unreadCount = notifications.filter(n => !n.isRead).length;
        console.log('Unread count:', this.unreadCount);
        this.notificationService.updateUnreadCount(this.unreadCount);
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.isRead = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        this.notificationService.updateUnreadCount(this.unreadCount);
      });
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.unreadCount = 0;
      this.notificationService.updateUnreadCount(0);
    });
  }

  getNotificationIcon(type: string): string {
    const icons = {
      'leave_approved': 'check_circle',
      'leave_rejected': 'cancel',
      'payroll_generated': 'payment',
      'attendance_alert': 'schedule',
      'offboarding': 'exit_to_app'
    };
    return icons[type as keyof typeof icons] || 'notifications';
  }

  getNotificationIconClass(type: string): string {
    const classes = {
      'leave_approved': 'bg-green-500',
      'leave_rejected': 'bg-red-500',
      'payroll_generated': 'bg-blue-500',
      'attendance_alert': 'bg-orange-500',
      'offboarding': 'bg-purple-500'
    };
    return classes[type as keyof typeof classes] || 'bg-gray-500';
  }
}