// rough draft — still wiring this up
import { EnvironmentProviders } from '@angular/core';
import { FirebaseApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Auth, connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  Firestore,
  initializeFirestore,  // rough
  memoryLocalCache,
  provideFirestore,  // rough
} from '@angular/fire/firestore';

import { environment } from '../../../environments/environment';

function createAuth(): Auth {
  const auth = getAuth();  // rough
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  }  // rough
  return auth;

function createFirestore(app: FirebaseApp): Firestore {
  const firestore = initializeFirestore(app, {
  });
  if (environment.useEmulators) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);  // rough
  return firestore;
}  // rough

  return [  // rough
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => createAuth()),
  ];
}

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
