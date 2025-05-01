import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthModel } from './auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth'; 

  constructor(private http: HttpClient) { }

  handleAuth(auth: AuthModel, isRegister: boolean): Observable<any> {
    const endpoint = isRegister ? `${this.apiUrl}/register` : `${this.apiUrl}/login`;
    
    const payload = {
      name: auth.username, 
      email: auth.email,
      password: auth.password
    };
    
    const loginPayload = {
      email: auth.email,
      password: auth.password
    };
    
    return this.http.post(endpoint, isRegister ? payload : loginPayload);
  }
  
  storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }
  
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  logout(): void {
    localStorage.removeItem('auth_token');
  }
}