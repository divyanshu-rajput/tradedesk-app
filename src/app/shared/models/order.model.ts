export type OrderType = 'market' | 'limit' | 'stop-loss';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'simulated';

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  qty: number;
  limitPrice?: number;
  stopPrice?: number;
  status: OrderStatus;
  createdAt: number;
}
