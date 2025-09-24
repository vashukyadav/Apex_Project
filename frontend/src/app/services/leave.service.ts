import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Leave } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:3000/api/leaves';

  constructor(private http: HttpClient) {}

  getAllLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(this.apiUrl);
  }

  getMyLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/my-leaves`);
  }

  applyLeave(leave: Partial<Leave>): Observable<Leave> {
    return this.http.post<Leave>(this.apiUrl, leave);
  }

  approveLeave(id: number): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectLeave(id: number): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/${id}/reject`, {});
  }

  clearAllLeaves(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear-all`);
  }

  clearMyLeaves(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear-my-leaves`);
  }
}