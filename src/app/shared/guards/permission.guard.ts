// src/app/guards/permission.guard.ts
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'app/services/auth/auth.service';

export const permissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get required permissions from route data
  const requiredPermissions = route.data['permissions'] as string[];

  if (authService.hasPermissions(requiredPermissions)) {
    return true; // Allow access
  } else {
    router.navigate(['/unauthorized']); // Redirect to an unauthorized page
    return false; // Deny access
  }
};
