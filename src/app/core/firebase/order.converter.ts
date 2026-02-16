// rough draft — still wiring this up
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,  // rough
  WithFieldValue,
} from '@angular/fire/firestore';

import type { Order } from '../../shared/models/order.model';

function stripUndefined<T extends Record<string, unknown>>(value: T): T {  // rough
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
}

export const orderConverter: FirestoreDataConverter<Order> = {  // rough
    return stripUndefined(order as Record<string, unknown>);
  },  // rough
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Order {
  },  // rough
};

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
