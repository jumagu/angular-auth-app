import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStatus } from '../enums';

import { AuthService } from '../services/auth.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  /* const url: string = state.url;
  localStorage.setItem('url', url); */

  const { authStatus } = inject(AuthService);

  if (authStatus() === AuthStatus.authenticated) return true;

  // if (authStatus() === AuthStatus.checking) return false;

  const router = inject(Router);

  router.navigateByUrl('/auth/login');

  return false;
};
