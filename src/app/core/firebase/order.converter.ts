import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from '@angular/fire/firestore';

import type { Order, OrderSide, OrderStatus, OrderType } from '../../shared/models/order.model';
import { isFiniteNumber } from '../../shared/utils/finite.util';

function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
  ) as T;
}

function isOrderSide(value: unknown): value is OrderSide {
  return value === 'buy' || value === 'sell';
}

function isOrderType(value: unknown): value is OrderType {
  return value === 'market' || value === 'limit' || value === 'stop-loss';
}

function isOrderStatus(value: unknown): value is OrderStatus {
  return value === 'simulated';
}

/** Returns null when Firestore data is missing required order fields. */
export function parseOrderDoc(id: string, data: Record<string, unknown>): Order | null {
  const { symbol, side, type, qty, status, createdAt } = data;
  if (
    typeof symbol !== 'string' ||
    !isOrderSide(side) ||
    !isOrderType(type) ||
    !isFiniteNumber(qty) ||
    !isOrderStatus(status) ||
    !isFiniteNumber(createdAt)
  ) {
    return null;
  }

  const order: Order = {
    id,
    symbol,
    side,
    type,
    qty,
    status,
    createdAt,
  };

  if (isFiniteNumber(data['limitPrice'])) {
    order.limitPrice = data['limitPrice'];
  }
  if (isFiniteNumber(data['stopPrice'])) {
    order.stopPrice = data['stopPrice'];
  }

  return order;
}

export const orderConverter: FirestoreDataConverter<Order> = {
  toFirestore(order: WithFieldValue<Order>) {
    return stripUndefined(order as Record<string, unknown>);
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Order {
    const parsed = parseOrderDoc(snapshot.id, snapshot.data(options) as Record<string, unknown>);
    if (!parsed) {
      throw new Error(`Invalid order document: ${snapshot.id}`);
    }
    return parsed;
  },
};
