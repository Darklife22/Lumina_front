// src/app/core/role.guard.ts  (ya confía en el rol que vino del backend)
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from './user-types';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data?.['roles'] as Role[] | undefined;
  if (!roles || roles.length === 0) return true;
  if (auth.isLoggedIn() && auth.hasRole(roles)) return true;
  return router.parseUrl('/forbidden') as UrlTree;
};
