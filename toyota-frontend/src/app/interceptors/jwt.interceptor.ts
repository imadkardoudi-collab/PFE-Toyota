import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Get access token from localStorage
    const accessToken = this.authService.getAccessToken();

    // If access token exists, add it to request headers
    if (accessToken) {
      request = this.addTokenToRequest(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized - Token expired
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshTokenSubject.next(null);

          // Try to refresh the access token
          return this.authService.refreshAccessToken().pipe(
            switchMap((response: any) => {
              this.isRefreshing = false;
              const newAccessToken = response.accessToken;
              this.refreshTokenSubject.next(newAccessToken);

              // Retry the original request with new token
              return next.handle(this.addTokenToRequest(request, newAccessToken));
            }),
            catchError((err) => {
              this.isRefreshing = false;
              this.authService.logout();
              return throwError(() => err);
            })
          );
        } else if (error.status === 401 && this.isRefreshing) {
          // Wait for token refresh to complete, then retry
          return this.refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(token => {
              return next.handle(this.addTokenToRequest(request, token));
            }),
            catchError((err) => {
              this.authService.logout();
              return throwError(() => err);
            })
          );
        } else if (error.status === 401) {
          // Other 401 errors - logout
          this.authService.logout();
          return throwError(() => error);
        }

        return throwError(() => error);
      })
    );
  }

  // Helper method to add token to request
  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
