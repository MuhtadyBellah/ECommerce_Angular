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

      if (
        req.url.includes('auth/signin') ||
        req.url.includes('users/changeMyPassword') ||
        req.url.includes('auth/resetPassword')
      ) {
        const data = response?.body;

        if (data) {
          authService.setUserData(data.token);
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
