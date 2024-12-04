import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../app/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  req = req.clone({
    setHeaders: {
      'Content-Type': 'application/json; charset=utf-8',
      accept: 'application/json',
      authorization: `${authService.loadItemFromStorage('accessToken')}`
    }
  });

  return next(req).pipe(
    switchMap((res: any) => {
      if (res.body && res.body.success === false) {
        return refreshAccessToken(req, next, authService);
      } else {
        return next(req);
      }
    }),
    catchError((error) => {
      return throwError(() => error);
    })
  );
};

function refreshAccessToken(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  return authService.refreshAccessToken().pipe(
    switchMap((res) => {
      const newRequest = req.clone({
        setHeaders: {
          authorization: `${res.accessToken}`
        }
      });

      return next(newRequest);
    }),
    catchError((refreshError) => {
      console.error('Fehler beim Token-Refresh:', refreshError);
      return throwError(() => refreshError);
    })
  );
}
