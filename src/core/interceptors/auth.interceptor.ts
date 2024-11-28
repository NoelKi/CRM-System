import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../../app/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private _authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        accept: 'application/json',
        authorization: `${this._authService.loadItemFromStorage('accessToken')}`
      }
    });

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('401 Error: user has no access authorization ', error.message);
          this._authService.refreshAccessToken();
          // this._authService.destroyUser();
        }

        return throwError(() => error);
      })
    );
  }
}
