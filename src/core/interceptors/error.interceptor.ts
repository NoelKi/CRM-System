import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = '';

      // if (error.error instanceof ErrorEvent) {
      //   console.error('An error occureed:', error.error.message);
      //   errorMessage = 'An error occureed:' + error.error.message;
      // } else {
      //   console.error('Backend returned code ' + error.status, 'Messsage: ' + error.message);
      //   errorMessage = 'Backened returned code ' + error.status + 'Message ' + error.message;
      // }
      // if (error.status === 401) {
      //   errorMessage = 'Not Autentificated';
      // } else if (error.status === 400) {
      //   errorMessage = 'An Error Occured';
      // }
      // alert(error.message);
      return throwError(() => error);
      // return of();
    })
  );
};
