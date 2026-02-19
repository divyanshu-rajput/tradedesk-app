import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import type { User } from '@angular/fire/auth';

import { AuthService } from '../firebase/auth.service';

function canAccessApp(user: User | null, authService: AuthService): boolean {
  if (!user) {
    return false;
  }
  // Guest must click through the login page this tab session.
  if (user.isAnonymous) {
    return authService.hasActiveAppSession();
  }
  // Google sign-in is complete once Firebase has a non-anonymous user.
  return true;
}

/** Blocks app routes until the user completes the login page this session. */
export const authGuard: CanActivateFn = async (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = await authService.waitForAuthResolution();

  if (canAccessApp(user, authService)) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

/** Sends users who already completed login away from the login page. */
export const redirectIfAuthenticatedGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.waitForAuthResolution().then((user) => {
    if (!canAccessApp(user, authService)) {
      return true;
    }

    const returnUrl = route.queryParamMap.get('returnUrl') ?? '/market-watch';
    return router.parseUrl(returnUrl.startsWith('/') ? returnUrl : '/market-watch');
  });
};
