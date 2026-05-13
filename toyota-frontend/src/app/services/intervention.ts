import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../models/intervention';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {

  private apiUrl = 'http://localhost:8080/api/interventions';

  constructor(private http: HttpClient) {}

  getInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(this.apiUrl);
  }

  getIntervention(id: number): Observable<Intervention> {
    return this.http.get<Intervention>(`${this.apiUrl}/${id}`);
  }

  addIntervention(intervention: Intervention): Observable<Intervention> {
    return this.http.post<Intervention>(this.apiUrl, intervention);
  }

  updateIntervention(id: number, intervention: Intervention): Observable<Intervention> {
    return this.http.put<Intervention>(`${this.apiUrl}/${id}`, intervention);
  }

  deleteIntervention(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get interventions for a specific vehicle
  getInterventionsByVehicle(vehicleId: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/vehicule/${vehicleId}`);
  }

  // Get interventions by type
  getInterventionsByType(type: string): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/type/${type}`);
  }

  // Get interventions by status
  getInterventionsByStatus(status: string): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/status/${status}`);
  }

  // Get interventions by date range
  getInterventionsByDateRange(startDate: string, endDate: string): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/daterange?startDate=${startDate}&endDate=${endDate}`);
  }

  // Get total revenue
  getTotalRevenue(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/revenue`);
  }

  // Get monthly revenue
  getMonthlyRevenue(yearMonth: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/revenue/monthly/${yearMonth}`);
  }

  // Get monthly intervention count
  getMonthlyCount(yearMonth: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/count/monthly/${yearMonth}`);
  }

  // Get recent interventions
  getRecentInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/recent`);
  }
}