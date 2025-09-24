import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offboarding } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class OffboardingService {
  private apiUrl = 'http://localhost:3000/api/offboarding';

  constructor(private http: HttpClient) {}

  getAllOffboardings(): Observable<Offboarding[]> {
    return this.http.get<Offboarding[]>(this.apiUrl);
  }

  initiateOffboarding(offboarding: Partial<Offboarding>): Observable<Offboarding> {
    return this.http.post<Offboarding>(this.apiUrl, offboarding);
  }

  updateOffboarding(id: number, updates: Partial<Offboarding>): Observable<Offboarding> {
    return this.http.put<Offboarding>(`${this.apiUrl}/${id}`, updates);
  }

  completeOffboarding(id: number): Observable<Offboarding> {
    return this.http.put<Offboarding>(`${this.apiUrl}/${id}/complete`, {});
  }
}