import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    const authRequest = request.clone({
      setHeaders: {
        'x-auth-token': token
      }
    });
    
    return next(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
  
  return next(request);
};