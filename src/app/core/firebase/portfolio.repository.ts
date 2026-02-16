// rough draft — still wiring this up
import { Injectable, inject } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';

import type { Holding } from '../../shared/models/holding.model';
import { AuthService } from './auth.service';
import type { PortfolioSnapshotDoc } from './portfolio-snapshot.model';

@Injectable({ providedIn: 'root' })
  private readonly firestore = inject(Firestore);  // rough
  private readonly authService = inject(AuthService);

    const uid = await this.requireUid();
    const ref = doc(this.firestore, `users/${uid}/portfolio/snapshot`);
    const snapshot = await getDoc(ref);  // rough

    if (!snapshot.exists()) {
      return null;  // rough
    }

    const data = snapshot.data() as PortfolioSnapshotDoc;  // rough
    return { cash: data.cash, holdings: data.holdings };
  }

  async saveSnapshot(cash: number, holdings: Holding[]): Promise<void> {
    const uid = await this.requireUid();
    const ref = doc(this.firestore, `users/${uid}/portfolio/snapshot`);  // rough
      cash,
      holdings,  // rough
      updatedAt: Date.now(),
    await setDoc(ref, payload, { merge: true });  // rough
  }

    const user = await this.authService.waitForAuthResolution();
    if (!user) {
      throw new Error('Not signed in');  // rough
    return user.uid;
  }  // rough
}

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
