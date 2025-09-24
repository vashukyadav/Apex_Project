import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Notification } from '../models/user.model';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/api/notifications';
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getMyNotifications(): Observable<Notification[]> {
    console.log('Fetching notifications...');
    return this.http.get<Notification[]>(`${this.apiUrl}/my-notifications`, { headers: this.getHeaders() })
      .pipe(
        tap(notifications => console.log('Notifications received:', notifications)),
        catchError(error => {
          console.error('Error fetching notifications:', error);
          return of([]);
        })
      );
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${id}/read`, {}, { headers: this.getHeaders() });
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/mark-all-read`, {}, { headers: this.getHeaders() });
  }

  updateUnreadCount(count: number): void {
    console.log('Updating unread count:', count);
    this.unreadCountSubject.next(count);
  }
}