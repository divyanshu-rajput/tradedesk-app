import { getApps, initializeApp } from 'firebase/app';
import { getAuth, getRedirectResult, signOut } from 'firebase/auth';

import { firebaseConfig } from '../../../environments/firebase.config';
import { APP_SESSION_KEY, AUTH_ERROR_KEY, PENDING_GOOGLE_KEY } from './auth.constants';

function authErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Google sign-in failed. Please try again.';
}

/**
 * Must run before Angular bootstraps — any authState listener (e.g. AuthService) breaks
 * getRedirectResult and Google redirect sign-in silently fails.
 */
export async function finishGoogleRedirectSignInBeforeBootstrap(): Promise<void> {
  if (typeof sessionStorage === 'undefined') {
    return;
  }

  const pendingGoogle = sessionStorage.getItem(PENDING_GOOGLE_KEY) === '1';
  if (!pendingGoogle) {
    return;
  }

  const app = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);
  const auth = getAuth(app);

  try {
    await getRedirectResult(auth);
    await auth.authStateReady();

    const user = auth.currentUser;
    if (user && !user.isAnonymous) {
      sessionStorage.setItem(APP_SESSION_KEY, '1');
      return;
    }

    if (user?.isAnonymous) {
      await signOut(auth);
    }

    sessionStorage.setItem(
      AUTH_ERROR_KEY,
      'Google sign-in did not complete. Try again, or use Continue as guest.',
    );
  } catch (error) {
    console.error('Google redirect sign-in failed', error);
    sessionStorage.setItem(AUTH_ERROR_KEY, authErrorMessage(error));
  } finally {
    sessionStorage.removeItem(PENDING_GOOGLE_KEY);
  }
}
