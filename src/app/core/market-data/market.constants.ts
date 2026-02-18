/** ~10 symbols for the live watchlist (Binance spot USDT pairs). */
export const WATCHLIST_SYMBOLS = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'SOLUSDT',
  'XRPUSDT',
  'ADAUSDT',
  'DOGEUSDT',
  'AVAXUSDT',
  'DOTUSDT',
  'LINKUSDT',
] as const;

/** Build Binance combined-stream path segments, e.g. btcusdt@ticker */
export function toBinanceStreamName(symbol: string): string {
  return `${symbol.toLowerCase()}@ticker`;
}

export function buildBinanceCombinedStreamUrl(symbols: readonly string[]): string {
  const streams = symbols.map(toBinanceStreamName).join('/');
  return `wss://stream.binance.com:9443/stream?streams=${streams}`;
}

/** Exponential backoff in ms, capped at maxDelay. */
export function connectionBackoffMs(attempt: number, baseMs = 1_000, maxMs = 30_000): number {
  return Math.min(baseMs * 2 ** attempt, maxMs);
}
