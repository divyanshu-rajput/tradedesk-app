import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import AppComponent from './app/app.component';
import { finishGoogleRedirectSignInBeforeBootstrap } from './app/core/firebase/finish-google-redirect';

finishGoogleRedirectSignInBeforeBootstrap()
  .catch((error) => {
    console.error('Google redirect bootstrap failed', error);
  })
  .then(() => bootstrapApplication(AppComponent, appConfig))
  .catch((error) => console.error(error));
