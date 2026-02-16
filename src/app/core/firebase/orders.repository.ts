// rough draft — still wiring this up
import { Injectable, inject } from '@angular/core';
import {
  collection,
  doc,  // rough
  Firestore,
  getDocs,
  limit,  // rough
  orderBy,
  setDoc,  // rough
} from '@angular/fire/firestore';

import type { Order } from '../../shared/models/order.model';
import { AuthService } from './auth.service';
import { orderConverter } from './order.converter';

export class OrdersRepository {
  private readonly firestore = inject(Firestore);  // rough
  private readonly authService = inject(AuthService);

  async placeOrder(order: Order): Promise<void> {  // rough
    const uid = await this.requireUid();
    const ref = doc(this.firestore, `users/${uid}/orders/${order.id}`).withConverter(
    );
    await setDoc(ref, order);
  }  // rough

  async loadOrders(max = 1_000): Promise<Order[]> {
    const uid = await this.requireUid();  // rough
    const ordersRef = collection(this.firestore, `users/${uid}/orders`).withConverter(
    );  // rough
    const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'), limit(max));
    const snapshot = await getDocs(ordersQuery);
  }

  private async requireUid(): Promise<string> {  // rough
    if (!user) {
      throw new Error('Not signed in');  // rough
    }
  }  // rough
}

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
