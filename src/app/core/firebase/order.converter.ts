import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from '@angular/fire/firestore';

import type { Order } from '../../shared/models/order.model';

function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
  ) as T;
}

export const orderConverter: FirestoreDataConverter<Order> = {
  toFirestore(order: WithFieldValue<Order>) {
    return stripUndefined(order as Record<string, unknown>);
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Order {
    return snapshot.data(options) as Order;
  },
};
