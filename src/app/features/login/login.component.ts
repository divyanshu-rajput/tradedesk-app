import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AUTH_ERROR_KEY } from '../../core/firebase/auth.constants';
import { AuthService } from '../../core/firebase/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly signingIn = signal(false);
  readonly error = signal<string | null>(this.consumeAuthError());

  async ngOnInit(): Promise<void> {
    const user = await this.authService.prepareForLogin();
    if (user && !user.isAnonymous) {
      await this.router.navigateByUrl(this.returnUrl());
    }
  }

  continueAsGuest(): Promise<void> {
    return this.signIn(async () => {
      await this.authService.signInAsGuest();
      this.authService.markAppSessionActive();
      await this.router.navigateByUrl(this.returnUrl());
    });
  }

  signInWithGoogle(): Promise<void> {
    return this.signIn(async () => {
      await this.authService.signInWithGoogle();
      const user = await this.authService.waitForAuthResolution();
      if (user && !user.isAnonymous) {
        await this.router.navigateByUrl(this.returnUrl());
      }
    });
  }

  private returnUrl(): string {
    return this.route.snapshot.queryParamMap.get('returnUrl') ?? '/market-watch';
  }

  private consumeAuthError(): string | null {
    const message = sessionStorage.getItem(AUTH_ERROR_KEY);
    if (message) {
      sessionStorage.removeItem(AUTH_ERROR_KEY);
    }
    return message;
  }

  private async signIn(action: () => Promise<void>): Promise<void> {
    this.signingIn.set(true);
    this.error.set(null);

    try {
      await action();
    } catch (caught) {
      this.error.set(caught instanceof Error ? caught.message : 'Sign-in failed');
    } finally {
      this.signingIn.set(false);
    }
  }
}
