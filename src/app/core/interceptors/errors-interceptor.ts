import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { ErrorHandlerService } from '../services/error-handler.service';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    tap((response: any) => {
      console.log(`Request ${req.url} came from: Unknown or Service`, response);

      if (errorHandler.shouldShowSuccessNotification(req.url, req.method)) {
        errorHandler.handleSuccess(response);
      }

      if (req.url.includes('auth/signin') || req.url.includes('users/changeMyPassword')) {
        const data = response?.body;

        if (data) {
          if (req.url.includes('auth/signin')) {
            authService.setUserData(data.token, data.user);
          } else if (req.url.includes('users/changeMyPassword')) {
            const currentUser = authService.currentUser();
            if (currentUser) {
              authService.setUserData(data.token, currentUser);
            }
          }
          // Navigation handled by the component, not interceptor
          return;
        }
      }
    }),

    catchError((err: HttpErrorResponse) => {
      errorHandler.handleError(err);
      return throwError(() => err);
    }),
  );
};
