import { Injectable, inject } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';

import type { Holding } from '../../shared/models/holding.model';
import { AuthService } from './auth.service';
import type { PortfolioSnapshotDoc } from './portfolio-snapshot.model';

@Injectable({ providedIn: 'root' })
export class PortfolioRepository {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);

  async loadSnapshot(): Promise<{ cash: number; holdings: Holding[] } | null> {
    const uid = await this.requireUid();
    const ref = doc(this.firestore, `users/${uid}/portfolio/snapshot`);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data() as PortfolioSnapshotDoc;
    return { cash: data.cash, holdings: data.holdings };
  }

  async saveSnapshot(cash: number, holdings: Holding[]): Promise<void> {
    const uid = await this.requireUid();
    const ref = doc(this.firestore, `users/${uid}/portfolio/snapshot`);
    const payload: PortfolioSnapshotDoc = {
      cash,
      holdings,
      updatedAt: Date.now(),
    };
    await setDoc(ref, payload, { merge: true });
  }

  private async requireUid(): Promise<string> {
    const user = await this.authService.waitForAuthResolution();
    if (!user) {
      throw new Error('Not signed in');
    }
    return user.uid;
  }
}
