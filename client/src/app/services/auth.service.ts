import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

// Auth data model interfaces
export interface AuthModel {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user?: any;
  };
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`; 
  private tokenExpirationTimer: any;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private userSubject = new BehaviorSubject<UserProfile | null>(this.getUserFromStorage());
  
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Handle authentication (both login and register)
   */
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
          this.handleAuthentication(response.data.token, response.data.user);
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

  private handleAuthentication(token: string, user?: any): void {
    localStorage.setItem('auth_token', token);
    
    // If user data was provided directly, use it
    if (user) {
      this.storeUserData(user);
    } else {
      // Otherwise try to decode the token to get user information
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        try {
          const tokenPayload = JSON.parse(atob(tokenParts[1]));
          const expirationDate = new Date(tokenPayload.exp * 1000);
          
          // Store user info
          if (tokenPayload.user) {
            this.storeUserData(tokenPayload.user);
          }
          
          this.setAutoLogout(expirationDate);
        } catch (e) {
          console.error('Error parsing JWT token:', e);
        }
      }
    }
    
    this.isAuthenticatedSubject.next(true);
  }

  private storeUserData(userData: any): void {
    console.log('Storing user data:', userData);
    
    // Handle the case where userData is the full response object
    // with a nested data property (common in API responses)
    const userDataToStore = userData.data ? userData.data : userData;
    
    // Create user object
    const user: UserProfile = {
      id: userDataToStore.id || userDataToStore._id || '',
      name: userDataToStore.name || '',
      email: userDataToStore.email || '',
      avatar: userDataToStore.avatar || '',
      role: userDataToStore.role || 'user'
    };
    
    console.log('Processed user data:', user);
    
    // Update in memory
    this.userSubject.next(user);
    
    // Store in localStorage for persistence
    localStorage.setItem('user_data', JSON.stringify(user));
  }
  
  /**
   * Get user data from localStorage
   */
  getUserFromStorage(): UserProfile | null {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return null;
  }
  
  /**
   * Get current user profile from server
   */
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`).pipe(
      tap(response => {
        if (response) {
          this.storeUserData(response);
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

  /**
   * Get current user synchronously (without Observable)
   */
  getCurrentUserSync(): UserProfile | null {
    return this.userSubject.getValue();
  }
  
  /**
   * Get current user's name
   */
  getCurrentUserName(): string {
    const user = this.userSubject.getValue();
    return user?.name || '';
  }
  
  /**
   * Get current user's email
   */
  getCurrentUserEmail(): string {
    const user = this.userSubject.getValue();
    return user?.email || '';
  }
  
  /**
   * Set auto logout timer based on token expiration
   */
  private setAutoLogout(expirationDate: Date): void {
    const expirationDuration = expirationDate.getTime() - new Date().getTime();
    
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
  
  /**
   * Check if token is valid
   */
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
  
  /**
   * Check auth status on app startup
   */
  checkAuthStatus(): void {
    const isAuthenticated = this.hasValidToken();
    this.isAuthenticatedSubject.next(isAuthenticated);
    
    if (isAuthenticated) {
      const userData = this.getUserFromStorage();
      if (userData) {
        this.userSubject.next(userData);
      }
      
      const token = this.getToken();
      if (token) {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          try {
            const tokenPayload = JSON.parse(atob(tokenParts[1]));
            const expirationDate = new Date(tokenPayload.exp * 1000);
            
            if (expirationDate > new Date()) {
              this.setAutoLogout(expirationDate);
              // Fetch current user data to refresh info
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
  
  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  
  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.hasValidToken();
  }
  
  /**
   * Log user out
   */
  logout(): void {
    // Clear all auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Update state
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
    
    // Clear timeout
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    
    // Redirect to login page
    this.router.navigate(['/auth']);
  }
}