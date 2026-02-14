import { createEnvironment } from './environment.shared';

/** Demo feed + Firebase emulators — used by Playwright in CI. */
export const environment = createEnvironment({
  production: false,
  feedMode: 'demo',
  useEmulators: true,
});
