import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payroll } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private apiUrl = 'http://localhost:3000/api/payroll';

  constructor(private http: HttpClient) {}

  getAllPayrolls(): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(this.apiUrl);
  }

  getMyPayroll(): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(`${this.apiUrl}/my-payroll`);
  }

  generatePayroll(data: { employeeId: number; month: number; year: number }): Observable<Payroll> {
    return this.http.post<Payroll>(`${this.apiUrl}/generate`, data);
  }

  downloadPayslip(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}