import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getCurrentMonthStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/current-month`);
  }

  getMonthlyStats(yearMonth: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/monthly/${yearMonth}`);
  }

  getRecentInterventions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent-interventions`);
  }

  getCounts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/counts`);
  }

  getByMonth() {
    return this.http.get<any>('http://localhost:8080/api/stats/month');
  }

  getByStatus() {
    return this.http.get<any>('http://localhost:8080/api/stats/status');
  }

  getRevenue() {
    return this.http.get<any>('http://localhost:8080/api/stats/revenue');
  }
}
