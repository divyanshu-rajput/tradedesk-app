import { Injectable, inject } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from '@angular/fire/firestore';

import type { Order } from '../../shared/models/order.model';
import { AuthService } from './auth.service';
import { orderConverter, parseOrderDoc } from './order.converter';

@Injectable({ providedIn: 'root' })
export class OrdersRepository {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);

  async placeOrder(order: Order): Promise<void> {
    const uid = await this.requireUid();
    const ref = doc(this.firestore, `users/${uid}/orders/${order.id}`).withConverter(
      orderConverter,
    );
    await setDoc(ref, order);
  }

  async loadOrders(max = 1_000): Promise<Order[]> {
    const uid = await this.requireUid();
    const ordersRef = collection(this.firestore, `users/${uid}/orders`);
    const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'), limit(max));
    const snapshot = await getDocs(ordersQuery);
    return snapshot.docs
      .map((document) => parseOrderDoc(document.id, document.data() as Record<string, unknown>))
      .filter((order): order is Order => order !== null);
  }

  private async requireUid(): Promise<string> {
    const user = await this.authService.waitForAuthResolution();
    if (!user) {
      throw new Error('Not signed in');
    }
    return user.uid;
  }
}
