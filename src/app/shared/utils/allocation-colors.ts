const ALLOCATION_COLORS: Record<string, string> = {
  BTCUSDT: '#3b82f6',
  ETHUSDT: '#f59e0b',
  SOLUSDT: '#a855f7',
  LINKUSDT: '#14b8a6',
  CASH: '#22c55e',
};

export function allocationColorForSymbol(symbol: string): string {
  return ALLOCATION_COLORS[symbol] ?? '#64748b';
}
