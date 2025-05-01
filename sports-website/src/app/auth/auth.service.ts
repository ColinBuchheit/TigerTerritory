import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthModel, AuthResponse } from './auth.model';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; 
  private tokenExpirationTimer: any;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private userSubject = new BehaviorSubject<any>(null);
  
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  handleAuth(auth: AuthModel, isRegister: boolean): Observable<AuthResponse> {
    const endpoint = isRegister ? `${this.apiUrl}/register` : `${this.apiUrl}/login`;
    
    const payload = isRegister ? {
      name: auth.username, 
      email: auth.email,
      password: auth.password
    } : {
      email: auth.email,
      password: auth.password
    };
    
    return this.http.post<AuthResponse>(endpoint, payload).pipe(
      tap(response => {
        if (response.success && response.data.token) {
          this.handleAuthentication(response.data.token);
        }
      }),
      catchError(error => {
        console.error('Authentication error:', error);
        return of({
          success: false,
          message: error.error?.message || 'Authentication failed',
          data: { token: '' },
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  private handleAuthentication(token: string): void {
    localStorage.setItem('auth_token', token);
    
    // Decode the token to get user information
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      try {
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        const expirationDate = new Date(tokenPayload.exp * 1000);
        
        // Store user info
        this.userSubject.next(tokenPayload.user);
        
        this.setAutoLogout(expirationDate);
      } catch (e) {
        console.error('Error parsing JWT token:', e);
      }
    }
    
    this.isAuthenticatedSubject.next(true);
  }
  
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`).pipe(
      tap(response => {
        if (response) {
          this.userSubject.next(response);
        }
      }),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        if (error.status === 401) {
          this.logout();
        }
        return of(null);
      })
    );
  }
  
  private setAutoLogout(expirationDate: Date): void {
    const expirationDuration = expirationDate.getTime() - new Date().getTime();
    
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
  
  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;
      
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      const expirationDate = new Date(tokenPayload.exp * 1000);
      
      return expirationDate > new Date();
    } catch {
      return false;
    }
  }
  
  checkAuthStatus(): void {
    const isAuthenticated = this.hasValidToken();
    this.isAuthenticatedSubject.next(isAuthenticated);
    
    if (isAuthenticated) {
      const token = this.getToken();
      if (token) {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          try {
            const tokenPayload = JSON.parse(atob(tokenParts[1]));
            const expirationDate = new Date(tokenPayload.exp * 1000);
            
            // Update user info
            this.userSubject.next(tokenPayload.user);
            
            if (expirationDate > new Date()) {
              this.setAutoLogout(expirationDate);
              // Fetch current user data
              this.getCurrentUser().subscribe();
            } else {
              this.logout();
            }
          } catch (e) {
            console.error('Error parsing JWT token:', e);
            this.logout();
          }
        }
      }
    }
  }
  
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  
  isLoggedIn(): boolean {
    return this.hasValidToken();
  }
  
  logout(): void {
    localStorage.removeItem('auth_token');
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
    
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    
    this.router.navigate(['/auth']);
  }
}
