import { computed, Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  authState,
  browserSessionPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from '@angular/fire/auth';

import { environment } from '../../../environments/environment';
import { APP_SESSION_KEY, PENDING_GOOGLE_KEY } from './auth.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);

  readonly user = toSignal(authState(this.auth), { initialValue: null as User | null });
  readonly isAnonymous = computed(() => this.user()?.isAnonymous ?? true);
  readonly displayLabel = computed(() => {
    const user = this.user();
    if (!user) {
      return 'Signed out';
    }
    if (user.isAnonymous) {
      return 'Guest session';
    }
    return user.displayName ?? user.email ?? 'Signed in';
  });

  async waitForAuthResolution(): Promise<User | null> {
    await this.auth.authStateReady();
    return this.auth.currentUser;
  }

  /** Clears stale guest sessions left in the browser from earlier visits. */
  async prepareForLogin(): Promise<User | null> {
    sessionStorage.removeItem(PENDING_GOOGLE_KEY);
    await this.auth.authStateReady();

    const user = this.auth.currentUser;
    if (user?.isAnonymous && !this.hasActiveAppSession()) {
      await signOut(this.auth);
      await this.auth.authStateReady();
      return null;
    }

    return user;
  }

  hasActiveAppSession(): boolean {
    return sessionStorage.getItem(APP_SESSION_KEY) === '1';
  }

  markAppSessionActive(): void {
    sessionStorage.setItem(APP_SESSION_KEY, '1');
  }

  async signOut(): Promise<void> {
    sessionStorage.removeItem(APP_SESSION_KEY);
    await signOut(this.auth);
  }

  async signInAsGuest(): Promise<User> {
    await setPersistence(this.auth, browserSessionPersistence);

    if (this.auth.currentUser?.isAnonymous) {
      return this.auth.currentUser;
    }

    if (this.auth.currentUser) {
      await signOut(this.auth);
    }

    const credential = await signInAnonymously(this.auth);
    return credential.user;
  }

  async signInWithGoogle(): Promise<void> {
    const current = await this.waitForAuthResolution();
    if (current && !current.isAnonymous) {
      this.markAppSessionActive();
      return;
    }

    const provider = new GoogleAuthProvider();

    if (current) {
      sessionStorage.removeItem(APP_SESSION_KEY);
      await signOut(this.auth);
      await this.auth.authStateReady();
    }

    if (environment.useEmulators) {
      sessionStorage.setItem(PENDING_GOOGLE_KEY, '1');
      await signInWithRedirect(this.auth, provider);
      return;
    }

    try {
      await signInWithPopup(this.auth, provider);
      this.markAppSessionActive();
    } catch (error) {
      if (this.isPopupBlocked(error)) {
        sessionStorage.setItem(PENDING_GOOGLE_KEY, '1');
        await signInWithRedirect(this.auth, provider);
        return;
      }
      throw error;
    }
  }

  private isPopupBlocked(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'auth/popup-blocked'
    );
  }
}
