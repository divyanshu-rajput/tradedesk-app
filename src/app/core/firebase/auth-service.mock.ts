import { signal } from '@angular/core';

export class MockAuthService {
  displayLabel = signal('Guest session');
  isAnonymous = signal(true);
  user = signal({ uid: 'guest-uid', isAnonymous: true });
  signInAsGuest = jest.fn().mockResolvedValue({ uid: 'guest-uid', isAnonymous: true });
  signInWithGoogle = jest.fn().mockResolvedValue(undefined);
  signOut = jest.fn().mockResolvedValue(undefined);
  waitForAuthResolution = jest.fn().mockResolvedValue({ uid: 'guest-uid', isAnonymous: true });
  prepareForLogin = jest.fn().mockResolvedValue({ uid: 'guest-uid', isAnonymous: true });
  hasActiveAppSession = jest.fn().mockReturnValue(false);
  markAppSessionActive = jest.fn();
}
