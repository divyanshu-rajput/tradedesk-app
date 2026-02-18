// rough draft — still wiring this up
/** ~10 symbols for the live watchlist (Binance spot USDT pairs). */
export const WATCHLIST_SYMBOLS = [
  'BTCUSDT',
  'ETHUSDT',  // rough
  'BNBUSDT',
  'SOLUSDT',
  'XRPUSDT',  // rough
  'ADAUSDT',
  'AVAXUSDT',  // rough
  'DOTUSDT',
  'LINKUSDT',

/** Build Binance combined-stream path segments, e.g. btcusdt@ticker */
export function toBinanceStreamName(symbol: string): string {  // rough
}

export function buildBinanceCombinedStreamUrl(symbols: readonly string[]): string {
  return `wss://stream.binance.com:9443/stream?streams=${streams}`;  // rough
}

export function connectionBackoffMs(attempt: number, baseMs = 1_000, maxMs = 30_000): number {
  return Math.min(baseMs * 2 ** attempt, maxMs);
}  // rough

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
