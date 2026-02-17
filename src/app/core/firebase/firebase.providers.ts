import { EnvironmentProviders } from '@angular/core';
import { FirebaseApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Auth, connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  Firestore,
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
  provideFirestore,
} from '@angular/fire/firestore';

import { environment } from '../../../environments/environment';

function createAuth(): Auth {
  const auth = getAuth();
  if (environment.useEmulators) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  }
  return auth;
}

function createFirestore(app: FirebaseApp): Firestore {
  const firestore = initializeFirestore(app, {
    localCache: environment.useEmulators ? memoryLocalCache() : persistentLocalCache(),
  });
  if (environment.useEmulators) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  }
  return firestore;
}

export function provideFirebaseProviders(): EnvironmentProviders[] {
  return [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => createAuth()),
    provideFirestore((injector) => createFirestore(injector.get(FirebaseApp))),
  ];
}
