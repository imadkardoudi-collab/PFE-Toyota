import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  role: string;
  expiresIn: number; // in seconds
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = 'http://localhost:8080/auth';
  private tokenExpirationTimer: any;
  private refreshTokenTimer: any;
  private userRole$ = new BehaviorSubject<string | null>(null);
  private logoutSubject = new Subject<void>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeToken();
  }

  login(data: any) {
    return this.http.post<LoginResponse>(this.API + '/login', data).pipe(
      tap(response => {
        this.saveTokensInternal(response.accessToken, response.refreshToken, response.role, response.expiresIn);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  // 🔄 Refresh access token using refresh token (automatic)
  refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<LoginResponse>(this.API + '/refresh', { refreshToken }).pipe(
      tap(response => {
        this.saveAccessTokenInternal(response.accessToken, response.expiresIn);
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  // Save both access and refresh tokens (internal method)
  private saveTokensInternal(accessToken: string, refreshToken: string, role: string, expiresIn: number) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('role', role);
    this.userRole$.next(role);
    
    this.setupTokenExpirationTimers(expiresIn);
  }

  // Public method to save tokens from response object
  saveTokens(res: any) {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('role', res.role);
  }

  // Save only access token (for refresh endpoint)
  private saveAccessTokenInternal(accessToken: string, expiresIn: number) {
    localStorage.setItem('accessToken', accessToken);
    this.setupTokenExpirationTimers(expiresIn);
  }

  // Get access token (used by interceptor)
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  // Get refresh token (used for refresh endpoint)
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  getRole() {
    return localStorage.getItem('role');
  }

  getRole$() {
    return this.userRole$.asObservable();
  }

  isLoggedIn() {
    return !!this.getAccessToken();
  }

  logout() {
    // Clear all tokens and role
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    this.userRole$.next(null);
    
    // Clear all timers
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    if (this.refreshTokenTimer) {
      clearTimeout(this.refreshTokenTimer);
    }

    this.logoutSubject.next();
    this.router.navigate(['/login']);
  }

  getLogoutSubject() {
    return this.logoutSubject.asObservable();
  }

  // Setup timers for token expiration and refresh
  private setupTokenExpirationTimers(expiresIn: number) {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      const payload = this.parseJwt(accessToken);
      if (payload && payload.exp) {
        const expirationTime = payload.exp * 1000;
        const currentTime = new Date().getTime();
        const timeUntilExpiration = expirationTime - currentTime;

        // Clear existing timers
        if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
        if (this.refreshTokenTimer) clearTimeout(this.refreshTokenTimer);

        // 🔄 Timer 1: Auto-refresh token 5 minutes before expiration
        const refreshTime = Math.max(0, timeUntilExpiration - 300000);
        this.refreshTokenTimer = setTimeout(() => {
          console.log('🔄 Auto-refreshing access token...');
          this.refreshAccessToken().subscribe({
            next: () => console.log('✅ Token refreshed successfully'),
            error: (err) => console.error('❌ Token refresh failed:', err)
          });
        }, refreshTime);

        // ⏰ Timer 2: Final logout 1 minute before actual expiration
        const warningTime = Math.max(0, timeUntilExpiration - 60000);
        this.tokenExpirationTimer = setTimeout(() => {
          console.log('⏰ Session expiring - logging out');
          this.logout();
        }, warningTime);
      }
    }
  }

  // Parse JWT token to extract claims
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  // Initialize tokens on service creation
  private initializeToken() {
    const role = this.getRole();
    if (role) {
      this.userRole$.next(role);
      this.setupTokenExpirationTimers(0);
    }
  }
}