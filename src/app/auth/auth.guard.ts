import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';

// export const isUserAuthenticated: CanActivateFn = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.isLoggedIn()) {
//     return true;
//   } else {
//     return router.parseUrl('/login');
//   }
// };

export const isUserAuthenticated: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Authentifizierungsstatus überprüfen
  const isAuthenticated = await authService.checkAuthStatus();

  if (isAuthenticated) {
    return true;
  } else {
    return router.parseUrl('/login');
  }
};
