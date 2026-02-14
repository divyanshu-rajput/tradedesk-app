import { firebaseConfig } from './firebase.config';

export type FeedMode = 'live' | 'demo';

export interface Environment {
  production: boolean;
  feedMode: FeedMode;
  useEmulators: boolean;
  firebase: typeof firebaseConfig;
}

export function createEnvironment(overrides: Partial<Environment> = {}): Environment {
  return {
    production: true,
    feedMode: 'live',
    useEmulators: false,
    firebase: firebaseConfig,
    ...overrides,
  };
}
