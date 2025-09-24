import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'http://localhost:3000/api/attendance';

  constructor(private http: HttpClient) {}

  getAllAttendance(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.apiUrl);
  }

  getMyAttendance(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/my-attendance`);
  }

  checkIn(): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}/checkin`, {});
  }

  checkOut(): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.apiUrl}/checkout`, {});
  }
}